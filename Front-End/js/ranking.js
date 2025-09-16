// Ranking Page Specific JavaScript

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
  loadRanking();
  setupAnimations();
});

function loadRanking() {
  // This would normally come from an API
  // For now, we'll leave it empty as requested (no fake data)
  const rankingList = document.getElementById('ranking-list');
  if (rankingList) {
    rankingList.innerHTML = `
      <div class="text-center p-4">
        <i class="bi bi-list-ol" style="font-size: 2rem; color: #6c757d;"></i>
        <p class="text-muted mt-2">Os rankings serão carregados quando conectado à API.</p>
        <button class="btn btn-outline-primary mt-2" onclick="simulateRankingLoad()">
          <i class="bi bi-arrow-clockwise me-2"></i>Tentar Novamente
        </button>
      </div>
    `;
  }
}

function setupAnimations() {
  // Add entrance animations to ranking sections
  const rankingSection = document.querySelector('.ranking-section');
  if (rankingSection) {
    rankingSection.style.opacity = '0';
    rankingSection.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
      rankingSection.style.transition = 'all 0.8s ease';
      rankingSection.style.opacity = '1';
      rankingSection.style.transform = 'translateY(0)';
    }, 200);
  }
  
  // Add hover effects to ranking items
  const rankingItems = document.querySelectorAll('.ranking-item');
  rankingItems.forEach((item, index) => {
    item.addEventListener('mouseenter', function() {
      this.style.transform = 'translateX(10px)';
      this.style.backgroundColor = '#f8f9fa';
    });
    
    item.addEventListener('mouseleave', function() {
      this.style.transform = 'translateX(0)';
      this.style.backgroundColor = '';
    });
  });
}

function simulateRankingLoad() {
  showLoading();
  showNotification('Tentando carregar rankings...', 'info');
  
  setTimeout(() => {
    hideLoading();
    showNotification('Nenhum dado disponível no momento', 'warning');
  }, 2000);
}

// Function to render ranking data (for future API integration)
function renderRankingData(data) {
  const podiumSection = document.getElementById('podium-section');
  const rankingList = document.getElementById('ranking-list');
  
  if (!data || data.length === 0) {
    loadRanking(); // Show empty state
    return;
  }
  
  // Render podium (top 3)
  if (podiumSection && data.length >= 3) {
    podiumSection.innerHTML = `
      <div class="row justify-content-center">
        <div class="col-4">
          <div class="podium-place second">
            <div class="podium-location">
              <i class="bi bi-${data[1].icon || 'building'}"></i>
              <h6>${data[1].name}</h6>
              <span class="rating">${data[1].rating} ⭐</span>
            </div>
            <div class="podium-number">2</div>
          </div>
        </div>
        <div class="col-4">
          <div class="podium-place first">
            <div class="podium-location">
              <i class="bi bi-${data[0].icon || 'trophy'}"></i>
              <h6>${data[0].name}</h6>
              <span class="rating">${data[0].rating} ⭐</span>
            </div>
            <div class="podium-number">1</div>
          </div>
        </div>
        <div class="col-4">
          <div class="podium-place third">
            <div class="podium-location">
              <i class="bi bi-${data[2].icon || 'star'}"></i>
              <h6>${data[2].name}</h6>
              <span class="rating">${data[2].rating} ⭐</span>
            </div>
            <div class="podium-number">3</div>
          </div>
        </div>
      </div>
    `;
  }
  
  // Render remaining items
  if (rankingList && data.length > 3) {
    const remainingItems = data.slice(3);
    rankingList.innerHTML = remainingItems.map((item, index) => `
      <div class="ranking-item" onclick="showLocationDetails('${item.id}')">
        <span class="position">${index + 4}</span>
        <div class="location-info">
          <i class="bi bi-${item.icon || 'geo-alt'}"></i>
          <span>${item.name}</span>
        </div>
        <span class="rating">${item.rating} ⭐</span>
      </div>
    `).join('');
    
    // Add entrance animations
    const items = rankingList.querySelectorAll('.ranking-item');
    items.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateX(-30px)';
      
      setTimeout(() => {
        item.style.transition = 'all 0.5s ease';
        item.style.opacity = '1';
        item.style.transform = 'translateX(0)';
      }, 100 * index);
    });
  }
}

function showLocationDetails(locationId) {
  showNotification(`Detalhes do local ${locationId} em desenvolvimento`, 'info');
}

// Add filter functionality
function addRankingFilters() {
  const rankingSection = document.querySelector('.ranking-section');
  if (rankingSection) {
    const filtersDiv = document.createElement('div');
    filtersDiv.className = 'ranking-filters mb-4';
    filtersDiv.innerHTML = `
      <div class="d-flex flex-wrap gap-2 justify-content-center">
        <button class="btn btn-outline-primary btn-sm active" onclick="filterRanking('all')">
          <i class="bi bi-list me-1"></i>Todos
        </button>
        <button class="btn btn-outline-primary btn-sm" onclick="filterRanking('restaurants')">
          <i class="bi bi-cup-hot me-1"></i>Restaurantes
        </button>
        <button class="btn btn-outline-primary btn-sm" onclick="filterRanking('parks')">
          <i class="bi bi-tree me-1"></i>Parques
        </button>
        <button class="btn btn-outline-primary btn-sm" onclick="filterRanking('shopping')">
          <i class="bi bi-shop me-1"></i>Shopping
        </button>
        <button class="btn btn-outline-primary btn-sm" onclick="filterRanking('culture')">
          <i class="bi bi-camera me-1"></i>Cultura
        </button>
      </div>
    `;
    
    rankingSection.insertBefore(filtersDiv, rankingSection.firstChild);
  }
}

function filterRanking(category) {
  // Update active filter button
  const filterButtons = document.querySelectorAll('.ranking-filters .btn');
  filterButtons.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
  showNotification(`Filtrando por: ${category}`, 'info');
  
  // Here you would filter the ranking data
  // For now, just show a message
  setTimeout(() => {
    showNotification('Filtros serão implementados com dados da API', 'warning');
  }, 1000);
}

// Add search functionality
function addRankingSearch() {
  const rankingSection = document.querySelector('.ranking-section');
  if (rankingSection) {
    const searchDiv = document.createElement('div');
    searchDiv.className = 'ranking-search mb-4';
    searchDiv.innerHTML = `
      <div class="input-group">
        <span class="input-group-text">
          <i class="bi bi-search"></i>
        </span>
        <input type="text" class="form-control" placeholder="Buscar no ranking..." id="ranking-search">
      </div>
    `;
    
    rankingSection.insertBefore(searchDiv, rankingSection.firstChild);
    
    // Add search functionality
    const searchInput = document.getElementById('ranking-search');
    if (searchInput) {
      searchInput.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase();
        if (query.length >= 2) {
          showNotification(`Buscando: ${query}`, 'info');
        }
      });
    }
  }
}

// Add refresh functionality
function refreshRanking() {
  showLoading();
  showNotification('Atualizando ranking...', 'info');
  
  setTimeout(() => {
    hideLoading();
    loadRanking();
    showNotification('Ranking atualizado!', 'success');
  }, 2000);
}

// Add export functionality
function exportRanking() {
  showNotification('Exportação em desenvolvimento', 'info');
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
  // Uncomment these for additional features
  // addRankingFilters();
  // addRankingSearch();
});

