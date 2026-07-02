@echo off
title Hipnose Resolve - Apresentacao
cd /d "%~dp0"
echo.
echo  A preparar o site para apresentacao (pode demorar ~1 minuto)...
echo.
call npm run build
if errorlevel 1 (
  echo.
  echo  ERRO no build. Corre "npm install" nesta pasta e tenta de novo.
  pause
  exit /b 1
)
echo.
echo  A abrir o site no browser... (deixa esta janela aberta durante a apresentacao)
start http://localhost:4321
call npm run preview
pause
