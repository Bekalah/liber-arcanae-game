# Museum-Grade Policy (ND-safe • Responsive • Provenance)

- **Images:** originals in `assets/originals/`; outputs in `assets/img/`
  - Formats: AVIF/WEBP + JPEG fallback, sizes 1280, 1920.
  - Use `<picture>` with `type="image/avif|webp"` + width `w` descriptors and **sizes**. (MDN)  <!--  [oai_citation:4‡MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture?utm_source=chatgpt.com) -->
- **Accessibility:** no flashing > 3/sec; honor `prefers-reduced-motion`. (WCAG 2.3.1) <!--  [oai_citation:5‡Boia](https://www.boia.org/wcag2/cp/2.3.1?utm_source=chatgpt.com) -->
- **CSP:** static meta policy now; upgrade to header later when you add a server. (MDN) <!--  [oai_citation:6‡MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP?utm_source=chatgpt.com) -->
- **Provenance:** each asset tracked by ID in `assets/ASSET_CATALOG.json`; source, license kept in your research scrolls.
- **Performance:** track budgets with Lighthouse CI; fail CI on regression. <!--  [oai_citation:7‡GitHub](https://github.com/treosh/lighthouse-ci-action?utm_source=chatgpt.com) -->
- **Links:** nightly link check via Lychee. <!--  [oai_citation:8‡GitHub](https://github.com/lycheeverse/lychee-action?utm_source=chatgpt.com) -->
