$ErrorActionPreference = "Continue"

Write-Host "=== Docker/WSL Health Check ==="

function Print-Section($name) {
    Write-Host ""
    Write-Host ("--- " + $name + " ---")
}

Print-Section "WSL Status"
try {
    wsl --status
} catch {
    Write-Host "Failed to read WSL status: $($_.Exception.Message)"
}

Print-Section "WSL Distros"
try {
    wsl -l -v
} catch {
    Write-Host "Failed to list WSL distros: $($_.Exception.Message)"
}

Print-Section "Docker Version"
try {
    docker version
} catch {
    Write-Host "Docker CLI not responding: $($_.Exception.Message)"
}

Print-Section "Docker Info"
try {
    docker info
} catch {
    Write-Host "Docker engine not responding: $($_.Exception.Message)"
}

Write-Host ""
Write-Host "Health check complete."
