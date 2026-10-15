---
name: local-business-design
description: Designs a local business's custom website, of any kind - a trade, a practice, a shop - with a look of its own, never a template's, so it reads as trustworthy, clear and true to the brand - grounded in the business's own trade, place and facts, planned before it is built, with the pages and their order, the first screen, trust and calls to action, measured type, colour and spacing, one motion moment at most, and the phone first - with examples in the design-folder format. Use when planning, designing or reviewing a custom site's look, header, footer, stylesheet or section types.
license: Based on Anthropic's frontend-design and Paul Bakaus' Impeccable craft floor (both Apache-2.0), with material from taste-skill (MIT), Jakub Krehel's skills (MIT), Emil Kowalski's skills (MIT) and, in pictures.md, Black Forest Labs' FLUX prompting rules (MIT). See THIRD-PARTY.md in the plugin.
metadata:
  source: "anthropics/skills skills/frontend-design; pbakaus/impeccable reference/craft-floor.md; Leonxlnx/taste-skill skills/taste-skill; jakubkrehel/skills better-typography, better-colors, better-layout; emilkowalski/skills emil-design-eng; black-forest-labs/skills flux-image-best-practices rules core-principles, negative-prompt-alternatives"
  commit: "anthropics/skills dbd4588f9e10; pbakaus/impeccable 2f98774f86bc; Leonxlnx/taste-skill a60a36dc2bb3; jakubkrehel/skills 4c66b1fa86e9; emilkowalski/skills 2d228630ba14; black-forest-labs/skills 8907d515b0ac"
  sha256: "frontend-design d91970639e9f5c37, craft-floor 96e2e6bd4fcf9a2c, taste-skill ee847084e58f5a81, better-typography e60ca6467ba60e68, better-colors e74f1c413a4094dc, better-layout 8c5883ccb23c27c3, emil-design-eng ffbe68e6007fb42c, core-principles 1a98fd74e4e1cf64, negative-prompt-alternatives 6981b5cee7706f1b"
  changes: "Changed by Trustfactory: the design lead's brief is trust and the client's brand instead of distinctiveness and risk; the sources' conflicts are settled for local businesses; the pages, the first screen, trust, calls, the phone and the examples are ours; pictures.md keeps the FLUX rules a photo of real work needs, in our words, with Website Studio's own lessons and tools"
---

# Designing a local business's site

Approach this as the designer a local business hires to be believed: a painter, a dental practice, a car wash. The
page must read as trustworthy, clear and true to the brand before it reads as anything else. A visitor comes with one
question: can this business do my job, here, soon, and can I trust it? Every page answers it in that order, on a phone
first.

## The rules that come first

1. **The client's brand rules always win:** their logo, colours, typefaces and the words they use. Everything below
   applies where the brand leaves a choice open.
2. **A custom site has a look of its own, never the template's.** Its own colour values, type scale, spacing, shapes
   and components, set in the design's stylesheet, which also sets the site's variables to them so nothing of template
   A's look shows through (`design-a-custom-site`, "The stylesheet"). A site that could pass for one of our template
   sites has failed the brief. Leave the colours to the Studio's `--site-*` variables only where the designer and the
   client decide the client should change them there.
3. **The design's own sections.** Of the template's, only the forms (`contact_form`, `application_form`), the Google
   reviews (`google_reviews`) and our legal pages where the client chose them, restyled to the design's look. Questions and services stand in the
   design's own sections, which say what they hold for search engines (`holds`).
4. **Proof is never invented:** no customers, reviews, numbers, years, certificates or photos of work that isn't
   theirs. What's missing is marked for the client (`copy-for-local-business`).
5. **The first screen of a phone** answers who, what, where, and how to get in touch.
6. **Plan, check the plan, then build** (below). A plan that would fit any painter, or any of our templates, is
   rewritten before any code.
7. **One bold idea per page,** taken from the business, and everything around it quiet. Before handing over, remove
   one ornament.
8. **The floor holds on every page:** contrast in the design's own pairs, a visible focus ring, the phone layout,
   reduced motion respected (`accessibility-and-phone`).

The file format is in `design-a-custom-site`; the order of the whole job in `build-a-custom-site`.

## Ground the design in the business

Distinctive choices come from the business itself, not the category: its trade, materials, tools and vocabulary, its
town and street, its history. Before designing, list eight to twelve things that belong to this business and no
competitor: its street and what its houses look like, the year it started, the master's name, the materials it is
known for, the vehicles with its name, the places it works, a job it did that people in town know. The opening and
each section take one of these.

Then write the page as an argument: one line per section, each a claim with its proof ("We paint old façades: three
photos of façades in the old town"). A section with no claim goes. This keeps the page from becoming the stock
sequence of hero, three icon cards, a testimonial and a call.

## Plan, check, build

Plan in a few lines before writing any CSS:
- **Colour:** four to six named colours from the brand, each with its value and its role (ground, text, the action, a
  deep band), as the design's own.
- **Type:** the font pair that carries the brand, chosen on purpose (`template_sites-write`, `design.set` with
  `font_pair`), and the design's own scale: the sizes, weights, tracking and line heights of each role. Type is where a
  local site most often looks like every other; make the headings unmistakably this business's.
- **Layout:** one sentence and a rough text sketch per section; left-aligned unless a heading and its single sentence
  are centred.
- **The one thing:** which element carries the page: the bold idea, from the list of the business's own things.
- **Motion:** the one moment that moves, if any, and how.

Then check the plan against the brief and the list of the business's own things. Any part that you would have made for
any similar business is a default, not a choice: change it, and say what changed and why. Only then build.

Defaults that read as generated, and to choose only when the brand asks for them:
- a cream ground with a terracotta accent, or near-black with one acid accent;
- identical rounded cards with the same soft shadow as the page's structure, cards inside cards;
- a small all-caps label above every heading; numbered markers (01 / 02 / 03) on things that aren't a sequence;
- one word of a heading in another colour or italics; gradient text; glass and blur as decoration;
- "→" after every link; meta lines joined with middle dots; a monospace face for labels;
- a big number with a small label and an accent as the hero.

Settled for our sites, where the sources disagree:
- Avoid labels above headings and all-caps labels unless the brand uses them.
- Use real black or the brand's own dark colour, not #111 by habit.
- Shadows only on what is raised: a menu that opens, a sticky bar.
- Thin lines only for real structure: tables, form fields, the footer.
- One motion moment at most, in CSS.

## The pages

- **Start**, top to bottom:
  1. the opening: the trade and the town as the heading, one sentence on what and for whom, the phone and the enquiry,
     a real photo;
  2. three or four short promises, each a sign and a few words, and each true ("Festpreis vorab" only where the
     business gives one);
  3. why us: the team or the owner with a photo and three to five reasons;
  4. the services, each linking to its own page: a section of the design's own that holds services, so search
     engines read them too (`seo-for-local-business`);
  5. the service area: the town and the places around it;
  6. reviews, real ones: the template's `google_reviews` section, restyled, or the client's own in a section of the
     design's (`copy-for-local-business`);
  7. questions, in a section of the design's own that holds questions;
  8. the closing contact block, with the template's `contact_form` section, restyled.
- **Leistungen:** every service as a row with a picture and a link to its page.
- **One page per service:** an opening ("Fassadenanstrich in Regensburg"), how it goes in three to five steps, where it
  is done, the other services, questions, and a closing call. Listed under Leistungen in the menu.
- **Über uns:** the story, the team, the qualifications, and the year the business started.
- **Karriere:** only when the business is hiring; one page per job.
- **Kontakt:** the form, the address, the hours and the map.
- **Imprint, privacy policy and accessibility statement:** the client's choice; ours, where chosen, the platform
  writes: link them, never rebuild them.

The menu: the name or logo, three to five links, and one action (the phone or the enquiry). Six entries at most.

## The first screen

| Do | Don't |
|---|---|
| "Ihr Maler in Regensburg" | "Willkommen auf unserer Website" |
| The number as a button: "0941 123450" | "Kontakt" only in the footer |
| One photo of real work or the team | A slider, a video that plays, a stock photo |
| Two actions: call, and send an enquiry | Four buttons of equal weight |

`design/sections/opening.json`:

```json
{
  "type": "opening",
  "version": 1,
  "label": { "en": "Opening", "de": "Einstieg" },
  "description": "The first section: the trade and the town as the heading, a sentence, the phone and the enquiry.",
  "fields": [
    { "kind": "text", "key": "heading", "label": { "en": "Heading", "de": "Überschrift" },
      "description": "The trade and the town, as people search: 'Ihr Maler in Regensburg'.", "required": true,
      "max_length": 70 },
    { "kind": "text", "key": "lead", "label": { "en": "Sentence", "de": "Satz" },
      "description": "What the business does and for whom, in one sentence.", "required": true, "max_length": 180 },
    { "kind": "url", "key": "enquiry", "label": { "en": "Enquiry page", "de": "Anfrageseite" },
      "description": "Where the second button leads, usually /kontakt/.", "required": true },
    { "kind": "image", "key": "picture", "label": { "en": "Picture", "de": "Bild" },
      "description": "A real photo of the work or the team." }
  ],
  "style_settings": []
}
```

`design/sections/opening.html`:

```html
<section class="ms-section ms-opening">
  <div class="ms-opening-text">
    <h2 data-heading data-text="heading"></h2>
    <p class="ms-lead" data-text="lead"></p>
    <div class="ms-actions">
      <a class="ms-button ms-button-call" data-business="phone"></a>
      <a class="ms-button ms-button-quiet" data-href="enquiry">Anfrage senden</a>
    </div>
  </div>
  <img class="ms-opening-picture" data-image="picture" data-if="picture" sizes="(min-width: 64rem) 50vw, 100vw" />
</section>
```

The opening is the page's first section, so its `data-heading` becomes the page's `<h1>`.

## Trust and calls

- Real reviews with the reviewer's first name or initial, their town and the platform.
- The year the business started, and the team's size where it is more than one or two.
- The trade's qualifications by name: master craftsman, chamber, certificates, insurance. Name them, don't decorate them.
- Faces: the owner and the team at work, with their names where they agree.
- The phone is a link everywhere it stands: `<a data-business="phone"></a>` links itself.
- Each page ends with a call: a short sentence, the phone and the enquiry button.
- Forms are the template's `contact_form` section. Never draw a form of your own: it would not send.

## Pictures

- The business's own work, its team and its vehicles. Before and after where the trade allows it.
- One shape per row, such as 4:3 for cards and 16:10 for wide pictures, cropped with `object-fit: cover`.
- No stock people. A drawn sign or a plain coloured area is better than a stranger's face.
- Every picture is described in the site's library, or marked decorative there (`accessibility-and-phone`).
- The client's own photos first; every other place gets a photo Website Studio makes and checks from your scene:
  `pictures.md` beside this file has the steps, how to write the scene, and each place's shape and words.

## Type, colour and space: the numbers

Use the design's own values, kept as variables of its own, and set the site's variables to them (the
`design-a-custom-site` skill shows how), so the template's forms and legal pages wear the same look.

- **Body text:** the site's size (`var(--site-text-body)`), line height 1.5–1.6, lines 60–75 characters
  (`max-width: 68ch`), weight 400 or heavier below 18 px.
- **Headings:** line height 1.1 for the opening's heading, 1.2–1.3 for the others; from 24 px up, letter spacing
  `-0.01em` to `-0.02em`. Each level smaller than the one above it. `text-wrap: balance` on headings, `pretty` on
  paragraphs.
- **Prices, hours and other figures that line up:** `font-variant-numeric: tabular-nums`.
- **Colour:** one neutral and one accent, with the brand's colour on the one main action per view. Every text colour
  has the ground it stands on in the plan, measured at 4.5:1 or more (`accessibility-and-phone`). A brand pair that
  fails is reported to the client, never quietly changed.
- **Space:** the gap between groups at least twice the gap inside one; around a section about
  `calc(var(--site-spacing) * 16)` on a wide screen and 10 on a phone. Space only the design's own sections: the
  template's (the contact form, the questions) bring their own.

```css
.ms-opening h2 { font-size: clamp(2.5rem, 6vw, 4.75rem); line-height: 1.05; letter-spacing: -0.02em; color: var(--ms-ink); text-wrap: balance; }
.ms-lead { max-width: 68ch; font-size: 1.125rem; line-height: 1.6; color: var(--ms-ink); text-wrap: pretty; }
.ms-section { padding-block: calc(var(--site-spacing) * 10); }
@media (min-width: 64rem) { .ms-section { padding-block: calc(var(--site-spacing) * 16); } }
```

## Motion

Motion done well is part of a premium site: one moment, made with care, in CSS.
- First ask how often a visitor sees it. A menu opened again and again, a hover on every card: little or no motion.
  Something seen once, such as the opening: one moment may move.
- One orchestrated moment per page at most, in CSS: the opening's heading, line and picture easing in once, a few
  tens of milliseconds apart; never a fade-in on every section.
- Interface motion stays under 300 ms, eased out; `transform` and `opacity` only.
- Everything inside `@media (prefers-reduced-motion: no-preference)`, so a visitor who asked for less gets none.

## The phone first

Write the stylesheet for a 390 px screen, then widen it with `min-width` queries; it must still work at 320 px.
- Buttons go full width under 460 px, at least 44 px tall.
- Cards stack one under another.
- The phone number stays one tap away.
- Nothing works only under a pointer.

The `accessibility-and-phone` skill has the menu, the sizes and the checks.

## Look at it, in rounds

The craft floor, checked on the built page in the Studio's preview, not as an intention:
- every pair of text and ground readable, secondary text tinted from its ground, never a pale grey;
- every state drawn: hover, focus, the current page in the menu, an empty or missing picture;
- the parts you didn't draw carry the design too: text selection, the focus ring, link underlines and figures;
- every requirement of the brief findable within seconds;
- real content at every width: no heading over three lines on a phone, nothing cut off.

Look at desk and phone width, fix the three worst things, look again. Three rounds at most; then hand it over.

## Mistakes to avoid

- A heading that names neither the trade nor the town.
- The phone number as an image, or only in the footer.
- Walls of text: break them into steps, lists and questions.
- Grey text on grey ground, or thin light type for body text.
- Sliders, autoplaying video, parallax, pop-ups.
- Invented reviews, prices or certificates.
- Classes the template already styles, such as `button` or `eyebrow`. Prefix the design's own, as `ms-` here.
- Template A's look showing through: its colours, its headings' font size or its buttons on a page. Set the site's
  variables and the base in the design's stylesheet.
- The template's sections for what the design should draw itself, such as its services, questions or steps.

## Sources

Adapted, with the changes named in this file's metadata, from Anthropic's `frontend-design` and Paul Bakaus'
Impeccable craft floor (Apache-2.0), and taste-skill, Jakub Krehel's and Emil Kowalski's skills (MIT); `pictures.md`
from Black Forest Labs' FLUX prompting rules (MIT). Their licences and the exact versions are in the plugin's
THIRD-PARTY.md.
