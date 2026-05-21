//! Soulbound token crate for TROPTIONS L1.
//! Non-transferable, identity-bound credentials.

use primitives::{AccountId, Signature};
use runtime::{execute_transaction_internal, Operation, RuntimeError, Transaction};
use state::{Event, SoulboundToken, State};

/// Mint a soulbound token.
pub fn mint_soulbound(
    state: &mut State,
    issuer: AccountId,
    owner: AccountId,
    metadata_uri: Option<String>,
    nonce: u64,
) -> Result<Event, RuntimeError> {
    let tx = Transaction {
        operations: vec![Operation::SoulboundMint {
            issuer,
            owner,
            metadata_uri,
            nonce,
        }],
        signer: issuer,
        signature: Signature::new([0u8; 64]), // Placeholder
    };
    let events = execute_transaction_internal(state, &tx)?;
    Ok(events.into_iter().next().unwrap())
}

/// Revoke a soulbound token.
pub fn revoke_soulbound(
    state: &mut State,
    issuer: AccountId,
    token_id: [u8; 32],
) -> Result<Event, RuntimeError> {
    let tx = Transaction {
        operations: vec![Operation::SoulboundRevoke { issuer, token_id }],
        signer: issuer,
        signature: Signature::new([0u8; 64]), // Placeholder
    };
    let events = execute_transaction_internal(state, &tx)?;
    Ok(events.into_iter().next().unwrap())
}

/// Query a soulbound token.
pub fn get_token<'a>(state: &'a State, token_id: &'a [u8; 32]) -> Option<&'a SoulboundToken> {
    state.soulbound_tokens.get(token_id)
}

/// Check if an account holds a valid (non-revoked) soulbound token from an issuer.
pub fn has_valid_token<'a>(
    state: &'a State,
    owner: &'a AccountId,
    issuer: &'a AccountId,
) -> Option<&'a SoulboundToken> {
    state
        .soulbound_tokens
        .values()
        .find(|t| t.owner == *owner && t.issuer == *issuer && !t.revoked)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crypto::generate_keypair;
    use runtime::authorize_soulbound_issuer;
    use state::State;

    #[test]
    fn test_full_soulbound_lifecycle() {
        let mut state = State::new();
        let (issuer, _) = generate_keypair();
        let (owner, _) = generate_keypair();

        // Authorize issuer
        authorize_soulbound_issuer(&mut state, issuer, true);

        // Mint
        let event = mint_soulbound(
            &mut state,
            issuer,
            owner,
            Some("ipfs://QmCredential123".to_string()),
            1,
        )
        .unwrap();

        if let Event::SoulboundMinted { id, .. } = event {
            // Verify token exists
            let token = get_token(&state, &id).unwrap();
            assert_eq!(token.owner, owner);
            assert!(!token.revoked);

            // Revoke
            let _ = revoke_soulbound(&mut state, issuer, id).unwrap();
            let token = get_token(&state, &id).unwrap();
            assert!(token.revoked);
        }
    }

    #[test]
    fn test_unauthorized_issuer_fails() {
        let mut state = State::new();
        let (unauthorized, _) = generate_keypair();
        let (owner, _) = generate_keypair();

        let result = mint_soulbound(
            &mut state,
            unauthorized,
            owner,
            None,
            1,
        );
        assert!(result.is_err());
    }
}
