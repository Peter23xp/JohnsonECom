function initializeProducts() {
    // Initialisation du gestionnaire de produits
    new ProductManager();

    // Ajout des effets de survol
    const products = document.querySelectorAll('.product');
    products.forEach(product => {
        product.addEventListener('mouseenter', () => {
            product.classList.add('product-hover');
        });
        product.addEventListener('mouseleave', () => {
            product.classList.remove('product-hover');
        });
    });
}

function setupAnimations() {
    // Animation des éléments au scroll
    const animatedElements = document.querySelectorAll('.hero-item, .product');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}
