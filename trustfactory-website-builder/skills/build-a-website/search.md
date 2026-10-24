# Search

## What the platform writes

At every publish, for every page, without the design's help:
- the `<title>`: the page's search title, else "page title | business";
- the description, the canonical address and the sharing tags;
- structured data:
  - the home page: the business, with its address and hours, and its services where the home page shows them in a
    section that holds services. Never its rating: Google gives a business's own data no review stars, so the
    rating stands on the page for people only;
  - a job's page: the job;
  - every other page: the way to it from the home page, through the menu entries it sits under;
  - any page with a section that holds questions: its questions and answers.

By the address it is served at:
- **the business's own domain, once it points here:** visible to search engines, with `sitemap.xml`, a `robots.txt`
  that names it, and `llms.txt`;
- **a test address** (under one of the test domains `core-read`'s `hostname.list` names), and the own domain until
  it points here: every page hidden from search engines, its `robots.txt` naming no sitemap, and no sitemap or
  `llms.txt`. That is as it should be, never a fault to report.

A design adds no structured data of its own: its own section types say what they list with `holds` (questions with
their answers, the business's services, or one job; `design-folder.md`), and the platform writes the rest from the
business's details, so those go in through `core-site-update`, not into a section's text alone.

## Per page

Set these with `content-write` (`page.title`, `page.heading`, `page.seo_title`, `page.seo_description`):

| Field | What it is |
|---|---|
| `title` | the menu's word, such as "Facade painting" |
| `heading` | the page's heading |
| `seo_title` | the search title: at most 60 characters (70 allowed) |
| `seo_description` | 110–150 characters (160 allowed) |

One `<h1>` per page: the opening section's `data-heading`, or the page's heading; never `<h1>` in markup. The publish
check suggests about 450 words on a short page; it never stops a publish.

## The menu and the breadcrumb

- The menu comes from the `nav` slot: the pages marked `in_menu`, in the order `content-write`'s `page.move` gives
  them, a page listed under another inside that page's entry.
- One page per service, under the services page's address, such as `/services/<service>/`, listed under the services
  page with `content-write`'s `page.set_menu_parent`, so its breadcrumb reads from the home page down to the service.
  With many services, mark their pages out of the menu (`in_menu: false`): they keep the breadcrumb and are reached
  from the services.
- A service card links to its page through a `url` field bound with `data-href`.

## German sites

On a page in German, a service's page is at `/leistungen/<service>/`, listed under Leistungen, its breadcrumb reading
"Start > Leistungen > Fassadenanstrich", and its menu word one such as "Fassadenanstrich".
