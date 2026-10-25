// The design folder's own sign-in to Dezio, as the pre-registered public client dezio-design-folder: OAuth 2.1 with
// PKCE, its redirect to a free port on this computer's loopback (RFC 8252), its sign-in server found from the API's own
// 401 (RFC 9728, RFC 8414). The tokens are kept in the plugin's data folder, readable by this user only. Every Claude
// Code session runs a design server of its own on that same file, so each refresh happens under a lock, reading the
// refresh token from the file each time and never holding it between calls: two servers refreshing the same token
// would count as a replay, which signs the person out. Plain Node, no packages.
import { Buffer } from 'node:buffer';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { createServer } from 'node:http';
import { mkdir, open, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { URLSearchParams } from 'node:url';

/** The design folder's client, which Dezio registers itself, so it never fetches a document of ours. */
const CLIENT_ID = 'dezio-design-folder';

/** Dezio's own scope, and a refresh token, so a sign-in lasts while it is used. */
const SCOPE = 'dezio offline_access';

/** An access token is renewed this long before it ends, so no call goes out with one about to end. */
const RENEW_BEFORE_MS = 60_000;

/** How long a sign-in in the browser may take before the design folder stops waiting for it. */
const SIGN_IN_WITHIN_MS = 5 * 60_000;

/** A lock older than this was left by a server that stopped mid-refresh, as a refresh takes a second or two. */
const STALE_LOCK_MS = 30_000;

/**
 * Dezio's API, which the design folder calls: another environment's where TF_STUDIO_API names one. The Dezio server's
 * address in .mcp.json repeats it, as JSON can't import it.
 */
export function apiOrigin() {
  return process.env.TF_STUDIO_API || 'https://api.heydezio.com';
}

function dataFolder() {
  const data = process.env.CLAUDE_PLUGIN_DATA;
  if (data === undefined || data === '') {
    throw new Error('The design folder signs in to Dezio inside Claude Code, which gives the plugin its data folder.');
  }
  return data;
}

const signInFile = () => join(dataFolder(), 'sign-in.json');
const lockFile = () => join(dataFolder(), 'sign-in.lock');

/** The kept sign-in for this API, or none: one kept for another environment's API is none here. */
async function keptSignIn() {
  try {
    const kept = JSON.parse(await readFile(signInFile(), 'utf8'));
    return kept.api === apiOrigin() ? kept : undefined;
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return undefined;
    }
    throw error;
  }
}

/** Writes the sign-in whole, readable by this user only, so another server never reads half of it. */
async function keepSignIn(signIn) {
  await mkdir(dataFolder(), { recursive: true });
  const written = `${signInFile()}.${process.pid}`;
  await writeFile(written, `${JSON.stringify(signIn, null, 2)}\n`, { mode: 0o600 });
  await rename(written, signInFile());
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Runs `step` while this server alone holds the lock that every design server on this computer takes to refresh. */
async function underLock(step) {
  await mkdir(dataFolder(), { recursive: true });
  for (;;) {
    try {
      const held = await open(lockFile(), 'wx');
      try {
        return await step();
      } finally {
        await held.close();
        await rm(lockFile(), { force: true });
      }
    } catch (error) {
      if (error?.code !== 'EEXIST') {
        throw error;
      }
      const since = await stat(lockFile()).then(
        (found) => Date.now() - found.mtimeMs,
        () => 0,
      );
      if (since > STALE_LOCK_MS) {
        await rm(lockFile(), { force: true });
      } else {
        await sleep(100);
      }
    }
  }
}

/** A token request to the sign-in server: its tokens, or why it refused, by its OAuth error. */
async function tokenRequest(server, fields) {
  const response = await fetch(server.token_endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded', accept: 'application/json' },
    body: new URLSearchParams({ client_id: CLIENT_ID, ...fields }),
  });
  const answer = await response.json().catch(() => null);
  if (!response.ok || typeof answer?.access_token !== 'string') {
    return { refused: typeof answer?.error === 'string' ? answer.error : `status ${String(response.status)}` };
  }
  return { tokens: answer };
}

/** The sign-in a token answer makes, beside where it was got. */
function signInOf(base, tokens) {
  return {
    ...base,
    access_token: tokens.access_token,
    access_ends_at: Date.now() + Number(tokens.expires_in ?? 3600) * 1000,
    refresh_token: tokens.refresh_token,
  };
}

/**
 * The kept sign-in with an access token that works for a while yet: renewed with its refresh token under the lock when
 * it is about to end, or when it is `refused`, the one a 401 just turned away; none where there is none. A refresh
 * Dezio no longer takes forgets the sign-in, so the next call signs in anew.
 */
async function usableSignIn(refused) {
  const kept = await keptSignIn();
  if (kept === undefined) {
    return undefined;
  }
  const fresh =
    refused === undefined
      ? kept.access_ends_at - RENEW_BEFORE_MS > Date.now()
      : kept.access_token !== refused.access_token;
  if (fresh) {
    return kept;
  }
  return underLock(async () => {
    // Another server may have renewed it while this one waited: its new pair is the one to use.
    const now = await keptSignIn();
    if (now === undefined || now.access_token !== kept.access_token || typeof now.refresh_token !== 'string') {
      return now;
    }
    const { tokens, refused: why } = await tokenRequest(now.server, {
      grant_type: 'refresh_token',
      refresh_token: now.refresh_token,
      resource: now.resource,
    });
    if (why === 'invalid_grant') {
      await rm(signInFile(), { force: true });
      return undefined;
    }
    if (tokens === undefined) {
      throw new Error(`Dezio couldn't renew the design folder's sign-in (${why}). Try again.`);
    }
    const renewed = signInOf(now, tokens);
    await keepSignIn(renewed);
    return renewed;
  });
}

/** A JSON document of the sign-in's, fetched as it is: a fault names the address. */
async function documentAt(address) {
  let response;
  try {
    response = await fetch(address, { headers: { accept: 'application/json' }, redirect: 'error' });
  } catch (error) {
    // fetch fails with a TypeError where the address can't be reached at all.
    if (!(error instanceof TypeError)) {
      throw error;
    }
    throw new Error(`Dezio's sign-in couldn't be reached at ${address}: check the connection and TF_STUDIO_API.`, {
      cause: error,
    });
  }
  if (!response.ok) {
    throw new Error(`Dezio's sign-in couldn't be found: ${address} answered ${String(response.status)}.`);
  }
  return response.json();
}

/** Whether `resource` is the address `called`, or one above it on the same origin, as an API's routes sit below it. */
function covers(resource, called) {
  const named = new URL(resource);
  const url = new URL(called);
  const path = named.pathname.replace(/\/$/, '');
  return named.origin === url.origin && (url.pathname === path || url.pathname.startsWith(`${path}/`));
}

/**
 * Where to sign in, from the 401 the API answered `called` with: its protected-resource document (RFC 9728) names the
 * resource, which must be the address called, and its sign-in server, whose own document sits at its path-inserted
 * well-known address (RFC 8414) and must name it as its issuer.
 */
async function discovered(challenge, called) {
  const metadata = /resource_metadata="([^"]+)"/.exec(challenge ?? '')?.[1];
  if (metadata === undefined) {
    throw new Error('Dezio’s API asked for a sign-in without saying where; check TF_STUDIO_API.');
  }
  const resource = await documentAt(metadata);
  const issuer = resource.authorization_servers?.[0];
  if (typeof resource.resource !== 'string' || typeof issuer !== 'string') {
    throw new Error(`Dezio's resource document at ${metadata} names no resource or sign-in server.`);
  }
  // A document made for another address must not be used (RFC 9728 §3.3), which a wrong TF_STUDIO_API leads to.
  if (!covers(resource.resource, called)) {
    throw new Error(
      `The sign-in found at ${new URL(called).origin} is for ${resource.resource}, another address: check TF_STUDIO_API.`,
    );
  }
  const at = new URL(issuer);
  const server = await documentAt(
    new URL(`/.well-known/oauth-authorization-server${at.pathname.replace(/\/$/, '')}`, at.origin),
  );
  if (server.issuer !== issuer) {
    throw new Error(`Dezio's sign-in server names itself ${String(server.issuer)}, not ${issuer}.`);
  }
  return {
    resource: resource.resource,
    server: { issuer, authorization_endpoint: server.authorization_endpoint, token_endpoint: server.token_endpoint },
    // A server that says it sends its issuer back must have done so (RFC 9207).
    sendsIssuer: server.authorization_response_iss_parameter_supported === true,
  };
}

const base64url = (bytes) => Buffer.from(bytes).toString('base64url');

/** What the browser's tab says once the sign-in came back, by how it came back. */
const TAB_WORDS = {
  allowed: 'Signed in to Dezio. You can close this tab and go back to Claude Code.',
  denied: 'Not signed in: you chose Deny. Ask Claude to try again whenever you want to.',
  failed: 'Not signed in. Claude Code says why; ask Claude to try again.',
};

/** The loopback redirect: a free port on this computer, telling the browser once how its sign-in came back. */
async function loopback(state) {
  let settle;
  const arrived = new Promise((resolve, reject) => {
    settle = { resolve, reject };
  });
  const server = createServer((request, response) => {
    const url = new URL(request.url ?? '/', 'http://127.0.0.1');
    if (url.pathname !== '/callback') {
      response.writeHead(404).end();
      return;
    }
    const answer = url.searchParams;
    const ours = answer.get('state') === state;
    const denied = ours && answer.get('error') === 'access_denied';
    response.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' });
    response.end(TAB_WORDS[ours && answer.has('code') ? 'allowed' : denied ? 'denied' : 'failed']);
    settle.resolve(answer);
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const timer = setTimeout(
    () => settle.reject(new Error('The sign-in wasn’t finished in the browser in time.')),
    SIGN_IN_WITHIN_MS,
  );
  const close = () => {
    clearTimeout(timer);
    server.close();
  };
  return { redirect: `http://127.0.0.1:${String(server.address().port)}/callback`, arrived, close };
}

/**
 * How the design server shows the person the link to sign in at, resolving once they chose to open it, and tells
 * Claude Code the sign-in it showed has ended.
 */
let link = {
  show: async () => {
    throw new Error('No way to show the sign-in link was set.');
  },
  finished: () => undefined,
};

export function signInWith(shown) {
  link = shown;
}

/**
 * A new sign-in, in the person's browser: the link shown through Claude Code, the code taken at the loopback, checked
 * against the state and the issuer it was sent with (RFC 9207), and exchanged with its PKCE verifier for the resource.
 */
async function signInAnew(challenge, called) {
  const { resource, server, sendsIssuer } = await discovered(challenge, called);
  const verifier = base64url(randomBytes(32));
  const state = base64url(randomBytes(16));
  const back = await loopback(state);
  try {
    const authorize = new URL(server.authorization_endpoint);
    for (const [name, value] of Object.entries({
      response_type: 'code',
      client_id: CLIENT_ID,
      redirect_uri: back.redirect,
      code_challenge: base64url(createHash('sha256').update(verifier).digest()),
      code_challenge_method: 'S256',
      scope: SCOPE,
      state,
      resource,
    })) {
      authorize.searchParams.set(name, value);
    }
    const id = randomUUID();
    await link.show({
      elicitationId: id,
      url: authorize.href,
      message: 'Sign in to Dezio for the design folder, and choose Allow.',
    });
    const answer = await back.arrived;
    if (answer.get('state') !== state) {
      throw new Error('The sign-in came back for another request; nothing was kept. Try again.');
    }
    if ((sendsIssuer || answer.has('iss')) && answer.get('iss') !== server.issuer) {
      throw new Error('The sign-in came back from another server; nothing was kept. Try again.');
    }
    const code = answer.get('code');
    if (code === null) {
      throw new Error(
        answer.get('error') === 'access_denied'
          ? 'You chose Deny, so the design folder isn’t signed in to Dezio. Ask again whenever you want it to sign in.'
          : `The sign-in wasn't allowed: ${answer.get('error') ?? 'no code came back'}.`,
      );
    }
    const { tokens, refused } = await tokenRequest(server, {
      grant_type: 'authorization_code',
      code,
      redirect_uri: back.redirect,
      code_verifier: verifier,
      resource,
    });
    if (tokens === undefined) {
      throw new Error(`Dezio didn't take the sign-in (${refused}). Try again.`);
    }
    const signIn = signInOf({ api: apiOrigin(), resource, server }, tokens);
    await keepSignIn(signIn);
    return { signIn, elicitationId: id };
  } finally {
    back.close();
  }
}

/** One sign-in at a time in this server: calls that need one while it runs wait for it. */
let signingIn;

/** Signs in anew, once for every call waiting on it. */
function signedIn(challenge, called) {
  signingIn ??= signInAnew(challenge, called)
    .then(({ signIn, elicitationId }) => {
      link.finished(elicitationId);
      return signIn;
    })
    .finally(() => {
      signingIn = undefined;
    });
  return signingIn;
}

/**
 * A request to Dezio's API as the signed-in person: with the kept token, renewed when it is about to end; on a 401,
 * renewed once, else signed in anew in the browser, then sent again.
 */
export async function signedFetch(url, init) {
  const send = (signIn) =>
    fetch(url, {
      ...init,
      headers: { ...init.headers, ...(signIn === undefined ? {} : { authorization: `Bearer ${signIn.access_token}` }) },
    });
  const kept = await usableSignIn();
  const first = await send(kept);
  if (first.status !== 401) {
    return first;
  }
  const renewed = kept === undefined ? undefined : await usableSignIn(kept);
  if (renewed !== undefined && renewed.access_token !== kept.access_token) {
    const again = await send(renewed);
    if (again.status !== 401) {
      return again;
    }
  }
  return send(await signedIn(first.headers.get('www-authenticate'), url));
}

/** Dezio itself, where a preview opens: the origin of the sign-in server the design folder signed in at. */
export async function adminOrigin() {
  const kept = await keptSignIn();
  if (kept === undefined) {
    throw new Error('The design folder isn’t signed in to Dezio yet.');
  }
  return new URL(kept.server.issuer).origin;
}
