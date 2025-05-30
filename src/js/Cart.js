// Get cart items from localStorage or initialize empty array
let cartItems = JSON.parse(localStorage.getItem('mosesCart')) || [];

// Cart state
let state = {
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0,
    promoCode: '',
    discount: 0
};

// Promo codes (in a real app, these would be validated against a backend)
const promoCodes = {
    'WELCOME10': 10,
    'MOSES20': 20,
    'SUMMER30': 30
};

// Initialize cart
function initializeCart() {
    updateCartItems();
    calculateTotals();
    setupEventListeners();
    updateCartBadge();
}

// Update cart items display
function updateCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = '';

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="text-center py-12">
                <p class="text-gray-600 mb-6">Votre Cart est vide</p>
                <a href="index.html" class="inline-block bg-secondary text-white px-8 py-3 rounded-button hover:bg-opacity-90 transition-colors">
                    Continuer vos achats
                </a>
            </div>
        `;
        return;
    }

    cartItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item bg-white rounded-lg overflow-hidden shadow-md flex items-center p-6';
        itemElement.innerHTML = `
            <div class="w-24 h-24 mr-6 overflow-hidden rounded-lg">
                <img src="/assets/images/products/Moses Shoes.3.jpg" alt="${item.name}" class="w-full h-full object-cover">
            </div>
            <div class="flex-grow">
                <h3 class="text-xl font-semibold mb-2">${item.name}</h3>
                <p class="text-gray-600 mb-2">Taille: ${item.size} | Couleur: ${item.color}</p>
                <div class="flex items-center">
                    <span class="text-xl font-bold text-secondary mr-4">${item.price} €</span>
                    <div class="flex items-center">
                        <button aria-label="Réduire la quantité" title="Réduire la quantité" class="quantity-btn w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center" onclick="updateQuantity('${item.id}', '${item.size}', '${item.color}', ${item.quantity - 1})">
                            <span class="sr-only">Réduire la quantité</span>
                            -
                        </button>
                        <span class="mx-4">${item.quantity}</span>
                        <button aria-label="Augmenter la quantité" title="Augmenter la quantité" class="quantity-btn w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center" onclick="updateQuantity('${item.id}', '${item.size}', '${item.color}', ${item.quantity + 1})">
                            <span class="sr-only">Augmenter la quantité</span>
                            +
                        </button>
                    </div>
                </div>
            </div>
            <button class="text-red-500 hover:text-red-700 delete-item" onclick="removeFromCart('${item.id}', '${item.size}', '${item.color}')" aria-label="Supprimer l'article" title="Supprimer l'article">
                <i class="ri-delete-bin-line ri-lg"></i>
            </button>
        `;
        cartItemsContainer.appendChild(itemElement);
    });
}

// Calculate totals
function calculateTotals() {
    state.subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    state.shipping = state.subtotal > 200 ? 0 : 15;
    state.tax = state.subtotal * 0.085;
    state.total = state.subtotal + state.shipping + state.tax - state.discount;

    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');

    if (subtotalElement) subtotalElement.textContent = `${state.subtotal.toFixed(2)} €`;
    if (shippingElement) shippingElement.textContent = state.shipping === 0 ? 'Gratuit' : `${state.shipping.toFixed(2)} €`;
    if (taxElement) taxElement.textContent = `${state.tax.toFixed(2)} €`;
    if (totalElement) totalElement.textContent = `${state.total.toFixed(2)} €`;
}

// Add to cart
function addToCart(product) {
    const existingProduct = cartItems.find(item => 
        item.id === product.id && 
        item.size === product.size && 
        item.color === product.color
    );

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cartItems.push({
            ...product,
            quantity: 1
        });
    }

    saveCartToLocalStorage();
    showNotification('Produit ajouté au Cart');
}

// Update quantity
function updateQuantity(productId, size, color, newQuantity) {
    if (newQuantity < 1) return;
    
    const product = cartItems.find(item => 
        item.id === productId && 
        item.size === size && 
        item.color === color
    );

    if (product) {
        product.quantity = newQuantity;
            saveCartToLocalStorage();
            updateCartItems();
            calculateTotals();
    }
}

// Remove from cart
function removeFromCart(productId, size, color) {
    cartItems = cartItems.filter(item => 
        item.id !== productId || 
        item.size !== size || 
        item.color !== color
    );
    saveCartToLocalStorage();
    updateCartItems();
    calculateTotals();
}

// Save cart to localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('mosesCart', JSON.stringify(cartItems));
    updateCartBadge();
}

// Update cart badge
function updateCartBadge() {
    const cartBadges = document.querySelectorAll('#cartBadge');
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    cartBadges.forEach(badge => {
        badge.textContent = totalItems;
        badge.classList.toggle('hidden', totalItems === 0);
    });
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-5 right-5 bg-secondary text-white px-6 py-3 rounded-button shadow-lg transform transition-all duration-300';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Setup event listeners
function setupEventListeners() {
    const promoForm = document.getElementById('promoForm');
    if (promoForm) {
        promoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const code = document.getElementById('promoCode').value.toUpperCase();
            applyPromoCode(code);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeCart);

// Export functions for global use
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;

// Apply promo code
function applyPromoCode(code) {
    const discount = promoCodes[code];
    if (discount) {
        state.promoCode = code;
        state.discount = (state.subtotal * discount) / 100;
        calculateTotals();
        
        const promoMessage = document.getElementById('promoMessage');
        promoMessage.textContent = `${discount}% discount applied!`;
        promoMessage.className = 'text-sm mt-2 text-accent';
        promoMessage.classList.remove('hidden');
    } else {
        const promoMessage = document.getElementById('promoMessage');
        promoMessage.textContent = 'Invalid promo code';
        promoMessage.className = 'text-sm mt-2 text-red-500';
        promoMessage.classList.remove('hidden');
    }
}

// Gestion du Cart avec localStorage
class CartManager {
    constructor() {
        this.cart = this.getCart();
    }

    // Récupérer le Cart depuis localStorage
    getCart() {
        const cart = localStorage.getItem('mosesCart');
        return cart ? JSON.parse(cart) : [];
    }

    // Sauvegarder le Cart dans localStorage
    saveCart() {
        localStorage.setItem('mosesCart', JSON.stringify(this.cart));
        this.updateCartCount();
    }

    // Add Product au Cart
    addToCart(product) {
        const existingProduct = this.cart.find(item => 
            item.id === product.id && 
            item.size === product.size && 
            item.color === product.color
        );

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            this.cart.push({
                ...product,
                quantity: 1
            });
        }

        this.saveCart();
        this.showNotification('Produit ajouté au Cart');
    }

    // Mettre à jour la quantité
    updateQuantity(productId, size, color, newQuantity) {
        const product = this.cart.find(item => 
            item.id === productId && 
            item.size === size && 
            item.color === color
        );

        if (product) {
            if (newQuantity > 0) {
                product.quantity = newQuantity;
            } else {
                this.cart = this.cart.filter(item => 
                    item.id !== productId || 
                    item.size !== size || 
                    item.color !== color
                );
            }
            this.saveCart();
            this.renderCart();
        }
    }

    // Supprimer un produit
    removeFromCart(productId, size, color) {
        this.cart = this.cart.filter(item => 
            item.id !== productId || 
            item.size !== size || 
            item.color !== color
        );
        this.saveCart();
        this.renderCart();
    }

    // Calculer le total
    calculateTotal() {
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shipping = subtotal > 200 ? 0 : 15;
        const tax = subtotal * 0.1;
        return {
            subtotal,
            shipping,
            tax,
            total: subtotal + shipping + tax
        };
    }

    // Mettre à jour le compteur du Cart
    updateCartCount() {
        const count = this.cart.reduce((total, item) => total + item.quantity, 0);
        const countElements = document.querySelectorAll('.cart-count');
        countElements.forEach(element => {
            element.textContent = count;
        });
    }

    // Afficher une notification
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-5 right-5 bg-secondary text-white px-6 py-3 rounded-button shadow-lg transform transition-all duration-300';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Rendre le Cart dans la page cart.html
    renderCart() {
        const cartContainer = document.getElementById('cartItems');
        if (!cartContainer) return;

        if (this.cart.length === 0) {
            cartContainer.innerHTML = `
                <div class="text-center py-12">
                    <p class="text-gray-600 mb-6">Votre Cart est vide</p>
                    <a href="index.html" class="inline-block bg-secondary text-white px-8 py-3 rounded-button hover:bg-opacity-90 transition-colors">
                        Continuer vos achats
                    </a>
                </div>
            `;
            return;
        }

        cartContainer.innerHTML = this.cart.map(item => `
            <div class="cart-item bg-white rounded-lg overflow-hidden shadow-md flex items-center p-6" data-id="${item.id}" data-size="${item.size}" data-color="${item.color}">
                <div class="w-24 h-24 mr-6 overflow-hidden rounded-lg">
                    <img src="/assets/images/products/Moses Shoes.3.jpg" alt="${item.name}" class="w-full h-full object-cover">
                </div>
                <div class="flex-grow">
                    <h3 class="text-xl font-semibold mb-2">${item.name}</h3>
                    <p class="text-gray-600 mb-2">Taille: ${item.size} | Couleur: ${item.color}</p>
                    <div class="flex items-center">
                        <span class="text-xl font-bold text-secondary mr-4">${item.price} €</span>
                        <div class="flex items-center">
                            <button aria-label="Réduire la quantité" title="Réduire la quantité" class="quantity-btn w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center" data-action="decrease">
                                <span class="sr-only">Réduire la quantité</span>
                                -
                            </button>
                            <span class="mx-4">${item.quantity}</span>
                            <button aria-label="Augmenter la quantité" title="Augmenter la quantité" class="quantity-btn w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center" data-action="increase">
                                <span class="sr-only">Augmenter la quantité</span>
                                +
                            </button>
                        </div>
                    </div>
                </div>
                <button class="text-red-500 hover:text-red-700 delete-item" aria-label="Supprimer l'article" title="Supprimer l'article">
                    <i class="ri-delete-bin-line ri-lg"></i>
                </button>
            </div>
        `).join('');

        // Mettre à jour le résumé
        const totals = this.calculateTotal();
        document.getElementById('subtotal').textContent = `${totals.subtotal.toFixed(2)} €`;
        document.getElementById('shipping').textContent = totals.shipping > 0 ? `${totals.shipping.toFixed(2)} €` : 'Gratuit';
        document.getElementById('tax').textContent = `${totals.tax.toFixed(2)} €`;
        document.getElementById('total').textContent = `${totals.total.toFixed(2)} €`;

        // Ajouter les écouteurs d'événements
        this.addCartEventListeners();
    }

    // Ajouter les écouteurs d'événements pour le Cart
    addCartEventListeners() {
        const quantityBtns = document.querySelectorAll('.quantity-btn');
        const deleteButtons = document.querySelectorAll('.delete-item');

        quantityBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const item = e.target.closest('.cart-item');
                const productId = item.dataset.id;
                const size = item.dataset.size;
                const color = item.dataset.color;
                const currentQuantity = parseInt(e.target.parentElement.querySelector('span:nth-child(2)').textContent);
                const action = e.target.dataset.action;

                const newQuantity = action === 'increase' ? currentQuantity + 1 : currentQuantity - 1;
                this.updateQuantity(productId, size, color, newQuantity);
            });
        });

        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const item = e.target.closest('.cart-item');
                const productId = item.dataset.id;
                const size = item.dataset.size;
                const color = item.dataset.color;
                this.removeFromCart(productId, size, color);
            });
        });
    }
}

// Initialiser le gestionnaire de Cart
const cartManager = new CartManager();

// Si nous sommes sur la page du Cart, afficher le contenu
if (window.location.pathname.includes('cart.html')) {
    cartManager.renderCart();
}

// Exporter le gestionnaire de Cart pour l'utiliser dans d'autres fichiers
window.cartManager = cartManager; 