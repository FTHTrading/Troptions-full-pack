import React from "react";
export default function SolanaProofPacketChecklist() {
  return (
    <ul className="list-disc pl-6 text-gray-300">
      <li>Mint address</li>
      <li>Token standard: SPL Token or Token-2022</li>
      <li>Metadata account</li>
      <li>Mint authority</li>
      <li>Freeze authority</li>
      <li>Update authority</li>
      <li>Transfer hook status if Token-2022</li>
      <li>Transfer fee status if Token-2022</li>
      <li>Permanent delegate status if Token-2022</li>
      <li>Top holders</li>
      <li>Creator/team wallets</li>
      <li>LP wallet</li>
      <li>Pool address</li>
      <li>Liquidity venue</li>
      <li>LP lock or vesting proof</li>
      <li>Legal memo</li>
      <li>KYC/AML status</li>
      <li>Marketing review</li>
      <li>Launch committee status</li>
    </ul>
  );
}
