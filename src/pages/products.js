import { fetchProducts } from "../api/products.js";

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const category = params.get("category");

  const title = document.getElementById("category-title");
  const container = document.getElementById("products-container");

  try {
    const products = await fetchProducts();
    const filtered = category ? products.filter(p => p.category === category) : products;

    title.textContent = category ? `${category} Products` : "All Products";

    if (filtered.length === 0) {
      container.innerHTML = `<p class="text-red-500">No products found.</p>`;
      return;
    }

    container.innerHTML = filtered.map(p => `
      <div class="bg-white p-3 rounded shadow hover:shadow-lg transition cursor-pointer"
           onclick="window.location.href='/product.html?id=${p._id}'">
        <img src="${p.image}" alt="${p.name}" class="w-full h-40 object-cover rounded mb-2">
        <p class="font-semibold truncate">${p.name}</p>
        <p class="text-green-600 font-bold">Rs ${p.price}</p>
      </div>
    `).join("");

  } catch (error) {
    console.error("Error loading products:", error);
    container.innerHTML = `<p class="text-red-500">Failed to load products.</p>`;
  }
});
