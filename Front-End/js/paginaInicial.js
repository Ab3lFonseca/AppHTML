// Página Inicial Specific JavaScript

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
  initializeWelcome();
  setupFeatureCards();
  initializeMap();
  loadUserData();
});

function initializeWelcome() {
  const welcomeSection = document.querySelector('.welcome-section');
  if (welcomeSection) {
    // Add entrance animation
    welcomeSection.style.opacity = '0';
    welcomeSection.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
      welcomeSection.style.transition = 'all 0.8s ease';
      welcomeSection.style.opacity = '1';
      welcomeSection.style.transform = 'translateY(0)';
    }, 200);
  }
}

function setupFeatureCards() {
  const featureCards = document.querySelectorAll('.feature-card');
  
  featureCards.forEach((card, index) => {
    // Add entrance animation with delay
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px)';
    
    setTimeout(() => {
      card.style.transition = 'all 0.6s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 400 + (index * 200));
    
    // Add click animation
    card.addEventListener('click', function() {
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = 'translateY(-10px)';
      }, 100);
    });
    
    // Add hover sound effect (visual feedback)
    card.addEventListener('mouseenter', function() {
      const icon = this.querySelector('.feature-icon');
      if (icon) {
        icon.style.transform = 'scale(1.1) rotate(5deg)';
      }
    });
    
    card.addEventListener('mouseleave', function() {
      const icon = this.querySelector('.feature-icon');
      if (icon) {
        icon.style.transform = 'scale(1) rotate(0deg)';
      }
    });
  });
}

function initializeMap() {
  const mapContainer = document.querySelector('.map-container');
  if (mapContainer) {
    // Add entrance animation
    mapContainer.style.opacity = '0';
    mapContainer.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
      mapContainer.style.transition = 'all 0.8s ease';
      mapContainer.style.opacity = '1';
      mapContainer.style.transform = 'translateY(0)';
    }, 800);
    
    // Add hover effects
    mapContainer.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.02)';
    });
    
    mapContainer.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
    
    // Add click handler for fullscreen
    const mapIframe = mapContainer.querySelector('iframe');
    if (mapIframe) {
      mapIframe.addEventListener('click', function() {
        showNotification('Clique duas vezes para tela cheia', 'info');
      });
      
      mapIframe.addEventListener('dblclick', function() {
        if (this.requestFullscreen) {
          this.requestFullscreen();
        }
      });
    }
  }
}

function loadUserData() {
  const userData = JSON.parse(localStorage.getItem('appUser') || '{}');
  
  // Update welcome message with user name
  const welcomeTitle = document.querySelector('.welcome-section h1');
  if (welcomeTitle && userData.nome) {
    welcomeTitle.textContent = `Bem-vindo, ${userData.nome}!`;
  }
  
  // Add personalized greeting based on time
  const welcomeSubtitle = document.querySelector('.welcome-section .lead');
  if (welcomeSubtitle) {
    const hour = new Date().getHours();
    let greeting = 'Explore locais incríveis ao seu redor';
    
    if (hour < 12) {
      greeting = 'Bom dia! ' + greeting;
    } else if (hour < 18) {
      greeting = 'Boa tarde! ' + greeting;
    } else {
      greeting = 'Boa noite! ' + greeting;
    }
    
    welcomeSubtitle.textContent = greeting;
  }
}

// Quick actions for feature cards
function quickActionLocais() {
  showLoading();
  setTimeout(() => {
    navigateTo('locais.html');
  }, 500);
}

function quickActionRanking() {
  showLoading();
  setTimeout(() => {
    navigateTo('ranking.html');
  }, 500);
}

// Add weather widget (placeholder for future enhancement)
function addWeatherWidget() {
  const mapSection = document.querySelector('.map-section');
  if (mapSection) {
    const weatherWidget = document.createElement('div');
    weatherWidget.className = 'weather-widget';
    weatherWidget.innerHTML = `
      <div class="d-flex align-items-center justify-content-between p-3 bg-light rounded mb-3">
        <div class="d-flex align-items-center">
          <i class="bi bi-sun text-warning me-2" style="font-size: 1.5rem;"></i>
          <div>
            <small class="text-muted">Clima em São Paulo</small>
            <div class="fw-bold">25°C - Ensolarado</div>
          </div>
        </div>
        <small class="text-muted">Atualizado agora</small>
      </div>
    `;
    
    mapSection.insertBefore(weatherWidget, mapSection.firstChild);
  }
}

// Add quick stats (placeholder for future enhancement)
function addQuickStats() {
  const container = document.querySelector('.container');
  if (container) {
    const statsSection = document.createElement('div');
    statsSection.className = 'quick-stats row g-3 mb-4';
    statsSection.innerHTML = `
      <div class="col-md-3 col-6">
        <div class="stat-card text-center p-3 bg-white rounded shadow-sm">
          <i class="bi bi-geo-alt text-primary mb-2" style="font-size: 2rem;"></i>
          <div class="fw-bold">--</div>
          <small class="text-muted">Locais Próximos</small>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="stat-card text-center p-3 bg-white rounded shadow-sm">
          <i class="bi bi-star text-warning mb-2" style="font-size: 2rem;"></i>
          <div class="fw-bold">--</div>
          <small class="text-muted">Avaliações</small>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="stat-card text-center p-3 bg-white rounded shadow-sm">
          <i class="bi bi-people text-success mb-2" style="font-size: 2rem;"></i>
          <div class="fw-bold">--</div>
          <small class="text-muted">Usuários Ativos</small>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="stat-card text-center p-3 bg-white rounded shadow-sm">
          <i class="bi bi-trophy text-info mb-2" style="font-size: 2rem;"></i>
          <div class="fw-bold">--</div>
          <small class="text-muted">Top Locais</small>
        </div>
      </div>
    `;
    
    const welcomeSection = document.querySelector('.welcome-section');
    if (welcomeSection) {
      welcomeSection.parentNode.insertBefore(statsSection, welcomeSection.nextSibling);
    }
  }
}

// Add floating action button
function addFloatingActionButton() {
  const fab = document.createElement('div');
  fab.className = 'floating-action-btn';
  fab.innerHTML = `
    <button class="btn btn-primary rounded-circle shadow-lg" style="width: 60px; height: 60px; position: fixed; bottom: 30px; right: 30px; z-index: 1000;">
      <i class="bi bi-plus" style="font-size: 1.5rem;"></i>
    </button>
  `;
  
  fab.addEventListener('click', function() {
    showNotification('Funcionalidade em desenvolvimento!', 'info');
  });
  
  document.body.appendChild(fab);
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
  // Uncomment these for additional features
  // addWeatherWidget();
  // addQuickStats();
  // addFloatingActionButton();
});

