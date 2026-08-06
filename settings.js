/* ==========================================
   BRAINLYHUB - SETTINGS CONTROLLER
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initProfileSettings();
  initThemeAndAppearance();
  initNotificationSettings();
  initSystemReset();
});

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

      const nameElement = document.getElementById('header-user-name');
      const avatarElement = document.getElementById('header-avatar');
      if (nameElement) nameElement.textContent = newName;
      if (avatarElement) avatarElement.textContent = newName.charAt(0).toUpperCase();

      alert('Profile settings saved successfully!');
    });
  }
}

function initThemeAndAppearance() {
  // --- 1. Obsługa Motywu (Light / Dark) ---
  const savedTheme = localStorage.getItem('app_theme') || 'light';
  applyTheme(savedTheme);

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
      applyTheme(chosenTheme);
    });
  });

  // --- 2. Obsługa Koloru Akcentu ---
  const savedAccent = localStorage.getItem('app_accent') || '#1e3a8a';
  applyAccent(savedAccent);

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
      applyAccent(chosenAccent);
    });
  });
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }
}

function applyAccent(color) {
  document.documentElement.style.setProperty('--primary', color);
}

function initNotificationSettings() {
  const resetNotifBtn = document.getElementById('btn-reset-notifications');

  if (resetNotifBtn) {
    resetNotifBtn.addEventListener('click', () => {
      localStorage.removeItem('notif_welcome_read');
      localStorage.removeItem('has_visited_before');
      alert('Notification history reset successfully!');
    });
  }
}

function initSystemReset() {
  const clearDataBtn = document.getElementById('btn-clear-all-data');

  if (clearDataBtn) {
    clearDataBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all application settings and local storage?')) {
        localStorage.clear();
        window.location.reload();
      }
    });
  }
}
