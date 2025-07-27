// src/pages/order.js

//const backendURL = 'http://localhost:5000';
const backendURL = import.meta.env.VITE_BACKEND_URL;
const ordersContainer = document.getElementById('ordersContainer');
const userId = localStorage.getItem('userId');
const modal = document.getElementById('orderModal');
const modalContent = document.getElementById('modalContent');
const closeModalBtn = document.getElementById('closeModal');

// ✅ Show message if user not logged in
if (!userId) {
  ordersContainer.innerHTML = `
    <div class="text-center py-10">
      <p class="text-red-600 font-semibold text-lg">🔒 Please login to view your orders.</p>
    </div>
  `;
} else {
  fetch(`${backendURL}/api/orders/${userId}`, {
    headers: {
      'ngrok-skip-browser-warning': 'true',
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((orders) => {
      if (!orders || orders.length === 0) {
        ordersContainer.innerHTML = `
          <div class="text-center py-10">
            <p class="text-gray-600 text-lg">📦 No orders found yet.</p>
          </div>
        `;
        return;
      }

      ordersContainer.innerHTML = '';

      orders.forEach((order) => {
        const orderDiv = document.createElement('div');
        orderDiv.className =
          'bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 mb-6 cursor-pointer';
        orderDiv.dataset.orderId = order._id;

        const date = new Date(order.createdAt).toLocaleString();

        let statusColor = 'bg-yellow-400';
        let statusEmoji = '⏳';
        switch (order.status) {
          case 'Confirmed':
            statusColor = 'bg-blue-500';
            statusEmoji = '✅';
            break;
          case 'Shipped':
            statusColor = 'bg-purple-500';
            statusEmoji = '🚚';
            break;
          case 'Delivered':
            statusColor = 'bg-green-500';
            statusEmoji = '📬';
            break;
          case 'Cancelled':
            statusColor = 'bg-red-500';
            statusEmoji = '❌';
            break;
        }

        const itemsHTML = order.items
          .map(
            (item) => `
              <li class="flex justify-between">
                <span>${item.name} × ${item.quantity}</span>
                <span class="font-medium">Rs. ${(item.price * item.quantity).toLocaleString()}</span>
              </li>`
          )
          .join('');

        orderDiv.innerHTML = `
          <div class="mb-3 flex items-center justify-between">
            <p class="text-gray-600 text-sm">Order ID:
              <span class="font-mono font-medium">${order._id}</span>
            </p>
            <span class="inline-block px-3 py-1 text-xs font-semibold text-white rounded-full ${statusColor}">
              ${statusEmoji} ${order.status}
            </span>
          </div>

          <p class="text-sm text-gray-500 mb-4">🕒 Placed on: ${date}</p>

          <div class="bg-gray-50 rounded-xl p-4 mb-3">
            <ul class="space-y-2 text-sm text-gray-700">
              ${itemsHTML}
            </ul>
          </div>

          <div class="text-right">
            <p class="text-sm font-semibold text-gray-800">
              Total: Rs. ${order.total.toLocaleString()}
            </p>
          </div>
        `;

        // ✅ Click to open modal with details
        orderDiv.addEventListener('click', () => openOrderModal(order));
        ordersContainer.appendChild(orderDiv);
      });
    })
    .catch((err) => {
      console.error('❌ Error fetching orders:', err);
      ordersContainer.innerHTML = `
        <div class="text-center py-10">
          <p class="text-red-500 font-medium">⚠️ Failed to load orders. Please try again later.</p>
        </div>
      `;
    });
}

function openOrderModal(order) {
  const modal = document.getElementById('orderModal');
  const modalContent = document.getElementById('modalContent');

  const date = order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A';

  const itemsHTML = Array.isArray(order.items) && order.items.length > 0
    ? order.items.map(item => `
        <div class="flex items-center justify-between border-b py-2">
          <div class="flex items-center gap-3">
            <img src="${item.image || 'https://via.placeholder.com/50'}" class="w-12 h-12 rounded object-cover" alt="${item.name || 'Item'}">
            <span>${item.name || 'Unnamed'} × ${item.quantity || 1}</span>
          </div>
          <span class="font-semibold">Rs ${(item.price && item.quantity ? (item.price * item.quantity).toLocaleString() : '0')}</span>
        </div>
      `).join('')
    : `<p class="text-gray-500 text-sm">No items found for this order.</p>`;

  const shipping = order.shippingAddress || {};
  const name = shipping.name || 'N/A';
  const address = shipping.address || 'N/A';
  const city = shipping.city || '';
  const zip = shipping.zip || '';
  const phone = shipping.phone || 'N/A';
  const email = shipping.email || 'N/A';

  modalContent.innerHTML = `
    <h2 class="text-xl font-bold mb-4">Order Details</h2>
    <p class="text-gray-500 text-sm mb-2">Order ID: ${order._id || 'N/A'}</p>
    <p class="text-gray-500 text-sm mb-4">Placed on: ${date}</p>

    <div class="mb-4">
      <h3 class="font-semibold text-gray-700 mb-2">Shipping Info</h3>
      <p>${name}</p>
      <p>${address}, ${city} (${zip})</p>
      <p>Phone: ${phone}</p>
      <p>Email: ${email}</p>
    </div>

    <div class="mb-4">
      <h3 class="font-semibold text-gray-700 mb-2">Payment Method</h3>
      <p>${order.paymentMethod || 'N/A'}</p>
    </div>

    <div class="mb-4">
      <h3 class="font-semibold text-gray-700 mb-2">Items</h3>
      ${itemsHTML}
    </div>

    <div class="text-right font-bold text-lg">
      Total: Rs ${order.total ? order.total.toLocaleString() : '0'}
    </div>
  `;

  modal.classList.remove('hidden');
}

// ✅ Close modal
closeModalBtn.addEventListener('click', () =>
   {
    console.log("ffffff")
    modal.classList.add('hidden')
  });
