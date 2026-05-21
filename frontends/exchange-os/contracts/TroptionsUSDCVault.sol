// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TroptionsUSDCVault
 * @notice TROPTIONS Gateway USDC custody vault with Chainlink price validation
 *
 * WHAT THIS CONTRACT DOES:
 *  - Accepts deposits of real Circle USDC (ERC-20) from an authorized depositor
 *  - Records a Chainlink price snapshot at deposit time
 *  - Emits a DepositReceipt event (on-chain proof of custody + value)
 *  - Allows the owner to release funds back to any recipient
 *  - Anyone can call verifyHolding() to get a real-time Chainlink-validated view
 *
 * MAINNET ADDRESSES (Ethereum):
 *  USDC token:         0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
 *  Circle official minter: 0x5B6122C109B78C6755486966148C1D70a50A47D7
 *  Chainlink USDC/USD: 0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6
 *
 * DEPLOYMENT:
 *  1. Open https://remix.ethereum.org
 *  2. Paste this file into a new .sol file
 *  3. Compile with Solidity 0.8.20
 *  4. Deploy on Ethereum mainnet via Injected Provider (MetaMask)
 *  5. Constructor args:
 *       _usdc:     0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
 *       _feed:     0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6
 *       _depositor: <your authorized depositor address>
 *  6. Save the deployed contract address — use it in chainlink-custodial-receipt.mjs
 */

// ─── Interfaces ───────────────────────────────────────────────────────────────

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
}

interface AggregatorV3Interface {
    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );
    function decimals() external view returns (uint8);
}

// ─── Vault Contract ───────────────────────────────────────────────────────────

contract TroptionsUSDCVault {

    // ── State ──────────────────────────────────────────────────────────────────

    IERC20 public immutable usdc;
    AggregatorV3Interface public immutable priceFeed;

    address public owner;
    address public depositor;

    uint256 public totalDeposited;
    uint256 public depositCount;

    // USDC has 6 decimals; Chainlink USDC/USD has 8 decimals
    uint8 public constant USDC_DECIMALS = 6;
    uint8 public constant FEED_DECIMALS = 8;

    // Maximum allowed price age before a deposit is rejected (2 days for USDC/USD heartbeat)
    uint256 public constant MAX_PRICE_AGE = 2 days;

    // ── Events ─────────────────────────────────────────────────────────────────

    /**
     * @notice Emitted on every successful USDC deposit.
     * @dev This event IS the on-chain receipt. Log it and save the tx hash.
     * @param receiptId  Sequential receipt number (1-based)
     * @param depositor  Address that triggered the deposit
     * @param amount     Raw USDC amount (divide by 1e6 for human units)
     * @param amountUsd  USD value at Chainlink price × 1e8 (divide by 1e8)
     * @param price      Chainlink USDC/USD price × 1e8
     * @param roundId    Chainlink round ID at deposit time (proof of oracle freshness)
     * @param timestamp  Block timestamp of deposit
     */
    event DepositReceipt(
        uint256 indexed receiptId,
        address indexed depositor,
        uint256 amount,
        uint256 amountUsd,
        int256  price,
        uint80  roundId,
        uint256 timestamp
    );

    event Withdrawal(
        address indexed to,
        uint256 amount,
        uint256 timestamp
    );

    event DepositorUpdated(address indexed previous, address indexed next);
    event OwnershipTransferred(address indexed previous, address indexed next);

    // ── Errors ─────────────────────────────────────────────────────────────────

    error Unauthorized();
    error ZeroAmount();
    error StalePriceFeed(uint256 age);
    error InvalidPrice();
    error TransferFailed();
    error InsufficientBalance(uint256 requested, uint256 available);

    // ── Constructor ────────────────────────────────────────────────────────────

    constructor(address _usdc, address _feed, address _depositor) {
        require(_usdc     != address(0), "USDC address required");
        require(_feed     != address(0), "Feed address required");
        require(_depositor != address(0), "Depositor address required");
        usdc      = IERC20(_usdc);
        priceFeed = AggregatorV3Interface(_feed);
        owner     = msg.sender;
        depositor = _depositor;
    }

    // ── Modifiers ──────────────────────────────────────────────────────────────

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    modifier onlyDepositor() {
        if (msg.sender != depositor) revert Unauthorized();
        _;
    }

    // ── Chainlink helpers ──────────────────────────────────────────────────────

    /**
     * @notice Fetch latest Chainlink USDC/USD price, revert if stale or negative.
     */
    function _getValidatedPrice() internal view returns (int256 price, uint80 roundId) {
        (
            uint80 _roundId,
            int256 _answer,
            ,
            uint256 _updatedAt,

        ) = priceFeed.latestRoundData();

        if (_answer <= 0) revert InvalidPrice();
        if (block.timestamp - _updatedAt > MAX_PRICE_AGE)
            revert StalePriceFeed(block.timestamp - _updatedAt);

        return (_answer, _roundId);
    }

    // ── Deposit ────────────────────────────────────────────────────────────────

    /**
     * @notice Deposit USDC into the vault.
     * @dev Caller must first call usdc.approve(vaultAddress, amount) on the USDC contract.
     * @param amount Raw USDC amount (e.g. 175_000_000 * 1e6 for 175M USDC)
     * @return receiptId The sequential receipt number for this deposit
     */
    function deposit(uint256 amount) external onlyDepositor returns (uint256 receiptId) {
        if (amount == 0) revert ZeroAmount();

        (int256 price, uint80 roundId) = _getValidatedPrice();

        bool ok = usdc.transferFrom(msg.sender, address(this), amount);
        if (!ok) revert TransferFailed();

        totalDeposited += amount;
        receiptId = ++depositCount;

        // USD value: amount (6 dec) × price (8 dec) / 1e6 → result has 8 dec precision
        uint256 amountUsd = (amount * uint256(price)) / (10 ** USDC_DECIMALS);

        emit DepositReceipt(
            receiptId,
            msg.sender,
            amount,
            amountUsd,
            price,
            roundId,
            block.timestamp
        );
    }

    // ── Withdraw ───────────────────────────────────────────────────────────────

    /**
     * @notice Release USDC from the vault to any recipient.
     * @param to      Recipient address
     * @param amount  Raw USDC amount (6 decimals)
     */
    function withdraw(address to, uint256 amount) external onlyOwner {
        if (amount == 0) revert ZeroAmount();
        uint256 bal = usdc.balanceOf(address(this));
        if (amount > bal) revert InsufficientBalance(amount, bal);

        bool ok = usdc.transfer(to, amount);
        if (!ok) revert TransferFailed();

        emit Withdrawal(to, amount, block.timestamp);
    }

    // ── Views ──────────────────────────────────────────────────────────────────

    /**
     * @notice Get the vault's current USDC balance and its Chainlink USD value.
     * @return balance   Raw USDC units held in vault (divide by 1e6)
     * @return valueUsd  USD value × 1e8 (divide by 1e8)
     * @return price     Current Chainlink USDC/USD price × 1e8
     * @return roundId   Chainlink round ID
     * @return updatedAt Timestamp of last Chainlink update
     */
    function verifyHolding() external view returns (
        uint256 balance,
        uint256 valueUsd,
        int256  price,
        uint80  roundId,
        uint256 updatedAt
    ) {
        balance = usdc.balanceOf(address(this));

        (
            uint80 _roundId,
            int256 _answer,
            ,
            uint256 _updatedAt,

        ) = priceFeed.latestRoundData();

        price     = _answer;
        roundId   = _roundId;
        updatedAt = _updatedAt;

        if (_answer > 0) {
            valueUsd = (balance * uint256(_answer)) / (10 ** USDC_DECIMALS);
        }
    }

    /**
     * @notice Produce a custody snapshot readable by off-chain scripts.
     * @return vaultAddress     This contract's address
     * @return usdcContract     USDC ERC-20 contract address
     * @return chainlinkFeed    Chainlink USDC/USD feed address
     * @return balance          Raw USDC balance (6 dec)
     * @return receiptsIssued   Total deposit receipt count
     */
    function custodySnapshot() external view returns (
        address vaultAddress,
        address usdcContract,
        address chainlinkFeed,
        uint256 balance,
        uint256 receiptsIssued
    ) {
        return (
            address(this),
            address(usdc),
            address(priceFeed),
            usdc.balanceOf(address(this)),
            depositCount
        );
    }

    // ── Admin ──────────────────────────────────────────────────────────────────

    function setDepositor(address _depositor) external onlyOwner {
        emit DepositorUpdated(depositor, _depositor);
        depositor = _depositor;
    }

    function transferOwnership(address _owner) external onlyOwner {
        emit OwnershipTransferred(owner, _owner);
        owner = _owner;
    }
}
