# Third-party material in this plugin

Some of the plugin's skills contain rules adapted from other people's published skills. Each source was copied once,
at the commit named here, read in full, and changed for German local businesses; nothing is fetched while a skill
runs. Every number taken from a source was checked against the standard it cites (WCAG 2.2 for accessibility, Google's
Core Web Vitals for speed) before it was kept. Naming a source says where a rule came from; it does not mean its author
endorses this plugin.

The licence of each copied source is in `licenses/`, beside this file. A file that holds adapted material says so in
its `license` and `metadata` fields, with the source's path, commit, a content hash (the first 16 characters of the
file's SHA-256) and what we changed.

| Source | Author | Licence | Commit | Files taken (SHA-256) | Used in |
|---|---|---|---|---|---|
| [anthropics/skills](https://github.com/anthropics/skills) | Anthropic | Apache-2.0 (`licenses/frontend-design/LICENSE.txt`) | `dbd4588f9e1033efb41dad4bef2f7947c8993d44` | `skills/frontend-design/SKILL.md` (`d91970639e9f5c37`) | `local-business-design`: its structure, the grounding in the subject, the plan-check-build process, the generated-page defaults, restraint |
| [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | Paul Bakaus | Apache-2.0 (`licenses/impeccable/LICENSE`) | `2f98774f86bc05563876643db37e6c37c322850f` | `.claude/skills/impeccable/reference/craft-floor.md` (`96e2e6bd4fcf9a2c`), text only | `local-business-design`: the craft floor's checks and the rounds |
| [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | Leonxlnx | MIT (`licenses/taste-skill/LICENSE`) | `a60a36dc2bb3bb77ccf17f2f62041f5ca8a458b9` | `skills/taste-skill/SKILL.md` (`ee847084e58f5a81`), text only | `local-business-design`: the list of the business's own things, the page as claims with proof, the first screen, the menu |
| [jakubkrehel/skills](https://github.com/jakubkrehel/skills) | Jakub Krehel | MIT (`licenses/krehel-skills/LICENSE`) | `4c66b1fa86e9ab70187b43d7da9b6fdb29f2ef63` | `skills/better-typography/SKILL.md` (`e60ca6467ba60e68`), `skills/better-colors/SKILL.md` (`e74f1c413a4094dc`), `skills/better-layout/SKILL.md` (`8c5883ccb23c27c3`), `skills/better-accessibility/SKILL.md` (`df0cafe0e75a0854`) | `local-business-design`: type, colour and spacing numbers; `accessibility-and-phone`: reflow, focus, sticky headers, safe sizing |
| [emilkowalski/skills](https://github.com/emilkowalski/skills) | Emil Kowalski | MIT (`licenses/emil-kowalski-skills/LICENSE`) | `2d228630ba1446365f614a108cb8252f1feda202` | `skills/emil-design-eng/SKILL.md` (`ffbe68e6007fb42c`) | `local-business-design`: the motion test |
| [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) | Corey Haines | MIT (`licenses/marketingskills/LICENSE`) | `c7d7dfb6b460fc376b4b2204b78a9c9fd5ca6467` | `skills/copywriting/SKILL.md` (`ecb4693fba9cc4f8`), `skills/copywriting/references/ai-tells.md` (`048a436d35d01131`), `skills/copy-editing/SKILL.md` (`d23184ad62cbe29f`), `skills/cro/SKILL.md` (`6e172cc38178c800`), `skills/seo-audit/references/local-seo.md` (`d2666d9c225bc36f`) | `copy-for-local-business`: supportable claims, the missing-fact marker, the swap test, the machine-written patterns, the call formula; `seo-for-local-business`: town pages, service areas, review requests |
| [vercel-labs/web-interface-guidelines](https://github.com/vercel-labs/web-interface-guidelines) | Vercel Labs | MIT (`licenses/web-interface-guidelines/LICENSE`) | `434b7f91364665f2f733b310ec54809bf8f37937` | `command.md` (`d246b026f4f29b58`) | `accessibility-and-phone/interface-rules.md`, a trimmed copy |
| [black-forest-labs/skills](https://github.com/black-forest-labs/skills) | Black Forest Labs | MIT (`licenses/bfl-skills/LICENSE`) | `8907d515b0ac270a988ec7a239add81ee13d6cba` | `skills/flux-image-best-practices/rules/core-principles.md` (`1a98fd74e4e1cf64`), `skills/flux-image-best-practices/rules/negative-prompt-alternatives.md` (`6981b5cee7706f1b`), text only | `local-business-design/pictures.md`: how to write a picture's scene |
| [addyosmani/web-quality-skills](https://github.com/addyosmani/web-quality-skills) | Addy Osmani | MIT (`licenses/web-quality-skills/LICENSE`) | `afa8da942115f2961fdbfa80807ea0b232ff6c00` | `skills/core-web-vitals/SKILL.md` (`731aa78c0347e8b3`), `skills/performance/SKILL.md` (`b0c220185d88c61f`) | `accessibility-and-phone`: the speed targets and the first screen's picture budget |

Ideas only, in our own words, with nothing copied:

| Source | Author | Licence | Commit | Used in |
|---|---|---|---|---|
| [mgifford/accessibility-skills](https://github.com/mgifford/accessibility-skills), `skills/image-alt-text/SKILL.md` | Mike Gifford | AGPL-3.0 | `ada839399f053c55e1a776a98c02f8904d70dd32` | `accessibility-and-phone`: picture descriptions by purpose |
| [marmbiz/humanizer-de](https://github.com/marmbiz/humanizer-de), `SKILL.md` | Martin Moeller | MIT | `924831533ffd86716845a74c10b476f1d7d92ab7` | `copy-for-local-business`: keep numbers, names and dates unchanged between drafts; never mix "du" and "Sie" |

The skills `build-a-custom-site`, `connect-a-site`, `design-a-custom-site` and `common-mistakes` are Trustfactory's
own.

## Updating a source

Read the new version in full before taking anything from it, as if it were new: check its licence again, compare it
with the commit above, take only what holds against its standard, and record the new commit and hashes here and in the
skill's metadata.
