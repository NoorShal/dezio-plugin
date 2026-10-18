---
license: Based on Anthropic's frontend-design and Paul Bakaus' Impeccable craft floor (both Apache-2.0), with material from taste-skill (MIT), Jakub Krehel's skills (MIT), Emil Kowalski's skills (MIT) and, in pictures.md, Black Forest Labs' FLUX prompting rules (MIT). See THIRD-PARTY.md in the plugin.
metadata:
  source: "anthropics/skills skills/frontend-design; pbakaus/impeccable reference/craft-floor.md; Leonxlnx/taste-skill skills/taste-skill; jakubkrehel/skills better-typography, better-colors, better-layout; emilkowalski/skills emil-design-eng; black-forest-labs/skills flux-image-best-practices rules core-principles, negative-prompt-alternatives"
  commit: "anthropics/skills dbd4588f9e10; pbakaus/impeccable 2f98774f86bc; Leonxlnx/taste-skill a60a36dc2bb3; jakubkrehel/skills 4c66b1fa86e9; emilkowalski/skills 2d228630ba14; black-forest-labs/skills 8907d515b0ac"
  sha256: "frontend-design d91970639e9f5c37, craft-floor 96e2e6bd4fcf9a2c, taste-skill ee847084e58f5a81, better-typography e60ca6467ba60e68, better-colors e74f1c413a4094dc, better-layout 8c5883ccb23c27c3, emil-design-eng ffbe68e6007fb42c, core-principles 1a98fd74e4e1cf64, negative-prompt-alternatives 6981b5cee7706f1b"
  changes: "Changed by Trustfactory: the client's direction leads the whole look and the sources' taste rules are its fallback, settled where they disagree; the high-end brief's references and first screen, the advice for local businesses, the pages, trust, calls, motion that follows the client, the phone and the examples are ours; pictures.md keeps the FLUX rules a photo of real work needs, in our words, with Website Studio's own lessons and tools"
---

# The look

How a custom site looks: a trade's, a practice's, a shop's, or a brand's or an agency's own. The client's direction
leads the whole look; this file fills in only where it leaves a choice open.

Contents: what comes first; ground the design in the business; plan, check, build; where the brief leaves it open; a
local business's site; motion; the phone first; look at it, in rounds.

## What comes first

1. **The client's direction leads the whole look,** not only the logo, colours and fonts: the feel, the references,
   the layout, the type, the motion and the words they ask for. Every rule of taste below gives way where the brief
   decides.
2. **A high-end brief** (high-end, "amazing", award-level, "like getreach.com"): first ask for two or three reference
   sites and what the client likes in each. Then build only the first screen and one section in the design folder,
   push them, and have them approved on the share link before anything else.
3. **A look of the site's own, never one of our templates'.** Its own colour values, type scale, spacing, shapes and
   components, set in the design's stylesheet, which also sets the site's variables to them so nothing of template A's
   look shows through (`design-folder.md`, "The stylesheet"). Leave the colours to the Studio's `--site-*` variables
   only where the designer and the client decide the client should change them there.
4. **The floor, whatever the brief:** every text readable on its ground, focus visible, the phone first, motion that
   stops when asked (`accessibility.md`).
5. **Plan, check the plan, then build** (below).

The file format is `design-folder.md`.

## Ground the design in the business

Distinctive choices come from the business, not its category: its trade, materials, tools and words, its town, its
history, its clients. Before designing, list eight to twelve things that belong to this business and no competitor;
the opening and each section take one of these, from what the business gave.

Then write the page as an argument: one line per section, each a claim with its proof ("We paint old façades: three
photos of façades in the old town"). A section with no claim goes.

## Plan, check, build

Plan in a few lines before writing any CSS:
- **Colour:** four to six named colours from the brand, each with its value and its role (ground, text, the action, a
  deep band).
- **Type:** the fonts that carry the brand, chosen on purpose: one of the platform's pairs (`template_sites-write`,
  `design.set` with `font_pair`), any open-licence font, or the brand's own paid font once the client has said their
  licence covers their website (`design-folder.md`, "Fonts"); and the design's own scale: the sizes, weights, tracking
  and line heights of each role. Make the headings unmistakably this business's.
- **Layout:** one sentence and a rough text sketch per section.
- **The one thing:** which element carries the page.
- **Motion:** what moves, if anything, and how (below).

Check the plan against the brief and the list of the business's own things. A part you would have made for any similar
business is a default, not a choice: change it, and say what changed and why. Only then build.

Defaults that read as generated, whatever the brief, unless it asks for them:
- a cream ground with a terracotta accent, or near-black with one acid accent;
- identical rounded cards with the same soft shadow as the page's structure, cards inside cards;
- a small all-caps label above every heading; numbered markers (01 / 02 / 03) on things that aren't a sequence;
- one word of a heading in another colour or italics; gradient text; glass and blur as decoration;
- "→" after every link; meta lines joined with middle dots; a monospace face for labels;
- a big number with a small label and an accent as the hero.

## Where the brief leaves it open

- **One bold idea per page,** taken from the business, everything around it quiet; before handing over, remove one
  ornament.
- **Colour:** one neutral and one accent, the brand's colour on the one main action per view. Every text colour has the
  ground it stands on in the plan, measured (`accessibility.md`); a brand pair that fails is reported to the client,
  never quietly changed.
- **Space:** the gap between groups at least twice the gap inside one; around a section about
  `calc(var(--site-spacing) * 16)` on a wide screen and 10 on a phone, the design's own sections only, as the platform's
  bring their own. Figures that line up, such as prices and hours, in `tabular-nums`.
- **Settled for our sites, where the sources disagree:** no labels above headings or all-caps labels unless the brand
  uses them; real black or the brand's own dark, not #111 by habit; shadows only on what is raised, such as a menu that
  opens; thin lines only for real structure: tables, form fields, the footer.

Use the design's own values, kept as variables of its own, and set the site's variables to them (`design-folder.md`), so
the platform's forms and legal pages wear the same look.

## A local business's site

For a trade, a practice, a shop or a café, not a brand's or an agency's own site. A visitor comes with one question: can
this business do my job, here, soon, and can I trust it? Where the brief leaves it open:

| Do | Don't |
|---|---|
| A heading with the trade and the town: "Ihr Maler in Regensburg" | "Willkommen auf unserer Website" |
| The number as a button: "0941 123450" | "Kontakt" only in the footer |
| One photo of real work or the team on the first screen | A slider, a video that plays, a stock photo |
| Two actions: call, and send an enquiry | Four buttons of equal weight |
| One moment that moves: the opening easing in once | A fade-in on every section |

An opening section of the design's own, its fields a heading (the trade and the town, as people search), a sentence
(what the business does and for whom), the enquiry page's address and a picture; as the page's first section, its
`data-heading` becomes the page's `<h1>`:

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

The pages:
- **Start:** the opening; three or four short promises, each true; why us, with the team or the owner; the services,
  each linking to its page, in a section of the design's own that holds services (`search.md`); the places served;
  real reviews, the `google_reviews` section restyled or the client's own (`words.md`); questions, in a section that
  holds questions; the closing contact block, a section of the design's own holding the contact form.
- **Leistungen:** every service as a row with a picture and a link to its page.
- **One page per service:** "Fassadenanstrich in Regensburg", how it goes in the steps the business named, where it is
  done, the other services, questions and a call; listed under Leistungen in the menu.
- **Über uns:** the story, the team, the qualifications and the year the business started, as far as it gave them.
- **Karriere** only when the business is hiring, one page per job. **Kontakt:** the form, the address, the hours, the
  map.
- **Imprint, privacy policy, accessibility statement:** the client's choice; ours, where chosen, the platform writes:
  link them, never rebuild them.

The menu: the name or logo, three to five links, and one action, the phone or the enquiry; six entries at most.

Trust: real reviews with the reviewer's first name or initial, their town and the platform; the year the business
started and the team's size, where it gave them; qualifications by name, not decoration; faces of the owner and the
team, named where they agree. The phone is a link wherever it stands (`<a data-business="phone"></a>`), and each page
ends with a short sentence, the phone and the enquiry button. Pictures are the business's own work, team and vehicles,
never stock people (`pictures.md`).

## Motion

Motion follows the brief; where it leaves it open, a local business gets the one moment above, in CSS. Whatever moves:
- every moving part stops under reduced motion, inside `@media (prefers-reduced-motion: no-preference)`;
- nothing moves on its own for more than five seconds without a way to pause it;
- every section reads whole when still, as the Studio's editor shows it;
- interface motion stays under 300 ms, eased out, on `transform` and `opacity`;
- what is seen again and again, a menu opened, a hover on every card, moves little or not at all.

## The phone first

Write the stylesheet for a 390 px screen, then widen it with `min-width` queries; it must still work at 320 px. Buttons
go full width under 460 px, at least 44 px tall; cards stack; the phone number stays one tap away; nothing works only
under a pointer. The menu, the sizes and the checks are in `accessibility.md`.

## Look at it, in rounds

Look at the built page as `SKILL.md` says (rule 11), never at the plan:
- every pair of text and ground readable, secondary text tinted from its ground, never a pale grey;
- every state drawn: hover, focus, the current page in the menu, an empty or missing picture;
- the parts you didn't draw carry the design too: text selection, the focus ring, link underlines and figures;
- every requirement of the brief findable within seconds;
- real content at every width: no heading over three lines on a phone, nothing cut off, no wall of text.

Look at desk and phone width, fix the three worst things, look again. Three rounds at most; then hand it over.
