// src/components/header.js

 // ✅ make sure this path is correct
const categories = [
  "Phones", "Laptops", "Watches", "Accessories",
  "Shoes", "Electronics", "Clothing", "Furniture",
  "Books", "Toys", "Beauty", "Groceries"
];
export function initHeader() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const authButtons = document.getElementById("authButtons");
  const profileButtons = document.getElementById("profileButtons");

  if (authButtons && profileButtons) {
    authButtons.style.display = isLoggedIn ? "none" : "flex";
    profileButtons.style.display = isLoggedIn ? "flex" : "none";
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      location.reload();
    });
  }

  const cartBtn = document.getElementById("cart-btn");
  if (cartBtn) {
    cartBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "cart.html";
    });
  }

  const orderHistoryBtn = document.getElementById("orderHistoryBtn");
  if (orderHistoryBtn) {
    orderHistoryBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "order.html";
    });
  }

  const profileBtn = document.getElementById("profileBtn");
  if (profileBtn) {
    profileBtn.addEventListener("click", () => {
      alert("Profile clicked!");
    });
  }

  const logo = document.getElementById("siteLogo");
  if (logo) {
    logo.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  // ✅ initialize search
  initSearch();
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

      categories.forEach((category) => {
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
  const matrix = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[a.length][b.length];
}
