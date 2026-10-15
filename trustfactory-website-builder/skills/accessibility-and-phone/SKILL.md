---
name: accessibility-and-phone
description: Makes a custom site readable and usable for everyone and on any phone - contrast through the site's colour variables, a visible focus that a sticky header never hides, tap sizes, headings and link words, reflow at 320 px and 200 % text, calm motion, a phone menu that works without a script, German text that wraps and hyphenates, picture descriptions, speed, and the legal links and consent bar always in view - with examples in the design-folder format and the WCAG criterion behind each rule. Use when writing a custom design's header, footer and stylesheet, and before handing the site over.
license: Contains rules adapted from Jakub Krehel's skills, Vercel's web interface guidelines and Addy Osmani's web-quality-skills (all MIT). See THIRD-PARTY.md in the plugin.
metadata:
  source: "jakubkrehel/skills better-accessibility, better-layout, better-typography; vercel-labs/web-interface-guidelines command.md; addyosmani/web-quality-skills core-web-vitals, performance"
  commit: "jakubkrehel/skills 4c66b1fa86e9; vercel-labs/web-interface-guidelines 434b7f913646; addyosmani/web-quality-skills afa8da942115"
  sha256: "better-accessibility df0cafe0e75a0854, better-layout 8c5883ccb23c27c3, better-typography e60ca6467ba60e68, command.md d246b026f4f29b58, core-web-vitals 731aa78c0347e8b3, performance b0c220185d88c61f"
  changes: "Trustfactory's own skill, with rules adapted from the sources and each WCAG number checked against WCAG 2.2; the picture descriptions are in our own words after ideas from Mike Gifford's image-alt-text (not copied); interface-rules.md is Vercel's rules file trimmed for designs that run no script."
---

# Accessibility and the phone

The site meets the rules, as our accessibility statement says where the site has it, and most visitors come on a
phone. The design keeps both true. Each rule names the WCAG 2.2 criterion behind it, with its level; a rule without one is our own standard.

## The rules that come first

1. **Contrast measured in every pair the design draws**: text 4.5:1, large text 3:1 (1.4.3, AA), the edges of
   buttons, fields and focus rings 3:1 (1.4.11, AA). The design's own colours pass no check of the Studio's, so
   measure each text colour on each ground it stands on.
2. **A visible focus on everything that can be clicked** (2.4.7, AA), never hidden behind a sticky header (2.4.11, AA).
3. **No sideways scrolling at 320 px wide** (1.4.10, AA), and nothing lost when text is made 200 % larger (1.4.4, AA).
4. **Links say where they lead** (2.4.4, A): never a bare "mehr", "hier" or "weiterlesen".
5. **Tap targets of 44 × 44 px** in menus, the footer and buttons. WCAG's minimum is 24 × 24 px (2.5.8, AA); 44 × 44 px
   is its enhanced level (2.5.5, AAA) and our standard.
6. **Nothing moves on its own**, and motion respects the visitor's setting (2.2.2, A).
7. **The legal links, where the site has legal pages, and the consent bar** visible and readable on every page, at
   every width.

## What the platform draws around the design

On every page, around the design's header and footer: the consent bar, a skip link to the content, the main content,
and the pages' language (`lang="de"`, 3.1.1, A). Keep them working:
- Never restyle `.skip-link` out of sight on focus.
- Never cover the consent bar with a sticky band of your own; it stands above the page, so keep your own bands lower
  (`z-index` under 90).

## Contrast

List every pair in the plan, the design's own colours as the site's variables carry them, and measure each:

| Words or lines | On |
|---|---|
| text, headings, muted text | the ground and the surface |
| the colour on the action | the action's colour (filled buttons) |
| the colour on a deep band | the band (deep bands, the footer) |

Where the client changes the colours in the Studio, these are the `--site-*` pairs the Studio checks.

- Large text is at least 24 px, or about 18.7 px bold (WCAG's 18 pt and 14 pt bold). Everything smaller needs 4.5:1.
- Never fixed colours, `opacity` on text, or text over a picture without a solid or nearly solid ground under it.
- Muted text is for small secondary lines (a date, a caption), never for body text on a tinted ground.
- Links inside running text are underlined, not told apart by colour alone (1.4.1, A).

## Focus

```css
.ms-section a:focus-visible,
.ms-button:focus-visible {
  outline: 2px solid var(--site-primary);
  outline-offset: 2px;
}
.ms-band a:focus-visible { outline-color: var(--site-on-accent); }
html { scroll-padding-top: 5rem; } /* the sticky header's height */
```

- Style `:focus-visible`, never `outline: none` without a ring in its place.
- A sticky header needs `scroll-padding-top` set to its own height, so a focused link or an anchor never lands under it.
- The order of the markup is the order of the keyboard: never reorder with `order`, `row-reverse` or grid placement
  what is read in another order.

## Headings and link words

- One `<h1>` per page: the opening section's `data-heading`. Each section's `data-heading` an `<h2>`, cards and steps
  inside it `<h3>`; never skip a level. Headings describe their section (2.4.6, AA).
- Never a heading for its size alone, and never a large `<p>` for what is a heading.
- Link words name their goal: "Fassadenanstrich ansehen", "Zum Kontaktformular". A card linking to a service page
  takes the service's name as its link.

## Reflow, zoom and German words

At 320 px wide and with text at 200 %, nothing is cut off, overlaps or needs sideways scrolling. Lines spaced at
1.5 and letters at 0.12 em, as some readers set them, must still fit (1.4.12, AA).

```css
.ms-section h2, .ms-section h3, .ms-button, .ms-menu a { overflow-wrap: break-word; hyphens: auto; }
.ms-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr)); }
.ms-row > * { min-width: 0; }
```

- Sizes that let text grow: `min-height`, never a fixed `height`, on anything holding text; `width: 100%`, never
  `100vw`; `100dvh` instead of `100vh`; `minmax(0, 1fr)` for grid tracks that hold text.
- German compound words are long ("Fassadenanstricharbeiten"): `hyphens: auto` breaks them where German allows, since
  the pages carry `lang="de"`. Test every heading and button with the longest real words.
- German typography stays as written: „…“ quotes, an en dash in ranges, sentence case. Never `text-transform:
  capitalize`; capitals only for a short label the brand sets that way.
- Never `maximum-scale=1` or `user-scalable=no`: people must be able to zoom.

## Sizes to tap and read

- Links and buttons in menus, the footer and lists at least 44 × 44 px, with about 8 px between two of them.
- Body text at the site's size, never under 13 px for anything a visitor must read.
- A line of text no longer than about 68 characters: `max-width: 68ch`.
- Nothing reachable only under a pointer: everything a hover shows is also there on a tap and by the keyboard.

## Motion

- Nothing moves on its own: no autoplay, no carousels that turn, no parallax.
- Hover effects short (at most 0.2 s), and none of them carrying information.
- Motion is opt-in, so a visitor who asked for less gets none:

```css
@media (prefers-reduced-motion: no-preference) {
  .ms-button { transition: background-color 150ms ease-out; }
}
```

## The phone menu

The menu slot may stand twice: a row for wide screens, and a fold-out for phones made with `<details>`, which opens and
closes without a script. `design/header.html`:

```html
<header class="ms-header">
  <a class="ms-brand" data-slot="logo"></a>
  <nav class="ms-nav-wide" aria-label="Hauptmenü"><ul data-slot="nav"></ul></nav>
  <a class="ms-call" data-business="phone"></a>
  <details class="ms-menu">
    <summary class="ms-menu-button">Menü</summary>
    <nav aria-label="Hauptmenü"><ul data-slot="nav"></ul></nav>
  </details>
</header>
```

```css
.ms-nav-wide { display: none; }
.ms-menu-button { min-width: 44px; min-height: 44px; padding: 0 calc(var(--site-spacing) * 3); cursor: pointer; }
.ms-menu nav a { display: block; min-height: 44px; padding: calc(var(--site-spacing) * 3) 0; }
@media (min-width: 64rem) {
  .ms-nav-wide { display: block; }
  .ms-menu { display: none; }
}
```

- The phone number stays in the header on the phone, as a link: `data-business="phone"` makes it one.
- The menu's words are the page titles. Keep them short so the wide row fits on one line from 1024 px.
- `aria-current="page"` marks the page shown; style it (`.ms-nav-wide [aria-current="page"]`), never hide it.
- Pages listed under another show inside its entry; give them the same tap size.

## Picture descriptions

The description is written once per picture in the site's library, and stands wherever the picture appears.
- Say in one short German sentence what the picture shows that matters here: "Frisch gestrichene Fassade eines Altbaus
  in der Regensburger Altstadt". Not the file name, not "Bild von …", not a list of search words, not the heading
  beside it again.
- Name only what is seen. Never guess who a person is, or their age, origin or mood; name people only where the client
  gives their names.
- A picture that only decorates, or that repeats what the words beside it say, is marked decorative in the library, so
  screen readers pass over it.
- Text inside a picture that matters is also on the page as text.

## Speed

The site is served as finished pages, so the design's weight decides its speed. Google counts a page as good when, for
three in four visits on phones and on desks, the main content shows within 2.5 s, a tap answers within 200 ms and the
layout shifts no more than 0.1.
- Keep the pictures of the first screen under about 500 KB together, and give the opening's picture a fitting `sizes`
  so a phone loads a small copy.
- Give every picture's box its shape in the stylesheet (`aspect-ratio`), so nothing jumps as it loads.
- Keep the stylesheet lean: no unused rules, no large inline SVG drawings repeated on every page.

## Legal links and the consent bar

- Where the site has legal pages, the footer's `<ul data-slot="legal-links">` is visible and readable on every page
  and at every width: never `display: none`, a tiny size, a faint colour, or a place off the screen.
- On a phone, the footer's columns stack, and the legal links keep at least 44 px between them.
- The consent bar must show above everything on the first visit. Where the site asks for consent, the legal links hold
  "Cookie-Einstellungen", which opens it again: keep it with them.

## Check before handing over

At 320, 390 and 1440 px, in the Studio's preview:
- nothing scrolls sideways at 320 px, and with the browser's text at 200 % nothing is cut off;
- tab through a page: every stop shows its ring, in reading order, never under the sticky header;
- open the phone menu and reach every page, those listed under another included;
- read the footer's legal links, where the site has them, and the consent bar;
- look at a deep band (`--site-accent`) and a filled button: their words still read;
- read every link's words alone: each says where it leads;
- look at each picture's description in the library.

`interface-rules.md` beside this file is the longer checklist, from Vercel's interface rules, trimmed to what a design
without scripts can do.

## Sources

Rules adapted from Jakub Krehel's skills, Vercel's web interface guidelines and Addy Osmani's web-quality-skills (MIT),
with every WCAG number checked against WCAG 2.2; the picture descriptions follow ideas from Mike Gifford's
image-alt-text, in our own words. The exact versions are in the plugin's THIRD-PARTY.md.
