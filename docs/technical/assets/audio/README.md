# TROPTIONS theme audio

Canonical **Mainframe Explode** tracks for the public showcase ([GitHub Pages](https://fthtrading.github.io/Troptions-full-pack/)). **Not royalty-free** for third parties — proprietary **FTH Trading**; internal and brand use only.

## IPFS permanence (PROVEN — 2026-05-21)

Six audio files and one JSON manifest are content-addressed on IPFS (~16.3 MB audio total). Gateway links use the public resolver:

`https://ipfs.io/ipfs/{cid}`

| Track | CID | Gateway |
|-------|-----|---------|
| Official TROPTIONS song (`troptions-theme-primary.mp3`) | `QmX7Wc9MtXmwvG46qw8jViN27jjyUNG8dBLEFbUkYJ2ECb` | [Play](https://ipfs.io/ipfs/QmX7Wc9MtXmwvG46qw8jViN27jjyUNG8dBLEFbUkYJ2ECb) |
| Alternate studio mix (`troptions-theme-alt.mp3`) | `QmbGT6jyRMP1Q2fuW6cz8ByKPydZmgAZo4kVsVg4FWAS2A` | [Play](https://ipfs.io/ipfs/QmbGT6jyRMP1Q2fuW6cz8ByKPydZmgAZo4kVsVg4FWAS2A) |
| Latest master cut (`troptions-anthem-mainframe-152254.mp3`) | `QmUjCZXLux8BnD17cNdBs3pTshtrswgKecjYpQiyMh7Def` | [Play](https://ipfs.io/ipfs/QmUjCZXLux8BnD17cNdBs3pTshtrswgKecjYpQiyMh7Def) |
| 22 years narrative (`troptions-anthem-22-years.mp3`) | `Qmcz2htAJFpaP2mcUT4CDCzVjMmbQoTVo8uQCWsTjNAKyV` | [Play](https://ipfs.io/ipfs/Qmcz2htAJFpaP2mcUT4CDCzVjMmbQoTVo8uQCWsTjNAKyV) |
| Session edit (`troptions-anthem-151853.mp3`) | `QmddQzssL3RdNhCFfBSPFSLZBLpgyUvDbUnfWhmorU1Wsj` | [Play](https://ipfs.io/ipfs/QmddQzssL3RdNhCFfBSPFSLZBLpgyUvDbUnfWhmorU1Wsj) |
| **ElevenLabs Charlie (featured)** (`troptions-anthem-elevenlabs-charlie.mp3`, ~154 KB) | `QmeLmHMuWvj556cjGR5snaVTtYG4hYTbDDkqe5xUA3j2XV` | [Play](https://ipfs.io/ipfs/QmeLmHMuWvj556cjGR5snaVTtYG4hYTbDDkqe5xUA3j2XV) |
| **Manifest** (CIDs + NFT tier metadata) | `Qmc54zWPjwuo666RGWh1Tf3nVJQvkmwLSVwmnFomCFP7o7` | [Open](https://ipfs.io/ipfs/Qmc54zWPjwuo666RGWh1Tf3nVJQvkmwLSVwmnFomCFP7o7) |

Repo map: `TROPTIONS_IPFS_CIDS.json` (root). Pinata gateway (alternate): `https://gateway.pinata.cloud/ipfs/{cid}`.

## Published catalog (GitHub Pages + investor site)

| Repo / site file | What it represents | IPFS |
|------------------|-------------------|------|
| `troptions-theme-primary.mp3` | Official **TROPTIONS song** — main brand anthem | [CID](https://ipfs.io/ipfs/QmX7Wc9MtXmwvG46qw8jViN27jjyUNG8dBLEFbUkYJ2ECb) |
| `troptions-theme-alt.mp3` | Alternate studio mix | [CID](https://ipfs.io/ipfs/QmbGT6jyRMP1Q2fuW6cz8ByKPydZmgAZo4kVsVg4FWAS2A) |
| `troptions-anthem-mainframe-152254.mp3` | Latest Mainframe Explode master cut | [CID](https://ipfs.io/ipfs/QmUjCZXLux8BnD17cNdBs3pTshtrswgKecjYpQiyMh7Def) |
| `troptions-anthem-22-years.mp3` | **22 years** narrative mix | [CID](https://ipfs.io/ipfs/Qmcz2htAJFpaP2mcUT4CDCzVjMmbQoTVo8uQCWsTjNAKyV) |
| `troptions-anthem-151853.mp3` | Shorter session export | [CID](https://ipfs.io/ipfs/QmddQzssL3RdNhCFfBSPFSLZBLpgyUvDbUnfWhmorU1Wsj) |
| `troptions-anthem-elevenlabs-charlie.mp3` | **ElevenLabs Charlie** AI voice edition (featured on investor site) | [CID](https://ipfs.io/ipfs/QmeLmHMuWvj556cjGR5snaVTtYG4hYTbDDkqe5xUA3j2XV) |

**Local MP3 binaries** may be omitted from git (size); IPFS CIDs are the permanence proof. Investor site players use IPFS gateways first.

## XRPL NFT collection (TANTHEM)

| Field | Value |
|-------|--------|
| Symbol | `TANTHEM` |
| Supply | 703 (6 tiers) |
| Issuer | `rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ` |
| Transfer fee | 2.5% |
| Mint on ledger | **PREPARED** — unsigned batch in `XRPL_MINT_BATCH.json` |

Full tier table and mint instructions: [`TANTHEM_NFT_COLLECTION.md`](../../TANTHEM_NFT_COLLECTION.html).

**Mint (operator, local only):** run `scripts/xrpl_mint_ready.py` with the issuer seed on an operator machine. **Never** commit seeds, `.env` seeds, or signed transaction blobs to this repo.

## Desktop inventory (not committed)

Twelve MP3s were on the Desktop (2026-05-21); seven were skipped as near-duplicates of the five studio masters above. ElevenLabs Charlie was generated separately (~154 KB) and pinned as the SPECIAL tier.

Desktop path used for studio copies: `C:\Users\Kevan\OneDrive - FTH Trading\Desktop\`

## Lyrics

Canonical text: [`TROPTIONS_ANTHEM_LYRICS.md`](TROPTIONS_ANTHEM_LYRICS.md) (this folder).

| Pages URL | Purpose |
|-----------|---------|
| `/` | Home — **TROPTIONS Anthem** (IPFS players + featured Charlie) |
| `/anthem/` | Lyrics + honesty footnotes |
| `/assets/audio/TROPTIONS_ANTHEM_LYRICS.md` | Raw markdown |
| `/technical/TANTHEM_NFT_COLLECTION.html` | NFT rarity + mint status |

**Honesty (Bridge):**

- **“Hunnid seventy-five mil…”** — Brand narrative / operator attestation only; verify via [Exchange OS proof docs](/Troptions-full-pack/proof/on-chain-proofs.html) before external citation.
- **NEEDAI, CLAWD, Popeye** — Optional branch references; not all agent integrations are on `main`. Do not imply live production status from the anthem bridge alone.

## License

**Proprietary — FTH Trading.** Authorized for TROPTIONS brand and internal use. Do not redistribute, sample, or sublicense without written permission from FTH Trading.
