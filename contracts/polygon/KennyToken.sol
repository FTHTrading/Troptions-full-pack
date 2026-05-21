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
 * @title KennyToken
 * @author Kenny Token Team
 * @notice Production-grade ERC-20 token deployed on Polygon.
 *
 * Token details:
 *   Name     : Kenny Token
 *   Symbol   : KENNY
 *   Decimals : 18
 *   Cap      : 100,000,000 KENNY (hard-coded, immutable)
 *
 * Features:
 *   - Fixed supply cap enforced at the ERC20Capped level (no override possible).
 *   - Configurable initial mint to treasury at deploy time.
 *   - Controlled minting up to cap via MINTER_ROLE.
 *   - ERC20Burnable: any holder may burn their own tokens.
 *   - ERC20Pausable: PAUSER_ROLE can suspend all token movements.
 *   - Per-address blacklist and global transfer-restriction toggle
 *     managed through TransferControls module.
 *   - Treasury wallet managed through TreasuryManager module.
 *   - Role-based access control (AccessControl):
 *       DEFAULT_ADMIN_ROLE — full admin, role management
 *       PAUSER_ROLE        — pause / unpause transfers
 *       MINTER_ROLE        — controlled mint up to cap
 *       TREASURY_ROLE      — update treasury wallet, manage transfer controls
 *
 * Security model:
 *   - No upgrade proxy in v1: deployed code is the authoritative implementation.
 *   - Cap is enforced by ERC20Capped._update; no path exists to mint beyond cap.
 *   - Reentrancy is not applicable to pure ERC-20 transfers (no ETH movement).
 *   - Custom errors are used throughout for gas efficiency and on-chain readability.
 */
contract KennyToken is
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

    /// @notice Hard-coded maximum supply: 100,000,000 KENNY (18 decimals).
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10 ** 18;

    /// @notice Role identifier for addresses authorised to pause/unpause.
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    /// @notice Role identifier for addresses authorised to mint tokens.
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /// @notice Role identifier for treasury management and transfer-control ops.
    bytes32 public constant TREASURY_ROLE = keccak256("TREASURY_ROLE");

    // ─────────────────────────────────────────────────────────────────────────
    // Custom errors
    // ─────────────────────────────────────────────────────────────────────────

    error KT_ZeroAddress();
    error KT_MintExceedsCap(uint256 requested, uint256 available);
    error KT_ZeroAmount();

    // ─────────────────────────────────────────────────────────────────────────
    // Events
    // ─────────────────────────────────────────────────────────────────────────

    /// @notice Emitted when an admin-authorised mint is executed.
    event TokensMinted(address indexed to, uint256 amount, address indexed operator);

    // ─────────────────────────────────────────────────────────────────────────
    // Constructor
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Deploys KennyToken, assigns admin/operational roles, and
     *         optionally mints an initial supply to the treasury wallet.
     *
     * @param adminWallet    Address to receive DEFAULT_ADMIN_ROLE (and all
     *                       other bootstrapped roles).  Must be non-zero.
     * @param treasuryWallet Address designated as the treasury.  Must be
     *                       non-zero and receives any initial mint.
     * @param initialMint    Token amount (in full KENNY units, NOT wei) to
     *                       mint to the treasury at deploy time.  Pass 0 to
     *                       skip the initial mint.  Cannot exceed MAX_SUPPLY.
     */
    constructor(
        address adminWallet,
        address treasuryWallet,
        uint256 initialMint
    )
        ERC20("Kenny Token", "KENNY")
        ERC20Capped(MAX_SUPPLY)
        TreasuryManager(treasuryWallet)
    {
        if (adminWallet == address(0)) revert KT_ZeroAddress();

        // ── Role assignments ─────────────────────────────────────────────────
        _grantRole(DEFAULT_ADMIN_ROLE, adminWallet);
        _grantRole(PAUSER_ROLE, adminWallet);
        _grantRole(MINTER_ROLE, adminWallet);
        _grantRole(TREASURY_ROLE, adminWallet);

        // ── Initial mint (optional) ──────────────────────────────────────────
        if (initialMint > 0) {
            uint256 mintAmount = initialMint * 10 ** decimals();
            if (mintAmount > MAX_SUPPLY) {
                revert KT_MintExceedsCap(mintAmount, MAX_SUPPLY);
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
     * @param amount Number of whole KENNY tokens to mint.
     */
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        if (to == address(0)) revert KT_ZeroAddress();
        if (amount == 0) revert KT_ZeroAmount();

        uint256 weiAmount = amount * 10 ** decimals();
        uint256 remaining = cap() - totalSupply();
        if (weiAmount > remaining) revert KT_MintExceedsCap(weiAmount, remaining);

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
        if (to == address(0)) revert KT_ZeroAddress();
        if (amountWei == 0) revert KT_ZeroAmount();

        uint256 remaining = cap() - totalSupply();
        if (amountWei > remaining) revert KT_MintExceedsCap(amountWei, remaining);

        _mint(to, amountWei);
        emit TokensMinted(to, amountWei, msg.sender);
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
    }
}
