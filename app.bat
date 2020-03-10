@echo off
mode 150,40
echo.
cd %~dp0
set DEBUG=bizNode:*
node ./bin/www
pause