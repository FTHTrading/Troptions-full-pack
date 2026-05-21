import { NextResponse } from "next/server";
import { Wallet } from "xrpl";

// SECURITY: Seed is only returned when TROPTIONS_WALLET_DEMO_MODE=true (demo/testnet portals).
// In production (default) the seed is generated server-side, used to derive address/publicKey,
// and then immediately discarded — it is NEVER returned to the client.
const DEMO_MODE = process.env.TROPTIONS_WALLET_DEMO_MODE === "true";

export async function POST() {
  try {
    const wallet = Wallet.generate();

    if (DEMO_MODE) {
      return NextResponse.json({
        ok: true,
        demoMode: true,
        address: wallet.address,
        // Seed only returned in explicit demo mode — never in production
        seed: wallet.seed,
        publicKey: wallet.publicKey,
        algorithm: "secp256k1",
        warning:
          "DEMO MODE: This is for demonstration purposes only. Do NOT fund this wallet with real assets. Demo wallets are not secure.",
      });
    }

    // Production: return address + public key only. Seed is discarded server-side.
    return NextResponse.json({
      ok: true,
      demoMode: false,
      address: wallet.address,
      seed: null, // Never returned in production
      publicKey: wallet.publicKey,
      algorithm: "secp256k1",
      note: "Address and public key only. To generate a mainnet wallet with seed access, use a local tool such as xrpl.js or Xaman.",
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
