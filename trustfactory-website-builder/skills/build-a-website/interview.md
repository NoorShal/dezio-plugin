# The interview

Ask only what the brief and the current website don't answer, in the client's language, at most four questions at
once. A choice (the legal form, which pages) is asked with the app's multiple-choice question tool where it has one,
such as Claude Code's `AskUserQuestion`: up to four choices, any other answer typed. Free text is asked in plain chat.

## First: is there a website?

Ask whether the business has a website now. If it has, offer to read it: `template_sites-write` with `prefill.start`.
It is paid and says its cost before it runs; tell the client the cost and run it only on their yes.
`template_sites-read` with `prefill.get` lists what it found: read it back, set only what the client confirms, and ask
below only for what is still missing. Offer to take its pictures as well (`picture.import_from_site`, in
`template_sites-pages`): it is paid too, so say its cost and run it on their yes.

## Then, in small groups

Before each group, say which answers the site needs and which are optional; our imprint, where the client chooses it,
needs the legal ones. After each group, save the answers with `core-site-update` (`business_details.set`), so nothing
is lost if the talk stops.

1. **Who:** the business's registered name, its legal form and the person responsible for it (the owner, or who
   represents the company). All needed. The legal form as choices, the common forms of the business's country; any
   other typed. A form entered in a commercial register also needs the register and the number: ask in the same
   group.
2. **Where and how to reach them:** the country, street and house number, postcode and town, phone and e-mail. All
   needed.
3. **A regulated profession** (a chamber, a protected title, a permit from an authority, a required liability
   insurance): ask whether it applies; where it does, the imprint needs the chamber,
   the title and the country that granted it, the professional rules and where they are published, the supervisory
   authority, and the insurer and the area it covers. Ask only the parts that apply.
4. **Optional, one group at a time; skip whatever the client doesn't have:**
   - the logo, and a brand name where the site should call the business otherwise than its registered name;
   - the opening hours;
   - the services, with prices where they want them shown, and the towns and areas served: how far around its town
     it works, or the whole country;
   - the year it started and how many people work there;
   - the story (what sets it apart), the owner's qualification, the team;
   - the social profiles and the Google profile;
   - their own photos, beyond those taken from their current website.

   The logo and photos are added with `design_upload`; the logo's file id then goes to the business details
   (`core-site-update`, `business_details.set`, `logo`). The year it started, the team's size and how far it works
   go there too (`founding_year`, `team_size`, `service_area`: `{ "kind": "radius", "km": 25 }` or
   `{ "kind": "nationwide" }`), as its texts, structured data and imprint read them. The services, prices and towns go
   into the pages' words, not the details. Opening hours sent without a `note` keep the note they had, such as a
   holiday notice: send `note: null` to take it away.
5. **Which pages** beside the home page, as choices to tick, named in the client's language: the services (with a
   page per service), about the business, careers, a blog.
6. **Legal pages,** a plain yes or no: does the site get our imprint, privacy policy and accessibility statement,
   written for German law, in the site's languages? On a yes, add them (`SKILL.md`, step 1); the imprint then needs the
   details of groups 1 to 3. On a no, the business may give its own texts, written as pages of the site and marked as
   its legal pages, or have none.

## At the end

- Where the site has our imprint, `core-read` with `business_details.get`: say what `missing_for_imprint` still
  lists, in plain words ("the imprint still needs your phone number before the site can be published"). A site can be
  built with gaps, but not published while our imprint lacks a detail it draws.
- Ask: "Anything else the site should say or show?"
- Then the look (`SKILL.md`, step 3).

## German sites

For a business in Germany, and pages in German:
- The legal form as choices: Einzelunternehmen oder freier Beruf, GmbH, UG (haftungsbeschränkt), GbR; any other
  typed. A registered form (GmbH, UG, e. K., OHG, KG, AG and the like) also needs its register court and number, such
  as "Amtsgericht Musterstadt, HRB 12345" (group 1).
- A protected title is one such as Architekt or Steuerberater (group 3).
- The pages to tick: Leistungen (with a page per service), Über uns, Karriere, Blog (group 5).
