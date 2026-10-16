---
name: build-a-custom-site
description: Builds a website for a business on Website Studio, through this plugin's tools, never as a local framework project or a site coded in a folder. Use whenever someone wants to build, make or create a website or homepage, redesign their site, or get a site for their business, in English or German ("Website erstellen", "Homepage bauen", "Seite neu gestalten", "eine Webseite für meinen Betrieb"), for any kind of business - a trade, a practice, a shop, a car wash, a supermarket, a café. The whole job in order - the brief and the business's facts, the home page designed until the client approves it through a share link, the subpages, the modules (forms, jobs, reviews, blog), the search, accessibility and phone checks, and publishing - naming the skill or tool each step uses. Use at the start, and whenever it is unclear what comes next.
---

# Build a custom site

Five steps, in this order. The client approves the home page before anything else is built on its look, so no
subpage is redone. Each step names the skill that holds the details; this map doesn't repeat them.

The site is built on Website Studio, with this plugin's tools, never as a local framework project. Any business may
have one: a craft trade, a practice, a shop, a car wash, a supermarket. Website Studio's list of trades is optional; a
business that isn't on it sets none, and loses nothing but the trade's checks on its pictures.

## 1. The brief and the business's facts

- From the brief, or by asking: what the business does, the town and the places served, the services, the one thing a
  visitor should do (call, or send an enquiry), the brand (logo, colours, fonts) and the proof that exists (reviews,
  the year the business started, qualifications). Where the brief doesn't hold the facts, interview the client as
  `interview.md` beside this file says: their current website first, then small groups, each saved as it goes.
- Set the site up with `connect-a-site`: a new site, or an existing template site, which keeps its pages and its
  client's access.
- **A redesign of a business that has a website:** `template_sites-write` with `prefill.start` reads the current site
  for the imprint's details, opening hours, services, founding year, team size and story. It is paid, and shows its
  cost before it runs. `template_sites-read` with `prefill.get` lists what it found, each value with the page and the
  words it stands in. Set only what the client confirms: the details with `core-site-update` (`business_details.set`).
  Then take its pictures, before any design: `template_sites-pages` with `picture.import_from_site` reads the current
  site's pages and keeps each of its pictures in the site's library, leaving out icons, other firms' logos and stock.
  It is paid too, and shows its cost first; `core-read` with `job.get` follows it, and `template_sites-read` with
  `picture.get_import` says what it kept and what it left out, and why. `picture.get_contact_sheet` shows the kept
  pictures: look at them before planning the look, which builds on the business's real photos. Placing them:
  `local-business-design`, `pictures.md`.
- `core-read` with `business_details.get` shows the facts the site holds, and what our imprint still needs where the
  site has it. A page may
  claim only what is there; anything else is marked `[FEHLT: …]` (`copy-for-local-business`).
- Every site is a real business's. Ask for its facts; where one isn't given, ask again later or mark it
  `[FEHLT: …]` where a page needs it.

## 2. The home page, until the client approves it

- Plan the look and the page with `local-business-design`, and the words with `copy-for-local-business`: a look of
  the business's own, never the template's, with its colours, type scale, components and one bold idea, the plan
  checked against the brief before any code.
- Build the header, footer, stylesheet and section types in the design folder with `design-a-custom-site`, pushing
  them with `design_push` after each change.
- Make the home page with `content-write` (`page.create` with the slug `""`, where the site has none), then write it
  with `page.save`.
- Its pictures: the client's own photos first, from their current site and those they send, then photos Website
  Studio makes for the other places (`local-business-design`, `pictures.md`). The same for every subpage.
- Look at it in the Studio's preview at phone and desk widths (`accessibility-and-phone`).
- Show it to the client: `core-preview-link-create` makes a link that shows the drafts without a login, for 1 to 30
  days. It works only with a key of the site's admin, and the link is shown once: hand it to the client as it is.
- Change it until the client approves it. Every push is kept as a version, your pushes within a minute as one
  (`template_sites-read` with `design_version.list`), and `template_sites-custom` with `custom_design.roll_back` takes
  the design back to one.

Go on only once the client has approved: every subpage uses the home page's header, footer, stylesheet and section
types.

## 3. The subpages

- The pages, in `local-business-design`'s order: Leistungen, one page per service, Über uns, Karriere where the
  business is hiring, and a page per town only where `seo-for-local-business` allows one. Make each with
  `content-write` (`page.create`), then write it (`page.save`) in the design's own section types. Never with
  `template_sites-pages`' `page.add`: it writes the template's own town and service sections, which a custom design
  doesn't style, and a custom site refuses it.
- The contact page came with the set-up: write its words. The legal pages are the client's choice (`connect-a-site`,
  step 5): ours, added with `legal.add_pages`, are never rebuilt by hand.
- The menu: `page.move` orders it, and `page.set_menu_parent` lists a service's page under Leistungen, which its
  breadcrumb then reads: "Start > Leistungen > Fassadenanstrich". It runs two levels deep at most.
- The links: the new site replaces the business's current one, so its menu, footer and buttons lead to its own pages.
  Links to other places are for other services, such as social profiles, maps, videos and the authorities the legal
  pages name. A page the menu names gets built, or its item waits until it is.
- Each page's title, main heading and search texts: `seo-for-local-business`.
- Share the link again for the subpages; the client approves them before step 4.

## 4. The modules

`core-read` with `module.list_catalogue` lists what each module adds; `core-site-setup` with `module.switch` switches
one on.

- **Forms:** the template's `contact_form` section, on the contact page and wherever an enquiry belongs. Enquiries
  arrive in `core-read` (`form.list_submissions`).
- **Jobs:** a careers page with the template's `application_form` section naming the open jobs, and a page for each
  job where there are several. Applications arrive in `core-read` (`form.list_submissions` with the purpose
  `application`).
- **Reviews:** `external_ratings-write` with `listing.set_link` names the business's Google listing and fetches its
  reviews; the template's `google_reviews` section shows them. Never write a review by hand.
- **Blog:** `blog-write` (`post.create`, `post.save`, `post.publish`). A post goes live on its own when it is
  published; one holding a section type a design push added or changed since the site was last published waits for
  the site's next publish, which puts the design live, so publish the post together with it.
- **Before and after:** the platform's `before_after` section, two pictures of a job the visitor divides by dragging.
  Never write a slider of the design's own for it.

These are the only platform sections a custom site uses, beside our legal pages: they do what a design can't (send
a form, fetch the Google reviews, move by the platform's own script). They take the design's look through its stylesheet (`design-a-custom-site`).

## 5. Checks, then publishing

1. **Search:** every page against `seo-for-local-business`: its title, description, one main heading, link words and
   described pictures.
2. **Accessibility and the phone:** the checks at the end of `accessibility-and-phone`, at 320, 390 and 1440 px.
3. **Words:** no `[FEHLT: …]` left, and every number, year, price and review backed by the business's facts
   (`copy-for-local-business`).
4. **What stops a publish:** `template_sites-read` with `publish.get_problems`. Fix each problem; `common-mistakes`
   has the usual ones.
5. **Publish:** `template_sites-publish` with `site.publish`. `template_sites-read` with `publish.get_status` follows
   it going live. If something is wrong, `site.roll_back` serves the previous publish again at once.
