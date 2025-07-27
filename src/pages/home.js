
import { fetchProducts } from "../../dist/assets/api/products.js";
import { createProductCard } from "../../dist/assets/components/productCard.js";
import { addToCart } from "../../dist/assets/pages/cart.js";

let allProducts = []; // ✅ Store all products globally

document.addEventListener("DOMContentLoaded", () => {
  renderHomePage();
  setupGlobalEventDelegation(); // ✅ Attach single event listener for all buttons
});

async function renderHomePage() {
  try {
    const products = await fetchProducts();
    allProducts = products;

    renderFilterUI();
    renderDefaultLayout(products);
    renderHorizontalScroll(products);
    initFilters();
  } catch (error) {
    console.error("Failed to render home page:", error);
  }
}

// ✅ Render Filter Dropdown UI
function renderFilterUI() {
  const filterContainer = document.getElementById("filter-container");
  if (!filterContainer) return;

  filterContainer.innerHTML = `
    <div class="flex flex-wrap gap-3 justify-between items-center mb-6">
      <!-- Category Filter -->
      <select id="categoryFilter" class="border border-gray-300 rounded-lg px-3 py-2">
        <option value="all">All Categories</option>
        <option value="Phones">Phones</option>
        <option value="Laptops">Laptops</option>
        <option value="Watches">Watches</option>
        <option value="Shoes">Shoes</option>
        <option value="Books">Books</option>
        <option value="Clothing">Clothing</option>
      </select>

      <!-- Price Sort -->
      <select id="priceSort" class="border border-gray-300 rounded-lg px-3 py-2">
        <option value="">Sort by Price</option>
        <option value="low-high">Low to High</option>
        <option value="high-low">High to Low</option>
      </select>
    </div>
  `;
}

// ✅ Default layout (6 category sections)
function renderDefaultLayout(products) {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  const categories = ["Phones", "Laptops", "Watches", "Shoes", "Books", "Clothing"];
  let html = "";

  categories.forEach((category) => {
    const categoryProducts = products
      .filter((p) => p.category && p.category.toLowerCase() === category.toLowerCase())
      .slice(0, 4);

    html += `
      <div class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition duration-300 p-5 border border-gray-200">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-extrabold text-gray-800">${category}</h3>
        </div>
        <div class="grid grid-cols-2 gap-4">
          ${
            categoryProducts.length > 0
              ? categoryProducts.map(createMiniProductCard).join("")
              : `<p class="text-gray-500 text-center col-span-2">No products available</p>`
          }
        </div>
      </div>
    `;
  });

  grid.innerHTML = html;
}

// ✅ Filtered layout
function renderFilteredProducts(products) {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  if (products.length === 0) {
    grid.innerHTML = `<p class="text-gray-500 text-center col-span-2">No products found</p>`;
    return;
  }

  grid.innerHTML = `
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
      ${products.map(createMiniProductCard).join("")}
    </div>
  `;
}

// ✅ Initialize filter logic
function initFilters() {
  const categoryFilter = document.getElementById("categoryFilter");
  const priceSort = document.getElementById("priceSort");

  if (categoryFilter) categoryFilter.addEventListener("change", applyFilters);
  if (priceSort) priceSort.addEventListener("change", applyFilters);
}

// ✅ Apply filters
function applyFilters() {
  const category = document.getElementById("categoryFilter").value;
  const sortOrder = document.getElementById("priceSort").value;

  if (category === "all" && sortOrder === "") {
    renderDefaultLayout(allProducts);
    return;
  }

  let filtered = [...allProducts];

  if (category !== "all") {
    filtered = filtered.filter(
      (p) => p.category && p.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (sortOrder === "low-high") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "high-low") {
    filtered.sort((a, b) => b.price - a.price);
  }

  renderFilteredProducts(filtered);
}

// ✅ Mini Product Card
function createMiniProductCard(product) {
  return `
    <div class="border rounded-xl p-3 text-center bg-gray-50 hover:bg-white hover:shadow-lg transition duration-300 cursor-pointer group">
      <div class="relative mb-3">
        <img src="${product.image}" alt="${product.name}" 
             class="w-24 h-24 object-cover mx-auto rounded-lg transform group-hover:scale-105 transition duration-300">
      </div>
      <p class="text-sm font-semibold truncate mb-1 text-gray-800">${product.name}</p>
      <p class="text-green-600 text-sm font-bold mb-2">Rs ${product.price}</p>
      <button class="add-to-cart bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs rounded-lg font-medium transition duration-200"
              data-id="${product._id}"
              data-name="${encodeURIComponent(product.name)}"
              data-price="${product.price}">
        🛒 Add to Cart
      </button>
      <button class="buy-now bg-green-600 hover:bg-green-700 text-white px-3 py-1 mt-2 text-xs rounded-lg font-medium transition duration-200"
              data-id="${product._id}"
              data-name="${encodeURIComponent(product.name)}"
              data-price="${product.price}"
              data-image="${encodeURIComponent(product.image)}">
        ⚡ Buy Now
      </button>
    </div>
  `;
}

// ✅ Horizontal Scroll
function renderHorizontalScroll(products) {
  const scrollContainer = document.getElementById("scroll-products");
  if (!scrollContainer) return;

  scrollContainer.innerHTML = products
    .slice(0, 10)
    .map((p) => createProductCard(p))
    .join("");
}

// ✅ Event Delegation for All Buttons
function setupGlobalEventDelegation() {
  document.body.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-to-cart")) {
      e.preventDefault();
      const btn = e.target;
      const product = {
        id: btn.dataset.id,
        name: decodeURIComponent(btn.dataset.name),
        price: parseFloat(btn.dataset.price),
        quantity: 1,
      };
      addToCart(product);
      alert(`${product.name} added to cart!`);
    }

    if (e.target.classList.contains("buy-now")) {
      e.preventDefault();
      const btn = e.target;
      const id = btn.dataset.id;
      const name = btn.dataset.name;
      const price = btn.dataset.price;
      const image = btn.dataset.image;
      const qty = 1;

      window.location.href = `checkout.html?buyNow=true&id=${id}&name=${name}&price=${price}&image=${image}&qty=${qty}`;
    }
  });
}

export { renderHomePage };
