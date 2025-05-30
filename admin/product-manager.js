// Product Management System for Moses Shoes & Clothing Line
const productManager = {
    products: [],
    localStorageKey: 'moses_products',
    
    // Initialize the product manager
    init() {
        this.loadProducts();
        this.bindEvents();
    },
    
    // Load products from localStorage or default
    loadProducts() {
        const storedProducts = localStorage.getItem(this.localStorageKey);
        if (storedProducts) {
            this.products = JSON.parse(storedProducts);
        } else {
            // Load default products if none exist
            this.products = defaultProducts;
            this.saveProducts();
        }
    },
    
    // Save products to localStorage
    saveProducts() {
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.products));
    },
    
    // Add a new product
    addProduct(product) {
        // Validate product
        if (!this.validateProduct(product)) {
            return false;
        }
        
        // Generate a unique ID
        product.id = Date.now().toString();
        
        // Add to products array
        this.products.push(product);
        
        // Save to localStorage
        this.saveProducts();
        
        return true;
    },
    
    // Validate product data
    validateProduct(product) {
        const requiredFields = ['name', 'price', 'category', 'image'];
        for (const field of requiredFields) {
            if (!product[field]) {
                console.error(`Missing required field: ${field}`);
                return false;
            }
        }
        
        // Price must be a number
        if (isNaN(parseFloat(product.price))) {
            console.error('Price must be a number');
            return false;
        }
        
        return true;
    },
    
    // Edit an existing product
    editProduct(id, updatedProduct) {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) return false;
        
        if (!this.validateProduct(updatedProduct)) {
            return false;
        }
        
        this.products[index] = { ...this.products[index], ...updatedProduct };
        this.saveProducts();
        return true;
    },
    
    // Delete a product
    deleteProduct(id) {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) return false;
        
        this.products.splice(index, 1);
        this.saveProducts();
        return true;
    },
    
    // Get all products
    getProducts() {
        return [...this.products];
    },
    
    // Get product by ID
    getProductById(id) {
        return this.products.find(p => p.id === id);
    },
    
    // Filter products
    filterProducts(filters) {
        let filtered = [...this.products];
        
        if (filters.category && filters.category !== 'all') {
            filtered = filtered.filter(p => p.category.toLowerCase() === filters.category.toLowerCase());
        }
        
        if (filters.minPrice !== undefined) {
            filtered = filtered.filter(p => parseFloat(p.price) >= filters.minPrice);
        }
        
        if (filters.maxPrice !== undefined) {
            filtered = filtered.filter(p => parseFloat(p.price) <= filters.maxPrice);
        }
        
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(searchTerm) || 
                (p.description && p.description.toLowerCase().includes(searchTerm))
            );
        }
        
        return filtered;
    },
    
    // Sort products
    sortProducts(products, sortBy) {
        const sorted = [...products];
        
        switch(sortBy) {
            case 'price-asc':
                sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                break;
            case 'price-desc':
                sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
                break;
            case 'name-asc':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'newest':
                sorted.sort((a, b) => new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0));
                break;
            default:
                // Default sorting (newest)
                sorted.sort((a, b) => new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0));
                break;
        }
        
        return sorted;
    },
    
    // Bind events for product management
    bindEvents() {
        // Add product form submission
        const addProductForm = document.getElementById('addProductForm');
        if (addProductForm) {
            addProductForm.addEventListener('submit', this.handleAddProduct.bind(this));
        }
    },
    
    // Handle add product form submission
    handleAddProduct(event) {
        event.preventDefault();
        const form = event.target;
        
        const newProduct = {
            name: form.name.value.trim(),
            price: parseFloat(form.price.value),
            category: form.category.value,
            description: form.description.value.trim(),
            image: form.image.value.trim() || 'assets/images/placeholder.jpg',
            sizes: Array.from(form.querySelectorAll('input[name="size"]:checked'))
                .map(input => input.value),
            colors: Array.from(form.querySelectorAll('input[name="color"]:checked'))
                .map(input => input.value),
            stock: parseInt(form.stock.value) || 10,
            dateAdded: new Date().toISOString(),
        };
        
        if (this.addProduct(newProduct)) {
            // Success
            form.reset();
            this.showNotification('Product added successfully', 'success');
            
            // Refresh product list if displayed
            if (typeof displayProducts === 'function') {
                displayProducts();
            }
        } else {
            // Error
            this.showNotification('Failed to add product. Please check the form.', 'error');
        }
    },
    
    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed bottom-5 right-5 px-6 py-3 rounded-lg shadow-lg ${
            type === 'success' ? 'bg-green-500' : 
            type === 'error' ? 'bg-red-500' : 
            'bg-secondary'
        } text-white`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.add('opacity-0', 'transition-opacity', 'duration-300');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
};

// Default products if none exist
const defaultProducts = [
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
    // More default products can be added here
];

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => productManager.init());

// Export for use in other scripts
window.productManager = productManager; 