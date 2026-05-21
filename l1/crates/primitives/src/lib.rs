//! Core primitives for the TROPTIONS L1 blockchain.
//! Defines AccountId, BlockHeight, AssetId, and other fundamental types.

use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::fmt;

/// Unique identifier for accounts (32 bytes = 256 bits).
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct AccountId([u8; 32]);

impl Serialize for AccountId {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(&hex::encode(&self.0))
    }
}

impl<'de> Deserialize<'de> for AccountId {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let hex_str = String::deserialize(deserializer)?;
        let bytes = hex::decode(hex_str).map_err(serde::de::Error::custom)?;
        if bytes.len() != 32 {
            return Err(serde::de::Error::custom("invalid account id length"));
        }
        let mut arr = [0u8; 32];
        arr.copy_from_slice(&bytes);
        Ok(AccountId(arr))
    }
}

impl AccountId {
    pub fn new(bytes: [u8; 32]) -> Self {
        AccountId(bytes)
    }

    pub fn from_bytes(bytes: &[u8]) -> Option<Self> {
        if bytes.len() == 32 {
            let mut arr = [0u8; 32];
            arr.copy_from_slice(bytes);
            Some(AccountId(arr))
        } else {
            None
        }
    }

    pub fn as_bytes(&self) -> &[u8; 32] {
        &self.0
    }

    /// Generate an AccountId from a public key string (hex).
    pub fn from_hex(hex_str: &str) -> Result<Self, hex::FromHexError> {
        let bytes = hex::decode(hex_str)?;
        Self::from_bytes(&bytes).ok_or(hex::FromHexError::InvalidStringLength)
    }
}

impl fmt::Display for AccountId {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        // Show first 4 hex chars (2 bytes) for compact display
        write!(f, "{}", hex::encode_upper(&self.0[..2]))
    }
}

/// Block height (u64).
pub type BlockHeight = u64;

/// Asset identifier.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum AssetId {
    Native, // TROPTIONS native token
    XRPL([u8; 20]), // XRPL IOU (issuer address)
    Stellar([u8; 32]), // Stellar asset code
    Custom([u8; 32]), // Custom asset hash
}

impl Serialize for AssetId {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        match self {
            AssetId::Native => serializer.serialize_str("NATIVE"),
            AssetId::XRPL(bytes) => serializer.serialize_str(&format!("XRPL_{}", hex::encode(bytes))),
            AssetId::Stellar(bytes) => serializer.serialize_str(&format!("STELLAR_{}", hex::encode(bytes))),
            AssetId::Custom(bytes) => serializer.serialize_str(&format!("CUSTOM_{}", hex::encode(bytes))),
        }
    }
}

impl<'de> Deserialize<'de> for AssetId {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let s = String::deserialize(deserializer)?;
        if s == "NATIVE" {
            Ok(AssetId::Native)
        } else if let Some(rest) = s.strip_prefix("XRPL_") {
            let bytes = hex::decode(rest).map_err(serde::de::Error::custom)?;
            if bytes.len() != 20 {
                return Err(serde::de::Error::custom("invalid XRPL asset length"));
            }
            let mut arr = [0u8; 20];
            arr.copy_from_slice(&bytes);
            Ok(AssetId::XRPL(arr))
        } else if let Some(rest) = s.strip_prefix("STELLAR_") {
            let bytes = hex::decode(rest).map_err(serde::de::Error::custom)?;
            if bytes.len() != 32 {
                return Err(serde::de::Error::custom("invalid Stellar asset length"));
            }
            let mut arr = [0u8; 32];
            arr.copy_from_slice(&bytes);
            Ok(AssetId::Stellar(arr))
        } else if let Some(rest) = s.strip_prefix("CUSTOM_") {
            let bytes = hex::decode(rest).map_err(serde::de::Error::custom)?;
            if bytes.len() != 32 {
                return Err(serde::de::Error::custom("invalid custom asset length"));
            }
            let mut arr = [0u8; 32];
            arr.copy_from_slice(&bytes);
            Ok(AssetId::Custom(arr))
        } else {
            Err(serde::de::Error::custom("invalid asset id format"))
        }
    }
}

impl AssetId {
    pub fn to_bytes(&self) -> Vec<u8> {
        match self {
            AssetId::Native => b"NATIVE".to_vec(),
            AssetId::XRPL(bytes) => {
                let mut v = b"XRPL".to_vec();
                v.extend_from_slice(bytes);
                v
            }
            AssetId::Stellar(bytes) => {
                let mut v = b"STELLAR".to_vec();
                v.extend_from_slice(bytes);
                v
            }
            AssetId::Custom(bytes) => {
                let mut v = b"CUSTOM".to_vec();
                v.extend_from_slice(bytes);
                v
            }
        }
    }
}

/// Unique transaction identifier.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub struct TxHash([u8; 32]);

impl TxHash {
    pub fn new(bytes: [u8; 32]) -> Self {
        TxHash(bytes)
    }

    pub fn from_data(data: &[u8]) -> Self {
        let hash = Sha256::digest(data);
        let mut arr = [0u8; 32];
        arr.copy_from_slice(&hash);
        TxHash(arr)
    }
}

/// Ed25519 signature (64 bytes).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct Signature([u8; 64]);

impl Serialize for Signature {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(&hex::encode(&self.0))
    }
}

impl<'de> Deserialize<'de> for Signature {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let hex_str = String::deserialize(deserializer)?;
        let bytes = hex::decode(hex_str).map_err(serde::de::Error::custom)?;
        if bytes.len() != 64 {
            return Err(serde::de::Error::custom("invalid signature length"));
        }
        let mut arr = [0u8; 64];
        arr.copy_from_slice(&bytes);
        Ok(Signature(arr))
    }
}

impl Signature {
    pub fn new(bytes: [u8; 64]) -> Self {
        Signature(bytes)
    }

    pub fn from_bytes(bytes: &[u8]) -> Option<Self> {
        if bytes.len() == 64 {
            let mut arr = [0u8; 64];
            arr.copy_from_slice(bytes);
            Some(Signature(arr))
        } else {
            None
        }
    }

    pub fn as_bytes(&self) -> &[u8; 64] {
        &self.0
    }
}

/// Nonce for replay protection.
pub type Nonce = u64;

/// Amount type (u128 for large values).
pub type Amount = u128;

/// Error types for primitive operations.
#[derive(Debug, Clone, thiserror::Error, Serialize, Deserialize)]
pub enum PrimitiveError {
    #[error("invalid account ID")]
    InvalidAccountId,
    #[error("invalid signature")]
    InvalidSignature,
    #[error("invalid asset ID")]
    InvalidAssetId,
    #[error("insufficient balance")]
    InsufficientBalance,
    #[error("invalid operation")]
    InvalidOperation,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_account_id_from_hex() {
        let hex = "0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF";
        let account = AccountId::from_hex(hex).unwrap();
        assert_eq!(format!("{}", account), "0123");
    }

    #[test]
    fn test_tx_hash_generation() {
        let data = b"test transaction data";
        let hash = TxHash::from_data(data);
        // Verify it's deterministic
        let hash2 = TxHash::from_data(data);
        assert_eq!(hash.0, hash2.0);
    }
}
