/**
 * Global JavaScript functions for Moses Shoes & Clothing
 * This file should be included in all pages
 */

// Global JavaScript for Moses Shoes & Clothing Line
// Using the vintage and nature-inspired color palette

// Color palette constants for JavaScript use
const COLOR_PALETTE = {
    softWhite: '#FAFAF0',
    lightGreen: '#E1E6C9',
    sageGreen: '#86997B',
    darkGray: '#3B3E3A',
    deepBlack: '#1D1C1C'
};

// Get cart items from localStorage or initialize empty array
let mosesCart = JSON.parse(localStorage.getItem('mosesCartItems')) || [];

// Update cart badge with number of items
function updateCartBadge() {
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) {
        const totalItems = mosesCart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.textContent = totalItems;
        cartBadge.classList.toggle('hidden', totalItems === 0);
    }
}

// Toast notification function
function showToast(message, type = 'success') {
    const toast = document.getElementById('toastNotification');
    if (!toast) return;
    
    // Set toast color based on type
    if (type === 'success') {
        toast.style.backgroundColor = COLOR_PALETTE.sageGreen;
    } else if (type === 'error') {
        toast.style.backgroundColor = '#e74c3c';
    } else if (type === 'info') {
        toast.style.backgroundColor = COLOR_PALETTE.darkGray;
    }
    
    // Set message
    toast.textContent = message;
    
    // Show toast
    toast.style.opacity = '1';
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
    }, 3000);
}

// Add item to cart
function addToCart(product) {
    // Get cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already exists in cart
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex !== -1) {
        // If product exists, increment quantity
        cart[existingProductIndex].quantity = (cart[existingProductIndex].quantity || 1) + 1;
    } else {
        // If product doesn't exist, add it with quantity 1
        product.quantity = 1;
        cart.push(product);
    }
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show toast notification
    showToast('Item added to cart!', 'success');
}

// Update cart count function
function updateCartCount() {
    const cartCountElement = document.getElementById('cartCount');
    if (!cartCountElement) return;
    
    // Get cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Calculate total quantity
    const totalQuantity = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    
    // Update cart count
    cartCountElement.textContent = totalQuantity;
    
    // Show/hide cart count
    if (totalQuantity > 0) {
        cartCountElement.classList.remove('hidden');
    } else {
        cartCountElement.classList.add('hidden');
    }
}

// Remove from cart function
function removeFromCart(productId) {
    // Get cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Remove product from cart
    cart = cart.filter(item => item.id !== productId);
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show toast notification
    showToast('Item removed from cart!', 'info');
    
    // Return updated cart
    return cart;
}

// Update product quantity in cart
function updateCartItemQuantity(productId, quantity) {
    // Get cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Find product in cart
    const productIndex = cart.findIndex(item => item.id === productId);
    
    if (productIndex !== -1) {
        // Update quantity
        cart[productIndex].quantity = quantity;
        
        // If quantity is 0, remove item
        if (quantity <= 0) {
            cart.splice(productIndex, 1);
        }
    }
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Return updated cart
    return cart;
}

// Initialize cart badge when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    updateCartBadge();
    
    // Add event listeners to all "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productData = JSON.parse(this.dataset.product || '{}');
            
            // Get selected size and color if available
            const sizeSelect = document.getElementById(`size-${productData.id}`);
            const colorSelect = document.getElementById(`color-${productData.id}`);
            
            if (sizeSelect) {
                productData.size = sizeSelect.value;
            }
            
            if (colorSelect) {
                productData.color = colorSelect.value;
            }
            
            // Validate product has required fields
            if (!productData.id || !productData.name || !productData.price) {
                showToast('Invalid product data', 'error');
                return;
            }
            
            // Add to cart
            addToCart(productData);
        });
    });

    // Update cart count on page load
    updateCartCount();
    
    // Apply Tailwind colors if not set yet
    if (typeof tailwind !== 'undefined' && tailwind.config) {
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: COLOR_PALETTE.deepBlack,
                        secondary: COLOR_PALETTE.sageGreen,
                        tertiary: COLOR_PALETTE.lightGreen,
                        neutral: COLOR_PALETTE.softWhite,
                        dark: COLOR_PALETTE.darkGray,
                    }
                }
            }
        };
    }
});

// Animation fade-in au chargement de la page
window.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('main') || document.body;
    main.classList.add('opacity-0', 'translate-y-4');
    setTimeout(() => {
        main.classList.add('transition-all', 'duration-700');
        main.classList.remove('opacity-0', 'translate-y-4');
    }, 50);

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }

    // Product Filter Functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');

            // Toggle active state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter products
            productCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (filter === 'all' || cardCategory === filter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // Search Functionality
    const searchBtn = document.getElementById('searchBtn');
    const searchModal = document.getElementById('searchModal');
    const searchCloseBtn = document.getElementById('searchCloseBtn');

    if (searchBtn && searchModal && searchCloseBtn) {
        searchBtn.addEventListener('click', () => {
            searchModal.classList.remove('hidden');
        });

        searchCloseBtn.addEventListener('click', () => {
            searchModal.classList.add('hidden');
        });
    }

    // Scroll Animations
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true
        });
    }
});

// Newsletter Signup
function handleNewsletterSignup(event) {
    event.preventDefault();
    const emailInput = document.getElementById('newsletterEmail');
    const email = emailInput.value.trim();

    if (!email || !isValidEmail(email)) {
        showToast('Veuillez entrer une adresse email valide', 'error');
        return;
    }

    // Simulate newsletter signup (replace with actual backend logic)
    showToast('Merci de vous être abonné à notre newsletter !', 'success');
    emailInput.value = '';
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Export functions if needed for module-based imports
export {
    addToCart,
    handleNewsletterSignup
};
