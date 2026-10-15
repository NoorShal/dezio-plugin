---
name: connect-a-site
description: Create a new Website Studio site, or take an existing one, and make it a custom site ready for its own design, with its contact form, consent bar and preview, and the legal pages the client chooses. Use when starting a custom website for a business on Website Studio.
---

# Connect a site

A custom site is a Website Studio site with a design of its own. Everything around the design comes from the platform
and is never rebuilt by hand: the contact form and its enquiries, the consent bar, the search texts, the menu,
publishing and the preview link; and, where the client chooses them, our imprint, privacy policy and accessibility
statement, written for German law, in German, from the business's details at each publish.

## Before you start

- The plugin is installed with a Website Studio key: Claude Code asks for it once, when the plugin is turned on, and
  keeps it in the computer's secure store, so there is nothing to type into a settings file. A person makes the key
  in the Studio, under Agent keys. It is never printed or written to a file.
- The plugin works with the online Studio. Only for another one, such as a Studio running on this computer, set
  `TF_STUDIO_API` to its API (and `TF_STUDIO_ADMIN` to the Studio, for its preview addresses).
- Call `rules-get` once, then `core-read` with `site.list_mine` to find a site's id.

## A new site

1. Find the organisation with `core-read` (`organisation.list_mine`), and its modules with
   `organisation.list_catalogue`.
2. `core-site-new` with the business's name, `languages: ["de"]`, `default_language: "de"`,
   `time_zone: "Europe/Berlin"`, `modules: ["content", "template_sites", "consent"]` (add `"blog"` for a Ratgeber), and
   every business detail you have: name, address, phone, e-mail, opening hours, and the imprint's legal data where the
   site will have our imprint. Leave out
   the `template_sites` steps: a custom site needs no trade, look or contents from the wizard.
3. `template_sites-write` with `site.set_up`: the site becomes a template site, the base every custom site stands on.
4. Choose the design folder, the session's working folder or a new folder within it, then call `design_init` with
   the site's id and the folder's absolute path. It makes the site custom (a first design and the contact page), pulls
   the design into `design/` and keeps with the site the prompts given there before.
5. Ask the client, as a plain yes or no, whether the site gets our imprint, privacy policy and accessibility
   statement, written for German law, in German. On a yes, `template_sites-pages` with `legal.add_pages` and
   `language: "de"` adds the three, each marked as its legal page and linked in the footer. On a no, it has none of
   ours: a page of the business's own, written with `content-write` and marked as its imprint or privacy policy with
   `page.save`'s `legal_page`, is linked the same, or the site has none.

## An existing site

A template site keeps its record, its pages and its client's access. Run steps 4 and 5 on it; its template pages stay
and can be rewritten with the new section types, and legal pages it has already stay as they are.

## Then

The whole job, in order: `build-a-custom-site`.

- Design it: the `design-a-custom-site` skill.
- Write its pages with `content-write`, in its own section types; of the template's, only the forms, the Google
  reviews and our legal pages where the site has them. Pictures are added with the plugin's `design_upload` (with the site's id), then used
  by their file id.
- Check what would stop a publish with `template_sites-read` (`publish.get_problems`), and publish with
  `template_sites-publish`. A person shares the preview link from the Studio's site screen.
