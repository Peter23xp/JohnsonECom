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
        toast.Style.backgroundColor = COLOR_PALETTE.sageGreen;
    } else if (type === 'error') {
        toast.Style.backgroundColor = '#e74c3c';
    } else if (type === 'info') {
        toast.Style.backgroundColor = COLOR_PALETTE.darkGray;
    }
    
    // Set message
    toast.textContent = message;
    
    // Show toast
    toast.Style.opacity = '1';
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.Style.opacity = '0';
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

// Animation fade-in au Loading de la page
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
            const filter = btn.getAttribute('data-filter') || btn.getAttribute('data-category') || btn.getAttribute('data-size') || '';
            const filterType = btn.hasAttribute('data-category') ? 'category' : 
                              btn.hasAttribute('data-size') ? 'size' : 
                              btn.hasAttribute('data-filter') ? 'filter' : 'other';

            // Toggle active state
            if (filterType === 'size') {
                btn.classList.toggle('active');
            } else {
                // For category/filter, deactivate other buttons of same type
                const similarButtons = document.querySelectorAll(`[data-${filterType}]`);
                similarButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            }

            // Apply filter
            applyFilters();
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

    // Initialize dropdown filters if they exist
    if (document.querySelector('[id$="FilterBtn"]')) {
        initializeDropdownFilters();
    }
    
    // Initialize price range slider if it exists
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    
    if (priceRange && priceValue) {
        priceRange.addEventListener('input', () => {
            const value = priceRange.value;
            priceValue.textContent = '€' + value;
        });
    }
    
    // Apply initial filters
    if (document.querySelectorAll('.filter-btn, .custom-checkbox, [data-color]').length > 0) {
        applyFilters();
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

// Function to apply all active filters
function applyFilters() {
    const activeCategories = getActiveFilters('category');
    const activeSizes = getActiveFilters('size');
    const activeColors = Array.from(document.querySelectorAll('.color-button.border-secondary, [data-color].ring-2'))
        .map(btn => btn.getAttribute('data-color'));
    
    const priceRange = document.getElementById('priceRange');
    const maxPrice = priceRange ? parseFloat(priceRange.value) : 10000;

    productCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category') || '';
        const cardSize = card.getAttribute('data-size') || '';
        const cardColor = card.getAttribute('data-color') || '';
        const cardPrice = parseFloat(card.getAttribute('data-price') || '0');

        const matchesCategory = activeCategories.length === 0 || 
                               activeCategories.includes('all') || 
                               activeCategories.includes(cardCategory);
        
        const matchesSize = activeSizes.length === 0 || 
                           activeSizes.some(size => cardSize.includes(size));
        
        const matchesColor = activeColors.length === 0 || 
                            activeColors.includes(cardColor);
        
        const matchesPrice = !maxPrice || cardPrice <= maxPrice;

        if (matchesCategory && matchesSize && matchesColor && matchesPrice) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });

    // Update count of visible products
    updateProductCount();
}

// Helper function to get active filters of a specific type
function getActiveFilters(type) {
    return Array.from(document.querySelectorAll(`.filter-btn[data-${type}].active`))
        .map(btn => btn.getAttribute(`data-${type}`));
}

// Update visible product count
function updateProductCount() {
    const visibleProducts = document.querySelectorAll('.product-card:not(.hidden)').length;
    const countElement = document.getElementById('productCount');
    if (countElement) {
        countElement.textContent = visibleProducts;
    }
}

// Initialize dropdown filters (for suits.html)
function initializeDropdownFilters() {
    const filterDropdownBtns = document.querySelectorAll('[id$="FilterBtn"]');
    
    filterDropdownBtns.forEach(btn => {
        const dropdownId = btn.id.replace('Btn', 'Dropdown');
        const dropdown = document.getElementById(dropdownId);
        
        if (dropdown) {
            btn.addEventListener('click', () => {
                // Close all other dropdowns
                document.querySelectorAll('.filter-dropdown.active').forEach(el => {
                    if (el.id !== dropdownId) {
                        el.classList.remove('active');
                    }
                });
                
                // Toggle current dropdown
                dropdown.classList.toggle('active');
            });
            
            // Apply button inside dropdown
            const applyBtn = dropdown.querySelector('button:last-child');
            if (applyBtn) {
                applyBtn.addEventListener('click', () => {
                    dropdown.classList.remove('active');
                    applyFilters();
                    updateActiveFiltersDisplay();
                });
            }
        }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('[id$="FilterBtn"]') && !e.target.closest('.filter-dropdown')) {
            document.querySelectorAll('.filter-dropdown.active').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
    
    // Clear all filters button
    const clearAllBtn = document.getElementById('clearAllFiltersBtn');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', () => {
            // Uncheck all checkboxes
            document.querySelectorAll('.custom-checkbox input').forEach(checkbox => {
                checkbox.checked = false;
            });
            
            // Reset radio buttons to "All"
            document.querySelectorAll('input[type="radio"][name="fit"]').forEach((radio, index) => {
                radio.checked = index === 0;
            });
            
            // Reset color buttons
            document.querySelectorAll('[data-color]').forEach(btn => {
                btn.classList.remove('ring-2', 'ring-secondary');
            });
            
            // Reset price range
            const priceRange = document.getElementById('priceRange');
            const priceValue = document.getElementById('priceValue');
            if (priceRange && priceValue) {
                priceRange.value = priceRange.max;
                priceValue.textContent = '€' + priceRange.max;
            }
            
            // Clear active filters display
            document.getElementById('activeFiltersContainer').querySelectorAll('.active-filter').forEach(el => {
                el.remove();
            });
            
            clearAllBtn.classList.add('hidden');
            
            // Apply cleared filters
            applyFilters();
        });
    }
}

// Update active filters display (for suits.html)
function updateActiveFiltersDisplay() {
    const container = document.getElementById('activeFiltersContainer');
    const clearAllBtn = document.getElementById('clearAllFiltersBtn');
    
    if (!container) return;
    
    // Remove existing filter tags
    container.querySelectorAll('.active-filter').forEach(el => el.remove());
    
    // Get all active filters
    const activeFilters = [];
    
    // Get checked checkboxes (except "All")
    document.querySelectorAll('.custom-checkbox input:checked').forEach(checkbox => {
        const label = checkbox.closest('label').textContent.trim();
        if (label !== 'All styles') {
            activeFilters.push({ type: 'Style', value: label });
        }
    });
    
    // Get selected fit
    document.querySelectorAll('input[type="radio"][name="fit"]:checked').forEach(radio => {
        const label = radio.closest('label').textContent.trim();
        if (label !== 'All fits') {
            activeFilters.push({ type: 'Fit', value: label });
        }
    });
    
    // Get selected colors
    document.querySelectorAll('[data-color].ring-2').forEach(btn => {
        activeFilters.push({ type: 'Color', value: btn.getAttribute('aria-label') });
    });
    
    // Get price range
    const priceRange = document.getElementById('priceRange');
    if (priceRange && priceRange.value < priceRange.max) {
        activeFilters.push({ type: 'Price', value: `Max €${priceRange.value}` });
    }
    
    // Create and append filter tags
    activeFilters.forEach(filter => {
        const filterTag = document.createElement('div');
        filterTag.className = 'active-filter flex items-center bg-tertiary px-3 py-1 rounded-full text-xs';
        filterTag.innerHTML = `
            <span class="font-medium mr-1">${filter.type}:</span>
            <span>${filter.value}</span>
            <button class="ml-2 text-secondary hover:text-primary">×</button>
        `;
        
        filterTag.querySelector('button').addEventListener('click', () => {
            // Remove this filter
            // Implementation depends on filter type
            filterTag.remove();
            applyFilters();
            updateActiveFiltersDisplay();
        });
        
        container.insertBefore(filterTag, clearAllBtn);
    });
    
    // Show/hide clear all button
    if (activeFilters.length > 0) {
        clearAllBtn.classList.remove('hidden');
    } else {
        clearAllBtn.classList.add('hidden');
    }
}

// Export functions if needed for module-based imports
export {
    addToCart,
    handleNewsletterSignup
};
