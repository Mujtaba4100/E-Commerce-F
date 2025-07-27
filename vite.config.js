import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'public/login.html'),
        cart: resolve(__dirname, 'public/cart.html'),
        register: resolve(__dirname, 'public/register.html'),
        order: resolve(__dirname, 'public/order.html'),
        admin: resolve(__dirname, 'public/admin.html'),
        checkout: resolve(__dirname, 'public/checkout.html'),
        product: resolve(__dirname, 'public/product.html'),
        products: resolve(__dirname, 'public/products.html')
      }
    }
  }
});
