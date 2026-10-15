# CLAUDE.md — Young Bucks Landscaping Website

Project instructions for Claude Code. Facts here come from the repository files as of commit `dd9d3ce` on `main`. Re-verify before relying on anything that could have changed.

## 1. Business

- **Client:** Young Bucks Landscaping LLC (also written "Young Bucks Landscaping & Tree Service" in schema markup)
- **Location:** Wenatchee, Washington
- **Address:** 4182 Highway 97A, Bldg 3, Wenatchee, WA 98801
- **Phone:** (509) 470-5684 (`tel:+15094705684`)
- **Email:** info@youngbucksllc.com (see Known Issues: domain mismatch)
- **Founded:** 2013 (per site copy and schema `foundingDate`)
- **Service areas (schema and STRATEGY.md):** Wenatchee, East Wenatchee, Cashmere, Leavenworth, Rock Island, Malaga, Monitor
- **Services:** tree removal and trimming, emergency tree service, stump grinding, paver patios and hardscapes, retaining walls, irrigation, sprinkler blowouts and winterization, landscaping, drainage (STRATEGY.md)
- **Brand voice (STRATEGY.md §10):** direct, confident, blue-collar professional. Avoid vague superlatives, "passionate about," and exclamation points except for urgent content.

### Business claims requiring owner verification

Do not add, strengthen, or change these without client confirmation:
- "Licensed, bonded & insured" (appears on multiple pages; no license number is shown)
- "Since 2013" / "12+ years"
- "24/7 emergency tree service"
- "Respond within one business day" (quote-modal success message)
- Stats cited in STRATEGY.md (1,400+ jobs, 87+ reviews, 7 cities). The stats bar was not found in `index.html`.
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
| `sprinkler-winterization.html` | Sprinkler blowouts and winterization (not in STRATEGY.md sitemap) |
| `contact.html` | Contact page with lead form |
| `css/style.css` | All site styling (shared) |
| `js/main.js` | All interactions (shared): quote modal, forms, nav, drawer, carousels, slider, promo, analytics helpers |
| `js/reviews-data.js` | Single source of review testimonials (16 entries, 9 `featured`) |
| `assets/` | Local images: `logo.png`, `photos.jpeg`, `project-retaining-wall.jpeg`, `young-bucks-father-son-founders.jpg`, `young-bucks-mascot.png` |
| `sitemap.xml` | Lists all 9 pages |
| `robots.txt` | Allows all; points to sitemap |
| `STRATEGY.md` | SEO, local-SEO, and marketing plan (internal document) |
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
- **Homepage and contact forms:** use a second handler in `js/main.js` (around line 783). Not reviewed in detail during onboarding. Review before changing.
- **Known gap:** STRATEGY.md expects `/thank-you.html`. It does not exist, and the JS handles success inline.

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
- No AggregateRating is present. STRATEGY.md recommends adding it only with real values.
- STRATEGY.md specifies `LandscapeService`; the actual markup uses `HomeAndConstructionBusiness`. Do not change schema types without review.
- `sitemap.xml` lists 9 URLs on `https://youngbuckslandscaping.com/`. Keep the sitemap in sync when pages are added.

## 6. GitHub and Deployment

- **Repository:** `contractorarsenal/youngbucks` (public), https://github.com/contractorarsenal/youngbucks
- **Production-connected branch:** `main`
- **Hosting:** GitHub Pages, legacy build from `main` at root (`/`). The build is automatic on every push to `main`.
- **Current published URL:** https://contractorarsenal.github.io/youngbucks/
- **Intended custom domain:** https://youngbuckslandscaping.com. It does not currently resolve, and GitHub Pages has no custom domain configured.
- **Do not claim** that a push updates youngbuckslandscaping.com.
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

1. **Custom domain does not resolve.** `youngbuckslandscaping.com` has no DNS A record and is not set in GitHub Pages.
2. **Email domain mismatch.** The site uses `info@youngbucksllc.com`, but the intended domain is `youngbuckslandscaping.com`. Confirm the mailbox and the intended address.
3. **Unverified claims** (see section 1).
4. **External image dependency.** About 20 images are hosted on GitHub user-attachments URLs, not in the repository.
5. **STRATEGY.md references missing items:** `images/` folder (real folder is `assets/`), `/thank-you.html`, and an AggregateRating and LandscapeService schema that aren't implemented.
6. **Seasonal sprinkler promotion** on `index.html` needs review for current accuracy and wording.
7. **Web3Forms key exposure.** The access key is in client-side JS in a public repository, and its value appeared in a tool output during onboarding. Recommend reviewing domain restrictions in the Web3Forms dashboard and considering rotation. Rotation requires updating the constant in `js/main.js`.
8. **Internal documentation is public.** `STRATEGY.md` is in a public repository. Consider making the repository private or moving the file out.
9. **Homepage and contact form handler** has not been reviewed in detail.
