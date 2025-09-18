// Locais Page Specific JavaScript

let currentMapUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58509.294!2d-46.6333824!3d-23.5505199!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sS%C3%A3o%20Paulo%2C%20SP!5e0!3m2!1spt-BR!2sbr!4v1234567890';
let currentLocationId = null; // Para edição e exclusão

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar Supabase
  SupabaseAPI.init();
  
  loadLocations();
  setupSearch();
  initializeMap();
});

async function loadLocations() {
  try {
    showLoading();
    const { data: locais, error } = await SupabaseAPI.locais.getAll();
    
    if (error) {
      console.error('Erro ao carregar locais:', error);
      showNotification('Erro ao carregar locais: ' + error, 'error');
      showEmptyState();
      return;
    }
    
    if (!locais || locais.length === 0) {
      showEmptyState();
      return;
    }
    
    renderLocations(locais);
    
  } catch (err) {
    console.error('Erro na conexão:', err);
    showNotification('Erro na conexão com o banco de dados', 'error');
    showEmptyState();
  } finally {
    hideLoading();
  }
}

function renderLocations(locais) {
  const locaisGrid = document.getElementById('locais-grid');
  
  if (!locais || locais.length === 0) {
    showEmptyState();
    return;
  }
  
  locaisGrid.innerHTML = locais.map(local => `
    <div class="col-md-6 col-lg-4">
      <div class="card location-card" onclick="showLocationOnMap('${local.endLocal}', '${local.nomeLocal}')">
        <div class="card-body">
          <h5 class="card-title">
            <i class="bi bi-geo-alt text-primary"></i>
            ${local.nomeLocal}
          </h5>
          <p class="card-text">${local.descricaoLocal}</p>
          <p class="card-text">
            <small class="text-muted">
              <i class="bi bi-pin-map"></i>
              ${local.endLocal}
            </small>
          </p>
          <div class="d-flex gap-2 mt-3">
            <button class="btn btn-sm btn-outline-primary" onclick="event.stopPropagation(); editLocation(${local.idLocal})">
              <i class="bi bi-pencil"></i> Editar
            </button>
            <button class="btn btn-sm btn-outline-danger" onclick="event.stopPropagation(); deleteLocation(${local.idLocal})">
              <i class="bi bi-trash"></i> Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function showEmptyState() {
  const locaisGrid = document.getElementById('locais-grid');
  locaisGrid.innerHTML = `
    <div class="col-12 text-center">
      <div class="empty-state">
        <i class="bi bi-geo-alt" style="font-size: 3rem; color: #6c757d;"></i>
        <h4 class="mt-3">Nenhum local encontrado</h4>
        <p class="text-muted">Adicione o primeiro local para começar!</p>
        <button class="btn btn-primary mt-2" onclick="showAddLocationModal()">
          <i class="bi bi-plus-circle"></i> Adicionar Local
        </button>
      </div>
    </div>
  `;
}

// Modal functions
function showAddLocationModal() {
  document.getElementById('locationModalLabel').textContent = 'Adicionar Local';
  document.getElementById('locationForm').reset();
  document.getElementById('locationId').value = '';
  currentLocationId = null;
  
  const modal = new bootstrap.Modal(document.getElementById('locationModal'));
  modal.show();
}

async function editLocation(id) {
  try {
    showLoading();
    const { data: local, error } = await SupabaseAPI.locais.getById(id);
    
    if (error) {
      showNotification('Erro ao carregar local: ' + error, 'error');
      return;
    }
    
    if (!local) {
      showNotification('Local não encontrado', 'error');
      return;
    }
    
    // Preencher o formulário
    document.getElementById('locationModalLabel').textContent = 'Editar Local';
    document.getElementById('locationId').value = local.idLocal;
    document.getElementById('locationName').value = local.nomeLocal;
    document.getElementById('locationDescription').value = local.descricaoLocal;
    document.getElementById('locationAddress').value = local.endLocal;
    
    currentLocationId = id;
    
    const modal = new bootstrap.Modal(document.getElementById('locationModal'));
    modal.show();
    
  } catch (err) {
    showNotification('Erro ao carregar local', 'error');
  } finally {
    hideLoading();
  }
}

async function saveLocation() {
  const form = document.getElementById('locationForm');
  
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  
  const localData = {
    nomeLocal: document.getElementById('locationName').value.trim(),
    descricaoLocal: document.getElementById('locationDescription').value.trim(),
    endLocal: document.getElementById('locationAddress').value.trim()
  };
  
  try {
    showLoading();
    
    let result;
    if (currentLocationId) {
      // Editar local existente
      result = await SupabaseAPI.locais.update(currentLocationId, localData);
    } else {
      // Criar novo local
      result = await SupabaseAPI.locais.create(localData);
    }
    
    if (result.error) {
      showNotification('Erro ao salvar local: ' + result.error, 'error');
      return;
    }
    
    showNotification(
      currentLocationId ? 'Local atualizado com sucesso!' : 'Local adicionado com sucesso!',
      'success'
    );
    
    // Fechar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('locationModal'));
    modal.hide();
    
    // Recarregar lista
    await loadLocations();
    
  } catch (err) {
    showNotification('Erro ao salvar local', 'error');
  } finally {
    hideLoading();
  }
}

function deleteLocation(id) {
  currentLocationId = id;
  const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
  modal.show();
}

async function confirmDeleteLocation() {
  if (!currentLocationId) return;
  
  try {
    showLoading();
    
    const { error } = await SupabaseAPI.locais.delete(currentLocationId);
    
    if (error) {
      showNotification('Erro ao excluir local: ' + error, 'error');
      return;
    }
    
    showNotification('Local excluído com sucesso!', 'success');
    
    // Fechar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
    modal.hide();
    
    // Recarregar lista
    await loadLocations();
    
  } catch (err) {
    showNotification('Erro ao excluir local', 'error');
  } finally {
    hideLoading();
    currentLocationId = null;
  }
}

// Search functionality
function setupSearch() {
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    let searchTimeout;
    
    searchInput.addEventListener('input', function(e) {
      const query = e.target.value.trim();
      
      clearTimeout(searchTimeout);
      
      searchTimeout = setTimeout(async () => {
        if (query.length >= 2) {
          await searchLocations(query);
        } else if (query.length === 0) {
          await loadLocations();
        }
      }, 500);
    });
  }
}

async function searchLocations(query) {
  try {
    showLoading();
    const { data: locais, error } = await SupabaseAPI.locais.searchByName(query);
    
    if (error) {
      showNotification('Erro na busca: ' + error, 'error');
      return;
    }
    
    if (!locais || locais.length === 0) {
      const locaisGrid = document.getElementById('locais-grid');
      locaisGrid.innerHTML = `
        <div class="col-12 text-center">
          <div class="empty-state">
            <i class="bi bi-search" style="font-size: 3rem; color: #6c757d;"></i>
            <h4 class="mt-3">Nenhum resultado encontrado</h4>
            <p class="text-muted">Tente buscar com outros termos</p>
          </div>
        </div>
      `;
      return;
    }
    
    renderLocations(locais);
    showNotification(`Encontrados ${locais.length} resultado(s)`, 'info');
    
  } catch (err) {
    showNotification('Erro na busca', 'error');
  } finally {
    hideLoading();
  }
}

// Map functionality
function showLocationOnMap(endereco, nome) {
  if (!endereco) return;
  
  // Atualizar mapa com o endereço
  updateMapLocation(endereco);
  
  // Scroll para o mapa
  const mapSection = document.querySelector('.map-section');
  if (mapSection) {
    mapSection.scrollIntoView({ behavior: 'smooth' });
  }
  
  showNotification(`Mostrando "${nome}" no mapa`, 'info');
}

function updateMapLocation(location) {
  const mapIframe = document.querySelector('.map-container iframe');
  if (mapIframe) {
    // Encode the location for URL
    const encodedLocation = encodeURIComponent(location);
    
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

