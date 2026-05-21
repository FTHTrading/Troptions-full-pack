#!/usr/bin/env python3
"""
Anchor TROPTIONS Anthem NFT data to TROPTIONS L1 blockchain.
Creates soulbound credentials for the anthem collection.
"""

import requests
import json
import hashlib
from datetime import datetime

# TROPTIONS L1 Node
L1_RPC = 'http://localhost:9944'
ISSUER = 'rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ'

# IPFS CIDs
IPFS_CIDS = {
    'troptions-theme-primary.mp3': 'QmX7Wc9MtXmwvG46qw8jViN27jjyUNG8dBLEFbUkYJ2ECb',
    'troptions-theme-alt.mp3': 'QmbGT6jyRMP1Q2fuW6cz8ByKPydZmgAZo4kVsVg4FWAS2A',
    'troptions-anthem-mainframe-152254.mp3': 'QmUjCZXLux8BnD17cNdBs3pTshtrswgKecjYpQiyMh7Def',
    'troptions-anthem-22-years.mp3': 'Qmcz2htAJFpaP2mcUT4CDCzVjMmbQoTVo8uQCWsTjNAKyV',
    'troptions-anthem-151853.mp3': 'QmddQzssL3RdNhCFfBSPFSLZBLpgyUvDbUnfWhmorU1Wsj',
    'troptions-anthem-elevenlabs-charlie.mp3': 'QmeLmHMuWvj556cjGR5snaVTtYG4hYTbDDkqe5xUA3j2XV',
    'manifest': 'Qmc54zWPjwuo666RGWh1Tf3nVJQvkmwLSVwmnFomCFP7o7'
}

def create_soulbound_credential():
    """Create a soulbound credential for the anthem collection."""
    
    # Create deterministic hash of collection
    collection_data = json.dumps(IPFS_CIDS, sort_keys=True)
    collection_hash = hashlib.sha256(collection_data.encode()).hexdigest()
    
    credential = {
        'type': 'soulbound_audio_credential',
        'version': '1.0',
        'title': 'TROPTIONS Anthem - Mainframe Explode NFT Collection',
        'collection_symbol': 'TANTHEM',
        'issuer': ISSUER,
        'created': datetime.now().isoformat(),
        'collection_hash': collection_hash,
        'total_nfts': 703,
        'total_tiers': 6,
        'ipfs_manifest': IPFS_CIDS['manifest'],
        'tracks': [
            {'name': 'Official TROPTIONS Song', 'cid': IPFS_CIDS['troptions-theme-primary.mp3'], 'tier': 'LEGENDARY', 'supply': 5},
            {'name': '22 Years Narrative', 'cid': IPFS_CIDS['troptions-anthem-22-years.mp3'], 'tier': 'EPIC', 'supply': 22},
            {'name': 'Latest Master Cut', 'cid': IPFS_CIDS['troptions-anthem-mainframe-152254.mp3'], 'tier': 'RARE', 'supply': 50},
            {'name': 'Alternate Studio Mix', 'cid': IPFS_CIDS['troptions-theme-alt.mp3'], 'tier': 'UNCOMMON', 'supply': 100},
            {'name': 'Session Edit', 'cid': IPFS_CIDS['troptions-anthem-151853.mp3'], 'tier': 'COMMON', 'supply': 500},
            {'name': 'AI Voice Edition (ElevenLabs Charlie)', 'cid': IPFS_CIDS['troptions-anthem-elevenlabs-charlie.mp3'], 'tier': 'SPECIAL', 'supply': 26}
        ],
        'license': 'Proprietary - FTH Trading',
        'external_url': 'https://fthtrading.github.io/Troptions-full-pack/',
        'metadata_standard': 'TROPTIONS L1 Soulbound v1.0'
    }
    
    return credential

def submit_to_l1(credential):
    """Submit credential to TROPTIONS L1 via JSON-RPC."""
    
    # Build L1 transaction payload
    payload = {
        'jsonrpc': '2.0',
        'id': 1,
        'method': 'soulbound_issue',
        'params': {
            'issuer': ISSUER,
            'recipient': 'TROPTIONS.IO',  # Brand domain as recipient
            'credential': credential,
            'fee': '0.05'
        }
    }
    
    try:
        response = requests.post(L1_RPC, json=payload, timeout=10)
        if response.status_code == 200:
            result = response.json()
            print('L1 Response:', json.dumps(result, indent=2))
            return result
        else:
            print(f'L1 Error: HTTP {response.status_code}')
            print(response.text[:200])
            return None
    except requests.exceptions.ConnectionError:
        print('L1 Connection Error: TROPTIONS L1 node not reachable at', L1_RPC)
        print('The credential has been prepared but not yet anchored.')
        return None
    except Exception as e:
        print(f'L1 Error: {str(e)[:200]}')
        return None

def save_anchor_manifest(credential, l1_result=None):
    """Save the complete anchor manifest."""
    
    manifest = {
        'anchored': datetime.now().isoformat(),
        'l1_status': 'PENDING' if l1_result is None else 'CONFIRMED',
        'l1_result': l1_result,
        'credential': credential,
        'proof': {
            'ipfs_gateway': 'https://gateway.pinata.cloud/ipfs/',
            'l1_rpc': L1_RPC,
            'verification_steps': [
                '1. Check IPFS: https://gateway.pinata.cloud/ipfs/' + IPFS_CIDS['manifest'],
                '2. Check L1: POST to http://localhost:9944 with soulbound_get method',
                '3. Verify collection hash: ' + credential['collection_hash']
            ]
        }
    }
    
    output_file = 'C:\\Users\\Kevan\\Troptions-full-pack\\TROPTIONS_L1_ANCHOR_MANIFEST.json'
    with open(output_file, 'w') as f:
        json.dump(manifest, f, indent=2)
    
    print(f'\nSaved L1 anchor manifest to: {output_file}')
    return manifest

if __name__ == '__main__':
    print('=== TROPTIONS L1 SOULBOUND ANCHOR ===')
    print(f'L1 Node: {L1_RPC}')
    print(f'Issuer: {ISSUER}')
    print()
    
    # Create credential
    credential = create_soulbound_credential()
    print(f'Collection Hash: {credential["collection_hash"]}')
    print(f'Total NFTs: {credential["total_nfts"]}')
    print(f'Total Tiers: {credential["total_tiers"]}')
    print()
    
    # Submit to L1
    print('Submitting to TROPTIONS L1...')
    l1_result = submit_to_l1(credential)
    
    # Save manifest
    manifest = save_anchor_manifest(credential, l1_result)
    
    print('\n=== ANCHOR COMPLETE ===')
    print(f'IPFS Manifest: https://gateway.pinata.cloud/ipfs/{IPFS_CIDS["manifest"]}')
    print(f'L1 Status: {manifest["l1_status"]}')
    if l1_result:
        print('Credential anchored to TROPTIONS L1!')
    else:
        print('Credential prepared. L1 submission requires node connectivity.')
