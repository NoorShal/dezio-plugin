#!/usr/bin/env node
// The design folder as tools Claude calls: a small MCP server Claude Code starts from the plugin's .mcp.json with the
// key given at install, so a design's files go from disk to the Studio without passing through Claude's context.
// Newline-delimited JSON-RPC over stdin and stdout, as MCP's stdio transport, with its initialize handshake.
import { resolve } from 'node:path';
import { createInterface } from 'node:readline';

import { init, pull, push, Refused } from './design-folder.mjs';
import { describe, upload } from './pictures.mjs';

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
      'Starts a design folder for a Website Studio site: makes the site a custom site, with a first design and its contact page (safe to run again; legal pages are the client’s choice, added with template_sites-pages legal.add_pages), names it in the folder’s studio.json and pulls its design into design/; the prompts given in the folder before it was linked are kept with the site then.',
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
    description: 'Writes the site’s saved design into the folder’s design/ files, over what they hold.',
    inputSchema: { type: 'object', properties: { folder: FOLDER }, additionalProperties: false },
    run: async ({ folder }) => [await pull(folderOf(folder))],
  },
  {
    name: 'design_push',
    description:
      'Saves the folder’s design/ files, read from disk, as the site’s draft design and answers the preview’s address. A refusal names each file and line to change, and the design saved before stays. A font file new to the site waits for its person’s approval in the Studio first: the answer names each with the link to approve it at, to show the person, who approves it only if the font’s licence allows use on websites; push again once approved.',
    inputSchema: { type: 'object', properties: { folder: FOLDER }, additionalProperties: false },
    run: ({ folder }) => push(folderOf(folder)),
  },
  {
    name: 'design_upload',
    description:
      'Adds pictures from this computer to the site’s media library with the plugin’s own key, the logo among them: each by its path, absolute or within the folder, with its alt text, or decorative: true, and its credit where one is due. JPEG, PNG, WebP, AVIF or SVG, up to 30 at once. Answers each picture’s file id, which an image field’s value takes; a logo’s id goes to the business details’ logo (core-site-update, business_details.set).',
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
      'Sets the alt text, the decorative mark or the credit of pictures already in the site’s media library, up to 30 at once, each by its file id, such as the pictures taken from the client’s current website.',
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

/** The result of one request. */
async function resultOf(method, params) {
  switch (method) {
    case 'initialize': {
      const asked = params?.protocolVersion;
      return {
        protocolVersion: VERSIONS.includes(asked) ? asked : VERSIONS[0],
        capabilities: { tools: {} },
        serverInfo: { name: 'website-studio-design-folder', version: '0.2.15' },
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

/** One line from the client: a request is answered; a notification, such as the initialized one, needs none. */
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
