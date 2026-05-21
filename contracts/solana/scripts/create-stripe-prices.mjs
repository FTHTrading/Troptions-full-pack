// Creates Stripe one-time price products for TROPTIONS token launches.
// Run: node create-stripe-prices.mjs
// Outputs: price IDs to add to .env.local and Vercel

import Stripe from 'stripe';
import { readFileSync } from 'fs';

const envContent = readFileSync('.env.local', 'utf8');
function getEnv(key) {
  const m = envContent.match(new RegExp(`^${key}=(.+)$`, 'm'));
  return m ? m[1].trim().replace(/^["']|["']$/g, '') : null;
}

const secretKey = getEnv('STRIPE_SECRET_KEY');
if (!secretKey) { console.error('STRIPE_SECRET_KEY not found in .env.local'); process.exit(1); }

const stripe = new Stripe(secretKey, { apiVersion: '2025-03-31.basil', typescript: false });

const plans = [
  { id: 'standard', name: 'TROPTIONS Standard Launch', amount: 1000, desc: 'Launch one SPL token on Solana mainnet with IPFS metadata + dashboard' },
  { id: 'premium',  name: 'TROPTIONS Premium Launch',  amount: 2500, desc: 'Standard + auto authority revocation + trust score + shareable token page' },
  { id: 'featured', name: 'TROPTIONS Featured Launch', amount: 5000, desc: 'Premium + featured placement + AI metadata + Meteora pool setup guide' },
];

console.log('Creating Stripe products + one-time prices...\n');
const results = {};

for (const plan of plans) {
  // Find or create the product
  const products = await stripe.products.search({ query: `name:'${plan.name}'`, limit: 1 });
  let product;
  if (products.data.length > 0) {
    product = products.data[0];
    console.log(`Product exists: ${plan.id} → ${product.id}`);
  } else {
    product = await stripe.products.create({ name: plan.name, description: plan.desc });
    console.log(`Product created: ${plan.id} → ${product.id}`);
  }

  // Find or create the one-time price
  const prices = await stripe.prices.list({ product: product.id, type: 'one_time', active: true, limit: 3 });
  let price = prices.data.find(p => p.unit_amount === plan.amount && p.currency === 'usd');
  if (!price) {
    price = await stripe.prices.create({
      product: product.id,
      unit_amount: plan.amount,
      currency: 'usd',
      nickname: `${plan.id}_launch`,
    });
    console.log(`Price created: $${(plan.amount/100).toFixed(2)} → ${price.id}`);
  } else {
    console.log(`Price exists: $${(plan.amount/100).toFixed(2)} → ${price.id}`);
  }

  results[plan.id] = price.id;
}

console.log('\n=== STRIPE PRICE IDs ===');
for (const [plan, priceId] of Object.entries(results)) {
  const envKey = `STRIPE_PRICE_${plan.toUpperCase()}`;
  console.log(`${envKey}=${priceId}`);
}

console.log('\n=== ADD THESE TO .env.local AND PUSH TO VERCEL ===');
