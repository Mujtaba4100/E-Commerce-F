export function initHeader() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const authButtons = document.getElementById('authButtons');
  const profileButtons = document.getElementById('profileButtons');

  if (authButtons && profileButtons) {
    if (isLoggedIn) {
      authButtons.style.display = 'none';
      profileButtons.style.display = 'flex';
    } else {
      authButtons.style.display = 'flex';
      profileButtons.style.display = 'none';
    }
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.clear();
      location.reload();
    });
  }

  const cartBtn = document.getElementById('cart-btn');
  if (cartBtn) {
    cartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'cart.html';
    });
  }

  const orderHistoryBtn = document.getElementById('orderHistoryBtn');
  if (orderHistoryBtn) {
    orderHistoryBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'order.html';
    });
  }

  const profileBtn = document.getElementById('profileBtn');
  if (profileBtn) {
    profileBtn.addEventListener('click', () => {
      alert('Profile clicked!');
    });
  }
}
