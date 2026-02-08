#!/bin/bash

# ============================================================
# CARLIN MÍDIA OFIC - AUTOMATION ENGINE (PRODUCTION V3.6)
# Script: build_apk.sh
# ============================================================

APP_NAME="CarlinMidiaOfic"
DATE=$(date +"%Y-%m-%d")

echo "🚀 Build iniciado: $APP_NAME"

# Entra na pasta android se existir
if [ -d "android" ]; then
  cd android
fi

# Garante permissões de execução
if [ -f "gradlew" ]; then
  chmod +x gradlew
else
  echo "❌ Erro: gradlew não encontrado no diretório android/"
  exit 1
fi

echo "🧹 Limpando cache e artefatos..."
./gradlew clean

echo "🏗️ Compilando :app:assembleRelease..."
./gradlew assembleRelease

APK_PATH="app/build/outputs/apk/release/app-release.apk"
NEW_APK_NAME="${APP_NAME}-${DATE}.apk"

if [ -f "$APK_PATH" ]; then
  # Copia para o diretório raiz do projeto
  cp "$APK_PATH" "../$NEW_APK_NAME"
  echo ""
  echo "✅ APK GERADO COM SUCESSO!"
  echo "📍 Artefato disponível em: ./$NEW_APK_NAME"
else
  echo ""
  echo "❌ Erro: APK não foi localizado após a compilação."
  exit 1
fi