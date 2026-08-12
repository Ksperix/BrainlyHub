/* ==========================================
   BRAINLYHUB - PROFILE MANAGEMENT MODULE
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initUserProfile();
});

function initUserProfile() {
  renderProfileData();

  // Pola formularza edycji profilu (jeśli obecne na stronie settings.html)
  const inputName = document.getElementById('input-user-name');
  const selectRole = document.getElementById('select-user-role');
  const btnSave = document.getElementById('btn-save-profile');

  if (inputName && selectRole && btnSave) {
    const currentData = getProfileData();
    inputName.value = currentData.name;
    selectRole.value = currentData.role;

    btnSave.addEventListener('click', () => {
      const newName = inputName.value.trim() || 'Student Account';
      const newRole = selectRole.value || 'High School Member';

      const updatedProfile = { name: newName, role: newRole };
      localStorage.setItem('user_profile_data', JSON.stringify(updatedProfile));

      // Aktualizacja elementów w nagłówku w czasie rzeczywistym
      renderProfileData();
      alert('Profile updated successfully!');
    });
  }
}

function getProfileData() {
  const saved = localStorage.getItem('user_profile_data');
  return saved ? JSON.parse(saved) : { name: 'Student Account', role: 'High School Member' };
}

function renderProfileData() {
  const profile = getProfileData();

  const nameEl = document.getElementById('header-user-name');
  const roleEl = document.getElementById('header-user-role');
  const avatarEl = document.getElementById('header-avatar');

  if (nameEl) nameEl.textContent = profile.name;
  if (roleEl) roleEl.textContent = profile.role;
  if (avatarEl) avatarEl.textContent = profile.name.charAt(0).toUpperCase();
}
