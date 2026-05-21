// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";
import { Pausable } from "@openzeppelin/contracts/utils/Pausable.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title KennyTokenSale
 * @author FTH Trading
 * @notice Atomic token-sale contract for KENNY (ERC-20 on Polygon).
 *
 * Architecture:
 *   The KENNY token's full supply (100 M) is already minted and held by the
 *   treasury wallet.  This contract does NOT mint new tokens.  Instead, the
 *   treasury pre-approves this contract to spend KENNY on its behalf.  When a
 *   buyer pays (POL or stablecoins), the contract atomically:
 *     1. Pulls payment from the buyer → treasury.
 *     2. Pulls KENNY from the treasury → buyer.
 *
 * Payment methods:
 *   - Native POL via `buyWithPOL()`.
 *   - Any approved stablecoin via `buyWithStablecoin(token, amount)`.
 *
 * Sale controls:
 *   - Global sale cap (max KENNY available for sale).
 *   - Per-wallet cap (optional).
 *   - Pause / unpause.
 *   - Admin-managed price, stablecoin whitelist, POL price oracle.
 *
 * Roles:
 *   DEFAULT_ADMIN_ROLE — upgrade treasury, emergency withdrawals.
 *   SALE_ADMIN_ROLE   — set prices, caps, stablecoins, pause.
 *
 * Events:
 *   Every purchase emits `TokensPurchased` with full provenance for indexing.
 */
contract KennyTokenSale is AccessControl, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ─────────────────────────────────────────────────────────────────────────
    // Roles
    // ─────────────────────────────────────────────────────────────────────────

    bytes32 public constant SALE_ADMIN_ROLE = keccak256("SALE_ADMIN_ROLE");

    // ─────────────────────────────────────────────────────────────────────────
    // Immutable state
    // ─────────────────────────────────────────────────────────────────────────

    /// @notice The KENNY ERC-20 token.
    IERC20 public immutable kennyToken;

    // ─────────────────────────────────────────────────────────────────────────
    // Configurable state
    // ─────────────────────────────────────────────────────────────────────────

    /// @notice Treasury wallet that holds KENNY and receives payments.
    address public treasury;

    /**
     * @notice Number of KENNY-wei the buyer receives per 1e18 units of USD.
     *         At $0.01 per KENNY → 100 KENNY per $1 → kennyPerUsd = 100e18.
     */
    uint256 public kennyPerUsd;

    /**
     * @notice POL price expressed in 18-decimal USD.
     *         e.g. $0.45 → polPriceUsd = 0.45e18 = 450000000000000000.
     */
    uint256 public polPriceUsd;

    /// @notice Maximum KENNY-wei available for sale (0 = unlimited).
    uint256 public saleCap;

    /// @notice Maximum KENNY-wei any single wallet may purchase (0 = unlimited).
    uint256 public perWalletCap;

    // ─────────────────────────────────────────────────────────────────────────
    // Accounting
    // ─────────────────────────────────────────────────────────────────────────

    /// @notice Total KENNY-wei sold through this contract.
    uint256 public totalSold;

    /// @notice Per-wallet purchase tracking (wallet → KENNY-wei purchased).
    mapping(address => uint256) public purchased;

    // ─────────────────────────────────────────────────────────────────────────
    // Stablecoin registry
    // ─────────────────────────────────────────────────────────────────────────

    /// @notice Whether a token is whitelisted for purchases.
    mapping(address => bool) public acceptedStablecoin;

    /// @notice Decimals of each accepted stablecoin.
    mapping(address => uint8) public stablecoinDecimals;

    // ─────────────────────────────────────────────────────────────────────────
    // Events
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Emitted on every successful purchase.
     * @param buyer         Wallet that received KENNY.
     * @param paymentToken  ERC-20 used for payment (address(0) for native POL).
     * @param paymentAmount Raw payment amount in the payment token's decimals.
     * @param kennyAmount   KENNY-wei delivered to the buyer.
     * @param timestamp     Block timestamp.
     */
    event TokensPurchased(
        address indexed buyer,
        address indexed paymentToken,
        uint256 paymentAmount,
        uint256 kennyAmount,
        uint256 timestamp
    );

    event SaleCapUpdated(uint256 newCap, address indexed operator);
    event PerWalletCapUpdated(uint256 newCap, address indexed operator);
    event KennyPriceUpdated(uint256 newKennyPerUsd, address indexed operator);
    event PolPriceUpdated(uint256 newPolPriceUsd, address indexed operator);
    event StablecoinUpdated(address indexed token, bool accepted, uint8 decimals, address indexed operator);
    event TreasuryUpdated(address indexed previousTreasury, address indexed newTreasury, address indexed operator);
    event FundsWithdrawn(address indexed token, uint256 amount, address indexed to, address indexed operator);

    // ─────────────────────────────────────────────────────────────────────────
    // Errors
    // ─────────────────────────────────────────────────────────────────────────

    error ZeroAddress();
    error ZeroAmount();
    error NotAcceptedStablecoin(address token);
    error SaleCapExceeded(uint256 requested, uint256 available);
    error WalletCapExceeded(uint256 requested, uint256 available);
    error POLTransferFailed();
    error ZeroKennyOutput();

    // ─────────────────────────────────────────────────────────────────────────
    // Constructor
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @param _kennyToken  Address of the KENNY ERC-20 contract.
     * @param _treasury    Treasury wallet (holds KENNY, receives payments).
     * @param _admin       Initial admin and sale-admin.
     * @param _kennyPerUsd KENNY-wei per 1e18 USD-wei (e.g. 100e18 for $0.01).
     * @param _polPriceUsd POL price in 18-decimal USD (e.g. 0.45e18).
     */
    constructor(
        address _kennyToken,
        address _treasury,
        address _admin,
        uint256 _kennyPerUsd,
        uint256 _polPriceUsd
    ) {
        if (_kennyToken == address(0) || _treasury == address(0) || _admin == address(0))
            revert ZeroAddress();
        if (_kennyPerUsd == 0 || _polPriceUsd == 0) revert ZeroAmount();

        kennyToken = IERC20(_kennyToken);
        treasury = _treasury;
        kennyPerUsd = _kennyPerUsd;
        polPriceUsd = _polPriceUsd;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(SALE_ADMIN_ROLE, msg.sender);
        _grantRole(SALE_ADMIN_ROLE, _admin);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Receive — accept direct POL (for emergency withdrawal scenarios)
    // ─────────────────────────────────────────────────────────────────────────

    receive() external payable {}

    // ─────────────────────────────────────────────────────────────────────────
    // Purchase: stablecoin
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Buy KENNY with a whitelisted stablecoin.
     *         Buyer must `approve(saleContract, amount)` on the stablecoin
     *         before calling this.
     *
     * @param stablecoin  Address of the payment token (USDC / USDT / DAI).
     * @param paymentAmount  Amount of stablecoin to spend (in the token's
     *                       native decimals — e.g. 1 USDC = 1_000_000).
     */
    function buyWithStablecoin(
        address stablecoin,
        uint256 paymentAmount
    ) external nonReentrant whenNotPaused {
        if (!acceptedStablecoin[stablecoin]) revert NotAcceptedStablecoin(stablecoin);
        if (paymentAmount == 0) revert ZeroAmount();

        // Normalise payment to 18-decimal USD representation
        uint8 dec = stablecoinDecimals[stablecoin];
        uint256 usdAmount18 = paymentAmount * (10 ** (18 - dec));

        // Calculate KENNY output
        uint256 kennyAmount = (usdAmount18 * kennyPerUsd) / 1e18;
        if (kennyAmount == 0) revert ZeroKennyOutput();

        _enforceCaps(msg.sender, kennyAmount);

        // ── Atomic settlement ────────────────────────────────────────────
        // 1. Pull stablecoin from buyer → treasury
        IERC20(stablecoin).safeTransferFrom(msg.sender, treasury, paymentAmount);

        // 2. Pull KENNY from treasury → buyer
        kennyToken.safeTransferFrom(treasury, msg.sender, kennyAmount);

        // ── Accounting ───────────────────────────────────────────────────
        totalSold += kennyAmount;
        purchased[msg.sender] += kennyAmount;

        emit TokensPurchased(msg.sender, stablecoin, paymentAmount, kennyAmount, block.timestamp);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Purchase: native POL
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Buy KENNY by sending native POL with this call.
     *         The POL is forwarded to the treasury, and the equivalent
     *         KENNY amount is transferred from treasury to the caller.
     */
    function buyWithPOL() external payable nonReentrant whenNotPaused {
        if (msg.value == 0) revert ZeroAmount();

        // POL → USD: msg.value (18 dec) * polPriceUsd (18 dec) / 1e18
        uint256 usdAmount18 = (msg.value * polPriceUsd) / 1e18;

        // USD → KENNY
        uint256 kennyAmount = (usdAmount18 * kennyPerUsd) / 1e18;
        if (kennyAmount == 0) revert ZeroKennyOutput();

        _enforceCaps(msg.sender, kennyAmount);

        // ── Atomic settlement ────────────────────────────────────────────
        // 1. Forward POL to treasury
        (bool sent, ) = treasury.call{value: msg.value}("");
        if (!sent) revert POLTransferFailed();

        // 2. Pull KENNY from treasury → buyer
        kennyToken.safeTransferFrom(treasury, msg.sender, kennyAmount);

        // ── Accounting ───────────────────────────────────────────────────
        totalSold += kennyAmount;
        purchased[msg.sender] += kennyAmount;

        emit TokensPurchased(msg.sender, address(0), msg.value, kennyAmount, block.timestamp);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Internal helpers
    // ─────────────────────────────────────────────────────────────────────────

    function _enforceCaps(address buyer, uint256 kennyAmount) internal view {
        if (saleCap > 0 && totalSold + kennyAmount > saleCap) {
            revert SaleCapExceeded(kennyAmount, saleCap - totalSold);
        }
        if (perWalletCap > 0 && purchased[buyer] + kennyAmount > perWalletCap) {
            revert WalletCapExceeded(kennyAmount, perWalletCap - purchased[buyer]);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Admin: pause
    // ─────────────────────────────────────────────────────────────────────────

    function pause() external onlyRole(SALE_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(SALE_ADMIN_ROLE) {
        _unpause();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Admin: pricing
    // ─────────────────────────────────────────────────────────────────────────

    function setKennyPerUsd(uint256 _kennyPerUsd) external onlyRole(SALE_ADMIN_ROLE) {
        if (_kennyPerUsd == 0) revert ZeroAmount();
        kennyPerUsd = _kennyPerUsd;
        emit KennyPriceUpdated(_kennyPerUsd, msg.sender);
    }

    function setPolPriceUsd(uint256 _polPriceUsd) external onlyRole(SALE_ADMIN_ROLE) {
        if (_polPriceUsd == 0) revert ZeroAmount();
        polPriceUsd = _polPriceUsd;
        emit PolPriceUpdated(_polPriceUsd, msg.sender);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Admin: caps
    // ─────────────────────────────────────────────────────────────────────────

    function setSaleCap(uint256 _saleCap) external onlyRole(SALE_ADMIN_ROLE) {
        saleCap = _saleCap;
        emit SaleCapUpdated(_saleCap, msg.sender);
    }

    function setPerWalletCap(uint256 _perWalletCap) external onlyRole(SALE_ADMIN_ROLE) {
        perWalletCap = _perWalletCap;
        emit PerWalletCapUpdated(_perWalletCap, msg.sender);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Admin: stablecoin whitelist
    // ─────────────────────────────────────────────────────────────────────────

    function setAcceptedStablecoin(
        address token,
        bool accepted,
        uint8 decimals
    ) external onlyRole(SALE_ADMIN_ROLE) {
        if (token == address(0)) revert ZeroAddress();
        acceptedStablecoin[token] = accepted;
        stablecoinDecimals[token] = decimals;
        emit StablecoinUpdated(token, accepted, decimals, msg.sender);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Admin: treasury
    // ─────────────────────────────────────────────────────────────────────────

    function setTreasury(address _treasury) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (_treasury == address(0)) revert ZeroAddress();
        address previous = treasury;
        treasury = _treasury;
        emit TreasuryUpdated(previous, _treasury, msg.sender);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Admin: emergency withdrawals
    // ─────────────────────────────────────────────────────────────────────────

    function withdrawToken(
        address token,
        uint256 amount,
        address to
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (to == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();
        IERC20(token).safeTransfer(to, amount);
        emit FundsWithdrawn(token, amount, to, msg.sender);
    }

    function withdrawPOL(uint256 amount, address to) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (to == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();
        (bool sent, ) = to.call{value: amount}("");
        if (!sent) revert POLTransferFailed();
        emit FundsWithdrawn(address(0), amount, to, msg.sender);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Views: quotation
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Preview how many KENNY-wei a stablecoin payment would yield.
     * @param stablecoin    The stablecoin address.
     * @param paymentAmount Amount in the stablecoin's native decimals.
     * @return kennyAmount  KENNY-wei the buyer would receive.
     */
    function quoteStablecoin(
        address stablecoin,
        uint256 paymentAmount
    ) external view returns (uint256 kennyAmount) {
        uint8 dec = stablecoinDecimals[stablecoin];
        uint256 usdAmount18 = paymentAmount * (10 ** (18 - dec));
        kennyAmount = (usdAmount18 * kennyPerUsd) / 1e18;
    }

    /**
     * @notice Preview how many KENNY-wei a POL payment would yield.
     * @param polAmount Amount of POL in wei.
     * @return kennyAmount KENNY-wei the buyer would receive.
     */
    function quotePOL(uint256 polAmount) external view returns (uint256 kennyAmount) {
        uint256 usdAmount18 = (polAmount * polPriceUsd) / 1e18;
        kennyAmount = (usdAmount18 * kennyPerUsd) / 1e18;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Views: sale status
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Returns KENNY-wei still available in the sale cap.
     *         Returns type(uint256).max when no cap is set.
     */
    function remainingAllocation() external view returns (uint256) {
        if (saleCap == 0) return type(uint256).max;
        return saleCap > totalSold ? saleCap - totalSold : 0;
    }

    /**
     * @notice Returns the remaining per-wallet allocation for `buyer`.
     *         Returns type(uint256).max when no per-wallet cap is set.
     */
    function remainingWalletAllocation(address buyer) external view returns (uint256) {
        if (perWalletCap == 0) return type(uint256).max;
        return perWalletCap > purchased[buyer] ? perWalletCap - purchased[buyer] : 0;
    }

    /**
     * @notice Returns true if the sale is active (not paused and has allocation).
     */
    function saleActive() external view returns (bool) {
        if (paused()) return false;
        if (saleCap > 0 && totalSold >= saleCap) return false;
        return true;
    }

    /**
     * @notice Returns the KENNY price in USD (18 decimals).
     *         i.e. 1 KENNY costs this many USD-wei.
     */
    function pricePerKennyUsd() external view returns (uint256) {
        // kennyPerUsd = KENNY-wei per 1e18 USD-wei
        // price = 1e18 * 1e18 / kennyPerUsd (in USD-wei per 1 KENNY)
        return (1e36) / kennyPerUsd;
    }
}
