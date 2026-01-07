# Logo and Image Placeholder Guide

## Overview
This document explains how to replace placeholder images with official Choctaw Nation artwork according to brand standards.

## Official Logos Required

### 1. Choctaw Nation Great Seal
**Current Placeholder:** `/public/choctaw-great-seal-placeholder.svg`

**Where to obtain official artwork:**
- Contact Choctaw Nation Communications Department
- Request the "New Great Seal" official digital artwork
- Ensure you receive the four-color version for web use

**Brand Standards Requirements:**
- **Minimum Size:** 125 pixels wide for four-color version (75px for one-color)
- **File Format:** Vector (SVG, EPS, or AI) preferred; high-resolution PNG acceptable
- **Colors:** Must use official Great Seal colors:
  - Seal Blue: PMS 2925 (#009ADA)
  - Seal Red: PMS 1795 (#EF373E)
  - Seal Yellow: PMS 116 (#C9A904)
  - Brown/rope borders as specified in official artwork

**How to replace:**
1. Save official artwork to `/public/choctaw-great-seal.svg` (or `.png`)
2. Update references in:
   - `/components/Header.tsx` - Change from `choctaw-great-seal-placeholder.svg` to `choctaw-great-seal.svg`
   - `/components/Footer.tsx` - Same update

**Area of Isolation:**
- The seal must have clear space around it equal to the width of the rope border
- Do not place other graphics or text within this isolation zone
- The current implementation respects this with appropriate padding

---

### 2. Division of Legal & Compliance - Department of Natural Resources Logo

**Current Placeholders:**
- Horizontal: `/public/cno-dept-natural-resources-logo-placeholder.svg`
- Stacked (mobile): `/public/cno-dept-natural-resources-logo-stacked.svg`

**Where to obtain:**
- Contact Choctaw Nation Division of Legal & Compliance
- Request Department of Natural Resources - Water Program logo
- Need both horizontal and stacked/centered layouts

**Brand Standards Requirements:**

**Typography:**
- "Choctaw Nation" - **Gill Sans Bold**
- "Division of Legal & Compliance" - **Gill Sans Bold**
- "Department of Natural Resources" - **Gill Sans Light** in Brown (#421400)
- "Water Resource Management" / "Environmental Protection Services" - **Gill Sans Regular** in Green (#00853E), positioned one line space below department name

**Colors:**
- Primary text: PMS 4625 Brown (#421400)
- Program descriptor: PMS 356 Green (#00853E)
- Great Seal: Full four-color version as part of logo

**Layout Options:**
1. **Horizontal (Flush Right):** For desktop header, wider spaces
2. **Stacked/Centered:** For mobile screens, limited horizontal space

**How to replace:**
Currently these are used in:
- Header component (responsive - could show horizontal on desktop, stacked on mobile)
- Footer component

To update, simply replace the SVG files with official artwork maintaining the same filenames, or update the file references if different naming is preferred.

---

## Decorative Graphics

### Feathers Graphic
**Current File:** `/public/choctaw-feathers-graphic.svg`

**Usage:** Decorative supergraphic element per brand standards
- Used in hero section background, bleeding off edge
- Should be cropped for maximum visual impact
- Appears at 10% opacity to not overwhelm content

**Brand Standards Note:**
The feathers graphic is recommended in the brand manual as a large visual element. It should:
- Be cropped strategically
- "Bleed" off the edges of the layout
- Create visual interest without competing with content
- Use brand colors (Green #00853E and Brown #421400)

If official artwork is provided, replace the current placeholder with higher-quality version from Communications Department.

---

## Photography Guidelines

While not currently implemented with specific images, the brand standards recommend:

**Themes to capture:**
- Faith, family, and culture of the Choctaw Nation
- Oklahoma landscape - land, rivers, natural resources
- Settlement area water bodies (Sardis Lake, Kiamichi River, etc.)
- Wildlife and recreation at the lakes

**Quality standards:**
- High resolution (minimum 1920px wide for hero images)
- Professional photography preferred
- Should reflect authentic representation of the Nation and region

**Potential locations for photos:**
- Hero section background (instead of or in addition to feathers graphic)
- Settlement information section
- About pages
- Dashboard header

---

## Color Usage Reference

### Official Choctaw Nation Brand Colors (Web)

| Color Name | Pantone | HEX | RGB | Usage |
|------------|---------|-----|-----|-------|
| Primary Brown | PMS 4625 | #421400 | 66, 20, 0 | Primary branding, text |
| Natural Resources Green | PMS 356 | #00853E | 0, 133, 62 | Department/program identifier |
| Great Seal Blue | PMS 2925 | #009ADA | 0, 154, 218 | Seal, accent |
| Great Seal Red | PMS 1795 | #EF373E | 239, 55, 62 | Seal, critical alerts |
| Great Seal Yellow | PMS 116 | #C9A904 | 201, 169, 4 | Seal, warnings |

### Background Colors
- **Primary:** White (#FFFFFF) for high contrast and clarity
- **Secondary:** Very light gray (#F9FAFB) for subtle section separation

---

## Implementation Checklist

When official artwork is received:

- [ ] Verify artwork meets brand standards (colors, typography, dimensions)
- [ ] Save files to `/public` directory with appropriate names
- [ ] Update component references in Header.tsx and Footer.tsx
- [ ] Test on multiple screen sizes (desktop, tablet, mobile)
- [ ] Verify area of isolation around Great Seal is maintained
- [ ] Check that minimum size requirements are met (125px for seal, 120px for consumer logos if applicable)
- [ ] Ensure logos are crisp on high-DPI displays (use SVG when possible)
- [ ] Verify accessibility (alt text, proper contrast ratios)

---

## Contact Information

**For official artwork requests:**
- Choctaw Nation Communications Department
- Division of Legal & Compliance
- Department of Natural Resources

**Artwork should include:**
1. Vector files (SVG, EPS, AI)
2. High-resolution raster files (PNG with transparency)
3. Usage guidelines specific to this application
4. Approval for web use

---

## Technical Notes

### Current Implementation
The placeholder graphics use:
- SVG format for scalability
- Inline brand colors matching the standards
- Proper typography specifications
- Appropriate sizing and spacing

### When Replacing
- Maintain same file structure
- Keep responsive behavior (different layouts for mobile/desktop)
- Preserve accessibility features (alt text, semantic HTML)
- Test in all major browsers
- Verify performance (file size optimization)

---

## Questions?

If you need clarification on brand standards or logo usage:
1. Consult the Choctaw Nation Brand Standards Manual
2. Contact the Communications Department for approval
3. Refer to this document for technical implementation guidance

**Last Updated:** December 2025
**Maintained by:** Water Resource Management Web Development Team
