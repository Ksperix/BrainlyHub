/* ==========================================
   BRAINLYHUB - SETTINGS CONTROLLER
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initProfileSettings();
  initNotificationSettings();
  initSystemReset();
});

function initProfileSettings() {
  const nameInput = document.getElementById('input-user-name');
  const roleSelect = document.getElementById('select-user-role');
  const saveBtn = document.getElementById('btn-save-profile');

  // Wczytywanie zapisanych danych
  if (nameInput) {
    nameInput.value = localStorage.getItem('user_name') || 'Student Account';
  }
  if (roleSelect) {
    roleSelect.value = localStorage.getItem('user_role') || 'High School Member';
  }

  // Zapis zmian
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const newName = nameInput.value.trim() || 'Student Account';
      const newRole = roleSelect.value;

      localStorage.setItem('user_name', newName);
      localStorage.setItem('user_role', newRole);

      // Odświeżenie nazwy w rozwijanym profilu w nagłówku
      const nameElement = document.getElementById('header-user-name');
      const avatarElement = document.getElementById('header-avatar');
      if (nameElement) nameElement.textContent = newName;
      if (avatarElement) avatarElement.textContent = newName.charAt(0).toUpperCase();

      alert('Profile settings saved successfully!');
    });
  }
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
