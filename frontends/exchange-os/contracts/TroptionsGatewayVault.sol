// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * TROPTIONS GATEWAY VAULT
 * ─────────────────────────────────────────────────────────────────
 * Locks USDC and USDT on Ethereum mainnet.
 * Chainlink oracles validate price at lock time.
 * Only the vault owner can release (withdraw) funds.
 * No third-party tools — deployed directly from this repo.
 *
 * MAINNET ADDRESSES (hardcoded as constants):
 *   USDC:               0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
 *   USDT:               0xdAC17F958D2ee523a2206206994597C13D831ec7
 *   Chainlink USDC/USD: 0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6
 *   Chainlink USDT/USD: 0x3E7d1eAB13ad0104d2750B8863b489D65364e32D
 */

// ─── Minimal Interfaces ───────────────────────────────────────────────────────

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function decimals() external view returns (uint8);
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

// ─── Vault ────────────────────────────────────────────────────────────────────

contract TroptionsGatewayVault {

    // ── Mainnet Addresses ─────────────────────────────────────────────────────
    address public constant USDC_TOKEN    = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
    address public constant USDT_TOKEN    = 0xdAC17F958D2ee523a2206206994597C13D831ec7;
    address public constant USDC_FEED     = 0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6;
    address public constant USDT_FEED     = 0x3E7d1eAB13ad0104d2750B8863b489D65364e32D;

    // Chainlink feed returns 8 decimals
    uint8  public constant FEED_DECIMALS  = 8;
    // Max price age: 26 hours (USDC/USDT feeds have 24h heartbeat)
    uint256 public constant MAX_PRICE_AGE = 26 hours;
    // Max peg deviation: 1% (100 basis points out of 1e8)
    uint256 public constant MAX_PEG_DEV   = 1_000_000; // 1% of 1e8

    // ── State ─────────────────────────────────────────────────────────────────
    address public owner;
    address public depositor;           // address allowed to lock funds

    uint256 public lockedUsdc;          // total USDC locked
    uint256 public lockedUsdt;          // total USDT locked
    uint256 public lockCount;           // number of lock operations

    bool    public frozen;              // owner can freeze all deposits

    // ── Events ────────────────────────────────────────────────────────────────
    event Locked(
        uint256 indexed lockId,
        address indexed by,
        address token,
        uint256 amount,
        uint256 valueUsd,
        int256  chainlinkPrice,
        uint80  roundId,
        uint256 timestamp
    );
    event Released(
        uint256 indexed releaseId,
        address indexed to,
        address token,
        uint256 amount,
        uint256 timestamp
    );
    event DepositorChanged(address indexed previous, address indexed next);
    event OwnershipTransferred(address indexed previous, address indexed next);
    event VaultFrozen(bool frozen);

    // ── Counters ──────────────────────────────────────────────────────────────
    uint256 private _releaseCounter;

    // ── Modifiers ─────────────────────────────────────────────────────────────
    modifier onlyOwner() {
        require(msg.sender == owner, "VAULT: not owner");
        _;
    }
    modifier onlyDepositor() {
        require(msg.sender == depositor, "VAULT: not depositor");
        require(!frozen, "VAULT: frozen - contact owner");
        _;
    }
    modifier notFrozen() {
        require(!frozen, "VAULT: frozen");
        _;
    }

    // ── Constructor ───────────────────────────────────────────────────────────
    constructor(address _depositor) {
        require(_depositor != address(0), "VAULT: zero depositor");
        owner     = msg.sender;
        depositor = _depositor;
    }

    // ── Internal: Chainlink Price Check ───────────────────────────────────────
    function _validatePrice(address feed)
        internal
        view
        returns (int256 price, uint80 roundId)
    {
        (, int256 answer, , uint256 updatedAt, ) =
            AggregatorV3Interface(feed).latestRoundData();
        require(answer > 0,                                  "VAULT: invalid price");
        require(block.timestamp - updatedAt <= MAX_PRICE_AGE, "VAULT: price stale");
        // Price must be within 1% of $1.00 (1e8 = $1.00 with 8 dec)
        uint256 deviation = answer >= 1e8
            ? uint256(answer) - 1e8
            : 1e8 - uint256(answer);
        require(deviation <= MAX_PEG_DEV, "VAULT: price off-peg");
        return (answer, 0);
    }

    // ─── Public: Lock Funds ──────────────────────────────────────────────────

    /**
     * @notice Lock USDC in the vault.
     * @param  amount Amount in USDC base units (6 decimals, so 175_000_000e6 = 175M USDC)
     */
    function lockUsdc(uint256 amount) external onlyDepositor returns (uint256 lockId) {
        require(amount > 0, "VAULT: zero amount");
        IERC20 token = IERC20(USDC_TOKEN);
        require(token.allowance(msg.sender, address(this)) >= amount, "VAULT: insufficient allowance");

        (int256 price, uint80 roundId) = _validatePrice(USDC_FEED);
        uint256 valueUsd = (uint256(price) * amount) / 10 ** (FEED_DECIMALS + token.decimals() - 2);

        require(token.transferFrom(msg.sender, address(this), amount), "VAULT: transfer failed");
        lockedUsdc += amount;
        lockId = ++lockCount;

        emit Locked(lockId, msg.sender, USDC_TOKEN, amount, valueUsd, price, roundId, block.timestamp);
    }

    /**
     * @notice Lock USDT in the vault.
     * @param  amount Amount in USDT base units (6 decimals)
     */
    function lockUsdt(uint256 amount) external onlyDepositor returns (uint256 lockId) {
        require(amount > 0, "VAULT: zero amount");
        IERC20 token = IERC20(USDT_TOKEN);
        require(token.allowance(msg.sender, address(this)) >= amount, "VAULT: insufficient allowance");

        (int256 price, uint80 roundId) = _validatePrice(USDT_FEED);
        uint256 valueUsd = (uint256(price) * amount) / 10 ** (FEED_DECIMALS + token.decimals() - 2);

        // USDT uses non-standard transfer (no return bool) — use low-level call
        (bool ok, ) = USDT_TOKEN.call(
            abi.encodeWithSignature("transferFrom(address,address,uint256)", msg.sender, address(this), amount)
        );
        require(ok, "VAULT: USDT transfer failed");
        lockedUsdt += amount;
        lockId = ++lockCount;

        emit Locked(lockId, msg.sender, USDT_TOKEN, amount, valueUsd, price, roundId, block.timestamp);
    }

    // ─── Public: Release Funds (owner only) ──────────────────────────────────

    /**
     * @notice Release USDC to a target address. Only owner can call.
     * @param  to     Recipient address
     * @param  amount Amount in USDC base units
     */
    function releaseUsdc(address to, uint256 amount) external onlyOwner {
        require(to != address(0),                      "VAULT: zero recipient");
        require(amount > 0,                            "VAULT: zero amount");
        require(amount <= lockedUsdc,                  "VAULT: amount exceeds locked USDC");
        lockedUsdc -= amount;
        uint256 releaseId = ++_releaseCounter;
        require(IERC20(USDC_TOKEN).transfer(to, amount), "VAULT: transfer failed");
        emit Released(releaseId, to, USDC_TOKEN, amount, block.timestamp);
    }

    /**
     * @notice Release USDT to a target address. Only owner can call.
     * @param  to     Recipient address
     * @param  amount Amount in USDT base units
     */
    function releaseUsdt(address to, uint256 amount) external onlyOwner {
        require(to != address(0),                      "VAULT: zero recipient");
        require(amount > 0,                            "VAULT: zero amount");
        require(amount <= lockedUsdt,                  "VAULT: amount exceeds locked USDT");
        lockedUsdt -= amount;
        uint256 releaseId = ++_releaseCounter;
        (bool ok, ) = USDT_TOKEN.call(
            abi.encodeWithSignature("transfer(address,uint256)", to, amount)
        );
        require(ok, "VAULT: USDT release failed");
        emit Released(releaseId, to, USDT_TOKEN, amount, block.timestamp);
    }

    // ─── Views ────────────────────────────────────────────────────────────────

    /**
     * @notice Returns current vault state snapshot.
     * All amounts are in base units.
     */
    function vaultSnapshot()
        external
        view
        returns (
            address vaultAddress,
            uint256 usdcLocked,
            uint256 usdtLocked,
            uint256 totalLocks,
            bool    isFrozen
        )
    {
        return (address(this), lockedUsdc, lockedUsdt, lockCount, frozen);
    }

    /**
     * @notice Live Chainlink prices for both assets.
     */
    function liveOracles()
        external
        view
        returns (
            int256  usdcPrice,
            uint256 usdcUpdated,
            int256  usdtPrice,
            uint256 usdtUpdated
        )
    {
        (, int256 up, , uint256 uu, ) = AggregatorV3Interface(USDC_FEED).latestRoundData();
        (, int256 tp, , uint256 tu, ) = AggregatorV3Interface(USDT_FEED).latestRoundData();
        return (up, uu, tp, tu);
    }

    // ─── Admin ────────────────────────────────────────────────────────────────

    function freeze(bool _frozen) external onlyOwner {
        frozen = _frozen;
        emit VaultFrozen(_frozen);
    }

    function setDepositor(address _new) external onlyOwner {
        require(_new != address(0), "VAULT: zero address");
        emit DepositorChanged(depositor, _new);
        depositor = _new;
    }

    function transferOwnership(address _new) external onlyOwner {
        require(_new != address(0), "VAULT: zero address");
        emit OwnershipTransferred(owner, _new);
        owner = _new;
    }
}
