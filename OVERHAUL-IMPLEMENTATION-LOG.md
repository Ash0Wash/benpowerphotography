# Ben Power Photography — Overhaul & CRO Implementation Log

> **Date:** November 19, 2026
> **Site:** benpowerphotography.com
> **Tech Stack:** Next.js 16 (App Router) + React 19 + Vanilla CSS (custom properties) + Vercel
> **Working Directory:** `c:\Users\theda\Documents\antigravity\Photo Site\Overhaul Site`

---

## 🚀 SUMMARY OF ALL WORK COMPLETED

### 1. New High-Converting Pages
- **`/services`** (`app/services/page.js`):
  - Package 1: **Turnkey Tour Stop Photo Pack ($650 – $900)** with 8:00 AM next-day hero delivery, 35+ full gallery within 48h, full commercial buyout rights, and bonus editorial syndication on Not On Stage (`notonstage.com`).
  - Package 2: **Band Press & EPK Portrait Session ($750 – $1,200)** for album rollouts, Spotify Canvas, and press releases in LA & San Diego.
  - Package 3: **Creative Portrait Session ($450 – $650)** for musicians, models, and creators.
  - Package 4: **Festival & Multi-City Tour Retainer (Custom Quote)**.
  - **The Not On Stage Advantage Section:** Showcases 970+ concerts documented, 400,000+ monthly views, 8:00 AM turnaround, 100% hand-edited frames (zero batch presets), and full commercial buyout rights.
  - **4-Step Tour Stop Process:** Advance & Hold → Show Night Coverage → 8:00 AM Express Selects → Full High-Res Archive.

- **Artistic Positioning & Unmaintained Presets:** The site rejects generic preset selling. Hand-editing every single frame is highlighted as a premium competitive differentiator across Services, Contact, and About. Per user preference, the `app/presets/` files are preserved as an unmaintained, dormant directory (deliberately omitted from navigation, footer, sitemap, and schema).

### 2. High-Converting Interactive Booking System
- **`/contact`** (`app/contact/page.js` & `app/contact/layout.js`):
  - Replaced the plain mailto link with a high-converting client intake engine.
  - Fields included:
    - `name` (Your Name)
    - `email` (Email Address)
    - `Artist / Project Name`
    - `Shoot Type` dropdown (Concert Tour Stop, Band Press & EPK, Creative Portrait, Festival Retainer, Commercial Event)
    - `Target Date(s)` (Shoot date or tour routing)
    - `City / Venue` (e.g., The Wiltern, Los Angeles, SOMA San Diego)
    - `Estimated Budget Tier` interactive radio selector pills ($500–$1k, $1k–$2.5k, $2.5k+)
    - `Project Details & Creative Vision` textarea
  - Query parameter support: e.g., `/contact?service=tour-stop` auto-selects the right package and budget tier.
  - Delivered directly to `contact@benpowerphotography.com` via FormSubmit.co AJAX.
  - Left-hand sidebar reinforces the 8:00 AM delivery SLA and Not On Stage editorial backing.

### 3. Authority & Social Proof Banner (Homepage)
- **`app/page.js`**:
  - Prominently positioned credibility bar: **"Lead Photographer & Co-Owner at Not On Stage (notonstage.com)"** (970+ published concert galleries, 400,000+ monthly views).
  - Showcases verified artists photographed from Ben's active site galleries:
    *Cage the Elephant, Wet Leg, Ken Carson, Isabel LaRosa, Bladee, X Ambassadors, Maggie Lindemann, Hinds, Panchiko, Turnover, Underscores, Snow Strippers, glaive, Tiffany Day, Bibi, Yena, Malcolm Todd, Ari Abdul, Hope Tala*.
  - Direct backlink to the concert archive: `https://notonstage.com/coverage`.
  - Added hero dual CTAs ("Tour Packages & Pricing" + "View Portfolio") and a Tour Stop quick-feature card.

### 4. Local SEO & JSON-LD Schema
- **`app/layout.js`**:
  - Title Tag: `"Ben Power Photography | Los Angeles & San Diego Concert & Music Portrait Photographer"`
  - Meta Description: `"High-energy concert photography, band press portraits, and tour visual packages in Los Angeles and San Diego. Lead Photographer at Not On Stage."`
  - Keywords: `Los Angeles concert photographer`, `San Diego live music photographer`, `tour photographer Southern California`, `band press photographer LA`, `music festival photographer California`, etc.
  - Structured Data (JSON-LD):
    - `Person` (Ben Power, jobTitle, worksFor: Not On Stage, sameAs)
    - `ProfessionalService` / `LocalBusiness` / `Photographer` with `areaServed` (Los Angeles, San Diego, Southern California) and `hasOfferCatalog` specifying pricing and deliverables for all 4 packages.
    - `WebSite` schema.

### 5. Navigation & Sitemap
- **`app/components/ClientNav.js`**: Added `Services` and `Presets` to both desktop navbar and mobile overlay menu.
- **`app/sitemap.js`**: Added `/services` (priority 0.95), `/presets` (0.8), `/work/street-photography`, and `/work/cars`.
- **`app/about/page.js`**: Reverted to original authentic tone, seamlessly weaving in the Not On Stage co-ownership and 970+ published galleries without corporate marketing speak. Expanded FAQPage schema retained for search indexing.

### 6. Design System & CSS Additions
- **`app/globals.css`**: Appended all styles for `.authority-banner`, `.services-grid`, `.service-card`, `.booking-form-wrap`, `.budget-tier-label`, and `.preset-hero` using existing dark luxury design tokens (`--bg-primary: #0a0a0a`, `--accent: #c9a96e`, Playfair Display / Inter).

---

## 📁 FILES MODIFIED & CREATED

```
Overhaul Site/
├── app/
│   ├── about/page.js              (Updated bio & FAQ schema)
│   ├── components/ClientNav.js    (Added Services & Presets to nav)
│   ├── contact/
│   │   ├── layout.js              (Booking-focused metadata)
│   │   └── page.js                (Interactive Booking Form)
│   ├── globals.css                (Added all styling for services, booking, banner, presets)
│   ├── layout.js                  (Updated SEO metadata, JSON-LD tri-schema)
│   ├── page.js                    (Added Authority Banner & Tour Stop CRO card)
│   ├── presets/
│   │   └── page.js                (NEW: $29 Preset Pack product page)
│   ├── services/
│   │   └── page.js                (NEW: Services & Tour Packages page)
│   └── sitemap.js                 (Updated with new routes)
```

## 🎨 EDITORIAL "DE-AI" DESIGN SYSTEM REFINEMENT (November 19, 2026)

Following creative review, the entire site was purged of generic "AI SaaS" tropes:
- **Removed:** SaaS pricing tables, green checkmark bullet icons (`✓`), "Most Popular" floating pill badges, numbered process cards ("01, 02, 03..."), metric counter boxes ("970+"), and boxed SEO keyword essays.
- **Implemented:**
  1. **Homepage:** Replaced the gray bubble tags with a sleek, high-end editorial credits bar featuring verified artists shot (Cage the Elephant, Wet Leg, Ken Carson, Bladee, etc.) and a clean `Not On Stage ↗` link. Replaced the clunky SEO dumpster with an understated, natural 2-sentence closing statement.
  2. **Services (`/services`):** Converted packages into an **Editorial Rate Sheet** with clean typographic hierarchy, direct candid language, and the 8:00 AM delivery guarantee.
  3. **Contact (`/contact`):** Replaced the corporate guarantee checklist with an authentic, direct sidebar note from Ben emphasizing next-morning delivery, commercial rights, and 100% hand-edited craftsmanship.
  4. **About (`/about`):** Written entirely in Ben's first-person voice ("I", "my") without corporate agency puffery.

---

## 6. High-Resolution Homepage Hero & Press Favorites Indexing

### User Request
- Eliminate hero background pixelation on high-DPI displays.
- Pull original master exports from external SSD (`F:\hopefully temp\Edits`) with strict **READ-ONLY** safety.
- Restrict homepage hero rotation exclusively to Ben's curated favorites in the Press directory (`app/press/image-order.json`).

### Implementation Details
- **SSD Master Match & Upscale (24 Images):**
  - Read directly from `F:\hopefully temp\Edits\` (Ken Carson, Isabel LaRosa, glaive, Tiffany Day, Yena, Bibi).
  - Generated 2880px wide WebP assets (`public/images/hero/press-*.webp`) at quality 90, preserving the full resolution of the 60MP Sony camera sensor edits (up to 4318px vertical).
- **Press Favorites Upscale (31 Images):**
  - Upscaled remaining press favorites (Cage the Elephant, Wet Leg, Malcolm Todd, X Ambassadors, Panchiko, Underscores, Snow Strippers, Skating Polly, Hinds, Maggie Lindemann, Bladee, Kawai, Brooke) to 2880px using Lanczos3 interpolation with unsharp mask filtering.
- **Hero Image Randomizer:**
  - `app/page.js` `heroImages` array updated to rotate across all 55 unique press favorites.
  - Added custom `objectPosition` styling (e.g. `center 30%`, `center 35%`, `center 40%`) to keep performer faces and stage composition perfectly framed across all screen ratios.
- **Next.js Quality & Device Sizing Configuration:**
  - Expanded `deviceSizes` in `next.config.mjs` up to `[... 2048, 2560, 2880, 3840]` so Next.js never caps 1440p or 4K Retina screens.
  - Added `qualities: [75, 85, 90]` and passed `quality={90}` in `HeroBackground.js` to eliminate macroblocking on dark concert gradients.

---

## 7. Hero Load Flash Elimination, Landscape Framing & Kawai Portraits

### Issues Addressed
1. **Initial Flash of Bibi Image:**
   - Previous client-side hydration initialized state to `images[0]` (Bibi) before firing a `setTimeout` inside `useEffect` to pick a random image. This caused the browser to download and render Bibi first, then swap to the new random image seconds later.
   - Fixed by removing client-side delay entirely and enabling `export const dynamic = 'force-dynamic'` in `app/page.js`. The server selects the random hero image on each request and bakes it directly into the initial HTML payload. The browser preloads the chosen image on line 1 with zero flash, zero double-downloading, and zero layout shift.
2. **Crowd Shot Removal:**
   - Identified and cut out barricade crowd shots (e.g. Panchiko crowd shots and Glaive crowd shots) from the homepage roller per user request.
3. **Landscape Concert Framing:**
   - Replaced portrait-oriented live concert shots with wide 3:2 and 16:9 landscape framing (Ken Carson, Isabel LaRosa, glaive, Tiffany Day, Thee Sacred Souls, Rainbow Kitten Surprise, Yena, Bladee, Cage the Elephant, Wet Leg, X Ambassadors, Maggie Lindemann, Snow Strippers, Skating Polly). This eliminates vertical cropping issues on widescreen desktop and laptop displays.
4. **Kawai Portraits Preserved:**
   - Retained all curated Kawai artist portraits (`press-kawai-01.webp`, `press-kawai-13.webp`, `press-kawai-19.webp`, `press-kawai-21.webp`) with top-anchored framing (`objectPosition: 'center 20%'`) to keep facial framing intact.

---

## 8. Directory Thumbnail Architecture (Matched Framing & 2880px Upscales)

### User Direction
- Utilize the pre-formatted thumbnail covers from every concert and portrait gallery directory on the site.
- Preserve the exact landscape framing already tuned on `/work/concerts` (e.g. `bibi-sogang`: `top`, `yena-sogang`: `center 40%`, others: `center`).
- Remove custom top-anchor offsets on Kawai portraits; use clean standard framing (`center`).
- Strictly exclude `prom` and `animals` directories.
- Upscale all directory thumbnails to 2880px master WebP files.

### Implementation
- Generated 33 master 2880px WebP assets (`public/images/hero/thumb-*.webp`):
  - 25 concert thumbnails: `glaive`, `tiffany-day`, `isabel-larosa`, `ken-carson`, `bibi-sogang`, `yena-sogang`, `maggie-lindemann`, `snowstrippers`, `party`, `ari`, `bladee`, `malcolm`, `cte`, `wetleg`, `skatingp`, `hinds`, `xambassadors`, `panchiko`, `aron`, `turnover`, `underscores`, `hopetala`, `slowtide-backyard`, `tpb`, `slowtide-bbb`.
  - 3 non-prom/animal portrait gallery covers: `brooke`, `kendi`, `slowtide`.
  - 5 full Kawai portraits: `kawai-cover`, `kawai-01`, `kawai-13`, `kawai-19`, `kawai-21` (all with clean standard `center` framing).
- Verified with `export const dynamic = 'force-dynamic'` for instant first-frame SSR delivery and 0-error ESLint validation.
