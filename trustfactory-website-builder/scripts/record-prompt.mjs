#!/usr/bin/env node
// Claude Code's UserPromptSubmit hook: keeps each prompt a designer gives inside a custom site's design folder with
// that site in Website Studio, with its session. It runs on its own after the prompt is sent and never stops one. A
// prompt given before the folder is linked to a site, or without the key, waits in the plugin's data folder until
// design_init or design_push sends it; one the Studio refuses is simply not kept. A turn Claude Code starts itself,
// such as a background task's notice, is no prompt of the designer's and is left out.
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { keepPrompt, typedPrompt } from './prompts.mjs';
import { ONLINE } from './studio-addresses.mjs';

/** The site of the design folder the prompt was given in, from its studio.json; none outside one. */
function siteOf(cwd) {
  for (let dir = cwd; ; dir = dirname(dir)) {
    const file = join(dir, 'studio.json');
    if (existsSync(file)) {
      return JSON.parse(readFileSync(file, 'utf8')).site_id;
    }
    if (dirname(dir) === dir) {
      return undefined;
    }
  }
}

async function main() {
  process.stdin.setEncoding('utf8');
  let input = '';
  for await (const chunk of process.stdin) {
    input += chunk;
  }
  const { session_id: session, prompt, cwd } = JSON.parse(input);
  if (typeof session !== 'string' || typeof cwd !== 'string' || !typedPrompt(prompt)) {
    return;
  }
  const site = siteOf(cwd);
  // The key given when the plugin was installed, which Claude Code hands its hooks; else one set in the environment.
  const key = process.env.CLAUDE_PLUGIN_OPTION_STUDIO_KEY || process.env.TF_STUDIO_KEY;
  if (site === undefined || key === undefined || key === '') {
    await keepPrompt({ session, prompt, cwd });
    return;
  }
  const api = process.env.TF_STUDIO_API || ONLINE.api;
  await fetch(new URL(`/v1/sites/${encodeURIComponent(site)}/template_sites/design_prompt:record`, api), {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({ session, prompt }),
  });
}

main().catch(() => {
  // A prompt that couldn't be kept is left out; the designer's work goes on.
});
