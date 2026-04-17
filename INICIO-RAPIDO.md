# 🚀 GUÍA RÁPIDA DE INICIO

## Para Principiantes Absolutos

Si nunca has usado Node.js o la terminal, sigue estos pasos exactamente:

---

## 🖥️ EN COMPUTADORA (Windows)

### 1️⃣ Instalar Node.js
- Ve a: https://nodejs.org/
- Descarga la versión **LTS** (la verde)
- Ejecuta el instalador
- Haz clic en "Next" hasta que termine
- Reinicia tu computadora

### 2️⃣ Instalar FFmpeg
- Ve a: https://www.gyan.dev/ffmpeg/builds/
- Descarga: **ffmpeg-release-essentials.zip**
- Extrae el ZIP
- Copia la carpeta a `C:\ffmpeg`
- Agrega al PATH:
  1. Busca "variables de entorno" en Windows
  2. Edita la variable "Path"
  3. Agrega: `C:\ffmpeg\bin`
  4. Guarda

### 3️⃣ Preparar el Bot
- Descarga todos los archivos del bot
- Crea una carpeta en tu escritorio llamada `mi-bot-whatsapp`
- Copia todos los archivos ahí

### 4️⃣ Abrir la Terminal
- Presiona `Windows + R`
- Escribe: `cmd`
- Presiona Enter

### 5️⃣ Navegar a la Carpeta
```cmd
cd Desktop\mi-bot-whatsapp
```

### 6️⃣ Instalar Dependencias
```cmd
npm install
```

Espera 2-5 minutos. Si hay errores, escribe:
```cmd
npm install --legacy-peer-deps
```

### 7️⃣ Configurar tu Número
- Abre el archivo `config.js` con Notepad
- Cambia la línea:
```javascript
owner: '593XXXXXXXXX@s.whatsapp.net',
```
- Pon tu número completo con código de país
- Ejemplo Colombia: `'573001234567@s.whatsapp.net'`
- Guarda el archivo

### 8️⃣ Iniciar el Bot
```cmd
npm start
```

### 9️⃣ Escanear el QR
- Aparecerá un código QR en la terminal
- Abre WhatsApp en tu teléfono
- Ve a: **Configuración → Dispositivos vinculados**
- Toca: **Vincular un dispositivo**
- Escanea el QR

### 🎉 ¡Listo!
El bot está funcionando. Prueba enviándote: `!menu`

---

## 📱 EN ANDROID (Termux)

### 1️⃣ Instalar Termux
- NO instales desde Google Play (está desactualizado)
- Descarga desde F-Droid: https://f-droid.org/
- Instala Termux

### 2️⃣ Actualizar Termux
Abre Termux y escribe (uno por uno):

```bash
pkg update
```
Presiona `y` cuando pregunte

```bash
pkg upgrade
```
Presiona `y` de nuevo

### 3️⃣ Instalar Node.js
```bash
pkg install nodejs -y
```

Espera 5-10 minutos

### 4️⃣ Instalar FFmpeg
```bash
pkg install ffmpeg -y
```

### 5️⃣ Dar Permisos
```bash
termux-setup-storage
```

Acepta el permiso cuando te lo pida

### 6️⃣ Crear Carpeta
```bash
cd storage/downloads
mkdir whatsapp-bot
cd whatsapp-bot
```

### 7️⃣ Transferir Archivos
Desde tu PC:
- Conecta el cable USB
- Copia la carpeta del bot a: **Downloads/whatsapp-bot**

O usa Google Drive:
- Sube los archivos a Drive
- Descárgalos en el teléfono
- Muévelos a Downloads/whatsapp-bot

### 8️⃣ Instalar Dependencias
Dentro de Termux:
```bash
npm install
```

Si hay errores:
```bash
npm install --legacy-peer-deps
```

### 9️⃣ Editar config.js
```bash
nano config.js
```

Cambia tu número:
```javascript
owner: '573001234567@s.whatsapp.net',
```

Guarda con:
- `CTRL + X`
- Presiona `Y`
- Enter

### 🔟 Iniciar el Bot
```bash
node index.js
```

### 1️⃣1️⃣ Mantener Termux Activo
En otra sesión de Termux (desliza desde la izquierda → New Session):
```bash
termux-wake-lock
```

### 🎉 ¡Funciona!

---

## ⚡ COMANDOS ESENCIALES

Una vez funcionando, prueba:

```
!menu          → Ver comandos
!meme          → Meme aleatorio
!dado          → Lanzar dado
!frase         → Frase motivacional
!verdad        → Pregunta de verdad
!reto          → Reto divertido
```

Para stickers:
1. Envía una imagen
2. Responde a esa imagen con: `!sticker`

Para música (necesitas URL de YouTube):
```
!musica https://youtu.be/kJQP7kiw5Fk
```

Para voz:
```
!tts Hola amigos del grupo
```

---

## 🆘 PROBLEMAS COMUNES

### "node no se reconoce como comando"
- Reinicia la computadora después de instalar Node.js
- O cierra y abre la terminal de nuevo

### "Cannot find module"
```bash
npm install
```

### El QR no aparece
- Espera 30 segundos
- Si no aparece, presiona `CTRL + C` y vuelve a ejecutar

### "FFmpeg not found"
- Verifica que FFmpeg esté en el PATH
- O reinstálalo

### El bot se cierra solo
- En Termux usa `termux-wake-lock`
- No cierres la app Termux

### Errores de descarga de YouTube
- YouTube cambia seguido su API
- Usa URLs directas de videos
- Considera usar APIs alternativas

---

## 📞 SOPORTE

Si nada funciona:
1. Lee los mensajes de error completos
2. Cópialos y búscalos en Google
3. Revisa que Node.js y FFmpeg estén instalados correctamente
4. Verifica que todos los archivos estén en la carpeta correcta

---

## 🎊 ¡Éxito!

Ahora tienes tu propio bot de WhatsApp.

**Recuerda:**
- Úsalo responsablemente
- Solo en grupos pequeños de amigos
- No hagas spam
- Usa un número secundario

¡Diviértete! 🤖
