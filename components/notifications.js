/* ==========================================
   BRAINLYHUB - NOTIFICATIONS MODULE
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  renderNotificationsList();
});

function renderNotificationsList() {
  const notifListEl = document.getElementById('notif-list');
  const notifBadgeEl = document.getElementById('notif-badge');

  if (!notifListEl) return;

  const notifs = JSON.parse(localStorage.getItem('app_notifications') || '[]');

  if (notifs.length === 0) {
    notifListEl.innerHTML = '<div class="notif-empty-state">No recent notifications</div>';
    if (notifBadgeEl) notifBadgeEl.style.display = 'none';
    return;
  }

  // Pokaż czerwoną kropkę statusu powiadomienia
  const hasUnread = notifs.some(n => n.unread);
  if (notifBadgeEl) {
    notifBadgeEl.style.display = hasUnread ? 'block' : 'none';
  }

  notifListEl.innerHTML = notifs.map(n => `
    <div class="notif-item ${n.unread ? 'unread' : ''}">
      <div class="notif-icon-box">
        <img src="assets/${n.icon || 'Notifications.png'}" alt="Icon" />
      </div>
      <div class="notif-details">
        <span class="notif-title">${n.title}</span>
        <span class="notif-desc">${n.desc}</span>
        <span class="notif-time">${n.time || 'Just now'}</span>
      </div>
    </div>
  `).join('');
}

// Funkcja globalna udostępniona dla app.js do natychmiastowej aktualizacji
window.pushCustomNotification = function(title, desc, icon) {
  const currentNotifs = JSON.parse(localStorage.getItem('app_notifications') || '[]');
  
  const newNotif = {
    id: Date.now(),
    title: title || 'System Update',
    desc: desc || 'Preferences saved successfully.',
    icon: icon || 'Notifications.png',
    unread: true,
    time: 'Just now'
  };

  currentNotifs.unshift(newNotif);
  localStorage.setItem('app_notifications', JSON.stringify(currentNotifs));
  renderNotificationsList();
};

window.clearAllNotifications = function() {
  localStorage.setItem('app_notifications', JSON.stringify([]));
  renderNotificationsList();
};
