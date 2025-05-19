const { defineConfig } = require('vite');

module.exports = defineConfig({
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: 'index.html',
        men: 'men.html',
        women: 'woman.html',
        suit: 'suit.html',
        cart: 'cart.html'
      }
    }
  }
}); 