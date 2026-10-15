# The interview

How to gather the business's facts where the brief doesn't hold them: short, in the client's language, and never more
than four questions at once. Ask nothing the brief or the current website already answered.

Where an answer is a choice (the legal form, which pages, the style), ask with the app's multiple-choice question tool
where it has one, such as Claude Code's `AskUserQuestion`: up to four choices, any other answer typed. Free text is
asked in plain chat.

## First: is there a website?

Ask whether the business has a website now. If it has, offer to read it: `template_sites-write` with `prefill.start`.
It is paid and says its cost before it runs; tell the client the cost and run it only on their yes.
`template_sites-read` with `prefill.get` lists what it found: read it back, set only what the client confirms, and ask
below only for what is still missing.

## Then, in small groups

Before each group, say which answers the site needs before it can go live (for the imprint) and which are optional.
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
   - their own photos.

   The logo and photos are uploaded as `core-file-write` explains. The services, prices and areas go into the pages'
   words, not the details.
5. **Which pages** beside the home page, as choices to tick: Leistungen (with a page per service), Über uns, Karriere,
   Blog.

## At the end

- `core-read` with `business_details.get`: say what `missing_for_publish` still lists, in plain words ("the site still
  needs your phone number before it can go live"). A site can be built with gaps, but not published.
- Ask: "Anything else the site should say or show?"
- The style: offer three directions, one line each, to pick one, or offer to show all three first.
  `local-business-design` then plans the chosen one.
