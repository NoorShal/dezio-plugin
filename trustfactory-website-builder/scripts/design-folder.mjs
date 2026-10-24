// A custom site's design as a folder of files, pulled from Website Studio and pushed back as the site's draft design:
// what studio.mjs runs in a terminal and design-server.mjs offers Claude as tools. Plain Node, no packages, so it runs
// wherever Claude Code does.
import { Buffer } from 'node:buffer';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';

import { sendKeptPrompts } from './prompts.mjs';
import { ONLINE } from './studio-addresses.mjs';
import { readWords, WORDS, writeWords } from './words.mjs';

const FRAME = { header: 'header.html', footer: 'footer.html', stylesheet: 'stylesheet.css' };

/** The design's script for the whole page, where it has one, beside the frame: design/page.js. */
const PAGE_SCRIPT = 'page.js';

/** A pointer's steps (RFC 6901), each as the name or the index it says. */
function stepsOf(pointer) {
  return pointer
    .split('/')
    .slice(1)
    .map((step) => step.replaceAll('~1', '/').replaceAll('~0', '~'));
}

/** Where a pointer leads, in words: its steps one after another, such as "details › logo". */
function pointerWords(pointer) {
  return stepsOf(pointer).join(' › ');
}

/** A refusal from the Studio, with what it said, each thing it named by the file or the field its pointer leads to. */
export class Refused extends Error {
  constructor(status, problem, placeOf = pointerWords) {
    super(problem?.detail ?? problem?.title ?? `The Studio answered ${String(status)}.`);
    this.problem = problem;
    this.placeOf = placeOf;
  }

  /** Each thing the Studio named, in a line: where it is, then what to change there. */
  named() {
    return (this.problem?.errors ?? []).map(({ pointer, detail }) => {
      // The design's own checks name the file and its line in their words already.
      if (typeof pointer !== 'string' || pointer === '' || String(detail).startsWith('design/')) {
        return String(detail);
      }
      return `${this.placeOf(pointer)}: ${String(detail)}`;
    });
  }

  /** The refusal as lines a person reads: what the Studio said, then each file and line or field to change. */
  lines() {
    return [`Refused: ${this.message}`, ...this.named().map((line) => `  ${line}`)];
  }
}

/** The Studio and the agent key, from the environment: TF_STUDIO_KEY, TF_STUDIO_API and TF_STUDIO_ADMIN. */
export function settings() {
  const key = process.env.TF_STUDIO_KEY;
  if (key === undefined || key === '') {
    throw new Error(
      'No Studio key: install the plugin with your agent key, or set TF_STUDIO_KEY to one made in the Studio.',
    );
  }
  return { key, api: process.env.TF_STUDIO_API || ONLINE.api, admin: process.env.TF_STUDIO_ADMIN || ONLINE.admin };
}

/**
 * One request to the site's API with the agent key: its answer, a refusal thrown as `Refused`, which names each thing
 * by `placeOf` its pointer, where the call knows what the pointer leads into.
 */
async function request(site, method, path, body, placeOf) {
  const { key, api } = settings();
  const response = await fetch(new URL(`/v1/sites/${encodeURIComponent(site)}/${path}`, api), {
    method,
    headers: {
      authorization: `Bearer ${key}`,
      ...(body === undefined ? {} : { 'content-type': 'application/json' }),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const answer = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Refused(response.status, answer, placeOf);
  }
  return answer;
}

/** One call to the site's API with the agent key: a read's answer, or an action's output. */
export async function call(site, method, path, body, placeOf) {
  const answer = await request(site, method, path, body, placeOf);
  if (method === 'GET') {
    return answer;
  }
  if (answer?.status !== 'done') {
    throw new Error(`The Studio wants a person's ${String(answer?.status)} first; finish it in the Studio.`);
  }
  return answer.output;
}

async function settingsOf(dir) {
  const file = join(dir, 'studio.json');
  if (!existsSync(file)) {
    throw new Error(`${file} is missing: start the folder with the site's id first.`);
  }
  return JSON.parse(await readFile(file, 'utf8'));
}

export async function siteOf(dir) {
  return (await settingsOf(dir)).site_id;
}

const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

/** The folder's font files, each by its name, with its bytes and their hash. */
async function readFonts(dir) {
  const folder = join(dir, 'design', 'fonts');
  const names = existsSync(folder) ? (await readdir(folder)).filter((name) => name.endsWith('.woff2')).sort() : [];
  const fonts = [];
  for (const name of names) {
    const bytes = await readFile(join(folder, name));
    fonts.push({ name, bytes, hash: sha256(bytes) });
  }
  return fonts;
}

/** The folder's design, as the Studio takes it; the section types in their files' order. */
async function readDesign(dir) {
  const design = join(dir, 'design');
  const sections = join(design, 'sections');
  const read = (file) => readFile(file, 'utf8');
  const names = existsSync(sections) ? (await readdir(sections)).filter((name) => name.endsWith('.json')).sort() : [];
  const sectionTypes = [];
  for (const name of names) {
    const type = basename(name, '.json');
    // The file is the section type, with what it holds for search engines, where it says, under "holds".
    const { holds, ...definition } = JSON.parse(await read(join(sections, name)));
    if (definition.type !== type) {
      throw new Error(`design/sections/${name} names the type "${String(definition.type)}"; name it "${type}".`);
    }
    const markup = await read(join(sections, `${type}.html`));
    // Its own script, where the type has one: design/sections/<type>.js.
    const scriptFile = join(sections, `${type}.js`);
    const script = existsSync(scriptFile) ? await read(scriptFile) : undefined;
    sectionTypes.push({
      definition,
      markup,
      ...(holds === undefined ? {} : { holds }),
      ...(script === undefined ? {} : { script }),
    });
  }
  const pageFile = join(design, PAGE_SCRIPT);
  const pageScript = existsSync(pageFile) ? await read(pageFile) : undefined;
  // A folder starts empty on a site whose design was never pushed: the frame is written before the first push.
  const frame = (part) => {
    const file = join(design, FRAME[part]);
    if (!existsSync(file)) {
      throw new Error(
        `design/${FRAME[part]} is missing: write design/header.html, design/footer.html and design/stylesheet.css, then push.`,
      );
    }
    return read(file);
  };
  return {
    header: await frame('header'),
    footer: await frame('footer'),
    stylesheet: await frame('stylesheet'),
    section_types: sectionTypes,
    ...(pageScript === undefined ? {} : { page_script: pageScript }),
    fonts: (await readFonts(dir)).map(({ name, hash }) => ({ name, hash })),
    words: await readWords(dir),
  };
}

/** A place within a file's JSON: each step by its name, and a list's item by its key, as a field or an option has. */
function within(file, value, steps) {
  const words = [];
  let at = value;
  for (const step of steps) {
    const item = Array.isArray(at) ? at[Number(step)] : at?.[step];
    if (Array.isArray(at)) {
      words.push(typeof item?.key === 'string' ? `"${item.key}"` : `#${String(Number(step) + 1)}`);
    } else {
      words.push(step);
    }
    at = item;
  }
  return words.length === 0 ? file : `${file}, ${words.join(' › ')}`;
}

/**
 * Where a pointer into a pushed design leads: the folder's file that holds it, and within a section type's JSON the
 * field by its key, such as `design/sections/offers.json, fields › "name" › key`.
 */
function placeInDesign(design) {
  return (pointer) => {
    const [part, index, kind, ...rest] = stepsOf(pointer);
    if (Object.hasOwn(FRAME, part) && index === undefined) {
      return `design/${FRAME[part]}`;
    }
    if (part === 'page_script') {
      return `design/${PAGE_SCRIPT}`;
    }
    if (part === 'fonts') {
      const font = design.fonts[Number(index)];
      return font === undefined ? 'design/fonts' : `design/fonts/${font.name}`;
    }
    if (part === WORDS) {
      // A language's file, and within it a word by its key.
      const file = index === undefined ? `design/${WORDS}` : `design/${WORDS}/${index}.json`;
      return kind === undefined ? file : `${file}, "${kind}"`;
    }
    const type = part === 'section_types' ? design.section_types[Number(index)] : undefined;
    if (type === undefined) {
      return part === 'section_types' ? 'design/sections' : pointerWords(pointer);
    }
    const file = `design/sections/${type.definition.type}`;
    switch (kind) {
      case 'markup':
        return `${file}.html`;
      case 'script':
        return `${file}.js`;
      case 'definition':
        return within(`${file}.json`, type.definition, rest);
      case 'holds':
        return within(`${file}.json`, { holds: type.holds }, ['holds', ...rest]);
      default:
        return `${file}.json`;
    }
  };
}

/**
 * Writes the design's files as the Studio holds them; a script file, the page's or a type's, and a language's words
 * file go where the Studio's design has none, so a later push never brings back one the design no longer holds.
 */
async function writeDesign(dir, source) {
  const sections = join(dir, 'design', 'sections');
  await mkdir(sections, { recursive: true });
  for (const [part, file] of Object.entries(FRAME)) {
    await writeFile(join(dir, 'design', file), source[part]);
  }
  await writeWords(dir, source.words ?? {});
  const pageFile = join(dir, 'design', PAGE_SCRIPT);
  await (source.page_script === undefined ? rm(pageFile, { force: true }) : writeFile(pageFile, source.page_script));
  for (const { definition, markup, holds, script } of source.section_types) {
    const file = holds === undefined ? definition : { ...definition, holds };
    await writeFile(join(sections, `${definition.type}.json`), `${JSON.stringify(file, null, 2)}\n`);
    await writeFile(join(sections, `${definition.type}.html`), markup);
    const scriptFile = join(sections, `${definition.type}.js`);
    await (script === undefined ? rm(scriptFile, { force: true }) : writeFile(scriptFile, script));
  }
}

/** One of the site's font files, as it was added. */
async function fontBytes(site, hash) {
  const { key, api } = settings();
  const address = new URL(`/v1/sites/${encodeURIComponent(site)}/fonts/${hash}`, api);
  const response = await fetch(address, { headers: { authorization: `Bearer ${key}` } });
  if (!response.ok) {
    throw new Refused(response.status, await response.json().catch(() => null));
  }
  return new Uint8Array(await response.arrayBuffer());
}

/** The design's font files into design/fonts/, each only where the folder hasn't the same bytes already. */
async function writeFonts(dir, site, fonts) {
  const folder = join(dir, 'design', 'fonts');
  await mkdir(folder, { recursive: true });
  const here = new Map((await readFonts(dir)).map(({ name, hash }) => [name, hash]));
  for (const { name, hash } of fonts) {
    if (here.get(name) !== hash) {
      await writeFile(join(folder, name), await fontBytes(site, hash));
    }
  }
}

/**
 * Writes the site's design into the folder's `design/` files, its font files too: what it pulled, in words. A site whose
 * design was never pushed holds only the starter its set-up gave, which the folder never takes: the folder stays as it
 * is, and its design is written from the brief.
 */
export async function pull(dir) {
  const site = await siteOf(dir);
  const { source, pushed } = await call(site, 'GET', 'template_sites/custom_design:get');
  if (source === null) {
    throw new Error('The site is no custom site yet: start the folder with its id first.');
  }
  if (pushed === false) {
    return (
      `Site ${site}'s design was never pushed, so nothing was pulled: write design/header.html, design/footer.html and ` +
      'design/stylesheet.css, and the section types, then push. Until then the Studio shows a starter.'
    );
  }
  await writeDesign(dir, source);
  await writeFonts(dir, site, source.fonts ?? []);
  return `Pulled the design of site ${site} into ${join(dir, 'design')}.`;
}

/**
 * The prompts given in the folder that waited for it to be linked, or for the key, sent to its site: a line saying how
 * many, where any were.
 */
async function sentPrompts(dir, site) {
  const record = ({ session, prompt }) =>
    call(site, 'POST', 'template_sites/design_prompt:record', { session, prompt });
  const sent = await sendKeptPrompts(dir, record);
  return sent === 0 ? [] : [`Kept ${String(sent)} prompt${sent === 1 ? '' : 's'} given before with the site.`];
}

/** Whether the folder's design/ holds any file of a design: a hidden one, such as Finder's .DS_Store, is none. */
async function holdsDesign(dir) {
  const design = join(dir, 'design');
  return (
    existsSync(design) &&
    (await readdir(design, { recursive: true, withFileTypes: true })).some(
      (entry) => entry.isFile() && !entry.name.startsWith('.'),
    )
  );
}

/**
 * Refuses a folder whose design is another site's, before anything is asked of the Studio: its files would otherwise be
 * pushed to this site, so they are neither sent nor deleted, and the site starts in a folder of its own.
 */
async function refuseAnotherSite(dir, site) {
  if (!existsSync(join(dir, 'studio.json')) || !(await holdsDesign(dir))) {
    return;
  }
  const named = await siteOf(dir);
  if (named !== site) {
    const other = typeof named === 'string' ? ` ${named}` : '';
    throw new Error(
      `This folder holds the design of another site${other}: start site ${site} in a new folder. Nothing was changed or sent.`,
    );
  }
}

/**
 * Makes the site a custom site (safe to run again), names it in the folder's studio.json, pulls its design where one
 * was pushed before, and sends the prompts given in the folder before. A folder holding another site's design is
 * refused.
 */
export async function init(dir, site) {
  await refuseAnotherSite(dir, site);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, 'studio.json'), `${JSON.stringify({ site_id: site }, null, 2)}\n`);
  await call(site, 'POST', 'template_sites/custom_site:set_up', {});
  return [await pull(dir), ...(await sentPrompts(dir, site))].join('\n');
}

/** The font files this process has added to the site already, by their hash, so a later push sends none again. */
const added = new Set();

/** Adds each of the folder's font files the site doesn't hold yet, so the design's font faces find them. */
async function addFonts(site, dir) {
  const local = (await readFonts(dir)).filter(({ hash }) => !added.has(hash));
  if (local.length === 0) {
    return;
  }
  const { fonts: held } = await call(site, 'GET', 'font:list');
  for (const font of local) {
    if (!held.some((known) => known.hash === font.hash)) {
      await call(site, 'POST', 'font:add', { name: font.name, woff2: Buffer.from(font.bytes).toString('base64') });
    }
    added.add(font.hash);
  }
}

/**
 * Saves the folder's design as the site's draft design, its new font files added first: what was saved, what the design
 * may want to change, and where to look at it, in lines. A refusal throws `Refused`, naming each file and line to
 * change.
 */
export async function push(dir) {
  const site = await siteOf(dir);
  await addFonts(site, dir);
  const design = await readDesign(dir);
  const saved = await call(site, 'POST', 'template_sites/custom_design:set', design, placeInDesign(design));
  const types = saved.section_types.length === 0 ? 'none' : saved.section_types.join(', ');
  return [
    `Saved at ${new Date().toLocaleTimeString()}. Own section types: ${types}.`,
    // What the design may want to change, which never stopped the save.
    ...saved.suggestions.map(({ detail }) => `Suggestion: ${detail}`),
    `Preview: ${new URL(`/sites/${encodeURIComponent(site)}/preview`, settings().admin).href}`,
    ...(await sentPrompts(dir, site)),
  ];
}
