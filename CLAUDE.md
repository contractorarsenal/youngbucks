# CLAUDE.md — Young Bucks Landscaping Website

Project instructions for Claude Code. Facts here come from the repository files as of commit `dd9d3ce` on `main`. Re-verify before relying on anything that could have changed.

## 1. Business

- **Client:** Young Bucks Landscaping LLC (also written "Young Bucks Landscaping & Tree Service" in schema markup)
- **Location:** Wenatchee, Washington
- **Address:** 4182 Highway 97A, Bldg 3, Wenatchee, WA 98801
- **Phone:** (509) 470-5684 (`tel:+15094705684`)
- **Email:** info@youngbucksllc.com (see Known Issues: domain mismatch)
- **Founded:** not verified. Earlier site copy said 2013; the claim was removed pending owner confirmation.
- **Service areas (schema and internal marketing plan (not in this repository)):** Wenatchee, East Wenatchee, Cashmere, Leavenworth, Rock Island, Malaga, Monitor
- **Services:** tree removal and trimming, emergency tree service, stump grinding, paver patios and hardscapes, retaining walls, irrigation, sprinkler blowouts and winterization, landscaping, drainage (internal marketing plan (not in this repository))
- **Brand voice (internal marketing plan (not in this repository) §10):** direct, confident, blue-collar professional. Avoid vague superlatives, "passionate about," and exclamation points except for urgent content.

### Business claims requiring owner verification

Do not add, strengthen, or change these without client confirmation:
- "Licensed, bonded & insured" (appears on multiple pages; no license number is shown)
- "Since 2013" / "12+ years"
- "24/7 emergency tree service"
- "Respond within one business day" (quote-modal success message)
- Stats from the internal marketing plan (jobs, reviews) are unverified and are not published on the site.
- Seasonal sprinkler promotion in the promo popup (`index.html`)

## 2. Architecture

Static site. No framework, no build step, no package.json, no dependencies to install.

| Path | Purpose |
|---|---|
| `index.html` | Homepage: hero, emergency banner, service cards, reviews carousel, consultation form, JSON-LD (HomeAndConstructionBusiness) |
| `about.html` | About / story |
| `services.html` | Services hub |
| `tree-removal.html` | Tree removal, emergency service, trimming, stump grinding |
| `hardscapes-pavers.html` | Paver patios, outdoor living, drainage |
| `retaining-walls.html` | Retaining walls |
| `irrigation.html` | Irrigation systems |
| `sprinkler-winterization.html` | Sprinkler blowouts and winterization (not in internal marketing plan (not in this repository) sitemap) |
| `contact.html` | Contact page with lead form |
| `css/style.css` | All site styling (shared) |
| `js/main.js` | All interactions (shared): quote modal, forms, nav, drawer, carousels, slider, promo, analytics helpers |
| `js/reviews-data.js` | Single source of review testimonials (16 entries, 9 `featured`) |
| `assets/` | Local images: `logo.png`, `photos.jpeg`, `project-retaining-wall.jpeg`, `young-bucks-father-son-founders.jpg`, `young-bucks-mascot.png` |
| `sitemap.xml` | Lists all 9 pages |
| `robots.txt` | Allows all; points to sitemap |
| the internal marketing plan (kept outside this repository) | SEO, local-SEO, and marketing plan (internal document) |
| `.gitignore` | Ignores `.DS_Store`, `node_modules/`, `*.log` |

Every page loads `css/style.css` and `js/main.js`. On `index.html`, `js/reviews-data.js` loads before `js/main.js`; confirm the same order on any other page before relying on it.

### Shared behavior in `js/main.js`

- **Mobile navigation:** drawer with focus trap and Escape-to-close; floating action button shows after 400px of scroll.
- **Sticky nav:** adds `.scrolled` after 40px.
- **Emergency banner:** static markup (see `index.html` and `tree-removal.html`).
- **Reviews:** homepage carousel uses `featured` reviews, rotating every 7 seconds. Service subpages use `[data-review-mount data-tags="..." data-count="..."]`, which selects reviews by tag overlap.
- **Before-and-after slider:** drag/pointer-based split view.
- **Promo popup:** seasonal sprinkler promotion on `index.html`. Dismissal is stored in `sessionStorage` (wrapped in try/catch).
- **Analytics helpers:** `track()` calls `gtag` if loaded; `trackClarity()` calls `clarity` if loaded. Both are safe no-ops otherwise.

## 3. Lead Forms and Web3Forms

All lead forms POST to `https://api.web3forms.com/submit`.

- **Access key:** a constant named `WEB3FORMS_ACCESS_KEY` in `js/main.js` (near the top of the file). The HTML hidden `access_key` inputs are empty; the JS sets the key at submit time. The key's value must never be printed or copied into documentation or chat.
- **Quote modal (`submitQuote` in `js/main.js`, ~line 572):** multi-step modal opened from CTAs across the site. Fields: ZIP, service, timeline, details, first name, last name, phone, email. Sent as `FormData` via `fetch`.
  - Success (`res.success === true`): renders the thank-you step, fires GA4 `generate_lead` (with `page_path` and `service`) and Clarity `quote_submit`.
  - Failure or network error: shows an inline message with a "Call Now" link.
- **Homepage and contact forms:** use the page-form handler in `js/main.js`. Reviewed 2026-10-26 with mocked submissions (see section 10).
- **Known gap:** internal marketing plan (not in this repository) expects `/thank-you.html`. It does not exist, and the JS handles success inline.

## 4. Analytics and Tracking

- **GA4:** `G-LSB6EFKQEE`, loaded on all 9 pages
- **Microsoft Clarity:** `yfqkh3k3ck`, loaded on all 9 pages
- No Google Tag Manager container and no Meta Pixel were found.
- Do not change tracking IDs or event names without explicit instruction.

## 5. SEO, Schema, and Metadata

- Each page has a unique `<title>` and a canonical link.
- `index.html`: HomeAndConstructionBusiness JSON-LD with address, telephone, areaServed, and makesOffer.
- Service pages: Service JSON-LD with the business as provider.
- `sprinkler-winterization.html`: FAQPage JSON-LD block.
- No AggregateRating is present. internal marketing plan (not in this repository) recommends adding it only with real values.
- internal marketing plan (not in this repository) specifies `LandscapeService`; the actual markup uses `HomeAndConstructionBusiness`. Do not change schema types without review.
- `sitemap.xml` lists 9 URLs on `https://www.youngbuckslandscapingllc.com/`. Keep the sitemap in sync when pages are added.

## 6. GitHub and Deployment

- **Repository:** `contractorarsenal/youngbucks` (public), https://github.com/contractorarsenal/youngbucks
- **Production-connected branch:** `main`
- **Hosting:** GitHub Pages, legacy build from `main` at root (`/`). The build is automatic on every push to `main`.
- **Current published URL:** https://contractorarsenal.github.io/youngbucks/
- **Confirmed production website (owner, 2026-10-26):** https://www.youngbuckslandscapingllc.com/. It is live today behind Cloudflare, and its homepage matched `main` at `dd9d3ce` apart from Cloudflare's email-obfuscation rewrites. Its origin is not verified: GitHub Pages has no custom domain configured, and Cloudflare settings are not accessible from this repo.
- **Do not claim** that a push updates www.youngbuckslandscapingllc.com until the public URL has been fetched and checked after the push. A successful Git push is not proof of deployment.
- **Git:** initialized locally by onboarding. `origin` points to the repository above. `main` tracks `origin/main`. Repo-local identity is set; global config is unchanged. `.DS_Store` is in `.git/info/exclude`.
- **Other branches:** `production-finalization` is fully merged into `main` (historical).
- **Workflow:** prefer feature branches for development. Every push to `main` publishes the site.
- **Never:** force-push, discard uncommitted changes, rewrite history, merge without authorization, or modify DNS or hosting without explicit approval.

## 7. Remote Development Commands

- **"Check website"**: read-only inspection; report issues. Do not edit files.
- **"Update website"**: implement requested changes locally and verify them. Do not commit or push unless asked.
- **"Push live"**: review changes, verify them, and push to `main` only after explicit authorization. Remember this publishes to GitHub Pages.
- **"Status"**: report the current branch, latest commit, working tree state, and outstanding issues.
- **"Refresh context"**: review recent Git changes and relevant documentation. Do not rescan the whole repository.

## 8. Development Rules

- **Preserve existing functionality:** mobile navigation, emergency banner, multi-step quote modal, Web3Forms submission, review carousel, before-and-after slider, promo popup, GA4 and Clarity tracking, and the existing SEO structure.
- **Do not redesign** or remove functionality unless explicitly instructed.
- **Reviews and testimonials:** check every quote against `js/reviews-data.js` before modifying review content. Only real Google reviews belong there (per the file's header). Never hardcode a quote into page markup.
- **Business information:** do not invent facts. Use only repository content or client-confirmed information.
- **Images:** several images load from GitHub user-attachments URLs (about 20 distinct). Do not replace them without confirming the new source is durable.
- **Low-token habits:** read this file first; inspect only relevant files; avoid full-repo scans and unnecessary agents; keep reports concise.

## 9. Known Issues (Outstanding, Not Auto-Fixed)

1. **Production origin unverified.** `www.youngbuckslandscapingllc.com` is live through Cloudflare, but how Cloudflare reaches the code (GitHub Pages or otherwise) is not confirmed from this repo. Verify before relying on a push to update the live site.
2. **Email domain mismatch.** The site uses `info@youngbucksllc.com`, but the intended domain is `www.youngbuckslandscapingllc.com`. Confirm the mailbox and the intended address.
3. **Unverified claims** (see section 1).
4. **External image dependency.** About 20 images are hosted on GitHub user-attachments URLs, not in the repository.
5. **internal marketing plan (not in this repository) references missing items:** `images/` folder (real folder is `assets/`), `/thank-you.html`, and an AggregateRating and LandscapeService schema that aren't implemented.
6. **Seasonal sprinkler promotion** on `index.html` needs review for current accuracy and wording.
7. **Web3Forms domain restrictions.** Review the allowed domains for the Web3Forms access key in the Web3Forms dashboard. The constant lives in `js/main.js`.
8. **Internal documentation is public.** the internal marketing plan (kept outside this repository) is in a public repository. Consider making the repository private or moving the file out.
9. **Homepage and contact form handler:** reviewed 2026-10-26 with mocked submissions (see section 10).

## 10. Permanent Form and Design Standards

These rules apply to all current and future website work.

### Web3Forms (mandatory for every contact, estimate, quote, or lead form)
- Every lead form posts through Web3Forms. Reuse the existing configuration in `js/main.js` (the `WEB3FORMS_ACCESS_KEY` and `WEB3FORMS_ENDPOINT` constants). Never print, log, or copy the access key value into code comments, reports, or new documentation.
- Do not replace Web3Forms with Formspree, a mailto link, or another provider. Do not add mock forms or submit buttons that do nothing.
- Keep the page-form pattern: a `.w3f-form` with a hidden `botcheck` honeypot, the AJAX submit handler in `main.js`, a `.form-success` element directly after the form, and a `.field-submit-error` message for failures. Keep native `required` validation.
- Use the shared field names so every lead email reads the same: `first_name`, `last_name`, `email`, `phone`, `service` (readable label, e.g. "Tree Removal"), `timeline` (readable label), `address` (page forms) or `zip_code` (quote modal), `message` (details), `subject`, `from_name`.
- Test submissions only with a mocked `fetch` in a scratch copy, so nothing reaches Web3Forms. Use obviously fake data (`TEST`, `test-only@example.invalid`). Never send real test leads without explicit authorization.
- Contact method: phone or email, at least one. Email is optional. The rule is enforced in the page-form submit handler in `main.js`, with a visible hint and an accessible error message.
- Every lead form carries the `botcheck` honeypot. The quote modal has one too, and its value is sent with the lead.
- The sprinkler popup never opens over the quote modal, an active form submission, or a phone screen. A blocked attempt retries rather than giving up for the visit.
- Before-and-after photos use neutral captions and alt text that describe only what is visible. Do not add a location, project history, or result to them.

### Media and cards
- Standards live in `css/style.css` under "MEDIA STANDARDS": `--media-photo: 4/3`, `--media-video: 16/9`, `.media-frame` (cover crop), `.media-frame--video`, `.media-frame--logo` (contain, for logos only), and `.card-grid` (equal-width columns).
- Service and project photos are 4:3. Customer videos and blog feature cards are 16:9. Before-and-after pairs use identical dimensions and crop.
- Use `object-fit: cover` for photographs and `contain` only for logos. Never stretch an image.
- Do not upscale a low-resolution photo to fill a card. If the original is too small, add it to the replacement list in `Youngbucks-drafts/IMAGE_AUDIT.md` instead.

### Responsive quality control
- Before reporting a page change, check every affected page at 320, 375, 768, 1024, 1440, and 1920 px. Confirm no horizontal overflow, equal card sizes within a row, no stretched media, and working forms and buttons.
- Expected testimonial layout: three columns at 1100 px and above, two columns from 901 to 1100 px, and one column at 900 px and below.

### Media, previews, and publication
- Never commit videos, posters, transcripts, or other customer media to Git. Keep them outside the repository until publication is authorized.
- The private preview is built in a separate directory (`Youngbucks-preview`) from the repo, with the testimonial section enabled there only. The repo's `index.html` keeps the section commented out as UNPUBLISHED.
- Do not describe a customer video as tree work, trimming, equipment, or a crew unless that footage shows it. Do not call YB-2 a retaining-wall project until project records and owner permission confirm it.
