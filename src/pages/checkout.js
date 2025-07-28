import {initHeader} from '../components/header.js';
const backendURL = import.meta.env.VITE_BACKEND_URL;

document.addEventListener("DOMContentLoaded", () => {
  initHeader()
  const params = new URLSearchParams(window.location.search);
  const buyNow = params.get("buyNow");
  let items = [];
  let subtotal = 0;

  if (buyNow === "true") {
    if (params.get("id1")) {
      const item1 = {
        id: params.get("id1"),
        name: decodeURIComponent(params.get("name1")),
        price: parseFloat(params.get("price1")),
        image: decodeURIComponent(params.get("image1")),
        quantity: parseInt(params.get("qty1")) || 1
      };

      const item2 = {
        id: params.get("id2"),
        name: decodeURIComponent(params.get("name2")),
        price: parseFloat(params.get("price2")),
        image: decodeURIComponent(params.get("image2")),
        quantity: parseInt(params.get("qty2")) || 1
      };

      items.push(item1, item2);
    } else {
      const product = {
        id: params.get("id"),
        name: decodeURIComponent(params.get("name")),
        price: parseFloat(params.get("price")),
        image: decodeURIComponent(params.get("image")),
        quantity: parseInt(params.get("qty")) || 1
      };
      items.push(product);
    }

    items.forEach(item => subtotal += item.price * item.quantity);
  } else {
    const userEmail = localStorage.getItem("userEmail");
    const cartKey = userEmail ? `cart_${userEmail}` : "cart_guest";
    items = JSON.parse(localStorage.getItem(cartKey)) || [];
    items.forEach(item => subtotal += item.price * item.quantity);
  }

  if (items.length === 0) {
    document.body.innerHTML = "<h2 class='text-center mt-10 text-red-500'>No items to checkout!</h2>";
    return;
  }

  const orderSummary = document.getElementById("order-summary");
  const totalAmountEl = document.getElementById("total-amount");

  orderSummary.innerHTML = items
    .map(item => `
      <div class="flex justify-between bg-gray-50 p-3 rounded border">
        <span>${item.name} (x${item.quantity})</span>
        <span>${item.price === 0 ? "FREE" : `Rs ${item.price * item.quantity}`}</span>
      </div>
    `).join("");

  totalAmountEl.textContent = `Rs ${subtotal}`;

  document.getElementById("place-order").addEventListener("click", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const address = document.getElementById("address").value.trim();
    const city = document.getElementById("city").value.trim();
    const zip = document.getElementById("zip").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

    if (!name || !email || !address || !city || !zip || !phone) {
      alert("Please fill all shipping details.");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("You must be logged in to place an order.");
      return;
    }

    const orderData = {
      userId,
      items: items.map(item => ({
        productId: item.id || item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || ''
      })),
      total: subtotal,
      paymentMethod,
      shippingAddress: { name, email, address, city, zip, phone }
    };

    try {
      const response = await fetch(`${backendURL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        alert("Order placed successfully!");
        if (buyNow !== "true") {
          const userEmail = localStorage.getItem("userEmail");
          const cartKey = userEmail ? `cart_${userEmail}` : "cart_guest";
          localStorage.removeItem(cartKey);
        }
        window.location.href = "index.html";
      } else {
        alert("Failed to place order.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error placing order.");
    }
  });
});
