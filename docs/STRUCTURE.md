# Project Structure

This document describes the clean, reusable folder structure of the Swine Tech project.

## Directory Structure

```
SwineTech/
├── public/                 # Public-facing files (web root)
│   ├── assets/            # All image assets organized by section
│   │   ├── Footer/
│   │   ├── Infographic/
│   │   ├── Navi Section/
│   │   ├── Order Form/
│   │   └── Section 1-8/
│   ├── favicons/          # All favicon files
│   ├── logos/             # Logo source files (.ai, .png, .jpg)
│   ├── videos/            # Video files (if any)
│   ├── styles/            # CSS stylesheets
│   ├── scripts/           # JavaScript files
│   ├── home/              # Home page
│   ├── Learn/             # Learn/Infographics page
│   ├── Order/             # Order pages
│   │   └── bulk/          # Bulk order page
│   ├── index.html         # Main index
│   ├── infographics.html  # Legacy redirect
│   ├── order-form.html    # Legacy redirect
│   ├── bulk-order.html    # Legacy redirect
│   └── vercel.json        # Vercel deployment config
│
├── docs/                  # Documentation files
│   ├── README.md
│   ├── STRUCTURE.md       # This file
│   ├── SUPABASE_*.md
│   ├── TESTING.md
│   └── ...
│
├── config/                # Configuration files
│   └── mcp-config.json
│
├── tests/                 # Test files
│   └── *.spec.js
│
├── scripts/               # Build/utility scripts (if any)
│
├── node_modules/          # Dependencies
├── package.json
├── package-lock.json
└── playwright.config.js   # Playwright test configuration
```

## Key Principles

1. **Separation of Concerns**: Public files are in `public/`, documentation in `docs/`, config in `config/`
2. **Organized Assets**: All assets are grouped logically (favicons, logos, videos, section assets)
3. **Clean Root**: Root directory only contains essential config files
4. **Reusable Structure**: Easy to understand and maintain

## File Paths

### HTML Files
- Root HTML files: `public/index.html`, `public/infographics.html`, etc.
- Subdirectory pages: `public/home/index.html`, `public/Learn/index.html`, etc.

### Assets
- Images: `public/assets/[Section Name]/`
- Favicons: `public/favicons/`
- Logos: `public/logos/`
- Videos: `public/videos/`

### Styles & Scripts
- CSS: `public/styles/`
- JavaScript: `public/scripts/`

## Updating Paths

When referencing files in HTML:
- From root: `assets/...`, `styles/...`, `scripts/...`, `favicons/...`
- From subdirectories: `../assets/...`, `../styles/...`, etc.

## Generating Favicons

To generate new favicons from the iconic logo:

```bash
cd public/scripts
node generate-favicon.js
```

This will create favicon files in `public/favicons/` with white backgrounds.

## Deployment

The `public/` directory serves as the web root. Vercel configuration is in `public/vercel.json`.
