# CITA Bharat EV — website (flat structure)

Static site for **citabharatev.com**, laid out for GitHub Pages with **all files in the repository root**
(no sub-folders). Every link is a plain `page.html`.

## Files
- Pages: `index`, `about`, `solutions`, `products`, `ac`, `dc`, `hardware`, `software`, `installations`,
  `events`, `blogs`, `quote` (contact / get-a-quote), `privacy-policy`, `terms-and-condition`, `disclaimer`
- Charger pages: `7kw`, `11kw`, `22kw`, `44kw`, `cita-dual-ecopillar`, `cita-smart-dc-30`, `cita-smart-dc-eco`, `cita-smart-dc-pro`
- Solution pages: `ev-charger-for-residential`, `ev-charger-for-commercial`, `ev-charger-for-fleets`
- `contact.html` — redirects to `quote.html`
- `cita-site.css` / `cita-site.js` — shared header, mobile menu, floating WhatsApp button, responsive fixes
- `CNAME`, `.nojekyll`

## Contact number
Call / WhatsApp: **+91 70204 04346** (WhatsApp link: `https://api.whatsapp.com/send?phone=917020404346`).
To change it again, search all files for `917020404346` and `70204 04346`.

## Header / menu
The header is the same block of HTML at the top of every page (GitHub Pages has no includes). If you edit
the menu, copy the `<header class="cita-header">…</header>` block into each page.

## Still to do before going fully live
- Images, fonts and the Elementor/WordPress styles are still loaded from citaevcharger.in — move them onto your own hosting when you can.
- The enquiry form (`quote.html`, home page) posts to the old WordPress server and will not work on GitHub Pages; connect it to a form service (Formspree, Web3Forms, etc.).
- "Datasheet" / "User Manual" buttons open a WhatsApp chat asking for the file; replace with direct PDF links once you have them.
