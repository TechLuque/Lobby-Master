# 🔐 Zoom Admin Panel - Sistema de Autenticación Seguro

Panel de administración para validación segura de acceso a salas Zoom con variables de entorno protegidas en Vercel.

## ✅ Sistema Seguro con Vercel

Las URLs de AppScript están **protegidas en variables de entorno de Vercel** (nunca en el código).

### ¿Cómo funciona?

```
Cliente (Navegador)
    ↓
Petición a: /api/validate-email (TU DOMINIO)
    ↓
Vercel Serverless Function (api/server.js)
    ↓
Lee variables de entorno (APPSCRIPT_*)
    ↓
Valida con AppScripts
    ↓
Retorna datos al cliente (SIN exponer URLs)
```

## 🚀 Despliegue en Vercel (TODO EN LA NUBE)

### 1. Conectar Repositorio a Vercel

1. Ve a https://vercel.com/dashboard
2. Click **"Add New"** → **"Project"**
3. Selecciona tu repositorio (GitHub, GitLab, etc.)
4. Click **"Import"**

### 2. Agregar Variables de Entorno

1. En **Settings** → **Environment Variables**
2. Agrega 3 variables:

```
APPSCRIPT_CODIGO = https://script.google.com/macros/s/.../exec
APPSCRIPT_MAQUINA = https://script.google.com/macros/s/.../exec
APPSCRIPT_MAESTRIA = https://script.google.com/macros/s/.../exec
```

3. Click **"Save"**

### 3. Deploy

```bash
git push origin main

# Vercel automáticamente despliega cuando haces push
```

¡Listo! Tu proyecto está en vivo. 🎉

## 📝 Cambios en el Código

### ✅ conf.js
- Ahora apunta a `/api/validate-email` (tu servidor)
- NO contiene URLs de AppScript

### ✅ api/server.js
- Serverless function (Vercel la ejecuta automáticamente)
- Lee variables de entorno de Vercel
- Valida con AppScripts de forma segura

### ✅ login.js
- Usa `validateEmailWithBackend()` en lugar de URLs directas
- Apunta a `/api/validate-email`

## 🔍 Verificar Seguridad

1. Abre tu proyecto en Vercel: `https://tu-proyecto.vercel.app`
2. Abre DevTools (F12) → Tab "Network"
3. Intenta login
4. **Observa:**
   - ✅ Peticiones a: `/api/validate-email`
   - ❌ NO verás: `script.google.com`

## 📂 Estructura

```
Proyecto/
├── api/
│   └── server.js              ← Vercel la ejecuta automáticamente
├── sources/
│   ├── components/
│   │   └── configuracion/
│   │       └── conf.js        ← Config (no hardcoded)
│   └── views/
│       ├── codigo/
│       ├── login/
│       │   └── login.js       ← (Actualizado)
│       ├── lobby/
│       ├── maestria/
│       └── maquina/
├── .env.example               ← Documentación
├── .gitignore
├── package.json
└── vercel.json
```

## 🛡️ Seguridad

- ✅ URLs de AppScript protegidas en Vercel
- ✅ No hay configuración local
- ✅ No hay `.env` en el código
- ✅ Auto-deploy con Git

## 🚨 Si se expone una URL

1. Regenera la URL en AppScript
2. Actualiza la variable en Vercel Dashboard
3. **Listo** - Automáticamente actualizado

## 📞 Documentación

- [GUIA_SEGURIDAD.md](./GUIA_SEGURIDAD.md) - Guía de seguridad
- [ARQUITECTURA.md](./ARQUITECTURA.md) - Diagramas y flujos

---

**Sistema seguro en Vercel.** ✅
