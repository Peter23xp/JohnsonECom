// Featured Products Data
const featuredProducts = [
    {
        id: 1,
        name: "Classic Leather Oxford",
        price: 299.99,
        image: "assets/images/products/oxford.jpg",
        category: "Men"
    },
    {
        id: 2,
        name: "Handwoven Leather Bag",
        price: 399.99,
        image: "assets/images/products/bag.jpg",
        category: "Accessories"
    },
    {
        id: 3,
        name: "Premium Wool Suit",
        price: 899.99,
        image: "assets/images/products/suit.jpg",
        category: "Suits"
    },
    {
        id: 4,
        name: "Designer Dress",
        price: 499.99,
        image: "assets/images/products/dress.jpg",
        category: "Women"
    }
];

// Testimonials Data
const testimonials = [
    {
        name: "Sarah Johnson",
        role: "Fashion Blogger",
        text: "The quality and craftsmanship of Moses pieces are unmatched. Each item tells a story of heritage and modern luxury.",
        rating: 5
    },
    {
        name: "Michael Chen",
        role: "Business Executive",
        text: "Their suits are the perfect blend of comfort and style. The attention to detail is remarkable.",
        rating: 5
    },
    {
        name: "Amara Williams",
        role: "Art Director",
        text: "Moses brings African elegance to life in a way that's both authentic and contemporary. Simply stunning!",
        rating: 5
    }
];

// Populate Featured Products
function populateFeaturedProducts() {
    const swiperWrapper = document.querySelector('.featured-swiper .swiper-wrapper');
    
    featuredProducts.forEach(product => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.innerHTML = `
            <div class="bg-darker rounded-lg overflow-hidden">
                <img src="${product.image}" alt="${product.name}" class="w-full h-80 object-cover">
                <div class="p-6">
                    <p class="text-accent text-sm mb-2">${product.category}</p>
                    <h3 class="font-display text-xl mb-2">${product.name}</h3>
                    <p class="text-light/80">$${product.price}</p>
                    <button class="btn-primary w-full mt-4 add-to-cart-btn" data-product='{"id":${product.id},"name":"${product.name}","price":${product.price},"image":"${product.image}","category":"${product.category}","color":"Default","size":"M"}'>Add to Cart</button>
                </div>
            </div>
        `;
        swiperWrapper.appendChild(slide);
    });
}

// Populate Testimonials
function populateTestimonials() {
    const swiperWrapper = document.querySelector('.testimonial-swiper .swiper-wrapper');
    
    testimonials.forEach(testimonial => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.innerHTML = `
            <div class="bg-dark p-8 rounded-lg">
                <div class="flex text-accent mb-4">
                    ${Array(testimonial.rating).fill('★').join('')}
                </div>
                <p class="text-light/80 mb-6">"${testimonial.text}"</p>
                <div>
                    <p class="font-display text-lg">${testimonial.name}</p>
                    <p class="text-accent">${testimonial.role}</p>
                </div>
            </div>
        `;
        swiperWrapper.appendChild(slide);
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    populateFeaturedProducts();
    populateTestimonials();
}); 