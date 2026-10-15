#!/usr/bin/env node
// The design folder from a terminal: pulled from Website Studio, pushed back as the site's draft design, and pushed on
// every save while a designer works. Claude uses the same steps as the plugin's design-folder tools.
import { watch } from 'node:fs';
import { join, resolve } from 'node:path';
import { parseArgs } from 'node:util';

import { init, pull, push, Refused } from './design-folder.mjs';

const USAGE = `Usage: node studio.mjs <command> [--dir <folder>]

  init <site id>  Makes the site a custom site (a first design and the contact page; safe to run
                  again) and pulls its design into the folder.
  pull            Writes the site's design into the folder's design/ files.
  push            Saves the folder's design as the site's draft design; a refused file is named with its line.
  dev             Pushes once, then again on every save, until stopped.

The folder (default: the current one) holds studio.json, which names the site, and design/:
  design/header.html, design/footer.html, design/stylesheet.css,
  design/sections/<type>.json (the section type, and under "holds" the questions or services it lists, where it
  does) beside design/sections/<type>.html (its markup) and, where it moves, design/sections/<type>.js (its own
  script, export function attach(root), given each element its markup marks data-script="<type>"),
  design/fonts/<name>.woff2, the font files the stylesheet's font faces name, as url("fonts/<name>.woff2"). A push
  adds a font file new to the site only once you approved it in the Studio, at the link the push gives: approve it
  only if the font's licence allows its use on websites. studio.json keeps the approvals still open.

Settings, from the environment: TF_STUDIO_KEY, an agent key made in the Studio (never printed); TF_STUDIO_API, the
Studio's API (default the online Studio, https://website-studio-api.vercel.app); TF_STUDIO_ADMIN, the Studio itself,
for the preview's address (default https://website-studio-admin.vercel.app).`;

/** Pushes the folder, printing what was saved or each refused file and line; whether it was saved. */
async function pushed(dir) {
  try {
    for (const line of await push(dir)) {
      console.log(line);
    }
    return true;
  } catch (error) {
    if (!(error instanceof Refused)) {
      throw error;
    }
    for (const line of error.lines()) {
      console.error(line);
    }
    return false;
  }
}

async function dev(dir) {
  await pushed(dir);
  let waiting;
  console.log('Pushing on every save to design/. Stop with Ctrl+C.');
  watch(join(dir, 'design'), { recursive: true }, () => {
    clearTimeout(waiting);
    // A save often writes a file more than once; one push follows the last write.
    waiting = setTimeout(() => {
      pushed(dir).catch((error) => console.error(error.message));
    }, 300);
  });
}

async function main() {
  const { positionals, values } = parseArgs({ allowPositionals: true, options: { dir: { type: 'string' } } });
  const [command, site] = positionals;
  const dir = resolve(values.dir ?? '.');
  switch (command) {
    case 'init':
      if (site === undefined) {
        throw new Error('init takes the site id: node studio.mjs init <site id>.');
      }
      console.log(await init(dir, site));
      return;
    case 'pull':
      console.log(await pull(dir));
      return;
    case 'push':
      process.exitCode = (await pushed(dir)) ? 0 : 1;
      return;
    case 'dev':
      return dev(dir);
    default:
      console.log(USAGE);
      process.exitCode = command === undefined || command === 'help' ? 0 : 1;
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
