# The design folder

A custom site's header, footer, stylesheet and section types, in a local folder pushed to the site's drafts and looked
at in the Studio's preview. The site must be a custom site with a design folder (`SKILL.md`, step 1).

Contents: the folder's files; the working loop; a section type; bindings; what markup may hold; the stylesheet, with
the editor's canvas, what the platform draws around the design, the site's variables, fonts, the platform's sections,
the forms and the map, and posts.

The folder holds `studio.json` and:

```
design/header.html          what stands above every page
design/footer.html          what stands below every page, with the legal pages' links where the site has them
design/stylesheet.css       the site's own stylesheet
design/sections/<type>.json a section type of its own: its fields, and what it holds for search engines
design/sections/<type>.html the markup it is drawn with
design/sections/<type>.js   its own script, where it moves (scripts.md)
design/page.js              the page's own script, where the page moves as a whole (scripts.md)
design/fonts/<name>.woff2   a font file, which the stylesheet's font faces name
```

## Working loop

`design_init` names the site in the folder's `studio.json`, and pulls its design into `design/` where one was pushed
before. On a site whose design was never pushed nothing is pulled, so a new folder starts empty: write
`design/header.html`, `design/footer.html`, `design/stylesheet.css` and the section types, then push. The Studio shows a
starter until the first push. A folder that holds another site's design is refused: each site has a folder of its own.

1. Edit the files, then call `design_push` with the folder's absolute path. It reads the files from disk and saves
   them as the site's draft design, answering the preview's address, or each refusal as
   `design/<file>:<line> what to change`.
2. Fix every refusal and push again before going on: a refused push keeps the design saved before it.
3. Write the pages with `content-write`, in the site's own section types and the platform's (`SKILL.md`, rule 5).
4. Look at the result at the preview's address `design_push` answers, reloaded after the push, as `SKILL.md` says
   (rule 11). Nothing goes public until the site is published. Judge motion there or through a share link: the
   Studio's editor runs no scripts, so it shows each section still.

In a terminal, `node ${CLAUDE_PLUGIN_ROOT}/scripts/studio.mjs dev` in the folder pushes on every save instead; it reads
the key from `TF_STUDIO_KEY`.

Every push that changes the design is kept as a version (`template_sites-read` with `design_version.list`), and
`template_sites-custom` with `custom_design.roll_back` takes the design back to one. Someone else may have pushed or
restored meanwhile: look at the list before a push that builds on an older state.

To start from the design saved in the Studio, call `design_pull`; on a site whose design was never pushed it writes
nothing. A push sends the whole folder: a section type left out is removed, refused while a page still holds one.

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
      <img data-image="picture" data-if="picture" sizes="(min-width: 64rem) 22rem, (min-width: 40rem) 50vw, 100vw" />
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

A type's name is its own: never one of the platform's types, which `content-read` with `section_type.list` names.
Keys, the type's own and each field's and option's, are lowercase letters, digits and underscores, starting with a
letter. The platform keeps 29 names for its own fields and requests, so a key takes another: `id`, `site_id`,
`type_id`, `category_id`, `slug`, `name`, `status`, `path`, `values`, `language`, `translations`, `locale`,
`created_at`, `updated_at`, `modules`, `operation`, `limit`, `after`, `sort`, `q`, `response_format`,
`idempotency_key`, `confirm_token`, `approval_id`, `organisation_id`, `core`, `constructor`, `prototype` and
`__proto__`. A field that holds a person's or a service's name is `title` or `full_name`, for instance.

`variants` (optional) offers two or more layouts of the same fields: `{ "default": "left", "options": [{ "key":
"left", "label": …, "description": … }, …] }`. The section's top element then carries the class `variant-<key>`, and
`data-variant="<key>"` draws an element only in that variant.

`holds` (optional) says what the section lists, so the site's structured data names it for search engines as it names
the template's `faq` and `services` sections and its job pages:
- `{ "kind": "questions", "list": <list field>, "question": <text field>, "answer": <text or rich text field> }`: the
  page's questions and answers;
- `{ "kind": "services", "list": …, "name": <text field>, "description": <text or rich text field> }`: the business's
  services, from the first section on the home page that lists any;
- `{ "kind": "job", "title": <text field>, "description": <text or rich text field>, "employment": <choice field> }`:
  one job, which a page holding exactly one such section advertises to Google's job listings; `employment` is
  optional, and its options' keys are among `full_time`, `part_time`, `contractor`, `temporary`, `intern`,
  `volunteer`, `per_diem` and `other`.

A list's two fields must be drawn inside its `data-each` element, and a job's title and description in the markup:
search engines take only what the page shows, and the push refuses a `holds` that names a field the type lacks or the
page doesn't show.

## Bindings

- `data-text="<field>"`: a text or e-mail field's text, on an empty element that holds text.
- `data-rich="<field>"`: a rich text, on an empty `<div>`.
- `data-image="<field>"`: a picture, on `<img>` (the only way to show one: a design holds no pictures of its own).
  Give it `sizes`, the width the design's own grid draws it at in each layout, such as
  `sizes="(min-width: 64rem) 22rem, (min-width: 40rem) 50vw, 100vw"` for cards three, two and one across: the browser
  fetches the file for that width. Without it the picture is fetched as wide as the screen, and the push suggests it.
- `data-href="<field>"`: a URL or e-mail field as the link of an `<a>` without `href`.
- `data-each="<repeater>"`: the element once per item; inside it, bindings name the item's fields. It binds nothing else.
- `data-if="<field>"`: the element only where the field has a value (a boolean: yes).
- `data-class="<field>"`: a select's chosen key, or a boolean's field key when yes, as a class.
- `data-heading`: the section's own heading, one `<h2>`–`<h6>` outside lists; it becomes the page's `<h1>` when the
  section opens the page. Never write `<h1>`.
- `data-slot`: `nav` on a `<ul>`/`<ol>` (the menu, the current page with `aria-current="page"`, a page listed under
  another inside that page's entry; it may stand twice, such as a row for wide screens and a `<details>` fold-out for
  phones, which opens without a script), `legal-links` on a `<ul>` in the footer (the legal pages the site has, and
  the consent bar's button where it asks first; nothing on a site with neither), `logo` on `<a>`/`<span>`/`<div>`
  (the logo, or the name), `year` on `<span>`/`<small>`/`<p>`. Header and footer only. The logo is the business details' own: add its file with
  `design_upload`, set its id as `logo` with `core-site-update` (`business_details.set`), and `data-slot="logo"`
  draws it, sized by the stylesheet, where the markup would otherwise carry a drawing of it on every page.
- `data-business`: `name`, `phone`, `email`, `street`, `postcode`, `town`, `address`, `opening-hours`; drawn only where
  the business gave it. On an `<a>`, only `phone` and `email`, which link themselves.
- `data-slot="open-now"` on a `<p>`/`<span>`/`<div>` and `data-slot="hours-today"` on a `<ul>`/`<ol>`, anywhere
  outside lists, drawn only where the business gave its hours. Both show the week's hours as drawn, which the editor
  and a visitor without scripts see; on the share link and the published site the platform's script then shows, by the
  time where the site is, in `open-now` whether the business is open now and until when or when it opens next
  (`.open-now-state`, `.open-now-when`, `data-state="open"` or `"closed"` on the element), and in `hours-today` today
  marked with `aria-current="date"`. `hours-today` holds a `<li class="hours-day">` per weekday (`data-day`,
  `.hours-day-name`, `.hours-day-times`, `.hours-closed` on a closed day) and the note as `.hours-note`; the element
  has `data-live` once the script has run, so a rule under it can show today's day alone.

## What markup may hold

Elements: `section header footer nav article aside div span p h2–h6 ul ol li dl dt dd blockquote address strong em b i
small s sub sup abbr cite code del ins kbd mark pre q time u wbr br hr figure figcaption img a details summary label
input button canvas table caption thead tbody tfoot tr th td`, and SVG icons from `svg g path circle ellipse rect line
polyline polygon`. Attributes: `class id role title lang dir hidden tabindex aria-*`, plus each element's own (`href`
on `a`, `type name value checked` on `input`, with `type` `radio`, `checkbox` or `range`, and `min max step` on a
range, `type="button"` on `button`, `for` on `label`, `open` on `details`, `start reversed` on `ol`, `value` on `li`,
`datetime` on `time`, `del` and `ins`, `width height` on `canvas` (`scripts.md`), `colspan rowspan scope` on table
cells, SVG geometry and paint), `data-script` where the section's own script acts, and `data-page-part` where the
page's script does (`scripts.md`).

SVG in markup is for small icons of a few shapes. A logo, a photo or a drawing traced from a picture is a file: add it
with `design_upload` and draw it through `data-slot="logo"` (the logo, set as the business details' `logo`) or an
`image` field (`data-image`). Written into the markup, it is copied into every page that shows it, and into every push.

Links (`href`) go to `/…`, `#…`, `tel:`, `mailto:` or `https://`. The site replaces the business's current one, so its
own pages are linked as `/…`, and `https://` leads to other services, such as social profiles, maps and videos. Nothing
in the markup runs or loads: no `<script>`, `<style>`, `<iframe>`, `<form>`, event handlers, `style` attributes or
`javascript:`. Tabs, accordions and menus that open are made with `details`/`summary` or `input` and `:checked` in the
stylesheet. What CSS can't do, a section type's own script does: `scripts.md` beside this file, which also says how a
section moves as it scrolls into view.

## The stylesheet

It is drawn after the platform's base and the site's stylesheet, and wins over every rule of the base, which sits in
cascade layers. The base draws the platform's own parts plainly (the contact form, the legal pages, the consent bar)
and styles `.button`, `.eyebrow`, `.card` and `.section-head`, so a property the design leaves unset on those classes
keeps the base's: give the design's own classes a short prefix of the site's, such as `fh-`. It loads nothing but the
design's own font files: no `@import`, `url(…)` outside a font face, `image-set(…)` or backslash escapes.

The Studio's editor draws the same sections, without running any script and with each section wrapped in elements of
its own, and no `<main>`. So:
- never hide a section's content until it is in view (`opacity: 0` until `[data-in-view]`): the mark never comes in
  the editor, nor on a page read without scripts. Let the mark start a motion from content that stands whole without
  it (`scripts.md`);
- style each section from its own classes, never through `main >` or the section beside it (`+`, `~`, `:nth-child`
  among the sections), which match differently there.

**What the platform draws around the design,** on every page: the consent bar, a skip link to the content, the main
content and the pages' language (`lang="de"`). Never restyle `.skip-link` out of sight on focus. The consent bar stands
above the page, so the design's own sticky bands stay lower (`z-index` under 90) and never cover it.

**The site's own look:** the site starts on one of template A's looks (such as Sand), and everything the stylesheet
doesn't set still shows it. So the stylesheet sets the base (`body`, headings, links, selection and the focus ring),
and the site's variables on `:root`, to the design's own values, so what the template still draws (the contact form,
the legal pages, the consent bar, the skip link) wears the design's look too:

```css
:root {
  --ms-ink: …; --ms-ground: …; --ms-brand: …; --ms-on-brand: …; /* the design's own values */
  --site-text: var(--ms-ink); --site-heading: var(--ms-ink); --site-background: var(--ms-ground);
  --site-surface: …; --site-muted-text: …; --site-border: …;
  --site-primary: var(--ms-brand); --site-on-primary: var(--ms-on-brand);
  --site-accent: var(--ms-brand); --site-on-accent: var(--ms-on-brand);
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

The Studio checks contrast only for the `--site-*` colours a client changes in the Studio; the design's own colours
pass no check of the Studio's, so measure each pair of words and ground the design draws.

**Fonts:** a font pair of the platform's (`template_sites-write`, `design.set` with `font_pair`), drawn with
`var(--site-font-heading)` and `var(--site-font-body)`, or files of the design's own: any font under an open licence,
such as the SIL Open Font License, or the brand's own paid font once the client has said, asked once in the
conversation, that their licence covers their website. Never a font file taken from anywhere without a
licence that allows it. Put each WOFF 2.0 file in `design/fonts/` (lowercase words joined by hyphens, at most 500 KB
each, 12 per design) and name it in a font face, the only place a stylesheet may load a file:

```css
@font-face {
  font-family: "Muster Sans";
  src: url("fonts/muster-sans-regular.woff2") format("woff2");
  font-weight: 400;
  font-display: swap;
}
:root { --site-font-heading: "Muster Sans", system-ui, sans-serif; --site-font-body: "Muster Sans", system-ui, sans-serif; }
```

The push adds the files to the site, which serves them from its own host, so no visitor's browser asks another one.

**Sections:** the design draws its pages with section types of its own. Of the platform's, use only those that do
what a design can't: the Google reviews (`google_reviews`), a job's pictures before and after (`before_after`), a
video from YouTube or Vimeo (`video`), whose player loads only once the visitor agrees, and our legal pages, where the
client chose them. Restyle them through the site's variables above and the design's own rules: the before-and-after by
its classes `before-after-frame`, `before-after-label`, `before-after-divider` and `--position`; the video by
`video-frame`, its field of sixteen by nine, and `video-note`, the card on it until the player loads. The pages the
site draws on its own, the one a sender lands on once a form or an application is sent and the page not found, stand
between the design's header and footer as `<main class="notice">`: a heading, a line or two and the way home
(`.button`), laid out plainly in the page's column; restyle them by `.notice`. The platform's buttons are `.button` with
`.button-primary` (filled in the call colour) or `.button-secondary` (outlined); restyle them by those classes. The
filled one's colours hold over a rule for every link (`a`, `a:hover`), so its words never take a link colour; to give
it others, set them on `.button-primary` and on its `:hover`, `:focus-visible` and `:active` states. Questions and
services a design shows in its own sections reach search engines through `holds`.

**The forms and the map:** the contact page, the careers page and every closing call are section types of the
design's own, the business's details in them through `data-business`, so they follow the details as they change. The
platform draws only what a design can't safely: the working form and the map, each into an empty `<div>` the section
marks, once: `data-slot="contact-form"`, `data-slot="application-form"` or `data-slot="map"`. A section holding one
runs no script of its own, so nothing of the design's reaches what a visitor sends or agrees to: put what moves in a
section beside it. A form posts to the site's enquiries or applications, in the site's "Sie" or "du", with its consent
line and send button; the editor shows it without sending. Restyle it by `.site-form` (with `.contact-form` or
`.application-form`), `.field-input`, `.form-consent`, `.button-primary` and the application's file drop
`.application-drop`. The map loads once the visitor agrees; until then it is a card that loads nothing,
`.map-card-place`, with the address (`.map-card-address`), the button that asks to load it (`.map-card-show`) and its
line (`.map-card-note`), and in its place once loaded the map, `.map-frame`; below either, the links to Google Maps,
Apple Maps and OpenStreetMap, `.map-card-routes`. Restyle it by those classes and `.map-card`, the whole.

**Posts:** a post's page and the list of posts are the platform's, drawn between the design's header and footer, a
post's sections in the design's own types and the post's blocks. Restyle them by these classes: `post-page` (the
post's article), `post-head` (its head: the posts' name, the title, the teaser and the day), `post-meta` (the day),
`post-cover` (its cover picture), `post-body` (its sections), `post-back` (the way back to all posts), and on the list
`post-list-head` (its heading and lead), `post-list` (the cards), `post-card` (one post) and `post-pager` (newer and
older). A design that styles none of them shows the posts in the base's plain look and the site's variables.

The legal links and the consent bar stay visible and readable at every width (`SKILL.md`, rule 6): no check sees a
stylesheet hide them, so never give them `display: none`, `visibility: hidden`, a size of nothing, a place off the
screen or a colour too faint to read, and never cover them. Where the site asks for consent, the legal links hold
"Cookie-Einstellungen", which opens the consent bar again: keep it with them.
