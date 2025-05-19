import { ProductModal } from '../../assets/js/productModal.js';

export class Products {
    constructor() {
        this.products = new Map();
        this.initializeFromDOM();
        this.setupEventListeners();
        console.log('Products initialized:', this.products.size, 'products found');
    }

    initializeFromDOM() {
        // Find all product cards in the DOM
        document.querySelectorAll('[data-product-id]').forEach(card => {
            const id = card.dataset.productId;
            const name = card.querySelector('[data-product-name]')?.textContent || card.querySelector('h3')?.textContent;
            const priceElement = card.querySelector('[data-product-price]') || card.querySelector('.font-bold');
            const price = parseFloat(priceElement?.textContent.replace('€', '').replace(',', '.') || '0');
            const image = (card.querySelector('[data-product-image]') || card.querySelector('img'))?.src;
            const description = card.dataset.description || 'No description available';
            const stock = parseInt(card.dataset.stock || '10');
            const colors = card.dataset.colors?.split(',').map(color => color.trim()) || [];

            if (id && name && price && image) {
                console.log('Initializing product:', { id, name, price });
                
                this.products.set(id, {
                    id,
                    name,
                    price,
                    image,
                    description,
                    stock,
                    colors
                });

                // Add data attributes for quick view
                card.setAttribute('data-quick-view', '');
                
                // Add hover effect classes
                card.classList.add('transition-transform', 'hover:-translate-y-1', 'duration-300');
            }
        });
    }

    setupEventListeners() {
        // Quick view on product card click (excluding buttons)
        document.querySelectorAll('[data-quick-view]').forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't trigger if clicking a button or link
                if (!e.target.closest('button') && !e.target.closest('a')) {
                    e.preventDefault();
                    const productId = card.dataset.productId;
                    const product = this.getProduct(productId);
                    if (product) {
                        console.log('Opening quick view for product:', productId);
                        const modal = new ProductModal();
                        modal.show(product);
                    }
                }
            });
        });

        // Add to cart button click
        document.querySelectorAll('.add-to-cart, [class*="add-to-cart"]').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const productId = button.closest('[data-product-id]')?.dataset.productId;
                if (productId) {
                    const product = this.getProduct(productId);
                    if (product) {
                        console.log('Opening modal for add to cart:', productId);
                        const modal = new ProductModal();
                        modal.show(product);
                    }
                }
            });
        });
    }

    getProduct(id) {
        return this.products.get(id);
    }

    getAllProducts() {
        return Array.from(this.products.values());
    }

    getProductsByCategory(category) {
        return Array.from(this.products.values()).filter(product => 
            product.category === category
        );
    }

    getProductsByPriceRange(min, max) {
        return Array.from(this.products.values()).filter(product => 
            product.price >= min && product.price <= max
        );
    }

    getProductsByColor(color) {
        return Array.from(this.products.values()).filter(product => 
            product.colors.includes(color)
        );
    }
} 