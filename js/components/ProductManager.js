// Gestionnaire de produits
class ProductManager {
    constructor() {
        this.products = [];
        this.loadProducts();
    }

    async loadProducts() {
        try {
            // Simulation d'une requête API
            const productImages = document.querySelectorAll('.product img');
            this.products = Array.from(productImages).map((img, index) => ({
                id: index + 1,
                name: img.alt,
                image: img.src,
                price: (Math.random() * (100 - 20) + 20).toFixed(2)
            }));
            this.renderProducts();
        } catch (error) {
            console.error('Erreur lors du chargement des produits:', error);
        }
    }

    renderProducts() {
        const productGrid = document.querySelector('.product-grid');
        if (!productGrid) return;

        productGrid.innerHTML = this.products.map(product => `
            <div class="product" data-id="${product.id}">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-price">${product.price}€</p>
                    <button class="btn btn-primary">Voir le produit</button>
                </div>
            </div>
        `).join('');

        this.addEventListeners();
    }

    addEventListeners() {
        const products = document.querySelectorAll('.product');
        products.forEach(product => {
            product.addEventListener('click', (e) => {
                if (!e.target.classList.contains('btn')) return;
                const productId = product.dataset.id;
                window.location.href = `product.html?id=${productId}`;
            });
        });
    }
}
