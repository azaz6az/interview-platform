@echo off
chcp 65001 >nul 2>nul
netsh advfirewall firewall add rule name="Vite Dev Server" dir=in action=allow protocol=TCP localport=5173
echo.
echo Done! Port 5173 is now open.
pause
