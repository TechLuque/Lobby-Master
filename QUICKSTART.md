# ⚡ QUICK START - Primeros Pasos

## 5 MINUTOS PARA ACTIVAR LA SEGURIDAD

### 1️⃣ Copia el archivo de variables (1 min)

```bash
# En la carpeta raíz del proyecto
cp .env.example .env.local
```

### 2️⃣ Edita `.env.local` con tus URLs (2 min)

Abre `.env.local` y reemplaza con tus URLs reales de AppScript:

```
APPSCRIPT_CODIGO=https://script.google.com/macros/s/AKfycbyPjTaAQEWpI-uAVsEGKVtCklKcxNVa4H6tz5kVGaoUynvbwNOCN8owY243E7Ksgk5w/exec
APPSCRIPT_MAQUINA=https://script.google.com/macros/s/AKfycbztxJqZlrHcDNksOZLkJoIYWr1fG9h_3iIFNFpGNW5I_nFLv0ra1jV_-7gOua0VSlCl/exec
APPSCRIPT_MAESTRIA=https://script.google.com/macros/s/AKfycbyeNP0uCOCDp6gTsCRI3Dvk0WlAIueoPzm7_B9f-bdbgRQd4XdjTfcnMJPKqyZ5oEfc/exec
PORT=3000
NODE_ENV=development
```

### 3️⃣ Instala dependencias (1 min)

```bash
npm install
```

### 4️⃣ Inicia el servidor (1 min)

```bash
npm run dev
```

Verás:
```
🚀 API Backend corriendo en http://localhost:3000
📝 Endpoint: POST http://localhost:3000/api/validate-email
✅ Health: GET http://localhost:3000/api/health
```

### 5️⃣ Prueba en el navegador

```
http://localhost:3000
```

**¡Listo!** El sistema está funcionando de forma segura. 🎉

---

## 🔍 Verifica que está funcionando

### En otra terminal, ejecuta:

```bash
curl -X POST http://localhost:3000/api/validate-email \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

Deberías recibir una respuesta JSON.

---

## 📱 Verifica seguridad en navegador

1. Abre https://localhost:3000 (o http://localhost:3000)
2. Abre DevTools con **F12**
3. Ve a Tab **"Network"** (Red)
4. Intenta login con un email
5. **Observa las peticiones:**
   - ✅ Ves: `validate-email` (tu API segura)
   - ❌ NO ves: `script.google.com` (URLs protegidas)

---

## 🚀 Para Producción en Vercel

### 1. Hacer commit

```bash
git add .
git commit -m "Implementar sistema de autenticación seguro"
git push
```

### 2. Vercel CLI

```bash
npm install -g vercel
vercel  # Sigue las instrucciones
```

### 3. Agregar variables en Vercel Dashboard

1. https://vercel.com/dashboard
2. Selecciona tu proyecto
3. **Settings → Environment Variables**
4. Agrega las 3 variables APPSCRIPT_*
5. Deploy: `vercel --prod`

---

## 🛠️ Si hay problemas

### Error: "Cannot find module 'express'"
```bash
npm install
```

### Error: Puerto 3000 en uso
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Error: Variables no cargan
```bash
# Verifica que .env.local existe en la raíz
# Reinicia: npm run dev
```

---

## 📚 Documentación Completa

- **GUIA_SEGURIDAD.md** → Guía detallada de seguridad
- **ARQUITECTURA.md** → Diagramas y flujos
- **README.md** → Documentación completa

---

**¡Ahora tus datos de clientes están protegidos!** 🔒
