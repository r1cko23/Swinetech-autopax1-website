# Swine Tech - Autopax 1 Funnel Website

A modern, responsive funnel website for Swine Tech's Autopax 1 product - an FDA Approved Organic Solution for Swine Health and Immune Support against ASF and other viruses.

## 🚀 Features

- **Fully Responsive Design** - Mobile-first approach with breakpoints for tablets and desktops
- **Semantic HTML5** - Accessible markup following W3C standards
- **Modern CSS** - Organized with CSS custom properties and BEM methodology
- **Interactive Elements** - Carousel, animations, and smooth scrolling
- **Accessibility** - ARIA labels, keyboard navigation, and screen reader support
- **Performance Optimized** - Efficient animations and lazy loading ready

## 📁 Project Structure

```
SwineTech/
├── index.html              # Main HTML file
├── styles/
│   └── main.css           # Main stylesheet with organized sections
├── scripts/
│   └── main.js            # JavaScript for interactivity
├── assets/
│   ├── homepage/          # Homepage images and CTAs
│   ├── blue cells/        # Blue cell animation assets
│   └── red cells/         # Red cell animation assets
└── README.md              # This file
```

## 🎨 Sections

1. **Header** - Sticky navigation with logo and contact information
2. **Hero Section** - Main value proposition with product image
3. **ASF Information** - Educational content about African Swine Fever
4. **Video Testimonial** - Video section with play button
5. **Mechanism Section** - How Autopax 1 works with animated cells
6. **Scientific Proof** - Carousel displaying certification documents
7. **Product Display** - Product showcase with features
8. **Administration Method** - Video demonstration section
9. **5-Day Protocol** - Usage instructions
10. **Footer** - Contact information and legal links

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Flexbox, Grid, Animations
- **Vanilla JavaScript** - ES6+ features, no dependencies
- **Google Fonts** - Inter font family

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Getting Started

1. **Open the website**
   - Simply open `index.html` in a web browser
   - Or use a local server for better performance:
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js (http-server)
     npx http-server
     ```

2. **Customization**
   - Edit `styles/main.css` for styling changes
   - Modify `scripts/main.js` for interactive features
   - Update `index.html` for content changes

## 🎯 Key Features Implementation

### Cell Animation
The mechanism section includes an animated cell display using blue cell assets. The animation is created dynamically via JavaScript.

### Carousel
The scientific proof section features a carousel with:
- Previous/Next navigation buttons
- Indicator dots
- Auto-play functionality
- Keyboard navigation support
- Pause on hover

### Responsive Navigation
- Mobile menu toggle for small screens
- Smooth scrolling for anchor links
- Sticky header for easy navigation

## 📝 Customization Guide

### Changing Colors
Edit CSS custom properties in `styles/main.css`:
```css
:root {
    --primary-color: #0b8d0b;
    --accent-blue: #1976d2;
    --accent-red: #d32f2f;
}
```

### Adding Carousel Slides
Add new slides in `index.html`:
```html
<div class="carousel__slide">
    <img src="path/to/image.png" alt="Description" class="carousel__image">
</div>
```

### Modifying Animations
Edit animation keyframes in `styles/main.css`:
```css
@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
}
```

## ♿ Accessibility Features

- Semantic HTML5 elements
- ARIA labels and roles
- Keyboard navigation support
- Focus indicators
- Alt text for all images
- Skip to main content link (ready to implement)
- Reduced motion support

## 📄 License

© Copyright 2024 Swine Tech. All rights reserved.

## 📞 Contact

- **Phone:** +63 966 946 4189
- **Email:** autopax1@swinetech.ph
- **Address:** SWINE TECH INC PHILIPPINES, Unit 202 E. Remedios St. Poblacion 3001, Pulilan, Bulacan, Philippines

## 🔧 Development Notes

- Follows mobile-first responsive design principles
- Uses CSS custom properties for easy theming
- Organized CSS with clear section comments
- JavaScript uses strict mode and IIFE pattern
- No external dependencies required
- Optimized for performance and accessibility
