// Simple navigation functions for multi-page app
function navigateTo(page) {
  window.location.href = page;
}

function logout() {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('appUser');
  window.location.href = '../../index.html';
}

// Check if user is logged in on protected pages
function checkAuth() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const currentPage = window.location.pathname;
  
  // If not logged in and not on login/signup pages, redirect to login
  if (!isLoggedIn && !currentPage.includes('index.html') && !currentPage.includes('cadastro.html')) {
    window.location.href = '../../index.html';
  }
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
  // Check authentication on page load
  checkAuth();
  
  // Update active navigation button
  updateActiveNav();
});

function updateActiveNav() {
  const currentPage = window.location.pathname;
  const navBtns = document.querySelectorAll('.nav-btn');
  
  navBtns.forEach(btn => {
    btn.classList.remove('active');
    const onclick = btn.getAttribute('onclick');
    
    if (onclick) {
      if (currentPage.includes('paginaInicial.html') && onclick.includes('paginaInicial.html')) {
        btn.classList.add('active');
      } else if (currentPage.includes('locais.html') && onclick.includes('locais.html')) {
        btn.classList.add('active');
      } else if (currentPage.includes('ranking.html') && onclick.includes('ranking.html')) {
        btn.classList.add('active');
      } else if (currentPage.includes('perfil.html') && onclick.includes('perfil.html')) {
        btn.classList.add('active');
      }
    }
  });
}

// Utility function for notifications
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
  notification.style.cssText = `
    top: 20px;
    right: 20px;
    z-index: 10000;
    min-width: 300px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  `;
  
  notification.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 5000);
}

