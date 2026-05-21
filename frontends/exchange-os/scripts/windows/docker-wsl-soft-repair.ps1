$ErrorActionPreference = "Continue"

Write-Host "=== Docker/WSL Soft Repair ==="
Write-Host "This script performs non-destructive recovery steps only."

function Try-Step($label, $action) {
    Write-Host ""
    Write-Host ("--- " + $label + " ---")
    try {
        & $action
        Write-Host "OK: $label"
    } catch {
        Write-Host "WARN: $label failed: $($_.Exception.Message)"
    }
}

Try-Step "Terminate docker process if running" {
    Get-Process -Name "Docker Desktop" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
}

Try-Step "Shutdown WSL" {
    wsl --shutdown
}

Try-Step "Update WSL kernel/userspace" {
    wsl --update
}

Try-Step "Start Docker Desktop" {
    $dockerDesktopPath = "$Env:ProgramFiles\Docker\Docker\Docker Desktop.exe"
    if (Test-Path $dockerDesktopPath) {
        Start-Process -FilePath $dockerDesktopPath
    } else {
        Write-Host "Docker Desktop executable not found at: $dockerDesktopPath"
    }
}

Write-Host ""
Write-Host "Soft repair steps finished. Re-run scripts/windows/docker-health.ps1 to verify."
