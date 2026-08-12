/* ==========================================
   BRAINLYHUB - CORE APP INITIALIZER
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initThemeAndAccent();
  initThemeControls();
  initCompactMode();
  initAudioAndNotificationEvents();
});

/* ==========================================
   AUDIO SYNTHESIZER (INTERACTIVE UI CHIME)
   ========================================== */
function playChimeSound() {
  const soundEnabled = localStorage.getItem('app_sound_effects') !== 'false';
  if (!soundEnabled) return;

  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // Nutka D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1); // Nutka A5

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch (e) {
    // Brak wsparcia dla audio kontekstu
  }
}

/* ==========================================
   THEME & ACCENT MANAGEMENT
   ========================================== */
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

  document.querySelectorAll('.accent-circle').forEach(btn => {
    if (btn.dataset.color === color) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function initThemeControls() {
  document.querySelectorAll('.theme-option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      applyTheme(btn.dataset.theme);
      playChimeSound();
    });
  });

  document.querySelectorAll('.accent-circle').forEach(btn => {
    btn.addEventListener('click', () => {
      applyAccentColor(btn.dataset.color);
      playChimeSound();
    });
  });
}

function initCompactMode() {
  const compactToggle = document.getElementById('toggle-compact-ui');
  const savedCompactState = localStorage.getItem('app_compact_mode') === 'true';

  if (savedCompactState) {
    document.body.classList.add('compact-mode');
    if (compactToggle) compactToggle.checked = true;
  }

  if (compactToggle) {
    compactToggle.addEventListener('change', (e) => {
      playChimeSound();
      if (e.target.checked) {
        document.body.classList.add('compact-mode');
        localStorage.setItem('app_compact_mode', 'true');
      } else {
        document.body.classList.remove('compact-mode');
        localStorage.setItem('app_compact_mode', 'false');
      }
    });
  }
}

/* ==========================================
   EVENT HANDLERS & NOTIFICATION INTEGRATION
   ========================================== */
function initAudioAndNotificationEvents() {
  // Przełącznik efektów dźwiękowych
  const soundToggle = document.getElementById('toggle-notif-sound');
  if (soundToggle) {
    soundToggle.checked = localStorage.getItem('app_sound_effects') !== 'false';
    soundToggle.addEventListener('change', (e) => {
      localStorage.setItem('app_sound_effects', e.target.checked ? 'true' : 'false');
      if (e.target.checked) playChimeSound();
    });
  }

  // Zapis Profilu z automatycznym powiadomieniem
  const btnSaveProfile = document.getElementById('btn-save-profile');
  if (btnSaveProfile) {
    btnSaveProfile.addEventListener('click', () => {
      const nameInput = document.getElementById('input-user-name');
      const nameVal = nameInput ? nameInput.value.trim() : '';
      
      playChimeSound();
      
      if (window.pushCustomNotification) {
        window.pushCustomNotification(
          'Profile Updated',
          nameVal ? `Display name changed to ${nameVal}` : 'User preferences were successfully saved.',
          'User profile.png'
        );
      }
    });
  }

  // Dedykowany moduł kustomizacji powiadomień
  const btnCreateNotif = document.getElementById('btn-create-notif');
  if (btnCreateNotif) {
    btnCreateNotif.addEventListener('click', () => {
      const title = document.getElementById('custom-notif-title').value.trim();
      const desc = document.getElementById('custom-notif-desc').value.trim();
      const icon = document.getElementById('custom-notif-icon').value;

      playChimeSound();

      if (window.pushCustomNotification) {
        window.pushCustomNotification(
          title || 'Custom Notification',
          desc || 'This is a test notification generated from settings.',
          icon
        );
      }

      // Czyszczenie pól tekstowych
      document.getElementById('custom-notif-title').value = '';
      document.getElementById('custom-notif-desc').value = '';
    });
  }

  // Czyszczenie Cache oraz Zmian
  const btnClearCache = document.getElementById('btn-clear-cache');
  if (btnClearCache) {
    btnClearCache.addEventListener('click', () => {
      playChimeSound();
      if (window.clearAllNotifications) window.clearAllNotifications();
      alert('Local cache and notification history cleared!');
    });
  }

  const btnResetAll = document.getElementById('btn-reset-all');
  if (btnResetAll) {
    btnResetAll.addEventListener('click', () => {
      playChimeSound();
      localStorage.clear();
      location.reload();
    });
  }
}
