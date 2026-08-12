/* ==========================================
   BRAINLYHUB - CORE APP INITIALIZER
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initThemeAndAccent();
  initThemeControls();
  initCompactMode();
  initSettingsEvents();
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
    // Brak wsparcia dla AudioContext
  }
}

/* ==========================================
   THEME & ACCENT MANAGEMENT
   ========================================== */
function initThemeAndAccent() {
  const savedTheme = localStorage.getItem('app_theme') || 'light';
  const savedAccent = localStorage.getItem('app_accent_color') || '#1e3a8a';

  applyTheme(savedTheme, false);
  applyAccentColor(savedAccent, false);
}

function applyTheme(theme, notify = true) {
  if (theme === 'dark') {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }
  localStorage.setItem('app_theme', theme);

  document.querySelectorAll('.theme-option-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === theme);
  });

  if (notify) {
    playChimeSound();
    addAppNotification(
      'Theme Changed',
      `Interface switched to ${theme} mode.`,
      'Settings.png'
    );
  }
}

function applyAccentColor(color, notify = true) {
  document.documentElement.style.setProperty('--primary', color);
  document.documentElement.style.setProperty('--primary-hover', color);
  localStorage.setItem('app_accent_color', color);

  document.querySelectorAll('.accent-circle').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.color === color);
  });

  if (notify) {
    playChimeSound();
    addAppNotification(
      'Accent Color Updated',
      `Primary color accent set to ${color}.`,
      'Settings.png'
    );
  }
}

function initThemeControls() {
  document.querySelectorAll('.theme-option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      applyTheme(btn.dataset.theme, true);
    });
  });

  document.querySelectorAll('.accent-circle').forEach(btn => {
    btn.addEventListener('click', () => {
      applyAccentColor(btn.dataset.color, true);
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
      const isCompact = e.target.checked;
      playChimeSound();
      document.body.classList.toggle('compact-mode', isCompact);
      localStorage.setItem('app_compact_mode', isCompact ? 'true' : 'false');
      
      addAppNotification(
        'Layout Mode Updated',
        `Compact view was ${isCompact ? 'enabled' : 'disabled'}.`,
        'Settings.png'
      );
    });
  }
}

/* ==========================================
   FUNKCJA ZAPISUJĄCA POWIADOMIENIA
   ========================================== */
function addAppNotification(title, desc, icon) {
  const notifs = JSON.parse(localStorage.getItem('app_notifications') || '[]');
  
  const newNotif = {
    id: Date.now(),
    title: title,
    desc: desc,
    icon: icon || 'Notifications.png',
    unread: true,
    time: 'Just now'
  };

  notifs.unshift(newNotif);
  localStorage.setItem('app_notifications', JSON.stringify(notifs));

  // Aktualizacja listy w menu nagłówka
  if (typeof renderNotificationsList === 'function') {
    renderNotificationsList();
  }
}

/* ==========================================
   EVENT HANDLERS FOR SETTINGS FORM
   ========================================== */
function initSettingsEvents() {
  // Przełącznik efektów dźwiękowych
  const soundToggle = document.getElementById('toggle-notif-sound');
  if (soundToggle) {
    soundToggle.checked = localStorage.getItem('app_sound_effects') !== 'false';
    soundToggle.addEventListener('change', (e) => {
      localStorage.setItem('app_sound_effects', e.target.checked ? 'true' : 'false');
      if (e.target.checked) playChimeSound();
    });
  }

  // Zapis Profilu
  const btnSaveProfile = document.getElementById('btn-save-profile');
  if (btnSaveProfile) {
    btnSaveProfile.addEventListener('click', () => {
      const nameInput = document.getElementById('input-user-name');
      const val = nameInput ? nameInput.value.trim() : 'User';
      
      playChimeSound();
      addAppNotification(
        'Profile Saved',
        `Display name updated to: ${val}`,
        'User profile.png'
      );
    });
  }

  // Dedykowany kreator powiadomień
  const btnCreateNotif = document.getElementById('btn-create-notif');
  if (btnCreateNotif) {
    btnCreateNotif.addEventListener('click', () => {
      const titleInput = document.getElementById('custom-notif-title');
      const descInput = document.getElementById('custom-notif-desc');
      const iconInput = document.getElementById('custom-notif-icon');

      const title = titleInput ? titleInput.value.trim() : '';
      const desc = descInput ? descInput.value.trim() : '';
      const icon = iconInput ? iconInput.value : 'Notifications.png';

      playChimeSound();
      addAppNotification(
        title || 'Custom Notification',
        desc || 'Test notification generated from settings.',
        icon
      );

      if (titleInput) titleInput.value = '';
      if (descInput) descInput.value = '';
    });
  }

  // Czyszczenie Cache
  const btnClearCache = document.getElementById('btn-clear-cache');
  if (btnClearCache) {
    btnClearCache.addEventListener('click', () => {
      playChimeSound();
      localStorage.removeItem('app_notifications');
      if (typeof renderNotificationsList === 'function') {
        renderNotificationsList();
      }
      alert('Local cache and notification history cleared!');
    });
  }

  // Reset Ustawień
  const btnResetAll = document.getElementById('btn-reset-all');
  if (btnResetAll) {
    btnResetAll.addEventListener('click', () => {
      playChimeSound();
      localStorage.clear();
      location.reload();
    });
  }
}
