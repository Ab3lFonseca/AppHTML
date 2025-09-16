// Perfil Page Specific JavaScript

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
  loadProfile();
  setupFormValidation();
  setupAnimations();
});

function loadProfile() {
  // Load user data from localStorage or API
  const userData = JSON.parse(localStorage.getItem('appUser') || '{}');
  
  if (userData.nome) {
    document.getElementById('profile-nome').value = userData.nome || '';
    document.getElementById('profile-sobrenome').value = userData.sobrenome || '';
    document.getElementById('profile-email').value = userData.email || '';
    document.getElementById('profile-telefone').value = userData.telefone || '';
    document.getElementById('profile-bio').value = userData.bio || '';
    document.getElementById('profile-display-name').textContent = userData.nome || 'Usuário';
  }
  
  // Update profile stats (placeholder)
  updateProfileStats();
}

function setupFormValidation() {
  const form = document.getElementById('profile-form');
  if (form) {
    // Add real-time validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', function() {
        validateField(this);
      });
      
      input.addEventListener('input', function() {
        clearFieldError(this);
      });
    });
    
    // Phone number formatting
    const phoneInput = document.getElementById('profile-telefone');
    if (phoneInput) {
      phoneInput.addEventListener('input', function(e) {
        this.value = formatPhone(this.value);
      });
    }
  }
}

function setupAnimations() {
  // Add entrance animations
  const profileCard = document.querySelector('.profile-card');
  const profileInfo = document.querySelector('.profile-info');
  
  if (profileCard) {
    profileCard.style.opacity = '0';
    profileCard.style.transform = 'translateX(-30px)';
    
    setTimeout(() => {
      profileCard.style.transition = 'all 0.8s ease';
      profileCard.style.opacity = '1';
      profileCard.style.transform = 'translateX(0)';
    }, 200);
  }
  
  if (profileInfo) {
    profileInfo.style.opacity = '0';
    profileInfo.style.transform = 'translateX(30px)';
    
    setTimeout(() => {
      profileInfo.style.transition = 'all 0.8s ease';
      profileInfo.style.opacity = '1';
      profileInfo.style.transform = 'translateX(0)';
    }, 400);
  }
  
  // Add hover effects to stats
  const stats = document.querySelectorAll('.stat');
  stats.forEach(stat => {
    stat.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px) scale(1.05)';
    });
    
    stat.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });
}

function validateField(field) {
  const value = field.value.trim();
  const fieldName = field.id.replace('profile-', '');
  let isValid = true;
  let errorMessage = '';
  
  // Clear previous errors
  clearFieldError(field);
  
  switch(fieldName) {
    case 'nome':
    case 'sobrenome':
      if (value.length < 2) {
        isValid = false;
        errorMessage = 'Deve ter pelo menos 2 caracteres';
      }
      break;
      
    case 'email':
      if (value && !isValidEmail(value)) {
        isValid = false;
        errorMessage = 'Email inválido';
      }
      break;
      
    case 'telefone':
      if (value && !isValidPhone(value)) {
        isValid = false;
        errorMessage = 'Telefone inválido. Use o formato (11) 99999-9999';
      }
      break;
  }
  
  if (!isValid) {
    showFieldError(field, errorMessage);
  }
  
  return isValid;
}

function showFieldError(field, message) {
  field.classList.add('is-invalid');
  
  let errorDiv = field.parentNode.querySelector('.invalid-feedback');
  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    field.parentNode.appendChild(errorDiv);
  }
  
  errorDiv.textContent = message;
}

function clearFieldError(field) {
  field.classList.remove('is-invalid');
  const errorDiv = field.parentNode.querySelector('.invalid-feedback');
  if (errorDiv) {
    errorDiv.remove();
  }
}

function saveProfile() {
  const form = document.getElementById('profile-form');
  const inputs = form.querySelectorAll('input, textarea');
  let isFormValid = true;
  
  // Validate all fields
  inputs.forEach(input => {
    if (!validateField(input)) {
      isFormValid = false;
    }
  });
  
  if (!isFormValid) {
    showNotification('Por favor, corrija os erros no formulário', 'error');
    return;
  }
  
  const userData = {
    nome: document.getElementById('profile-nome').value,
    sobrenome: document.getElementById('profile-sobrenome').value,
    email: document.getElementById('profile-email').value,
    telefone: document.getElementById('profile-telefone').value,
    bio: document.getElementById('profile-bio').value
  };
  
  // Show loading state
  const saveButton = document.querySelector('.btn-primary');
  const originalText = saveButton.innerHTML;
  saveButton.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Salvando...';
  saveButton.disabled = true;
  
  // Simulate API call
  setTimeout(() => {
    // Save to localStorage
    localStorage.setItem('appUser', JSON.stringify(userData));
    
    // Update display name
    document.getElementById('profile-display-name').textContent = userData.nome || 'Usuário';
    
    // Restore button
    saveButton.innerHTML = originalText;
    saveButton.disabled = false;
    
    // Show success message
    showNotification('Perfil atualizado com sucesso!', 'success');
    
    // Add success animation
    const profileCard = document.querySelector('.profile-card');
    if (profileCard) {
      profileCard.style.transform = 'scale(1.05)';
      setTimeout(() => {
        profileCard.style.transform = 'scale(1)';
      }, 200);
    }
  }, 1500);
}

function updateProfileStats() {
  // This would normally come from an API
  const stats = {
    pontos: Math.floor(Math.random() * 1000) + 500,
    locaisVisitados: Math.floor(Math.random() * 50) + 10,
    posicao: Math.floor(Math.random() * 100) + 1
  };
  
  // Update stats with animation
  const statElements = document.querySelectorAll('.stat h4');
  statElements.forEach((element, index) => {
    const values = [stats.pontos, stats.locaisVisitados, `${stats.posicao}º`];
    if (values[index]) {
      animateNumber(element, values[index]);
    }
  });
}

function animateNumber(element, targetValue) {
  const isNumber = typeof targetValue === 'number';
  const target = isNumber ? targetValue : parseInt(targetValue);
  const duration = 2000;
  const startTime = Date.now();
  const startValue = 0;
  
  function update() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const currentValue = Math.floor(startValue + (target - startValue) * progress);
    element.textContent = isNumber ? currentValue : `${currentValue}º`;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  update();
}

// Profile picture upload (placeholder)
function uploadProfilePicture() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  
  input.onchange = function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const avatar = document.querySelector('.profile-avatar');
        if (avatar) {
          avatar.style.backgroundImage = `url(${e.target.result})`;
          avatar.style.backgroundSize = 'cover';
          avatar.style.backgroundPosition = 'center';
          avatar.innerHTML = '';
        }
        showNotification('Foto de perfil atualizada!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };
  
  input.click();
}

// Add profile picture upload functionality
document.addEventListener('DOMContentLoaded', function() {
  const profileAvatar = document.querySelector('.profile-avatar');
  if (profileAvatar) {
    profileAvatar.style.cursor = 'pointer';
    profileAvatar.title = 'Clique para alterar foto';
    profileAvatar.addEventListener('click', uploadProfilePicture);
  }
});

// Export profile data
function exportProfile() {
  const userData = JSON.parse(localStorage.getItem('appUser') || '{}');
  const dataStr = JSON.stringify(userData, null, 2);
  const dataBlob = new Blob([dataStr], {type: 'application/json'});
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = 'meu-perfil.json';
  link.click();
  
  showNotification('Perfil exportado com sucesso!', 'success');
}

// Delete profile
function deleteProfile() {
  if (confirm('Tem certeza que deseja excluir seu perfil? Esta ação não pode ser desfeita.')) {
    localStorage.removeItem('appUser');
    localStorage.removeItem('isLoggedIn');
    showNotification('Perfil excluído com sucesso!', 'success');
    
    setTimeout(() => {
      window.location.href = '../../index.html';
    }, 2000);
  }
}

