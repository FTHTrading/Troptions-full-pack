"""API key auth — unit tests + dao-service route check."""

import os
import sys
from pathlib import Path

import pytest
from fastapi import HTTPException

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend" / "shared"))

from auth import api_keys_configured, get_valid_api_keys, verify_api_key  # noqa: E402


@pytest.fixture
def api_keys_env(monkeypatch):
    monkeypatch.setenv("API_KEYS", "test-secret-key,another-key")
    monkeypatch.setenv("SETTLEMENT_API_KEYS", "settle:settlement-secret")


def test_get_valid_api_keys_merges_env(api_keys_env):
    keys = get_valid_api_keys()
    assert "test-secret-key" in keys
    assert "another-key" in keys
    assert "settlement-secret" in keys


@pytest.mark.asyncio
async def test_invalid_key_returns_401(api_keys_env):
    with pytest.raises(HTTPException) as exc:
        await verify_api_key("wrong-key")
    assert exc.value.status_code == 401


@pytest.mark.asyncio
async def test_missing_key_returns_401(api_keys_env):
    with pytest.raises(HTTPException) as exc:
        await verify_api_key(None)
    assert exc.value.status_code == 401


@pytest.mark.asyncio
async def test_valid_key_passes(api_keys_env):
    await verify_api_key("test-secret-key")


@pytest.mark.asyncio
async def test_dev_mode_allows_when_unconfigured(monkeypatch):
    monkeypatch.delenv("API_KEYS", raising=False)
    monkeypatch.delenv("SETTLEMENT_API_KEYS", raising=False)
    await verify_api_key(None)
    assert not api_keys_configured()


def test_settlement_router_health_public():
    """Settlement health route does not require API key."""
    import importlib.util

    dao_dir = str(ROOT / "backend" / "dao-service")
    if dao_dir not in sys.path:
        sys.path.insert(0, dao_dir)
    spec = importlib.util.spec_from_file_location(
        "settlement_router",
        ROOT / "backend" / "dao-service" / "settlement_router.py",
    )
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    routes = [getattr(r, "path", "") for r in mod.router.routes]
    assert "/settlement/health" in routes
