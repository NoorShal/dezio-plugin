---
name: build-a-website
description: Builds and changes websites for businesses on Dezio with this plugin's tools, never as a local framework project - a custom design pushed from the design folder, the home page approved through a share link, the subpages, words, pictures, search, accessibility, publishing and the own domain, by Dezio's own guides. Use whenever someone wants to build, redesign or change a website or homepage, its pages, words, pictures or look, for any kind of business ("Website erstellen", "Homepage bauen", "Seite ändern", "Texte für meine Webseite").
license: Contains a few lines adapted from Anthropic's frontend-design and Paul Bakaus' impeccable (both Apache-2.0). See THIRD-PARTY.md in the plugin.
---

# Build a website

Dezio's own guides say how a site is built with its tools: `rules-get` lists them, and gives one with `guide`: the
interview, the business's facts, pictures, search, languages and publishing. Read each when its step starts, and again
when coming back to it after a long pause or after the conversation was compacted. This skill adds what the design
folder brings: a design of the site's own.

## The rules that hold throughout

1. **Dezio, with this plugin's tools,** never a local framework project or a site coded in a folder. Any
   business may have one: a trade, a practice, a shop, a car wash, a café.
2. **The design's own section types,** beside the platform's three, the Google reviews, before and after, and the
   video, and our legal pages where the client chose them; the contact form, the job application form and the map
   stand in the design's own sections through their slots (`design-folder.md`). Those do what a design can't.
3. **The legal links and the consent bar stay visible** at every width, never covered or hidden.
4. **The home page is approved before any subpage is built:** every subpage uses its header, footer, stylesheet and
   section types, so none is redone.
5. **Looking at a page:** with Claude in Chrome where it is connected, at 390 and 1440 px wide. Without it,
   `template_sites-custom` with `page.look` draws a page at 390 and 1280 px in a job, and `template_sites-read` with
   `page.get_look` shows each part of it as a visitor sees it scrolled there, what moves on the scroll where the
   scroll puts it and motion on a timer at its end, and what the browser found; never a browser program of your own.
6. **Signed in as the person:** the Dezio tools and the design folder each sign in to Dezio in the browser, once.
   Where Dezio's tools need a sign-in again, ask the person to type `/mcp`, choose `plugin:dezio:dezio`, then
   Authenticate; the design folder shows its own link when it needs one.
7. **The site meets WCAG 2.2 at levels A and AA,** as our accessibility statement says where the site has it; the
   page look's findings name what it misses. Visitors who ask their device for less motion get a calm version. What
   moves by itself for more than five seconds beside the content can be paused, or ends by itself. Motion the visitor
   drives, by scrolling, dragging or a click, is free.
8. **Waiting on a job:** a call that starts one, such as a page look, pictures or a read of a website, answers its
   `job_id`. Wait for it with the design folder's `job_wait`: one call that waits on this computer until the job
   ends, two minutes at most, and answers it as it ended; one still running then is waited on with another call.

The plugin keeps each prompt typed in a site's design folder, and its Claude Code session, with that site in
Dezio, where its editors can read them (`template_sites-read` with `design_prompt.list`), so the design can be traced
back to what was asked and faults looked into; tell the person so when they ask.

## 1. Set up the site

A custom site is a Dezio site with a design of its own. Everything around the design is the platform's and
never rebuilt by hand: the contact form and its enquiries, the consent bar, the search texts, the menu, publishing,
the share link and, where the client chooses them, our imprint, privacy policy and accessibility statement, written for
German law, in each of the site's languages, from the business's details at each publish. A site in several languages
is built by the languages guide, with "Sites in several languages" below.

- Call `rules-get` once, then `core-read` with `site.list_mine` to find a site's id, or with `organisation.list_mine`
  for a new site's organisation.
- **A new site:** first ask, where the brief doesn't say, which languages its pages are written in, which of them is
  the main one, and where the business is. Then `core-site-new` with the business's name, those `languages` and
  `default_language`, the `time_zone` of the business's place, such as `"Europe/Berlin"` (every date the site shows
  follows it), `modules: ["content", "template_sites", "consent"]` (add `"blog"` for a blog), `address_form:
  "informal"` where the site addresses its visitors informally (the facts guide), and every business detail you have,
  its `country` among them; leave out the wizard's steps, which a custom site doesn't need. Then `template_sites-write`
  with `site.set_up`, the base every custom site stands on.
- **An existing template site** keeps its record, its pages and its client's access; its template pages stay and are
  rewritten with the new section types. Until they are, the publish check suggests each template section by name,
  as the design doesn't style it.
- Choose the design folder, the session's working folder or a new folder in it, and call `design_init` with the site's
  id and the folder's absolute path: it makes the site custom and names it in the folder's `studio.json`, and pulls its
  design into `design/` where one was pushed before; on a site whose design was never pushed the folder starts empty
  (`design-folder.md`, "Working loop"). Its pages, the contact page among them, are written in the design's own section
  types (step 4).
- The legal pages, as the interview guide asks for them: on a no, pages of the business's own, written with
  `content-write` and marked with `page.save`'s `legal_page`, are linked the same as ours, or the site has none.

## 2. The brief and the business's facts

Read the interview and facts guides when this step starts.

- The logo and the client's own photos come in through the design folder's `design_upload`, each with its alt text;
  the logo's file id then goes to the business details (`core-site-update`, `business_details.set`, `logo`).
- **A business with a website:** take its pictures before any design, as the pictures guide says, and look at them
  before planning the look.

## 3. The home page, until the client approves it

Read `design-folder.md` before building (with `scripts.md` for anything that moves or opens), and the pictures guide
for its pictures.

- **Three directions, then the best one built:** think of three really different directions (the idea that carries the
  page, the colours, the type), choose the one that fits the brief best, and say in one line which and why. Build it
  and show it through the share link: the client judges what they see, and may ask for another of the three, or
  anything else, at any time. Where the client asks to choose before anything is built, describe the three in a line
  each. The look is the business's own, never one of our templates'.
- **Looks that read as generated,** avoided unless the brief asks for them: a cream ground with a terracotta accent,
  or near-black with one acid accent; identical rounded cards with the same soft shadow as the page's structure, cards
  inside cards; a small all-caps label above every heading; numbered markers (01 / 02 / 03) on things that aren't a
  sequence; one word of a heading in another colour or italics; gradient text; glass and blur as decoration; "→"
  after every link; meta lines joined with middle dots; a monospace face for labels; a big number with a small label
  as the hero.
- **Plan the look, then check the plan against the brief.** Write the plan in a few lines: four to six named colours,
  the type and what each face does, how the header, the home page's sections and the footer are laid out, and what
  makes this site the business's own. Then compare it with the site you would make for any business of its kind: each
  part, the header and the footer included, that you would make the same way anyway, make again from this business,
  its brief, its trade, its place and its facts, and say what you changed and why. Build only then.
- Build the header, footer, stylesheet and section types in the design folder, and push them with `design_push` after
  each change. A refused push names the file, the line and what to change.
- Make the home page with `content-write` (`page.create` with the slug `""`, where the site has none), then write it
  with `page.save`.
- **Its pictures:** plan the picture places the look needs, and fill the home page's before it is shown, as the
  pictures guide says; `design_describe` describes many pictures at once. Each subpage the same way.
- Show it to the client through a share link (the publishing guide).
- Change it until the client approves it. Every push is kept as a version, and `custom_design.roll_back` takes the
  design back to one (`design-folder.md`, "Working loop").

## 4. The subpages

Read the search guide when this step starts.

- The pages the client chose (the interview guide), each named in its page's language. Make each with
  `content-write` (`page.create`), then write it (`page.save`) in the design's own section types; `template_sites-pages`'
  `page.add` writes the template's sections, so a custom site takes its pages from `page.create`.
- The contact page, made the same way: a section of the design's own with the form
  (`data-slot="contact-form"`), the business's details through `data-business`, never typed in, and the map
  (`data-slot="map"`) where the client wants one.
- The menu, as the search guide says, two levels deep at most. A page the menu names gets built, or its item waits
  until it is.
- The links lead to the site's own pages, as the new site replaces the business's current one; links elsewhere are
  for other services (`design-folder.md`, "What markup may hold").
- Share the link again; the client approves the subpages before the modules.

## 5. The modules

`core-read` with `module.list_catalogue` lists what each module adds; `core-site-setup` with `module.switch` switches
one on.

- **Forms:** the contact form in a section of the design's own, on the contact page and wherever an enquiry belongs.
  Enquiries arrive in `core-read` (`form.list_submissions`).
- **Jobs:** a careers page whose section of the design's own names the open jobs and holds the application form
  (`data-slot="application-form"`), where the applicant writes the job, and a page for each job where there are several.
  Applications arrive in `core-read` (`form.list_submissions`, purpose `application`).
- **Reviews:** the `google_reviews` section shows the business's Google reviews (the facts guide). Other reviews the
  design's section quotes, its words in a `<blockquote>` and the reviewer in a `<cite>` (`design-folder.md`, "A section
  type").
- **Blog:** `blog-write` (`post.create`, `post.save`, `post.publish`). A post is online as soon as it is published; one
  holding a section type a design push added or changed since the last publish waits for the site's next publish, so
  publish it with the site.
- **Before and after:** the `before_after` section, two pictures of one job the visitor compares by dragging; never a
  slider of the design's own.
- **Video:** the `video` section, a YouTube or Vimeo video whose player loads once the visitor agrees.

## 6. Checks and publishing

The publishing guide's checks, its publish and the own domain, and with the design:
- **Accessibility and the phone:** rule 7 at 320, 390 and 1440 px wide, looking as rule 5 says; the legal links and
  the consent bar read at each width.
- **The handover:** the share link shows the consent bar, and nothing of our templates' look shows on a page, the
  contact page or a legal page.

## Sites in several languages

The languages guide, and with the design:
- **The design, once:** one header, footer, stylesheet and set of section types for every language, with the design's
  own fixed words in `design/words/<language>.json`, a file for each language (`design-folder.md`, "Words in each
  language"). Its `languages` slot, in the header or the footer, leads visitors to each page's translation
  (`design-folder.md`, "Bindings").
- **Its pictures, described in each language:** `design_describe` describes many at once, each with that `language`.
