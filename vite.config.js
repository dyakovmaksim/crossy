import { defineConfig } from 'vite';
export default defineConfig({base:'./',build:{rollupOptions:{input:['index.html','catalog.html','product.html','favorites.html','cart.html','pages/page1.html','pages/page2.html','pages/page3.html']}}});
