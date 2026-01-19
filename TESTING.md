# Testing Guide for Swine Tech Funnel Website

## Overview

This project includes comprehensive Playwright tests to ensure the website matches the reference design from `Swine Tech_Funnel Web_Assets.jpg`.

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests with UI (Interactive Mode)
```bash
npm run test:ui
```

### Run Tests in Headed Mode (See Browser)
```bash
npm run test:headed
```

### Run Visual Tests Only
```bash
npm run test:visual
```

### View Test Report
```bash
npm run test:report
```

## Test Coverage

### UI Tests (`tests/ui-test.spec.js`)

1. **Header & Navigation**
   - Logo display
   - Navigation links
   - Phone number

2. **Hero Section**
   - Heading with red text ("Herd" and "Livestock")
   - Subtitle content
   - CTA button
   - Product image

3. **ASF Section**
   - Red background
   - Heading text
   - CTA button

4. **Video Testimonial**
   - Heading text
   - Video player
   - Play button

5. **Mechanism Section**
   - Heading
   - Swine Derived Glycoprotein text
   - Benefits list (3 items)
   - Red CTA button

6. **Proof Section**
   - Heading with red text ("Red Zones" and "Lab")
   - Carousel functionality
   - Navigation controls

7. **Product Section**
   - Heading
   - Product images
   - Feature icons and titles

8. **Admin Section**
   - Heading with blue text ("No Needles Required")
   - Video player

9. **Protocol Section**
   - Red heading ("5-Day Protocol")
   - Protocol instructions
   - Note text

10. **Footer**
    - Logo and brand
    - Address (correct format)
    - Contact information
    - Legal links

11. **Responsive Design**
    - Mobile viewport testing
    - Layout adjustments

12. **Accessibility**
    - ARIA labels
    - Semantic HTML
    - Heading hierarchy

13. **Image Loading**
    - All images load correctly
    - No broken images

### Visual Tests (`tests/visual-test.spec.js`)

Captures screenshots for visual comparison:
- Full page screenshot
- Individual section screenshots
- Mobile view (375x667)
- Tablet view (768x1024)
- Desktop view (1920x1080)

Screenshots are saved to `test-results/` directory.

## Design Verification Checklist

Based on the reference image, the following elements have been verified:

- ✅ Hero heading: "Herd" and "Livestock" in red
- ✅ Mechanism section: "Swine Derived Glycoprotein" text
- ✅ Benefits: Exact text matches reference
- ✅ Proof section: "Red Zones" and "Lab" in red
- ✅ Product features: Proper icons (not emojis)
- ✅ Admin section: "No Needles Required" in blue
- ✅ Protocol section: "5-Day Protocol" in red
- ✅ Footer: Correct address and email format
- ✅ All CTA buttons: Correct colors (blue, red, black)
- ✅ Responsive design: Mobile-first approach

## Continuous Testing

Tests can be integrated into CI/CD pipelines. The test suite runs in approximately 3-8 seconds depending on the number of workers.

## Troubleshooting

If tests fail:
1. Ensure all assets are in the correct directories
2. Check that `index.html` is accessible
3. Verify Playwright browsers are installed: `npx playwright install`
4. Check browser console for JavaScript errors
5. Review test output for specific failure details

## Visual Comparison

To compare the website with the reference image:
1. Run visual tests: `npm run test:visual`
2. Open screenshots in `test-results/` directory
3. Compare with `Swine Tech_Funnel Web_Assets.jpg`
4. Adjust CSS/HTML as needed
5. Re-run tests to verify fixes
