// Pictures from this computer into a site's media library, with the plugin's own key, and their descriptions: what
// design-server.mjs offers Claude as tools beside the design folder's. Plain Node, no packages.
import { readFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';

import { call, Refused, settings, siteOf } from './design-folder.mjs';

/** The most pictures one call adds or describes. */
const MOST_PICTURES = 30;

/** The pictures a call names: one at least, and no more than one call takes. */
function picturesOf(entries) {
  if (!Array.isArray(entries) || entries.length === 0 || entries.length > MOST_PICTURES) {
    throw new Error(`Name 1 to ${String(MOST_PICTURES)} pictures.`);
  }
  return entries;
}

/** What a picture's entry sets of it: its alt text, its decorative mark and its credit, where given. */
function detailsOf(entry) {
  return {
    ...(typeof entry?.alt === 'string' ? { alt: entry.alt } : {}),
    ...(typeof entry?.decorative === 'boolean' ? { decorative: entry.decorative } : {}),
    ...(typeof entry?.credit === 'string' ? { credit: entry.credit } : {}),
  };
}

/** Why a step failed, in one line: what the Studio said, with each thing it named and the field it named it at. */
function why(error) {
  if (error instanceof Refused) {
    return [error.message, ...error.named()].join(' ');
  }
  return error instanceof Error ? error.message : String(error);
}

/** Each picture's line, or, where one didn't go through, the call refused with every line, those that did too. */
function outcome(lines, failed) {
  if (failed === 0) {
    return lines;
  }
  throw new Refused(422, {
    detail: `${String(failed)} of ${String(lines.length)} pictures didn't go through; each line says why, the rest did.`,
    errors: lines.map((detail) => ({ detail })),
  });
}

/**
 * A picture's bytes sent to the site's upload address with the agent key, as a file of its library: the file. A busy
 * Studio's answer is waited out once, as long as it asks to wait.
 */
async function sendPicture(site, path) {
  const { key, api } = settings();
  const address = new URL(`/v1/sites/${encodeURIComponent(site)}/uploads`, api);
  address.searchParams.set('name', basename(path));
  const body = await readFile(path);
  for (let tried = false; ; tried = true) {
    const response = await fetch(address, {
      method: 'POST',
      headers: { authorization: `Bearer ${key}`, 'content-type': 'application/octet-stream' },
      body,
    });
    const answer = await response.json().catch(() => null);
    const wait = Number(response.headers.get('retry-after'));
    if (!tried && (response.status === 429 || response.status === 503) && wait > 0 && wait <= 60) {
      await new Promise((after) => setTimeout(after, wait * 1000));
      continue;
    }
    if (!response.ok) {
      throw new Refused(response.status, answer);
    }
    if (answer?.status !== 'done') {
      throw new Error(`The Studio wants a person's ${String(answer?.status)} first; finish it in the Studio.`);
    }
    return answer.output;
  }
}

/**
 * Adds pictures from this computer to the site's library, each with its alt text, decorative mark and credit where
 * given: each picture's file id in a line, which an image field takes. A path is the file's, or one within the folder.
 * The site is the one named, or else the folder's.
 */
export async function upload(dir, entries, named) {
  const site = named ?? (await siteOf(dir));
  const lines = [];
  let failed = 0;
  for (const entry of picturesOf(entries)) {
    const path = resolve(dir, typeof entry?.path === 'string' ? entry.path : '');
    const name = basename(path);
    let file;
    try {
      file = await sendPicture(site, path);
    } catch (error) {
      failed += 1;
      lines.push(`${name}: not added. ${why(error)}`);
      continue;
    }
    const details = detailsOf(entry);
    if (Object.keys(details).length === 0) {
      lines.push(`${name}: file ${String(file.id)}, not described yet.`);
      continue;
    }
    try {
      await call(site, 'POST', 'file:set_details', { file_id: file.id, ...details });
      lines.push(`${name}: file ${String(file.id)}, described.`);
    } catch (error) {
      failed += 1;
      lines.push(`${name}: file ${String(file.id)}, added but not described. ${why(error)}`);
    }
  }
  return outcome(lines, failed);
}

/**
 * Sets the alt text, decorative mark and credit of pictures in the site's library, each by its file id: a line each.
 * The site is the one named, or else the folder's.
 */
export async function describe(dir, entries, named) {
  const site = named ?? (await siteOf(dir));
  const lines = [];
  let failed = 0;
  for (const entry of picturesOf(entries)) {
    const id = typeof entry?.file_id === 'string' ? entry.file_id : '';
    try {
      await call(site, 'POST', 'file:set_details', { file_id: id, ...detailsOf(entry) });
      lines.push(`file ${id}: described.`);
    } catch (error) {
      failed += 1;
      lines.push(`file ${id}: not described. ${why(error)}`);
    }
  }
  return outcome(lines, failed);
}
