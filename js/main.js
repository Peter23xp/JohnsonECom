// Import des composants
import { ProductManager } from './components/ProductManager.js';

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeProducts();
    setupAnimations();
});

function initializeNavigation() {
    const nav = document.querySelector('nav');
    
    // Gestion du scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.classList.add('nav-scrolled');
        } else {
            nav.classList.remove('nav-scrolled');
        }
    });

    // Menu mobile
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '☰';
    nav.prepend(menuToggle);

    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('nav-open');
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
