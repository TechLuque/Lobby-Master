# 🔐 Zoom Admin Panel

Sistema de validación de acceso a salas Zoom con seguridad máxima.

## ✅ Características

- ✨ URLs de AppScript protegidas en variables de entorno (Vercel)
- 🔒 Sin exposición de datos sensibles en el navegador
- 🚀 Serverless en Vercel (sin servidor local)
- ⚡ Auto-deploy con Git push

## 🚀 Despliegue en Vercel

### 1. Git Push
```bash
git add .
git commit -m "Actualizaciones"
git push origin main
```

### 2. Variables de Entorno
En **Vercel Dashboard** → **Settings** → **Environment Variables**:

```
APPSCRIPT_CODIGO = https://script.google.com/macros/s/.../exec
APPSCRIPT_MAQUINA = https://script.google.com/macros/s/.../exec
APPSCRIPT_MAESTRIA = https://script.google.com/macros/s/.../exec
```

### 3. Deploy
Vercel despliega automáticamente. ✅

## 🔍 Verificar Seguridad

1. DevTools (F12) → Network
2. Intenta login
3. **Verifica:**
   - ✅ Peticiones a `/api/validate-email`
   - ❌ NO ves URLs de `script.google.com`

## 📂 Estructura

```
api/
  └── validate-email.js    ← Serverless function

sources/
  ├── components/
  │   └── configuracion/
  │       └── conf.js
  └── views/
      ├── login/
      ├── lobby/
      ├── codigo/
      ├── maquina/
      └── maestria/

.env.example               ← Plantilla
vercel.json               ← Config Vercel
package.json              ← Dependencias
```

## 📝 Notas

- Las variables de entorno se actualizan en Vercel Dashboard
- No requiere configuración local
- Todos los datos sensibles están protegidos

---

**Seguridad garantizada.** ✅
