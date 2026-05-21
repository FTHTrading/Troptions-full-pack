use serde::{Deserialize, Serialize};

/// Episode status in content engine.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum EpisodeStatus {
    Draft,
    Scheduled,
    Recorded,
    Editing,
    Published,
    Archived,
    Blocked,
}

/// Type of guest on an episode.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum GuestType {
    Creator,
    Athlete,
    Merchant,
    Charity,
    Sponsor,
    Founder,
    Educator,
    Partner,
}
