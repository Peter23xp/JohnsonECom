// Main JavaScript file
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeProductGrid();
});

function initializeNavigation() {
    // Add scroll behavior
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('nav');
        if (window.scrollY > 100) {
            nav.classList.add('nav-scrolled');
        } else {
            nav.classList.remove('nav-scrolled');
        }
    });
}

function initializeProductGrid() {
    // Add lazy loading to product images
    const images = document.querySelectorAll('.product img');
    images.forEach(img => {
        img.loading = 'lazy';
    });

    // Add click handlers for product cards
    const products = document.querySelectorAll('.product');
    products.forEach(product => {
        product.addEventListener('click', (e) => {
            if (!e.target.closest('a')) {
                const link = product.querySelector('a');
                if (link) link.click();
            }
        });
    });
}
