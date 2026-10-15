---
name: common-mistakes
description: The mistakes that get a Website Studio custom design refused or a custom site's publish stopped, and how to fix each. Use when a push is refused, a publish names problems, or before handing a custom site over.
---

# Common mistakes

## A push is refused

The refusal names the file and line. The usual causes:

- **A section type named like one of the template's own**, such as `services`, `steps` or `faq`: give it another
  name. `template_sites-read` with `template.get` lists the template's types.
- **A field key the core reserves**, such as `id`, `name`, `slug` or `status`: name it for what it holds, such as
  `town` or `title`.
- **More than one element at the top** of a section's markup: wrap it in one `<section>`.
- **Content inside a bound element**: an element with `data-text`, `data-rich`, `data-image`, `data-slot` or
  `data-business` is written empty; the binding fills it.
- **A field the markup names that the section type hasn't**, or a list item's field used outside its `data-each`.
- **A `holds` that names a field its list lacks, or one the markup doesn't draw** inside the list's `data-each`: name
  the list's own fields, and draw both, as search engines take only what the page shows.
- **`<h1>`**, or two `data-heading` in one section: a section has one heading of its own, and the page's `<h1>` is the
  opening section's.
- **`style="…"`, `<script>`, `<style>`, `onclick`, `<iframe>`, `<form>`**: a design draws and never runs or loads.
  Styles go in the stylesheet by class; forms are the template's contact form section.
- **An `<img>` with `src`**: pictures come from an `image` field (`data-image`), uploaded to the site's library.
- **`url(…)` or `@import` in the stylesheet**: backgrounds are `<img>` from a field, styled to cover. A font face is the
  one place for a `url(…)`, naming a file of `design/fonts/` as `url("fonts/<file>.woff2") format("woff2")`.
- **A font file not added**: a new file of `design/fonts/` waits for its person's approval in the Studio, at the link
  the push gives; push again once it is approved. A refused one is no WOFF 2.0 file or larger than 500 KB.
- **The footer without `<ul data-slot="legal-links">`**: every page must link the imprint, privacy policy and
  accessibility statement.
- **A section type removed while a page still holds one**: take the section off the pages first, or keep the type.
- **A changed section type that a page's section no longer fits**, such as a list now needing more items than the
  section holds: the refusal names the page. Change that section first, or loosen the definition.

## A design looks off

- **A class the template already styles**, such as `eyebrow`, `button` or `section-head`: the template's stylesheet
  loads under every page, before the design's, so its rules still apply. Give the design's classes a short prefix of
  the site's own, such as `fh-eyebrow`, or override every property the template sets.
- **The site looks like one of our templates**: the design left the site's variables and the base to template A's
  look. Set the site's colour, type and shape variables on `:root` and the base (`body`, headings, links) in the
  design's stylesheet (`design-a-custom-site`, "The stylesheet"), and draw the pages with the design's own section
  types.

- **Legal links or the consent bar hidden or covered**, by a stylesheet rule, a narrow-screen menu or a sticky band:
  no check catches it and the law forbids it. Look at the footer and the consent bar on a phone width before handing
  a site over.

## A publish is stopped

`template_sites-read` with `publish.get_problems` lists each problem, where it is and what to change. Among them: a
legal page missing, a required field left empty, a picture neither described (alt text) nor marked decorative, a
broken link, or business details the imprint needs. Fix pages with `content-write`, pictures with `core-file-write`
and the business's details with `core-site-update`.

## Before handing a site over

- Every page reads well on a phone: test the stylesheet at narrow widths.
- Every text colour against the ground it stands on reaches 4.5:1, measured; where the client changes the colours in
  the Studio, text on coloured grounds uses `--site-on-primary` and `--site-on-accent`, so it keeps its contrast.
- Nothing of template A's look shows: open a page, the contact page and a legal page side by side with the plan.
- The contact page, the legal pages and the menu are there, and the preview shows the consent bar.
