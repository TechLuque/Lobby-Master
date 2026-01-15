# 🔐 Zoom Admin Panel - Sistema de Autenticación Seguro

Panel de administración para validación segura de acceso a salas Zoom con protección de datos sensibles.

## ⚡ Cambios de Seguridad Recientes

Se ha implementado un **sistema de proxy backend** para proteger las URLs de AppScript. Ahora las URLs están en variables de entorno y **NO se exponen en el navegador**.

### Antes ❌
- URLs de AppScript visibles en el navegador
- Datos de clientes expuestos en el inspector de red
- Cualquiera podía ver y reutilizar las URLs

### Ahora ✅
- URLs protegidas en variables de entorno
- Backend actúa como proxy seguro
- Datos nunca se exponen al cliente
- URLs pueden rotarse fácilmente

## 🚀 Inicio Rápido

### 1. Configuración Local

```bash
# Copia la plantilla de variables de entorno
cp .env.example .env.local

# Edita .env.local y agregar tus URLs de AppScript reales
# (archivo abierto en tu editor)
```

### 2. Instalar y Ejecutar

```bash
# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev

# El servidor corre en: http://localhost:3000
```

### 3. Verificar que funciona

En otra terminal:
```bash
curl -X POST http://localhost:3000/api/health
# Respuesta: {"status":"OK","timestamp":"..."}
```

### 4. Abrir en navegador

```
http://localhost:3000
```

## 🌐 Despliegue en Vercel

### Paso 1: Preparar proyecto
```bash
git add .
git commit -m "Implementar sistema de autenticación seguro"
git push
```

### Paso 2: Conectar con Vercel
```bash
# Instalar Vercel CLI
npm install -g vercel

# Desplegar
vercel
```

### Paso 3: Agregar variables de entorno en Vercel Dashboard

1. Accede a: https://vercel.com/dashboard
2. Selecciona tu proyecto
3. Ve a **Settings → Environment Variables**
4. Agrega (en producción):
   ```
   APPSCRIPT_CODIGO = https://script.google.com/macros/s/.../exec
   APPSCRIPT_MAQUINA = https://script.google.com/macros/s/.../exec
   APPSCRIPT_MAESTRIA = https://script.google.com/macros/s/.../exec
   ```
5. Haz deploy en producción:
   ```bash
   vercel --prod
   ```

## 📂 Estructura del Proyecto

```
Zoom/
├── api/
│   └── server.js              ← Backend Express (proxy seguro)
├── sources/
│   ├── components/
│   │   └── configuracion/
│   │       └── conf.js        ← Config del cliente (usa API)
│   └── views/
│       ├── codigo/
│       ├── login/
│       │   └── login.js       ← (Actualizado)
│       ├── lobby/
│       ├── maestria/
│       └── maquina/
├── .env.example               ← Plantilla de variables
├── .env.local                 ← (NO COMMITTEAR) Tus URLs reales
├── .gitignore
├── package.json
├── vercel.json
├── GUIA_SEGURIDAD.md         ← Documentación de seguridad
└── DOCUMENTACION_PROYECTO.md
```

## 🔍 Verificar Seguridad

### En DevTools del Navegador (F12)

1. Ve a **Tab "Network"** (Red)
2. Intenta hacer login
3. **Verifica que ves:**
   - ✅ Petición a: `https://tudominio.com/api/validate-email`
   - ❌ **NO** deberías ver URLs de: `script.google.com`

## 🛠️ API Endpoints

### Validar Email
```bash
POST /api/validate-email
Content-Type: application/json

{
  "email": "usuario@example.com"
}

Respuesta exitosa:
{
  "hasAccess": true,
  "accessibleServers": [
    { "ok": true, "join_url": "...", "whatsapp": "..." },
    null,
    { "ok": true, "join_url": "...", "whatsapp": "..." }
  ],
  "whatsapp": "573176484451"
}

Respuesta sin acceso:
{
  "hasAccess": false,
  "error": "Email no autorizado"
}
```

### Health Check
```bash
GET /api/health

Respuesta:
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🔐 Variables de Entorno

### Desarrollo (`.env.local`)
```
APPSCRIPT_CODIGO=https://...
APPSCRIPT_MAQUINA=https://...
APPSCRIPT_MAESTRIA=https://...
PORT=3000
NODE_ENV=development
```

### Producción (Vercel Dashboard)
- Agrega las mismas variables en: Settings → Environment Variables
- **NO** es necesario agregar PORT (Vercel lo maneja)

## 📝 Archivos Modificados

- ✅ `sources/components/configuracion/conf.js` - Sin URLs hardcodeadas
- ✅ `sources/views/login/login.js` - Usa nuevo backend
- ✨ `api/server.js` - Nuevo servidor proxy
- ✨ `.env.example` - Nueva plantilla
- ✨ `.gitignore` - Protege variables sensibles
- ✨ `vercel.json` - Config despliegue
- ✨ `package.json` - Dependencias Node.js

## 🚨 Importante: Seguridad

1. **NUNCA** commitees `.env` o `.env.local`
2. Si una URL se expone, regenérala en AppScript
3. Solo usa HTTPS en producción
4. Rotación de URLs cada 3-6 meses

## 📞 Troubleshooting

### Error: "Cannot find module 'dotenv'"
```bash
npm install dotenv
```

### Error: "EADDRINUSE: address already in use :::3000"
```bash
# Cambiar puerto en .env.local o matar proceso
lsof -ti:3000 | xargs kill -9
```

### Variables de entorno no cargan
```bash
# Verificar que .env.local existe en raíz del proyecto
# Verificar sintaxis: VARIABLE=valor (sin comillas)
# Reiniciar servidor: npm run dev
```

## 📚 Más Información

- [GUIA_SEGURIDAD.md](./GUIA_SEGURIDAD.md) - Guía detallada de seguridad
- [Documentación Express](https://expressjs.com/)
- [Documentación Vercel](https://vercel.com/docs)

---

**Última actualización:** Enero 2026
**Versión:** 1.0.0 (Sistema de seguridad implementado)
