import { fetchProducts } from "../api/products.js";
import { addToCart } from "./cart.js";
import {initHeader} from '../components/header.js';

document.addEventListener("DOMContentLoaded", async () => {
  initHeader()
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  if (!productId) {
    document.body.innerHTML = "<h2 class='text-center mt-10 text-red-500'>Product not found</h2>";
    return;
  }

  try {
    const products = await fetchProducts();
    const product = products.find(p => p._id === productId);

    if (!product) {
      document.body.innerHTML = "<h2 class='text-center mt-10 text-red-500'>Product not found</h2>";
      return;
    }

    // ✅ Populate product details
    document.getElementById("product-image").src = product.image;
    document.getElementById("product-name").textContent = product.name;
    document.getElementById("product-category").textContent = `Category: ${product.category}`;
    document.getElementById("product-price").textContent = `Rs ${product.price}`;
    document.getElementById("product-stock").textContent = `Stock: ${product.countInStock}`;
    document.getElementById("product-description").textContent = product.description;

    // ✅ Add to Cart with quantity
    const addToCartBtn = document.getElementById("add-to-cart");
    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", () => {
        const quantityInput = document.getElementById("quantity");
        const quantity = quantityInput && parseInt(quantityInput.value) > 0 ? parseInt(quantityInput.value) : 1;

        addToCart({
          id: product._id,
          name: product.name,
          price: product.price,
          quantity
        });

        alert(`${quantity} x ${product.name} added to cart!`);
      });
    }

    // ✅ Related Products Section
    const related = products
      .filter(p => p.category === product.category && p._id !== product._id)
      .slice(0, 6);

    const container = document.getElementById("related-products");
    if (container) {
      container.innerHTML = related.map(p => `
        <div class="bg-white p-3 rounded shadow w-48 cursor-pointer hover:shadow-lg transition"
             data-id="${p._id}">
          <img src="${p.image}" alt="${p.name}" class="w-full h-32 object-cover rounded mb-2">
          <p class="text-sm font-semibold truncate">${p.name}</p>
          <p class="text-green-600 font-bold">Rs ${p.price}</p>
        </div>
      `).join("");

      // ✅ Click event for related products
      container.querySelectorAll("div[data-id]").forEach(div => {
        div.addEventListener("click", () => {
          const id = div.getAttribute("data-id");
          window.location.href = `/product.html?id=${id}`;
        });
      });
    }

  } catch (error) {
    console.error("Error loading product details:", error);
    document.body.innerHTML = "<h2 class='text-center mt-10 text-red-500'>Something went wrong</h2>";
  }
});
