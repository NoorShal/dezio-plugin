// A custom design's own words in each of its site's languages, as the design folder holds them: one file per
// language, design/words/<language>.json, its words by their keys. Plain Node, no packages.
import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';

/** The folder under design/ that holds the words files. */
export const WORDS = 'words';

/** The design's own words in each language, by its file's name, such as design/words/de.json for German. */
export async function readWords(dir) {
  const folder = join(dir, 'design', WORDS);
  const names = existsSync(folder) ? (await readdir(folder)).filter((name) => name.endsWith('.json')).sort() : [];
  const words = {};
  for (const name of names) {
    const text = await readFile(join(folder, name), 'utf8');
    try {
      words[basename(name, '.json')] = JSON.parse(text);
    } catch (error) {
      if (!(error instanceof SyntaxError)) {
        throw error;
      }
      throw new Error(`design/${WORDS}/${name} isn't JSON: ${error.message}.`, { cause: error });
    }
  }
  return words;
}

/**
 * Writes the design's words as the Studio holds them, a file per language; a language's file goes where the Studio's
 * design has no words in it, so a later push never brings back words the design no longer holds.
 */
export async function writeWords(dir, words) {
  const folder = join(dir, 'design', WORDS);
  const held = existsSync(folder) ? (await readdir(folder)).filter((name) => name.endsWith('.json')) : [];
  for (const name of held.filter((each) => !Object.hasOwn(words, basename(each, '.json')))) {
    await rm(join(folder, name));
  }
  for (const [language, own] of Object.entries(words)) {
    await mkdir(folder, { recursive: true });
    await writeFile(join(folder, `${language}.json`), `${JSON.stringify(own, null, 2)}\n`);
  }
}
