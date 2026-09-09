@echo off
setlocal
cd /d "%~dp0"
set "CAPSULE_PY=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
if exist "%CAPSULE_PY%" goto run
set "CAPSULE_PY=%LOCALAPPDATA%\Programs\Python\Python314\python.exe"
if exist "%CAPSULE_PY%" goto run
py -3 capsule.py gui
if errorlevel 1 pause
exit /b
:run
"%CAPSULE_PY%" capsule.py gui
if errorlevel 1 pause
