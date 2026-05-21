#![allow(dead_code)]

//! TROPTIONS Media System (TNN / Web3 TV)
//!
//! Tracks Web3 TV / TNN content, episodes, guests, sponsorships, and rights.
//!
//! Safety posture:
//! - `live_execution_enabled = false`
//! - `simulation_only = true`
//! - No live payment or token processing
//! - No live NFT minting
//! - No live content distribution beyond simulation
//! - All episode data is documentation/metadata only

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use uuid::Uuid;

pub mod errors;
pub mod types;

pub use errors::MediaError;
pub use types::*;

pub const LIVE_EXECUTION_ENABLED: bool = false;
pub const SIMULATION_ONLY: bool = true;

pub const MEDIA_DISCLAIMER: &str = "\
TROPTIONS Media / TNN / Web3 TV is content and episode documentation only. \
No live streaming, video delivery, media rights sale, sponsorship payment, \
or token minting is enabled. All live media operations require platform approval.";

/// Media episode record in the content engine.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MediaEpisodeRecord {
    pub episode_id: Uuid,
    pub show_name: String,
    pub episode_number: u32,
    pub episode_title_hash: String,
    pub guest_type: GuestType,
    pub guest_name: String,
    pub status: EpisodeStatus,
    pub guest_release_hash: Option<String>,
    pub sponsor_agreement_hash: Option<String>,
    pub transcript_hash: Option<String>,
    pub media_url: Option<String>,
    pub evidence_hashes: Vec<String>,
    pub risk_flags: Vec<String>,
    pub released_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl MediaEpisodeRecord {
    /// Create new episode record.
    pub fn new(show_name: &str, episode_number: u32, title: &str, guest_type: GuestType, guest_name: &str) -> Self {
        let title_hash = Self::hash_content(title);
        MediaEpisodeRecord {
            episode_id: Uuid::new_v4(),
            show_name: show_name.to_string(),
            episode_number,
            episode_title_hash: title_hash,
            guest_type,
            guest_name: guest_name.to_string(),
            status: EpisodeStatus::Draft,
            guest_release_hash: None,
            sponsor_agreement_hash: None,
            transcript_hash: None,
            media_url: None,
            evidence_hashes: Vec::new(),
            risk_flags: Vec::new(),
            released_at: None,
            created_at: Utc::now(),
            updated_at: Utc::now(),
        }
    }

    /// Attach guest release (media rights).
    pub fn attach_guest_release(&mut self, release_hash: String) -> Result<(), MediaError> {
        self.guest_release_hash = Some(release_hash);
        self.updated_at = Utc::now();
        Ok(())
    }

    /// Attach sponsor agreement.
    pub fn attach_sponsor_agreement(&mut self, agreement_hash: String) -> Result<(), MediaError> {
        self.sponsor_agreement_hash = Some(agreement_hash);
        self.updated_at = Utc::now();
        Ok(())
    }

    /// Update episode status.
    pub fn update_status(&mut self, new_status: EpisodeStatus) -> Result<(), MediaError> {
        // Validation rules
        match new_status {
            EpisodeStatus::Published => {
                // Must have guest release if required
                if self.guest_release_hash.is_none() {
                    return Err(MediaError::PublishBlockedMissingRelease);
                }
                // Sponsored episodes need agreement
                if self.status == EpisodeStatus::Draft
                    && self.sponsor_agreement_hash.is_none()
                {
                    return Err(MediaError::PublishBlockedMissingSponsorship);
                }
            }
            EpisodeStatus::Blocked => {
                // Can block from any state
            }
            _ => {}
        }

        self.status = new_status;
        self.updated_at = Utc::now();

        if new_status == EpisodeStatus::Published {
            self.released_at = Some(Utc::now());
        }

        Ok(())
    }

    /// Generate deterministic episode hash.
    pub fn compute_episode_hash(&self) -> String {
        let mut hasher = Sha256::new();
        let json = serde_json::json!({
            "episode_id": self.episode_id.to_string(),
            "show_name": self.show_name,
            "episode_number": self.episode_number,
            "title_hash": self.episode_title_hash,
            "guest_type": format!("{:?}", self.guest_type),
            "guest_name": self.guest_name,
            "status": format!("{:?}", self.status),
        });
        hasher.update(serde_json::to_string(&json).unwrap_or_default().as_bytes());
        format!("{:x}", hasher.finalize())
    }

    fn hash_content(content: &str) -> String {
        let mut hasher = Sha256::new();
        hasher.update(content.as_bytes());
        format!("{:x}", hasher.finalize())
    }
}

/// Media content engine — tracks all TNN / Web3 TV episodes.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MediaContentEngine {
    pub episodes: std::collections::BTreeMap<Uuid, MediaEpisodeRecord>,
    pub engine_hash: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl MediaContentEngine {
    /// Initialize new content engine.
    pub fn new() -> Self {
        MediaContentEngine {
            episodes: std::collections::BTreeMap::new(),
            engine_hash: String::new(),
            created_at: Utc::now(),
            updated_at: Utc::now(),
        }
    }

    /// Add episode.
    pub fn add_episode(&mut self, episode: MediaEpisodeRecord) -> Result<Uuid, MediaError> {
        let episode_id = episode.episode_id;
        self.episodes.insert(episode_id, episode);
        self.updated_at = Utc::now();
        self.engine_hash = self.compute_engine_hash();
        Ok(episode_id)
    }

    /// Get episode.
    pub fn get_episode(&self, episode_id: Uuid) -> Option<&MediaEpisodeRecord> {
        self.episodes.get(&episode_id)
    }

    /// Get episode mutable.
    pub fn get_episode_mut(&mut self, episode_id: Uuid) -> Option<&mut MediaEpisodeRecord> {
        self.episodes.get_mut(&episode_id)
    }

    /// List episodes by status.
    pub fn list_by_status(&self, status: EpisodeStatus) -> Vec<&MediaEpisodeRecord> {
        self.episodes
            .values()
            .filter(|ep| ep.status == status)
            .collect()
    }

    /// Compute deterministic engine hash.
    pub fn compute_engine_hash(&self) -> String {
        let mut hasher = Sha256::new();
        let sorted_json = serde_json::to_string(&self.episodes)
            .unwrap_or_default();
        hasher.update(sorted_json.as_bytes());
        format!("{:x}", hasher.finalize())
    }

    /// Generate summary.
    pub fn generate_summary(&self) -> MediaEngineSummary {
        let published = self.list_by_status(EpisodeStatus::Published).len();
        let draft = self.list_by_status(EpisodeStatus::Draft).len();
        let blocked = self.list_by_status(EpisodeStatus::Blocked).len();

        MediaEngineSummary {
            total_episodes: self.episodes.len(),
            published_count: published,
            draft_count: draft,
            blocked_count: blocked,
            engine_hash: self.engine_hash.clone(),
            disclaimer: MEDIA_DISCLAIMER.to_string(),
        }
    }
}

impl Default for MediaContentEngine {
    fn default() -> Self {
        Self::new()
    }
}

/// Summary of media content engine.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MediaEngineSummary {
    pub total_episodes: usize,
    pub published_count: usize,
    pub draft_count: usize,
    pub blocked_count: usize,
    pub engine_hash: String,
    pub disclaimer: String,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_create_episode() {
        let episode = MediaEpisodeRecord::new(
            "TNN Spotlight",
            1,
            "First Episode",
            GuestType::Athlete,
            "John Doe",
        );
        assert_eq!(episode.status, EpisodeStatus::Draft);
        assert!(!episode.episode_title_hash.is_empty());
    }

    #[test]
    fn test_publish_requires_release() {
        let mut episode = MediaEpisodeRecord::new(
            "TNN",
            1,
            "Episode",
            GuestType::Creator,
            "Guest",
        );
        assert!(episode.update_status(EpisodeStatus::Published).is_err());
    }

    #[test]
    fn test_episode_hash_deterministic() {
        let ep1 = MediaEpisodeRecord::new("TNN", 1, "Title", GuestType::Athlete, "Name");
        let ep2 = MediaEpisodeRecord::new("TNN", 1, "Title", GuestType::Athlete, "Name");
        // Same inputs produce same title hash
        assert_eq!(ep1.episode_title_hash, ep2.episode_title_hash);
    }

    #[test]
    fn test_content_engine() {
        let mut engine = MediaContentEngine::new();
        let episode = MediaEpisodeRecord::new("TNN", 1, "Title", GuestType::Athlete, "Name");
        let id = engine.add_episode(episode).unwrap();
        assert_eq!(engine.episodes.len(), 1);
        assert!(engine.get_episode(id).is_some());
    }
}
