/* ==========================================
   BRAINLYHUB - FAVORITES MODULE
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initFavoritesModule();
});

function initFavoritesModule() {
  const btnFavorites = document.getElementById('btn-favorites');

  if (btnFavorites) {
    btnFavorites.addEventListener('click', (e) => {
      e.stopPropagation();
      openFavoritesModal();
    });
  }
}

function getFavorites() {
  return JSON.parse(localStorage.getItem('app_favorites') || '[]');
}

function toggleFavoriteItem(item) {
  let favorites = getFavorites();
  const index = favorites.findIndex(f => f.id === item.id);

  if (index >= 0) {
    favorites.splice(index, 1);
  } else {
    favorites.push(item);
  }

  localStorage.setItem('app_favorites', JSON.stringify(favorites));
}

function openFavoritesModal() {
  const favorites = getFavorites();
  
  // Tworzenie lub pobieranie kontenera na okno ulubionych
  let modal = document.getElementById('modal-favorites-panel');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-favorites-panel';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-card">
      <h2 class="redirect-title">Favorite Items (${favorites.length})</h2>
      <div style="max-height: 280px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; margin: 16px 0;">
        ${favorites.length === 0 
          ? '<div class="no-results-card">No saved favorites yet.</div>' 
          : favorites.map(f => `
            <div class="bundle-card" style="text-align: left;">
              <span class="bundle-title">${f.title}</span>
              <span class="bundle-details">${f.subject || ''}</span>
            </div>
          `).join('')
        }
      </div>
      <button class="btn-cancel" id="btn-close-favorites">Close</button>
    </div>
  `;

  modal.style.display = 'flex';

  document.getElementById('btn-close-favorites').addEventListener('click', () => {
    modal.style.display = 'none';
  });
}
