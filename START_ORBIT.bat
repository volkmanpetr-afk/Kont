@echo off
chcp 65001 >nul
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  start "" http://localhost:8000
  py -m http.server 8000
) else (
  where python >nul 2>nul
  if %errorlevel%==0 (
    start "" http://localhost:8000
    python -m http.server 8000
  ) else (
    echo Python nebyl nalezen. Nainstalujte Python 3 nebo spustte:
    echo python -m http.server 8000
    pause
  )
)
pause
