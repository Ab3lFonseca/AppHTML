// Locais Page Specific JavaScript

let currentMapUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58509.294!2d-46.6333824!3d-23.5505199!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sS%C3%A3o%20Paulo%2C%20SP!5e0!3m2!1spt-BR!2sbr!4v1234567890';

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
  loadLocations();
  setupSearch();
  initializeMap();
});

function loadLocations() {
  // This would normally come from an API
  // For now, we'll leave it empty as requested (no fake data)
  const locaisGrid = document.getElementById('locais-grid');
  if (locaisGrid) {
    locaisGrid.innerHTML = `
      <div class="col-12 text-center">
        <div class="empty-state">
          <i class="bi bi-geo-alt"></i>
          <h4>Nenhum local encontrado</h4>
          <p>Os locais serão carregados quando conectado à API.</p>
        </div>
      </div>
    `;
  }
}

function setupSearch() {
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    // Add search icon animation
    const searchIcon = document.querySelector('.input-group-text i');
    
    searchInput.addEventListener('focus', function() {
      if (searchIcon) {
        searchIcon.style.transform = 'scale(1.2)';
        searchIcon.style.color = '#007bff';
      }
    });
    
    searchInput.addEventListener('blur', function() {
      if (searchIcon) {
        searchIcon.style.transform = 'scale(1)';
        searchIcon.style.color = '#ffffff';
      }
    });
    
    // Search functionality with debounce
    let searchTimeout;
    searchInput.addEventListener('input', function(e) {
      const query = e.target.value.trim();
      
      // Clear previous timeout
      clearTimeout(searchTimeout);
      
      // Add loading state
      searchInput.style.background = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'20\' height=\'20\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23007bff\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z\'/%3E%3C/svg%3E") no-repeat right 10px center';
      searchInput.style.backgroundSize = '20px';
      
      // Debounce search
      searchTimeout = setTimeout(() => {
        if (query.length >= 2) {
          searchLocation(query);
        } else if (query.length === 0) {
          resetMap();
        }
        
        // Remove loading state
        searchInput.style.background = '';
      }, 500);
    });
    
    // Handle Enter key
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        const query = e.target.value.trim();
        if (query.length >= 2) {
          searchLocation(query);
        }
      }
    });
  }
}

function searchLocation(query) {
  console.log('Searching for:', query);
  
  // Show loading state
  showMapLoading();
  
  // Update map with search query
  updateMapLocation(query);
  
  // Show notification
  showNotification(`Buscando por: ${query}`, 'info');
  
  // Simulate API call delay
  setTimeout(() => {
    hideMapLoading();
    showNotification(`Localização encontrada: ${query}`, 'success');
  }, 1000);
}

function updateMapLocation(location) {
  const mapIframe = document.querySelector('.map-container iframe');
  if (mapIframe) {
    // Encode the location for URL
    const encodedLocation = encodeURIComponent(location);
    
    // Create new map URL with search query
    const newMapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dQWTzus-6POk50&q=${encodedLocation}&zoom=15&maptype=roadmap&language=pt-BR&region=BR`;
    
    // Fallback to search URL if place API doesn't work
    const fallbackUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1975!2d-46.6333824!3d-23.5505199!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${encodedLocation}!5e0!3m2!1spt-BR!2sbr!4v${Date.now()}`;
    
    // Use a simpler approach that works without API key
    const searchUrl = `https://maps.google.com/maps?q=${encodedLocation}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    
    // Update iframe src with animation
    mapIframe.style.opacity = '0.5';
    mapIframe.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
      mapIframe.src = searchUrl;
      currentMapUrl = searchUrl;
      
      mapIframe.onload = function() {
        mapIframe.style.opacity = '1';
        mapIframe.style.transform = 'scale(1)';
        mapIframe.style.transition = 'all 0.3s ease';
      };
    }, 200);
  }
}

function resetMap() {
  const mapIframe = document.querySelector('.map-container iframe');
  if (mapIframe) {
    const defaultUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58509.294!2d-46.6333824!3d-23.5505199!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sS%C3%A3o%20Paulo%2C%20SP!5e0!3m2!1spt-BR!2sbr!4v1234567890';
    
    mapIframe.style.opacity = '0.5';
    setTimeout(() => {
      mapIframe.src = defaultUrl;
      currentMapUrl = defaultUrl;
      
      mapIframe.onload = function() {
        mapIframe.style.opacity = '1';
        mapIframe.style.transition = 'all 0.3s ease';
      };
    }, 200);
  }
}

function initializeMap() {
  const mapContainer = document.querySelector('.map-container');
  if (mapContainer) {
    // Add hover effects
    mapContainer.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.01)';
    });
    
    mapContainer.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
  }
}

function showMapLoading() {
  const mapContainer = document.querySelector('.map-container');
  if (mapContainer) {
    let loadingDiv = mapContainer.querySelector('.map-loading');
    if (!loadingDiv) {
      loadingDiv = document.createElement('div');
      loadingDiv.className = 'map-loading';
      loadingDiv.innerHTML = `
        <div class="d-flex align-items-center">
          <div class="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
          <span>Carregando localização...</span>
        </div>
      `;
      mapContainer.appendChild(loadingDiv);
    }
    loadingDiv.classList.add('show');
  }
}

function hideMapLoading() {
  const loadingDiv = document.querySelector('.map-loading');
  if (loadingDiv) {
    loadingDiv.classList.remove('show');
  }
}

// Search suggestions (for future enhancement)
function getSearchSuggestions(query) {
  // This would normally call a geocoding API
  const suggestions = [
    'São Paulo, SP',
    'Rio de Janeiro, RJ',
    'Belo Horizonte, MG',
    'Salvador, BA',
    'Brasília, DF',
    'Fortaleza, CE',
    'Manaus, AM',
    'Curitiba, PR',
    'Recife, PE',
    'Porto Alegre, RS'
  ];
  
  return suggestions.filter(suggestion => 
    suggestion.toLowerCase().includes(query.toLowerCase())
  );
}

// Add map interaction enhancements
function enhanceMapInteraction() {
  const mapIframe = document.querySelector('.map-container iframe');
  if (mapIframe) {
    // Add click handler for fullscreen
    mapIframe.addEventListener('click', function() {
      if (this.requestFullscreen) {
        this.requestFullscreen();
      }
    });
  }
}

// Initialize enhancements
document.addEventListener('DOMContentLoaded', function() {
  enhanceMapInteraction();
});

