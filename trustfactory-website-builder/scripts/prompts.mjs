// The prompts a designer gives Claude Code that the hook can't send yet, as those before their design folder is linked
// to a site: kept in the plugin's own data folder, for a day at most, until design_init or design_push sends them with
// the folder's site. Prompts given outside any design folder are kept the same day too, then go. Plain Node, no
// packages.
import { appendFile, mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, join, relative } from 'node:path';

/** How long a prompt waits for its design folder. */
const KEPT_MS = 24 * 60 * 60 * 1000;

/** The most one session's waiting prompts fill, so a long session outside any design folder keeps no more. */
const MOST_BYTES = 1024 * 1024;

/** Where the waiting prompts are kept: the plugin's data folder, which Claude Code gives its hooks and servers. */
function waitingFolder() {
  const data = process.env.CLAUDE_PLUGIN_DATA;
  return data === undefined || data === '' ? undefined : join(data, 'prompts');
}

/** The waiting prompts' files, none where nothing was kept yet. */
async function waitingFiles(folder) {
  try {
    return (await readdir(folder)).filter((name) => name.endsWith('.jsonl')).map((name) => join(folder, name));
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

/** Keeps a prompt the hook can't send yet with its session and working folder; a day's old ones go first. */
export async function keepPrompt({ session, prompt, cwd }) {
  const folder = waitingFolder();
  if (folder === undefined) {
    return;
  }
  await mkdir(folder, { recursive: true });
  for (const file of await waitingFiles(folder)) {
    if (Date.now() - (await stat(file)).mtimeMs > KEPT_MS) {
      await rm(file, { force: true });
    }
  }
  const file = join(folder, `${session.replace(/[^A-Za-z0-9_-]/g, '').slice(0, 100) || 'session'}.jsonl`);
  const size = await stat(file).then(
    (found) => found.size,
    () => 0,
  );
  if (size < MOST_BYTES) {
    await appendFile(file, `${JSON.stringify({ session, prompt, cwd })}\n`);
  }
}

/** Whether a path is the folder or lies within it. */
function within(path, folder) {
  const way = relative(folder, path);
  return way === '' || (!way.startsWith('..') && !isAbsolute(way));
}

/**
 * Sends each kept prompt given in the design folder, within it, or in the folder it was made in, in the order given,
 * and forgets it: how many were sent. Prompts given higher up, such as in the home folder, stay out, as they may be
 * about anything. One the Studio doesn't take now stays for a later push.
 */
export async function sendKeptPrompts(dir, send) {
  const folder = waitingFolder();
  if (folder === undefined) {
    return 0;
  }
  let sent = 0;
  for (const file of (await waitingFiles(folder)).sort()) {
    const left = [];
    for (const line of (await readFile(file, 'utf8')).split('\n').filter((each) => each !== '')) {
      const kept = JSON.parse(line);
      if (typeof kept.cwd !== 'string' || !(within(kept.cwd, dir) || kept.cwd === dirname(dir))) {
        left.push(line);
        continue;
      }
      try {
        await send({ session: kept.session, prompt: kept.prompt });
        sent += 1;
      } catch {
        // The prompt waits for the next push, as the hook's own sending leaves out one it couldn't send.
        left.push(line);
      }
    }
    await (left.length === 0 ? rm(file, { force: true }) : writeFile(file, left.map((each) => `${each}\n`).join('')));
  }
  return sent;
}
