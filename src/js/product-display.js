/**
 * Product Display System
 * Handles product listing with pagination, filtering, and sorting
 */

const productDisplay = {
    products: [],
    filteredProducts: [],
    currentPage: 1,
    productsPerPage: 12,
    totalPages: 1,
    
    // Initialize the display system
    init() {
        // Load products from product manager if available
        if (typeof productManager !== 'undefined') {
            this.products = productManager.getProducts();
        } else {
            // Fallback to demo products
            this.loadDemoProducts();
        }
        
        this.filteredProducts = [...this.products];
        this.calculateTotalPages();
        this.bindEvents();
        this.renderProducts();
        this.renderPagination();
        this.updateProductCount();
        
        // Parse URL params for pre-selected filters
        this.applyURLFilters();
    },
    
    // Load demo products if product manager is not available
    loadDemoProducts() {
        // Demo products for testing
        this.products = [
            // Add some demo products here...
            {
                id: '1',
                name: 'Dark Blue Elegant Suit',
                price: 349,
                category: 'Suits',
                description: 'A premium wool suit in dark blue, perfect for formal occasions.',
                image: 'assets/images/products/suit-navy-wool.jpg',
                sizes: ['S', 'M', 'L', 'XL'],
                colors: ['Blue'],
                stock: 15,
                dateAdded: '2023-11-10T14:48:00.000Z'
            },
            {
                id: '2',
                name: 'Brown Leather Oxford Shoes',
                price: 189,
                category: 'Shoes',
                description: 'Handcrafted leather oxford shoes with a sleek design.',
                image: 'assets/images/products/oxford.jpg',
                sizes: ['40', '41', '42', '43', '44'],
                colors: ['Brown'],
                stock: 20,
                dateAdded: '2023-11-15T09:30:00.000Z'
            },
            // Add more demo products as needed
        ];
        
        // If there are more than 20 products in the demo, add more for pagination testing
        for (let i = 3; i <= 25; i++) {
            this.products.push({
                id: i.toString(),
                name: `Product Sample ${i}`,
                price: Math.floor(Math.random() * 200) + 50,
                category: ['Men', 'Women', 'Suits', 'Shoes', 'Accessories'][Math.floor(Math.random() * 5)],
                description: 'Sample product description.',
                image: 'assets/images/placeholder.jpg',
                sizes: ['S', 'M', 'L'],
                colors: ['Black', 'White'],
                stock: Math.floor(Math.random() * 50) + 1,
                dateAdded: new Date().toISOString()
            });
        }
    },
    
    // Bind all event listeners
    bindEvents() {
        // Products per page selector
        const perPageSelect = document.getElementById('productsPerPage');
        if (perPageSelect) {
            perPageSelect.addEventListener('change', () => {
                this.productsPerPage = parseInt(perPageSelect.value);
                this.currentPage = 1; // Reset to first page
                this.calculateTotalPages();
                this.renderProducts();
                this.renderPagination();
                this.updateURLParams();
            });
        }
        
        // Category filter buttons
        document.querySelectorAll('[data-category]').forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all category buttons
                document.querySelectorAll('[data-category]').forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');
                
                // Apply filters
                this.applyFilters();
            });
        });
        
        // Price range filter
        const priceRange = document.getElementById('priceRange');
        if (priceRange) {
            priceRange.addEventListener('change', () => {
                this.applyFilters();
            });
        }
        
        // Sort selector
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', () => {
                this.applyFilters();
            });
        }
        
        // Size filter buttons
        document.querySelectorAll('[data-size]').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.classList.toggle('active');
                this.applyFilters();
            });
        });
        
        // Search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(() => {
                this.applyFilters();
            }, 500));
        }
    },
    
    // Apply all filters and render products
    applyFilters() {
        this.filteredProducts = [...this.products];
        
        // Category filter
        const activeCategory = document.querySelector('[data-category].active');
        if (activeCategory && activeCategory.dataset.category !== 'all') {
            this.filteredProducts = this.filteredProducts.filter(product => 
                product.category.toLowerCase() === activeCategory.dataset.category.toLowerCase()
            );
        }
        
        // Price filter
        const priceRange = document.getElementById('priceRange');
        if (priceRange) {
            const maxPrice = parseInt(priceRange.value);
            this.filteredProducts = this.filteredProducts.filter(product => 
                parseFloat(product.price) <= maxPrice
            );
            
            // Update price display
            const priceValue = document.getElementById('priceValue');
            if (priceValue) {
                priceValue.textContent = `${maxPrice} €`;
            }
        }
        
        // Size filter
        const activeSizes = Array.from(document.querySelectorAll('[data-size].active'))
            .map(btn => btn.dataset.size);
        if (activeSizes.length > 0) {
            this.filteredProducts = this.filteredProducts.filter(product => 
                product.sizes.some(size => activeSizes.includes(size))
            );
        }
        
        // Search filter
        const searchInput = document.getElementById('searchInput');
        if (searchInput && searchInput.value.trim()) {
            const searchTerm = searchInput.value.trim().toLowerCase();
            this.filteredProducts = this.filteredProducts.filter(product => 
                product.name.toLowerCase().includes(searchTerm) || 
                (product.description && product.description.toLowerCase().includes(searchTerm))
            );
        }
        
        // Sort products
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            const sortBy = sortSelect.value;
            
            switch(sortBy) {
                case 'price-asc':
                    this.filteredProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                    break;
                case 'price-desc':
                    this.filteredProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
                    break;
                case 'name-asc':
                    this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'newest':
                    this.filteredProducts.sort((a, b) => new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0));
                    break;
                default:
                    // Default to newest
                    this.filteredProducts.sort((a, b) => new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0));
                    break;
            }
        }
        
        // Reset to first page when filters change
        this.currentPage = 1;
        
        // Calculate total pages
        this.calculateTotalPages();
        
        // Update URL params
        this.updateURLParams();
        
        // Render products
        this.renderProducts();
        
        // Render pagination
        this.renderPagination();
        
        // Update product count
        this.updateProductCount();
    },
    
    // Calculate total pages based on filtered products
    calculateTotalPages() {
        this.totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        if (this.totalPages === 0) this.totalPages = 1;
    },
    
    // Render products for current page
    renderProducts() {
        const productGrid = document.getElementById('productGrid');
        if (!productGrid) return;
        
        // Show loading
        this.showLoader(productGrid);
        
        // Get products for current page
        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const currentProducts = this.filteredProducts.slice(startIndex, endIndex);
        
        // Clear product grid
        setTimeout(() => {
            // Hide loader
            this.hideLoader();
            
            // Clear grid
            productGrid.innerHTML = '';
            
            // Show "no products" message if no products
            if (currentProducts.length === 0) {
                productGrid.innerHTML = `
                    <div class="col-span-full text-center py-12">
                        <div class="text-6xl text-gray-300 mb-4">
                            <i class="ri-shopping-bag-line"></i>
                        </div>
                        <h3 class="text-2xl font-semibold mb-2 text-dark">No products found</h3>
                        <p class="text-gray-600">Try adjusting your filters to see more products.</p>
                        <button id="resetFiltersBtn" class="mt-4 px-6 py-2 bg-secondary text-white rounded-button">
                            Reset filters
                        </button>
                    </div>
                `;
                
                // Bind reset filters button
                const resetBtn = document.getElementById('resetFiltersBtn');
                if (resetBtn) {
                    resetBtn.addEventListener('click', () => this.resetFilters());
                }
                return;
            }
            
            // Render products
            currentProducts.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300';
                productCard.dataset.productId = product.id;
                productCard.dataset.category = product.category;
                productCard.dataset.aos = 'fade-up';
                
                productCard.innerHTML = `
                    <div class="relative overflow-hidden group">
                        <img src="${product.image}" alt="${product.name}" class="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-300">
                        ${product.stock < 5 ? `<div class="absolute top-4 right-4 bg-red-500 text-white text-xs px-2 py-1 rounded">Last items</div>` : ''}
                    </div>
                    <div class="p-6">
                        <p class="text-secondary text-sm mb-2">${product.category}</p>
                        <h3 class="text-xl font-semibold mb-2 text-dark">${product.name}</h3>
                        <div class="flex justify-between items-center mb-4">
                            <span class="text-xl font-bold text-secondary">${product.price} €</span>
                            <div class="flex text-yellow-400">
                                <i class="ri-star-fill"></i>
                                <i class="ri-star-fill"></i>
                                <i class="ri-star-fill"></i>
                                <i class="ri-star-fill"></i>
                                <i class="ri-star-half-fill"></i>
                            </div>
                        </div>
                        <button class="w-full bg-dark hover:bg-primary text-neutral py-3 rounded-button transition-colors add-to-cart-btn">
                            Add to Cart
                        </button>
                    </div>
                `;
                
                productGrid.appendChild(productCard);
                
                // Make product card clickable to open modal
                productCard.addEventListener('click', e => {
                    // Don't open modal if clicking on a button
                    if (e.target.closest('button')) return;
                    this.openProductModal(product);
                });
                
                // Add to cart button
                const addToCartBtn = productCard.querySelector('.add-to-cart-btn');
                if (addToCartBtn) {
                    addToCartBtn.addEventListener('click', () => {
                        if (typeof cartManager !== 'undefined') {
                            cartManager.addToCart({
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                image: product.image,
                                category: product.category,
                                quantity: 1
                            });
                        } else if (typeof addToCart === 'function') {
                            addToCart({
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                image: product.image,
                                category: product.category,
                                quantity: 1
                            });
                        }
                    });
                }
            });
        }, 500); // Simulate loading delay for demo
    },
    
    // Render pagination controls
    renderPagination() {
        const pagination = document.getElementById('pagination');
        if (!pagination) return;
        
        pagination.innerHTML = '';
        
        // Don't show pagination if only one page
        if (this.totalPages <= 1) {
            pagination.classList.add('hidden');
            return;
        } else {
            pagination.classList.remove('hidden');
        }
        
        // Previous button
        const prevBtn = document.createElement('button');
        prevBtn.className = `w-10 h-10 flex items-center justify-center border rounded-button ${this.currentPage === 1 ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300 hover:border-secondary hover:text-secondary cursor-pointer'}`;
        prevBtn.innerHTML = '<i class="ri-arrow-left-s-line"></i>';
        prevBtn.disabled = this.currentPage === 1;
        prevBtn.setAttribute('aria-label', 'Previous page');
        if (this.currentPage > 1) {
            prevBtn.addEventListener('click', () => this.goToPage(this.currentPage - 1));
        }
        pagination.appendChild(prevBtn);
        
        // Page numbers
        let startPage = Math.max(1, this.currentPage - 2);
        let endPage = Math.min(this.totalPages, startPage + 4);
        
        // Adjust if we're near the end
        if (endPage - startPage < 4 && startPage > 1) {
            startPage = Math.max(1, endPage - 4);
        }
        
        // First page if not in range
        if (startPage > 1) {
            const firstPageBtn = document.createElement('button');
            firstPageBtn.className = 'w-10 h-10 flex items-center justify-center border border-gray-300 rounded-button hover:border-secondary hover:text-secondary';
            firstPageBtn.textContent = '1';
            firstPageBtn.setAttribute('aria-label', 'Page 1');
            firstPageBtn.addEventListener('click', () => this.goToPage(1));
            pagination.appendChild(firstPageBtn);
            
            // Ellipsis if needed
            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'w-10 h-10 flex items-center justify-center text-gray-500';
                ellipsis.textContent = '...';
                pagination.appendChild(ellipsis);
            }
        }
        
        // Page buttons
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            
            if (i === this.currentPage) {
                pageBtn.className = 'w-10 h-10 flex items-center justify-center border border-secondary bg-secondary text-white rounded-button';
            } else {
                pageBtn.className = 'w-10 h-10 flex items-center justify-center border border-gray-300 rounded-button hover:border-secondary hover:text-secondary';
            }
            
            pageBtn.textContent = i.toString();
            pageBtn.setAttribute('aria-label', `Page ${i}`);
            pageBtn.addEventListener('click', () => this.goToPage(i));
            pagination.appendChild(pageBtn);
        }
        
        // Last page if not in range
        if (endPage < this.totalPages) {
            // Ellipsis if needed
            if (endPage < this.totalPages - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'w-10 h-10 flex items-center justify-center text-gray-500';
                ellipsis.textContent = '...';
                pagination.appendChild(ellipsis);
            }
            
            const lastPageBtn = document.createElement('button');
            lastPageBtn.className = 'w-10 h-10 flex items-center justify-center border border-gray-300 rounded-button hover:border-secondary hover:text-secondary';
            lastPageBtn.textContent = this.totalPages.toString();
            lastPageBtn.setAttribute('aria-label', `Page ${this.totalPages}`);
            lastPageBtn.addEventListener('click', () => this.goToPage(this.totalPages));
            pagination.appendChild(lastPageBtn);
        }
        
        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.className = `w-10 h-10 flex items-center justify-center border rounded-button ${this.currentPage === this.totalPages ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300 hover:border-secondary hover:text-secondary cursor-pointer'}`;
        nextBtn.innerHTML = '<i class="ri-arrow-right-s-line"></i>';
        nextBtn.disabled = this.currentPage === this.totalPages;
        nextBtn.setAttribute('aria-label', 'Next page');
        if (this.currentPage < this.totalPages) {
            nextBtn.addEventListener('click', () => this.goToPage(this.currentPage + 1));
        }
        pagination.appendChild(nextBtn);
    },
    
    // Go to specific page
    goToPage(page) {
        if (page < 1 || page > this.totalPages) return;
        
        this.currentPage = page;
        this.renderProducts();
        this.renderPagination();
        this.updateURLParams();
        
        // Scroll to top of product grid
        const productGrid = document.getElementById('productGrid');
        if (productGrid) {
            window.scrollTo({
                top: productGrid.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    },
    
    // Update product count display
    updateProductCount() {
        const productCount = document.getElementById('productCount');
        if (productCount) {
            productCount.textContent = this.filteredProducts.length.toString();
        }
    },
    
    // Reset all filters
    resetFilters() {
        // Reset category filters
        document.querySelectorAll('[data-category]').forEach(btn => {
            btn.classList.remove('active');
        });
        const allCategoryBtn = document.querySelector('[data-category="all"]');
        if (allCategoryBtn) {
            allCategoryBtn.classList.add('active');
        }
        
        // Reset price filter
        const priceRange = document.getElementById('priceRange');
        if (priceRange) {
            priceRange.value = priceRange.max;
            const priceValue = document.getElementById('priceValue');
            if (priceValue) {
                priceValue.textContent = `${priceRange.max} €`;
            }
        }
        
        // Reset size filters
        document.querySelectorAll('[data-size]').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Reset sort selector
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.value = 'newest';
        }
        
        // Reset search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
        }
        
        // Reset per page selector
        const perPageSelect = document.getElementById('productsPerPage');
        if (perPageSelect) {
            perPageSelect.value = '12';
            this.productsPerPage = 12;
        }
        
        // Apply filters (resets to all products)
        this.filteredProducts = [...this.products];
        this.currentPage = 1;
        this.calculateTotalPages();
        this.renderProducts();
        this.renderPagination();
        this.updateProductCount();
        this.updateURLParams();
    },
    
    // Show loader while products are loading
    showLoader(container) {
        // Create loader if it doesn't exist
        let loader = document.getElementById('productsLoader');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'productsLoader';
            loader.className = 'fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50';
            loader.innerHTML = `
                <div class="flex flex-col items-center">
                    <div class="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
                    <p class="mt-4 text-dark font-medium">Loading...</p>
                </div>
            `;
            document.body.appendChild(loader);
        } else {
            loader.classList.remove('hidden');
        }
    },
    
    // Hide loader
    hideLoader() {
        const loader = document.getElementById('productsLoader');
        if (loader) {
            loader.classList.add('hidden');
        }
    },
    
    // Open product modal
    openProductModal(product) {
        let modal = document.getElementById('productModal');
        
        // Create modal if it doesn't exist
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'productModal';
            modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden';
            modal.innerHTML = `
                <div id="productModalContent" class="bg-white p-8 rounded-lg max-w-xl w-full relative">
                    <!-- Content will be injected here -->
                </div>
            `;
            document.body.appendChild(modal);
            
            // Close on outside click
            modal.addEventListener('click', e => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        }
        
        const modalContent = document.getElementById('productModalContent');
        modalContent.innerHTML = `
            <button id="closeProductModal" class="absolute top-4 right-4 text-gray-500 hover:text-secondary text-2xl">&times;</button>
            <div class="flex flex-col md:flex-row gap-6">
                <img src="${product.image}" alt="${product.name}" class="w-40 h-40 object-cover rounded-lg mx-auto md:mx-0">
                <div class="flex-1">
                    <h2 class="text-2xl font-bold mb-2 text-dark">${product.name}</h2>
                    <p class="text-secondary font-semibold mb-2">${product.category}</p>
                    <p class="mb-4 text-gray-700">${product.description || ''}</p>
                    <div class="mb-4">
                        <span class="text-xl font-bold text-secondary">${product.price} €</span>
                    </div>
                    <div class="mb-4">
                        <p class="text-sm font-medium mb-2">Available sizes:</p>
                        <div class="flex flex-wrap gap-2">
                            ${product.sizes.map(size => `
                                <button class="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full hover:border-secondary hover:text-secondary">
                                    ${size}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                    <button class="w-full bg-primary text-white py-3 rounded-button hover:bg-secondary transition-colors add-to-cart-modal mt-2">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
        
        // Show modal
        modal.classList.remove('hidden');
        
        // Close button event
        const closeBtn = document.getElementById('closeProductModal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.add('hidden');
            });
        }
        
        // Add to cart button event
        const addToCartBtn = modalContent.querySelector('.add-to-cart-modal');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                if (typeof cartManager !== 'undefined') {
                    cartManager.addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        category: product.category,
                        quantity: 1
                    });
                } else if (typeof addToCart === 'function') {
                    addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        category: product.category,
                        quantity: 1
                    });
                }
                modal.classList.add('hidden');
            });
        }
    },
    
    // Update URL parameters
    updateURLParams() {
        if (!history.pushState) return;
        
        const params = new URLSearchParams();
        
        // Page
        if (this.currentPage > 1) {
            params.set('page', this.currentPage.toString());
        }
        
        // Products per page
        if (this.productsPerPage !== 12) {
            params.set('per_page', this.productsPerPage.toString());
        }
        
        // Category
        const activeCategory = document.querySelector('[data-category].active');
        if (activeCategory && activeCategory.dataset.category !== 'all') {
            params.set('category', activeCategory.dataset.category);
        }
        
        // Price
        const priceRange = document.getElementById('priceRange');
        if (priceRange && priceRange.value !== priceRange.max) {
            params.set('price', priceRange.value);
        }
        
        // Sort
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect && sortSelect.value !== 'newest') {
            params.set('sort', sortSelect.value);
        }
        
        // Sizes
        const activeSizes = Array.from(document.querySelectorAll('[data-size].active'))
            .map(btn => btn.dataset.size);
        if (activeSizes.length > 0) {
            params.set('sizes', activeSizes.join(','));
        }
        
        // Search
        const searchInput = document.getElementById('searchInput');
        if (searchInput && searchInput.value.trim()) {
            params.set('search', searchInput.value.trim());
        }
        
        // Update URL
        const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
        history.pushState({ path: newUrl }, '', newUrl);
    },
    
    // Apply filters from URL parameters
    applyURLFilters() {
        const params = new URLSearchParams(window.location.search);
        
        // Page
        if (params.has('page')) {
            const page = parseInt(params.get('page'));
            if (!isNaN(page) && page > 0) {
                this.currentPage = page;
            }
        }
        
        // Products per page
        if (params.has('per_page')) {
            const perPage = parseInt(params.get('per_page'));
            if (!isNaN(perPage) && perPage > 0) {
                this.productsPerPage = perPage;
                const perPageSelect = document.getElementById('productsPerPage');
                if (perPageSelect) {
                    perPageSelect.value = perPage.toString();
                }
            }
        }
        
        // Category
        if (params.has('category')) {
            const category = params.get('category');
            const categoryBtn = document.querySelector(`[data-category="${category}"]`);
            if (categoryBtn) {
                document.querySelectorAll('[data-category]').forEach(btn => btn.classList.remove('active'));
                categoryBtn.classList.add('active');
            }
        }
        
        // Price
        if (params.has('price')) {
            const price = parseInt(params.get('price'));
            const priceRange = document.getElementById('priceRange');
            if (priceRange && !isNaN(price)) {
                priceRange.value = price;
                const priceValue = document.getElementById('priceValue');
                if (priceValue) {
                    priceValue.textContent = `${price} €`;
                }
            }
        }
        
        // Sort
        if (params.has('sort')) {
            const sort = params.get('sort');
            const sortSelect = document.getElementById('sortSelect');
            if (sortSelect) {
                sortSelect.value = sort;
            }
        }
        
        // Sizes
        if (params.has('sizes')) {
            const sizes = params.get('sizes').split(',');
            sizes.forEach(size => {
                const sizeBtn = document.querySelector(`[data-size="${size}"]`);
                if (sizeBtn) {
                    sizeBtn.classList.add('active');
                }
            });
        }
        
        // Search
        if (params.has('search')) {
            const search = params.get('search');
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = search;
            }
        }
        
        // Apply filters
        this.applyFilters();
    },
    
    // Debounce function for search input
    debounce(func, delay) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    }
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => productDisplay.init()); 