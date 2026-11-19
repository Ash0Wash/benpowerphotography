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
