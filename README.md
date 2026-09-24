# ÉLAN

> **ÉLAN** is a premium digital editorial publication covering modern culture, fashion, beauty, entertainment, people, relationships, travel, design, luxury, and contemporary life.

---

## Creative Direction & Art Direction Triad

ÉLAN synthesizes the visual confidence and tactile prestige of international magazines into a digital-first editorial experience:

1. **Pink Couture (Primary Visual Identity)**: Layered composition, soft blush/rose warmth, subtle translucent glassveils, feminine sophistication, and typography interacting across photography boundaries.
2. **NOVA (Editorial Drama)**: Monumental high-contrast serif typography, dramatic photography, and deliberate negative space.
3. **Columns & Rows (Structural Discipline)**: Disciplined Swiss 12-column alignment, continuous live cultural feed, and asymmetric editorial pacing.

---

## Brand Palette

- **Warm Ivory (`#F5F0E8`)**: Tactile paper base across all daylight pages.
- **Ink Black (`#11100F`)**: Deep typographic anchor for headlines, rules, and contrast.
- **Élan Wine (`#751F3D`)**: **Signature Brand Colour**. Applied with strict editorial restraint for category kickers, active navigation indicators, and initial drop caps.
- **Dusty Rose (`#C98B9D`) & Soft Blush (`#EAD6D8`)**: Subdued secondary accents for quote backdrops and tags.
- **Champagne (`#C5A46D`)**: Refined metallic accents.
- **Deep Espresso (`#211B19`)**: Rich shadow tone for dark-mode features and cover stories.

---

## Core Features & Experiences

- **Streamlined Iconic Masthead**: High-contrast serif lettering with responsive scale, sticky micro-masthead on scroll, and full mobile drawer navigation.
- **Art-Directed Homepage**:
  - **The Lead Cover Story**: Controlled asymmetry (12-column grid) with overlapping serif typography and broken rectangular framing.
  - **The Continuous Dispatch**: 4-column live cultural ticker with real-time timestamps.
  - **Pink Couture Spread**: Direct homage to the visual reference with layered tulle photography and the couture doctrine.
  - **Spotlight Interview**: Dark, high-contrast feature inspired by NOVA.
  - **Beauty & Culture Duality**: Asymmetric two-story layout.
  - **Most Read (01–05)**: Numbered typographic ranking.
- **Long-Form Reading Experiences**:
  - **Standard Article (`/article/[slug]`)**: Drop caps, pull quotes, inline photo galleries, and author bio dossier.
  - **Feature Article (`/feature/[slug]`)**: Cinematic full-bleed cover and curatorial dossier.
  - **Prestige Interview (`/interview/[slug]`)**: Large portraiture, oversized quotes, Q&A speaker formatting (`ÉLAN // QUESTION` vs. subject initials), and social profile links.
- **Interactive Search (`⌘K`)**: Instant modal search with real-time filtering across titles, topics, and authors.
- **Editorial Admin CMS (`/admin`)**: Story management desk, interactive article composer with photo preview, homepage curation desk, and contributor directory.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Fonts**: `Playfair Display`, `Newsreader`, `Plus Jakarta Sans`, `JetBrains Mono` via `next/font/google`
- **Icons**: Lucide React

---

## Getting Started

First, install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

Access the Editorial Desk at [http://localhost:3000/admin](http://localhost:3000/admin).

---

## Build & Production

```bash
npm run build
npm run start
```
