/* ==========================================
   BRAINLYHUB - NOTIFICATIONS MODULE
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  renderNotificationsList();
});

function renderNotificationsList() {
  const notifListEl = document.getElementById('notif-list');
  const notifBadgeEl = document.getElementById('notif-badge');
  const btnClear = document.getElementById('btn-clear-notifs');

  if (!notifListEl) return;

  const notifs = JSON.parse(localStorage.getItem('app_notifications') || '[]');

  if (notifs.length === 0) {
    notifListEl.innerHTML = '<div class="notif-empty-state">No recent notifications</div>';
    if (notifBadgeEl) notifBadgeEl.style.display = 'none';
    return;
  }

  if (notifBadgeEl) notifBadgeEl.style.display = 'block';

  notifListEl.innerHTML = notifs.map(n => `
    <div class="notif-item ${n.unread ? 'unread' : ''}">
      <div class="notif-icon-box">
        <img src="assets/${n.icon || 'Notifications.png'}" alt="Icon" />
      </div>
      <div class="notif-details">
        <span class="notif-title">${n.title}</span>
        <span class="notif-desc">${n.desc}</span>
        <span class="notif-time">${n.time}</span>
      </div>
    </div>
  `).join('');

  if (btnClear) {
    btnClear.addEventListener('click', () => {
      localStorage.setItem('app_notifications', JSON.stringify([]));
      renderNotificationsList();
    });
  }
}
