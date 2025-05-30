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
    <header class="bg-white shadow-sm fixed w-full z-50">
        <div class="container mx-auto px-4 py-4 flex items-center justify-between">
            <a href="index.html" class="text-3xl font-['Pacifico'] text-secondary">Moses</a>
            
            <!-- Desktop Navigation -->
            <nav class="hidden md:flex space-x-8">
                <a href="men.html" class="nav-link ${currentPage === 'men.html' ? 'active' : ''}">Men</a>
                <a href="women.html" class="nav-link ${currentPage === 'women.html' ? 'active' : ''}">Women</a>
                <a href="suits.html" class="nav-link ${currentPage === 'suits.html' ? 'active' : ''}">Suits</a>
                <a href="shop.html" class="nav-link ${currentPage === 'shop.html' ? 'active' : ''}">Shop</a>
                <a href="about.html" class="nav-link ${currentPage === 'about.html' ? 'active' : ''}">About</a>
                <a href="contact.html" class="nav-link ${currentPage === 'contact.html' ? 'active' : ''}">Contact</a>
            </nav>
            
            <div class="flex items-center space-x-6">
                <!-- Search (Desktop) -->
                <div class="relative hidden md:block">
                    <input type="text" placeholder="Search..." class="pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-gray-50 text-sm focus:border-secondary">
                    <div class="absolute left-3 top-2.5 w-5 h-5 flex items-center justify-center text-gray-400">
                        <i class="ri-search-line"></i>
                    </div>
                </div>
                
                <!-- Shopping Cart -->
                <a href="cart.html" class="w-10 h-10 flex items-center justify-center text-primary hover:text-secondary cursor-pointer relative">
                    <i class="ri-shopping-bag-line ri-lg"></i>
                    <span id="cartBadge" class="absolute -top-1 -right-1 bg-secondary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">0</span>
                </a>
                
                <!-- Mobile Menu Button -->
                <div class="w-10 h-10 flex items-center justify-center text-primary hover:text-secondary cursor-pointer md:hidden" id="mobileMenuBtn">
                    <i class="ri-menu-line ri-lg"></i>
                </div>
            </div>
        </div>
        
        <!-- Mobile Menu -->
        <div id="mobileMenu" class="md:hidden hidden bg-white shadow-lg absolute top-full left-0 w-full py-4">
            <nav class="container mx-auto px-4">
                <ul class="space-y-4">
                    <li><a href="men.html" class="block ${currentPage === 'men.html' ? 'text-secondary' : 'text-primary'} hover:text-secondary transition-colors">Men</a></li>
                    <li><a href="women.html" class="block ${currentPage === 'women.html' ? 'text-secondary' : 'text-primary'} hover:text-secondary transition-colors">Women</a></li>
                    <li><a href="suits.html" class="block ${currentPage === 'suits.html' ? 'text-secondary' : 'text-primary'} hover:text-secondary transition-colors">Suits</a></li>
                    <li><a href="shop.html" class="block ${currentPage === 'shop.html' ? 'text-secondary' : 'text-primary'} hover:text-secondary transition-colors">Shop</a></li>
                    <li><a href="about.html" class="block ${currentPage === 'about.html' ? 'text-secondary' : 'text-primary'} hover:text-secondary transition-colors">About</a></li>
                    <li><a href="contact.html" class="block ${currentPage === 'contact.html' ? 'text-secondary' : 'text-primary'} hover:text-secondary transition-colors">Contact</a></li>
                </ul>
                
                <!-- Search (Mobile) -->
                <div class="relative mt-4">
                    <input type="text" placeholder="Search..." class="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-gray-50 text-sm focus:border-secondary">
                    <div class="absolute left-3 top-2.5 w-5 h-5 flex items-center justify-center text-gray-400">
                        <i class="ri-search-line"></i>
                    </div>
                </div>
            </nav>
        </div>
    </header>
    `;
    
    // Insert the navbar at the beginning of the body
    document.body.insertAdjacentHTML('afterbegin', navbar);
    
    // Add event listeners for mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Add styles for active navigation links
    const style = document.createElement('style');
    style.textContent = `
        .nav-link {
            position: relative;
            color: #0C0C0C;
            transition: color 0.3s;
        }
        
        .nav-link:hover {
            color: #8A9A5B;
        }
        
        .nav-link.active {
            color: #8A9A5B;
            font-weight: 500;
        }
        
        .nav-link.active::after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 0;
            width: 100%;
            height: 2px;
            background-color: #8A9A5B;
        }
    `;
    document.head.appendChild(style);
    
    // Update cart badge if cart functionality exists
    if (typeof updateCartBadge === 'function') {
        updateCartBadge();
    } else {
        // Setup cart badge from localStorage if needed
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const cartBadge = document.getElementById('cartBadge');
        if (cartBadge) {
            if (cartItems.length > 0) {
                cartBadge.textContent = cartItems.length;
                cartBadge.classList.remove('hidden');
            } else {
                cartBadge.classList.add('hidden');
            }
        }
    }
}); 