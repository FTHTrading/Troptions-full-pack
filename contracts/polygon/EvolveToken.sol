// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { ERC20Capped } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import { ERC20Burnable } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import { ERC20Pausable } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";

import { TransferControls } from "./modules/TransferControls.sol";
import { TreasuryManager } from "./modules/TreasuryManager.sol";

/**
 * @title EvolveToken
 * @author The Financial Evolution
 * @notice School utility token for The Financial Evolution education platform,
 *         deployed on Polygon PoS.
 *
 * Token details:
 *   Name     : Evolve Token
 *   Symbol   : EVL
 *   Decimals : 18
 *   Cap      : 500,000,000 EVL (hard-coded, immutable)
 *   Network  : Polygon PoS (chain-id 137)
 *
 * Purpose:
 *   EVL powers the school economy — course access, certifications, student
 *   rewards, creator payouts, staking, and governance.  Burns on course
 *   purchases create deflationary pressure while the reward pool funds
 *   student achievement and engagement incentives.
 *
 * Supply allocation (at launch):
 *   - 250 M  (50%) — School Treasury (operations, rewards, partnerships)
 *   -  50 M  (10%) — Public Sale (fundraising for infrastructure)
 *   - 100 M  (20%) — Reward Pool (student/creator incentives)
 *   -  50 M  (10%) — Team & Advisors (vesting)
 *   -  50 M  (10%) — Reserved (future mints, never exceeds 500 M cap)
 *
 * Features:
 *   - ERC20Capped  — hard 500 M cap, enforced on-chain
 *   - ERC20Burnable — course-purchase burns + manual burns
 *   - ERC20Pausable — emergency circuit breaker
 *   - AccessControl — granular RBAC (admin, pauser, minter, treasury)
 *   - TransferControls — blacklist + global transfer restriction
 *   - TreasuryManager  — mutable treasury address
 *   - burnForCourse()  — on-chain proof-of-payment for course access
 *
 * Roles:
 *   DEFAULT_ADMIN_ROLE — manages other roles, emergency powers
 *   PAUSER_ROLE        — pause / unpause token operations
 *   MINTER_ROLE        — mint new EVL (up to cap)
 *   TREASURY_ROLE      — blacklist, transfer restrictions, treasury updates
 *
 * @custom:security-contact security@thefinancialevolution.com
 */
contract EvolveToken is
    ERC20,
    ERC20Capped,
    ERC20Burnable,
    ERC20Pausable,
    AccessControl,
    TransferControls,
    TreasuryManager
{
    // ─────────────────────────────────────────────────────────────────────────
    // Constants
    // ─────────────────────────────────────────────────────────────────────────

    /// @notice Hard-coded maximum supply: 500,000,000 EVL (18 decimals).
    uint256 public constant MAX_SUPPLY = 500_000_000 * 10 ** 18;

    /// @notice Role identifier for addresses authorised to pause/unpause.
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    /// @notice Role identifier for addresses authorised to mint tokens.
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /// @notice Role identifier for treasury management and transfer-control ops.
    bytes32 public constant TREASURY_ROLE = keccak256("TREASURY_ROLE");

    // ─────────────────────────────────────────────────────────────────────────
    // Custom errors
    // ─────────────────────────────────────────────────────────────────────────

    error EVL_ZeroAddress();
    error EVL_MintExceedsCap(uint256 requested, uint256 available);
    error EVL_ZeroAmount();

    // ─────────────────────────────────────────────────────────────────────────
    // Events
    // ─────────────────────────────────────────────────────────────────────────

    /// @notice Emitted when an admin-authorised mint is executed.
    event TokensMinted(address indexed to, uint256 amount, address indexed operator);

    /// @notice Emitted when EVL is burned for a course purchase (on-chain proof-of-payment).
    event CoursePurchaseBurn(address indexed student, uint256 amount, bytes32 indexed courseId);

    /// @notice Emitted when EVL is burned for a certification (on-chain credential).
    event CertificationBurn(address indexed student, uint256 amount, bytes32 indexed certId);

    // ─────────────────────────────────────────────────────────────────────────
    // Constructor
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Deploys EvolveToken, assigns admin/operational roles, and
     *         optionally mints an initial supply to the treasury wallet.
     *
     * @param adminWallet    Address to receive DEFAULT_ADMIN_ROLE (and all
     *                       other bootstrapped roles).  Must be non-zero.
     * @param treasuryWallet Address designated as the school treasury.  Must be
     *                       non-zero and receives any initial mint.
     * @param initialMint    Token amount (in full EVL units, NOT wei) to
     *                       mint to the treasury at deploy time.  Pass 0 to
     *                       skip the initial mint.  Cannot exceed MAX_SUPPLY.
     *                       Recommended: 250_000_000 (50% for school ops).
     */
    constructor(
        address adminWallet,
        address treasuryWallet,
        uint256 initialMint
    )
        ERC20("Evolve Token", "EVL")
        ERC20Capped(MAX_SUPPLY)
        TreasuryManager(treasuryWallet)
    {
        if (adminWallet == address(0)) revert EVL_ZeroAddress();

        // ── Role assignments ─────────────────────────────────────────────────
        _grantRole(DEFAULT_ADMIN_ROLE, adminWallet);
        _grantRole(PAUSER_ROLE, adminWallet);
        _grantRole(MINTER_ROLE, adminWallet);
        _grantRole(TREASURY_ROLE, adminWallet);

        // ── Initial mint (optional) ──────────────────────────────────────────
        if (initialMint > 0) {
            uint256 mintAmount = initialMint * 10 ** decimals();
            if (mintAmount > MAX_SUPPLY) {
                revert EVL_MintExceedsCap(mintAmount, MAX_SUPPLY);
            }
            _mint(treasuryWallet, mintAmount);
            emit TokensMinted(treasuryWallet, mintAmount, msg.sender);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Minting
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Mints `amount` tokens (in token-unit form, NOT wei) to `to`.
     *         Total supply after minting must not exceed MAX_SUPPLY.
     *
     * @dev    Callers must hold MINTER_ROLE.  ERC20Capped._update enforces
     *         the cap at the storage level as a final safety net.
     *
     * @param to     Recipient address.  Must be non-zero.
     * @param amount Number of whole EVL tokens to mint.
     */
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        if (to == address(0)) revert EVL_ZeroAddress();
        if (amount == 0) revert EVL_ZeroAmount();

        uint256 weiAmount = amount * 10 ** decimals();
        uint256 remaining = cap() - totalSupply();
        if (weiAmount > remaining) revert EVL_MintExceedsCap(weiAmount, remaining);

        _mint(to, weiAmount);
        emit TokensMinted(to, weiAmount, msg.sender);
    }

    /**
     * @notice Mints `amountWei` tokens in raw wei form to `to`.
     *         Intended for scripts that compute exact wei values.
     *
     * @param to        Recipient address.  Must be non-zero.
     * @param amountWei Raw token amount in wei (18-decimal units).
     */
    function mintWei(address to, uint256 amountWei) external onlyRole(MINTER_ROLE) {
        if (to == address(0)) revert EVL_ZeroAddress();
        if (amountWei == 0) revert EVL_ZeroAmount();

        uint256 remaining = cap() - totalSupply();
        if (amountWei > remaining) revert EVL_MintExceedsCap(amountWei, remaining);

        _mint(to, amountWei);
        emit TokensMinted(to, amountWei, msg.sender);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // School economy: course & certification burns
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Burns `amount` whole EVL from the caller for a course purchase.
     *         Emits `CoursePurchaseBurn` with the course identifier for
     *         on-chain proof of payment.  Creates deflationary pressure.
     *
     * @param amount   Whole EVL tokens to burn (e.g. 50 = 50 EVL).
     * @param courseId Keccak256 hash of the course slug or identifier.
     */
    function burnForCourse(uint256 amount, bytes32 courseId) external {
        if (amount == 0) revert EVL_ZeroAmount();
        uint256 weiAmount = amount * 10 ** decimals();
        _burn(msg.sender, weiAmount);
        emit CoursePurchaseBurn(msg.sender, weiAmount, courseId);
    }

    /**
     * @notice Burns `amount` whole EVL from the caller for a certification.
     *         Emits `CertificationBurn` as on-chain proof of credential.
     *
     * @param amount Whole EVL tokens to burn for certification fee.
     * @param certId Keccak256 hash of the certification identifier.
     */
    function burnForCertification(uint256 amount, bytes32 certId) external {
        if (amount == 0) revert EVL_ZeroAmount();
        uint256 weiAmount = amount * 10 ** decimals();
        _burn(msg.sender, weiAmount);
        emit CertificationBurn(msg.sender, weiAmount, certId);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Pause controls
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Pauses all token transfers, approvals, mints, and burns.
     * @dev    Callers must hold PAUSER_ROLE.
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    /**
     * @notice Resumes all token operations following a pause.
     * @dev    Callers must hold PAUSER_ROLE.
     */
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Transfer controls (blacklist + restriction toggle)
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Adds `account` to the transfer blacklist.
     * @dev    Callers must hold TREASURY_ROLE.
     * @param account Address to blacklist.
     */
    function blacklist(address account) external onlyRole(TREASURY_ROLE) {
        _addToBlacklist(account);
    }

    /**
     * @notice Removes `account` from the transfer blacklist.
     * @dev    Callers must hold TREASURY_ROLE.
     * @param account Address to un-blacklist.
     */
    function unblacklist(address account) external onlyRole(TREASURY_ROLE) {
        _removeFromBlacklist(account);
    }

    /**
     * @notice Enables or disables the global transfer restriction.
     *         When restricted, only mints and burns are permitted.
     * @dev    Callers must hold TREASURY_ROLE.
     * @param restricted `true` to restrict, `false` to allow.
     */
    function setTransfersRestricted(bool restricted) external onlyRole(TREASURY_ROLE) {
        _setTransfersRestricted(restricted);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Treasury management
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Updates the treasury wallet address.
     * @dev    Callers must hold TREASURY_ROLE.
     * @param newTreasury New treasury wallet.  Must be non-zero and differ
     *                    from the current treasury.
     */
    function setTreasury(address newTreasury) external onlyRole(TREASURY_ROLE) {
        _setTreasury(newTreasury);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Convenience views
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Returns the number of tokens still available to mint before the
     *         cap is reached.
     */
    function mintableSupply() external view returns (uint256) {
        return cap() - totalSupply();
    }

    /**
     * @notice Tracks cumulative EVL ever minted (for burn accounting).
     *         Updated on every mint via _update → _afterMint internal hook.
     */
    uint256 private _totalMinted;

    /**
     * @notice Returns total EVL burned to date (course burns + manual burns).
     *         Computed as total-ever-minted minus current circulating supply.
     */
    function totalBurned() external view returns (uint256) {
        return _totalMinted - totalSupply();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Internal overrides — required by Solidity for multiple inheritance
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @dev Overrides ERC20._update to satisfy ERC20Capped and ERC20Pausable.
     *      Execution order (C3 linearisation):
     *        1. ERC20Pausable._update   → reverts if paused
     *        2. ERC20Capped._update     → reverts if cap exceeded
     *        3. ERC20._update           → writes balance state
     *
     *      Additionally enforces TransferControls (blacklist / restriction)
     *      before delegating to `super`.
     */
    function _update(
        address from,
        address to,
        uint256 value
    ) internal override(ERC20, ERC20Capped, ERC20Pausable) {
        _enforceTransferControls(from, to);
        super._update(from, to, value);
        // Track cumulative minted for burn accounting
        if (from == address(0)) {
            _totalMinted += value;
        }
    }
}
