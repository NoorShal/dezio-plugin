# Third-party material in this plugin

A few lines of the plugin's skill files are adapted from other people's published skills. Each source was copied once,
at the commit named here, read in full, and changed for German local businesses; nothing is fetched while a skill
runs. Naming a source says where a rule came from; it does not mean its author endorses this plugin.

The licence of each copied source is in `licenses/`, beside this file. A file that holds adapted material names its
sources at its top; this table gives each source's commit and a content hash (the first 16 characters of the file's
SHA-256).

| Source | Author | Licence | Commit | Files taken (SHA-256) | Used in |
|---|---|---|---|---|---|
| [anthropics/skills](https://github.com/anthropics/skills) | Anthropic | Apache-2.0 (`licenses/frontend-design/LICENSE.txt`) | `dbd4588f9e1033efb41dad4bef2f7947c8993d44` | `skills/frontend-design/SKILL.md` (`d91970639e9f5c37`) | `SKILL.md`: the looks that read as generated |
| [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | Paul Bakaus | Apache-2.0 (`licenses/impeccable/LICENSE`) | `2f98774f86bc05563876643db37e6c37c322850f` | `.claude/skills/impeccable/reference/craft-floor.md` (`96e2e6bd4fcf9a2c`), text only | `SKILL.md`: the review rounds |
| [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) | Corey Haines | MIT (`licenses/marketingskills/LICENSE`) | `c7d7dfb6b460fc376b4b2204b78a9c9fd5ca6467` | `skills/copywriting/SKILL.md` (`ecb4693fba9cc4f8`), `skills/seo-audit/references/local-seo.md` (`d2666d9c225bc36f`) | `SKILL.md`: supportable claims, the missing-fact marker, no office suggested where there is none |
| [black-forest-labs/skills](https://github.com/black-forest-labs/skills) | Black Forest Labs | MIT (`licenses/bfl-skills/LICENSE`) | `8907d515b0ac270a988ec7a239add81ee13d6cba` | `skills/flux-image-best-practices/rules/negative-prompt-alternatives.md` (`6981b5cee7706f1b`), text only | `pictures.md`: a brand never named in a scene, not even to exclude it |

Ideas only, in our own words, with nothing copied:

| Source | Author | Licence | Commit | Used in |
|---|---|---|---|---|
| [mgifford/accessibility-skills](https://github.com/mgifford/accessibility-skills), `skills/image-alt-text/SKILL.md` | Mike Gifford | AGPL-3.0 | `ada839399f053c55e1a776a98c02f8904d70dd32` | `pictures.md`: a picture marked decorative by its purpose |
| [marmbiz/humanizer-de](https://github.com/marmbiz/humanizer-de), `SKILL.md` | Martin Moeller | MIT | `924831533ffd86716845a74c10b476f1d7d92ab7` | `SKILL.md`: keep numbers, names and dates unchanged between drafts; never mix "du" and "Sie" |

Everything else in the skill `build-a-website` (`SKILL.md`, `interview.md`, `design-folder.md`, `scripts.md`,
`search.md`, `pictures.md`) is Trustfactory's own.

## Updating a source

Read the new version in full before taking anything from it, as if it were new: check its licence again, compare it
with the commit above, take only what holds against its standard, and record the new commit and hashes here and at the
top of the file that uses it.
