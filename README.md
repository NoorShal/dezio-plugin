# Dezio

Build and change websites on Dezio by talking to Claude. The plugin gives Claude Dezio's tools and a design folder on
your computer that stays in step with Dezio, for a site with a design of its own.

## Before you start

- **Claude Code**, in the terminal or in the **Code** tab of Claude Desktop. Build and change sites there: the design
  folder runs on your computer, which a chat can't reach.
- **Node.js** on your computer, which the design folder runs with. If you don't have it, install the LTS version from
  [nodejs.org](https://nodejs.org).

Without a design of its own, a site needs no plugin: add Dezio to Claude as a connector, as Dezio's **AI apps** page
shows.

## Install

In the **Code** tab of Claude Desktop, or in Claude Code in the terminal, type this line, which adds our marketplace
and opens the plugin, then choose **Install for you**:

```
/plugin install dezio --marketplace NoorShal/dezio-plugin
```

**Had the earlier website-builder plugin?** Remove it first. Removing its marketplace removes the plugin with it:

```
/plugin marketplace remove website-studio
```

## Sign in

The plugin brings its two connections: **dezio**, Dezio online, and **dezio-design**, the design folder on your
computer. Each signs in to Dezio as you, in your browser, and you choose **Allow**:

- **dezio:** type `/mcp`, choose **plugin:dezio:dezio**, then **Authenticate**, or let Claude offer it.
- **dezio-design:** on its first use, Claude Code shows a link to sign in.

Neither asks again while you use it. Where Dezio is a connector in Claude too, on the same account, Claude Code
connects to it once.

## Effort for design work

Designing a site takes Claude's careful thinking: before you start, type `/effort xhigh` (extra high), or `/effort high`.
In Claude Desktop, Cmd+Shift+E opens the same choice.

## Use

Ask for what you want, for example:

> Build a website on Dezio for my car wash. Interview me first.

## What the plugin keeps

Each prompt you type in a site's design folder is kept with that site in Dezio, where the site's editors can read it,
so its design can be traced back to what was asked and faults looked into. It waits in the plugin's own folder on your
computer until the design folder next sends the design, and goes with the site when the site is deleted.

## Updates

Turn on updates once, and the plugin keeps itself current: type `/plugin`, open **Marketplaces**, choose **dezio**,
then **Enable auto-update**.

To update now instead: type `/plugin`, open **Installed**, choose **dezio**, then **Update now**. Type
`/reload-plugins`, or start a new session, and the new version is in use.

---

This repository is a published copy; the plugin is developed and tested together with Dezio. Third-party rules it
builds on are credited in `dezio/THIRD-PARTY.md`.
