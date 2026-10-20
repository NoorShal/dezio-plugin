#!/usr/bin/env node
// The design folder from a terminal: pulled from Website Studio, pushed back as the site's draft design, and pushed on
// every save while a designer works. Claude uses the same steps as the plugin's design-folder tools.
import { watch } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { parseArgs } from 'node:util';

import { init, pull, push, Refused } from './design-folder.mjs';

const USAGE = `Usage: node studio.mjs <command> [--dir <folder>]

  init <site id>  Makes the site a custom site (safe to run again) and pulls its design into the folder,
                  where one was pushed before; on a site whose design was never pushed the folder starts empty.
  pull            Writes the site's design into the folder's design/ files, where one was pushed.
  push            Saves the folder's design as the site's draft design; a refused file is named with its line.
  dev             Pushes once, then again on every save, until stopped.

The folder (default: the current one) holds studio.json, which names the site, and design/:
  design/header.html, design/footer.html, design/stylesheet.css, and where the page moves as a whole, design/page.js
  (its script, export function attach(parts, view), given every element the design marks data-page-part="<name>"),
  design/sections/<type>.json (the section type, and under "holds" the questions, services or job it shows, where
  it does) beside design/sections/<type>.html (its markup) and, where it moves, design/sections/<type>.js (its own
  script, export function attach(root, view), given each element its markup marks data-script="<type>"),
  design/fonts/<name>.woff2, the font files the stylesheet's font faces name, as url("fonts/<name>.woff2"), which a
  push adds to the site, and design/words/<language>.json, the design's own words in each of the site's languages,
  by the keys its markup names with data-word and data-word-label.

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
  // A new site's folder starts empty: the first push names the files to write, and the saves that write them push.
  await mkdir(join(dir, 'design'), { recursive: true });
  await pushed(dir).catch((error) => console.error(error.message));
  let waiting;
  // One push at a time: a save while one is on its way is pushed once it has answered, so an older push never lands
  // after a newer one, and any number of saves meanwhile make one push.
  let running = false;
  let again = false;
  const next = () => {
    if (running) {
      again = true;
      return;
    }
    running = true;
    pushed(dir)
      .catch((error) => console.error(error.message))
      .finally(() => {
        running = false;
        if (again) {
          again = false;
          next();
        }
      });
  };
  console.log('Pushing on every save to design/. Stop with Ctrl+C.');
  watch(join(dir, 'design'), { recursive: true }, () => {
    clearTimeout(waiting);
    // A save often writes a file more than once; one push follows the last write.
    waiting = setTimeout(next, 300);
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
