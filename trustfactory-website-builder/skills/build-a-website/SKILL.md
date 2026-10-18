---
name: build-a-website
description: Builds and changes websites for businesses on Website Studio with this plugin's tools, never as a local framework project - the business's own facts, a custom design pushed from the design folder, the home page approved through a share link, the subpages, words, pictures, search, accessibility, publishing and the own domain. Use whenever someone wants to build, redesign or change a website or homepage, its pages, words, pictures or look, for any kind of business ("Website erstellen", "Homepage bauen", "Seite ändern", "Texte für meine Webseite").
---

# Build a website

## The rules that hold throughout

1. **Website Studio, with this plugin's tools,** never a local framework project or a site coded in a folder. Any
   business may have one: a trade, a practice, a shop, a car wash, a café.
2. **Only the business's own facts.** A number, a year, a price, a name, a review, a place served, a kind of job it
   takes or a step of how it works stands on a page only where the business gave it. Anything a page needs that it didn't give is marked
   `[FEHLT: …]` and asked for (`words.md`, "The claim check").
3. **Words are saved as drafts, their markers in them,** with `content-write` as each page is written, never left in
   the chat alone: the Studio holds them, the share link shows them to the client, and the publish check stops a page
   that still holds a marker.
4. **"Sie" by default.** "Du" only where the client asks for it or their own texts use it, and then throughout, the
   site set to it (`core-site-update`, `site.set_address_form`), so the platform's own texts say "du" too.
5. **The design's own section types,** beside the platform's three, the Google reviews, before and after, and the
   video, and our legal pages where the client chose them; the contact form, the job application form and the map
   stand in the design's own sections through their slots (`design-folder.md`). Those do what a design can't.
6. **The legal links and the consent bar stay visible** at every width, never covered or hidden.
7. **The home page is approved before any subpage is built:** every subpage uses its header, footer, stylesheet and
   section types, so none is redone.
8. **A paid step shows its cost and is confirmed once:** reading a current website, taking its pictures, making
   pictures.
9. **Nothing is public before a publish, and search engines find the site only on the business's own domain,** once
   that points here; a test address stays hidden from them.
10. **Read a step's reference when the step starts,** and again when coming back to it after a long pause or after the
    conversation was compacted.
11. **Looking at a page:** with Claude in Chrome where it is connected, at 390 and 1440 px wide. Without it,
    `template_sites-custom` with `page.look` draws a page at 390 and 1280 px in a job, and `template_sites-read` with
    `page.get_look` shows each part of it and what the browser found; never a browser program of your own.
12. **A key the Studio no longer takes:** where its tools answer 401, "Credential not accepted", ask the person to
    make a new key in the Studio under AI agents, enter it in the plugin's options
    (`/plugin configure trustfactory-website-builder@website-studio`), then restart Claude Code.

The plugin keeps each prompt typed in a site's design folder with that site in the Studio, where its editors can read
them, so the design can be traced back to what was asked and faults looked into; tell the person so when they ask.

## 1. Set up the site

A custom site is a Website Studio site with a design of its own. Everything around the design is the platform's and
never rebuilt by hand: the contact form and its enquiries, the consent bar, the search texts, the menu, publishing,
the share link and, where the client chooses them, our imprint, privacy policy and accessibility statement, written for
German law, in German, from the business's details at each publish.

- Call `rules-get` once, then `core-read` with `site.list_mine` to find a site's id, or with `organisation.list_mine`
  for a new site's organisation.
- **A new site:** `core-site-new` with the business's name, `languages: ["de"]`, `default_language: "de"`,
  `time_zone: "Europe/Berlin"`, `modules: ["content", "template_sites", "consent"]` (add `"blog"` for a Ratgeber),
  `address_form: "informal"` where the client says "du", and every business detail you have; leave out the wizard's
  steps, which a custom site doesn't need. Then `template_sites-write` with `site.set_up`, the base every custom site
  stands on.
- **An existing template site** keeps its record, its pages and its client's access; its template pages stay and are
  rewritten with the new section types. Until they are, the publish check suggests each template section by name,
  as the design doesn't style it.
- Choose the design folder, the session's working folder or a new folder in it, and call `design_init` with the
  site's id and the folder's absolute path: it makes the site custom, with a first design, and pulls the design into
  `design/`. Its pages, the contact page among them, are written in the design's own section types (step 4).
- Ask, as a plain yes or no, whether the site gets our legal pages. On a yes, `template_sites-pages` with
  `legal.add_pages` and `language: "de"` adds the three, each linked in the footer. On a no, pages of the business's
  own, written with `content-write` and marked with `page.save`'s `legal_page`, are linked the same, or the site has
  none.

## 2. The brief and the business's facts

Read `interview.md` when this step starts.

- From the brief, or by asking: what the business does, its town and the places it serves, its services, the one
  thing a visitor should do (call, or send an enquiry), its brand (logo, colours, fonts) and the proof that exists
  (reviews, the year it started, qualifications).
- **A business with a website:** `template_sites-write` with `prefill.start` reads it for the imprint's details,
  opening hours, services, founding year, team size and story; `template_sites-read` with `prefill.get` lists each
  value with the page and words it stands in. Set only what the client confirms, with `core-site-update`
  (`business_details.set`). Then take its pictures, before any design: `template_sites-pages` with
  `picture.import_from_site`, followed with `core-read` (`job.get`); `template_sites-read` with `picture.get_import`
  says what it kept and why, and `picture.get_contact_sheet` shows them. Look at them before planning the look.
- Where the client has texts of their own, their current website or what they send, read whether they say "du" or
  "Sie", write the site the same way, and set the site to it (rule 4).
- `core-read` with `business_details.get` shows the facts the site holds, and what our imprint still needs.

## 3. The home page, until the client approves it

Read `look.md` and `words.md` before planning, `design-folder.md` before building (with `scripts.md` for anything that
moves or opens), and `pictures.md` for its pictures.

- Plan the look and the page, and check the plan against the brief before any code: a look of the business's own,
  never one of our templates'. A high-end brief starts with two or three reference sites and an approved first screen
  (`look.md`).
- Build the header, footer, stylesheet and section types in the design folder, and push them with `design_push` after
  each change. A refused push names the file, the line and what to change.
- Make the home page with `content-write` (`page.create` with the slug `""`, where the site has none), then write it
  with `page.save`.
- Its pictures: the client's own photos first, from their current website and those they send, then pictures Website
  Studio makes for the places left. The same for every subpage.
- Show it to the client: `core-preview-link-create` makes a link that shows the drafts without a login, for 1 to 30
  days. It takes a key of the site's admin, and the link is shown once: hand it over as it is.
- Change it until the client approves it. Every push is kept as a version (`template_sites-read` with
  `design_version.list`), and `template_sites-custom` with `custom_design.roll_back` takes the design back to one.

## 4. The subpages

Read `search.md` when this step starts.

- The pages, in `look.md`'s order: Leistungen, a page per service, Über uns, Karriere where the business is hiring,
  and a page per town only where `search.md` allows one. Make each with `content-write` (`page.create`), then write
  it (`page.save`) in the design's own section types; never with `template_sites-pages`' `page.add`, which writes the
  template's sections and which a custom site refuses.
- The contact page, `kontakt`, made the same way: a section of the design's own with the form
  (`data-slot="contact-form"`), the business's details through `data-business`, never typed in, and the map
  (`data-slot="map"`) where the client wants one.
- The menu: `page.move` orders it, and `page.set_menu_parent` lists a service's page under Leistungen, which its
  breadcrumb then reads ("Start > Leistungen > Fassadenanstrich"); two levels deep at most. A page the menu names gets
  built, or its item waits until it is.
- The links lead to the site's own pages: the new site replaces the business's current one. Links elsewhere are for
  other services: social profiles, maps, videos, the authorities the legal pages name.
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
  reviews; the `google_reviews` section shows them. A review is never written by hand.
- **Blog:** `blog-write` (`post.create`, `post.save`, `post.publish`). A post is online as soon as it is published; one
  holding a section type a design push added or changed since the last publish waits for the site's next publish, so
  publish it with the site.
- **Before and after:** the `before_after` section, two pictures of one job the visitor compares by dragging; never a
  slider of the design's own.
- **Video:** the `video` section, a YouTube or Vimeo video whose player loads once the visitor agrees.

## 6. Checks

Read `accessibility.md` for check 3.

1. **Every picture place filled,** once the pages are written, without being asked: `content-read` with
   `page.list_picture_places` on each page; the client's photos first, then one `template_sites-pages` `picture.make`
   for every place still empty, up to 30 at once, its cost shown and confirmed once (`pictures.md`). A site shown with
   empty places looks unfinished.
2. **Search:** every page's title, description, one main heading, link words and described pictures (`search.md`).
3. **Accessibility and the phone:** the handover check at the end of `accessibility.md`, at 320, 390 and 1440 px.
4. **Words:** every number, year, price, place and step of the work backed by the business's facts (`words.md`), and
   the `[FEHLT: …]` markers named to the client, who fills them or takes the sentence out.
5. **The handover:** the menu and the contact page are there, the legal pages the client chose, and the share link
   shows the consent bar; nothing of our templates' look shows, a page, the contact page and a legal page opened side
   by side with the plan.
6. **What stops a publish:** `template_sites-read` with `publish.get_problems` names each problem, where it is and
   what to change: pages with `content-write`, pictures with `core-file-write`, the business's details with
   `core-site-update`.

## 7. Publish

`template_sites-publish` with `site.publish` puts the site's changes online; `template_sites-read` with
`publish.get_status` follows it. If something is wrong, `site.roll_back` serves the previous publish again at once.

Then say, by the site's address, whether search engines can find it (`core-read` with `site.list_mine` answers
`indexing`):
- **On a test address** (such as `….vercel.app`): online for whoever has the link, and hidden from search engines,
  with no sitemap, as it should be. Offer the own domain as the launch (step 8).
- **On its own domain, pointing here:** visible to search engines, with its `sitemap.xml` and `llms.txt`.

## 8. The own domain

Connecting the business's own domain is the launch; there is no other step.

1. `core-site-setup` with `site.set_address` gives the site the domain.
2. Publish (step 7): a new address is served only from a publish drawn for it.
3. `template_sites-read` with `host.get_dns` names the one DNS record the domain's owner adds where it doesn't point
   here yet. Hand it over as it is.
4. Once it is added, `template_sites-publish` with `host.check_dns` asks again (`core-read` `job.get` follows it), and
   `host.get_dns` says what it saw.
5. Once the domain points here, the site is visible to search engines there. Open its live `sitemap.xml` and
   `robots.txt` once: the sitemap lists the pages, and `robots.txt` names it.
6. From then on, a change visitors would see answers a preview first (`rules-get`, `live_preview`): confirm it as the
   person asks.
