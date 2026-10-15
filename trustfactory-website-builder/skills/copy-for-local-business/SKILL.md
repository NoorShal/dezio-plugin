---
name: copy-for-local-business
description: "Writes and edits the German words of a local business's website, of any kind - a trade, a practice, a shop - in formal Sie - headings, the opening, service pages, calls to action, reviews, job ads and the closing call - from the business's own facts only, marking anything missing as [FEHLT: …] instead of inventing it, with real reviews only and a check for phrases that read as machine-written. Use whenever a custom site's page text is written, rewritten or reviewed."
license: Contains material adapted from Corey Haines' marketingskills (MIT). See THIRD-PARTY.md in the plugin.
metadata:
  source: "https://github.com/coreyhaines31/marketingskills skills/copywriting, skills/copywriting/references/ai-tells.md, skills/copy-editing, skills/cro"
  commit: "c7d7dfb6b460fc376b4b2204b78a9c9fd5ca6467"
  sha256: "copywriting ecb4693fba9cc4f8, ai-tells 048a436d35d01131, copy-editing d23184ad62cbe29f, cro 6e172cc38178c800"
  changes: "Rewritten by Trustfactory for German local businesses in formal Sie: the missing-fact marker, the review rules, the German phrase list and the claim check are ours; the SaaS framing, humour, rhetorical questions and unsourced statistics are left out."
---

# Words for a local business

The visitor wants to know whether this business does their job, here, soon, and whether it can be trusted. Every
sentence answers part of that with a fact about this business. A sentence that would fit any competitor's page is
rewritten or cut.

## The rules that never bend

1. **Only the business's own facts.** Every number, year, price, guarantee, certificate, response time, team size,
   rating and place comes from what the business told us: its details (`core-read` with `business_details.get`), the
   brief, or the client in writing. Where a sentence needs a fact we don't have, write the sentence with the marker
   `[FEHLT: …]` naming what is missing, such as `[FEHLT: Gründungsjahr]` or `[FEHLT: Preis für einen Fassadenanstrich
   ab]`. Never invent, estimate or round up. No page goes live with a marker left in it.
2. **Formal "Sie", everywhere.** Never "du", never a mix. "Sie", "Ihr", "Ihnen" with a capital letter.
3. **Real reviews only,** exactly as written: from the Google listing through the template's `google_reviews`
   section, or reviews the client hands over with the reviewer's first name or initial, the place and the platform.
   A rating is shown with its platform, the number of reviews and the date it was read. Never write, shorten into new
   words, or "improve" a review.
4. **One main action per page,** named for what the visitor gets: "Angebot anfordern", "Rückruf vereinbaren",
   "Termin vereinbaren", or the phone number itself. Never "Absenden", "Mehr erfahren" or "Klicken Sie hier".
5. **A promise only if it is kept.** "Festpreis vorab", "Termin in 48 Stunden", "kostenloser Vor-Ort-Termin" only
   where the business really offers it, in those words.

## Before writing

Collect, and keep beside the draft:
- the trade, the town and the places served, each service in the business's own words;
- the facts behind each claim (rule 1), and the reviews;
- eight to twelve things only this business has: its street, its workshop, the year it started, the master's name,
  a material it is known for, a job it did in a named place. The opening and each section take one of these.
- the visitor's doubts for this trade: price, mess, timing, who comes, guarantee. Each is answered where the main
  action stands.

## Page by page

**The opening of the home page.** The trade and the town in the heading, as people search: "Ihr Maler in Regensburg".
One sentence on what the business does and for whom. The phone number as a button, and the enquiry.

**A service page.** The heading names the service and the place: "Fassadenanstrich in Regensburg". Then what the job
is, how it goes in three to five steps, what decides the price, where it is done, what it costs where the business
names a price, and its questions. End with the call.

**Über uns.** The story in facts: who started the business, when, where; the team; the qualifications by their names
("Malermeister", "Mitglied der Handwerkskammer Niederbayern-Oberpfalz"). No "Leidenschaft", no "Tradition trifft
Moderne".

**Kontakt.** What happens after an enquiry, as far as the business says it: who answers, how soon. The address and
the hours.

**A job ad.** The job's title as the trade names it ("Maler und Lackierer (m/w/d)"), where, from when, full or part
time; the tasks; what the business offers, only what it really does; what an applicant brings; how to apply, with
"Ein Lebenslauf genügt" only if it does.

**The closing call, on every page.** One short sentence, the phone, the enquiry button, and next to it the answer to
the strongest doubt, if the business has one: "Der Vor-Ort-Termin ist kostenlos."

## How it should sound

- Short sentences, active verbs, the customer as the subject: "Sie bekommen vorab einen Festpreis", not "Ein
  Festpreis wird vorab erstellt".
- Concrete over general: "Gerüst, Abdeckung und Reinigung sind im Preis enthalten" over "Rundum-sorglos-Service".
- The trade's own words, explained once where a customer wouldn't know them.
- Headings make a statement or name a thing; they never ask a question the next line answers.
- No exclamation marks in running text. No words in capitals for emphasis.
- German typography: „…“ quotes, an en dash in ranges ("Mo–Fr 7–17 Uhr"), "1.250 €" with a space before the euro
  sign, phone numbers as "0941 123450", dates as "14. Oktober 2026", and sentence case in every heading and button.

## Phrases that read as machine-written

A reader who meets one doubts the facts around it. Never write:

- **The staged contrast:** "Nicht nur …, sondern auch …", "Es geht nicht um X, sondern um Y", "Kein X. Sondern Y."
  Say Y, with its reason.
- **The list of absences:** "Kein Stress, keine Wartezeit, keine versteckten Kosten." Say what does happen. One real
  absence may stand once, next to the action: "Der Vor-Ort-Termin ist kostenlos."
- **The answered question:** "Das Ergebnis? Eine Fassade wie neu." "Unser Geheimnis: Sorgfalt." Write the statement.
- **The trailing pile-on:** a full sentence followed by a comma and more of the same ("…, schnell, sauber und
  zuverlässig"). End the sentence where the claim ends.
- **Stock openings and closings:** "Herzlich willkommen auf unserer Website", "In der heutigen schnelllebigen Zeit",
  "Ob Privatkunde oder Unternehmen", "Ihr kompetenter Partner für …", "Wir freuen uns auf Ihre Anfrage!",
  "Überzeugen Sie sich selbst".
- **Puffery without a fact:** "höchste Qualität", "erstklassig", "innovativ", "ganzheitlich", "maßgeschneidert",
  "nahtlos", "mit Leidenschaft", "Qualität, die überzeugt", "Ihr Wohlfühlfaktor". Replace each with the fact it stands
  for, or cut it.
- **Everything in threes:** three adjectives, three benefits, three bullets every time. Use as many as the facts give.
- **The dash as a pause** in headings and buttons. Use a full stop or a comma.

## The claim check

Before handing a page over, and after every rewrite:
1. List every number, name, date, price, place and promise on the page, and find each in the business's facts.
   Anything not found becomes `[FEHLT: …]` or goes.
2. Compare with the previous draft: a rewrite never changes a number, a name or a date, and never adds a fact.
3. Read every sentence over 20 words; split any that carries more than one claim.
4. Search the page for "du", "dein", "euch": none may remain outside a quoted review.
5. Apply the swap test to every heading: would it work unchanged for the nearest competitor? Rewrite it from the list
   of things only this business has.
6. Read the page aloud. Anywhere it sounds like an advertisement, put a fact in place of the sound.

## Where the rest lives

The page titles, descriptions and headings for search: `seo-for-local-business`. The pages and their order:
`local-business-design`. Link words and picture descriptions for screen readers: `accessibility-and-phone`.
