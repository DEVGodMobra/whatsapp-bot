#!/bin/bash

# Script de instalación automática para el bot de WhatsApp
# Compatible con Linux, macOS y Termux

echo "=================================="
echo "  Bot de WhatsApp - Instalador"
echo "=================================="
echo ""

# Detectar sistema operativo
if [[ "$OSTYPE" == "linux-android"* ]]; then
  SYSTEM="termux"
  echo "✓ Sistema detectado: Termux (Android)"
elif [[ "$OSTYPE" == "darwin"* ]]; then
  SYSTEM="macos"
  echo "✓ Sistema detectado: macOS"
else
  SYSTEM="linux"
  echo "✓ Sistema detectado: Linux"
fi

echo ""

# Verificar Node.js
echo "Verificando Node.js..."
if ! command -v node &> /dev/null; then
  echo "✗ Node.js no está instalado."
  
  if [ "$SYSTEM" == "termux" ]; then
    echo "Instalando Node.js en Termux..."
    pkg update && pkg upgrade -y
    pkg install nodejs -y
  elif [ "$SYSTEM" == "linux" ]; then
    echo "Instalando Node.js en Linux..."
    sudo apt update
    sudo apt install nodejs npm -y
  elif [ "$SYSTEM" == "macos" ]; then
    echo "Por favor instala Node.js desde: https://nodejs.org/"
    exit 1
  fi
else
  echo "✓ Node.js ya está instalado: $(node --version)"
fi

echo ""

# Verificar FFmpeg
echo "Verificando FFmpeg..."
if ! command -v ffmpeg &> /dev/null; then
  echo "✗ FFmpeg no está instalado."
  
  if [ "$SYSTEM" == "termux" ]; then
    echo "Instalando FFmpeg en Termux..."
    pkg install ffmpeg -y
  elif [ "$SYSTEM" == "linux" ]; then
    echo "Instalando FFmpeg en Linux..."
    sudo apt install ffmpeg -y
  elif [ "$SYSTEM" == "macos" ]; then
    echo "Instalando FFmpeg con Homebrew..."
    brew install ffmpeg
  fi
else
  echo "✓ FFmpeg ya está instalado: $(ffmpeg -version | head -n1)"
fi

echo ""

# Instalar dependencias de npm
echo "Instalando dependencias de Node.js..."
if [ -f "package.json" ]; then
  npm install
  
  if [ $? -eq 0 ]; then
    echo "✓ Dependencias instaladas correctamente"
  else
    echo "⚠ Hubo errores. Intentando con --legacy-peer-deps..."
    npm install --legacy-peer-deps
  fi
else
  echo "✗ No se encontró package.json en el directorio actual"
  exit 1
fi

echo ""
echo "=================================="
echo "  ✓ Instalación completada"
echo "=================================="
echo ""
echo "Para iniciar el bot, ejecuta:"
echo "  npm start"
echo ""
echo "O directamente:"
echo "  node index.js"
echo ""

# Dar permisos de ejecución al script
chmod +x install.sh
