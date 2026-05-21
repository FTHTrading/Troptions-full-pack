#!/usr/bin/env python3
"""Sign TROPTIONS L1 governance actions (Ed25519) for dao_submit_proposal / dao_cast_vote / dao_execute."""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

try:
    from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey
except ImportError:
    print("pip install cryptography", file=sys.stderr)
    raise


def _gov_message(action: str, proposal_id: bytes, actor: bytes) -> bytes:
    data = bytearray()
    data.extend(b"GOV_ACTION_V1")
    data.extend(action.encode())
    data.extend(proposal_id)
    data.extend(actor)
    return bytes(data)


def main() -> None:
    parser = argparse.ArgumentParser(description="Sign L1 governance action")
    parser.add_argument("action", choices=["create", "vote", "execute"])
    parser.add_argument("--actor-hex", required=True, help="32-byte hex account id")
    parser.add_argument("--secret-hex", help="Ed25519 secret key (64-byte seed or 32-byte)")
    parser.add_argument("--proposal-id-hex", default="0" * 64, help="Proposal id for vote/execute")
    parser.add_argument("--rpc-url", default=os.getenv("L1_RPC_URL", "http://127.0.0.1:9944"))
    parser.add_argument("--submit", action="store_true", help="POST JSON-RPC to L1")
    parser.add_argument("--title", default="CLI proposal")
    parser.add_argument("--description", default="Signed via l1-gov-sign.py")
    args = parser.parse_args()

    secret_hex = args.secret_hex or os.getenv("L1_GOVERNANCE_SECRET_HEX")
    if not secret_hex:
        parser.error("Provide --secret-hex or L1_GOVERNANCE_SECRET_HEX")

    actor = bytes.fromhex(args.actor_hex.replace("0x", ""))
    if len(actor) != 32:
        parser.error("actor must be 32 bytes")
    sk_raw = bytes.fromhex(secret_hex.replace("0x", ""))
    seed = sk_raw[:32]
    sk = Ed25519PrivateKey.from_private_bytes(seed)

    proposal_id = bytes.fromhex(args.proposal_id_hex.replace("0x", ""))
    if len(proposal_id) != 32:
        parser.error("proposal_id must be 32 bytes")

    msg = _gov_message(args.action, proposal_id if args.action != "create" else bytes(32), actor)
    sig = sk.sign(msg).hex()

    payload = {
        "jsonrpc": "2.0",
        "method": "dao_submit_proposal",
        "params": {
            "proposer": args.actor_hex,
            "title": args.title,
            "description": args.description,
            "signature": sig,
        },
        "id": 1,
    }
    if args.action == "vote":
        payload["method"] = "dao_cast_vote"
        payload["params"] = {
            "proposal_id": args.proposal_id_hex,
            "voter": args.actor_hex,
            "choice": "for",
            "signature": sig,
        }
    elif args.action == "execute":
        payload["method"] = "dao_execute"
        payload["params"] = {
            "proposal_id": args.proposal_id_hex,
            "executor": args.actor_hex,
            "signature": sig,
        }

    print(json.dumps({"signature": sig, "message_hex": msg.hex()}, indent=2))
    if args.submit:
        import urllib.request

        req = urllib.request.Request(
            args.rpc_url,
            data=json.dumps(payload).encode(),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            print(resp.read().decode())


if __name__ == "__main__":
    main()
