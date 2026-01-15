// Importar configuración desde conf.js
// Ahora usa validateEmailWithBackend en lugar de URLs de AppScript directas

async function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('email').value.trim().toLowerCase();
  const errorDiv = document.getElementById('errorMessage');
  const submitBtn = event.target.querySelector('button[type="submit"]');
  
  if (!email) {
    showError(errorDiv, 'Por favor ingresa un email.');
    return;
  }
  
  submitBtn.disabled = true;
  submitBtn.textContent = 'Verificando...';
  
  try {
    // Validar email a través del backend (que se conecta a AppScripts de forma segura)
    const result = await validateEmailWithBackend(email);
    
    if (result.hasAccess) {
      // Guardar datos obtenidos del backend
      localStorage.setItem('userEmail', email);
      localStorage.setItem('accessibleServers', JSON.stringify(result.accessibleServers));
      
      // Guardar whatsapp si está disponible
      if (result.whatsapp) {
        localStorage.setItem('whatsapp', result.whatsapp);
      }
      
      hideError(errorDiv);
      window.location.href = REDIRECT_PAGE;
    } else {
      // Si ninguno valida, mostrar error
      showError(errorDiv, result.error || 'Email no autorizado en ningún servidor.');
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'INGRESAR<span class="arrow">→</span>';
    }
  } catch (error) {
    showError(errorDiv, 'Error conectando con los servidores. Intenta más tarde.');
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'INGRESAR<span class="arrow">→</span>';
    console.error('Error:', error);
  }
}

function showError(element, message) {
  if (element) {
    element.textContent = message;
    element.style.display = 'block';
  }
}

function hideError(element) {
  if (element) {
    element.textContent = '';
    element.style.display = 'none';
  }
}