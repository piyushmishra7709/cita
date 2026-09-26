# CITA Bharat EV — Website

A static site for **citabharatev.com**, matching citaevcharger.in's structure,
navigation, sections, forms, and imagery — rebranded for CITA's Indian company, CITA Bharat EV
Pvt. Ltd.

## What's included
- `index.html` — Home (hero, India trust banner, solutions, product range, EV compatibility,
  why-choose-us, everyday-use icons, installation gallery, CPMS/App software, FAQ, contact CTA)
- `about.html` — About Us
- `solutions.html` — Residential / Commercial / Fleet tabs
- `products.html` — Full AC & DC charger range with anchors matching the nav dropdowns
- `installations.html` — Installation gallery
- `events.html` — Events (placeholder listings)
- `blogs.html` — Blogs & News (placeholder listings)
- `contact.html` — Quote/enquiry form (same fields as the source site)
- `css/style.css`, `js/main.js` — shared styling and behaviour (dropdown nav, FAQ accordion,
  solution tabs, form demo handler)

## Images and logo
Every logo, product photo, OEM-compatibility logo, and installation photo on this site is
**hotlinked directly from citaevcharger.in's own asset URLs** (e.g.
`https://citaevcharger.in/wp-content/uploads/...`) — the same files the UK site itself serves.
I didn't download or repackage copies of these files; the pages simply reference them at their
original address, exactly as any other page referencing an image on another domain would.
This means:
- The images will always match whatever the UK site currently has live.
- If citaevcharger.in changes or removes an image, it disappears here too.
- For a fully independent, production-safe site, you'll eventually want to **move these
  images onto citabharatev.com's own hosting** (download the files once you have CMS/admin
  access, upload them under this site's own `images/` folder, and update the `src` paths) —
  a one-time job, not urgent for launch.

## Text content
Section headings, navigation labels, product names, and page structure closely mirror the
source site. Body copy (paragraphs, FAQ answers, feature descriptions) is written fresh in my
own words — matching the same facts and order, but not copied verbatim. Since this is your own
company's site, feel free to paste in the exact official wording from citaevcharger.in anywhere
you'd prefer it word-for-word — I've kept every section clearly labelled so that's a quick
find-and-replace.

## The India trust line
On the homepage, right under the hero, there's a highlighted strip:
> "CITA Bharat EV is CITA EV (UK) in India — the same certified chargers and global
> engineering, now backed by an Indian company, Indian stock, and an Indian support team you
> can trust."

Adjust the wording freely — this is meant to reassure Indian buyers that citabharatev.com isn't
a separate/unofficial brand, but the same manufacturer operating locally.

## Hosting
Plain static site, no build step. Upload the whole folder to any host (Hostinger, cPanel,
Netlify, etc.) and point citabharatev.com's DNS at it. `index.html` is the entry point.

## Before going fully live
1. **Host the images yourself** (see above) rather than relying on hotlinking long-term.
2. **Wire up the contact form** in `contact.html` — it currently only shows a confirmation
   message client-side (`js/main.js`). Connect it to a real mailer, form service, or your CRM.
3. **Confirm contact details** — the WhatsApp number (+91 81369 55867) and email addresses are
   taken from citaevcharger.in's own published contact info, on the assumption sales/support is
   shared across both entities for now; update these once CITA Bharat EV has its own dedicated
   line, if different.
4. **Events & Blogs pages** currently have placeholder entries — replace with real content
   once available.
5. **Sub-pages for each individual charger** (e.g. a dedicated `/ac/7kw/` page like the source
   site has) aren't built out yet — the nav links to anchored sections on `products.html`
   instead. Say the word if you'd like full standalone pages per charger model.

## Design notes
- Palette matches citaevcharger.in's actual theme colors: primary blue `#046BD2` (hover
  `#045cb4`), dark slate headings `#1E293B`, body text `#334155`, light blue-grey panel
  background `#F0F5FA`, and the green `#00BC70` used for its icon accents, on a white page
  background.
- Type: Sora (headings) + Inter (body), via Google Fonts — a close, freely-licensed stand-in
  for the source site's system-font stack.
- Fully responsive, with a hover/click dropdown nav matching the source site's exact menu
  structure (Home, Solutions, Products, AC Charger, DC Charger, Installations, About, Resources,
  Contact Us), and a WhatsApp button in both the header and hero, matching the source site.
