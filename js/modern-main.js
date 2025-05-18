/**
 * Moses Shoes & Clothing - Main JavaScript
 * Modern E-commerce Interactions 2025
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeProductGrid();
    initializeHeroSlider();
    handleDarkMode();
    initializeScrollAnimations();
    initializeCart();
});

/**
 * Navigation handling - Sticky header, mobile menu
 */
function initializeNavigation() {
    const header = document.querySelector('.header');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navClose = document.querySelector('.nav-close');
    
    // Sticky header on scroll
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        });
    }

    // Mobile menu toggle
    if (mobileToggle && navMenu && navClose) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.add('active');
        });
        
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                !mobileToggle.contains(e.target)) {
                navMenu.classList.remove('active');
            }
        });
    }
    
    // Active link highlight
    const navLinks = document.querySelectorAll('.nav-link');
    const currentUrl = window.location.href;
    
    navLinks.forEach(link => {
        if (currentUrl.includes(link.getAttribute('href'))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Product grid features - Lazy loading, hover effects
 */
function initializeProductGrid() {
    const productImages = document.querySelectorAll('.product-image img');
    const productCards = document.querySelectorAll('.product-card');
    
    // Image lazy loading
    if ('loading' in HTMLImageElement.prototype) {
        productImages.forEach(img => {
            img.loading = 'lazy';
        });
    } else {
        // Fallback for browsers that don't support native lazy loading
        const lazyLoadScript = document.createElement('script');
        lazyLoadScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(lazyLoadScript);
        
        productImages.forEach(img => {
            img.classList.add('lazyload');
            img.setAttribute('data-src', img.getAttribute('src'));
            img.setAttribute('src', '');
        });
    }
    
    // Product card interactions
    productCards.forEach(card => {
        // Add click handler to make entire card clickable
        card.addEventListener('click', (e) => {
            if (!e.target.closest('a') && !e.target.closest('button')) {
                const link = card.querySelector('.product-footer a');
                if (link) link.click();
            }
        });
    });
    
    // Quick view functionality for product cards
    const quickViewButtons = document.querySelectorAll('.product-action-btn:nth-child(2)');
    quickViewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const productCard = button.closest('.product-card');
            const productImage = productCard.querySelector('.product-image img').getAttribute('src');
            const productTitle = productCard.querySelector('.product-title').textContent;
            const productPrice = productCard.querySelector('.current-price').textContent;
            
            openQuickViewModal(productImage, productTitle, productPrice);
        });
    });
}

/**
 * Create and open a quick view modal for products
 */
function openQuickViewModal(image, title, price) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.quick-view-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    
    // Modal content
    modal.innerHTML = `
        <div class="quick-view-overlay"></div>
        <div class="quick-view-content">
            <button class="quick-view-close"><i class="ri-close-line"></i></button>
            <div class="quick-view-image">
                <img src="${image}" alt="${title}">
            </div>
            <div class="quick-view-info">
                <h3>${title}</h3>
                <div class="quick-view-price">${price}</div>
                <p class="quick-view-desc">Premium quality product from Moses Shoes & Clothing Line. Made with high-quality materials for durability and comfort.</p>
                <div class="quick-view-colors">
                    <span class="color-option" style="background-color: #000"></span>
                    <span class="color-option" style="background-color: #0e2459"></span>
                    <span class="color-option" style="background-color: #3a3a3a"></span>
                    <span class="color-option" style="background-color: #fff; border: 1px solid #e1e1e1"></span>
                </div>
                <div class="quick-view-actions">
                    <button class="btn btn-secondary">View Details</button>
                    <button class="btn btn-primary">Add to Cart</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Show modal with animation
    setTimeout(() => {
        modal.classList.add('open');
    }, 10);
    
    // Add event listeners
    const closeBtn = modal.querySelector('.quick-view-close');
    const overlay = modal.querySelector('.quick-view-overlay');
    
    const closeModal = () => {
        modal.classList.remove('open');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    };
    
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
}

/**
 * Hero section slider initialization
 */
function initializeHeroSlider() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;
    
    // Add dynamic background effect
    const createParallaxEffect = () => {
        const scrollTop = window.scrollY;
        heroSection.style.backgroundPositionY = `${scrollTop * 0.5}px`;
    };
    
    window.addEventListener('scroll', createParallaxEffect);
}

/**
 * Dark mode toggle and detection
 */
function handleDarkMode() {
    // Check if user prefers dark mode
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Add dark mode toggle to the footer
    const footer = document.querySelector('.footer-socials');
    if (footer) {
        const darkModeToggle = document.createElement('a');
        darkModeToggle.className = 'social-icon dark-mode-toggle';
        darkModeToggle.setAttribute('aria-label', 'Toggle dark mode');
        darkModeToggle.innerHTML = '<i class="ri-moon-line"></i>';
        footer.appendChild(darkModeToggle);
        
        // Apply dark mode based on user preference
        if (prefersDarkMode) {
            document.body.classList.add('dark-mode');
            darkModeToggle.innerHTML = '<i class="ri-sun-line"></i>';
        }
        
        // Toggle dark mode on click
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            
            if (document.body.classList.contains('dark-mode')) {
                darkModeToggle.innerHTML = '<i class="ri-sun-line"></i>';
                localStorage.setItem('moses-dark-mode', 'true');
            } else {
                darkModeToggle.innerHTML = '<i class="ri-moon-line"></i>';
                localStorage.setItem('moses-dark-mode', 'false');
            }
        });
        
        // Check localStorage for saved preference
        const savedMode = localStorage.getItem('moses-dark-mode');
        if (savedMode === 'true') {
            document.body.classList.add('dark-mode');
            darkModeToggle.innerHTML = '<i class="ri-sun-line"></i>';
        } else if (savedMode === 'false') {
            document.body.classList.remove('dark-mode');
        }
    }
}

/**
 * Scroll animations using Intersection Observer
 */
function initializeScrollAnimations() {
    const elements = document.querySelectorAll('.product-card, .feature-card, .about-content, .about-image, .newsletter-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(el => {
        observer.observe(el);
        el.classList.add('animate-on-scroll');
    });
    
    // Add animation classes to CSS
    const style = document.createElement('style');
    style.textContent = `
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .animate-on-scroll.animated {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
}

/**
 * Shopping cart functionality
 */
function initializeCart() {
    const cartIcon = document.querySelector('.nav-icon .ri-shopping-bag-line');
    const cartCount = document.querySelector('.cart-count');
    const btnFloat = document.querySelector('.btn-float');
    
    if (!cartIcon || !cartCount) return;
    
    // Create cart dialog
    const cartDialog = document.createElement('div');
    cartDialog.className = 'cart-dialog';
    cartDialog.innerHTML = `
        <div class="cart-overlay"></div>
        <div class="cart-content">
            <div class="cart-header">
                <h3>Your Shopping Cart</h3>
                <button class="cart-close"><i class="ri-close-line"></i></button>
            </div>
            <div class="cart-items">
                <div class="empty-cart">
                    <i class="ri-shopping-cart-line"></i>
                    <p>Your cart is empty</p>
                    <a href="home.html#products" class="btn btn-primary">Shop Now</a>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(cartDialog);
    
    // Toggle cart dialog
    const toggleCart = () => {
        cartDialog.classList.toggle('open');
        if (cartDialog.classList.contains('open')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    };
    
    cartIcon.parentElement.addEventListener('click', (e) => {
        e.preventDefault();
        toggleCart();
    });
    
    if (btnFloat) {
        btnFloat.addEventListener('click', (e) => {
            e.preventDefault();
            toggleCart();
        });
    }
    
    // Close cart
    const cartClose = cartDialog.querySelector('.cart-close');
    const cartOverlay = cartDialog.querySelector('.cart-overlay');
    
    cartClose.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);
    
    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            const productCard = button.closest('.product-card');
            const productName = productCard.querySelector('.product-title').textContent;
            
            // Create toast message
            const toast = document.createElement('div');
            toast.className = 'toast-message';
            toast.innerHTML = `
                <div class="toast-content">
                    <i class="ri-check-line"></i>
                    <span>${productName} added to cart!</span>
                </div>
            `;
            
            document.body.appendChild(toast);
            
            // Show toast with animation
            setTimeout(() => {
                toast.classList.add('show');
            }, 10);
            
            // Hide toast after 3 seconds
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    toast.remove();
                }, 300);
            }, 3000);
            
            // Update cart count
            const currentCount = parseInt(cartCount.textContent) || 0;
            cartCount.textContent = currentCount + 1;
            cartCount.classList.add('bounce');
            
            setTimeout(() => {
                cartCount.classList.remove('bounce');
            }, 300);
            
            // Store cart data in localStorage
            updateCartStorage(productCard);
        });
    });
}

/**
 * Update cart data in localStorage
 */
function updateCartStorage(productCard) {
    const productId = Date.now(); // Generate unique ID
    const productName = productCard.querySelector('.product-title').textContent;
    const productPrice = productCard.querySelector('.current-price').textContent;
    const productImage = productCard.querySelector('.product-image img').getAttribute('src');
    
    const cartItem = {
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: 1
    };
    
    let cart = JSON.parse(localStorage.getItem('moses-cart')) || [];
    cart.push(cartItem);
    
    localStorage.setItem('moses-cart', JSON.stringify(cart));
}

// Add CSS for dynamic components
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        /* Quick View Modal */
        .quick-view-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .quick-view-modal.open {
            opacity: 1;
            visibility: visible;
        }
        
        .quick-view-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(3px);
        }
        
        .quick-view-content {
            position: relative;
            width: 90%;
            max-width: 900px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            background-color: var(--background);
            border-radius: 12px;
            padding: 2rem;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
            transform: translateY(20px);
            transition: transform 0.3s ease;
            max-height: 90vh;
            overflow-y: auto;
        }
        
        .quick-view-modal.open .quick-view-content {
            transform: translateY(0);
        }
        
        .quick-view-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: var(--background);
            border: none;
            color: var(--primary);
            font-size: 1.25rem;
            cursor: pointer;
            z-index: 10;
            box-shadow: 0 2px 10px var(--shadow);
        }
        
        .quick-view-image img {
            width: 100%;
            height: auto;
            border-radius: 8px;
            object-fit: cover;
        }
        
        .quick-view-info {
            display: flex;
            flex-direction: column;
        }
        
        .quick-view-info h3 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
        }
        
        .quick-view-price {
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--secondary);
            margin-bottom: 1.5rem;
        }
        
        .quick-view-desc {
            margin-bottom: 1.5rem;
            color: var(--text-light);
            line-height: 1.7;
        }
        
        .quick-view-colors {
            display: flex;
            gap: 0.75rem;
            margin-bottom: 2rem;
        }
        
        .color-option {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
        }
        
        .quick-view-actions {
            display: flex;
            gap: 1rem;
            margin-top: auto;
        }
        
        @media (max-width: 768px) {
            .quick-view-content {
                grid-template-columns: 1fr;
                gap: 1.5rem;
                padding: 1.5rem;
                overflow-y: auto;
            }
        }
        
        /* Cart Dialog */
        .cart-dialog {
            position: fixed;
            top: 0;
            right: 0;
            width: 100%;
            height: 100%;
            z-index: 1000;
            visibility: hidden;
        }
        
        .cart-dialog.open {
            visibility: visible;
        }
        
        .cart-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .cart-dialog.open .cart-overlay {
            opacity: 1;
        }
        
        .cart-content {
            position: absolute;
            top: 0;
            right: -400px;
            width: 100%;
            max-width: 400px;
            height: 100%;
            background-color: var(--background);
            box-shadow: -5px 0 15px var(--shadow);
            transition: right 0.3s ease;
            display: flex;
            flex-direction: column;
        }
        
        .cart-dialog.open .cart-content {
            right: 0;
        }
        
        .cart-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1.5rem;
            border-bottom: 1px solid var(--border);
        }
        
        .cart-header h3 {
            margin: 0;
            font-size: 1.25rem;
        }
        
        .cart-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            color: var(--primary);
            cursor: pointer;
        }
        
        .cart-items {
            flex: 1;
            overflow-y: auto;
            padding: 1.5rem;
        }
        
        .empty-cart {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            height: 100%;
            color: var(--text-light);
        }
        
        .empty-cart i {
            font-size: 3rem;
            margin-bottom: 1rem;
            opacity: 0.3;
        }
        
        .empty-cart p {
            font-size: 1.1rem;
            margin-bottom: 2rem;
        }
        
        /* Toast Messages */
        .toast-message {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            z-index: 1000;
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
        }
        
        .toast-message.show {
            transform: translateY(0);
            opacity: 1;
        }
        
        .toast-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            background-color: var(--primary);
            color: #fff;
            padding: 1rem 1.5rem;
            border-radius: 6px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
        }
        
        .toast-content i {
            color: var(--secondary);
        }
        
        /* Animation */
        .bounce {
            animation: bounce 0.3s ease;
        }
        
        @keyframes bounce {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.3);
            }
        }
    `;
    
    document.head.appendChild(style);
}); 