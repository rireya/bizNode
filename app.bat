@echo off
echo.
cd %~dp0
set DEBUG=bizNode:*
node ./bin/www
pause