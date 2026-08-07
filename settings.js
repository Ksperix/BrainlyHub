/* ==========================================
   BRAINLYHUB - SETTINGS CONTROLLER
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initProfileSettings();
  initThemeAndAppearance();
  initNotificationSettings();
  initSystemReset();
  initToggles();
});

/**
  Funkcja pomocnicza generująca wewnętrzne powiadomienie do listy
 */
function pushNotification(title, desc) {
  const notifList = document.getElementById('notif-list');
  const badge = document.getElementById('notif-badge');

  if (badge) {
    badge.style.display = 'block';
  }

  if (notifList) {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const card = document.createElement('div');
    card.className = 'notification-card';
    card.innerHTML = `
      <div class="notif-icon-wrapper">
        <img src="assets/Settings.png" class="nav-icon" style="width: 16px; height: 16px;" alt="Settings" />
      </div>
      <div class="notif-content">
        <span class="notif-title">${title}</span>
        <span class="notif-desc">${desc}</span>
        <span class="notif-time">${timeStr}</span>
      </div>
    `;
    notifList.prepend(card);
  }
}

function initProfileSettings() {
  const nameInput = document.getElementById('input-user-name');
  const roleSelect = document.getElementById('select-user-role');
  const saveBtn = document.getElementById('btn-save-profile');

  if (nameInput) {
    nameInput.value = localStorage.getItem('user_name') || 'Student Account';
  }
  if (roleSelect) {
    roleSelect.value = localStorage.getItem('user_role') || 'High School Member';
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const newName = nameInput.value.trim() || 'Student Account';
      const newRole = roleSelect.value;

      localStorage.setItem('user_name', newName);
      localStorage.setItem('user_role', newRole);

      // Aktualizacja nagłówka
      const nameElement = document.getElementById('header-user-name');
      const roleElement = document.getElementById('header-user-role');
      const avatarElement = document.getElementById('header-avatar');
      
      if (nameElement) nameElement.textContent = newName;
      if (roleElement) roleElement.textContent = newRole;
      if (avatarElement) avatarElement.textContent = newName.charAt(0).toUpperCase();

      pushNotification('Profile Updated', `Name set to "${newName}" and role updated to "${newRole}".`);
    });
  }
}

function initThemeAndAppearance() {
  const savedTheme = localStorage.getItem('app_theme') || 'light';
  const savedAccent = localStorage.getItem('app_accent') || '#1e3a8a';

  // --- Przełącznik Motywu ---
  const themeBtns = document.querySelectorAll('.theme-option-btn');
  themeBtns.forEach(btn => {
    if (btn.dataset.theme === savedTheme) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }

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

      pushNotification('Theme Changed', `Applied ${chosenTheme.toUpperCase()} color mode across the interface.`);
    });
  });

  // --- Wybór Akcentu ---
  const accentCircles = document.querySelectorAll('.accent-circle');
  accentCircles.forEach(circle => {
    if (circle.dataset.color === savedAccent) {
      circle.classList.add('active');
    } else {
      circle.classList.remove('active');
    }

    circle.addEventListener('click', () => {
      accentCircles.forEach(c => c.classList.remove('active'));
      circle.classList.add('active');

      const chosenAccent = circle.dataset.color;
      localStorage.setItem('app_accent', chosenAccent);

      document.documentElement.style.setProperty('--primary', chosenAccent);
      pushNotification('Accent Updated', `Primary highlight color adjusted.`);
    });
  });
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
      pushNotification('Layout Updated', `Compact density ${e.target.checked ? 'enabled' : 'disabled'}.`);
    });
  }

  const notifToggles = ['toggle-notif-welcome', 'toggle-notif-exams', 'toggle-notif-solutions', 'toggle-notif-system'];
  notifToggles.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      const saved = localStorage.getItem(id);
      if (saved !== null) el.checked = saved === 'true';
      el.addEventListener('change', (e) => {
        localStorage.setItem(id, e.target.checked);
        pushNotification('Preference Saved', `${id.replace('toggle-notif-', '').toUpperCase()} alerts updated.`);
      });
    }
  });
}

function initNotificationSettings() {
  const resetNotifBtn = document.getElementById('btn-reset-notifications');
  if (resetNotifBtn) {
    resetNotifBtn.addEventListener('click', () => {
      const notifList = document.getElementById('notif-list');
      if (notifList) notifList.innerHTML = '';
      localStorage.removeItem('notif_welcome_read');
      localStorage.removeItem('has_visited_before');
      
      pushNotification('History Reset', 'All local notifications have been cleared.');
    });
  }
}

function initSystemReset() {
  const clearDataBtn = document.getElementById('btn-clear-all-data');
  if (clearDataBtn) {
    clearDataBtn.addEventListener('click', () => {
      localStorage.clear();
      pushNotification('System Reset', 'All settings restored to default values.');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    });
  }
}
