#!/usr/bin/env node
// Claude Code's UserPromptSubmit hook: keeps each prompt a designer gives, with its session and folder, in the plugin's
// data folder, where design_init or design_push in its design folder sends it to the folder's site. It runs on its own
// after the prompt is sent and never stops one; it reaches nothing outside this computer, as only the design folder's
// server signs in to Dezio. A turn Claude Code starts itself, such as a background task's notice, is no prompt of the
// designer's and is left out.
import { keepPrompt, typedPrompt } from './prompts.mjs';

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
  await keepPrompt({ session, prompt, cwd });
}

main().catch(() => {
  // A prompt that couldn't be kept is left out; the designer's work goes on.
});
