# Auto-sync divertimania-web with origin/main every 10s.
# Run this any time you're expecting changes from Antigravity (or anyone else)
# and want localhost to update itself without manually running git pull.
#
# Usage: right-click > "Run with PowerShell", or from a terminal:
#   powershell -ExecutionPolicy Bypass -File scripts/auto-sync.ps1

$ErrorActionPreference = "SilentlyContinue"
Set-Location (Split-Path $PSScriptRoot -Parent)

$logFile = Join-Path $PSScriptRoot "auto-sync.log"
"[$( Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Vigilante iniciado." | Out-File -Append $logFile

while ($true) {
    git fetch origin main *> $null
    $local = git rev-parse main
    $remote = git rev-parse origin/main

    if ($local -ne $remote) {
        $timestamp = Get-Date -Format "HH:mm:ss"
        $ahead = git rev-list --count main..origin/main
        Write-Host "[$timestamp] origin/main tiene $ahead commit(s) nuevos. Actualizando..." -ForegroundColor Yellow

        $result = git pull origin main 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[$timestamp] Listo. Next.js debería recargar solo (HMR)." -ForegroundColor Green
        } else {
            Write-Host "[$timestamp] git pull fallo — revisa manualmente:" -ForegroundColor Red
            Write-Host $result
        }
    }

    Start-Sleep -Seconds 10
}
