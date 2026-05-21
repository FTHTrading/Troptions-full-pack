import { Keypair, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import fs from "node:fs";

const arr = JSON.parse(fs.readFileSync("C:/Users/Kevan/.solana-launcher-wallets/house-mint-wallet.json", "utf8"));
const kp = Keypair.fromSecretKey(Uint8Array.from(arr));
console.log("wallet:", kp.publicKey.toBase58());

const rpcs = [
  "https://api.devnet.solana.com",
  "https://devnet.helius-rpc.com/?api-key=demo",
  "https://rpc.ankr.com/solana_devnet",
];
for (const rpc of rpcs) {
  console.log("try", rpc);
  try {
    const c = new Connection(rpc, "confirmed");
    const sig = await c.requestAirdrop(kp.publicKey, 1 * LAMPORTS_PER_SOL);
    console.log("  sig:", sig);
    await c.confirmTransaction(sig, "confirmed");
    const b = await c.getBalance(kp.publicKey);
    console.log("  balance:", b / LAMPORTS_PER_SOL);
    if (b > 0) process.exit(0);
  } catch (e) {
    console.log("  err:", String(e.message || e).slice(0, 200));
  }
}
console.log("ALL FAILED — try web faucet manually:");
console.log("  https://faucet.solana.com/?address=" + kp.publicKey.toBase58());
