# Docker and WSL Recovery Runbook

## Purpose
Recover Docker Desktop + WSL on Windows using safe, non-destructive steps first.

## Symptoms This Runbook Covers
1. Docker Desktop stuck on "Starting".
2. Docker engine unreachable.
3. WSL distro not responding.
4. Local dev containers not coming up.

## Non-Destructive Recovery Steps
1. Save work and close active terminals using Docker/WSL.
2. Run scripts/windows/docker-health.ps1 and capture output.
3. In elevated PowerShell, run scripts/windows/docker-wsl-soft-repair.ps1.
4. Re-open Docker Desktop and wait for engine ready state.
5. Re-run scripts/windows/docker-health.ps1.
6. Validate with docker version and docker info.

## Manual Verification Commands
```powershell
wsl --status
wsl -l -v
docker version
docker info
```

## If Soft Repair Fails
1. Reboot Windows once and repeat non-destructive steps.
2. Ensure Docker Desktop is updated to current stable version.
3. Ensure WSL2 optional components are enabled.

## Last Resort (Destructive)
This section is intentionally manual and not scripted.

Use only after explicit confirmation from the system owner and backup verification.

Potential destructive commands include unregistering Docker distros:
```powershell
wsl --unregister docker-desktop
wsl --unregister docker-desktop-data
```

Warning: these commands remove Docker internal distro state and local container/image data. Execute only with explicit human confirmation and accepted data-loss risk.
