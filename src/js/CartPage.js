import { Cart } from './Cart.js';

export class CartPage {
    constructor() {
        this.cart = new Cart();
        this.setupCartDisplay();
        this.setupEventListeners();
    }

    setupCartDisplay() {
        const items = this.cart.loadCart();
        const cartItemsContainer = document.getElementById('cartItems');
        
        if (items.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="text-center text-gray-500 py-8">
                    Your cart is empty
                </div>
            `;
            return;
        }

        cartItemsContainer.innerHTML = items.map(item => `
            <div class="flex items-center gap-4 py-4 border-b last:border-b-0" data-product-id="${item.id}" data-color="${item.selectedColor}">
                <img src="${item.image}" alt="${item.name}" class="w-24 h-24 object-cover rounded">
                <div class="flex-grow">
                    <h3 class="font-medium">${item.name}</h3>
                    <p class="text-sm text-gray-500">Color: ${item.selectedColor}</p>
                    <div class="flex items-center gap-4 mt-2">
                        <div class="flex items-center border rounded">
                            <button class="px-3 py-1 hover:bg-gray-100 decrease-quantity">-</button>
                            <span class="px-3 py-1 border-x quantity">${item.quantity}</span>
                            <button class="px-3 py-1 hover:bg-gray-100 increase-quantity">+</button>
                        </div>
                        <button class="text-red-500 hover:text-red-700 remove-item">
                            <i class="ri-delete-bin-line"></i>
                        </button>
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-medium">€${(item.price * item.quantity).toFixed(2)}</p>
                    ${item.quantity >= 5 ? `
                        <p class="text-xs text-green-600">10% bulk discount applied</p>
                    ` : ''}
                </div>
            </div>
        `).join('');

        this.updateOrderSummary();
    }

    updateOrderSummary() {
        const items = this.cart.loadCart();
        const subtotal = items.reduce((total, item) => {
            let price = item.price * item.quantity;
            if (item.quantity >= 5) {
                price *= 0.9; // 10% discount
            }
            return total + price;
        }, 0);

        const shipping = subtotal > 0 ? 10 : 0;
        const tax = subtotal * 0.20; // 20% VAT
        const total = subtotal + shipping + tax;

        document.getElementById('subtotal').textContent = `€${subtotal.toFixed(2)}`;
        document.getElementById('shipping').textContent = `€${shipping.toFixed(2)}`;
        document.getElementById('tax').textContent = `€${tax.toFixed(2)}`;
        document.getElementById('total').textContent = `€${total.toFixed(2)}`;

        // Update checkout button state
        const checkoutButton = document.getElementById('checkoutButton');
        if (items.length === 0) {
            checkoutButton.disabled = true;
            checkoutButton.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            checkoutButton.disabled = false;
            checkoutButton.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            const cartItem = e.target.closest('[data-product-id]');
            if (!cartItem) return;

            const productId = cartItem.dataset.productId;
            const color = cartItem.dataset.color;

            if (e.target.closest('.increase-quantity')) {
                const quantityElement = cartItem.querySelector('.quantity');
                const currentQuantity = parseInt(quantityElement.textContent);
                this.cart.updateQuantity(productId, color, currentQuantity + 1);
                this.setupCartDisplay();
            }
            else if (e.target.closest('.decrease-quantity')) {
                const quantityElement = cartItem.querySelector('.quantity');
                const currentQuantity = parseInt(quantityElement.textContent);
                if (currentQuantity > 1) {
                    this.cart.updateQuantity(productId, color, currentQuantity - 1);
                    this.setupCartDisplay();
                }
            }
            else if (e.target.closest('.remove-item')) {
                this.cart.removeItem(productId, color);
                this.setupCartDisplay();
            }
        });

        document.getElementById('checkoutButton').addEventListener('click', () => {
            // TODO: Implement checkout process
            alert('Checkout functionality coming soon!');
        });
    }
} 