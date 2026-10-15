#!/usr/bin/env node
// Claude Code's UserPromptSubmit hook: keeps each prompt a designer gives inside a custom site's design folder with
// that site in Website Studio, with its session. It runs on its own after the prompt is sent and never stops one: a
// prompt outside a design folder, without a key, or one the Studio refuses is simply not kept.
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

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
  const site = typeof cwd === 'string' ? siteOf(cwd) : undefined;
  // The key given when the plugin was installed, which Claude Code hands its hooks; else one set in the environment.
  const key = process.env.CLAUDE_PLUGIN_OPTION_STUDIO_KEY || process.env.TF_STUDIO_KEY;
  if (site === undefined || key === undefined || key === '' || typeof prompt !== 'string' || prompt.trim() === '') {
    return;
  }
  const api = process.env.TF_STUDIO_API ?? 'https://website-studio-api.vercel.app';
  await fetch(new URL(`/v1/sites/${encodeURIComponent(site)}/template_sites/design_prompt:record`, api), {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({ session, prompt }),
  });
}

main().catch(() => {
  // A prompt that couldn't be kept is left out; the designer's work goes on.
});
