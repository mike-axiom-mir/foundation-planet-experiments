@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Foundation Planet requires Node.js 18 or newer.
  echo Download it from https://nodejs.org/
  pause
  exit /b 1
)

node scripts\serve.mjs %*
