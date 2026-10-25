// Waiting on a Dezio job from this computer: what design-server.mjs offers Claude as job_wait, so a job takes
// one call instead of one read after another, and nothing is held open in the Studio while it runs. Plain Node, no
// packages.
import { call } from './design-folder.mjs';

/**
 * The longest one call waits, well inside any limit Claude Code may set on one tool call: a job still running then is
 * waited on with another call.
 */
export const MOST_SECONDS = 120;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** The states a job ends in. */
const ENDED = ['done', 'failed', 'cancelled'];

/** How much longer a job still under way usually takes, as the Studio says. */
function usually(job) {
  return job.usual_seconds_left > 0
    ? `Jobs of its kind usually need about ${String(job.usual_seconds_left)} s more.`
    : 'It is taking longer than jobs of its kind usually do.';
}

/** The job as it stands, in lines: how it is, then the job as the Studio answered it. */
function linesOf(job, seconds) {
  const progress = job.total === null ? '' : `, ${String(job.done)} of ${String(job.total)}`;
  const step = job.step === null ? '' : ` (${job.step}${progress})`;
  const how = !ENDED.includes(job.state)
    ? `Job ${job.job_id} is still ${job.state}${step} after ${String(seconds)} s. ${usually(job)} Call job_wait again to go on waiting.`
    : job.state === 'failed'
      ? `Job ${job.job_id} failed: ${job.failure?.message ?? 'no reason given'}`
      : `Job ${job.job_id} is ${job.state}.`;
  return [how, JSON.stringify(job)];
}

/**
 * Waits for a job of the site: reads it, waits as long as the Studio says before looking again, and reads it again,
 * until it has ended or `seconds` have passed, then answers it as it stands.
 */
export async function waitForJob(site, jobId, seconds = MOST_SECONDS) {
  const until = Date.now() + seconds * 1000;
  for (;;) {
    const job = await call(site, 'GET', `job:get?job_id=${encodeURIComponent(jobId)}`);
    const left = until - Date.now();
    if (ENDED.includes(job.state) || left <= 0) {
      return linesOf(job, seconds);
    }
    // A Studio older than job_wait says no time; waiting on its job would read it back to back.
    const wait = job.retry_after_seconds;
    if (!Number.isInteger(wait) || wait < 1) {
      throw new Error(
        'This version of Dezio doesn’t say when to look at a job again; update it before waiting with job_wait.',
      );
    }
    await sleep(Math.min(wait * 1000, left));
  }
}
