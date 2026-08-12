/* ==========================================
   BRAINLYHUB - CORE APP INITIALIZER
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initThemeAndAccent();
  initThemeControls();
});

function initThemeAndAccent() {
  const savedTheme = localStorage.getItem('app_theme') || 'light';
  const savedAccent = localStorage.getItem('app_accent_color') || '#1e3a8a';

  applyTheme(savedTheme);
  applyAccentColor(savedAccent);
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }
  localStorage.setItem('app_theme', theme);

  // Synchronizacja przycisków na stronie ustawień
  document.querySelectorAll('.theme-option-btn').forEach(btn => {
    if (btn.dataset.theme === theme) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function applyAccentColor(color) {
  document.documentElement.style.setProperty('--primary', color);
  document.documentElement.style.setProperty('--primary-hover', color);
  localStorage.setItem('app_accent_color', color);

  // Synchronizacja kółek akcentu na stronie ustawień
  document.querySelectorAll('.accent-circle').forEach(btn => {
    if (btn.dataset.color === color) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function initThemeControls() {
  // Przełączniki motywu na stronie ustawień
  document.querySelectorAll('.theme-option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      applyTheme(btn.dataset.theme);
    });
  });

  // Przełączniki koloru akcentu na stronie ustawień
  document.querySelectorAll('.accent-circle').forEach(btn => {
    btn.addEventListener('click', () => {
      applyAccentColor(btn.dataset.color);
    });
  });
}
