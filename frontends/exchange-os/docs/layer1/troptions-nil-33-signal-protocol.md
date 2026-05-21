# Troptions NIL 33-Signal Protocol

## Overview

The NIL valuation model uses exactly **33 weighted signals** grouped into **6 category buckets** to compute a composite score (0–100). The composite score maps to a valuation estimate band with a USD range. All outputs are **estimates only** — not guaranteed NIL income or deal values.

---

## Composite Score Formula

$$\text{composite} = \frac{\sum_{i=1}^{33} (w_i \times s_i)}{\sum_{i=1}^{33} w_i}$$

where $w_i$ is the signal weight (0.5–2.0) and $s_i$ is the normalized signal value (0.0–1.0).

The estimate base is:

$$\text{base} = 1.065^{\text{composite}} \times 12$$

- `estimateLow = base × 0.75`
- `estimateHigh = base × 1.35`

The exponent `1.065` and multiplier `12` are model parameters. They do not represent any guaranteed market rate, sponsorship fee, or income level.

---

## Signal Buckets

### Bucket 1 — Identity & Verification (6 signals)

| Signal | Description | Weight |
|---|---|---|
| `kyc_tier` | Athlete KYC verification level | 2.0 |
| `institution_verified` | Institution code confirmed active | 1.5 |
| `eligibility_status` | Current NCAA/NAIA/NJCAA eligibility status | 2.0 |
| `guardian_consent` | Minor guardian consent on file | 1.5 |
| `agent_representation` | Licensed NIL agent representation | 1.0 |
| `state_registration` | Athlete registered in applicable state NIL registry | 1.5 |

### Bucket 2 — Performance Proof (7 signals)

| Signal | Description | Weight |
|---|---|---|
| `sport_performance_index` | Composite sport performance metric | 2.0 |
| `ranking_national` | National ranking within sport | 1.5 |
| `ranking_regional` | Regional/conference ranking | 1.0 |
| `awards_and_honors` | Official awards count (annual) | 1.0 |
| `draft_projection` | Professional draft projection percentile | 1.5 |
| `stats_percentile` | Statistical performance percentile in sport | 1.5 |
| `injury_history_score` | Adjusted score based on injury history | 1.0 |

### Bucket 3 — Recruiting & Exposure (5 signals)

| Signal | Description | Weight |
|---|---|---|
| `recruiting_class_rank` | National recruiting rank at time of commitment | 1.5 |
| `transfer_portal_activity` | Transfer portal participation and status | 1.0 |
| `media_coverage_score` | Volume and reach of media coverage | 1.5 |
| `broadcast_appearances` | Number of nationally broadcast appearances | 1.0 |
| `highlight_reel_score` | Engagement score on highlight content | 0.5 |

### Bucket 4 — Market & Reach (7 signals)

| Signal | Description | Weight |
|---|---|---|
| `social_media_following` | Total cross-platform following | 2.0 |
| `social_engagement_rate` | Engagement rate across platforms | 1.5 |
| `brand_affinity_score` | Brand alignment and appeal index | 1.5 |
| `market_region_value` | DMA/market valuation of institution geography | 1.0 |
| `alumni_network_value` | Alumni network size and NIL ecosystem activity | 1.0 |
| `merchandise_sales` | Official athlete merchandise sales data | 1.0 |
| `nft_collectible_demand` | Simulated demand index for athlete collectibles | 0.5 |

### Bucket 5 — Compliance & Eligibility (5 signals)

| Signal | Description | Weight |
|---|---|---|
| `nil_law_state_score` | Applicable state NIL law permissiveness score | 2.0 |
| `institution_nil_policy` | Institution NIL policy overlay compliance | 1.5 |
| `pay_for_play_risk` | Pay-for-play risk assessment (lower = better) | 2.0 |
| `amateurism_risk` | Amateurism violation risk score | 1.5 |
| `disclosure_compliance` | Athlete and institution disclosure compliance status | 1.0 |

### Bucket 6 — Deal Execution (3 signals)

| Signal | Description | Weight |
|---|---|---|
| `deal_history_count` | Number of prior completed NIL deals | 1.0 |
| `avg_deal_value_historical` | Average historical deal value (USD) | 1.5 |
| `deal_completion_rate` | Percentage of deals completed without issue | 1.0 |

---

## Signal Validation

`crates/nil/src/signals.rs` provides compile-time validation:

```rust
pub const NIL_SIGNAL_COUNT: usize = 33;
pub const NIL_SIGNAL_BUCKET_COUNT: usize = 6;

// Validated at test time via test_01_exactly_33_signals_defined
pub fn get_all_signals() -> Vec<NilSignalDefinition> { ... }
```

The integration test `test_01_exactly_33_signals_defined` asserts:

```rust
assert_eq!(signals.len(), 33, "NIL protocol must have exactly 33 signals");
```

---

## Valuation Band Mapping

| Band | Composite Score | Interpretation |
|---|---|---|
| `InsufficientData` | 0–14 | Not enough signals to estimate |
| `Emerging` | 15–39 | Early-stage NIL presence |
| `Developing` | 40–64 | Growing regional profile |
| `Established` | 65–84 | Consistent multi-market reach |
| `Elite` | 85–100 | National/premium NIL profile |

All band labels and USD ranges are **model estimates only**. They do not represent actual market clearing prices, guaranteed deal values, or income projections. Legal and institutional review is required before presenting any valuation output to athletes, agents, or brands.

---

## Disclaimer (Required on All Outputs)

> ESTIMATE ONLY — not a guaranteed NIL value, deal, income, or endorsement amount. Composite scores are model-based simulations. Actual NIL deal values depend on negotiation, market conditions, institution policy, state law, and brand decisions. No pay-for-play or amateurism-violating structures are permitted.
