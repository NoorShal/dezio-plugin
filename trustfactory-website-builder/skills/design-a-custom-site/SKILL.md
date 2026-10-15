---
name: design-a-custom-site
description: Design a Website Studio custom site page by page in a local design folder - its header, footer, stylesheet and its own section types with HTML markup - pushed to the site's drafts and checked in the Studio's preview. Use when building or changing the look of a custom site.
---

# Design a custom site

The site must be a custom site with a design folder (the `connect-a-site` skill). The folder holds `studio.json` and:

```
design/header.html          what stands above every page
design/footer.html          what stands below every page; it must hold the legal links
design/stylesheet.css       the site's own stylesheet
design/sections/<type>.json a section type of its own: its fields, and what it holds for search engines
design/sections/<type>.html the markup it is drawn with
design/fonts/<name>.woff2   a font file of the brand's, which the stylesheet's font faces name
```

## Working loop

1. Edit the files, then call `design_push` with the folder's absolute path. It reads the files from disk and saves
   them as the site's draft design, answering the preview's address, or each refusal as
   `design/<file>:<line> what to change`.
2. Fix every refusal and push again before going on: a refused push keeps the design saved before it.
3. Write the pages with `content-write`, using the site's own section types and the template's (forms, legal pages).
4. Look at the result in the Studio's preview (the address `design_push` answers), reloaded by hand. Nothing goes
   public until the site is published.

In a terminal, `node ${CLAUDE_PLUGIN_ROOT}/scripts/studio.mjs dev` in the folder pushes on every save instead; it reads
the key from `TF_STUDIO_KEY`.

Each prompt given inside the folder is kept with the site, with its Claude Code session, by the plugin's hook, so the
design can be followed back to what was asked; `template_sites-read` with `design_prompt.list` reads them.

Every push that changes the design is kept as a numbered version, the newest hundred. `template_sites-read` with
`design_version.list` lists them, and `template_sites-custom` with `custom_design.roll_back` and a version's number
takes the design back to it, saved again as the newest; the Studio's Design tab shows and restores them too. A client
who edits the site may push and restore as well, so look at the list before a push that builds on an older state.

To start from the design saved in the Studio, call `design_pull`. A push sends the whole folder: a section type left
out is removed, refused while a page still holds one.

## A section type

`design/sections/offers.json`:

```json
{
  "type": "offers",
  "version": 1,
  "label": { "en": "Services", "de": "Leistungen" },
  "description": "The business's services as cards, each with a picture.",
  "fields": [
    { "kind": "text", "key": "heading", "label": { "en": "Heading", "de": "Überschrift" },
      "description": "The section's heading.", "required": true, "max_length": 80 },
    { "kind": "repeater", "key": "items", "label": { "en": "Services", "de": "Leistungen" },
      "description": "One card per service.", "min_items": 1, "max_items": 12,
      "fields": [
        { "kind": "text", "key": "title", "label": { "en": "Title", "de": "Titel" },
          "description": "The service's name.", "required": true, "max_length": 60 },
        { "kind": "rich_text", "key": "text", "label": { "en": "Text", "de": "Text" },
          "description": "What the service is.", "required": false },
        { "kind": "image", "key": "picture", "label": { "en": "Picture", "de": "Bild" },
          "description": "A photo of the work." }
      ] }
  ],
  "style_settings": [],
  "holds": { "kind": "services", "list": "items", "name": "title", "description": "text" }
}
```

`design/sections/offers.html`, one element at the top:

```html
<section class="offers">
  <h2 data-heading data-text="heading"></h2>
  <ul class="cards">
    <li class="card" data-each="items">
      <img data-image="picture" data-if="picture" />
      <h3 data-text="title"></h3>
      <div data-rich="text" data-if="text"></div>
    </li>
  </ul>
</section>
```

Field kinds: `text` (with `max_length`), `rich_text`, `url`, `email`, `boolean`, `select` (with `options`, each a `key`
and a `label`), `image`, and `repeater` (with `min_items`, `max_items` and its items' `fields`). Labels are in `en` and
`de`; `description` is for agents. A new type starts at `version` 1; after that, leave the version as pulled. When
a type's fields change, the push raises its version and moves every page's sections of it to the new fields, keeping
each value whose field is still there and still takes it.

`variants` (optional) offers two or more layouts of the same fields: `{ "default": "left", "options": [{ "key":
"left", "label": …, "description": … }, …] }`. The section's top element then carries the class `variant-<key>`, and
`data-variant="<key>"` draws an element only in that variant.

`holds` (optional) says what the section lists, so the site's structured data names it for search engines as it names
the template's `faq` and `services` sections:
- `{ "kind": "questions", "list": <list field>, "question": <text field>, "answer": <text or rich text field> }`: the
  page's questions and answers;
- `{ "kind": "services", "list": …, "name": <text field>, "description": <text or rich text field> }`: the business's
  services, from the first section on the home page that lists any.

Both fields must be drawn inside the list's `data-each` element: search engines take only what the page shows, and the
push refuses a `holds` that names a field the list lacks or the page doesn't show.

## Bindings

- `data-text="<field>"`: a text or e-mail field's text, on an empty element that holds text.
- `data-rich="<field>"`: a rich text, on an empty `<div>`.
- `data-image="<field>"`: a picture, on `<img>` (the only way to show one: a design holds no pictures of its own).
- `data-href="<field>"`: a URL or e-mail field as the link of an `<a>` without `href`.
- `data-each="<repeater>"`: the element once per item; inside it, bindings name the item's fields. It binds nothing else.
- `data-if="<field>"`: the element only where the field has a value (a boolean: yes).
- `data-class="<field>"`: a select's chosen key, or a boolean's field key when yes, as a class.
- `data-heading`: the section's own heading, one `<h2>`–`<h6>` outside lists; it becomes the page's `<h1>` when the
  section opens the page. Never write `<h1>`.
- `data-slot`: `nav` on a `<ul>`/`<ol>` (the menu, the current page with `aria-current="page"`), `legal-links` on a
  `<ul>` (required in the footer), `logo` on `<a>`/`<span>`/`<div>` (the logo, or the name), `year` on
  `<span>`/`<small>`/`<p>`. Header and footer only. The logo is the business details' own: add its file with
  `design_upload`, set its id as `logo` with `core-site-update` (`business_details.set`), and `data-slot="logo"`
  draws it, sized by the stylesheet, where the markup would otherwise carry a drawing of it on every page.
- `data-business`: `name`, `phone`, `email`, `street`, `postcode`, `town`, `address`, `opening-hours`; drawn only where
  the business gave it. On an `<a>`, only `phone` and `email`, which link themselves.

## What markup may hold

Elements: `section header footer nav article aside div span p h2–h6 ul ol li dl dt dd blockquote address strong em b i
small s sub sup br hr figure figcaption img a details summary label input button table caption thead tbody tfoot tr th
td`, and SVG icons from `svg g path circle ellipse rect line polyline polygon`. Attributes: `class id role title lang
dir hidden tabindex aria-*`, plus each element's own (`href` on `a`, `type name value checked` on `input`, with `type`
`radio`, `checkbox` or `range`, and `min max step` on a range, `type="button"` on `button`, `open` on `details`,
`colspan rowspan scope` on table cells, SVG geometry and paint), and `data-script` where the section's own script acts.

Links (`href`) go to `/…`, `#…`, `tel:`, `mailto:` or `https://`. The site replaces the business's current one, so its
own pages are linked as `/…`, and `https://` leads to other services, such as social profiles, maps and videos. Nothing
in the markup runs or loads: no `<script>`, `<style>`, `<iframe>`, `<form>`, event handlers, `style` attributes or
`javascript:`. Tabs, accordions and menus that open are made with `details`/`summary` or `input` and `:checked` in the
stylesheet. What CSS can't do, a section type's own script does: `scripts.md` beside this file.

## The stylesheet

It is drawn after the template's and the site's stylesheets, and wins over every rule of the template's, which sits in
cascade layers. It loads nothing but the design's own font files: no `@import`, `url(…)` outside a font face,
`image-set(…)` or backslash escapes.

**A custom site has a look of its own.** The site starts on one of template A's looks (such as Sand), and everything
the stylesheet doesn't set still shows it. So the stylesheet sets, from the design's own plan:
- its own colour values, type scale, spacing and shapes, as variables of its own (`--ms-ink`, `--ms-ground`, …);
- the base: `body` (ground, text colour, font, size, line height), headings, links, selection and the focus ring;
- the site's variables, on `:root`, set to the design's own values, so what the template still draws (the contact
  form, the legal pages, the consent bar, the skip link) wears the design's look too:

```css
:root {
  --ms-ink: #1d2a24; --ms-ground: #f6f3ec; --ms-moss: #2f5d46; --ms-on-moss: #ffffff;
  --site-text: var(--ms-ink); --site-heading: var(--ms-ink); --site-background: var(--ms-ground);
  --site-surface: #ece6da; --site-muted-text: #4f5b55; --site-border: #c9c1b2;
  --site-primary: var(--ms-moss); --site-on-primary: var(--ms-on-moss);
  --site-accent: var(--ms-moss); --site-on-accent: var(--ms-on-moss);
  --site-radius: 0px;
}
body { background: var(--ms-ground); color: var(--ms-ink); font-family: var(--site-font-body); }
```

The site's variables, all set by the design:
- colours: `--site-background`, `--site-surface`, `--site-text`, `--site-heading`, `--site-muted-text`,
  `--site-primary`, `--site-on-primary`, `--site-accent`, `--site-on-accent`, `--site-border`;
- type: `--site-font-heading`, `--site-font-heading-weight`, `--site-font-body`, `--site-text-h1`, `--site-text-h2`,
  `--site-text-h3`, `--site-text-body`;
- shape: `--site-radius`, `--site-spacing`.

**Fonts:** the brand's own, where it has them. Put each WOFF 2.0 file in `design/fonts/` (lowercase words joined by
hyphens, at most 500 KB each, 12 per design) and name it in a font face, the only place a stylesheet may load a file:

```css
@font-face {
  font-family: "Muster Sans";
  src: url("fonts/muster-sans-regular.woff2") format("woff2");
  font-weight: 400;
  font-display: swap;
}
:root { --site-font-heading: "Muster Sans", system-ui, sans-serif; --site-font-body: "Muster Sans", system-ui, sans-serif; }
```

The site serves the files from its own host, so no visitor's browser asks another one. A font file new to the site
goes there only once your person has approved it in the Studio, which asks whether its licence allows use on websites:
the push stops with a link for each new file. Give them the link and what the push said, and push again once they have
approved it. Never tell them a licence allows it unless they showed you the licence. Without brand fonts, choose the site's font pair on purpose (`template_sites-write`,
`design.set` with `font_pair`) and draw with `var(--site-font-heading)` and `var(--site-font-body)`, in a type scale of
the design's own.

**Sections:** the design draws its pages with section types of its own. Of the platform's, use only those that do
what a design can't: the contact form (`contact_form`), the job application form (`application_form`), the Google
reviews (`google_reviews`), a job's pictures before and after (`before_after`), a video from YouTube or Vimeo
(`video`), whose player loads only once the visitor agrees, and the legal pages, which come with the set-up. Restyle
them through the site's variables above and the design's own rules: the before-and-after by its classes
`before-after-frame`, `before-after-label`, `before-after-divider` and `--position`; the video by `video-frame`, its
field of sixteen by nine, and `video-note`, the card on it until the player loads. Questions and services a design
shows in its own sections reach search engines through `holds`.

**The contact block** (`contact_form`) takes the design's layout through these classes: `contact-block` (the grid;
`contact-block-pair` where it holds two parts), `contact-words` (the heading, the line and the points),
`contact-reasons` with `contact-reason-icon` and `contact-reason-text` (the points), `contact-map`, and
`contact-form-card` with `contact-form-head` (the form). Its layout's `map` leaves the map out: `"hidden"`, set with
`content-write` (`page.save`, the section's `layout`), and the words and the form stand side by side. Its words above
its form, the points in a row:

```css
.contact-block,
.contact-block-pair {
  grid-template-columns: minmax(0, 1fr);
  grid-auto-rows: auto;
  max-width: 48rem;
  margin-inline: auto;
}

.contact-words {
  grid-column: auto;
}

.contact-words h2 {
  font-size: clamp(2rem, 1.5rem + 2.5vw, 3.25rem);
}

.contact-reasons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 2rem;
}
```

The legal links in the footer and the consent bar must stay visible and readable on every page, at every width: the
law asks it of each page, and no check sees a stylesheet hide them. Never give them `display: none`, `visibility:
hidden`, a size of nothing, a place off the screen, or a colour too faint to read, and never cover them.
