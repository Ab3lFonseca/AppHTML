document.getElementById('login-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const email = document.getElementById('login-email').value.trim();
  const senha = document.getElementById('login-senha').value;
  
  if (!email || !senha) {
    showNotification('Por favor, preencha todos os campos!', 'error');
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
    
    // Autenticar usuário
    const { data: usuario, error } = await SupabaseAPI.usuarios.authenticate(email, senha);
    
    if (error) {
      showNotification('Erro no login: ' + error, 'error');
      return;
    }
    
    if (!usuario) {
      showNotification('Email ou senha incorretos!', 'error');
      return;
    }
    
    // Salvar dados do usuário logado
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', JSON.stringify(usuario));
    localStorage.setItem('appUser', JSON.stringify(usuario)); // Para compatibilidade
    
    showNotification('Login realizado com sucesso!', 'success');
    
    // Redirect to home page
    setTimeout(() => {
      window.location.href = '/Front-End/pages/paginaInicial.html';
    }, 1500);
    
  } catch (err) {
    console.error('Erro no login:', err);
    showNotification('Erro na conexão. Tente novamente.', 'error');
  } finally {
    hideLoading();
  }
});

// A função navigateTo e showNotification já existem em global.js