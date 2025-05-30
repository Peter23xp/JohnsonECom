/**
 * Filtres Universels pour Moses Shoes & Clothing Line
 * Ce script gère les fonctionnalités de filtrage sur les pages de collection
 */

// Initialisation des filtres
document.addEventListener('DOMContentLoaded', function() {
    initializeFilters();
});

// Fonction d'initialisation des filtres
function initializeFilters() {
    // Récupérer tous les éléments de filtre
    const categoryFilters = document.querySelectorAll('.filter-btn[data-category]');
    const sizeFilters = document.querySelectorAll('.filter-btn[data-size]');
    const priceRange = document.getElementById('priceRange');
    const sortSelect = document.getElementById('sortSelect');
    
    // Ajouter les événements de clic pour les filtres de catégorie
    categoryFilters.forEach(button => {
        button.addEventListener('click', function() {
            // Désactiver tous les autres boutons de catégorie
            categoryFilters.forEach(btn => btn.classList.remove('active'));
            // Activer ce bouton
            this.classList.add('active');
            // Appliquer les filtres
            applyFilters();
        });
    });
    
    // Ajouter les événements de clic pour les filtres de taille
    sizeFilters.forEach(button => {
        button.addEventListener('click', function() {
            // Pour les tailles, on peut en sélectionner plusieurs
            this.classList.toggle('active');
            // Appliquer les filtres
            applyFilters();
        });
    });
    
    // Filtrage par prix
    if (priceRange) {
        priceRange.addEventListener('input', function() {
            // Mettre à jour l'affichage du prix
            const priceValue = document.getElementById('priceValue');
            if (priceValue) {
                priceValue.textContent = this.value + ' €';
            }
        });
        
        priceRange.addEventListener('change', applyFilters);
    }
    
    // Tri des produits
    if (sortSelect) {
        sortSelect.addEventListener('change', applyFilters);
    }
    
    // Rendre les cartes produits cliquables pour afficher la modale
    makeProductCardsClickable();
}

// Récupérer les filtres actifs
function getActiveFilters() {
    const filters = {
        category: null,
        sizes: [],
        maxPrice: Infinity
    };
    
    // Catégorie active
    const activeCategory = document.querySelector('.filter-btn[data-category].active');
    if (activeCategory) {
        filters.category = activeCategory.getAttribute('data-category');
    }
    
    // Tailles actives
    const activeSizes = document.querySelectorAll('.filter-btn[data-size].active');
    activeSizes.forEach(button => {
        filters.sizes.push(button.getAttribute('data-size').toLowerCase());
    });
    
    // Prix maximum
    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
        filters.maxPrice = parseFloat(priceRange.value);
    }
    
    // Tri
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        filters.sort = sortSelect.value;
    }
    
    return filters;
}

// Appliquer les filtres
function applyFilters() {
    const filters = getActiveFilters();
    const productCards = document.querySelectorAll('.product-card');
    let visibleProducts = 0;
    
    productCards.forEach(card => {
        let shouldShow = true;
        
        // Filtrage par catégorie
        if (filters.category && filters.category !== 'all') {
            const productCategory = card.getAttribute('data-category') || '';
            if (productCategory.toLowerCase() !== filters.category.toLowerCase()) {
                shouldShow = false;
            }
        }
        
        // Filtrage par taille
        if (filters.sizes.length > 0) {
            const productSize = (card.getAttribute('data-size') || '').toLowerCase();
            if (productSize && !filters.sizes.includes(productSize)) {
                shouldShow = false;
            }
        }
        
        // Filtrage par prix
        if (filters.maxPrice < Infinity) {
            const priceElement = card.querySelector('.text-xl');
            if (priceElement) {
                const priceText = priceElement.textContent;
                const price = parseFloat(priceText.replace(/[^\d,.]/g, '').replace(',', '.'));
                if (price > filters.maxPrice) {
                    shouldShow = false;
                }
            }
        }
        
        // Appliquer la visibilité
        if (shouldShow) {
            card.style.display = '';
            visibleProducts++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Mettre à jour le compteur de produits si présent
    updateProductCount(visibleProducts);
    
    // Gérer le tri des produits
    if (filters.sort) {
        sortProducts(filters.sort);
    }
}

// Mettre à jour le compteur de produits
function updateProductCount(count) {
    const countElement = document.getElementById('productCount');
    if (countElement) {
        countElement.textContent = count;
    }
}

// Trier les produits
function sortProducts(sortOption) {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;
    
    const products = Array.from(productGrid.querySelectorAll('.product-card'));
    
    products.sort((a, b) => {
        // Récupérer les prix
        const priceA = getPriceFromCard(a);
        const priceB = getPriceFromCard(b);
        
        if (sortOption === 'price-asc') {
            return priceA - priceB;
        } else if (sortOption === 'price-desc') {
            return priceB - priceA;
        }
        
        return 0;
    });
    
    // Réorganiser les produits dans la grille
    products.forEach(product => {
        productGrid.appendChild(product);
    });
}

// Extraire le prix d'une carte produit
function getPriceFromCard(card) {
    const priceElement = card.querySelector('.text-xl');
    if (priceElement) {
        const priceText = priceElement.textContent;
        return parseFloat(priceText.replace(/[^\d,.]/g, '').replace(',', '.'));
    }
    return 0;
}

// Rendre les cartes produits cliquables
function makeProductCardsClickable() {
    document.querySelectorAll('.product-card').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function(e) {
            // Ne pas ouvrir la modale si on clique sur un bouton
            if (e.target.closest('button')) return;
            
            // Récupérer les informations du produit
            const img = card.querySelector('img');
            const name = card.querySelector('h3').textContent;
            const price = card.querySelector('.text-xl').textContent;
            const category = card.querySelector('.text-accent, .text-secondary')?.textContent || '';
            
            // Ouvrir la modale avec les informations du produit
            openProductModal({
                image: img ? img.src : '',
                name,
                price,
                category
            });
        });
    });
}

// Ouvrir la modale de produit
function openProductModal(product) {
    // Vérifier si la modale existe, sinon la créer
    let modal = document.getElementById('productModal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'productModal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden';
        
        const modalContent = document.createElement('div');
        modalContent.id = 'productModalContent';
        modalContent.className = 'bg-white p-8 rounded-lg max-w-xl w-full relative';
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Fermer la modale si on clique en dehors
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    }
    
    const modalContent = document.getElementById('productModalContent');
    
    // Remplir la modale avec les informations du produit
    modalContent.innerHTML = `
        <button id="closeProductModal" class="absolute top-4 right-4 text-gray-500 hover:text-secondary text-2xl">&times;</button>
        <div class="flex flex-col md:flex-row gap-6">
            <img src="${product.image}" alt="${product.name}" class="w-40 h-40 object-cover rounded-lg mx-auto md:mx-0">
            <div class="flex-1">
                <h2 class="text-2xl font-bold mb-2">${product.name}</h2>
                <p class="text-secondary font-semibold mb-2">${product.category}</p>
                <p class="mb-4 text-gray-700">${product.description || ''}</p>
                <div class="mb-4">
                    <span class="text-xl font-bold text-secondary">${product.price}</span>
                </div>
                <button class="w-full bg-primary text-white py-3 rounded-button hover:bg-secondary transition-colors add-to-cart-modal mt-2">Ajouter au Panier</button>
            </div>
        </div>
    `;
    
    // Afficher la modale
    modal.classList.remove('hidden');
    
    // Gérer les événements
    document.getElementById('closeProductModal').onclick = () => {
        modal.classList.add('hidden');
    };
    
    // Gestion de l'ajout au panier
    modalContent.querySelector('.add-to-cart-modal').onclick = () => {
        // Vérifier si la fonction addToCart existe dans le scope global
        if (typeof addToCart === 'function') {
            addToCart({
                id: product.name.toLowerCase().replace(/\s+/g, '-'),
                name: product.name,
                price: parseFloat(product.price.replace(/[^\d,.]/g, '').replace(',', '.')),
                image: product.image,
                category: product.category,
                quantity: 1
            });
        } else if (typeof cartManager !== 'undefined' && typeof cartManager.addToCart === 'function') {
            cartManager.addToCart({
                id: product.name.toLowerCase().replace(/\s+/g, '-'),
                name: product.name,
                price: parseFloat(product.price.replace(/[^\d,.]/g, '').replace(',', '.')),
                image: product.image,
                category: product.category,
                quantity: 1
            });
        }
        
        // Fermer la modale
        modal.classList.add('hidden');
        
        // Afficher une notification
        if (typeof showToast === 'function') {
            showToast('Produit ajouté au panier !', 'success');
        }
    };
} 