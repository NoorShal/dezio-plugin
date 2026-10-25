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

Everything else in the skill `build-a-website` (`SKILL.md`, `design-folder.md`, `scripts.md`) is Trustfactory's own.
The guides Dezio serves, which the skill follows, record their own sources beside their code.

## Updating a source

Read the new version in full before taking anything from it, as if it were new: check its licence again, compare it
with the commit above, take only what holds against its standard, and record the new commit and hashes here and at the
top of the file that uses it.
