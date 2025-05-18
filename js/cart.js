/**
 * Moses Shoes & Clothing Line - Cart Functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart
    updateCartCount();
    
    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get product information from the parent product card
            const productCard = this.closest('.product-card');
            const productImage = productCard.querySelector('.product-image img').src;
            const productTitle = productCard.querySelector('.product-title').textContent;
            const productCategory = productCard.querySelector('.product-category').textContent;
            const productPrice = productCard.querySelector('.current-price').textContent;
            
            // Create product object
            const product = {
                id: Date.now().toString(), // Generate a unique ID
                image: productImage,
                title: productTitle,
                category: productCategory,
                price: productPrice,
                color: 'Default', // These would be updated in the Order form
                size: 'Default',
                quantity: 1
            };
            
            // Add to cart
            addToCart(product);
            
            // Show notification
            showNotification(`${productTitle} added to cart!`);
            
            // Update cart count
            updateCartCount();
        });
    });
    
    // Cart page functionality
    if (window.location.pathname.includes('cart.html')) {
        renderCartItems();
        
        // Add toggle demo mode button for testing
        addDemoModeToggle();
    }
});

// Add to cart function
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('mosesCart')) || [];
    
    // Check if product already exists in cart
    const existingProductIndex = cart.findIndex(item => item.title === product.title);
    
    if (existingProductIndex > -1) {
        // Update quantity instead of adding duplicate
        cart[existingProductIndex].quantity += 1;
    } else {
        // Add new item
        cart.push(product);
    }
    
    // Save to localStorage
    localStorage.setItem('mosesCart', JSON.stringify(cart));
}

// Update cart count in header
function updateCartCount() {
    const cartCounts = document.querySelectorAll('.cart-count');
    const cart = JSON.parse(localStorage.getItem('mosesCart')) || [];
    
    // Calculate total quantity
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Update all cart count elements
    cartCounts.forEach(count => {
        count.textContent = totalItems;
    });
}

// Render cart items on cart page
function renderCartItems() {
    const cart = JSON.parse(localStorage.getItem('mosesCart')) || [];
    const cartItems = document.querySelector('.cart-items');
    const cartSummary = document.querySelector('.cart-summary');
    const cartEmpty = document.querySelector('.cart-empty');
    const cartCountText = document.querySelector('.cart-count-text');
    
    // Check if cart is empty
    if (cart.length === 0) {
        cartItems.style.display = 'none';
        cartSummary.style.display = 'none';
        cartEmpty.style.display = 'block';
        cartCountText.textContent = '0 Items';
        return;
    }
    
    // Show cart items
    cartItems.style.display = 'block';
    cartSummary.style.display = 'block';
    cartEmpty.style.display = 'none';
    
    // Clear existing items
    cartItems.innerHTML = '';
    
    // Add items to cart
    cart.forEach(item => {
        const cartItem = document.createElement('li');
        cartItem.classList.add('cart-item');
        cartItem.setAttribute('data-id', item.id);
        
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="cart-item-details">
                <h3 class="cart-item-title">${item.title}</h3>
                <div class="cart-item-category">${item.category}</div>
                <div class="cart-item-options">
                    <span class="cart-item-option">Color: ${item.color}</span>
                    <span class="cart-item-option">Size: ${item.size}</span>
                </div>
                <div class="cart-item-price">${item.price}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="20">
                    <button class="quantity-btn increase">+</button>
                </div>
            </div>
            <button class="cart-item-remove">
                <i class="ri-delete-bin-line"></i>
            </button>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    // Update cart count text
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountText.textContent = totalItems === 1 ? '1 Item' : `${totalItems} Items`;
    
    // Update cart summary
    updateCartSummary();
    
    // Add event listeners to quantity buttons
    setupCartEvents();
}

// Update cart summary calculations
function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem('mosesCart')) || [];
    const subtotalElement = document.querySelector('.summary-row:first-child span:last-child');
    const totalElement = document.querySelector('.summary-row.total span:last-child');
    
    // Calculate subtotal
    const subtotal = cart.reduce((total, item) => {
        const price = parseFloat(item.price.replace('$', ''));
        return total + (price * item.quantity);
    }, 0);
    
    // Fixed shipping cost
    const shipping = 10.00;
    
    // Total
    const total = subtotal + shipping;
    
    // Update DOM
    if (subtotalElement) {
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    }
    
    if (totalElement) {
        totalElement.textContent = `$${total.toFixed(2)}`;
    }
}

// Setup cart event listeners
function setupCartEvents() {
    // Quantity buttons
    const decreaseButtons = document.querySelectorAll('.quantity-btn.decrease');
    const increaseButtons = document.querySelectorAll('.quantity-btn.increase');
    const quantityInputs = document.querySelectorAll('.quantity-input');
    const removeButtons = document.querySelectorAll('.cart-item-remove');
    
    // Decrease quantity
    decreaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.nextElementSibling;
            const cartItem = this.closest('.cart-item');
            const itemId = cartItem.getAttribute('data-id');
            let value = parseInt(input.value);
            
            if (value > 1) {
                input.value = value - 1;
                updateCartItemQuantity(itemId, value - 1);
            }
        });
    });
    
    // Increase quantity
    increaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const cartItem = this.closest('.cart-item');
            const itemId = cartItem.getAttribute('data-id');
            let value = parseInt(input.value);
            
            if (value < 20) {
                input.value = value + 1;
                updateCartItemQuantity(itemId, value + 1);
            }
        });
    });
    
    // Quantity input change
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            const cartItem = this.closest('.cart-item');
            const itemId = cartItem.getAttribute('data-id');
            let value = parseInt(this.value);
            
            // Validate input
            if (value < 1) {
                value = 1;
                this.value = 1;
            } else if (value > 20) {
                value = 20;
                this.value = 20;
            }
            
            updateCartItemQuantity(itemId, value);
        });
    });
    
    // Remove items
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const cartItem = this.closest('.cart-item');
            const itemId = cartItem.getAttribute('data-id');
            
            removeCartItem(itemId);
            cartItem.remove();
            
            // Check if cart is now empty
            if (document.querySelectorAll('.cart-item').length === 0) {
                document.querySelector('.cart-items').style.display = 'none';
                document.querySelector('.cart-summary').style.display = 'none';
                document.querySelector('.cart-empty').style.display = 'block';
                document.querySelector('.cart-count-text').textContent = '0 Items';
            }
            
            // Update cart count
            updateCartCount();
        });
    });
}

// Update quantity in localStorage
function updateCartItemQuantity(itemId, quantity) {
    let cart = JSON.parse(localStorage.getItem('mosesCart')) || [];
    
    // Find the item
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex > -1) {
        // Update quantity
        cart[itemIndex].quantity = quantity;
        
        // Save to localStorage
        localStorage.setItem('mosesCart', JSON.stringify(cart));
        
        // Update cart summary and count
        updateCartSummary();
        updateCartCount();
    }
}

// Remove item from cart
function removeCartItem(itemId) {
    let cart = JSON.parse(localStorage.getItem('mosesCart')) || [];
    
    // Filter out the removed item
    cart = cart.filter(item => item.id !== itemId);
    
    // Save to localStorage
    localStorage.setItem('mosesCart', JSON.stringify(cart));
    
    // Update cart summary
    updateCartSummary();
}

// Show notification
function showNotification(message) {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.classList.add('notification');
        document.body.appendChild(notification);
        
        // Add style
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background-color: var(--secondary);
                color: var(--primary);
                padding: 12px 20px;
                border-radius: var(--radius-md);
                box-shadow: 0 4px 12px var(--shadow);
                z-index: 1000;
                transform: translateY(100px);
                opacity: 0;
                transition: all 0.3s ease;
            }
            
            .notification.show {
                transform: translateY(0);
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Set message
    notification.textContent = message;
    
    // Show notification
    notification.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Clean cart button for testing
function addCleanCartButton() {
    const button = document.createElement('button');
    button.textContent = 'Clean Cart';
    button.style.position = 'fixed';
    button.style.bottom = '10px';
    button.style.left = '10px';
    button.style.zIndex = '1000';
    button.style.padding = '8px 12px';
    button.style.backgroundColor = 'var(--error)';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = 'var(--radius-md)';
    button.style.cursor = 'pointer';
    
    button.addEventListener('click', function() {
        localStorage.removeItem('mosesCart');
        updateCartCount();
        
        if (window.location.pathname.includes('cart.html')) {
            document.querySelector('.cart-items').style.display = 'none';
            document.querySelector('.cart-summary').style.display = 'none';
            document.querySelector('.cart-empty').style.display = 'block';
            document.querySelector('.cart-count-text').textContent = '0 Items';
        }
        
        showNotification('Cart cleared!');
    });
    
    document.body.appendChild(button);
}

// Add demo mode toggle for testing
function addDemoModeToggle() {
    const demoButton = document.createElement('button');
    demoButton.textContent = 'Demo Mode: Show Sample Products';
    demoButton.style.position = 'fixed';
    demoButton.style.bottom = '10px';
    demoButton.style.right = '10px';
    demoButton.style.zIndex = '1000';
    demoButton.style.padding = '8px 12px';
    demoButton.style.backgroundColor = 'var(--secondary)';
    demoButton.style.color = 'var(--primary)';
    demoButton.style.border = 'none';
    demoButton.style.borderRadius = 'var(--radius-md)';
    demoButton.style.cursor = 'pointer';
    
    demoButton.addEventListener('click', function() {
        // Clear existing cart
        localStorage.removeItem('mosesCart');
        
        // Add sample products
        const demoProducts = [
            {
                id: '1',
                image: '../assets/images/products/Moses Coat.1.jpg',
                title: 'Premium Business Suit',
                category: 'Men\'s Suits',
                price: '$189.99',
                color: 'Black',
                size: '48',
                quantity: 1
            },
            {
                id: '2',
                image: '../assets/images/products/Moses Shoes.3.jpg',
                title: 'Premium Leather Oxford',
                category: 'Men\'s Shoes',
                price: '$149.99',
                color: 'Brown',
                size: '44',
                quantity: 2
            }
        ];
        
        // Save demo products to localStorage
        localStorage.setItem('mosesCart', JSON.stringify(demoProducts));
        
        // Refresh cart display
        renderCartItems();
        updateCartCount();
        
        showNotification('Demo products added to cart!');
    });
    
    document.body.appendChild(demoButton);
    
    // Add clean cart button
    addCleanCartButton();
} 