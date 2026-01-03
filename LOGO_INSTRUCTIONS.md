# Logo Setup Instructions

## How to Add Your Logo

1. **Save your logo image** to the `public` folder with the name `logo.png`
   - Recommended formats: PNG (with transparent background) or SVG
   - Recommended sizes:
     - For home page: 120x120 pixels or larger (will be resized)
     - For navbar: 60x60 pixels or larger (will be resized)

2. **Supported file formats:**
   - `logo.png` (recommended)
   - `logo.jpg` or `logo.jpeg`
   - `logo.svg` (best for scalability)

3. **If using a different filename**, update these files:
   - `src/components/HomePage.js` - Change `/logo.png` to your filename
   - `src/components/Navbar.js` - Change `/logo.png` to your filename

## Current Logo Locations

The logo appears in two places:
1. **Home Page** (`src/components/HomePage.js`) - Large logo on login page
2. **Navigation Bar** (`src/components/Navbar.js`) - Small logo in top navigation

## File Structure

```
beergeel/
├── public/
│   ├── logo.png  ← Place your logo here
│   └── index.html
└── src/
    └── components/
        ├── HomePage.js  ← References /logo.png
        └── Navbar.js    ← References /logo.png
```

## Notes

- Files in the `public` folder are served from the root URL (`/`)
- The logo will automatically fallback to a placeholder if the file is not found
- For best results, use a PNG with transparent background or SVG format

