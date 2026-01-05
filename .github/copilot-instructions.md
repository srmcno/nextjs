# Copilot Instructions for Water Settlement Portal

## Project Overview

This is a Next.js application that provides real-time water level monitoring for the Choctaw and Chickasaw Nations Water Settlement Agreement. The portal tracks reservoir levels and river flows across southeastern Oklahoma.

## Technology Stack

- **Framework**: Next.js 15.5+ with App Router
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS 4.x
- **UI Components**: React 18.3+
- **Charts**: Recharts for data visualization
- **Deployment**: Vercel (with Speed Insights)

## Project Structure

- `app/` - Next.js App Router pages and API routes
  - `dashboard/` - Main dashboard page
  - `game/` - Water manager simulation game
  - `settlement/` - Settlement agreement information
  - `api/` - API routes for USGS and USACE data
- `components/` - Reusable React components
- `lib/` - Utility functions and data models
  - `waterBodies.ts` - Water body definitions and thresholds
  - `mockData.ts` - Realistic mock data generation
  - `okcReservoirSystem.ts` - OKC reservoir system logic

## Coding Conventions

### TypeScript

- Use strict TypeScript with explicit types
- Define interfaces for props and data structures
- Use `type` for unions and intersections, `interface` for object shapes
- Path alias: `@/*` maps to project root

### React & Next.js

- Prefer Server Components by default
- Use `'use client'` directive only when needed (state, effects, browser APIs)
- Use Next.js App Router conventions
- File naming: lowercase with hyphens for routes, PascalCase for components

### Styling

- Use Tailwind CSS for all styling
- Custom colors defined in `tailwind.config.js`:
  - `settlement-blue`: #0284c7 (Sky-600)
  - `settlement-teal`: #0d9488 (Teal-600)
  - `settlement-navy`: #0f172a (Slate-900)
- Mobile-first responsive design
- Use system font stack for readability

### Code Organization

- Keep components focused and single-purpose
- Extract reusable logic into custom hooks or utility functions
- Co-locate related types with their components
- Use descriptive variable and function names

## Build & Development

- **Dev Server**: `npm run dev` (runs on http://localhost:3000)
- **Build**: `npm run build`
- **Production**: `npm start`
- **Lint**: `npm run lint` (must pass before committing)

## Domain-Specific Guidelines

### Water Data Handling

- USGS API may be blocked by network proxies
- Always implement fallback to mock data when API fails
- Mock data should be realistic with daily cycles and trends
- Display clear indicators when showing mock vs. real data

### Settlement Agreement Logic

- **Sardis Lake Thresholds** (defined in `lib/waterBodies.ts`):
  - Conservation pool: 599 ft
  - Summer baseline: 590 ft (Apr-Aug)
  - Winter baseline: 587 ft (Sep-Mar)
  - Drought floors: 584 ft, 580 ft, 575 ft
- **OKC Reservoir System**: Uses combined storage percentage across 6 reservoirs
- Follow Exhibit 13 specifications for withdrawal restriction calculations

### Data Visualization

- Use trend indicators (↗ rising, ↘ falling, → stable)
- Color code water levels: green (normal), yellow (caution), red (restricted)
- Show elevation in feet MSL (Mean Sea Level)
- Display flow rates in CFS (cubic feet per second)
- Convert to acre-feet where relevant

## Testing

- No test framework currently configured
- Manually test changes in development mode
- Verify mobile responsiveness for all UI changes
- Test with both real API data and mock data fallback

## Comments

- Use comments sparingly, only for complex logic
- Document settlement agreement calculations with references to exhibits
- Explain domain-specific water management concepts
- Add JSDoc comments for exported functions and complex types

## Accessibility

- Use semantic HTML elements
- Provide descriptive alt text for images
- Ensure sufficient color contrast
- Support keyboard navigation

## Performance

- Optimize images and use Next.js Image component when needed
- Minimize client-side JavaScript (prefer Server Components)
- Use React.memo for expensive computations
- Lazy load components when appropriate

## Common Pitfalls to Avoid

- Don't hardcode water thresholds; use constants from `lib/waterBodies.ts`
- Don't assume USGS API is always available; implement fallbacks
- Don't break mobile layouts; always test responsive behavior
- Don't remove TypeScript strict mode or any compiler checks
- Don't modify settlement agreement calculations without domain expert review
