import '../dist/assets/style.css';
import { getToken ,getUserRole} from '../dist/assets/api/auth.js';
import {
  addProduct,
  fetchProducts,
  deleteProduct,
  editProduct,
  fetchAllOrders,
  updateOrderStatus,
  fetchUsers,
} from '../dist/assets/api/api.js';


const adminContent = document.getElementById('adminContent');

function checkAccess() {
  const token = getToken();
  const role = localStorage.getItem("userRole");
  if (!token || role !== 'admin') {
    alert("Access denied! Admins only.");
    window.location.href = '/login.html';
  }
}

function renderMessage(message) {
  adminContent.innerHTML = `<p class="text-lg font-semibold">${message}</p>`;
}


document.addEventListener('DOMContentLoaded', () => {
  checkAccess();

  // src/admin.js

document.getElementById('add-product-btn').onclick = renderAddProduct;
document.getElementById('manage-products-btn').onclick = renderManageProducts;
document.getElementById('manage-orders-btn').onclick = renderManageOrders;
document.getElementById('manage-users-btn').onclick = renderManageUsers;

const section = document.getElementById('adminContent');

function renderAddProduct() {
  section.innerHTML = `
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Add New Product</h2>

      <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <form id="add-form" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <input type="text" placeholder="Name" id="name" class="input border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          
          <input type="text" placeholder="Description" id="description" class="input border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2" required />
          
          <input type="number" placeholder="Price" id="price" class="input border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          
          <input type="text" placeholder="Category" id="category" class="input border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          
          <input type="number" placeholder="Count in Stock" id="countInStock" class="input border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          
          <input type="text" placeholder="Brand" id="brand" class="input border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          
          <input type="text" placeholder="Image URL" id="image" class="input border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2" />
          
          <div class="md:col-span-2 text-right">
            <button type="submit" class="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition duration-200">
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.getElementById('add-form').onsubmit = async (e) => {
    e.preventDefault();

    const product = {
      name: document.getElementById('name').value.trim(),
      description: document.getElementById('description').value.trim(),
      price: parseFloat(document.getElementById('price').value),
      category: document.getElementById('category').value.trim(),
      countInStock: parseInt(document.getElementById('countInStock').value),
      brand: document.getElementById('brand').value.trim(),
      image: document.getElementById('image').value.trim(),
    };

    console.log("✅ Product Data:", product);

    await addProduct(product);
    alert('✅ Product added successfully!');
  };
}



async function renderManageProducts() {
  const products = await fetchProducts();

  section.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 py-8">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Manage Products</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6" id="product-grid"></div>
    </div>
  `;

  const grid = document.getElementById('product-grid');

  products.forEach((product) => {
    const div = document.createElement('div');
    div.className =
      'bg-white rounded-2xl shadow-lg p-4 hover:shadow-xl transition duration-300 flex flex-col';

    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover rounded-xl mb-4" />

      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gray-800 truncate">${product.name}</h3>
        <p class="text-gray-500 text-sm mb-2">${product.category || 'Uncategorized'}</p>
        <p class="text-xl font-bold text-green-600 mb-2">Rs ${product.price}</p>
      </div>

      <div class="mt-4 flex gap-2">
        <button class="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-4 py-2 rounded-lg transition duration-200" data-edit="${product._id}">
          ✏️ Edit
        </button>
        <button class="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition duration-200" data-id="${product._id}">
          🗑 Delete
        </button>
      </div>
    `;

    // ✅ Delete functionality
    div.querySelector(`[data-id]`).onclick = async () => {
      if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
        await deleteProduct(product._id);
        alert('✅ Product Deleted!');
        renderManageProducts();
      }
    };

    // ✅ Edit functionality
    div.querySelector(`[data-edit]`).onclick = () => {
      renderEditProduct(product);
    };

    grid.appendChild(div);
  });
}


function renderEditProduct(product) {
  section.innerHTML = `
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Edit Product</h2>

      <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <!-- Image Preview -->
        <div class="flex justify-center mb-6">
          <img id="imagePreview" src="${product.image}" alt="${product.name}" class="w-40 h-40 object-cover rounded-xl border border-gray-300 shadow-md" />
        </div>

        <form id="edit-form" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" id="name" value="${product.name}" placeholder="Name"
            class="input border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />

          <input type="text" id="description" value="${product.description}" placeholder="Description"
            class="input border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2" required />

          <input type="number" id="price" value="${product.price}" placeholder="Price"
            class="input border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />

          <input type="text" id="category" value="${product.category}" placeholder="Category"
            class="input border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />

          <input type="number" id="countInStock" value="${product.countInStock}" placeholder="Count in Stock"
            class="input border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />

          <input type="text" id="brand" value="${product.brand}" placeholder="Brand"
            class="input border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />

          <input type="text" id="image" value="${product.image}" placeholder="Image URL"
            class="input border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2" />

          <div class="md:col-span-2 text-right">
            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition duration-200">
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  // ✅ Image Preview Update on URL Change
  const imageInput = document.getElementById('image');
  const imagePreview = document.getElementById('imagePreview');
  imageInput.addEventListener('input', () => {
    imagePreview.src = imageInput.value || 'https://via.placeholder.com/150';
  });

  // ✅ Submit Form
  document.getElementById('edit-form').onsubmit = async (e) => {
    e.preventDefault();

    const updated = {
      name: document.getElementById('name').value.trim(),
      description: document.getElementById('description').value.trim(),
      price: parseFloat(document.getElementById('price').value),
      category: document.getElementById('category').value.trim(),
      countInStock: parseInt(document.getElementById('countInStock').value),
      brand: document.getElementById('brand').value.trim(),
      image: imageInput.value.trim(),
    };

    console.log("✅ Updated Product:", updated);

    await editProduct(product._id, updated);
    alert('✅ Product updated successfully!');
    renderManageProducts();
  };
}


async function renderManageOrders() {
  const orders = await fetchAllOrders();

  section.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 py-8">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Manage Orders</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center" id="orders-grid"></div>
    </div>
  `;

  const grid = document.getElementById('orders-grid');

  orders.forEach((order) => {
    const div = document.createElement('div');
    div.className =
      'bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 max-w-md mx-auto';

    // ✅ Status Badge Colors
    let statusColor = 'bg-yellow-400';
    if (order.status === 'Confirmed') statusColor = 'bg-blue-400';
    else if (order.status === 'Shipped') statusColor = 'bg-purple-500';
    else if (order.status === 'Delivered') statusColor = 'bg-green-500';
    else if (order.status === 'Cancelled') statusColor = 'bg-red-500';

    // ✅ Status Emoji
    let statusEmoji = '⏳';
    if (order.status === 'Confirmed') statusEmoji = '✅';
    else if (order.status === 'Shipped') statusEmoji = '🚚';
    else if (order.status === 'Delivered') statusEmoji = '📬';
    else if (order.status === 'Cancelled') statusEmoji = '❌';

    const date = new Date(order.createdAt).toLocaleString();

    // ✅ Shipping info (safe fallback)
    const shipping = order.shippingAddress || {};
    const shippingHTML = `
      <div class="mb-3 text-sm text-gray-600">
        <p><strong>Name:</strong> ${shipping.name || 'N/A'}</p>
        <p><strong>Address:</strong> ${shipping.address || 'N/A'}, ${shipping.city || ''} (${shipping.zip || ''})</p>
        <p><strong>Phone:</strong> ${shipping.phone || 'N/A'}</p>
        <p><strong>Email:</strong> ${shipping.email || 'N/A'}</p>
      </div>
    `;

    // ✅ Payment Method
    const paymentMethod = order.paymentMethod || 'Not Specified';

    div.innerHTML = `
      <div class="mb-4 flex justify-between items-center">
        <p class="text-gray-600 text-sm">Order ID: <span class="font-mono">${order._id}</span></p>
        <span class="px-3 py-1 text-xs font-semibold text-white rounded-full ${statusColor}">
          ${statusEmoji} ${order.status}
        </span>
      </div>

      <p class="text-sm text-gray-500 mb-2">🕒 Placed on: ${date}</p>
      <p class="text-gray-700 text-sm mb-2"><strong>User:</strong> ${order.userId?.email || 'Unknown'}</p>
      <p class="text-gray-700 text-sm mb-4"><strong>Payment:</strong> ${paymentMethod}</p>

      <h4 class="font-semibold text-gray-800 mb-2">Shipping Info</h4>
      ${shippingHTML}

      <div class="bg-gray-50 rounded-lg p-3 mb-3">
        ${order.items && order.items.length > 0
          ? order.items.map(
              (item) => `
              <div class="flex justify-between text-sm text-gray-600">
                <span>${item.name} × ${item.quantity}</span>
                <span class="font-medium">Rs ${(item.price * item.quantity).toLocaleString()}</span>
              </div>`
            ).join('')
          : `<p class="text-gray-500 text-sm">No items</p>`}
      </div>

      <p class="text-right text-gray-800 font-semibold mb-3">Total: Rs ${order.total.toLocaleString()}</p>

      <div class="flex items-center gap-3">
        <select class="status-select border border-gray-300 rounded-lg px-3 py-2 w-full">
          <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
          <option value="Confirmed" ${order.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
          <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
          <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
          <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
        </select>

        <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition" data-id="${order._id}">
          Update
        </button>
      </div>
    `;

    const button = div.querySelector('button');
    const select = div.querySelector('.status-select');

    button.onclick = async () => {
      const newStatus = select.value;
      await updateOrderStatus(order._id, newStatus);
      alert(`✅ Order status updated to ${newStatus}`);
      renderManageOrders(); // Refresh
    };

    grid.appendChild(div);
  });
}





async function renderManageUsers() {
  const users = await fetchUsers();

  section.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 py-8">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Manage Users</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="users-grid"></div>
    </div>
  `;

  const grid = document.getElementById('users-grid');

  users.forEach((user) => {
    const div = document.createElement('div');
    div.className =
      'bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between';

    div.innerHTML = `
      <div class="mb-4">
        <p class="text-lg font-semibold text-gray-800">${user.name || "Unnamed"}</p>
        <p class="text-gray-600 text-sm mb-2">${user.email}</p>
        <span class="text-xs font-semibold px-2 py-1 rounded-full ${
          user.role === "admin" ? "bg-purple-100 text-purple-600" : "bg-green-100 text-green-600"
        }">
          ${user.role === "admin" ? "Admin" : "User"}
        </span>
      </div>

      <div class="flex justify-end gap-2">
        <button class="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-3 py-1 rounded-lg" data-delete="${user._id}">
          Delete
        </button>
      </div>
    `;

    // ✅ Delete functionality
    const deleteBtn = div.querySelector(`[data-delete]`);
    deleteBtn.onclick = async () => {
      if (confirm(`Are you sure you want to delete user: ${user.email}?`)) {
        await deleteUser(user._id);
        alert("✅ User deleted successfully!");
        renderManageUsers(); // Refresh list
      }
    };

    grid.appendChild(div);
  });
}

const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
       localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userEmail');
      localStorage.removeItem("userId")
      localStorage.removeItem("userName")
      localStorage.removeItem("userRole")
      localStorage.removeItem("token")
      location.href = "../index.html";

    });
  }

  const profileBtn = document.getElementById('profileBtn');
  if (profileBtn) {
    profileBtn.addEventListener('click', () => {
      alert('Profile clicked!');
    });
  }

});
