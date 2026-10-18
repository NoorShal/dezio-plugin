# Trustfactory website builder

Build and change websites on Trustfactory's Website Studio by talking to Claude. The plugin gives Claude the Studio's
tools, our guides for design and writing, and a design folder on your computer that stays in step with the Studio.

## Before you start

- **A Studio key.** In Website Studio, open **AI agents** and choose **Create a key**. Copy the key: it is shown only
  once.
- **Claude Code**, in the terminal or in the **Code** tab of Claude Desktop. Build and change sites there: the design
  folder runs on your computer, which a chat can't reach.
- **Node.js** on your computer, which the design folder runs with. If you don't have it, install the LTS version from
  [nodejs.org](https://nodejs.org).

## Install

In the **Code** tab of Claude Desktop, or in Claude Code in the terminal, type these two lines, one after the other:

```
/plugin marketplace add NoorShal/trustfactory-website-builder
/plugin install trustfactory-website-builder@website-studio
```

Choose **Install for you**. Claude then asks for your Website Studio key: paste it. Your computer keeps it in its secure
store, and nobody sees it again.

### Claude Desktop's own plugin screen

Claude Desktop can also add the plugin to its chats: open **Customize**, then the **Plugins** tab, choose **Add**, then
**Add marketplace**, and under **Add from a repository** enter `NoorShal/trustfactory-website-builder`. Then find the
plugin under **Discover** and choose **Add**. In a chat, Claude has our guides; for building and changing a site, use
the Code tab as above.

## One plugin, nothing to add by hand

The plugin brings its two connections with it: **website-studio**, the Studio online, and **design-folder**, the design
folder on your computer. Claude starts both itself. If you type `/mcp`, they appear as
`plugin:trustfactory-website-builder:website-studio` and `plugin:trustfactory-website-builder:design-folder`: two
connections of one plugin.

Don't add the Studio a second time by hand: a second connection to it only confuses Claude. If you did before, find the
one in `/mcp` without `plugin:` in front, and remove it by its name in the terminal: `claude mcp remove <name>`.

## Effort for design work

Designing a site takes Claude's careful thinking: before you start, type `/effort xhigh` (extra high), or `/effort high`.
In Claude Desktop, Cmd+Shift+E opens the same choice.

## Use

Ask for what you want, for example:

> Build a website on Website Studio for my car wash. Interview me first.

## A new key

A key stops working when it ends or when you revoke it in the Studio; Claude then says the Studio didn't accept it.
Make a new key in the Studio under **AI agents**, enter it in the plugin's options, then restart Claude Code. The
options open with:

```
/plugin configure trustfactory-website-builder@website-studio
```

## What the plugin keeps

Each prompt you type in a site's design folder is kept with that site in the Studio, where the site's editors can read
it, so its design can be traced back to what was asked and faults looked into; one typed before the folder is linked
to a site waits in the plugin's own folder on your computer until it is. The prompts go when the site is deleted.

## Updates

Turn on updates once, and the plugin keeps itself current: type `/plugin`, open **Marketplaces**, choose
**website-studio**, then **Enable auto-update**.

To update now instead: type `/plugin`, open **Installed**, choose **trustfactory-website-builder**, then **Update
now**. Type `/reload-plugins`, or start a new session, and the new version is in use.

---

This repository is a published copy; the plugin is developed and tested together with the Studio. Third-party rules it
builds on are credited in `trustfactory-website-builder/THIRD-PARTY.md`.
