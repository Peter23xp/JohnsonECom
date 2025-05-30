// Navbar Component for Moses Shoes & Clothing Line
document.addEventListener('DOMContentLoaded', function() {
    // Check if Tailwind config exists
    if (typeof tailwind !== 'undefined' && tailwind.config) {
        // Update the color scheme to match the new palette
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#1D1C1C',     // Deep Black
                        secondary: '#86997B',   // Sage Green
                        tertiary: '#E1E6C9',    // Light Green
                        neutral: '#FAFAF0',     // Soft White
                        dark: '#3B3E3A',        // Dark Gray
                    },
                    backgroundColor: theme => ({
                        ...theme('colors'),
                    }),
                    textColor: theme => ({
                        ...theme('colors'),
                    }),
                    borderColor: theme => ({
                        ...theme('colors'),
                    })
                }
            }
        };
    }

    // Get the current page to highlight the active link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Create the navbar HTML
    const navbar = `
    <!-- Header -->
    <header class="fixed top-0 left-0 w-full z-50 bg-neutral transition-all">
        <div class="container mx-auto px-4 py-4 flex justify-between items-center">
            <!-- Logo -->
            <a href="index.html" class="text-3xl font-['Pacifico'] text-primary">Moses</a>
            
            <!-- Desktop Navigation -->
            <nav class="hidden md:block">
                <ul class="flex space-x-6 text-dark">
                    <li><a href="men.html" class="hover:text-secondary transition-colors">Men</a></li>
                    <li><a href="women.html" class="hover:text-secondary transition-colors">Women</a></li>
                    <li><a href="suits.html" class="hover:text-secondary transition-colors">Suits</a></li>
                    <li><a href="products.html" class="hover:text-secondary transition-colors">Catalog</a></li>
                    <li><a href="accessories.html" class="hover:text-secondary transition-colors">Accessories</a></li>
                    <li><a href="about.html" class="hover:text-secondary transition-colors">About</a></li>
                    <li><a href="contact.html" class="hover:text-secondary transition-colors">Contact</a></li>
                </ul>
            </nav>
            
            <!-- Desktop Actions -->
            <div class="hidden md:flex items-center space-x-4">
                <button aria-label="Search" class="p-2 hover:text-secondary transition-colors" onclick="toggleSearch()">
                    <i class="ri-search-line text-xl"></i>
                </button>
                <a href="account.html" aria-label="My Account" class="p-2 hover:text-secondary transition-colors">
                    <i class="ri-user-line text-xl"></i>
                </a>
                <a href="cart.html" aria-label="Shopping Cart" class="p-2 hover:text-secondary transition-colors relative">
                    <i class="ri-shopping-bag-line text-xl"></i>
                    <span id="cartCount" class="absolute -top-1 -right-1 bg-secondary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">0</span>
                </a>
            </div>
            
            <!-- Mobile Menu Button -->
            <button id="mobileMenuBtn" aria-label="Menu" class="md:hidden p-2 focus:outline-none">
                <i class="ri-menu-line text-2xl"></i>
            </button>
        </div>
        
        <!-- Mobile Navigation -->
        <div id="mobileMenu" class="md:hidden bg-neutral hidden">
            <nav class="container mx-auto px-4 py-4 border-t border-gray-200">
                <ul class="space-y-4 text-dark">
                    <li><a href="men.html" class="block py-2 hover:text-secondary transition-colors">Men</a></li>
                    <li><a href="women.html" class="block py-2 hover:text-secondary transition-colors">Women</a></li>
                    <li><a href="suits.html" class="block py-2 hover:text-secondary transition-colors">Suits</a></li>
                    <li><a href="products.html" class="block py-2 hover:text-secondary transition-colors">Catalog</a></li>
                    <li><a href="accessories.html" class="block py-2 hover:text-secondary transition-colors">Accessories</a></li>
                    <li><a href="about.html" class="block py-2 hover:text-secondary transition-colors">About</a></li>
                    <li><a href="contact.html" class="block py-2 hover:text-secondary transition-colors">Contact</a></li>
                    <li class="flex space-x-4 pt-2">
                        <a href="account.html" aria-label="My Account" class="p-2 hover:text-secondary transition-colors">
                            <i class="ri-user-line text-xl"></i>
                        </a>
                        <a href="cart.html" aria-label="Shopping Cart" class="p-2 hover:text-secondary transition-colors relative">
                            <i class="ri-shopping-bag-line text-xl"></i>
                            <span class="mobile-cart-count absolute -top-1 -right-1 bg-secondary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">0</span>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
        
        <!-- Search Bar -->
        <div id="searchBar" class="hidden bg-tertiary py-4 border-t border-gray-200">
            <div class="container mx-auto px-4">
                <div class="relative">
                    <input type="text" placeholder="Search..." class="w-full px-4 py-3 pl-12 rounded-button border-none bg-neutral focus:ring-2 focus:ring-secondary focus:outline-none">
                    <div class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <i class="ri-search-line"></i>
                    </div>
                    <button class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-secondary" onclick="toggleSearch()">
                        <i class="ri-close-line"></i>
                    </button>
                </div>
            </div>
        </div>
    </header>
    `;
    
    // Insert the navbar at the beginning of the body
    document.body.insertAdjacentHTML('afterbegin', navbar);
    
    // Mobile menu toggle functionality
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            
            // Toggle icon between menu and close
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                if (mobileMenu.classList.contains('hidden')) {
                    icon.className = 'ri-menu-line text-2xl';
                } else {
                    icon.className = 'ri-close-line text-2xl';
                }
            }
        });
    }
    
    // Update cart count if cart is available
    function updateCartCount() {
        const cartCountElements = document.querySelectorAll('#cartCount, .mobile-cart-count');
        let count = 0;
        
        // Try to get cart items from localStorage
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        count = cart.reduce((total, item) => total + (item.quantity || 1), 0);
        
        cartCountElements.forEach(el => {
            el.textContent = count;
        });
    }
    
    // Call initially
    updateCartCount();
    
    // Listen for cart updates
    window.addEventListener('storage', function(e) {
        if (e.key === 'cart') {
            updateCartCount();
        }
    });
    
    // Add custom event for cart updates from the same window
    document.addEventListener('cartUpdated', updateCartCount);
    
    // Make navbar sticky and change background on scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('shadow-md');
            } else {
                header.classList.remove('shadow-md');
            }
        }
    });
});

// Toggle search bar
function toggleSearch() {
    const searchBar = document.getElementById('searchBar');
    if (searchBar) {
        searchBar.classList.toggle('hidden');
        
        // Focus on input when shown
        if (!searchBar.classList.contains('hidden')) {
            const input = searchBar.querySelector('input');
            if (input) {
                setTimeout(() => input.focus(), 100);
            }
        }
    }
} 