#!/usr/bin/env python3
"""Generate TTS for TROPTIONS Anthem using ElevenLabs API."""

import requests
import json
import os

# ElevenLabs API
API_KEY = 'sk_f076875223b57ab0cfeb2b44c62c057b5a22816520b37bf2'
VOICE_ID = 'IKne3meq5aSn9XLyUdCD'

def generate_tts(text, output_path, voice_id=VOICE_ID):
    url = f'https://api.elevenlabs.io/v1/text-to-speech/{voice_id}'
    headers = {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json'
    }
    data = {
        'text': text,
        'model_id': 'eleven_monolingual_v1',
        'voice_settings': {
            'stability': 0.5,
            'similarity_boost': 0.5
        }
    }
    
    response = requests.post(url, headers=headers, json=data, timeout=30)
    print(f'Status: {response.status_code}')
    print(f'Size: {len(response.content)} bytes')
    
    if response.status_code == 200:
        with open(output_path, 'wb') as f:
            f.write(response.content)
        print(f'Saved to: {output_path}')
        return True
    else:
        print(f'Error: {response.text[:500]}')
        return False

if __name__ == '__main__':
    # Anthem chorus
    text = "Look at us now, TROPTIONS on top, shout out loud our name! From Rust L1 to the chain, we broke all the rules, son! Twenty-two years deep. Macon strong! Georgia!"
    output = 'C:\\Users\\Kevan\\Troptions-full-pack\\docs\\technical\\assets\\audio\\troptions-anthem-elevenlabs-charlie.mp3'
    generate_tts(text, output)
