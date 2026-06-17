$vitePath = "D:\interview-platform-delivery\source-code"
$proc = Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd /d `"$vitePath`" && npx vite --host --port 5173 --open" -WindowStyle Hidden -PassThru
Write-Host "Dev server started (PID: $($proc.Id)), browser opening..."
Start-Sleep -Seconds 3
