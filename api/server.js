/**
 * VERCEL SERVERLESS FUNCTION - Proxy seguro para AppScripts
 * Las URLs de AppScript se protegen con variables de entorno de Vercel
 * 
 * Variables de entorno en Vercel Dashboard:
 * - APPSCRIPT_CODIGO
 * - APPSCRIPT_MAQUINA
 * - APPSCRIPT_MAESTRIA
 */

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Health check
  if (req.method === 'GET') {
    return res.status(200).json({ 
      status: 'OK',
      message: 'API servidor funcionando',
      timestamp: new Date().toISOString(),
      variables: {
        APPSCRIPT_CODIGO: process.env.APPSCRIPT_CODIGO ? 'Configurada' : 'NO configurada',
        APPSCRIPT_MAQUINA: process.env.APPSCRIPT_MAQUINA ? 'Configurada' : 'NO configurada',
        APPSCRIPT_MAESTRIA: process.env.APPSCRIPT_MAESTRIA ? 'Configurada' : 'NO configurada'
      }
    });
  }

  // Validar email (POST)
  if (req.method === 'POST') {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ 
          hasAccess: false, 
          error: 'Email es requerido' 
        });
      }

      // URLs de AppScript desde variables de entorno de Vercel
      const appScripts = [
        process.env.APPSCRIPT_CODIGO,
        process.env.APPSCRIPT_MAQUINA,
        process.env.APPSCRIPT_MAESTRIA
      ];

      // Validar que las variables están configuradas
      if (appScripts.some(url => !url)) {
        console.error('ERROR: Variables de entorno APPSCRIPT_* no configuradas en Vercel');
        console.error('APPSCRIPT_CODIGO:', process.env.APPSCRIPT_CODIGO ? 'OK' : 'FALTA');
        console.error('APPSCRIPT_MAQUINA:', process.env.APPSCRIPT_MAQUINA ? 'OK' : 'FALTA');
        console.error('APPSCRIPT_MAESTRIA:', process.env.APPSCRIPT_MAESTRIA ? 'OK' : 'FALTA');
        return res.status(500).json({ 
          hasAccess: false, 
          error: 'Error de configuración del servidor - Variables de entorno no configuradas'
        });
      }

      // Validar contra los 3 AppScripts en paralelo
      const results = await Promise.all(
        appScripts.map(url => validateWithAppScript(url, email))
      );

      // Procesar resultados
      const accessibleServers = results.map(r => 
        (r && r.ok) ? {
          ok: r.ok,
          join_url: r.join_url,
          whatsapp: r.whatsapp
        } : null
      );

      const hasAccess = accessibleServers.some(s => s !== null);
      const whatsapp = results.find(r => r && r.whatsapp)?.whatsapp || null;

      return res.status(200).json({
        hasAccess,
        accessibleServers,
        whatsapp,
        error: hasAccess ? null : 'Email no autorizado'
      });

    } catch (error) {
      console.error('Error en /api/validate-email:', error);
      return res.status(500).json({ 
        hasAccess: false, 
        error: 'Error en el servidor: ' + error.message
      });
    }
  }

  return res.status(405).json({ error: 'Método no permitido' });
}
}

/**
 * Valida email en un AppScript específico
 */
async function validateWithAppScript(appScriptUrl, email) {
  try {
    const params = new URLSearchParams();
    params.append('email', email);

    const response = await fetch(appScriptUrl, {
      method: 'POST',
      body: params
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error conectando a AppScript:`, error);
    return null;
  }
}
