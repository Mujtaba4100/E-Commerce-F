document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const buyNow = params.get("buyNow");
  const deal = params.get("deal");
  let items = [];
  let subtotal = 0;

  if (deal === "bogo") {
    // ✅ Special Deal Items
    const dealItems = JSON.parse(decodeURIComponent(params.get("items")));
    items = dealItems;
    items.forEach(item => subtotal += item.price * item.quantity);
  } else if (buyNow === "true") {
    // ✅ Single Product Buy Now
const product = {
  productId: params.get("id"), // ✅ Use productId for schema
  id: params.get("id"),        // (Optional: keep id for UI if needed)
  name: decodeURIComponent(params.get("name")),
  price: parseFloat(params.get("price")),
  image: decodeURIComponent(params.get("image")),
  quantity: parseInt(params.get("qty")) || 1
};

    items.push(product);
    subtotal = product.price * product.quantity;
  } else {
    // ✅ Normal cart checkout
    const userEmail = localStorage.getItem("userEmail");
    const cartKey = userEmail ? `cart_${userEmail}` : "cart_guest";
    items = JSON.parse(localStorage.getItem(cartKey)) || [];
    items.forEach(item => subtotal += item.price * item.quantity);
  }

  if (items.length === 0) {
    document.body.innerHTML = "<h2 class='text-center mt-10 text-red-500'>No items to checkout!</h2>";
    return;
  }

  // ✅ Render Summary
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

  // ✅ Place Order
  // checkout.js (Place Order Button Handler)
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
    productId: item.id || item.productId,  // ✅ Ensure productId is present
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
    const response = await fetch("http://localhost:5000/api/orders", {
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
