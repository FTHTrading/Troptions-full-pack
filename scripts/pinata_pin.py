#!/usr/bin/env python3
"""Pin TROPTIONS Anthem files to IPFS via Pinata.

Credentials: set PINATA_API_KEY and PINATA_API_SECRET in the environment
(or .env.pinata locally — never commit). See docs/deploy/secrets-setup.md.
"""

import json
import os
import sys

import requests

PINATA_API_KEY = os.getenv("PINATA_API_KEY", "")
PINATA_API_SECRET = os.getenv("PINATA_API_SECRET", "")


def _headers():
    if not PINATA_API_KEY or not PINATA_API_SECRET:
        print(
            "Missing PINATA_API_KEY or PINATA_API_SECRET in environment.",
            file=sys.stderr,
        )
        sys.exit(1)
    return {
        "pinata_api_key": PINATA_API_KEY,
        "pinata_secret_api_key": PINATA_API_SECRET,
    }


def pin_file_to_ipfs(filepath):
    url = "https://api.pinata.cloud/pinning/pinFileToIPFS"
    filename = os.path.basename(filepath)

    with open(filepath, "rb") as f:
        files = {"file": (filename, f)}
        response = requests.post(
            url, files=files, headers=_headers(), timeout=60
        )

    if response.status_code == 200:
        data = response.json()
        print(f"  Pinned: {filename}")
        print(f"    CID: {data['IpfsHash']}")
        print(f"    Size: {data['PinSize']} bytes")
        return data["IpfsHash"]
    print(f"  Error pinning {filename}: {response.status_code}")
    print(f"    {response.text[:200]}")
    return None


def pin_json_to_ipfs(json_data, name):
    url = "https://api.pinata.cloud/pinning/pinJSONToIPFS"
    payload = {
        "pinataMetadata": {"name": name},
        "pinataContent": json_data,
    }
    response = requests.post(url, json=payload, headers=_headers(), timeout=30)

    if response.status_code == 200:
        data = response.json()
        print(f"  Pinned JSON: {name}")
        print(f"    CID: {data['IpfsHash']}")
        return data["IpfsHash"]
    print(f"  Error pinning JSON: {response.status_code}")
    return None


if __name__ == "__main__":
    root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    base_dir = os.path.join(root, "docs", "technical", "assets", "audio")

    files_to_pin = [
        os.path.join(base_dir, "troptions-theme-primary.mp3"),
        os.path.join(base_dir, "troptions-theme-alt.mp3"),
        os.path.join(base_dir, "troptions-anthem-mainframe-152254.mp3"),
        os.path.join(base_dir, "troptions-anthem-22-years.mp3"),
        os.path.join(base_dir, "troptions-anthem-151853.mp3"),
        os.path.join(base_dir, "troptions-anthem-elevenlabs-charlie.mp3"),
    ]

    print("=== PINNING TROPTIONS ANTHEM TO IPFS ===")
    results = {}

    for filepath in files_to_pin:
        if os.path.exists(filepath):
            cid = pin_file_to_ipfs(filepath)
            if cid:
                results[os.path.basename(filepath)] = cid
        else:
            print(f"  File not found: {filepath}")

    lyrics_metadata = {
        "title": "TROPTIONS Anthem - Mainframe Explode",
        "artist": "FTH Trading",
        "tracks": list(results.keys()),
        "ipfs_cids": results,
        "license": "Proprietary - FTH Trading",
    }

    manifest_cid = pin_json_to_ipfs(lyrics_metadata, "TROPTIONS Anthem Manifest")
    if manifest_cid:
        results["manifest"] = manifest_cid

    output_file = os.path.join(root, "TROPTIONS_IPFS_CIDS.json")
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)
    print(f"\nSaved CIDs to: {output_file}")
    print("\n=== PINNING COMPLETE ===")
