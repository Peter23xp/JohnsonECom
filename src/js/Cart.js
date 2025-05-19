export class Cart {
    constructor() {
        this.items = this.loadCart();
        this.updateCartCount();
        this.setupCartDropdown();
        console.log('Cart initialized with', this.items.length, 'items');
    }

    loadCart() {
        const savedCart = localStorage.getItem('cart');
        console.log('Loading cart from localStorage:', savedCart);
        return savedCart ? JSON.parse(savedCart) : [];
    }

    addItem(product) {
        console.log('add-to-cart triggered', product);
        
        const existingItem = this.items.find(item => 
            item.id === product.id && item.selectedColor === product.selectedColor
        );
        
        if (existingItem) {
            existingItem.quantity += product.quantity || 1;
        } else {
            this.items.push({ 
                ...product, 
                quantity: product.quantity || 1,
                selectedColor: product.selectedColor || product.colors?.[0]
            });
        }
        
        this.saveCart();
        this.updateCartCount();
        this.updateCartDropdown();
        this.showNotification('Votre produit a été ajouté au panier ✅');
        this.animateCartIcon();
    }

    removeItem(productId, color) {
        console.log('Removing item:', productId, color);
        this.items = this.items.filter(item => 
            !(item.id === productId && item.selectedColor === color)
        );
        this.saveCart();
        this.updateCartCount();
        this.updateCartDropdown();
    }

    updateQuantity(productId, color, newQuantity) {
        const item = this.items.find(item => 
            item.id === productId && item.selectedColor === color
        );
        
        if (item) {
            item.quantity = Math.max(1, newQuantity);
            this.saveCart();
            this.updateCartCount();
            this.updateCartDropdown();
        }
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        console.log('Cart saved to localStorage:', this.items);
    }

    updateCartCount() {
        const count = this.items.reduce((total, item) => total + item.quantity, 0);
        document.querySelectorAll('.cart-count').forEach(element => {
            element.textContent = count;
            element.classList.add('animate-cart-bounce');
            setTimeout(() => element.classList.remove('animate-cart-bounce'), 500);
        });
    }

    calculateTotal() {
        return this.items.reduce((total, item) => {
            let price = item.price * item.quantity;
            // Apply bulk discount if quantity >= 5
            if (item.quantity >= 5) {
                price *= 0.9; // 10% discount
            }
            return total + price;
        }, 0);
    }

    setupCartDropdown() {
        // Create cart dropdown if it doesn't exist
        if (!document.querySelector('.cart-dropdown')) {
            const cartIcon = document.querySelector('.cart-icon') || document.querySelector('[class*="shopping"]');
            if (!cartIcon) return;

            const dropdown = document.createElement('div');
            dropdown.className = 'cart-dropdown hidden absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl z-50 transform opacity-0 transition-all duration-300';
            cartIcon.parentElement.appendChild(dropdown);

            cartIcon.addEventListener('click', (e) => {
                e.preventDefault();
                dropdown.classList.toggle('hidden');
                if (!dropdown.classList.contains('hidden')) {
                    setTimeout(() => {
                        dropdown.classList.add('opacity-100');
                        dropdown.classList.add('translate-y-0');
                    }, 50);
                } else {
                    dropdown.classList.remove('opacity-100');
                    dropdown.classList.remove('translate-y-0');
                }
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!cartIcon.contains(e.target) && !dropdown.contains(e.target)) {
                    dropdown.classList.add('hidden');
                    dropdown.classList.remove('opacity-100');
                    dropdown.classList.remove('translate-y-0');
                }
            });
        }

        this.updateCartDropdown();
    }

    updateCartDropdown() {
        const dropdown = document.querySelector('.cart-dropdown');
        if (!dropdown) return;

        if (this.items.length === 0) {
            dropdown.innerHTML = `
                <div class="p-4 text-center text-gray-500">
                    Votre panier est vide
                </div>
            `;
            return;
        }

        const total = this.calculateTotal();
        dropdown.innerHTML = `
            <div class="p-4">
                <div class="max-h-96 overflow-y-auto">
                    ${this.items.map(item => `
                        <div class="flex items-center gap-4 mb-4 pb-4 border-b">
                            <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
                            <div class="flex-grow">
                                <h4 class="font-medium">${item.name}</h4>
                                <p class="text-sm text-gray-500">
                                    ${item.selectedColor ? `Couleur: ${item.selectedColor}` : ''}
                                    Qté: ${item.quantity}
                                </p>
                                <p class="text-secondary font-medium">€${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                            <button class="text-red-500 hover:text-red-700" onclick="cart.removeItem('${item.id}', '${item.selectedColor}')">
                                <i class="ri-delete-bin-line"></i>
                            </button>
                        </div>
                    `).join('')}
                </div>
                <div class="border-t pt-4">
                    <div class="flex justify-between mb-4">
                        <span class="font-medium">Total:</span>
                        <span class="font-bold">€${total.toFixed(2)}</span>
                    </div>
                    <a href="cart.html" class="block w-full bg-secondary text-white text-center py-2 rounded-button hover:bg-opacity-90 transition-colors">
                        Voir le panier
                    </a>
                </div>
            </div>
        `;
    }

    showNotification(message) {
        // Remove any existing notifications
        document.querySelectorAll('.notification').forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-secondary text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-toast-in';
        notification.innerHTML = `
            <div class="flex items-center">
                <span>${message}</span>
                <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                    <i class="ri-close-line"></i>
                </button>
            </div>
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.remove('animate-toast-in');
            notification.classList.add('animate-toast-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    animateCartIcon() {
        const cartIcon = document.querySelector('.cart-icon') || document.querySelector('[class*="shopping"]');
        if (cartIcon) {
            cartIcon.classList.add('animate-cart-bounce');
            setTimeout(() => cartIcon.classList.remove('animate-cart-bounce'), 500);
        }
    }
} 