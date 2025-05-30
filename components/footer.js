// Footer Component for Moses Shoes & Clothing Line
document.addEventListener('DOMContentLoaded', function() {
    // Create the footer HTML
    const footer = `
    <!-- Footer -->
    <footer class="bg-primary text-neutral pt-16 pb-8">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                <!-- Column 1 -->
                <div>
                    <a href="index.html" class="text-3xl font-['Pacifico'] text-neutral mb-6 inline-block">Moses</a>
                    <p class="text-gray-300 mb-6">Timeless elegance and exceptional artisanal Liberian fashion since 2010. We create clothing and shoes that blend tradition and modernity.</p>
                    <div class="flex space-x-4">
                        <a href="https://www.facebook.com/moses.fashion" class="w-10 h-10 flex items-center justify-center rounded-full bg-dark bg-opacity-40 hover:bg-secondary transition-all">
                            <i class="ri-facebook-fill text-neutral"></i>
                        </a>
                        <a href="https://www.instagram.com/moses.fashion" class="w-10 h-10 flex items-center justify-center rounded-full bg-dark bg-opacity-40 hover:bg-secondary transition-all">
                            <i class="ri-instagram-fill text-neutral"></i>
                        </a>
                        <a href="https://www.twitter.com/moses_fashion" class="w-10 h-10 flex items-center justify-center rounded-full bg-dark bg-opacity-40 hover:bg-secondary transition-all">
                            <i class="ri-twitter-x-fill text-neutral"></i>
                        </a>
                        <a href="https://www.pinterest.com/moses_fashion" class="w-10 h-10 flex items-center justify-center rounded-full bg-dark bg-opacity-40 hover:bg-secondary transition-all">
                            <i class="ri-pinterest-fill text-neutral"></i>
                        </a>
                    </div>
                </div>
                <!-- Column 2 -->
                <div>
                    <h3 class="text-xl font-bold mb-6">Categories</h3>
                    <ul class="space-y-3">
                        <li><a href="men.html" class="text-gray-300 hover:text-tertiary transition-colors">Men</a></li>
                        <li><a href="women.html" class="text-gray-300 hover:text-tertiary transition-colors">Women</a></li>
                        <li><a href="suits.html" class="text-gray-300 hover:text-tertiary transition-colors">Suits</a></li>
                        <li><a href="shop.html" class="text-gray-300 hover:text-tertiary transition-colors">Shop</a></li>
                        <li><a href="accessories.html" class="text-gray-300 hover:text-tertiary transition-colors">Accessories</a></li>
                        <li><a href="shop.html" class="text-gray-300 hover:text-tertiary transition-colors">New Arrivals</a></li>
                    </ul>
                </div>
                <!-- Column 3 -->
                <div>
                    <h3 class="text-xl font-bold mb-6">Information</h3>
                    <ul class="space-y-3">
                        <li><a href="about.html" class="text-gray-300 hover:text-tertiary transition-colors">About Us</a></li>
                        <li><a href="contact.html" class="text-gray-300 hover:text-tertiary transition-colors">Contact</a></li>
                        <li><a href="privacy.html" class="text-gray-300 hover:text-tertiary transition-colors">Privacy Policy</a></li>
                        <li><a href="terms.html" class="text-gray-300 hover:text-tertiary transition-colors">Terms of Service</a></li>
                        <li><a href="careers.html" class="text-gray-300 hover:text-tertiary transition-colors">Careers</a></li>
                        <li><a href="faq.html" class="text-gray-300 hover:text-tertiary transition-colors">FAQ</a></li>
                    </ul>
                </div>
                <!-- Column 4 -->
                <div>
                    <h3 class="text-xl font-bold mb-6">Contact</h3>
                    <ul class="space-y-4">
                        <li class="flex items-start">
                            <div class="w-5 h-5 flex items-center justify-center text-secondary mr-3 mt-1">
                                <i class="ri-map-pin-line"></i>
                            </div>
                            <span class="text-gray-300">15 Rue de la Mode, 75008 Paris, France</span>
                        </li>
                        <li class="flex items-start">
                            <div class="w-5 h-5 flex items-center justify-center text-secondary mr-3 mt-1">
                                <i class="ri-phone-line"></i>
                            </div>
                            <span class="text-gray-300">+33 1 23 45 67 89</span>
                        </li>
                        <li class="flex items-start">
                            <div class="w-5 h-5 flex items-center justify-center text-secondary mr-3 mt-1">
                                <i class="ri-mail-line"></i>
                            </div>
                            <span class="text-gray-300">contact@moses-fashion.com</span>
                        </li>
                        <li class="flex items-start">
                            <div class="w-5 h-5 flex items-center justify-center text-secondary mr-3 mt-1">
                                <i class="ri-time-line"></i>
                            </div>
                            <span class="text-gray-300">Mon - Sat: 10h00 - 19h00<br>Sun: Closed</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="border-t border-dark pt-8">
                <div class="flex flex-col md:flex-row justify-between items-center">
                    <p class="text-gray-400 text-sm mb-4 md:mb-0">© <span id="footerCurrentYear"></span> Moses Shoes & Clothing Line. All rights reserved.</p>
                    <div class="flex items-center space-x-4">
                        <div class="w-10 h-6 flex items-center justify-center">
                            <i class="ri-visa-fill ri-lg text-gray-300"></i>
                        </div>
                        <div class="w-10 h-6 flex items-center justify-center">
                            <i class="ri-mastercard-fill ri-lg text-gray-300"></i>
                        </div>
                        <div class="w-10 h-6 flex items-center justify-center">
                            <i class="ri-paypal-fill ri-lg text-gray-300"></i>
                        </div>
                        <div class="w-10 h-6 flex items-center justify-center">
                            <i class="ri-apple-fill ri-lg text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
    `;
    
    // Insert the footer at the end of the body
    // Use insertAdjacentHTML to insert before the end of the body tag
    document.body.insertAdjacentHTML('beforeend', footer);
    
    // Set current year in footer
    document.getElementById('footerCurrentYear').textContent = new Date().getFullYear();
}); 