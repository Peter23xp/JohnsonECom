import { Cart } from '../../src/js/Cart.js';

export class ProductModal {
    constructor() {
        this.modal = null;
        this.selectedColor = null;
        this.createModal();
        console.log('ProductModal initialized');
    }

    createModal() {
        // Remove any existing modal
        const existingModal = document.getElementById('productModal');
        if (existingModal) {
            existingModal.remove();
        }

        const modalHTML = `
            <div id="productModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center">
                <div class="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-fade-in">
                    <div class="p-6">
                        <div class="flex justify-between items-start mb-6">
                            <h2 class="text-2xl font-display font-bold" id="modalProductName"></h2>
                            <button class="text-gray-400 hover:text-gray-600 transition-colors" id="closeModal">
                                <i class="ri-close-line text-2xl"></i>
                            </button>
                        </div>
                        <div class="grid md:grid-cols-2 gap-6">
                            <div>
                                <img id="modalProductImage" src="" alt="" class="w-full h-auto rounded-lg shadow-md">
                            </div>
                            <div class="animate-slide-in">
                                <div class="mb-4">
                                    <div class="flex items-baseline gap-2">
                                        <p class="text-2xl font-bold" id="modalProductPrice"></p>
                                        <p class="text-lg text-gray-500 line-through" id="modalProductOriginalPrice"></p>
                                    </div>
                                    <p class="text-gray-600 mt-2" id="modalProductDescription"></p>
                                </div>
                                <div class="mb-4">
                                    <h3 class="font-semibold mb-2">Couleurs disponibles</h3>
                                    <div class="flex flex-wrap gap-2" id="modalProductColors"></div>
                                </div>
                                <div class="mb-4">
                                    <h3 class="font-semibold mb-2">État du stock</h3>
                                    <div class="flex items-center gap-2">
                                        <p id="modalStockStatus" class="text-sm"></p>
                                        <div class="flex-grow">
                                            <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div id="modalStockBar" class="h-full bg-secondary transition-all duration-300"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-6">
                                    <h3 class="font-semibold mb-2">Remise en gros</h3>
                                    <div class="bg-green-50 border border-green-200 rounded p-3">
                                        <p class="text-sm text-green-800">
                                            <i class="ri-price-tag-3-line mr-1"></i>
                                            Achetez 5+ articles, obtenez 10% de réduction
                                        </p>
                                    </div>
                                </div>
                                <div class="flex items-center gap-4">
                                    <div class="flex items-center border rounded">
                                        <button class="px-3 py-1 hover:bg-gray-100 transition-colors" id="modalDecreaseQuantity">-</button>
                                        <span class="px-3 py-1 border-x min-w-[40px] text-center" id="modalQuantity">1</span>
                                        <button class="px-3 py-1 hover:bg-gray-100 transition-colors" id="modalIncreaseQuantity">+</button>
                                    </div>
                                    <button class="flex-grow bg-secondary text-white py-2 px-6 rounded-button hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2" id="modalAddToCart">
                                        <i class="ri-shopping-cart-line"></i>
                                        Ajouter au panier
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('productModal');
        this.setupEventListeners();
    }

    setupEventListeners() {
        const closeBtn = document.getElementById('closeModal');
        const decreaseBtn = document.getElementById('modalDecreaseQuantity');
        const increaseBtn = document.getElementById('modalIncreaseQuantity');
        const addToCartBtn = document.getElementById('modalAddToCart');

        closeBtn.addEventListener('click', () => this.hide());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.hide();
        });

        decreaseBtn.addEventListener('click', () => this.updateQuantity('decrease'));
        increaseBtn.addEventListener('click', () => this.updateQuantity('increase'));
        addToCartBtn.addEventListener('click', () => this.addToCart());

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
                this.hide();
            }
        });
    }

    updateQuantity(action) {
        const quantityElement = document.getElementById('modalQuantity');
        let quantity = parseInt(quantityElement.textContent);
        
        if (action === 'increase' && quantity < this.currentProduct.stock) {
            quantity++;
        } else if (action === 'decrease' && quantity > 1) {
            quantity--;
        }
        
        quantityElement.textContent = quantity;
        this.updateBulkDiscountInfo(quantity);
    }

    updateBulkDiscountInfo(quantity) {
        const price = this.currentProduct.price;
        const originalPrice = document.getElementById('modalProductOriginalPrice');
        const currentPrice = document.getElementById('modalProductPrice');

        if (quantity >= 5) {
            const discountedPrice = price * 0.9;
            currentPrice.textContent = `€${(discountedPrice * quantity).toFixed(2)}`;
            originalPrice.textContent = `€${(price * quantity).toFixed(2)}`;
            originalPrice.classList.remove('hidden');
        } else {
            currentPrice.textContent = `€${(price * quantity).toFixed(2)}`;
            originalPrice.textContent = '';
            originalPrice.classList.add('hidden');
        }
    }

    show(product) {
        console.log('Showing modal for product:', product);
        this.currentProduct = product;
        this.selectedColor = product.colors?.[0];

        document.getElementById('modalProductName').textContent = product.name;
        document.getElementById('modalProductPrice').textContent = `€${product.price.toFixed(2)}`;
        document.getElementById('modalProductDescription').textContent = product.description || 'Aucune description disponible';
        document.getElementById('modalProductImage').src = product.image;
        document.getElementById('modalProductImage').alt = product.name;

        // Reset quantity
        document.getElementById('modalQuantity').textContent = '1';
        this.updateBulkDiscountInfo(1);

        // Update stock status and progress bar
        const stockStatus = document.getElementById('modalStockStatus');
        const stockBar = document.getElementById('modalStockBar');
        const stockPercentage = (product.stock / 20) * 100; // Assuming max stock is 20

        if (product.stock > 10) {
            stockStatus.textContent = `En stock (${product.stock} disponibles)`;
            stockStatus.className = 'text-sm text-green-600';
            stockBar.className = 'h-full bg-green-500 transition-all duration-300';
        } else if (product.stock > 0) {
            stockStatus.textContent = `Stock faible (${product.stock} restants)`;
            stockStatus.className = 'text-sm text-orange-600';
            stockBar.className = 'h-full bg-orange-500 transition-all duration-300';
        } else {
            stockStatus.textContent = 'Rupture de stock';
            stockStatus.className = 'text-sm text-red-600';
            stockBar.className = 'h-full bg-red-500 transition-all duration-300';
        }
        stockBar.style.width = `${stockPercentage}%`;

        // Update colors
        const colorsContainer = document.getElementById('modalProductColors');
        colorsContainer.innerHTML = '';
        if (product.colors && product.colors.length > 0) {
            product.colors.forEach(color => {
                const colorSwatch = document.createElement('button');
                colorSwatch.className = `w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${color === this.selectedColor ? 'border-secondary' : 'border-gray-300'}`;
                colorSwatch.style.backgroundColor = color;
                colorSwatch.addEventListener('click', () => this.selectColor(color));
                colorsContainer.appendChild(colorSwatch);
            });
        } else {
            colorsContainer.innerHTML = '<p class="text-sm text-gray-500">Aucune option de couleur disponible</p>';
        }

        // Update add to cart button state
        const addToCartBtn = document.getElementById('modalAddToCart');
        if (product.stock === 0) {
            addToCartBtn.disabled = true;
            addToCartBtn.className = 'flex-grow bg-gray-400 text-white py-2 px-6 rounded-button cursor-not-allowed flex items-center justify-center gap-2';
        } else {
            addToCartBtn.disabled = false;
            addToCartBtn.className = 'flex-grow bg-secondary text-white py-2 px-6 rounded-button hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2';
        }

        this.modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    selectColor(color) {
        console.log('Selected color:', color);
        this.selectedColor = color;
        document.querySelectorAll('#modalProductColors button').forEach(btn => {
            btn.classList.toggle('border-secondary', btn.style.backgroundColor === color);
            btn.classList.toggle('border-gray-300', btn.style.backgroundColor !== color);
        });
    }

    hide() {
        this.modal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    addToCart() {
        const quantity = parseInt(document.getElementById('modalQuantity').textContent);
        const cart = new Cart();
        
        const productToAdd = {
            ...this.currentProduct,
            quantity: quantity,
            selectedColor: this.selectedColor
        };

        console.log('Adding product to cart:', productToAdd);
        cart.addItem(productToAdd);
        this.hide();
    }
} 