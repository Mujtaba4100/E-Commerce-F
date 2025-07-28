import { fetchProducts } from "../api/products.js";
import { createProductCard } from "../components/productCard.js";
import { addToCart } from "../pages/cart.js";

let allProducts = [];
const categories = [
  "Phones", "Laptops", "Watches", "Accessories",
  "Shoes", "Electronics", "Clothing", "Furniture",
  "Books", "Toys", "Beauty", "Groceries"
];

document.addEventListener("DOMContentLoaded", () => {
  renderHomePage();
  setupGlobalEventDelegation();
  initSearch();
  initPromoButtons();
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
      <select id="categoryFilter" class="border border-gray-300 rounded-lg px-3 py-2">
        <option value="all">All Categories</option>
        ${categories.map(c => `<option value="${c}">${c}</option>`).join("")}
      </select>
      <select id="priceSort" class="border border-gray-300 rounded-lg px-3 py-2">
        <option value="">Sort by Price</option>
        <option value="low-high">Low to High</option>
        <option value="high-low">High to Low</option>
      </select>
    </div>
  `;
}

// ✅ Default layout
function renderDefaultLayout(products) {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  let html = "";
  categories.forEach((category) => {
    const categoryProducts = products
      .filter((p) => p.category && p.category.toLowerCase() === category.toLowerCase())
      .slice(0, 4);

    html += `
      <div class="bg-white rounded-xl md:rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-3 sm:p-4 md:p-5 border border-gray-200">
        <div class="flex justify-between items-center mb-3 sm:mb-4">
          <h3 class="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-800">${category}</h3>
          <button class="shop-now text-blue-600 hover:underline font-semibold text-sm sm:text-base" data-category="${category}">
            Shop Now →
          </button>
        </div>
        <div class="grid grid-cols-2 gap-2 sm:gap-4">
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

// ✅ Filters
function initFilters() {
  const categoryFilter = document.getElementById("categoryFilter");
  const priceSort = document.getElementById("priceSort");

  if (categoryFilter) categoryFilter.addEventListener("change", applyFilters);
  if (priceSort) priceSort.addEventListener("change", applyFilters);
}

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
    <div class="mini-card border rounded-xl p-3 text-center bg-gray-50 hover:bg-white hover:shadow-lg transition duration-300 cursor-pointer group"
         data-id="${product._id}">
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

// ✅ Event Delegation (Fixed)
function setupGlobalEventDelegation() {
  document.body.addEventListener("click", (e) => {
    const card = e.target.closest(".mini-card, .product-card");
    const isAddToCart = e.target.closest(".add-to-cart");
    const isBuyNow = e.target.closest(".buy-now");
    const isShopNow = e.target.closest(".shop-now");

    // ✅ Logo click → Go to Home Page
    if (e.target.id === "siteLogo") {
      window.location.href = "index.html";
      return;
    }

    // ✅ Card click → Product details
    if (card && !isAddToCart && !isBuyNow) {
      const productId = card.dataset.id;
      if (productId) {
        window.location.href = `product.html?id=${productId}`;
      }
      return;
    }

    // ✅ Add to Cart
    if (isAddToCart) {
      e.preventDefault();
      const btn = isAddToCart;
      const product = {
        id: btn.dataset.id,
        name: decodeURIComponent(btn.dataset.name),
        price: parseFloat(btn.dataset.price),
        quantity: 1,
      };
      addToCart(product);
      alert(`${product.name} added to cart!`);
      return;
    }

    // ✅ Buy Now
    if (isBuyNow) {
      e.preventDefault();
      const btn = isBuyNow;
      const id = btn.dataset.id;
      const name = btn.dataset.name;
      const price = btn.dataset.price;
      const image = btn.dataset.image;
      const qty = 1;

      window.location.href = `checkout.html?buyNow=true&id=${id}&name=${name}&price=${price}&image=${image}&qty=${qty}`;
      return;
    }

    // ✅ Shop Now
    if (isShopNow) {
      const category = isShopNow.dataset.category;
      window.location.href = `products.html?category=${category}`;
    }
  });
}

// ✅ Search → Redirect with fuzzy match
function initSearch() {
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) return;

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const query = searchInput.value.trim().toLowerCase();
      if (!query) return;

      let bestMatch = null;
      let bestScore = Infinity;

      categories.forEach(category => {
        const score = levenshteinDistance(query, category.toLowerCase());
        if (score < bestScore) {
          bestScore = score;
          bestMatch = category;
        }
      });

      if (bestScore <= 2) {
        window.location.href = `products.html?category=${bestMatch}`;
      } else {
        alert("No matching category found!");
      }
    }
  });
}

// ✅ Levenshtein Distance
function levenshteinDistance(a, b) {
  const matrix = Array(a.length + 1).fill(null).map(() =>
    Array(b.length + 1).fill(null)
  );

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
}

// ✅ Promo Buttons
function initPromoButtons() {
  const shopNowBtn = document.getElementById("shopNowBtn");
  const specialDealBtn = document.getElementById("specialDealBtn");

  if (shopNowBtn) {
    shopNowBtn.addEventListener("click", () => {
      const category = shopNowBtn.dataset.category;
      window.location.href = `products.html?category=${category}`;
    });
  }

  if (specialDealBtn) {
    specialDealBtn.addEventListener("click", async () => {
      const category = specialDealBtn.dataset.category ? specialDealBtn.dataset.category.trim() : null;
      if (!category) {
        alert("Category not specified for this deal.");
        return;
      }

      const products = allProducts
        .filter(p => p.category && typeof p.category === "string" && p.category.toLowerCase() === category.toLowerCase())
        .slice(0, 2);

      if (products.length >= 2) {
        const url = `checkout.html?buyNow=true` +
          `&id1=${encodeURIComponent(products[0]._id)}` +
          `&name1=${encodeURIComponent(products[0].name)}` +
          `&price1=${products[0].price}` +
          `&image1=${encodeURIComponent(products[0].image)}&qty1=1` +
          `&id2=${encodeURIComponent(products[1]._id)}` +
          `&name2=${encodeURIComponent(products[1].name)}` +
          `&price2=${products[1].price}` +
          `&image2=${encodeURIComponent(products[1].image)}&qty2=1`;

        window.location.href = url;
      } else {
        alert("Not enough products for the deal!");
      }
    });
  }
}

export { renderHomePage };
