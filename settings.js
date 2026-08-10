/* ==========================================
   BRAINLYHUB - SETTINGS CONTROLLER
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initProfileSettings();
  initThemeAndAppearance();
  initNotificationSettings();
  initToggles();
  initSoundSettings();
  initResetConfirmationModal();
  initAppInstallPrompt();
});

function playAudioChime(overrideTone) {
  const soundEnabled = localStorage.getItem('sound_enabled') !== 'false';
  if (!soundEnabled) return;

  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const selectedTone = overrideTone || localStorage.getItem('sound_tone') || 'chime';

    if (selectedTone === 'double') {
      const now = ctx.currentTime;
      [880, 1200].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.08, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.06);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.06);
      });
    } else if (selectedTone === 'pop') {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.08);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } else {
      const now = ctx.currentTime;
      [523.25, 659.25, 1046.50].forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
      });
    }
  } catch (e) {
    console.warn('Web Audio API unavailable:', e);
  }
}

function pushNotification(title, desc) {
  const notifList = document.getElementById('notif-list');
  const badge = document.getElementById('notif-badge');

  if (badge) badge.style.display = 'block';

  if (notifList) {
    const emptyState = notifList.querySelector('.notif-empty-state');
    if (emptyState) emptyState.remove();

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const card = document.createElement('div');
    card.className = 'notif-item unread';
    card.innerHTML = `
      <div class="notif-icon-box">
        <img src="assets/Settings.png" alt="Settings" />
      </div>
      <div class="notif-details">
        <span class="notif-title">${title}</span>
        <span class="notif-desc">${desc}</span>
        <span class="notif-time">${timeStr}</span>
      </div>
    `;
    notifList.prepend(card);
  }

  playAudioChime();
}

function initProfileSettings() {
  const nameInput = document.getElementById('input-user-name');
  const roleSelect = document.getElementById('select-user-role');
  const saveBtn = document.getElementById('btn-save-profile');

  if (nameInput) nameInput.value = localStorage.getItem('user_name') || 'Student Account';
  if (roleSelect) roleSelect.value = localStorage.getItem('user_role') || 'High School Member';

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const newName = nameInput.value.trim() || 'Student Account';
      const newRole = roleSelect.value;

      localStorage.setItem('user_name', newName);
      localStorage.setItem('user_role', newRole);

      const nameElement = document.getElementById('header-user-name');
      const roleElement = document.getElementById('header-user-role');
      const avatarElement = document.getElementById('header-avatar');

      if (nameElement) nameElement.textContent = newName;
      if (roleElement) roleElement.textContent = newRole;
      if (avatarElement) avatarElement.textContent = newName.charAt(0).toUpperCase();

      pushNotification('Profile Updated', `Name set to "${newName}" and role updated.`);
    });
  }
}

function initThemeAndAppearance() {
  const savedTheme = localStorage.getItem('app_theme') || 'light';
  const savedAccent = localStorage.getItem('app_accent') || '#1e3a8a';

  const themeBtns = document.querySelectorAll('.theme-option-btn');
  themeBtns.forEach(btn => {
    if (btn.dataset.theme === savedTheme) btn.classList.add('active');

    btn.addEventListener('click', () => {
      themeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const chosenTheme = btn.dataset.theme;
      localStorage.setItem('app_theme', chosenTheme);

      if (chosenTheme === 'dark') {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }

      pushNotification('Theme Changed', `Applied ${chosenTheme.toUpperCase()} mode.`);
    });
  });

  const accentCircles = document.querySelectorAll('.accent-circle');
  accentCircles.forEach(circle => {
    if (circle.dataset.color === savedAccent) circle.classList.add('active');

    circle.addEventListener('click', () => {
      accentCircles.forEach(c => c.classList.remove('active'));
      circle.classList.add('active');

      const chosenAccent = circle.dataset.color;
      localStorage.setItem('app_accent', chosenAccent);

      document.documentElement.style.setProperty('--primary', chosenAccent);
      pushNotification('Accent Updated', `Accent color changed.`);
    });
  });
}

function initSoundSettings() {
  const soundToggle = document.getElementById('toggle-notif-sound');
  const toneSelect = document.getElementById('select-sound-tone');
  const testSoundBtn = document.getElementById('btn-test-sound');

  if (soundToggle) {
    soundToggle.checked = localStorage.getItem('sound_enabled') !== 'false';
    soundToggle.addEventListener('change', (e) => {
      localStorage.setItem('sound_enabled', e.target.checked);
      pushNotification('Sound Setting', `Notification audio ${e.target.checked ? 'enabled' : 'disabled'}.`);
    });
  }

  if (toneSelect) {
    toneSelect.value = localStorage.getItem('sound_tone') || 'chime';
    toneSelect.addEventListener('change', (e) => {
      localStorage.setItem('sound_tone', e.target.value);
      playAudioChime(e.target.value);
      pushNotification('Tone Changed', `Notification tone set to ${e.target.value}.`);
    });
  }

  if (testSoundBtn) {
    testSoundBtn.addEventListener('click', () => {
      const currentTone = toneSelect ? toneSelect.value : 'chime';
      playAudioChime(currentTone);
    });
  }
}

function initToggles() {
  const compactToggle = document.getElementById('toggle-compact-ui');
  if (compactToggle) {
    compactToggle.checked = localStorage.getItem('compact_ui') === 'true';
    compactToggle.addEventListener('change', (e) => {
      localStorage.setItem('compact_ui', e.target.checked);
      if (e.target.checked) {
        document.body.classList.add('compact-density');
      } else {
        document.body.classList.remove('compact-density');
      }
      pushNotification('Layout Updated', `Compact view ${e.target.checked ? 'enabled' : 'disabled'}.`);
    });
  }

  const notifToggles = ['toggle-notif-welcome', 'toggle-notif-system'];
  notifToggles.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      const saved = localStorage.getItem(id);
      if (saved !== null) el.checked = saved === 'true';
      el.addEventListener('change', (e) => {
        localStorage.setItem(id, e.target.checked);
        pushNotification('Preference Saved', `${id.replace('toggle-notif-', '').toUpperCase()} alert settings saved.`);
      });
    }
  });
}

function initNotificationSettings() {
  const resetNotifBtn = document.getElementById('btn-reset-notifications');
  if (resetNotifBtn) {
    resetNotifBtn.addEventListener('click', () => {
      const notifList = document.getElementById('notif-list');
      if (notifList) {
        notifList.innerHTML = `<div class="notif-empty-state">No recent notifications</div>`;
      }
      const badge = document.getElementById('notif-badge');
      if (badge) badge.style.display = 'none';
    });
  }
}

function initResetConfirmationModal() {
  const triggerBtn = document.getElementById('btn-clear-all-data');
  const modal = document.getElementById('modal-reset-confirm');
  const confirmInput = document.getElementById('input-confirm-delete');
  const executeBtn = document.getElementById('btn-confirm-reset-execute');
  const cancelBtn = document.getElementById('btn-cancel-reset');

  if (!triggerBtn || !modal) return;

  triggerBtn.addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = 'flex';
    confirmInput.value = '';
    executeBtn.disabled = true;
    confirmInput.focus();
  });

  confirmInput.addEventListener('input', () => {
    executeBtn.disabled = confirmInput.value.trim() !== 'DELETE ALL DATA';
  });

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  if (executeBtn) {
    executeBtn.addEventListener('click', () => {
      if (confirmInput.value.trim() === 'DELETE ALL DATA') {
        localStorage.clear();
        modal.style.display = 'none';
        pushNotification('System Reset', 'Restored default settings.');
        setTimeout(() => {
          window.location.reload();
        }, 600);
      }
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });
}

function initAppInstallPrompt() {
  let deferredPrompt = null;
  const installHeaderBtn = document.getElementById('btn-install-app-header');
  const installMainBtn = document.getElementById('btn-install-app-main');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });

  const triggerInstall = (e) => {
    e.preventDefault();
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        deferredPrompt = null;
      });
    } else {
      alert('BrainlyHub Application Client is ready. Bookmark this app or use your browser\'s "Install App" option.');
    }
  };

  if (installHeaderBtn) installHeaderBtn.addEventListener('click', triggerInstall);
  if (installMainBtn) installMainBtn.addEventListener('click', triggerInstall);
}
