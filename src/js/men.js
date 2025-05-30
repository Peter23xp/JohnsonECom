// Men's Collection Products
const menProducts = [
    {
        id: 1,
        name: "Classic Oxford Shirt",
        price: 129.99,
        image: "assets/images/products/oxford-shirt.jpg",
        category: "Shirts",
        description: "Timeless oxford shirt crafted from premium cotton.",
        isFavorite: true,
        colors: ["white", "blue", "black"],
        sizes: ["S", "M", "L", "XL"]
    },
    {
        id: 2,
        name: "Slim Fit Chinos",
        price: 89.99,
        image: "assets/images/products/chinos.jpg",
        category: "Pants",
        description: "Modern slim-fit chinos with stretch comfort.",
        isFavorite: false,
        colors: ["khaki", "navy", "olive"],
        sizes: ["30", "32", "34", "36"]
    },
    {
        id: 3,
        name: "Leather Derby Shoes",
        price: 249.99,
        image: "assets/images/products/derby.jpg",
        category: "Shoes",
        description: "Hand-crafted derby shoes in premium leather.",
        isFavorite: true,
        colors: ["brown", "black"],
        sizes: ["40", "41", "42", "43", "44"]
    }
];

// FAQ Data
const faqData = [
    {
        question: "How do I find my perfect fit?",
        answer: "We provide detailed size guides for each product. For the most accurate fit, measure yourself and compare with our size charts. If you're between sizes, we recommend sizing up for a more comfortable fit."
    },
    {
        question: "What materials do you use?",
        answer: "We source only the highest quality materials, including premium leather from sustainable tanneries, organic cotton, and fine wool blends. Each material is carefully selected for durability and comfort."
    },
    {
        question: "How do I care for my garments?",
        answer: "Each item comes with specific care instructions. Generally, we recommend dry cleaning for suits and leather items, and machine washing in cold water for cotton garments. Always follow the care label for best results."
    },
    {
        question: "What is your return policy?",
        answer: "We offer a 30-day return policy for unworn items in original condition with tags attached. For suits and tailored items, we provide one free alteration."
    }
];

// Populate Product Grid
function populateProductGrid() {
    const productGrid = document.getElementById('productGrid');
    
    menProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card cursor-pointer';
        productCard.innerHTML = `
            <div class="relative overflow-hidden">
                <img src="${product.image}" alt="${product.name}" class="w-full h-64 object-cover">
                ${product.isFavorite ? '<span class="absolute top-4 right-4 text-accent"><i data-feather="heart" fill="currentColor"></i></span>' : ''}
            </div>
            <div class="p-6">
                <p class="text-accent text-sm mb-2">${product.category}</p>
                <h3 class="font-display text-xl mb-2">${product.name}</h3>
                <p class="text-light/60 text-sm mb-4">${product.description}</p>
                <div class="flex justify-between items-center">
                    <span class="text-xl font-display text-accent">${product.price} €</span>
                    <button class="btn-primary text-sm px-6">Ajouter au Panier</button>
                </div>
            </div>
        `;
        // Ouvre la modale au clic sur la carte (hors bouton)
        productCard.addEventListener('click', (e) => {
            if (!e.target.classList.contains('btn-primary')) {
                openProductModal(product);
            }
        });
        // Ajout au panier direct
        productCard.querySelector('.btn-primary').addEventListener('click', (e) => {
            e.stopPropagation();
            if (typeof cartManager !== 'undefined') {
                cartManager.addToCart(product);
            } else if (typeof addToCart === 'function') {
                addToCart(product);
            }
        });
        productGrid.appendChild(productCard);
    });
    feather.replace();
}

// Populate FAQ Accordion
function populateFAQ() {
    const faqAccordion = document.getElementById('faqAccordion');
    
    faqData.forEach((faq, index) => {
        const faqItem = document.createElement('div');
        faqItem.className = 'bg-dark rounded-lg overflow-hidden';
        faqItem.innerHTML = `
            <button class="w-full px-6 py-4 flex justify-between items-center text-left" aria-expanded="false" aria-controls="faq-${index}">
                <span class="font-display text-lg">${faq.question}</span>
                <i data-feather="chevron-down" class="transform transition-transform"></i>
            </button>
            <div id="faq-${index}" class="px-6 pb-4 hidden">
                <p class="text-light/60">${faq.answer}</p>
            </div>
        `;
        faqAccordion.appendChild(faqItem);

        const button = faqItem.querySelector('button');
        const content = faqItem.querySelector(`#faq-${index}`);
        const icon = button.querySelector('i');

        button.addEventListener('click', () => {
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            button.setAttribute('aria-expanded', !isExpanded);
            content.classList.toggle('hidden');
            icon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
        });
    });

    // Reinitialize Feather icons for dynamically added content
    feather.replace();
}

// Filter Functionality
function initializeFilters() {
    const filterCheckboxes = document.querySelectorAll('.filter-checkbox');
    const sizeButtons = document.querySelectorAll('.size-button');
    const colorButtons = document.querySelectorAll('.color-button');
    const priceRange = document.querySelector('input[type="range"]');

    // Add event listeners for filters
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });

    sizeButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('bg-accent');
            button.classList.toggle('text-dark');
            applyFilters();
        });
    });

    colorButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('border-accent');
            applyFilters();
        });
    });

    priceRange.addEventListener('input', applyFilters);
}

function applyFilters() {
    // Add filter logic here
    console.log('Filters applied');
}

function openProductModal(product) {
    const modal = document.getElementById('productModal');
    const modalContent = document.getElementById('productModalContent');
    if (!modal || !modalContent) return;
    modalContent.innerHTML = `
        <button id="closeProductModal" class="absolute top-4 right-4 text-gray-500 hover:text-secondary text-2xl">&times;</button>
        <div class="flex flex-col md:flex-row gap-6">
            <img src="${product.image}" alt="${product.name}" class="w-40 h-40 object-cover rounded-lg mx-auto md:mx-0">
            <div class="flex-1">
                <h2 class="text-2xl font-bold mb-2">${product.name}</h2>
                <p class="text-secondary font-semibold mb-2">${product.category}</p>
                <p class="mb-4 text-gray-700">${product.description || ''}</p>
                <div class="mb-4">
                    <span class="text-xl font-bold text-secondary">${product.price} €</span>
                </div>
                <button class="w-full bg-primary text-white py-3 rounded-button hover:bg-secondary transition-colors add-to-cart-modal mt-2">Ajouter au Panier</button>
            </div>
        </div>
    `;
    modal.classList.remove('hidden');
    // Fermer la modale
    document.getElementById('closeProductModal').onclick = () => modal.classList.add('hidden');
    // Ajouter au panier depuis la modale
    modalContent.querySelector('.add-to-cart-modal').onclick = () => {
        if (typeof cartManager !== 'undefined') {
            cartManager.addToCart(product);
        } else if (typeof addToCart === 'function') {
            addToCart(product);
        }
        modal.classList.add('hidden');
    };
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    populateProductGrid();
    populateFAQ();
    initializeFilters();
    // Fermer la modale si on clique en dehors du contenu
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    }
}); 