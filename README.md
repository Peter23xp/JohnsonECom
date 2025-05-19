# Johnson E-commerce Website

A modern e-commerce website with a beautiful UI and rich functionality.

## Features

- 🛒 Full cart functionality with localStorage persistence
- 🎨 Product color selection
- 📦 Bulk discounts
- 🔔 Animated notifications
- 🖼️ Product quick view modal
- 📱 Responsive design
- ✨ Modern animations and transitions

## Tech Stack

- HTML5
- CSS3 with Tailwind CSS
- Vanilla JavaScript (ES6+)
- Vite for development and building

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Project Structure

```
├── assets/
│   ├── css/
│   │   └── animations.css
│   ├── js/
│   │   └── productModal.js
│   └── images/
├── src/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── Cart.js
│       ├── Products.js
│       └── main.js
├── index.html
├── cart.html
├── men.html
├── woman.html
├── suit.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Features Documentation

### Cart System

The cart system provides:
- Add/remove items
- Quantity management
- Color selection
- Bulk discounts (10% off for 5+ items)
- LocalStorage persistence
- Animated feedback
- Cart dropdown

### Product Quick View

The product modal shows:
- Product images
- Available colors
- Stock status
- Bulk discount info
- Add to cart functionality
- Quantity selection

### Animations

- Toast notifications
- Cart icon bounce
- Modal fade-in
- Product hover effects
- Smooth transitions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request 