const BASE_URL = 'http://localhost:5000/api'; // Change this for production if needed

// ==================== AUTH HELPERS ====================
export function getToken() {
  return localStorage.getItem('token');
}

// ==================== PUBLIC: PRODUCTS ====================

// Fetch all products (for homepage and admin)
export async function fetchProducts() {
  const res = await fetch(`${BASE_URL}/products`);
  return res.json();
}

// ==================== ADMIN: PRODUCTS ====================

// Add a new product
export async function addProduct(productData) {
  const res = await fetch(`${BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
     // Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(productData)
  });
  console.log(productData)
  return res.json();
}

// Edit an existing product
export async function editProduct(productId, updatedData) {
  //console.log(updatedData)
  const res = await fetch(`${BASE_URL}/products/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(updatedData)
  });
  return res.json();
}

// Delete a product
export async function deleteProduct(productId) {
  const res = await fetch(`${BASE_URL}/products/${productId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  return res.json();
}

// ==================== ADMIN: ORDERS ====================

// Fetch all orders
export async function fetchAllOrders() {
  const res = await fetch(`${BASE_URL}/admin/orders`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch orders: ${res.status} ${errorText}`);
  }

  return res.json();
}

// Update order status
export async function updateOrderStatus(orderId, status) {
  const res = await fetch(`${BASE_URL}/admin/orders/${orderId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({ status })
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to update order status: ${res.status} ${errorText}`);
  }

  return res.json();
}

// ==================== ADMIN: USERS ====================

// Fetch all users
export async function fetchUsers() {
  const res = await fetch(`${BASE_URL}/admin/users`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch users: ${res.status} ${errorText}`);
  }

  return res.json();
}
