// Cadastro Page Specific JavaScript

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
  setupFormValidation();
  setupPasswordStrength();
  setupAnimations();
});

function setupFormValidation() {
  const form = document.getElementById('cadastro-form');
  if (form) {
    // Real-time validation
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('blur', function() {
        validateField(this);
      });
      
      input.addEventListener('input', function() {
        clearFieldError(this);
        
        // Special handling for password confirmation
        if (this.id === 'cadastro-confirmar-senha') {
          validatePasswordMatch();
        }
      });
    });
    
    // Phone number formatting
    const phoneInput = document.getElementById('cadastro-telefone');
    if (phoneInput) {
      phoneInput.addEventListener('input', function(e) {
        this.value = formatPhone(this.value);
      });
    }
    
    // Form submission
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      submitForm();
    });
  }
}

function setupPasswordStrength() {
  const passwordInput = document.getElementById('cadastro-senha');
  if (passwordInput) {
    // Create password strength indicator
    const strengthDiv = document.createElement('div');
    strengthDiv.className = 'password-strength mt-2';
    strengthDiv.innerHTML = `
      <div class="progress" style="height: 5px;">
        <div class="progress-bar" role="progressbar" style="width: 0%"></div>
      </div>
      <small class="text-muted">Força da senha: <span class="strength-text">Muito fraca</span></small>
    `;
    passwordInput.parentNode.appendChild(strengthDiv);
    
    passwordInput.addEventListener('input', function() {
      updatePasswordStrength(this.value);
    });
  }
}

function updatePasswordStrength(password) {
  const strengthBar = document.querySelector('.password-strength .progress-bar');
  const strengthText = document.querySelector('.strength-text');
  
  if (!strengthBar || !strengthText) return;
  
  let strength = 0;
  let text = 'Muito fraca';
  let color = 'bg-danger';
  
  // Check password criteria
  if (password.length >= 8) strength += 25;
  if (/[a-z]/.test(password)) strength += 25;
  if (/[A-Z]/.test(password)) strength += 25;
  if (/[0-9]/.test(password)) strength += 25;
  
  // Update text and color based on strength
  if (strength >= 100) {
    text = 'Muito forte';
    color = 'bg-success';
  } else if (strength >= 75) {
    text = 'Forte';
    color = 'bg-info';
  } else if (strength >= 50) {
    text = 'Média';
    color = 'bg-warning';
  } else if (strength >= 25) {
    text = 'Fraca';
    color = 'bg-warning';
  }
  
  strengthBar.className = `progress-bar ${color}`;
  strengthBar.style.width = `${strength}%`;
  strengthText.textContent = text;
}

function setupAnimations() {
  const cadastroCard = document.querySelector('.cadastro-card');
  if (cadastroCard) {
    cadastroCard.style.opacity = '0';
    cadastroCard.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
      cadastroCard.style.transition = 'all 0.8s ease';
      cadastroCard.style.opacity = '1';
      cadastroCard.style.transform = 'translateY(0)';
    }, 200);
  }
}

function validateField(field) {
  const value = field.value.trim();
  const fieldName = field.id.replace('cadastro-', '');
  let isValid = true;
  let errorMessage = '';
  
  clearFieldError(field);
  
  switch(fieldName) {
    case 'nome':
      if (value.length < 2) {
        isValid = false;
        errorMessage = 'Deve ter pelo menos 2 caracteres';
      }
      break;
      
    case 'email':
      if (!value) {
        isValid = false;
        errorMessage = 'Email é obrigatório';
      } else if (!isValidEmail(value)) {
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
      
    case 'senha':
      if (value.length < 6) {
        isValid = false;
        errorMessage = 'Senha deve ter pelo menos 6 caracteres';
      }
      break;
      
    case 'confirmar-senha':
      const senha = document.getElementById('cadastro-senha').value;
      if (value !== senha) {
        isValid = false;
        errorMessage = 'Senhas não coincidem';
      }
      break;
  }
  
  if (!isValid) {
    showFieldError(field, errorMessage);
  }
  
  return isValid;
}

function validatePasswordMatch() {
  const senha = document.getElementById('cadastro-senha').value;
  const confirmarSenha = document.getElementById('cadastro-confirmar-senha');
  
  if (confirmarSenha.value && confirmarSenha.value !== senha) {
    showFieldError(confirmarSenha, 'Senhas não coincidem');
    return false;
  } else {
    clearFieldError(confirmarSenha);
    return true;
  }
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

function submitForm() {
  const form = document.getElementById('cadastro-form');
  const inputs = form.querySelectorAll('input[required]');
  let isFormValid = true;
  
  // Validate all required fields
  inputs.forEach(input => {
    if (!validateField(input)) {
      isFormValid = false;
    }
  });
  
  // Check password match
  if (!validatePasswordMatch()) {
    isFormValid = false;
  }
  
  if (!isFormValid) {
    showNotification('Por favor, corrija os erros no formulário', 'error');
    return;
  }
  
  const userData = {
    nome: document.getElementById('cadastro-nome').value,
    email: document.getElementById('cadastro-email').value,
    telefone: document.getElementById('cadastro-telefone').value,
    senha: document.getElementById('cadastro-senha').value,
    dataCadastro: new Date().toISOString()
  };
  
  // Show loading state
  const submitButton = document.querySelector('.btn-primary');
  const originalText = submitButton.innerHTML;
  submitButton.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Criando conta...';
  submitButton.disabled = true;
  
  // Simulate API call
  setTimeout(() => {
    // Save user data
    localStorage.setItem('appUser', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
    
    // Show success message
    showNotification('Conta criada com sucesso!', 'success');
    
    // Add success animation
    const cadastroCard = document.querySelector('.cadastro-card');
    if (cadastroCard) {
      cadastroCard.style.transform = 'scale(1.05)';
      setTimeout(() => {
        cadastroCard.style.transform = 'scale(1)';
      }, 200);
    }
    
    // Redirect to home page
    setTimeout(() => {
      window.location.href = 'paginaInicial.html';
    }, 2000);
    
  }, 2000);
}

// Toggle password visibility
function togglePasswordVisibility(inputId) {
  const input = document.getElementById(inputId);
  const icon = input.parentNode.querySelector('i');
  
  if (input.type === 'password') {
    input.type = 'text';
    icon.className = 'bi bi-eye-slash';
  } else {
    input.type = 'password';
    icon.className = 'bi bi-eye';
  }
}

// Add password visibility toggles
document.addEventListener('DOMContentLoaded', function() {
  const passwordInputs = ['cadastro-senha', 'cadastro-confirmar-senha'];
  
  passwordInputs.forEach(inputId => {
    const input = document.getElementById(inputId);
    if (input) {
      const toggleButton = document.createElement('button');
      toggleButton.type = 'button';
      toggleButton.className = 'btn btn-outline-secondary';
      toggleButton.innerHTML = '<i class="bi bi-eye"></i>';
      toggleButton.onclick = () => togglePasswordVisibility(inputId);
      
      // Wrap input in input group
      const inputGroup = document.createElement('div');
      inputGroup.className = 'input-group';
      
      input.parentNode.insertBefore(inputGroup, input);
      inputGroup.appendChild(input);
      inputGroup.appendChild(toggleButton);
    }
  });
});

// Check if email already exists (placeholder)
function checkEmailExists(email) {
  // This would normally check against a database
  const existingUser = localStorage.getItem('appUser');
  if (existingUser) {
    const userData = JSON.parse(existingUser);
    return userData.email === email;
  }
  return false;
}

// Add email availability check
document.addEventListener('DOMContentLoaded', function() {
  const emailInput = document.getElementById('cadastro-email');
  if (emailInput) {
    let checkTimeout;
    
    emailInput.addEventListener('input', function() {
      clearTimeout(checkTimeout);
      const email = this.value.trim();
      
      if (isValidEmail(email)) {
        checkTimeout = setTimeout(() => {
          if (checkEmailExists(email)) {
            showFieldError(this, 'Este email já está em uso');
          }
        }, 1000);
      }
    });
  }
});



// Script para cadastro com Supabase
document.getElementById('signup-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const nome = document.getElementById('signup-nome').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const senha = document.getElementById('signup-senha').value;
  const confirmarSenha = document.getElementById('signup-confirmar-senha').value;
  
  // Validate passwords match
  if (senha !== confirmarSenha) {
    showNotification('As senhas não coincidem!', 'error');
    return;
  }
  
  // Validate password length
  if (senha.length < 6) {
    showNotification('A senha deve ter pelo menos 6 caracteres!', 'error');
    return;
  }
  
  // Validate required fields
  if (!nome || !email || !senha) {
    showNotification('Por favor, preencha todos os campos obrigatórios!', 'error');
    return;
  }
  
  try {
    showLoading();
    
    // Inicializar Supabase se necessário
    if (!window.SupabaseAPI) {
      showNotification('Erro: Sistema não inicializado', 'error');
      return;
    }
    
    SupabaseAPI.init();
    
    // Verificar se email já existe
    const { data: existingUser } = await SupabaseAPI.usuarios.getByEmail(email);
    if (existingUser) {
      showNotification('Este email já está em uso!', 'error');
      return;
    }
    
    // Criar novo usuário
    const userData = {
      nomeUsu: nome,
      emailUsu: email,
      senhaUsu: senha, // Em produção, deve ser hash
      telefoneUsu: null,
      imgmUsu: null
    };
    
    const { data: newUser, error } = await SupabaseAPI.usuarios.create(userData);
    
    if (error) {
      showNotification('Erro ao criar conta: ' + error, 'error');
      return;
    }
    
    if (!newUser || !newUser[0]) {
      showNotification('Erro ao criar conta. Tente novamente.', 'error');
      return;
    }
    
    // Salvar dados do usuário
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', JSON.stringify(newUser[0]));
    localStorage.setItem('appUser', JSON.stringify(newUser[0])); // Para compatibilidade
    
    showNotification('Conta criada com sucesso!', 'success');
    
    // Redirect to home page
    setTimeout(() => {
      window.location.href = 'paginaInicial.html';
    }, 2000);
    
  } catch (err) {
    console.error('Erro no cadastro:', err);
    showNotification('Erro na conexão. Tente novamente.', 'error');
  } finally {
    hideLoading();
  }
});


