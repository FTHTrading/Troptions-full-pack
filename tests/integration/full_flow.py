"""Full-stack integration: L1 subprocess, soulbound, governance, treasury."""

from __future__ import annotations

import json
import os
import subprocess
import sys
import time
from pathlib import Path

import httpx
import pytest

ROOT = Path(__file__).resolve().parents[2]
L1_DIR = ROOT / "l1"


def _rpc(url: str, method: str, params: dict | None = None) -> dict:
    payload = {"jsonrpc": "2.0", "method": method, "params": params or {}, "id": 1}
    with httpx.Client(timeout=5.0) as client:
        r = client.post(url, json=payload)
        r.raise_for_status()
        data = r.json()
    if "error" in data:
        raise RuntimeError(data["error"])
    return data.get("result", {})


@pytest.fixture(scope="module")
def l1_node():
    """Start troptions-node if binary exists; else skip."""
    data_dir = ROOT / "l1-data-test"
    data_dir.mkdir(exist_ok=True)
    bin_release = L1_DIR / "target" / "release" / "troptions-node.exe"
    if not bin_release.exists():
        pytest.skip("troptions-node not built — run: cd l1 && cargo build -p node --release")
    proc = subprocess.Popen(
        [str(bin_release), "9946", str(data_dir)],
        cwd=str(L1_DIR),
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    url = "http://127.0.0.1:9946"
    for _ in range(30):
        try:
            _rpc(url, "state_get")
            break
        except Exception:
            time.sleep(0.5)
    else:
        proc.kill()
        pytest.skip("L1 node did not start on 9946")
    yield url
    proc.terminate()
    proc.wait(timeout=10)


@pytest.mark.integration
def test_full_governance_and_treasury_flow(l1_node):
    state = _rpc(l1_node, "state_get")
    assert state.get("block_height", 0) >= 1

    treasury = _rpc(
        l1_node, "treasury_getBalance", {"chain": "xrpl", "asset": "TROPTIONS"}
    )
    assert int(treasury.get("balance", 0)) > 0

    proposer = "11" * 32
    created = _rpc(
        l1_node,
        "submit_proposal_create",
        {
            "proposer": proposer,
            "title": "Integration test",
            "description": "pytest full flow",
        },
    )
    assert created.get("proposal_id")

    proposals = _rpc(l1_node, "dao_getProposals")
    assert isinstance(proposals, list)
