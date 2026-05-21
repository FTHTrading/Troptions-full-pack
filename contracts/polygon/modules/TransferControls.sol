// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title TransferControls
 * @notice Abstract module providing per-address blacklisting and a global
 *         transfer-restriction toggle. Intended to be inherited by the
 *         main token contract.
 *
 * @dev This module only provides storage, events, and admin functions.
 *      Enforcement is delegated to the inheriting contract via
 *      `_enforceTransferControls`.
 */
abstract contract TransferControls {
    // ─────────────────────────────────────────────────────────────────────────
    // Storage
    // ─────────────────────────────────────────────────────────────────────────

    /// @dev Maps address → blacklist status.
    mapping(address => bool) private _blacklisted;

    /// @dev When true, all non-minting / non-burning transfers are blocked
    ///      unless unrestricted by an admin.
    bool private _transfersRestricted;

    // ─────────────────────────────────────────────────────────────────────────
    // Errors
    // ─────────────────────────────────────────────────────────────────────────

    error TC_AddressBlacklisted(address account);
    error TC_TransfersRestricted();
    error TC_ZeroAddress();
    error TC_AlreadyBlacklisted(address account);
    error TC_NotBlacklisted(address account);

    // ─────────────────────────────────────────────────────────────────────────
    // Events
    // ─────────────────────────────────────────────────────────────────────────

    /// @notice Emitted when an address is added to the blacklist.
    event AddressBlacklisted(address indexed account, address indexed operator);

    /// @notice Emitted when an address is removed from the blacklist.
    event AddressUnblacklisted(address indexed account, address indexed operator);

    /// @notice Emitted when the transfer restriction state changes.
    event TransferRestrictionToggled(bool restricted, address indexed operator);

    // ─────────────────────────────────────────────────────────────────────────
    // Internal: enforcement hook
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Reverts if `from` or `to` are blacklisted, or if transfers are
     *         globally restricted. Only applied to wallet-to-wallet transfers
     *         (skipped for mints and burns).
     * @param from  Token sender.
     * @param to    Token recipient.
     */
    function _enforceTransferControls(address from, address to) internal view {
        // Mints (from == address(0)) and burns (to == address(0)) are exempt.
        if (from == address(0) || to == address(0)) return;

        if (_blacklisted[from]) revert TC_AddressBlacklisted(from);
        if (_blacklisted[to]) revert TC_AddressBlacklisted(to);
        if (_transfersRestricted) revert TC_TransfersRestricted();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Internal: state mutators (called by the inheriting contract after RBAC)
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @dev Adds `account` to the blacklist.
     */
    function _addToBlacklist(address account) internal {
        if (account == address(0)) revert TC_ZeroAddress();
        if (_blacklisted[account]) revert TC_AlreadyBlacklisted(account);
        _blacklisted[account] = true;
        emit AddressBlacklisted(account, msg.sender);
    }

    /**
     * @dev Removes `account` from the blacklist.
     */
    function _removeFromBlacklist(address account) internal {
        if (!_blacklisted[account]) revert TC_NotBlacklisted(account);
        _blacklisted[account] = false;
        emit AddressUnblacklisted(account, msg.sender);
    }

    /**
     * @dev Sets the global transfer restriction flag.
     */
    function _setTransfersRestricted(bool restricted) internal {
        _transfersRestricted = restricted;
        emit TransferRestrictionToggled(restricted, msg.sender);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Views
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Returns `true` if `account` is blacklisted.
     */
    function isBlacklisted(address account) external view returns (bool) {
        return _blacklisted[account];
    }

    /**
     * @notice Returns `true` if wallet-to-wallet transfers are globally restricted.
     */
    function transfersRestricted() external view returns (bool) {
        return _transfersRestricted;
    }
}
