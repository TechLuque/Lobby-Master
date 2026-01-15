# ⚡ QUICK START - Vercel en 3 Pasos

## 1️⃣ Git Push (1 min)

```bash
git add .
git commit -m "Sistema de autenticación seguro"
git push origin main
```

## 2️⃣ Conectar Vercel (2 min)

1. Ve a https://vercel.com/dashboard
2. **"Add New"** → **"Project"**
3. Selecciona tu repositorio
4. Click **"Import"**

Vercel detecta automáticamente tu proyecto.

## 3️⃣ Variables de Entorno (1 min)

En Vercel Dashboard:

1. **Settings** → **Environment Variables**
2. Agrega 3 variables:

```
APPSCRIPT_CODIGO=https://script.google.com/macros/s/.../exec
APPSCRIPT_MAQUINA=https://script.google.com/macros/s/.../exec
APPSCRIPT_MAESTRIA=https://script.google.com/macros/s/.../exec
```

3. Click **"Save"**
4. Click **"Deploy"**

---

## ✅ ¡Listo!

Tu proyecto está en vivo: `https://tu-proyecto.vercel.app`

### Verificar Seguridad

1. Abre tu sitio
2. DevTools (F12) → Network
3. Intenta login
4. **Verifica:**
   - ✅ Peticiones a: `/api/validate-email`
   - ❌ NO ves: `script.google.com`

---

## 🚀 Actualizar en el Futuro

Solo haz:
```bash
git push origin main
```

**Vercel automáticamente redeploy.** 🎉

