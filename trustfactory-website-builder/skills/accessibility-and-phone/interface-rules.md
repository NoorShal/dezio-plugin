<!--
Web Interface Guidelines, from https://github.com/vercel-labs/web-interface-guidelines (command.md) at commit
434b7f91364665f2f733b310ec54809bf8f37937, sha256 d246b026f4f29b58…. Copyright (c) 2025 Vercel Labs, MIT License; the
licence is in the plugin's licenses/web-interface-guidelines/LICENSE.

Changed by Trustfactory: kept as a checklist for custom-site designs, which run no script and hold no forms of their
own. Removed: the rules for React, script-driven behaviour, forms, URL state, hydration and long lists; the
English-only rules (Title Case, English quotes, "&" for "and"); and the review instructions. German typography and
"Sie" replace the English conventions. The wording of the kept rules is otherwise the source's.
-->

# Interface rules for a custom design

A checklist for a design's header, footer, stylesheet and section markup. The skill `accessibility-and-phone` has the
reasons and the examples.

## Accessibility

- Icon-only links and buttons need `aria-label`
- `<a href>` for navigation, `<details>`/`<summary>` for what opens; never a `<div>` that looks clickable
- Images need a description in the site's library, or are marked decorative there
- Decorative icons need `aria-hidden="true"`
- Use semantic HTML (`<nav>`, `<a>`, `<ul>`, `<table>`) before ARIA
- Headings hierarchical `<h2>`–`<h6>` inside sections; the platform draws the skip link
- `scroll-margin-top` on heading anchors

## Focus states

- Links and summaries need a visible focus: `:focus-visible` with an outline
- Never `outline: none` without a focus replacement
- Use `:focus-visible` over `:focus` (no focus ring on click)
- Group focus with `:focus-within` for compound blocks
- Sticky headers, footers and bands must not cover the focused element

## Animation

- Honour `prefers-reduced-motion` (motion inside `no-preference`)
- Animate `transform` and `opacity` only
- Never `transition: all`; list the properties
- Set the right `transform-origin`
- SVG: transforms on a `<g>` with `transform-box: fill-box; transform-origin: center`
- Nothing that moves on its own for more than five seconds

## Typography

- `…` not `...`
- German quotes „…“, never straight `"` in text
- Non-breaking spaces between a number and its unit: `48&nbsp;Stunden`, `1.250&nbsp;€`
- `font-variant-numeric: tabular-nums` for prices, hours and figures that line up
- `text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs

## Content handling

- Text containers handle long content: `overflow-wrap: break-word`, `hyphens: auto`
- Flex children need `min-width: 0` so long words can wrap
- Handle empty fields: an element bound to an optional field takes `data-if`, so nothing broken shows when it is empty
- Content of any length: test a heading with one word and with the longest real German one

## Images

- Give every picture's box its shape (`aspect-ratio`), so nothing shifts as it loads
- Tell the platform the size a picture takes with `sizes`
- The first section's picture loads first; the platform handles the rest

## Touch and interaction

- `touch-action: manipulation` on links and buttons (no double-tap delay)
- `-webkit-tap-highlight-color` set on purpose
- `overscroll-behavior: contain` inside a fold-out menu that scrolls
- No gesture-only actions: everything works with a tap and the keyboard

## Safe areas and layout

- Full-bleed bands need `env(safe-area-inset-*)` for notches
- No unwanted sideways scrollbars: fix the overflowing content rather than hiding it
- Flex and grid for layout

## Dark grounds

- A design with a dark page ground sets `color-scheme: dark` on its sections
- Text on a dark band uses `--site-on-accent`

## Hover and states

- Links and buttons need a hover state
- Hover, active and focus are more prominent than rest, never less

## Words on controls

- Active voice: "Angebot anfordern", not "Angebot wird angefordert"
- Specific button labels: "Rückruf vereinbaren", not "Weiter" or "Absenden"
- Formal "Sie"
- Numerals for counts: "8 Mitarbeiter", not "acht"

## Anti-patterns (flag these)

- `user-scalable=no` or `maximum-scale=1`
- `transition: all`
- `outline: none` without a focus-visible replacement
- A picture box without a shape
- An icon link without `aria-label`
- An animated picture where a still or a short muted video would do
- An action that works only with a gesture or a hover
