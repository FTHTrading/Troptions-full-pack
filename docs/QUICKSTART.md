# TROPTIONS — One-command quickstart

Start the full sovereign stack (L1 → backends → DAO) in dependency order.

## Prerequisites

- **PM2** — `npm install -g pm2`
- **Python 3** + pip
- **Rust / cargo** — to build `l1/target/release/troptions-node` if no binary is configured
- Optional: copy `.env.example` → `.env` (secrets stay local)

## Windows (primary)

```powershell
cd C:\Users\Kevan\Troptions-full-pack
.\scripts\quickstart-all.ps1
```

Dry run (prints steps only):

```powershell
.\scripts\quickstart-all.ps1 -DryRun
```

## Linux / macOS

```bash
chmod +x scripts/quickstart-all.sh
./scripts/quickstart-all.sh
./scripts/quickstart-all.sh --dry-run
```

## After start

| Service | URL |
|---------|-----|
| L1 JSON-RPC | http://127.0.0.1:9944 |
| DONK | http://127.0.0.1:8090/health |
| FTH Academy | http://127.0.0.1:8091/health |
| TTN | http://127.0.0.1:8092/health |
| DAO + dashboard | http://127.0.0.1:8093 |

Health check: `.\scripts\health-check-all.ps1` (Windows) or curl JSON-RPC `state_get` on :9944.

DAO-only bootstrap (build L1 + init DB): `scripts/bootstrap-dao.ps1` / `scripts/bootstrap-dao.sh`.

## L1 binary path

`ecosystem.config.js` uses `L1_NODE_BIN` or defaults to `C:\cargo-target-burnzy\release\troptions-node.exe` on Windows. Override:

```powershell
$env:L1_NODE_BIN = "C:\path\to\troptions-node.exe"
.\scripts\quickstart-all.ps1
```

## Related docs

- [DAO guide](DAO.md)
- [Runbook](RUNBOOK.md)
- [Investor one-pager](WHATS_BUILT_INVESTOR_ONE_PAGER.md)
