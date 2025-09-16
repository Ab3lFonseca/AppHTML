// Global JavaScript - Shared across all pages

// Navigation functions
function navigateTo(page) {
  window.location.href = page;
}

function logout() {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('appUser');
  window.location.href = '../../index.html';
}

// Authentication check
function checkAuth() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const currentPage = window.location.pathname;
  
  // If not logged in and not on login/signup pages, redirect to login
  if (!isLoggedIn && !currentPage.includes('index.html') && !currentPage.includes('cadastro.html')) {
    window.location.href = '../../index.html';
  }
}

// Update active navigation button
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
    max-width: 400px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    border-radius: 0.5rem;
    animation: slideInRight 0.3s ease;
  `;
  
  notification.innerHTML = `
    <div class="d-flex align-items-center">
      <i class="bi bi-${getNotificationIcon(type)} me-2"></i>
      <span>${message}</span>
    </div>
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 5000);
}

function getNotificationIcon(type) {
  switch(type) {
    case 'success': return 'check-circle';
    case 'error': return 'exclamation-triangle';
    case 'warning': return 'exclamation-triangle';
    case 'info': return 'info-circle';
    default: return 'info-circle';
  }
}

// Loading overlay functions
function showLoading() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    overlay.classList.add('show');
  }
}

function hideLoading() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    overlay.classList.remove('show');
  }
}

// Smooth scroll to element
function scrollToElement(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

// Format date
function formatDate(date) {
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
}

// Validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone
function isValidPhone(phone) {
  const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
  return phoneRegex.test(phone);
}

// Format phone number
function formatPhone(phone) {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
}

// Add CSS animation styles
const animationStyles = `
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .fade-in {
    animation: fadeIn 0.5s ease;
  }
`;

// Inject animation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

// Initialize global functionality
document.addEventListener('DOMContentLoaded', function() {
  // Check authentication on page load
  checkAuth();
  
  // Update active navigation button
  updateActiveNav();
  
  // Add fade-in animation to main content
  const mainContent = document.querySelector('.app-main');
  if (mainContent) {
    mainContent.classList.add('fade-in');
  }
  
  // Auto-hide loading overlay after 1 second if still showing
  setTimeout(() => {
    hideLoading();
  }, 1000);
});

