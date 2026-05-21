#!/usr/bin/env python3
"""Pin TROPTIONS Anthem files to IPFS via Pinata."""

import requests
import json
import os
import base64

# Pinata credentials
PINATA_JWT = 'eyJhbGc...Ptt4'  # Will use API Key/Secret instead
PINATA_API_KEY = '5b0f2ef48f8c0e5bc86e'
PINATA_API_SECRET = '07c54c7d7caeb917cb99d3059c63bfe3f76b71c8791e893f0ecc92a5a2856f16'

HEADERS = {
    'pinata_api_key': PINATA_API_KEY,
    'pinata_secret_api_key': PINATA_API_SECRET
}

def pin_file_to_ipfs(filepath):
    url = 'https://api.pinata.cloud/pinning/pinFileToIPFS'
    filename = os.path.basename(filepath)
    
    with open(filepath, 'rb') as f:
        files = {'file': (filename, f)}
        response = requests.post(url, files=files, headers=HEADERS, timeout=60)
    
    if response.status_code == 200:
        data = response.json()
        print(f'  Pinned: {filename}')
        print(f'    CID: {data["IpfsHash"]}')
        print(f'    Size: {data["PinSize"]} bytes')
        return data['IpfsHash']
    else:
        print(f'  Error pinning {filename}: {response.status_code}')
        print(f'    {response.text[:200]}')
        return None

def pin_json_to_ipfs(json_data, name):
    url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS'
    payload = {
        'pinataMetadata': {'name': name},
        'pinataContent': json_data
    }
    response = requests.post(url, json=payload, headers=HEADERS, timeout=30)
    
    if response.status_code == 200:
        data = response.json()
        print(f'  Pinned JSON: {name}')
        print(f'    CID: {data["IpfsHash"]}')
        return data['IpfsHash']
    else:
        print(f'  Error pinning JSON: {response.status_code}')
        return None

if __name__ == '__main__':
    base_dir = 'C:\\Users\\Kevan\\Troptions-full-pack\\docs\\technical\\assets\\audio'
    
    files_to_pin = [
        os.path.join(base_dir, 'troptions-theme-primary.mp3'),
        os.path.join(base_dir, 'troptions-theme-alt.mp3'),
        os.path.join(base_dir, 'troptions-anthem-mainframe-152254.mp3'),
        os.path.join(base_dir, 'troptions-anthem-22-years.mp3'),
        os.path.join(base_dir, 'troptions-anthem-151853.mp3'),
        os.path.join(base_dir, 'troptions-anthem-elevenlabs-charlie.mp3'),
    ]
    
    print('=== PINNING TROPTIONS ANTHEM TO IPFS ===')
    results = {}
    
    for filepath in files_to_pin:
        if os.path.exists(filepath):
            cid = pin_file_to_ipfs(filepath)
            if cid:
                results[os.path.basename(filepath)] = cid
        else:
            print(f'  File not found: {filepath}')
    
    # Pin lyrics JSON metadata
    lyrics_metadata = {
        'title': 'TROPTIONS Anthem - Mainframe Explode',
        'artist': 'FTH Trading',
        'created': '2026-05-21T12:53:00Z',
        'tracks': [
            {'name': 'Official TROPTIONS Song', 'file': 'troptions-theme-primary.mp3'},
            {'name': 'Alternate Studio Mix', 'file': 'troptions-theme-alt.mp3'},
            {'name': 'Latest Master Cut', 'file': 'troptions-anthem-mainframe-152254.mp3'},
            {'name': '22 Years Narrative', 'file': 'troptions-anthem-22-years.mp3'},
            {'name': 'Session Edit', 'file': 'troptions-anthem-151853.mp3'},
            {'name': 'ElevenLabs TTS (Charlie)', 'file': 'troptions-anthem-elevenlabs-charlie.mp3'},
        ],
        'ipfs_cids': results,
        'license': 'Proprietary - FTH Trading',
        'total_size_mb': 16.3
    }
    
    manifest_cid = pin_json_to_ipfs(lyrics_metadata, 'TROPTIONS Anthem Manifest')
    if manifest_cid:
        results['manifest'] = manifest_cid
    
    # Save results
    output_file = 'C:\\Users\\Kevan\\Troptions-full-pack\\TROPTIONS_IPFS_CIDS.json'
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=2)
    print(f'\nSaved CIDs to: {output_file}')
    print('\n=== PINNING COMPLETE ===')
