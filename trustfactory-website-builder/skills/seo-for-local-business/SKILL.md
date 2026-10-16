---
name: seo-for-local-business
description: Search for a local business's custom site - what the platform already writes (titles, structured data, sitemaps), what the designer sets per page (search title, description, headings), honest service, town and service-area pages, reviews, internal links, alt texts and speed, and what a design must not break. Use when writing a custom site's pages or before publishing it.
license: Contains a few lines adapted from Corey Haines' marketingskills (MIT). See THIRD-PARTY.md in the plugin.
metadata:
  source: "https://github.com/coreyhaines31/marketingskills skills/seo-audit/references/local-seo.md"
  commit: "c7d7dfb6b460fc376b4b2204b78a9c9fd5ca6467"
  sha256: "local-seo d2666d9c225bc36f"
  changes: "Trustfactory's own skill; the town-page, service-area and review-request lines are adapted from the source."
---

# Search for a local business

People search "trade + town" ("Maler Regensburg") or "service + town" ("Fassadenanstrich Regensburg"). Each such search
needs one page that answers it, with that phrase in its title, its heading and its text.

## What the platform writes

At every publish, for every page, without the design's help:
- the `<title>`: the page's search title, else "page title | business";
- the description, the canonical address, the sharing tags, `sitemap.xml`, `robots.txt` and `llms.txt`;
- structured data:
  - the home page: the business, with its address and hours, and its services where the home page shows them in a
    section that holds services. Never its rating: Google gives a business's own data no review stars, so the
    rating stands on the page for people only;
  - a job's page: the job;
  - every other page: the way to it from the home page, through the menu entries it sits under;
  - any page with a section that holds questions: its questions and answers.

A design adds no structured data of its own: its own section types say what they list with `holds` (questions with
their answers, the business's services, or one job; the `design-a-custom-site` skill), and the platform writes the rest. It must not hide the facts behind it: write the business's
details through `core-site-update`, not into a section's text alone.

## Per page

Set these with `content-write` (`page.title`, `page.heading`, `page.seo_title`, `page.seo_description`):

| Field | Rule | Example |
|---|---|---|
| `title` | short, the menu's word | "Fassadenanstrich" |
| `heading` | the page's `<h1>`: what and where | "Fassadenanstrich in Regensburg" |
| `seo_title` | at most 60 characters (70 allowed), the search phrase first, the business last | "Fassadenanstrich in Regensburg \| Malerbetrieb Muster" |
| `seo_description` | 110–150 characters (160 allowed): what, where, why, and an invitation | "Fassaden streichen in Regensburg und Umgebung: Untergrund prüfen, Gerüst, Festpreis vorab. Jetzt Termin vereinbaren." |

Every page's search title and description are its own. The home page leads with the trade and the town: "Maler in
Regensburg | Malerbetrieb Muster". A promise in a description, such as "Festpreis vorab", stands only if the business
really gives it; otherwise leave it out (`copy-for-local-business`).

## Headings

- One `<h1>` per page: the opening section's `data-heading`, or the page's heading. Never write `<h1>` in markup.
- One `<h2>` per section, through its `data-heading`; `<h3>` for cards and steps inside it. Never skip a level.
- Say the service and the town where it is natural; never repeat them in every heading.
- Use headings to give structure, not to make text bigger. A large line that isn't a heading is a `<p>` with a class.

## Service and town pages

- **One page per service,** at `/leistungen/<service>/`. Give it:
  - its own text: how the job goes, what it costs to decide, what can go wrong;
  - the places where it is done;
  - the other services;
  - its questions, in the design's own section that holds questions.
- **A town page only with something local to say:** a real fact about the place (its buildings, its distance, a job
  done there) that helps someone there, and mostly its own words. Pages that only swap the town's name help no one
  and can be judged as spam.
- **The service area** lists the towns the business really serves, the seat first. A town page or the service area
  never suggests an office or a workshop in a place where the business has none.
- **No word counts.** Write what the visitor needs to decide; padding a page to a length makes it worse.
- **On a custom site,** make each with `content-write` (`page.create`, then `page.save`) in the design's own section
  types, never with `template_sites-pages`' `page.add`, which writes the template's own sections and is refused there.

## Reviews

- Show real reviews only, through the template's `google_reviews` section, with the platform and the date they were
  read.
- When the business asks customers for reviews, it asks every customer the same neutral way, with the link to its
  listing: no picking the happy ones, no discounts or gifts in return, no wording to copy, no pressing for one on
  the spot. Google's review policy forbids each of these.

## Internal links

- The menu comes from the `nav` slot: the pages marked `in_menu`, in the order `content-write`'s `page.move` gives
  them, a page listed under another inside that page's entry. Keep it short.
- List each service page under Leistungen with `content-write`'s `page.set_menu_parent`, so its breadcrumb reads
  "Start > Leistungen > Fassadenanstrich". With many services, mark their pages out of the menu (`in_menu: false`):
  they keep the breadcrumb and are reached from the services.
- Each service card links to its page (a `url` field bound with `data-href`). Each service page links to the others and
  to the contact page.
- Link text says where it leads: "Fassadenanstrich ansehen", not "mehr" or "hier".

## Pictures

- Describe each picture in the site's library, in a sentence of what is seen and where: "Frisch gestrichene Fassade
  eines Altbaus in Regensburg". Mark purely decorative pictures as decorative there. A publish stops on a picture that
  is neither.
- Bind pictures with `data-image`: the platform serves each in sizes for every screen. Tell it the size it takes with
  `sizes`, so a phone loads a small copy:

```html
<img data-image="picture" sizes="(min-width: 64rem) 33vw, 100vw" />
```

## Speed

- The site is served as finished pages, so speed is in the design's hands only through its weight.
- Use the site's own fonts; none may be loaded.
- Keep the stylesheet lean: no unused rules, and no large inline SVG drawings repeated on every page.
- Give the opening's picture a fitting `sizes`; the platform loads the first section's picture first.

## What a design must not break

- The opening section's `data-heading`, which makes the page's `<h1>`.
- Text that is in the page for people: never hide it with `display: none`, off-screen or with the ground's colour, for
  search engines or otherwise.
- The phone, the address and the hours as text through `data-business`, never as pictures.
- The `nav` slot in the header, and the `legal-links` slot in the footer where the site has legal pages.
- `holds` on the design's own sections that list questions or the home page's services, or that show one job:
  without it they show them to people but give search engines nothing.
