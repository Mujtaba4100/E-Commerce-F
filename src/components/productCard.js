export function createProductCard(product) {
  return `
    <div class="product-card bg-white rounded-xl shadow-md hover:shadow-2xl transition transform hover:-translate-y-1 duration-300 border border-gray-200 cursor-pointer"
         data-id="${product._id}">
      <div class="relative">
        <img src="${product.image}" alt="${product.name}" class="w-full h-60 object-cover rounded-t-xl"/>
      </div>
      <div class="p-4 space-y-3">
        <h2 class="text-lg font-semibold text-gray-900 truncate">${product.name || "Unnamed Product"}</h2>
        <p class="text-sm text-gray-500 line-clamp-2">${product.description || "No description available."}</p>
        <div class="flex justify-between text-xs text-gray-400">
          <span>Brand: ${product.brand || "N/A"}</span>
          <span>${product.category || "Uncategorized"}</span>
        </div>
        <div class="flex items-center justify-between mt-2">
          <p class="text-xl font-bold text-green-600">Rs ${product.price || "N/A"}</p>
        </div>
        <!-- Buttons -->
        <div class="flex gap-2 mt-3">
          <button 
            class="add-to-cart flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
            data-id="${product._id}"
            data-name="${encodeURIComponent(product.name)}"
            data-price="${product.price}">
            🛒 Add
          </button>
          
          <button 
            class="buy-now flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition duration-200"
            data-id="${product._id}"
            data-name="${encodeURIComponent(product.name)}"
            data-price="${product.price}"
            data-image="${encodeURIComponent(product.image)}">
            Buy
          </button>
        </div>
      </div>
    </div>
  `;
}
