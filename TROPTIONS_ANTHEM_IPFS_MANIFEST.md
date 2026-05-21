# TROPTIONS Anthem — Mainframe Explode
## IPFS + On-Chain Manifest
## Date: 2026-05-21 12:53 PM EDT
## Status: PREPARING FOR IPFS PIN + L1 ANCHOR

---

## 🎵 ANTHEM CATALOG

### 5 Canonical Tracks (16.3 MB total)

| # | Track Name | Source File | Repo File | Size | Description |
|---|-----------|-------------|-----------|------|-------------|
| 1 | **Official TROPTIONS Song** | `troptions song Mainframe_Explode_2026-05-21T144908.mp3` | `troptions-theme-primary.mp3` | 3.34 MB | Main brand anthem |
| 2 | **Alternate Studio Mix** | `troptions song 2 Mainframe_Explode_2026-05-21T144908.mp3` | `troptions-theme-alt.mp3` | 3.68 MB | Second pass, same session |
| 3 | **Latest Master Cut** | `Mainframe_Explode_2026-05-21T152254.mp3` | `troptions-anthem-mainframe-152254.mp3` | 3.06 MB | Latest Mainframe Explode master |
| 4 | **22 Years Narrative Mix** | `Mainframe_22 yrs 3Explode_2026-05-21T150232 (1).mp3` | `troptions-anthem-22-years.mp3` | 3.15 MB | Timeline narrative — 22 years deep |
| 5 | **Session Edit** | `Mainframe_Explode_2026-05-21T151853.mp3` | `troptions-anthem-151853.mp3` | 3.06 MB | Earlier timing export from same session |

**Total: ~16.3 MB**
**License: Proprietary — FTH Trading (internal/brand use only)**

---

## 📝 LYRICS — Mainframe Explode

### Intro — Hype Beat Drop
Yeah! (ATL!)  
TROPTIONS! (Macon!)  
Let's get it! (Uh!)

### Verse 1
Back in '03, world was sleepin', analog dreams, yeah,  
Macon, Georgia birthed it, we crushed those old schemes.  
Digital ledger, that's what we brought to the game, still,  
Knocked on Washington's door, shoutin' out our name.  
SEC came next, tried to hold back our light,  
They challenged our vision, but we held on tight, that's right.

### Pre-Chorus
They doubted the grind, talked slick behind our backs, fools,  
But we never paused, stayed on these digital tracks.

### Chorus
Look at us now, yeah, we runnin' this game, homie,  
TROPTIONS on top, shout out loud our name!  
From Rust L1 to the chain, we broke all the rules, son,  
They tried to stop us, but we built all the tools! (Yeah!)  
Look at us now! (C'mon!)

### Verse 2
Headlines screamin', legal drama, felt the heat, nah,  
Thought we'd crumble, but we stood on our own two feet.  
Showed 'em the books, every single dime was clean, no dirt,  
No verdicts dropped, no charges, know what I mean, fam?  
All that talkin' disappeared, they had nothing to say, huh,  
TROPTIONS still here, watch us lead the way, every day.

### Pre-Chorus
They doubted the grind, talked slick behind our backs, fools,  
But we never paused, stayed on these digital tracks.

### Chorus
Look at us now, yeah, we runnin' this game, homie,  
TROPTIONS on top, shout out loud our name!  
From Rust L1 to the chain, we broke all the rules, son,  
They tried to stop us, but we built all the tools! (Yeah!)  
Look at us now! (Uh huh!)

### Bridge — Breakdown
Twenty-two years deep, put in blood, sweat, and tears, no lie,  
AI agents rollin', no more baseless fears. (None!)  
NEEDAI, CLAWD, Popeye, makin' moves every day, word,  
Hunnid seventy-five mil, no one standing in our way!

**⚠️ Honesty Note (Bridge):**
- **"$175M"** — Brand narrative / operator attestation only. Verify via Exchange OS proof docs before external citation.
- **NEEDAI, CLAWD, Popeye** — Optional branch references; not all merged to main.

### Outro — Fade Out
Yeah, TROPTIONS worldwide! (Worldwide, for real!)  
Still here, still ridin' high! (Ridin' high, baby!)  
Look at us now! (Uh huh, now!)  
Macon strong! (Georgia!)

---

## 🎯 IPFS PIN PLAN

### Step 1: Pin Audio Files
| File | CID (after pin) | Status |
|------|-----------------|--------|
| `troptions-theme-primary.mp3` | PENDING | ⏳ |
| `troptions-theme-alt.mp3` | PENDING | ⏳ |
| `troptions-anthem-mainframe-152254.mp3` | PENDING | ⏳ |
| `troptions-anthem-22-years.mp3` | PENDING | ⏳ |
| `troptions-anthem-151853.mp3` | PENDING | ⏳ |

### Step 2: Pin Lyrics Document
| File | CID (after pin) | Status |
|------|-----------------|--------|
| `TROPTIONS_ANTHEM_LYRICS.md` | PENDING | ⏳ |
| `anthem.md` (rendered) | PENDING | ⏳ |

### Step 3: Pin Complete Manifest
| File | CID (after pin) | Status |
|------|-----------------|--------|
| `TROPTIONS_ANTHEM_IPFS_MANIFEST.md` | PENDING | ⏳ |

---

## ⛓️ TROPTIONS L1 ANCHOR PLAN

### Soulbound Credential for Anthem
```json
{
  "type": "soulbound_audio_credential",
  "title": "TROPTIONS Anthem — Mainframe Explode",
  "artist": "FTH Trading",
  "created": "2026-05-21T12:53:00Z",
  "tracks": 5,
  "total_size_mb": 16.3,
  "license": "Proprietary — FTH Trading",
  "ipfs_cids": {
    "primary": "<CID>",
    "alt": "<CID>",
    "master": "<CID>",
    "narrative": "<CID>",
    "session": "<CID>"
  },
  "lyrics_cid": "<CID>",
  "manifest_cid": "<CID>",
  "issuer": "rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ",
  "signature": "<Ed25519_signature>"
}
```

### L1 Transaction
- **Method:** `soulbound_issue`
- **Issuer:** `rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ` (XRPL) → mapped to TROPTIONS L1
- **Recipient:** Genesis brand domain `TROPTIONS.IO`
- **Metadata:** IPFS CID of manifest
- **Fee:** 0.05 SOL equivalent in TROPTIONS gas

---

## 🛠️ EXECUTION CHECKLIST

| # | Task | Tool | Status |
|---|------|------|--------|
| 1 | Pin 5 MP3 files to IPFS | Pinata API | ⏳ PENDING |
| 2 | Pin lyrics markdown to IPFS | Pinata API | ⏳ PENDING |
| 3 | Pin this manifest to IPFS | Pinata API | ⏳ PENDING |
| 4 | Generate IPFS CIDs | Pinata response | ⏳ PENDING |
| 5 | Create soulbound credential JSON | Python script | ⏳ PENDING |
| 6 | Sign credential with issuer key | Ed25519 | ⏳ PENDING |
| 7 | Submit to TROPTIONS L1 | JSON-RPC to :9944 | ⏳ PENDING |
| 8 | Verify on-chain | L1 query | ⏳ PENDING |
| 9 | Update investor site | GitHub Pages deploy | ⏳ PENDING |

---

## 📁 FILE LOCATIONS

| Type | Path |
|------|------|
| Source MP3s (Desktop) | `C:\Users\Kevan\OneDrive - FTH Trading\Desktop\*.mp3` |
| Repo MP3s | `Troptions-full-pack\docs\technical\assets\audio\*.mp3` |
| Lyrics (canonical) | `Troptions-full-pack\docs\technical\assets\audio\TROPTIONS_ANTHEM_LYRICS.md` |
| Lyrics (Jekyll) | `Troptions-full-pack\docs\technical\media\anthem.md` |
| Catalog README | `Troptions-full-pack\docs\technical\assets\audio\README.md` |
| This manifest | `Troptions-full-pack\TROPTIONS_ANTHEM_IPFS_MANIFEST.md` |

---

## 🔐 PINATA CREDENTIALS

**Source:** `C:\Users\Kevan\Documents\UNYKORN_Ecosystem\.env`
- PINATA_JWT: Available
- PINATA_API_KEY: Available
- PINATA_SECRET_KEY: Available

**Ready to execute pinning.**

---

**Status: MANIFEST CREATED ✅**
**Next: Execute IPFS pinning + L1 anchoring**
**Ready when you provide ElevenLabs API or confirm execution.**
