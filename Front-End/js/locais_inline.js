
document.addEventListener(\'DOMContentLoaded\', function() {
    loadLocations();
    setupSearch();
});

function loadLocations() {
    // This would normally come from an API
    // For now, we\'ll leave it empty as requested (no fake data)
    const locaisGrid = document.getElementById(\'locais-grid\');
    locaisGrid.innerHTML = `
        <div class="col-12 text-center">
            <div class="empty-state">
                <i class="bi bi-geo-alt" style="font-size: 3rem; color: #6c757d;"></i>
                <h4 class="mt-3">Nenhum local encontrado</h4>
                <p class="text-muted">Os locais serão carregados quando conectado à API.</p>
            </div>
        </div>
    `;
}


