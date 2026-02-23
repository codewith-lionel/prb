# Kill process on port 5000
$port = 5000
$process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique

if ($process) {
    Write-Host "Found process $process using port $port" -ForegroundColor Yellow
    Stop-Process -Id $process -Force
    Write-Host "✅ Killed process $process" -ForegroundColor Green
    Write-Host "Port $port is now free!" -ForegroundColor Green
} else {
    Write-Host "✅ Port $port is already free" -ForegroundColor Green
}
