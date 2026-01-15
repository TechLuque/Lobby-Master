/**
 * CONFIGURACIÓN DE APLICACIÓN
 * Las URLs de AppScript se protegen con variables de entorno en Vercel
 * El cliente llama a una serverless function que maneja la validación de forma segura
 */

// URL base del API (Vercel serverless function)
// Automáticamente apunta a tu dominio de Vercel
const API_BASE_URL = '/api';

/**
 * Valida email a través de la serverless function de Vercel
 * Las URLs de AppScript nunca se exponen al cliente
 * @param {string} email - Email a validar
 * @returns {Promise} Respuesta del servidor
 */
async function validateEmailWithBackend(email) {
  try {
    const response = await fetch(`${API_BASE_URL}/validate-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error validando email:', error);
    throw error;
  }
}

const REDIRECT_PAGE = '../lobby/lobby.html';
