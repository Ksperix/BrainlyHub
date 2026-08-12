/* ==========================================
   BRAINLYHUB - GOOGLE SHEETS DB INTEGRATION
   ========================================== */

// Wklej tutaj swój opublikowany URL Google Sheets jako CSV/JSON lub ID arkusza
const GOOGLE_SHEET_CSV_URL = ''; 

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('main-search-input');
  const executeBtn = document.getElementById('btn-execute-search');

  if (executeBtn) {
    executeBtn.addEventListener('click', () => fetchAndSearchTasks());
  }
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') fetchAndSearchTasks();
    });
  }
});

async function fetchAndSearchTasks() {
  const searchInput = document.getElementById('main-search-input');
  const resultsContainer = document.getElementById('bundles-results-grid');
  if (!searchInput || !resultsContainer) return;

  const query = searchInput.value.trim().toLowerCase();

  if (!query) {
    resultsContainer.innerHTML = '<div class="no-results-card">Please enter a search query.</div>';
    return;
  }

  // Ciche czyszczenie bez komunikatów o pobieraniu z arkusza
  try {
    if (!GOOGLE_SHEET_CSV_URL) {
      // Domyślna symulacja wyników, gdy URL nie jest jeszcze podłączony
      setTimeout(() => {
        resultsContainer.innerHTML = `
          <div class="bundle-card">
            <div class="bundle-card-header">
              <span class="bundle-badge market-badge">PL</span>
              <span class="bundle-badge difficulty-badge">High School</span>
            </div>
            <span class="bundle-title">Result for: ${query}</span>
            <div class="bundle-details">
              <span>Source: Google Sheets Database</span>
            </div>
          </div>
        `;
      }, 300);
      return;
    }

    const response = await fetch(GOOGLE_SHEET_CSV_URL);
    const data = await response.text();
    const rows = parseCSV(data);

    // Filtrowanie zadań po słowie kluczowym
    const filteredRows = rows.filter(row => 
      Object.values(row).some(val => String(val).toLowerCase().includes(query))
    );

    renderSheetResults(filteredRows, resultsContainer);
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    resultsContainer.innerHTML = '<div class="no-results-card">No items matched your query.</div>';
  }
}

function parseCSV(text) {
  const lines = text.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return headers.reduce((obj, header, index) => {
      obj[header] = values[index] ? values[index].trim() : '';
      return obj;
    }, {});
  });
}

function renderSheetResults(items, container) {
  if (items.length === 0) {
    container.innerHTML = '<div class="no-results-card">No matching tasks found.</div>';
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="bundle-card">
      <div class="bundle-card-header">
        <span class="bundle-badge market-badge">${item.Market || 'PL'}</span>
        <span class="bundle-badge difficulty-badge">${item.Level || 'General'}</span>
      </div>
      <span class="bundle-title">${item.Title || item.Question || 'Task Item'}</span>
      <div class="bundle-details">
        <span>${item.Subject ? 'Subject: ' + item.Subject : ''}</span>
        <span>${item.Answer ? 'Solution Available' : ''}</span>
      </div>
    </div>
  `).join('');
}
