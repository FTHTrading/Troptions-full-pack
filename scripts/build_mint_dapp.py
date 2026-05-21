#!/usr/bin/env python3
"""
Build a secure XRPL NFT Minting DApp for TROPTIONS Anthem.
This creates an HTML file that runs locally in the browser.
The seed is NEVER sent to any server — all signing happens client-side via xrpl.js.
"""

import json
from datetime import datetime

# Load the prepared mint batch
with open('C:\\Users\\Kevan\\Troptions-full-pack\\XRPL_MINT_BATCH.json', 'r') as f:
    mint_batch = json.load(f)

HTML_TEMPLATE = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TROPTIONS Anthem — Secure NFT Mint</title>
    <script src="https://unpkg.com/xrpl@2.14.0/build/xrpl-latest-min.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
            color: #fff;
            min-height: 100vh;
            padding: 20px;
        }
        .container { max-width: 900px; margin: 0 auto; }
        h1 {
            text-align: center;
            font-size: 2.5rem;
            background: linear-gradient(90deg, #FFD700, #FF6B6B);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
        }
        .subtitle { text-align: center; color: #888; margin-bottom: 30px; }
        .card {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 20px;
        }
        .card h2 { color: #FFD700; margin-bottom: 16px; }
        .seed-input {
            width: 100%;
            padding: 16px;
            background: rgba(0,0,0,0.3);
            border: 2px solid #333;
            border-radius: 8px;
            color: #FFD700;
            font-family: monospace;
            font-size: 1.1rem;
            margin-bottom: 12px;
        }
        .seed-input:focus {
            outline: none;
            border-color: #FFD700;
        }
        .warning {
            background: rgba(255, 193, 7, 0.1);
            border: 1px solid #FFC107;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 20px;
            color: #FFC107;
        }
        .btn {
            display: inline-block;
            padding: 16px 32px;
            background: linear-gradient(90deg, #FFD700, #FF8C00);
            color: #000;
            font-weight: bold;
            font-size: 1.1rem;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: transform 0.2s;
        }
        .btn:hover { transform: scale(1.05); }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .tier-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 16px;
            margin-top: 20px;
        }
        .tier-card {
            padding: 16px;
            border-radius: 12px;
            border: 1px solid rgba(255,255,255,0.1);
        }
        .tier-card.legendary { background: linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,215,0,0.05)); border-color: #FFD700; }
        .tier-card.epic { background: linear-gradient(135deg, rgba(139,0,0,0.1), rgba(139,0,0,0.05)); border-color: #8B0000; }
        .tier-card.rare { background: linear-gradient(135deg, rgba(65,105,225,0.1), rgba(65,105,225,0.05)); border-color: #4169E1; }
        .tier-card.uncommon { background: linear-gradient(135deg, rgba(34,139,34,0.1), rgba(34,139,34,0.05)); border-color: #228B22; }
        .tier-card.common { background: linear-gradient(135deg, rgba(192,192,192,0.1), rgba(192,192,192,0.05)); border-color: #C0C0C0; }
        .tier-card.special { background: linear-gradient(135deg, rgba(255,0,255,0.1), rgba(255,0,255,0.05)); border-color: #FF00FF; }
        .tier-name { font-weight: bold; font-size: 1.1rem; margin-bottom: 8px; }
        .tier-supply { font-size: 2rem; font-weight: bold; }
        .log {
            background: rgba(0,0,0,0.5);
            border-radius: 8px;
            padding: 16px;
            font-family: monospace;
            font-size: 0.9rem;
            max-height: 300px;
            overflow-y: auto;
            margin-top: 20px;
        }
        .log-entry { margin-bottom: 4px; }
        .log-success { color: #4CAF50; }
        .log-error { color: #f44336; }
        .log-info { color: #2196F3; }
        .progress-bar {
            width: 100%;
            height: 8px;
            background: rgba(255,255,255,0.1);
            border-radius: 4px;
            margin-top: 12px;
            overflow: hidden;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #FFD700, #FF8C00);
            transition: width 0.3s;
            width: 0%;
        }
        .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px; }
        .stat { text-align: center; padding: 16px; background: rgba(255,255,255,0.05); border-radius: 12px; }
        .stat-value { font-size: 2rem; font-weight: bold; color: #FFD700; }
        .stat-label { color: #888; font-size: 0.9rem; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎵 TROPTIONS Anthem</h1>
        <p class="subtitle">Mainframe Explode — Secure NFT Minting Console</p>
        
        <div class="stats">
            <div class="stat">
                <div class="stat-value">6</div>
                <div class="stat-label">Rarity Tiers</div>
            </div>
            <div class="stat">
                <div class="stat-value">703</div>
                <div class="stat-label">Total NFTs</div>
            </div>
            <div class="stat">
                <div class="stat-value">2.5%</div>
                <div class="stat-label">Royalty Fee</div>
            </div>
        </div>
        
        <div class="card">
            <h2>🔐 Secure Mint Setup</h2>
            <div class="warning">
                ⚠️ <strong>SECURITY WARNING:</strong> Your seed is used ONLY in your browser for local signing. 
                It is NEVER sent to any server. Clear your browser cache after minting.
            </div>
            <input type="password" id="seedInput" class="seed-input" 
                   placeholder="Enter your XRPL issuer seed (s...)" 
                   value="">
            <div style="display: flex; gap: 12px;">
                <button class="btn" onclick="connectWallet()" id="connectBtn">🔗 Connect Wallet</button>
                <button class="btn" onclick="startMint()" id="mintBtn" disabled>🚀 Start Mint (703 NFTs)</button>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" id="progressBar"></div>
            </div>
        </div>
        
        <div class="card">
            <h2>💎 Rarity Collection</h2>
            <div class="tier-grid">
                <div class="tier-card legendary">
                    <div class="tier-name" style="color: #FFD700;">LEGENDARY</div>
                    <div class="tier-supply">5</div>
                    <div>Genesis Edition</div>
                    <div style="font-size: 0.85rem; color: #888;">Lifetime VIP + 2% Rev Share</div>
                </div>
                <div class="tier-card epic">
                    <div class="tier-name" style="color: #8B0000;">EPIC</div>
                    <div class="tier-supply">22</div>
                    <div>22 Years Edition</div>
                    <div style="font-size: 0.85rem; color: #888;">Priority + 1% Rev Share</div>
                </div>
                <div class="tier-card rare">
                    <div class="tier-name" style="color: #4169E1;">RARE</div>
                    <div class="tier-supply">50</div>
                    <div>Master Cut Edition</div>
                    <div style="font-size: 0.85rem; color: #888;">Early Beta + Gov x2</div>
                </div>
                <div class="tier-card uncommon">
                    <div class="tier-name" style="color: #228B22;">UNCOMMON</div>
                    <div class="tier-supply">100</div>
                    <div>Alternate Mix</div>
                    <div style="font-size: 0.85rem; color: #888;">Discord VIP + Gov x1</div>
                </div>
                <div class="tier-card common">
                    <div class="tier-name" style="color: #C0C0C0;">COMMON</div>
                    <div class="tier-supply">500</div>
                    <div>Session Edit</div>
                    <div style="font-size: 0.85rem; color: #888;">Newsletter Early Access</div>
                </div>
                <div class="tier-card special">
                    <div class="tier-name" style="color: #FF00FF;">SPECIAL</div>
                    <div class="tier-supply">26</div>
                    <div>AI Voice Edition</div>
                    <div style="font-size: 0.85rem; color: #888;">AI Beta Testing</div>
                </div>
            </div>
        </div>
        
        <div class="card">
            <h2>📋 Mint Log</h2>
            <div id="log" class="log">
                <div class="log-entry log-info">Ready to mint. Enter your seed and connect.</div>
            </div>
        </div>
        
        <div class="card">
            <h2>📁 IPFS Assets</h2>
            <p style="color: #888; margin-bottom: 12px;">All audio files pinned to IPFS via Pinata</p>
            <div id="ipfsLinks"></div>
        </div>
    </div>

    <script>
        const xrpl = require('xrpl');
        const ISSUER = 'rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ';
        const MINT_BATCH = {MINT_BATCH_JSON};
        
        let wallet = null;
        let client = null;
        
        function log(message, type = 'info') {
            const logEl = document.getElementById('log');
            const entry = document.createElement('div');
            entry.className = `log-entry log-${type}`;
            entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
            logEl.appendChild(entry);
            logEl.scrollTop = logEl.scrollHeight;
        }
        
        async function connectWallet() {
            const seed = document.getElementById('seedInput').value.trim();
            if (!seed) {
                log('Please enter your seed', 'error');
                return;
            }
            
            try {
                wallet = xrpl.Wallet.fromSeed(seed);
                if (wallet.address !== ISSUER) {
                    log(`Warning: Seed address ${wallet.address} does not match expected issuer ${ISSUER}`, 'error');
                    return;
                }
                
                log(`Connected: ${wallet.address}`, 'success');
                document.getElementById('mintBtn').disabled = false;
                document.getElementById('connectBtn').disabled = true;
                
                // Connect to XRPL
                client = new xrpl.Client('wss://xrplcluster.com');
                await client.connect();
                log('Connected to XRPL mainnet', 'success');
                
                // Check balance
                const accountInfo = await client.request({
                    command: 'account_info',
                    account: wallet.address
                });
                const balance = xrpl.dropsToXrp(accountInfo.result.account_data.Balance);
                log(`Account balance: ${balance} XRP`, 'info');
                
            } catch (e) {
                log(`Error: ${e.message}`, 'error');
            }
        }
        
        async function startMint() {
            if (!wallet || !client) {
                log('Not connected', 'error');
                return;
            }
            
            document.getElementById('mintBtn').disabled = true;
            const total = MINT_BATCH.transactions.length;
            let success = 0;
            let failed = 0;
            
            log(`Starting mint of ${total} NFTs...`, 'info');
            
            for (let i = 0; i < total; i++) {
                const tx = MINT_BATCH.transactions[i];
                
                try {
                    // Build NFTokenMint transaction
                    const mintTx = {
                        TransactionType: 'NFTokenMint',
                        Account: wallet.address,
                        URI: tx.unsigned_tx.URI,
                        Flags: parseInt(tx.unsigned_tx.Flags),
                        NFTokenTaxon: tx.unsigned_tx.NFTokenTaxon,
                        TransferFee: tx.unsigned_tx.TransferFee,
                        Fee: tx.unsigned_tx.Fee,
                        Sequence: await getNextSequence()
                    };
                    
                    const prepared = await client.autofill(mintTx);
                    const signed = wallet.sign(prepared);
                    const result = await client.submitAndWait(signed.tx_blob);
                    
                    if (result.result.meta.TransactionResult === 'tesSUCCESS') {
                        success++;
                        log(`[${i+1}/${total}] ✅ Minted: ${tx.tier} #${tx.index}`, 'success');
                    } else {
                        failed++;
                        log(`[${i+1}/${total}] ❌ Failed: ${tx.tier} #${tx.index} - ${result.result.meta.TransactionResult}`, 'error');
                    }
                    
                    // Update progress
                    const pct = ((i + 1) / total) * 100;
                    document.getElementById('progressBar').style.width = pct + '%';
                    
                    // Rate limiting - 1 tx per second
                    await new Promise(r => setTimeout(r, 1000));
                    
                } catch (e) {
                    failed++;
                    log(`[${i+1}/${total}] ❌ Error: ${e.message}`, 'error');
                }
            }
            
            log(`\\n=== MINT COMPLETE ===`, 'info');
            log(`Success: ${success}/${total}`, 'success');
            log(`Failed: ${failed}/${total}`, failed > 0 ? 'error' : 'info');
            
            document.getElementById('progressBar').style.width = '100%';
        }
        
        async function getNextSequence() {
            const accountInfo = await client.request({
                command: 'account_info',
                account: wallet.address
            });
            return accountInfo.result.account_data.Sequence;
        }
        
        // Display IPFS links
        const ipfsCids = {
            'Official TROPTIONS Song': 'QmX7Wc9MtXmwvG46qw8jViN27jjyUNG8dBLEFbUkYJ2ECb',
            'Alternate Studio Mix': 'QmbGT6jyRMP1Q2fuW6cz8ByKPydZmgAZo4kVsVg4FWAS2A',
            'Latest Master Cut': 'QmUjCZXLux8BnD17cNdBs3pTshtrswgKecjYpQiyMh7Def',
            '22 Years Narrative': 'Qmcz2htAJFpaP2mcUT4CDCzVjMmbQoTVo8uQCWsTjNAKyV',
            'Session Edit': 'QmddQzssL3RdNhCFfBSPFSLZBLpgyUvDbUnfWhmorU1Wsj',
            'AI Voice (Charlie)': 'QmeLmHMuWvj556cjGR5snaVTtYG4hYTbDDkqe5xUA3j2XV',
            'Manifest': 'Qmc54zWPjwuo666RGWh1Tf3nVJQvkmwLSVwmnFomCFP7o7'
        };
        
        const ipfsDiv = document.getElementById('ipfsLinks');
        for (const [name, cid] of Object.entries(ipfsCids)) {
            const link = document.createElement('a');
            link.href = `https://gateway.pinata.cloud/ipfs/${cid}`;
            link.target = '_blank';
            link.textContent = `📁 ${name}: ${cid.substring(0, 20)}...`;
            link.style.display = 'block';
            link.style.color = '#4CAF50';
            link.style.marginBottom = '8px';
            ipfsDiv.appendChild(link);
        }
    </script>
</body>
</html>
'''

# Replace placeholder with actual mint batch data
mint_batch_json = json.dumps(mint_batch)
html = HTML_TEMPLATE.replace('{MINT_BATCH_JSON}', mint_batch_json)

output_path = 'C:\\Users\\Kevan\\Troptions-full-pack\\sites\\investor\\mint.html'
with open(output_path, 'w', encoding='utf-8') as f:
    f.write(html)

print(f'Created secure minting DApp: {output_path}')
print(f'File size: {len(html):,} bytes')
print()
print('INSTRUCTIONS:')
print('1. Open this HTML file in Chrome/Edge/Firefox')
print('2. Enter your XRPL issuer seed (starts with "sn")')
print('3. Click "Connect Wallet"')
print('4. Click "Start Mint" to mint all 703 NFTs')
print('5. Each NFT mints at ~1 per second (rate limited)')
print('6. Estimated total time: ~12 minutes')
print()
print('SECURITY: Seed is used ONLY in browser for local signing.')
print('Nothing is sent to any server. Clear browser cache after.')
