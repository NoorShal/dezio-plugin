---
name: build-a-website
description: Builds and changes websites for businesses on Website Studio with this plugin's tools, never as a local framework project - the business's own facts, a custom design pushed from the design folder, the home page approved through a share link, the subpages, words, pictures, search, accessibility, publishing and the own domain. Use whenever someone wants to build, redesign or change a website or homepage, its pages, words, pictures or look, for any kind of business ("Website erstellen", "Homepage bauen", "Seite ändern", "Texte für meine Webseite").
license: Contains a few lines adapted from Anthropic's frontend-design and Paul Bakaus' impeccable (both Apache-2.0) and Corey Haines' marketingskills (MIT). See THIRD-PARTY.md in the plugin.
---

# Build a website

## The rules that hold throughout

1. **Website Studio, with this plugin's tools,** never a local framework project or a site coded in a folder. Any
   business may have one: a trade, a practice, a shop, a car wash, a café.
2. **Only the business's own facts.** A number, a year, a price, a promise, a name, a review, a rating, a place
   served, a kind of job it takes or a step of how it works stands on a page only where the business gave it: in its
   details (`core-read` with `business_details.get`), the brief, or the client's own words; never invented, estimated
   or rounded up. No page suggests an office or a workshop where the business has none. Where a sentence needs a fact
   the business didn't give, leave the sentence out and note the fact with `template_sites-pages` `facts.ask`, with
   the page's id and the fact in the client's words and language, such as "year founded": the share link's bar lists
   it for the client, never the page. Once the client gives it, write the sentence and take the fact off with
   `facts.done`. A marker such as `[MISSING: …]` left in a text stops a publish. Step 6, check 4, is the claim check.
3. **Words are saved as drafts** with `content-write` as each page is written, never left in the chat alone: the
   Studio holds them, and the share link shows them to the client.
4. **The formal form of address by default,** in a language that has one. The informal one only where the client
   asks for it or their own texts use it, and then throughout, never mixed (a quoted review aside), the site set to it
   (`core-site-update`, `site.set_address_form`), so the platform's own texts use it too.
5. **The design's own section types,** beside the platform's three, the Google reviews, before and after, and the
   video, and our legal pages where the client chose them; the contact form, the job application form and the map
   stand in the design's own sections through their slots (`design-folder.md`). Those do what a design can't.
6. **The legal links and the consent bar stay visible** at every width, never covered or hidden.
7. **The home page is approved before any subpage is built:** every subpage uses its header, footer, stylesheet and
   section types, so none is redone.
8. **A paid step shows its cost and is confirmed once:** reading a current website, taking its pictures, making
   pictures, having the AI write a translation.
9. **Nothing is public before a publish, and search engines find the site only on the business's own domain,** once
   that points here; a test address stays hidden from them.
10. **Read a step's reference when the step starts,** and again when coming back to it after a long pause or after the
    conversation was compacted.
11. **Looking at a page:** with Claude in Chrome where it is connected, at 390 and 1440 px wide. Without it,
    `template_sites-custom` with `page.look` draws a page at 390 and 1280 px in a job, and `template_sites-read` with
    `page.get_look` shows each part of it as a visitor sees it scrolled there, what moves on the scroll where the
    scroll puts it and motion on a timer at its end, and what the browser found; never a browser program of your own.
12. **A key the Studio no longer takes:** where its tools answer 401, "Credential not accepted", ask the person to
    make a new key in the Studio under AI agents, enter it in the plugin's options
    (`/plugin configure trustfactory-website-builder@website-studio`), then restart Claude Code.
13. **The site meets WCAG 2.2 at levels A and AA,** as our accessibility statement says where the site has it; the
    page look's findings name what it misses. Visitors who ask their device for less motion get a calm version. What
    moves by itself for more than five seconds beside the content can be paused, or ends by itself. Motion the visitor
    drives, by scrolling, dragging or a click, is free.
14. **Waiting on a job:** a call that starts one, such as a page look, pictures or a read of a website, answers its
    `job_id`. Wait for it with the design folder's `job_wait`: one call that waits on this computer until the job
    ends, two minutes at most, and answers it as it ended; one still running then is waited on with another call.
    Never read the job again and again, and never sleep.

The plugin keeps each prompt typed in a site's design folder, and its Claude Code session, with that site in the
Studio, where its editors can read them (`template_sites-read` with `design_prompt.list`), so the design can be traced
back to what was asked and faults looked into; tell the person so when they ask.

## 1. Set up the site

A custom site is a Website Studio site with a design of its own. Everything around the design is the platform's and
never rebuilt by hand: the contact form and its enquiries, the consent bar, the search texts, the menu, publishing,
the share link and, where the client chooses them, our imprint, privacy policy and accessibility statement, written for
German law, in each of the site's languages, from the business's details at each publish. A site in several languages
is built as "Sites in several languages" says, below.

- Call `rules-get` once, then `core-read` with `site.list_mine` to find a site's id, or with `organisation.list_mine`
  for a new site's organisation.
- **A new site:** first ask, where the brief doesn't say, which languages its pages are written in, which of them is
  the main one, and where the business is. Then `core-site-new` with the business's name, those `languages` and
  `default_language`, the `time_zone` of the business's place, such as `"Europe/Berlin"` (every date the site shows
  follows it), `modules: ["content", "template_sites", "consent"]` (add `"blog"` for a blog), `address_form:
  "informal"` where the site addresses its visitors informally (rule 4), and every business detail you have, its
  `country` among them; leave out the wizard's steps, which a custom site doesn't need. Then `template_sites-write`
  with `site.set_up`, the base every custom site stands on.
- **An existing template site** keeps its record, its pages and its client's access; its template pages stay and are
  rewritten with the new section types. Until they are, the publish check suggests each template section by name,
  as the design doesn't style it.
- Choose the design folder, the session's working folder or a new folder in it, and call `design_init` with the site's
  id and the folder's absolute path: it makes the site custom and names it in the folder's `studio.json`, and pulls its
  design into `design/` where one was pushed before; on a site whose design was never pushed the folder starts empty
  (`design-folder.md`, "Working loop"). Its pages, the contact page among them, are written in the design's own section
  types (step 4).
- Ask, as a plain yes or no, whether the site gets our legal pages. On a yes, `template_sites-pages` with
  `legal.add_pages` adds the three to a language's pages, in its words, each linked in the footer: once for each of
  the site's languages, `language` its tag, such as `"de"`. On a no, pages of the business's own, written with
  `content-write` and marked with `page.save`'s `legal_page`, are linked the same, or the site has none.

## 2. The brief and the business's facts

Read `interview.md` when this step starts.

- From the brief, or by asking: what the business does, its town and the places it serves, its services, the one
  thing a visitor should do (call, or send an enquiry), its brand (logo, colours, fonts) and the proof that exists
  (reviews, the year it started, qualifications).
- **A business with a website:** `template_sites-write` with `prefill.start` reads it for the imprint's details,
  opening hours, services, founding year, team size and story; `template_sites-read` with `prefill.get` lists each
  value with the page and words it stands in. Set only what the client confirms, with `core-site-update`
  (`business_details.set`). Then take its pictures, before any design: `template_sites-pages` with
  `picture.import_from_site`, waited on with `job_wait`; `template_sites-read` with `picture.get_import`
  says what it kept and why, and `picture.get_contact_sheet` shows them. Look at them before planning the look.
- Where the client has texts of their own, their current website or what they send, read which form of address they
  use, write the site the same way, and set the site to it (rule 4).
- `core-read` with `business_details.get` shows the facts the site holds, and what our imprint still needs.

## 3. The home page, until the client approves it

Read `design-folder.md` before building (with `scripts.md` for anything that moves or opens), and `pictures.md` for
its pictures.

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
- **Its pictures:** a business's site shows its work, its place and its people in pictures. The client's own photos
  come first, from their current website and those they send; where they have none, Website Studio makes them in the
  site's style, so missing photos never make a page without pictures. Plan the picture places the look needs, and fill
  the home page's before it is shown: one `template_sites-pages` `picture.make` for the places left, its cost shown
  and confirmed (rule 8, `pictures.md`). Each subpage the same way.
- Show it to the client: `core-preview-link-create` makes a link that shows the drafts without a login, for 1 to 30
  days. It takes a key of the site's admin, and the link is shown once: hand it over as it is.
- Change it until the client approves it. Every push is kept as a version, and `custom_design.roll_back` takes the
  design back to one (`design-folder.md`, "Working loop").

## 4. The subpages

Read `search.md` when this step starts.

- The pages the client chose (`interview.md`, group 5), each named in its page's language: the services with a page
  per service, one about the business, and careers where the business is hiring. Make each with `content-write`
  (`page.create`), then write it (`page.save`) in the design's own section types; never with `template_sites-pages`'
  `page.add`, which writes the template's sections and which a custom site refuses.
- The contact page, made the same way: a section of the design's own with the form
  (`data-slot="contact-form"`), the business's details through `data-business`, never typed in, and the map
  (`data-slot="map"`) where the client wants one.
- The menu: `page.move` orders it, and `page.set_menu_parent` lists a service's page under the services page, which
  its breadcrumb then reads, from the home page down; two levels deep at most. A page the menu names gets built, or
  its item waits until it is.
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
- **Reviews:** `external_ratings-write` with `listing.set_link` names the business's Google listing and fetches its
  reviews; the `google_reviews` section shows them. Other reviews only as the client hands them over, exactly as
  written, with the reviewer's first name or initial, the place and the platform; a rating with its platform, the
  number of reviews and the date it was read. A review is never written, reworded or improved; the design's section
  quotes it, its words in a `<blockquote>` and the reviewer in a `<cite>` (`design-folder.md`, "A section type").
- **Blog:** `blog-write` (`post.create`, `post.save`, `post.publish`). A post is online as soon as it is published; one
  holding a section type a design push added or changed since the last publish waits for the site's next publish, so
  publish it with the site.
- **Before and after:** the `before_after` section, two pictures of one job the visitor compares by dragging; never a
  slider of the design's own.
- **Video:** the `video` section, a YouTube or Vimeo video whose player loads once the visitor agrees.

## 6. Checks

1. **Every picture place filled,** once the pages are written, without being asked: `content-read` with
   `page.list_picture_places` on each page; the client's photos first, then one `template_sites-pages` `picture.make`
   for every place still empty, up to 30 at once, its cost shown and confirmed once (`pictures.md`). A site shown with
   empty places looks unfinished.
2. **Search:** every page's title, heading, search title and description, and its pictures described (`search.md`).
3. **Accessibility and the phone:** rule 13 at 320, 390 and 1440 px wide, looking as rule 11 says; the legal links
   and the consent bar read at each width.
4. **The claim check,** before handing a page over and after every rewrite: list every number, name, date, price,
   place and promise on the page, every kind of job it takes and every step of how the work is done, and find each in
   the business's facts. A kind of job or a step the business didn't name, such as business premises, a wallpaper the
   customer picks or what it takes away, is a claim like any other. Anything not found goes, its fact noted with
   `facts.ask`. A rewrite never changes a number, a name or a date, and never adds a fact. `template_sites-read` with
   `facts.list` lists what is still missing, which the client sees in the share link's bar; a publish names it
   without stopping.
5. **The handover:** the menu and the contact page are there, the legal pages the client chose, and the share link
   shows the consent bar; nothing of our templates' look shows on a page, the contact page or a legal page.
6. **What stops a publish:** `template_sites-read` with `publish.get_problems` names each problem, where it is and
   what to change: pages with `content-write`, pictures with `core-file-write`, the business's details with
   `core-site-update`.

## 7. Publish

`template_sites-publish` with `site.publish` puts the site's changes online; `template_sites-read` with
`publish.get_status` follows it. If something is wrong, `site.roll_back` serves the previous publish again at once.

Then say, by the site's address, whether search engines can find it (`core-read` with `site.list_mine` answers
`indexing`):
- **On a test address** (under one of the test domains `core-read`'s `hostname.list` names): online for whoever has
  the link, and hidden from search engines, with no sitemap, as it should be. Offer the own domain as the launch
  (step 8).
- **On its own domain, pointing here:** visible to search engines, with its `sitemap.xml` and `llms.txt`.

## 8. The own domain

Connecting the business's own domain is the launch; there is no other step.

1. `core-site-setup` with `site.set_address` gives the main language the domain; on a site in several languages,
   each other language moves to it with the same tag ("Sites in several languages").
2. Publish (step 7): a new address is served only from a publish drawn for it.
3. `template_sites-read` with `host.get_dns` names the one DNS record the domain's owner adds where it doesn't point
   here yet. Hand it over as it is.
4. Once it is added, `template_sites-publish` with `host.check_dns` asks again (`job_wait` waits on it), and
   `host.get_dns` says what it saw.
5. Once the domain points here, the site is visible to search engines there. Open its live `sitemap.xml` and
   `robots.txt` once: the sitemap lists the pages, and `robots.txt` names it.
6. From then on, a change visitors would see answers a preview first (`rules-get`, `live_preview`): confirm it as the
   person asks.

## Sites in several languages

One design serves every language. The pages are written in the main language first, then each other language gets a
translation of every page, written in it.

- **The platform's own texts,** its buttons, forms and our legal pages' words, are made for a language the first time
  any site has it, in about a minute, starting when the site is made. A step that needs them sooner answers
  `template_sites_texts_not_ready`, saying what to do: wait for the job they are made in with `job_wait`, or start
  them with `core-site-setup` `text_set.make` and wait for its job; then the step runs again.
- **The contact form and its words are the platform's,** drawn in each page's language from the site's texts.
- **The design, once:** one header, footer, stylesheet and set of section types for every language, with the design's
  own fixed words in `design/words/<language>.json`, a file for each language (`design-folder.md`, "Words in each
  language"). Its `languages` slot, in the header or the footer, leads visitors to each page's translation
  (`design-folder.md`, "Bindings").
- **The main language first:** the home page and the subpages are made in it (`page.create` with its `language`) and
  approved by the client, as steps 3 and 4 say.
- **Then each other language, page by page in the menu's order,** a page before the pages listed under it:
  `content-write` with `page.translate`, the page's id, the `language`, and the `title` and `slug` written in that
  language, such as `servicios` for `services`. It makes a draft in the language with the page's sections, heading,
  search texts and pictures, joins it to the page as its translation, and lists it in the menu under the translation
  of the page it stands under, so each language's menu follows the main one. Then write every text of the draft in
  its language with `page.save` (`page.get` gives the revisions): the sections' values, the `heading`, the
  `seo_title` and the `seo_description` (`search.md`). A translation says what its page says, as someone writing in
  the language would put it: the same facts, none added (rule 2), in the site's form of address (rule 4).
- **Or have the AI write it,** where the person asks for that: `content-write` with `page.write_translation`, the
  page's id and the `language`, writes the whole translation in a job by the rules above, every text, the heading,
  the search texts, the address and the pictures' descriptions in the language, and makes the draft only once all of
  it holds. It is paid, its preview showing the cost (rule 8). Wait on its job with `job_wait`; the draft then stands
  in `page.list` in that language with the page's `translation_id`, and `page.list_translation_writes` says why a try
  wrote nothing. Read the draft before handing it over, as step 6's claim check does.
- **Its pictures, described in the language:** a picture keeps a description for each language, and a page shows its
  own language's. Describe each picture of a translation in its language with the design folder's `design_describe`,
  many at once, each with that `language`, or `core-file-write` with `file.set_details` and its `language`; a page
  with a picture not described in its language isn't published, and the publish check names each.
- **A page written on its own** for one language, rather than translated, joins its counterpart in another language
  with `page.link_translation`, `of_page_id` that page's id, so the two are each other's versions.
- **Blog posts** the same way: `blog-write` with `post.translate`, the post's id, the `language`, and its `title`
  and `slug` in the language, then `post.save` and `post.publish`, or `post.write_translation` for the AI to write
  it; a post written on its own joins its counterpart with `post.link_translation`.
- **Our legal pages,** where the client chose them: `legal.add_pages` once for each language (step 1).
- **The checks of step 6** run on every language's pages.
- **The share link** shows every language's drafts: the main one at its root, each other under its tag, such as
  `…/es/`.
- **A web address for each language** before the first publish: `site.set_up` answers `languages_without_address`,
  and `core-site-setup` with `site.set_address` gives each its base address, the main language's first, at the
  domain's root, and each other under its tag there, such as `https://www.example.com/es`.

## German sites

On a page in German:
- **"Sie" by default.** "Du" only where the client asks for it or their own texts use it (rule 4); a site set to
  `"informal"` says "du" in the platform's own texts too.
- A fact noted with `facts.ask` is named in German, such as "Gründungsjahr", and the marker for one is `[FEHLT: …]`
  (rule 2).
- The subpages are Leistungen with a page per service, Über uns and Karriere, and the contact page is `kontakt`; a
  service's breadcrumb reads "Start > Leistungen > Fassadenanstrich" (step 4).
