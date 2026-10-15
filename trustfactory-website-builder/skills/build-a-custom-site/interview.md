# The interview

How to gather the business's facts where the brief doesn't hold them: short, in the client's language, and never more
than four questions at once. Ask nothing the brief or the current website already answered.

Where an answer is a choice (the legal form, which pages, the style), ask with the app's multiple-choice question tool
where it has one, such as Claude Code's `AskUserQuestion`: up to four choices, any other answer typed. Free text is
asked in plain chat.

Every site is a real business's. Ask for its facts; where one isn't given, ask again later or mark it `[FEHLT: …]`
where a page needs it.

## First: is there a website?

Ask whether the business has a website now. If it has, offer to read it: `template_sites-write` with `prefill.start`.
It is paid and says its cost before it runs; tell the client the cost and run it only on their yes.
`template_sites-read` with `prefill.get` lists what it found: read it back, set only what the client confirms, and ask
below only for what is still missing. Offer to take its pictures as well (`picture.import_from_site`, in
`template_sites-pages`): it is paid too, so say its cost and run it on their yes.

## Then, in small groups

Before each group, say which answers the site needs and which are optional; our imprint, where the client chooses it,
needs the legal ones.
After each group, save the answers with `core-site-update` (`business_details.set`), so nothing is lost if the talk
stops.

1. **Who:** the business's registered name, its legal form and the person responsible for it (the owner, or who
   represents the company). All needed. The legal form as choices: Einzelunternehmen oder freier Beruf, GmbH,
   UG (haftungsbeschränkt), GbR; any other typed. A registered form (GmbH, UG, e. K., OHG, KG, AG and the like) also
   needs its register court and number, such as "Amtsgericht Musterstadt, HRB 12345": ask in the same group.
2. **Where and how to reach them:** street and house number, postcode and town, phone and e-mail. All needed.
3. **A regulated profession** (a chamber, a protected title such as Architekt or Steuerberater, a permit from an
   authority, a required liability insurance): ask whether it applies; where it does, the imprint needs the chamber,
   the title and the country that granted it, the professional rules and where they are published, the supervisory
   authority, and the insurer and the area it covers. Ask only the parts that apply.
4. **Optional, one group at a time; skip whatever the client doesn't have:**
   - the logo, and a brand name where the site should call the business otherwise than its registered name;
   - the opening hours;
   - the services, with prices where they want them shown, and the towns and areas served;
   - the story (the year it started, what sets it apart), the owner's qualification, the team;
   - the social profiles and the Google profile;
   - their own photos, beyond those taken from their current website.

   The logo and photos are added with `design_upload`; the logo's file id then goes to the business details
   (`core-site-update`, `business_details.set`, `logo`). The services, prices and areas go into the pages'
   words, not the details.
5. **Which pages** beside the home page, as choices to tick: Leistungen (with a page per service), Über uns, Karriere,
   Blog.
6. **Legal pages,** a plain yes or no: does the site get our imprint, privacy policy and accessibility statement,
   written for German law, in German? On a yes, add them (`connect-a-site`, step 5); the imprint then needs the
   details of groups 1 to 3. On a no, the business may give its own texts, written as pages of the site and marked as
   its legal pages, or have none.

## At the end

- Where the site has our imprint, `core-read` with `business_details.get`: say what `missing_for_imprint` still
  lists, in plain words ("the imprint still needs your phone number before the site can go live"). A site can be built
  with gaps, but not published while our imprint lacks a detail it draws.
- Ask: "Anything else the site should say or show?"
- The style: offer three directions, one line each, and the person picks one. `local-business-design` then plans the
  chosen one.
