@echo off
set APP_NAME=CarlinMidiaOfic
:: Obtém a data no formato YYYY-MM-DD usando PowerShell para evitar erros de localidade do CMD
for /f "tokens=*" %%i in ('powershell -NoProfile -Command "Get-Date -Format 'yyyy-MM-dd'"') do set DATE=%%i

echo 🚀 Build iniciado: %APP_NAME% (%DATE%)

REM Entra na pasta android se existir
if exist android (
  cd android
)

REM Executa o Gradle Wrapper
call gradlew.bat clean
call gradlew.bat assembleRelease

set APK_ORIGEM=app\build\outputs\apk\release\app-release.apk
set NEW_APK_NAME=%APP_NAME%-%DATE%.apk

if exist "%APK_ORIGEM%" (
  copy "%APK_ORIGEM%" "..\%NEW_APK_NAME%"
  echo.
  echo ✅ APK gerado com sucesso: %NEW_APK_NAME%
  echo 📍 Caminho: .\%NEW_APK_NAME%
) else (
  echo.
  echo ❌ Erro: O arquivo APK nao foi localizado.
)

cd ..
pause