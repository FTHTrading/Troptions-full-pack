// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title TreasuryManager
 * @notice Abstract module for tracking and updating the designated treasury
 *         wallet address. The treasury is the canonical recipient for any
 *         admin-initiated token distributions and the initial mint target.
 *
 * @dev Inheriting contracts are responsible for access-controlling calls to
 *      `_setTreasury`.
 */
abstract contract TreasuryManager {
    // ─────────────────────────────────────────────────────────────────────────
    // Storage
    // ─────────────────────────────────────────────────────────────────────────

    /// @dev The current treasury wallet.
    address private _treasury;

    // ─────────────────────────────────────────────────────────────────────────
    // Errors
    // ─────────────────────────────────────────────────────────────────────────

    error TM_ZeroAddress();
    error TM_SameAddress();

    // ─────────────────────────────────────────────────────────────────────────
    // Events
    // ─────────────────────────────────────────────────────────────────────────

    /// @notice Emitted when the treasury wallet is updated.
    event TreasuryUpdated(
        address indexed previousTreasury,
        address indexed newTreasury,
        address indexed operator
    );

    // ─────────────────────────────────────────────────────────────────────────
    // Constructor
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @dev Initialises the treasury with a non-zero address.
     * @param initialTreasury The wallet address to designate as treasury.
     */
    constructor(address initialTreasury) {
        if (initialTreasury == address(0)) revert TM_ZeroAddress();
        _treasury = initialTreasury;
        // Emit with zero as "previousTreasury" to signal initialisation.
        emit TreasuryUpdated(address(0), initialTreasury, msg.sender);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Internal: state mutator
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @dev Updates the treasury address. Caller must enforce access control.
     * @param newTreasury The new treasury wallet address.
     */
    function _setTreasury(address newTreasury) internal {
        if (newTreasury == address(0)) revert TM_ZeroAddress();
        if (newTreasury == _treasury) revert TM_SameAddress();
        address previous = _treasury;
        _treasury = newTreasury;
        emit TreasuryUpdated(previous, newTreasury, msg.sender);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Views
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Returns the current treasury wallet address.
     */
    function treasury() external view returns (address) {
        return _treasury;
    }

    /**
     * @dev Internal accessor used by the inheriting contract (e.g., for
     *      directing initial mints to the treasury).
     */
    function _getTreasury() internal view returns (address) {
        return _treasury;
    }
}
