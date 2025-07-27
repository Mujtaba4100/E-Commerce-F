//const backendURL = 'http://localhost:5000';
const backendURL = import.meta.env.VITE_BACKEND_URL;

// ✅ Utility: Get unique cart key per user
function getCartKey() {
  const userEmail = localStorage.getItem("userEmail");
  return userEmail ? `cart_${userEmail}` : "cart_guest";
}

// ✅ Add product to cart
export function addToCart(product) {
  const cartKey = getCartKey();
  let cart = [];

  try {
    const storedCart = JSON.parse(localStorage.getItem(cartKey));
    if (Array.isArray(storedCart)) {
      cart = storedCart;
    }
  } catch (err) {
    console.error("Failed to parse cart:", err);
  }

  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += product.quantity|| 1;
  } else {
    cart.push({ ...product, quantity: product.quantity || 1 });
  }

  localStorage.setItem(cartKey, JSON.stringify(cart));
  showToast("✅ Product added to cart!");
}

// ✅ Toast UI
function showToast(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.className =
    "fixed bottom-6 right-6 bg-green-600 text-white py-3 px-6 rounded-xl shadow-lg text-lg font-medium z-50 animate-fade-in";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

// ✅ Render Cart Page
export function renderCartPage() {
  const mainContent = document.getElementById("main-content");
  if (!mainContent) return;

  const cartKey = getCartKey();
  mainContent.innerHTML = "";

  let cart = [];
  try {
    const storedCart = JSON.parse(localStorage.getItem(cartKey));
    if (Array.isArray(storedCart)) cart = storedCart;
  } catch (err) {
    console.error("Failed to parse cart:", err);
  }

  const container = document.createElement("div");
  container.className = "max-w-6xl mx-auto p-6";

  const heading = document.createElement("h2");
  heading.className = "text-3xl font-bold mb-6 text-gray-800 text-center";
  heading.textContent = "🛒 Your Shopping Cart";
  container.appendChild(heading);

  if (cart.length === 0) {
    const emptyMsg = document.createElement("p");
    emptyMsg.className = "text-gray-600 text-center text-lg";
    emptyMsg.textContent = "Your cart is empty.";
    container.appendChild(emptyMsg);
  } else {
    const grid = document.createElement("div");
    grid.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8";

    let subtotal = 0;

    cart.forEach((item, index) => {
      subtotal += item.price * item.quantity;

      const card = document.createElement("div");
      card.className =
        "bg-white shadow-lg rounded-2xl p-5 flex flex-col justify-between hover:shadow-xl transition duration-300 border border-gray-200";

      card.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="w-full h-40 object-cover rounded-lg mb-4">
        <h3 class="text-lg font-bold text-gray-800 mb-1 truncate">${item.name}</h3>
        <p class="text-sm text-gray-500 mb-2">Price: Rs ${item.price}</p>
        <div class="flex items-center justify-between mb-4">
          <button class="minus-btn bg-gray-300 px-3 py-1 rounded hover:bg-gray-400">−</button>
          <span class="font-semibold text-lg">${item.quantity}</span>
          <button class="plus-btn bg-gray-300 px-3 py-1 rounded hover:bg-gray-400">+</button>
        </div>
        <button class="remove-btn bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg w-full font-semibold">Remove</button>
      `;

      // Quantity controls
      card.querySelector(".minus-btn").addEventListener("click", () => {
        if (item.quantity > 1) {
          item.quantity -= 1;
          localStorage.setItem(cartKey, JSON.stringify(cart));
          renderCartPage();
        }
      });

      card.querySelector(".plus-btn").addEventListener("click", () => {
        item.quantity += 1;
        localStorage.setItem(cartKey, JSON.stringify(cart));
        renderCartPage();
      });

      card.querySelector(".remove-btn").addEventListener("click", () => {
        cart.splice(index, 1);
        localStorage.setItem(cartKey, JSON.stringify(cart));
        renderCartPage();
      });

      grid.appendChild(card);
    });

    container.appendChild(grid);

    // ✅ Summary Section (Fixed at bottom)
    const summary = document.createElement("div");
    summary.className =
      "fixed bottom-0 left-0 w-full bg-white shadow-lg border-t p-4 flex justify-between items-center z-40";

    summary.innerHTML = `
      <div>
        <p class="text-lg font-semibold text-gray-700">Subtotal: Rs ${subtotal.toLocaleString()}</p>
        <p class="text-sm text-gray-500">Shipping calculated at checkout</p>
      </div>
      <div class="flex gap-4">
        <button id="clearCartBtn" class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-medium">Clear Cart</button>
        <button id="chkoutBtn" class="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-bold">Proceed to Checkout</button>
      </div>
    `;

    container.appendChild(summary);

    // ✅ Clear All Button Action
    summary.querySelector("#clearCartBtn").addEventListener("click", () => {
      localStorage.removeItem(cartKey);
      renderCartPage();
    });

    // ✅ CHeck Out Action
    summary.querySelector("#chkoutBtn").addEventListener("click", () => {
      window.location.href="checkout.html";
    });

  }

  mainContent.appendChild(container);
}

// ✅ Place Order Function
async function placeOrder(cart, cartKey) {
  const userEmail = localStorage.getItem("userEmail");
  const userId = localStorage.getItem("userId");

  if (!userEmail || !userId) return alert("Please login first");

  if (cart.length === 0) return alert("Your cart is empty");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const response = await fetch(`${backendURL}/api/orders`, {
    method: "POST",
    headers: {
      "ngrok-skip-browser-warning": "true",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: userId,
      items: cart,
      total,
    }),
  });

  const data = await response.json();
  if (response.ok) {
    localStorage.setItem(cartKey, JSON.stringify([])); // clear cart
    showToast("✅ Order placed successfully!");
    renderCartPage();
  } else {
    alert("❌ Failed to place order");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderCartPage();
});
