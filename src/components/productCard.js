export function createProductCard(product) {
  return `
    <div class="product-card bg-white rounded-xl shadow-md hover:shadow-2xl transition transform hover:-translate-y-1 duration-300 border border-gray-200 cursor-pointer
                w-[85%] sm:w-[48%] md:w-[31%] lg:w-[23%] mx-auto">
      <div class="relative">
        <img src="${product.image}" alt="${product.name}" 
             class="w-full h-36 sm:h-44 md:h-52 lg:h-60 object-cover rounded-t-xl"/>
      </div>
      <div class="p-2 sm:p-3 md:p-4 space-y-2 sm:space-y-3">
        <h2 class="text-sm sm:text-base md:text-lg font-semibold text-gray-900 truncate">${product.name || "Unnamed Product"}</h2>
        <p class="text-xs sm:text-sm text-gray-500 line-clamp-2">${product.description || "No description available."}</p>
        <div class="flex justify-between text-[10px] sm:text-xs text-gray-400">
          <span>Brand: ${product.brand || "N/A"}</span>
          <span>${product.category || "Uncategorized"}</span>
        </div>
        <div class="flex items-center justify-between mt-1">
          <p class="text-base sm:text-lg md:text-xl font-bold text-green-600">Rs ${product.price || "N/A"}</p>
        </div>
        <!-- Vertical Buttons -->
        <div class="flex flex-col gap-2 mt-3">
          <button 
            class="add-to-cart w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition duration-200 shadow-md"
            data-id="${product._id}"
            data-name="${encodeURIComponent(product.name)}"
            data-price="${product.price}">
            🛒 Add to Cart
          </button>
          
          <button 
            class="buy-now w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition duration-200 shadow-md"
            data-id="${product._id}"
            data-name="${encodeURIComponent(product.name)}"
            data-price="${product.price}"
            data-image="${encodeURIComponent(product.image)}">
            ✅ Buy Now
          </button>
        </div>
      </div>
    </div>
  `;
}
