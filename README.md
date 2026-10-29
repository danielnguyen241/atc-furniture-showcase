# ATC Luxury Furniture Showcase 2026 (Vercel & Alibaba Minisite)

Source code and modular HTML components for the **ATC Furniture 2026 B2B Showcase**.

- **Live Vercel Production:** [https://atc-furniture.vercel.app](https://atc-furniture.vercel.app)
- **Alibaba Minisite Draft ID:** `pageId=200005535089`

---

## 📁 Repository Structure

```
├── index.html                   # Complete standalone Vercel website
├── styles.css                   # Core styling and typography
├── styles-extension.css         # Extended layout & animations
├── products-data.js             # 135+ product catalogue database
├── script.js                    # Dynamic filtering & interactions
├── assets/                      # All high-res webp & svg assets
└── blocks/                      # Modular Alibaba Custom Content HTML blocks
    ├── 01_proposal_and_header.html
    ├── 02_breadcrumbs_and_category_cards.html
    ├── 03_factory_about_and_golden_stats.html
    ├── 04_signature_collections.html
    └── 05_hospitality_projects_and_values.html
```

---

## 🧱 Modular Alibaba HTML Blocks

Each file in `blocks/` is self-contained with inline styling and verified permanent Alibaba CDN media URLs, ready to be pasted directly into any Alibaba Decorator Custom Content module:

1. **`01_proposal_and_header.html`**: Executive Proposal Bar + Clean White Luxury Header with cursive gold logo and navigation.
2. **`02_breadcrumbs_and_category_cards.html`**: Breadcrumbs (`⌂ | PRODUCTS | WICKER FURNITURE`) + 6 resort category cards (Sofa Sets, Dining Sets with gold arrow button, Bistro & Bar, Sunbeds, Swing Chairs, Parasol & Others).
3. **`03_factory_about_and_golden_stats.html`**: Factory aerial photo + 40,000m² An Giang facility intro + 4 Big Golden Numbers (`20+`, `40,000`, `50+`, `40+`).
4. **`04_signature_collections.html`**: 3 Signature Export Lines (Outdoor Wicker, Outdoor Teak, Indoor Water Hyacinth).
5. **`05_hospitality_projects_and_values.html`**: International hospitality credentials (Hyatt Regency Danang, Mia Resort) + ACE-TRUST-CARE-SCALE philosophy.
