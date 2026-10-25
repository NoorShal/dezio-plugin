#!/usr/bin/env node
// The design folder as tools Claude calls: a small MCP server Claude Code starts from the plugin's .mcp.json, signed in
// to Dezio as the person, so a design's files go from disk to Dezio without passing through Claude's context.
// Newline-delimited JSON-RPC over stdin and stdout, as MCP's stdio transport, with its initialize handshake; the
// sign-in's link is shown through Claude Code by URL-mode elicitation (MCP 2025-11-25, "Elicitation").
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createInterface } from 'node:readline';

import { init, pull, push, Refused, siteOf } from './design-folder.mjs';
import { MOST_SECONDS, waitForJob } from './jobs.mjs';
import { describe, upload } from './pictures.mjs';
import { signInWith } from './sign-in.mjs';

/** The plugin's version, as its manifest gives it, so the server names the one it ships with. */
const { version } = JSON.parse(readFileSync(new URL('../.claude-plugin/plugin.json', import.meta.url), 'utf8'));

/** The protocol revisions it speaks, newest first; a client asking for another gets the newest. */
const VERSIONS = ['2025-11-25', '2025-06-18', '2025-03-26', '2024-11-05'];

const FOLDER = {
  type: 'string',
  description:
    'The design folder’s absolute path, which holds studio.json and design/; the working folder if left out.',
};

/** What a picture's entry may set of it, beside what names the picture. */
const DETAILS = {
  alt: { type: 'string', description: 'What the picture shows, for those who can’t see it.' },
  language: {
    type: 'string',
    description: 'The language the alt text is written in, one of the site’s; its main language where left out.',
  },
  decorative: { type: 'boolean', description: 'true for a picture that only decorates and needs no alt text.' },
  credit: { type: 'string', description: 'Whom the picture’s credit is due to, which the imprint names.' },
};

/** The folder a call names, or the working folder. */
function folderOf(folder) {
  return resolve(typeof folder === 'string' && folder !== '' ? folder : process.cwd());
}

const SITE = { type: 'string', description: 'The site’s id, where no design folder names it.' };

/** The site a call names, where it names one. */
function siteNamed(site) {
  return typeof site === 'string' && site !== '' ? site : undefined;
}

const TOOLS = [
  {
    name: 'design_init',
    description:
      'Starts a design folder for a Dezio site: makes the site a custom site (safe to run again; its pages are written in the design’s own section types; legal pages are the client’s choice, added with template_sites-pages legal.add_pages), names it in the folder’s studio.json, and pulls its design into design/ where one was pushed before. On a site whose design was never pushed nothing is pulled, so a new folder starts empty: write design/header.html, design/footer.html, design/stylesheet.css and the section types, then push; Dezio shows a starter until then. A folder holding another site’s design is refused: each site has a folder of its own. The prompts given in the folder are kept with the site then, and at each push.',
    inputSchema: {
      type: 'object',
      properties: { site_id: { type: 'string', description: 'The site’s id.' }, folder: FOLDER },
      required: ['site_id'],
      additionalProperties: false,
    },
    run: async ({ site_id: site, folder }) => {
      if (typeof site !== 'string' || site === '') {
        throw new Error('design_init takes the site’s id.');
      }
      return [await init(folderOf(folder), site)];
    },
  },
  {
    name: 'design_pull',
    description:
      'Writes the site’s saved design into the folder’s design/ files, over what they hold; nothing on a site whose design was never pushed.',
    inputSchema: { type: 'object', properties: { folder: FOLDER }, additionalProperties: false },
    run: async ({ folder }) => [await pull(folderOf(folder))],
  },
  {
    name: 'design_push',
    description:
      'Saves the folder’s design/ files, read from disk, as the site’s draft design and answers the preview’s address. A refusal names each file and line to change, and the design saved before stays. A font file new to the site is added with it.',
    inputSchema: { type: 'object', properties: { folder: FOLDER }, additionalProperties: false },
    run: ({ folder }) => push(folderOf(folder)),
  },
  {
    name: 'design_upload',
    description:
      'Adds pictures from this computer to the site’s media library, the logo among them: each by its path, absolute or within the folder, with its alt text, or decorative: true, and its credit where one is due. JPEG, PNG, WebP, AVIF or SVG, up to 30 at once. Answers each picture’s file id, which an image field’s value takes; a logo’s id goes to the business details’ logo (core-site-update, business_details.set).',
    inputSchema: {
      type: 'object',
      properties: {
        folder: FOLDER,
        site_id: SITE,
        files: {
          type: 'array',
          minItems: 1,
          maxItems: 30,
          items: {
            type: 'object',
            properties: { path: { type: 'string', description: 'The picture’s file.' }, ...DETAILS },
            required: ['path'],
            additionalProperties: false,
          },
        },
      },
      required: ['files'],
      additionalProperties: false,
    },
    run: ({ folder, site_id: site, files }) => upload(folderOf(folder), files, siteNamed(site)),
  },
  {
    name: 'design_describe',
    description:
      'Sets the alt text in one of the site’s languages, the decorative mark or the credit of pictures already in the site’s media library, up to 30 at once, each by its file id, such as the pictures taken from the client’s current website.',
    inputSchema: {
      type: 'object',
      properties: {
        folder: FOLDER,
        site_id: SITE,
        files: {
          type: 'array',
          minItems: 1,
          maxItems: 30,
          items: {
            type: 'object',
            properties: { file_id: { type: 'string', description: 'The picture’s file id.' }, ...DETAILS },
            required: ['file_id'],
            additionalProperties: false,
          },
        },
      },
      required: ['files'],
      additionalProperties: false,
    },
    run: ({ folder, site_id: site, files }) => describe(folderOf(folder), files, siteNamed(site)),
  },
  {
    name: 'job_wait',
    description:
      'Waits for a Dezio job to end, such as a page look, pictures being made or a website being read: it looks at the job, waits on this computer as long as Dezio says before looking again, and answers once, with the job as it ended, or after two minutes with the job still running and how much longer such jobs usually take, to wait on with another call. Use it for every job instead of reading the job again and again.',
    inputSchema: {
      type: 'object',
      properties: {
        folder: FOLDER,
        site_id: SITE,
        job_id: { type: 'string', description: 'The job’s id, as the call that started it answered.' },
        seconds: {
          type: 'integer',
          minimum: 1,
          maximum: MOST_SECONDS,
          description: `The longest to wait, in seconds; ${String(MOST_SECONDS)} unless given.`,
        },
      },
      required: ['job_id'],
      additionalProperties: false,
    },
    run: async ({ folder, site_id: site, job_id: job, seconds }) => {
      if (typeof job !== 'string' || job === '') {
        throw new Error('job_wait takes the job’s id.');
      }
      if (seconds !== undefined && !(Number.isInteger(seconds) && seconds >= 1 && seconds <= MOST_SECONDS)) {
        throw new Error(`seconds is a whole number from 1 to ${String(MOST_SECONDS)}.`);
      }
      return waitForJob(siteNamed(site) ?? (await siteOf(folderOf(folder))), job, seconds ?? MOST_SECONDS);
    },
  },
];

/** A JSON-RPC error, answered instead of a result. */
class RpcError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

/** A tool's answer: what it did in lines, or why it couldn't as the tool's error, each refused file by its line. */
async function called(params) {
  const tool = TOOLS.find(({ name }) => name === params?.name);
  if (tool === undefined) {
    throw new RpcError(-32602, `No tool is named ${String(params?.name)}.`);
  }
  try {
    const lines = await tool.run(params?.arguments ?? {});
    return { content: [{ type: 'text', text: lines.join('\n') }] };
  } catch (error) {
    const lines = error instanceof Refused ? error.lines() : [error instanceof Error ? error.message : String(error)];
    return { content: [{ type: 'text', text: lines.join('\n') }], isError: true };
  }
}

/** Whether Claude Code shows a link the person opens outside it, as the sign-in's is: what it said at initialize. */
let showsLinks = false;

/** The result of one request. */
async function resultOf(method, params) {
  switch (method) {
    case 'initialize': {
      showsLinks = params?.capabilities?.elicitation?.url !== undefined;
      const asked = params?.protocolVersion;
      return {
        protocolVersion: VERSIONS.includes(asked) ? asked : VERSIONS[0],
        capabilities: { tools: {} },
        serverInfo: { name: 'dezio-design', version },
      };
    }
    case 'ping':
      return {};
    case 'tools/list':
      return { tools: TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })) };
    case 'tools/call':
      return called(params);
    default:
      throw new RpcError(-32601, `Method not found: ${String(method)}.`);
  }
}

function send(message) {
  process.stdout.write(`${JSON.stringify({ jsonrpc: '2.0', ...message })}\n`);
}

/** The requests this server sent Claude Code, by id, each waiting for its answer. */
const asked = new Map();
let lastAsked = 0;

/** Asks Claude Code something, such as to show a link: its answer, or its error thrown. */
function ask(method, params) {
  lastAsked += 1;
  const id = `design-folder-${String(lastAsked)}`;
  send({ id, method, params });
  return new Promise((resolve, reject) => asked.set(id, { resolve, reject }));
}

// The sign-in's link, shown by Claude Code, which asks the person before it opens it; once the browser came back, the
// elicitation is reported done, so Claude Code needn't wait for it.
signInWith({
  show: async ({ elicitationId, url, message }) => {
    if (!showsLinks) {
      throw new Error(
        'This Claude Code can’t show the link to sign in to Dezio: update it with `claude update`, then try again.',
      );
    }
    const answer = await ask('elicitation/create', { mode: 'url', elicitationId, url, message });
    if (answer?.action !== 'accept') {
      throw new Error(
        'The sign-in to Dezio wasn’t opened, so the design folder can’t reach Dezio. Try again to sign in.',
      );
    }
  },
  finished: (elicitationId) => {
    send({ method: 'notifications/elicitation/complete', params: { elicitationId } });
  },
});

/** An answer from Claude Code to one of this server's own requests. */
function answered(message) {
  const waiting = asked.get(message.id);
  if (waiting === undefined) {
    return;
  }
  asked.delete(message.id);
  if (message.error !== undefined) {
    waiting.reject(new Error(String(message.error.message ?? 'Claude Code refused the request.')));
  } else {
    waiting.resolve(message.result);
  }
}

/**
 * One line from the client: a request is answered; a notification, such as the initialized one, needs none; an answer
 * to one of this server's own requests goes to the call waiting for it.
 */
async function handle(line) {
  if (line.trim() === '') {
    return;
  }
  let message;
  try {
    message = JSON.parse(line);
  } catch {
    send({ id: null, error: { code: -32700, message: 'The message isn’t JSON.' } });
    return;
  }
  if (message.id === undefined || message.id === null) {
    return;
  }
  if (message.method === undefined) {
    answered(message);
    return;
  }
  try {
    send({ id: message.id, result: await resultOf(message.method, message.params) });
  } catch (error) {
    const code = error instanceof RpcError ? error.code : -32603;
    send({ id: message.id, error: { code, message: error instanceof Error ? error.message : String(error) } });
  }
}

createInterface({ input: process.stdin, crlfDelay: Infinity }).on('line', (line) => {
  handle(line).catch((error) => process.stderr.write(`${String(error)}\n`));
});
