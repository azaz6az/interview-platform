@echo off
powershell -ExecutionPolicy Bypass -Command "$ws = New-Object -ComObject WScript.Shell; $desktop = [Environment]::GetFolderPath('Desktop'); $lnk = $ws.CreateShortcut([System.IO.Path]::Combine($desktop, 'Interview-Platform.lnk')); $lnk.TargetPath = 'powershell.exe'; $lnk.Arguments = '-ExecutionPolicy Bypass -WindowStyle Hidden -File \"D:\interview-platform-delivery\start-hidden.ps1\"'; $lnk.WorkingDirectory = 'D:\interview-platform-delivery'; $lnk.WindowStyle = 7; $lnk.Save(); Write-Host 'Shortcut created'"
pause
