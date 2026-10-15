<!--
The scene rules are adapted from Black Forest Labs' FLUX prompting rules, https://github.com/black-forest-labs/skills
(skills/flux-image-best-practices/rules/core-principles.md and negative-prompt-alternatives.md) at commit
8907d515b0ac270a988ec7a239add81ee13d6cba, sha256 1a98fd74e4e1cf64… and 6981b5cee7706f1b…. Copyright (c) 2026 Black
Forest Labs Inc., MIT License; the licence is in the plugin's licenses/bfl-skills/LICENSE.

Changed by Trustfactory: kept, in our words, the rules a photo of real work needs (what is there rather than what
isn't, the important first, the light named, prose of 30 to 80 words) and dropped the rest; added Website Studio's
own lessons from the checks of its builds' pictures, and the steps with its tools.
-->

# Pictures for a custom site

The client's own photos come first. For every other place, Website Studio makes a photo from your scene, checks it as
a demanding customer would and puts it in place. A place it can't fill well stays empty, never filled with a bad one.

## The steps

1. **The trade, where the business has one of the listed trades:** set it first (`template_sites-write`,
   `brief.set_trade`), so each picture is checked against how its craft is done. A business that isn't on the list,
   such as a shop or a car wash, sets none, and its pictures are checked as any small business's.
2. **The places:** `content-read` with `page.list_picture_places`, page by page: every picture field of its sections
   and list items, and whether it holds a picture yet.
3. **The pictures from the current site,** where `picture.import_from_site` took them (`build-a-custom-site`):
   `template_sites-read` with `picture.get_contact_sheet` shows them as one image of numbered thumbnails, up to 30 a
   sheet, and lists each number's file id, the page and heading it stood under, its old description and its size
   class; its `next_cursor`, passed as `after`, shows the next sheet. The numbers start again on each sheet, so keep a
   picture by its file id. Choose each place's picture by what you see in it: the opening takes an `opening`
   one (1,000 pixels wide or more), a card or tile a `tile` one (600 or more), and a `small` one only a small place.
   One marked `repeated` stood on many pages of the old site, often as its header photo. Put each in its place with
   `content-write` (`page.save`, the field's value the file's id), then describe it with `core-file-write`
   (`file.set_details`) as it shows there; the old description can help. The one marked `logo` is the business's
   logo: once the client confirms it, set it with `core-site-update` (`business_details.set`, `logo`). Those left
   unplaced leave the library by themselves 30 days after the site's first publish.
4. **The client's own photos:** real photos of their work, team, premises or vehicles beat any made one. Upload each
   as `core-file-write` explains, describe it there, and put it in its place with `content-write` (`page.save`, the
   field's value the file's id).
5. **The rest:** `template_sites-pages` with `picture.make`, up to ten places at once, each with its `scene`, `alt`
   and `shape`. It says first what it will cost, then is confirmed. `template_sites-read` with `picture.get_made` says
   what came of each place: placed, refused with the check's reason, not made in time, a picture put there
   meanwhile, or the place gone.
6. **A refused place:** read the check's reason, write the scene again calmer (below), and ask once more.

## The scene, in English

- **What is there, never what isn't:** a picture model draws what a "no" names. Write "plain, unbranded, text-free
  surfaces", never "no logos"; "an empty, quiet workshop", never "nobody in the frame".
- **The important first:** the subject and what happens, then the place, the light and the lens.
- **Name the light:** it shapes the picture more than anything else, such as "soft overcast daylight" or "late
  afternoon sun through a workshop window".
- **Prose of 30 to 80 words, concrete:** the business's real materials, colours and kind of place ("oiled oak and a
  beech workbench in a village joinery"), in German buildings and interiors. A scene any business could have is too
  vague.
- **A tool on its surface is drawn badly:** a roller on a wall, a brush on a frame, hands fitting a part. Show the
  work at rest instead: the finished surface, the tool laid down beside it.
- **People:** few, at work, seen from the side or from behind, their faces turned away; never a named person.
- **No writing anywhere:** vans, workwear, boxes and signs plain and unmarked. Never name a brand, not even to
  exclude it.
- **`avoid`** takes a few words for something none of the request's pictures may show, only where the scenes
  invite it.

## Shape and words

- **`shape`:** the shape the design draws the field in. `wide` (3:2) for an opening or a wide band, `card` (4:3) for
  cards and tiles, `square` (1:1), `portrait` (4:5) for a person or a tall subject; the place's frame crops the rest.
- **`alt`:** German, under 150 characters, one sentence of what the picture shows, as `accessibility-and-phone`
  ("Picture descriptions") has it: "Geölter Eichentisch in der Werkstatt, daneben ein Hobel". Where the picture sits
  right beside the name it shows, such as a service's card, mark it decorative in the library afterwards
  (`core-file-write`).
