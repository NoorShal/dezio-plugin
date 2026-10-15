#!/usr/bin/env node
// The design folder as tools Claude calls: a small MCP server Claude Code starts from the plugin's .mcp.json with the
// key given at install, so a design's files go from disk to the Studio without passing through Claude's context.
// Newline-delimited JSON-RPC over stdin and stdout, as MCP's stdio transport, with its initialize handshake.
import { resolve } from 'node:path';
import { createInterface } from 'node:readline';

import { init, pull, push, Refused } from './design-folder.mjs';

/** The protocol revisions it speaks, newest first; a client asking for another gets the newest. */
const VERSIONS = ['2025-11-25', '2025-06-18', '2025-03-26', '2024-11-05'];

const FOLDER = {
  type: 'string',
  description:
    'The design folder’s absolute path, which holds studio.json and design/; the working folder if left out.',
};

/** The folder a call names, or the working folder. */
function folderOf(folder) {
  return resolve(typeof folder === 'string' && folder !== '' ? folder : process.cwd());
}

const TOOLS = [
  {
    name: 'design_init',
    description:
      'Starts a design folder for a Website Studio site: makes the site a custom site, with a first design, its legal pages and its contact page (safe to run again), names it in the folder’s studio.json and pulls its design into design/.',
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
        serverInfo: { name: 'website-studio-design-folder', version: '0.2.3' },
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
