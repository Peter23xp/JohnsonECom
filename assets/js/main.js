// Animations and Interactions
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.ri-menu-line');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            document.body.classList.toggle('overflow-hidden');
        });
    }

    // Product Card Animations
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.transition = 'all 0.3s ease';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // Wishlist Toggle
    const wishlistButtons = document.querySelectorAll('.wishlist-btn');
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const icon = this.querySelector('i');
            if (icon.classList.contains('ri-heart-line')) {
                icon.classList.remove('ri-heart-line');
                icon.classList.add('ri-heart-fill', 'text-red-500');
            } else {
                icon.classList.remove('ri-heart-fill', 'text-red-500');
                icon.classList.add('ri-heart-line');
            }
        });
    });

    // Custom Select Dropdowns
    const customSelects = document.querySelectorAll('.custom-select');
    customSelects.forEach(select => {
        const selected = select.querySelector('.custom-select-selected');
        const options = select.querySelector('.custom-select-options');
        const optionItems = select.querySelectorAll('.custom-select-option');

        selected.addEventListener('click', () => {
            select.classList.toggle('open');
        });

        optionItems.forEach(option => {
            option.addEventListener('click', function() {
                const value = this.textContent;
                selected.querySelector('span').textContent = `Sort by: ${value}`;
                optionItems.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                select.classList.remove('open');
            });
        });

        document.addEventListener('click', (e) => {
            if (!select.contains(e.target)) {
                select.classList.remove('open');
            }
        });
    });

    // Price Range Slider
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    if (priceRange && priceValue) {
        priceRange.addEventListener('input', function() {
            priceValue.textContent = `${this.value} €`;
        });
    }

    // Sticky Header
    const header = document.querySelector('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });

    // Add to Cart Animation
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const cartCount = document.querySelector('.cart-count');
            if (cartCount) {
                const currentCount = parseInt(cartCount.textContent);
                cartCount.textContent = currentCount + 1;
                
                // Animation de notification
                cartCount.classList.add('scale-150');
                setTimeout(() => {
                    cartCount.classList.remove('scale-150');
                }, 200);
            }
        });
    });

    // Image Lazy Loading
    const images = document.querySelectorAll('img[data-src]');
    const imageOptions = {
        threshold: 0,
        rootMargin: '0px 0px 50px 0px'
    };

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('fade-in');
                observer.unobserve(img);
            }
        });
    }, imageOptions);

    images.forEach(img => imageObserver.observe(img));
});

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Gestion du panier
class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateCartCount();
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
        this.saveCart();
        this.updateCartCount();
        this.showNotification('Produit ajouté au panier');
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    updateCartCount() {
        const count = this.items.reduce((total, item) => total + item.quantity, 0);
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = count;
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-secondary text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-transform duration-300 translate-y-0';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('translate-y-[-100%]');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
}

// Initialisation du panier
const cart = new Cart();

// Gestion du menu mobile
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuButton = document.querySelector('.ri-menu-line').parentElement;
    const closeButton = document.querySelector('#closeMenu');

    menuButton.addEventListener('click', () => {
        mobileMenu.classList.remove('hidden');
    });

    closeButton.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });

    // Ajout des gestionnaires d'événements pour les boutons "Ajouter au panier"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            const product = {
                id: productCard.dataset.productId || Math.random().toString(36).substr(2, 9),
                name: productCard.querySelector('h3').textContent,
                price: parseFloat(productCard.querySelector('.text-xl.font-bold').textContent.replace('€', '').trim()),
                image: productCard.querySelector('img').src
            };
            cart.addItem(product);
        });
    });
}); 