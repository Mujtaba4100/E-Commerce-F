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
        login: resolve(__dirname, 'login.html'),
        cart: resolve(__dirname, 'cart.html'),
        register: resolve(__dirname, 'register.html'),
        order: resolve(__dirname, 'order.html'),
        admin: resolve(__dirname, 'admin.html'),
        checkout: resolve(__dirname, 'checkout.html'),
        product: resolve(__dirname, 'product.html'),
        products: resolve(__dirname, 'products.html')
      }
    }
  }
});
