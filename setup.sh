#!/bin/bash

# Script de Configuración Inicial del Bot de WhatsApp
# Este script te guiará paso a paso en la configuración

clear

echo "╔═══════════════════════════════════════════════════╗"
echo "║     Bot de WhatsApp - Configuración Inicial       ║"
echo "╚═══════════════════════════════════════════════════╝"
echo ""

# Función para preguntar Sí/No
ask_yes_no() {
  while true; do
    read -p "$1 (s/n): " yn
    case $yn in
      [Ss]* ) return 0;;
      [Nn]* ) return 1;;
      * ) echo "Por favor responde s o n.";;
    esac
  done
}

# Función para verificar si un comando existe
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Paso 1: Verificar Node.js
echo "🔍 Paso 1/5: Verificando Node.js..."
if command_exists node; then
  NODE_VERSION=$(node --version)
  echo "✓ Node.js instalado: $NODE_VERSION"
  
  # Verificar si es v16 o superior
  MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
  if [ "$MAJOR_VERSION" -lt 16 ]; then
    echo "⚠ Advertencia: Se recomienda Node.js v16 o superior"
    echo "  Tu versión: $NODE_VERSION"
  fi
else
  echo "✗ Node.js NO está instalado"
  echo ""
  echo "Por favor instala Node.js antes de continuar:"
  echo "  • Web: https://nodejs.org/"
  echo "  • Linux: sudo apt install nodejs npm"
  echo "  • macOS: brew install node"
  echo "  • Termux: pkg install nodejs"
  exit 1
fi

echo ""

# Paso 2: Verificar FFmpeg
echo "🔍 Paso 2/5: Verificando FFmpeg..."
if command_exists ffmpeg; then
  echo "✓ FFmpeg instalado"
else
  echo "✗ FFmpeg NO está instalado"
  echo ""
  if ask_yes_no "¿Quieres que intente instalarlo ahora?"; then
    if [[ "$OSTYPE" == "linux-android"* ]]; then
      # Termux
      pkg install ffmpeg -y
    elif [[ "$OSTYPE" == "darwin"* ]]; then
      # macOS
      if command_exists brew; then
        brew install ffmpeg
      else
        echo "Homebrew no está instalado. Instala FFmpeg manualmente."
      fi
    else
      # Linux
      sudo apt install ffmpeg -y
    fi
    
    if command_exists ffmpeg; then
      echo "✓ FFmpeg instalado correctamente"
    else
      echo "✗ No se pudo instalar FFmpeg automáticamente"
      echo "  Instálalo manualmente antes de continuar."
      exit 1
    fi
  else
    echo "FFmpeg es necesario para crear stickers. Instálalo antes de usar ese comando."
  fi
fi

echo ""

# Paso 3: Instalar dependencias
echo "📦 Paso 3/5: Instalando dependencias de Node.js..."

if [ ! -f "package.json" ]; then
  echo "✗ Error: No se encontró package.json"
  echo "  Asegúrate de estar en la carpeta del bot."
  exit 1
fi

if ask_yes_no "¿Instalar/actualizar dependencias ahora?"; then
  echo "Instalando... (esto puede tardar varios minutos)"
  
  if npm install; then
    echo "✓ Dependencias instaladas correctamente"
  else
    echo "⚠ Hubo errores. Intentando con --legacy-peer-deps..."
    if npm install --legacy-peer-deps; then
      echo "✓ Dependencias instaladas con --legacy-peer-deps"
    else
      echo "✗ Error al instalar dependencias"
      echo "  Revisa los errores arriba."
      exit 1
    fi
  fi
else
  echo "⏭ Saltando instalación de dependencias"
fi

echo ""

# Paso 4: Configurar el número de WhatsApp
echo "📱 Paso 4/5: Configurar tu número de WhatsApp"
echo ""

if ask_yes_no "¿Quieres configurar tu número ahora?"; then
  echo ""
  echo "Necesito tu número de WhatsApp CON código de país"
  echo "Ejemplos:"
  echo "  • Colombia: 573001234567"
  echo "  • México: 525512345678"
  echo "  • España: 34612345678"
  echo "  • Argentina: 5491123456789"
  echo ""
  
  read -p "Ingresa tu número (sin espacios ni símbolos): " PHONE_NUMBER
  
  # Validar que solo sean números
  if [[ ! "$PHONE_NUMBER" =~ ^[0-9]+$ ]]; then
    echo "✗ Error: Solo debes ingresar números"
    echo "  Edita config.js manualmente y cambia la línea owner:"
    echo "  owner: '${PHONE_NUMBER}@s.whatsapp.net',"
  else
    # Actualizar config.js
    if [[ "$OSTYPE" == "darwin"* ]]; then
      # macOS usa sed diferente
      sed -i '' "s/owner: '.*@s.whatsapp.net'/owner: '${PHONE_NUMBER}@s.whatsapp.net'/" config.js
    else
      sed -i "s/owner: '.*@s.whatsapp.net'/owner: '${PHONE_NUMBER}@s.whatsapp.net'/" config.js
    fi
    
    echo "✓ Número configurado: $PHONE_NUMBER"
  fi
else
  echo "⏭ Configuración manual requerida"
  echo "  Edita config.js y cambia la línea:"
  echo "  owner: 'TUNUMERO@s.whatsapp.net',"
fi

echo ""

# Paso 5: Personalizar el bot
echo "🎨 Paso 5/5: Personalización opcional"
echo ""

if ask_yes_no "¿Quieres cambiar el nombre del bot?"; then
  echo ""
  read -p "Ingresa el nuevo nombre del bot: " BOT_NAME
  
  if [ ! -z "$BOT_NAME" ]; then
    # Escapar caracteres especiales para sed
    BOT_NAME_ESCAPED=$(echo "$BOT_NAME" | sed 's/[\/&]/\\&/g')
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
      sed -i '' "s/botName: '.*'/botName: '${BOT_NAME_ESCAPED}'/" config.js
    else
      sed -i "s/botName: '.*'/botName: '${BOT_NAME_ESCAPED}'/" config.js
    fi
    
    echo "✓ Nombre cambiado a: $BOT_NAME"
  fi
fi

echo ""

if ask_yes_no "¿Quieres cambiar el prefijo de comandos?"; then
  echo ""
  echo "Prefijo actual: !"
  echo "Opciones: /, ., #, $, etc."
  read -p "Nuevo prefijo: " PREFIX
  
  if [ ! -z "$PREFIX" ]; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
      sed -i '' "s/prefix: '.*'/prefix: '${PREFIX}'/" config.js
    else
      sed -i "s/prefix: '.*'/prefix: '${PREFIX}'/" config.js
    fi
    
    echo "✓ Prefijo cambiado a: $PREFIX"
  fi
fi

echo ""
echo "╔═══════════════════════════════════════════════════╗"
echo "║            ✓ Configuración Completada             ║"
echo "╚═══════════════════════════════════════════════════╝"
echo ""
echo "🎉 ¡Todo listo para iniciar el bot!"
echo ""
echo "Próximos pasos:"
echo "  1. Ejecuta: npm start"
echo "  2. Escanea el código QR con WhatsApp"
echo "  3. ¡Disfruta tu bot!"
echo ""
echo "📚 Para más ayuda, lee:"
echo "  • README.md - Guía completa"
echo "  • INICIO-RAPIDO.md - Para principiantes"
echo "  • TROUBLESHOOTING.md - Solución de problemas"
echo ""

if ask_yes_no "¿Quieres iniciar el bot ahora?"; then
  echo ""
  echo "╔═══════════════════════════════════════════════════╗"
  echo "║              Iniciando el bot...                  ║"
  echo "╚═══════════════════════════════════════════════════╝"
  echo ""
  echo "Para detener el bot, presiona CTRL + C"
  echo ""
  sleep 2
  npm start
else
  echo ""
  echo "Para iniciar el bot más tarde, ejecuta:"
  echo "  npm start"
  echo ""
fi
