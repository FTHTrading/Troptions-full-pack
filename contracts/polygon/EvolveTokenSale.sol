// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";
import { Pausable } from "@openzeppelin/contracts/utils/Pausable.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title EvolveTokenSale
 * @author The Financial Evolution
 * @notice Atomic token-sale contract for EVL (ERC-20 on Polygon).
 *         Fundraising engine for The Financial Evolution school.
 *
 * Architecture:
 *   The school treasury holds EVL (up to 250M initial allocation).
 *   This contract does NOT mint new tokens.  Instead, the treasury
 *   pre-approves this contract to spend EVL on its behalf.  When a
 *   buyer pays (POL or stablecoins), the contract atomically:
 *     1. Pulls payment from the buyer → treasury.
 *     2. Pulls EVL from the treasury → buyer.
 *
 * Payment methods:
 *   - Native POL via `buyWithPOL()`.
 *   - Any approved stablecoin via `buyWithStablecoin(token, amount)`.
 *
 * Sale controls:
 *   - Global sale cap (max EVL available for sale).
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
contract EvolveTokenSale is AccessControl, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ─────────────────────────────────────────────────────────────────────────
    // Roles
    // ─────────────────────────────────────────────────────────────────────────

    bytes32 public constant SALE_ADMIN_ROLE = keccak256("SALE_ADMIN_ROLE");

    // ─────────────────────────────────────────────────────────────────────────
    // Immutable state
    // ─────────────────────────────────────────────────────────────────────────

    /// @notice The EVL ERC-20 token.
    IERC20 public immutable evolveToken;

    // ─────────────────────────────────────────────────────────────────────────
    // Configurable state
    // ─────────────────────────────────────────────────────────────────────────

    /// @notice Treasury wallet that holds EVL and receives payments.
    address public treasury;

    /**
     * @notice Number of EVL-wei the buyer receives per 1e18 units of USD.
     *         At $0.01 per EVL → 100 EVL per $1 → evlPerUsd = 100e18.
     */
    uint256 public evlPerUsd;

    /**
     * @notice POL price expressed in 18-decimal USD.
     *         e.g. $0.45 → polPriceUsd = 0.45e18 = 450000000000000000.
     */
    uint256 public polPriceUsd;

    /// @notice Maximum EVL-wei available for sale (0 = unlimited).
    uint256 public saleCap;

    /// @notice Maximum EVL-wei any single wallet may purchase (0 = unlimited).
    uint256 public perWalletCap;

    // ─────────────────────────────────────────────────────────────────────────
    // Accounting
    // ─────────────────────────────────────────────────────────────────────────

    /// @notice Total EVL-wei sold through this contract.
    uint256 public totalSold;

    /// @notice Per-wallet purchase tracking (wallet → EVL-wei purchased).
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
     * @param buyer         Wallet that received EVL.
     * @param paymentToken  ERC-20 used for payment (address(0) for native POL).
     * @param paymentAmount Raw payment amount in the payment token's decimals.
     * @param evlAmount     EVL-wei delivered to the buyer.
     * @param timestamp     Block timestamp.
     */
    event TokensPurchased(
        address indexed buyer,
        address indexed paymentToken,
        uint256 paymentAmount,
        uint256 evlAmount,
        uint256 timestamp
    );

    event SaleCapUpdated(uint256 newCap, address indexed operator);
    event PerWalletCapUpdated(uint256 newCap, address indexed operator);
    event EvlPriceUpdated(uint256 newEvlPerUsd, address indexed operator);
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
    error ZeroEvlOutput();

    // ─────────────────────────────────────────────────────────────────────────
    // Constructor
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @param _evolveToken Address of the EVL ERC-20 contract.
     * @param _treasury    Treasury wallet (holds EVL, receives payments).
     * @param _admin       Initial admin and sale-admin.
     * @param _evlPerUsd   EVL-wei per 1e18 USD-wei (e.g. 100e18 for $0.01).
     * @param _polPriceUsd POL price in 18-decimal USD (e.g. 0.45e18).
     */
    constructor(
        address _evolveToken,
        address _treasury,
        address _admin,
        uint256 _evlPerUsd,
        uint256 _polPriceUsd
    ) {
        if (_evolveToken == address(0) || _treasury == address(0) || _admin == address(0))
            revert ZeroAddress();
        if (_evlPerUsd == 0 || _polPriceUsd == 0) revert ZeroAmount();

        evolveToken = IERC20(_evolveToken);
        treasury = _treasury;
        evlPerUsd = _evlPerUsd;
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
     * @notice Buy EVL with a whitelisted stablecoin.
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

        // Calculate EVL output
        uint256 evlAmount = (usdAmount18 * evlPerUsd) / 1e18;
        if (evlAmount == 0) revert ZeroEvlOutput();

        _enforceCaps(msg.sender, evlAmount);

        // ── Atomic settlement ────────────────────────────────────────────
        // 1. Pull stablecoin from buyer → treasury
        IERC20(stablecoin).safeTransferFrom(msg.sender, treasury, paymentAmount);

        // 2. Pull EVL from treasury → buyer
        evolveToken.safeTransferFrom(treasury, msg.sender, evlAmount);

        // ── Accounting ───────────────────────────────────────────────────
        totalSold += evlAmount;
        purchased[msg.sender] += evlAmount;

        emit TokensPurchased(msg.sender, stablecoin, paymentAmount, evlAmount, block.timestamp);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Purchase: native POL
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Buy EVL by sending native POL with this call.
     *         The POL is forwarded to the treasury, and the equivalent
     *         EVL amount is transferred from treasury to the caller.
     */
    function buyWithPOL() external payable nonReentrant whenNotPaused {
        if (msg.value == 0) revert ZeroAmount();

        // POL → USD: msg.value (18 dec) * polPriceUsd (18 dec) / 1e18
        uint256 usdAmount18 = (msg.value * polPriceUsd) / 1e18;

        // USD → EVL
        uint256 evlAmount = (usdAmount18 * evlPerUsd) / 1e18;
        if (evlAmount == 0) revert ZeroEvlOutput();

        _enforceCaps(msg.sender, evlAmount);

        // ── Atomic settlement ────────────────────────────────────────────
        // 1. Forward POL to treasury
        (bool sent, ) = treasury.call{value: msg.value}("");
        if (!sent) revert POLTransferFailed();

        // 2. Pull EVL from treasury → buyer
        evolveToken.safeTransferFrom(treasury, msg.sender, evlAmount);

        // ── Accounting ───────────────────────────────────────────────────
        totalSold += evlAmount;
        purchased[msg.sender] += evlAmount;

        emit TokensPurchased(msg.sender, address(0), msg.value, evlAmount, block.timestamp);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Internal helpers
    // ─────────────────────────────────────────────────────────────────────────

    function _enforceCaps(address buyer, uint256 evlAmount) internal view {
        if (saleCap > 0 && totalSold + evlAmount > saleCap) {
            revert SaleCapExceeded(evlAmount, saleCap - totalSold);
        }
        if (perWalletCap > 0 && purchased[buyer] + evlAmount > perWalletCap) {
            revert WalletCapExceeded(evlAmount, perWalletCap - purchased[buyer]);
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

    function setEvlPerUsd(uint256 _evlPerUsd) external onlyRole(SALE_ADMIN_ROLE) {
        if (_evlPerUsd == 0) revert ZeroAmount();
        evlPerUsd = _evlPerUsd;
        emit EvlPriceUpdated(_evlPerUsd, msg.sender);
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
     * @notice Preview how many EVL-wei a stablecoin payment would yield.
     * @param stablecoin    The stablecoin address.
     * @param paymentAmount Amount in the stablecoin's native decimals.
     * @return evlAmount    EVL-wei the buyer would receive.
     */
    function quoteStablecoin(
        address stablecoin,
        uint256 paymentAmount
    ) external view returns (uint256 evlAmount) {
        uint8 dec = stablecoinDecimals[stablecoin];
        uint256 usdAmount18 = paymentAmount * (10 ** (18 - dec));
        evlAmount = (usdAmount18 * evlPerUsd) / 1e18;
    }

    /**
     * @notice Preview how many EVL-wei a POL payment would yield.
     * @param polAmount Amount of POL in wei.
     * @return evlAmount EVL-wei the buyer would receive.
     */
    function quotePOL(uint256 polAmount) external view returns (uint256 evlAmount) {
        uint256 usdAmount18 = (polAmount * polPriceUsd) / 1e18;
        evlAmount = (usdAmount18 * evlPerUsd) / 1e18;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Views: sale status
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Returns EVL-wei still available in the sale cap.
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
     * @notice Returns the EVL price in USD (18 decimals).
     *         i.e. 1 EVL costs this many USD-wei.
     */
    function pricePerEvlUsd() external view returns (uint256) {
        // evlPerUsd = EVL-wei per 1e18 USD-wei
        // price = 1e18 * 1e18 / evlPerUsd (in USD-wei per 1 EVL)
        return (1e36) / evlPerUsd;
    }
}
