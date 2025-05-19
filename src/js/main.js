import { Cart } from './Cart.js';
import { Products } from './Products.js';
import { ProductModal } from '../../assets/js/productModal.js';

// Test Tailwind CSS
const testDiv = document.createElement('div');
testDiv.className = 'bg-red-500 w-4 h-4 fixed bottom-4 right-4';
document.body.appendChild(testDiv);
setTimeout(() => testDiv.remove(), 2000); // Remove after 2 seconds

// Initialize components
const cart = new Cart();
const products = new Products();

// Make cart instance globally available
window.cart = cart;

// Debug logging
console.log('E-commerce system initialized');

// Export instances for potential use in other modules
export { cart, products };

class App {
    constructor() {
        this.cart = new Cart();
        this.products = new Products();
        this.productModal = new ProductModal();
        
        // Initialize CartPage if we're on the cart page
        if (window.location.pathname.includes('cart.html')) {
            import('./CartPage.js').then(module => {
                this.cartPage = new module.CartPage();
            });
        }
        
        this.setupEventListeners();
        console.log('E-commerce system initialized on', window.location.pathname);
    }

    setupEventListeners() {
        // Setup "Add to Cart" buttons
        document.querySelectorAll('[data-add-to-cart], .add-to-cart, [class*="add-to-cart"]').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = button.closest('[data-product-id]')?.dataset.productId;
                if (productId) {
                    const product = this.products.getProduct(productId);
                    if (product) {
                        this.productModal.show(product);
                    }
                }
            });
        });

        // Setup "Quick View" buttons and product card clicks
        document.querySelectorAll('[data-quick-view], [data-product-id]').forEach(element => {
            element.addEventListener('click', (e) => {
                // Don't trigger if clicking a button or link
                if (!e.target.closest('button') && !e.target.closest('a')) {
                    e.preventDefault();
                    const productId = element.dataset.productId;
                    if (productId) {
                        const product = this.products.getProduct(productId);
                        if (product) {
                            this.productModal.show(product);
                        }
                    }
                }
            });
        });

        // Make cart instance globally available
        window.cart = this.cart;
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
}); 