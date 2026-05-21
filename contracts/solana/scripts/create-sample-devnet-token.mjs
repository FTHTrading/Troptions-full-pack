#!/usr/bin/env node
/**
 * create-sample-devnet-token.mjs
 *
 * Creates a real SPL token on Solana devnet for the "Sample Devnet Launch"
 * section on the marketing homepage. Uses @solana/web3.js + @solana/spl-token
 * + @metaplex-foundation/mpl-token-metadata — all already installed.
 *
 * No browser wallet needed. Generates a fresh keypair, airdrops devnet SOL,
 * then mints a token with Metaplex on-chain metadata.
 *
 * Usage:
 *   node scripts/create-sample-devnet-token.mjs
 *
 * Output:
 *   Prints mint address, tx signature, metadata URI, and image URI to console.
 *   These values go into DEVNET_SAMPLE in app/(marketing)/page.tsx.
 */

import {
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
  Connection,
  sendAndConfirmTransaction,
} from '@solana/web3.js';

import {
  createInitializeMintInstruction,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
} from '@solana/spl-token';

import { createCreateMetadataAccountV3Instruction } from '@metaplex-foundation/mpl-token-metadata';

// ─── Config ─────────────────────────────────────────────────────────
const RPC_URL = 'https://api.devnet.solana.com';
const TOKEN_NAME = 'Solana Launcher Sample';
const TOKEN_SYMBOL = 'LAUNCH';
const TOKEN_DECIMALS = 9;
const TOKEN_SUPPLY = '1000000'; // 1 million tokens
const TOKEN_DESCRIPTION =
  'Sample token created by the Solana Launcher platform (launch.unykorn.org) to demonstrate the token creation flow on devnet.';

// Use the platform logo hosted on the live site as the token image
const TOKEN_IMAGE = 'https://launch.unykorn.org/images/brand/logo-primary.png';

// Metadata JSON — we'll use a publicly accessible URI.
// For a real production token this would be IPFS via Pinata.
// For this devnet sample we encode a data URI with the JSON.
const METADATA_JSON = {
  name: TOKEN_NAME,
  symbol: TOKEN_SYMBOL,
  description: TOKEN_DESCRIPTION,
  image: TOKEN_IMAGE,
  external_url: 'https://launch.unykorn.org',
  properties: {
    links: {
      website: 'https://launch.unykorn.org',
    },
  },
};

// ─── Metaplex Token Metadata Program ────────────────────────────────
const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
);

function getMetadataPDA(mint) {
  const [pda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('metadata'),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );
  return pda;
}

// ─── Main ───────────────────────────────────────────────────────────
async function main() {
  const connection = new Connection(RPC_URL, 'confirmed');

  // Step 1: Generate fresh keypair + airdrop
  console.log('⏳ Generating keypair and requesting devnet airdrop...');
  const payer = Keypair.generate();
  console.log(`   Payer: ${payer.publicKey.toBase58()}`);

  // Airdrop using the web faucet API (the RPC requestAirdrop is rate-limited)
  async function airdropViaWebFaucet(address, maxRetries = 5) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`   Faucet attempt ${attempt}/${maxRetries}...`);
        const resp = await fetch('https://faucet.solana.com/api/request-airdrop', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            wallet: address,
            network: 'devnet',
            amount: 2,
          }),
        });
        if (!resp.ok) {
          const text = await resp.text();
          throw new Error(`Faucet ${resp.status}: ${text}`);
        }
        const data = await resp.json();
        console.log(`   Faucet response:`, JSON.stringify(data));
        return data;
      } catch (err) {
        console.log(`   ⚠ Attempt ${attempt} failed: ${err.message}`);
        if (attempt === maxRetries) throw err;
        const delay = 5000 * attempt;
        console.log(`   Waiting ${delay / 1000}s before retry...`);
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }

  // Try web faucet first, fall back to RPC airdrop
  try {
    await airdropViaWebFaucet(payer.publicKey.toBase58());
  } catch (webErr) {
    console.log(`   Web faucet failed, trying RPC airdrop...`);
    const sig = await connection.requestAirdrop(payer.publicKey, 2 * LAMPORTS_PER_SOL);
    await connection.confirmTransaction(sig, 'confirmed');
  }

  // Wait for balance to appear
  console.log('   Waiting for balance...');
  for (let i = 0; i < 30; i++) {
    const bal = await connection.getBalance(payer.publicKey);
    if (bal > 0) {
      console.log(`✅ Balance confirmed: ${bal / LAMPORTS_PER_SOL} SOL`);
      break;
    }
    await new Promise(r => setTimeout(r, 2000));
  }

  // Step 2: Create mint keypair
  const mintKeypair = Keypair.generate();
  const mintPubkey = mintKeypair.publicKey;
  console.log(`   Mint: ${mintPubkey.toBase58()}`);

  // Step 3: Build the token creation transaction
  console.log('⏳ Building token creation transaction...');

  const associatedTokenAddress = getAssociatedTokenAddressSync(
    mintPubkey,
    payer.publicKey
  );

  const rawSupply =
    BigInt(TOKEN_SUPPLY) * 10n ** BigInt(TOKEN_DECIMALS);

  const mintRent = await connection.getMinimumBalanceForRentExemption(MINT_SIZE);

  const tx1 = new Transaction();

  // 1. Create mint account
  tx1.add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: mintPubkey,
      space: MINT_SIZE,
      lamports: mintRent,
      programId: TOKEN_PROGRAM_ID,
    })
  );

  // 2. Initialize mint
  tx1.add(
    createInitializeMintInstruction(
      mintPubkey,
      TOKEN_DECIMALS,
      payer.publicKey, // mint authority
      payer.publicKey, // freeze authority
      TOKEN_PROGRAM_ID
    )
  );

  // 3. Create ATA
  tx1.add(
    createAssociatedTokenAccountInstruction(
      payer.publicKey,
      associatedTokenAddress,
      payer.publicKey,
      mintPubkey
    )
  );

  // 4. Mint supply
  tx1.add(
    createMintToInstruction(
      mintPubkey,
      associatedTokenAddress,
      payer.publicKey,
      rawSupply
    )
  );

  // Send token creation tx
  console.log('⏳ Sending token creation transaction...');
  const txSignature = await sendAndConfirmTransaction(
    connection,
    tx1,
    [payer, mintKeypair],
    { commitment: 'confirmed' }
  );
  console.log(`✅ Token created! TX: ${txSignature}`);

  // Step 4: Attach Metaplex metadata (separate tx)
  console.log('⏳ Attaching Metaplex on-chain metadata...');

  // For devnet sample, we use the live site URL as metadata URI
  // In production this would be an IPFS URI (ipfs://...)
  const metadataUri = 'https://launch.unykorn.org/api/sample-token-metadata.json';

  const metadataPDA = getMetadataPDA(mintPubkey);

  const metadataInstruction = createCreateMetadataAccountV3Instruction(
    {
      metadata: metadataPDA,
      mint: mintPubkey,
      mintAuthority: payer.publicKey,
      payer: payer.publicKey,
      updateAuthority: payer.publicKey,
    },
    {
      createMetadataAccountArgsV3: {
        data: {
          name: TOKEN_NAME,
          symbol: TOKEN_SYMBOL,
          uri: metadataUri,
          sellerFeeBasisPoints: 0,
          creators: [
            {
              address: payer.publicKey,
              verified: true,
              share: 100,
            },
          ],
          collection: null,
          uses: null,
        },
        isMutable: true,
        collectionDetails: null,
      },
    }
  );

  const tx2 = new Transaction().add(metadataInstruction);
  const metaTxSig = await sendAndConfirmTransaction(
    connection,
    tx2,
    [payer],
    { commitment: 'confirmed' }
  );
  console.log(`✅ Metadata attached! TX: ${metaTxSig}`);

  // Step 5: Output results
  console.log('\n════════════════════════════════════════════════════');
  console.log('  SAMPLE DEVNET TOKEN — CREATED SUCCESSFULLY');
  console.log('════════════════════════════════════════════════════\n');

  const results = {
    mint: mintPubkey.toBase58(),
    tx: txSignature,
    metadataUri: metadataUri,
    imageUri: TOKEN_IMAGE,
  };

  console.log(`  Mint Address:    ${results.mint}`);
  console.log(`  TX Signature:    ${results.tx}`);
  console.log(`  Metadata URI:    ${results.metadataUri}`);
  console.log(`  Image URI:       ${results.imageUri}`);
  console.log('');
  console.log('  Explorer Links:');
  console.log(`  Mint:  https://explorer.solana.com/address/${results.mint}?cluster=devnet`);
  console.log(`  TX:    https://explorer.solana.com/tx/${results.tx}?cluster=devnet`);
  console.log('');
  console.log('  Copy this into DEVNET_SAMPLE in app/(marketing)/page.tsx:');
  console.log('');
  console.log(`  const DEVNET_SAMPLE = {`);
  console.log(`    mint: '${results.mint}',`);
  console.log(`    tx: '${results.tx}',`);
  console.log(`    metadataUri: '${results.metadataUri}',`);
  console.log(`    imageUri: '${results.imageUri}',`);
  console.log(`  };`);
  console.log('');

  // Also write to a file for easy programmatic access
  const fs = await import('fs');
  fs.writeFileSync(
    'scripts/sample-token-data.json',
    JSON.stringify(results, null, 2)
  );
  console.log('  ✅ Results saved to scripts/sample-token-data.json');

  // Write the metadata JSON as a static file so the URI works
  const metadataJsonPath = 'public/api/sample-token-metadata.json';
  const publicApiDir = 'public/api';
  if (!fs.existsSync(publicApiDir)) {
    fs.mkdirSync(publicApiDir, { recursive: true });
  }
  fs.writeFileSync(
    metadataJsonPath,
    JSON.stringify(METADATA_JSON, null, 2)
  );
  console.log(`  ✅ Metadata JSON written to ${metadataJsonPath}`);
}

main().catch((err) => {
  console.error('❌ Error:', err.message || err);
  process.exit(1);
});
