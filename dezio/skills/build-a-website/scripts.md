# A design's scripts

Most movement needs none: tabs, accordions and menus that open are `details`/`summary` or `input` and `:checked` in
the stylesheet, transitions are CSS, and a section moves as it scrolls into view by the mark below; a job's pictures
before and after are the platform's `before_after` section. Write a script only for what neither can do, such as steps
that turn on a button.

## When a section scrolls into view

The platform's own page script marks each of the design's sections, on its markup's top element, `data-in-view` once
any of it scrolls into view, and fires an `in-view` event on that element then, after every section's script has
attached. The stylesheet and the section's script react to it:

- the stylesheet starts a motion from the mark:
  `.angebote[data-in-view] .karte { animation: auftauchen 600ms ease-out both; }`;
- a script whose `data-script` sits on the section's top element listens for it,
  `root.addEventListener('in-view', start, { signal: controller.signal })`, and reads `root.dataset.inView`.

Only the page's script sets the mark, so a page read without scripts shows each section as it stands: draw the still
state in the markup and the stylesheet, the whole section showing, and start the motion from the mark. A motion that
follows the scrolling itself needs no script: CSS scroll-driven animations (`animation-timeline: view()`) pass the
push's check.

## Its shape

- One file per section type that needs one: `design/sections/<type>.js`, pushed with the rest of the design.
- It exports one function, `export function attach(root, view) { … }` (or `attach(root)`). Above it stand only
  declarations (`const`, `let`, `function`); nothing runs until a page attaches it.
- The markup marks the element it works with `data-script="<type>"`, the type's own name. Each marked element on a
  page is given to `attach` as `root`, once the page is read.
- `attach` returns its undo: listeners added with an `AbortController`'s `signal`, and `() => controller.abort()`
  returned.
- The page reads whole without it, as the editor shows it: the editor never runs the script; Dezio's preview, a
  share link and the published site do, so judge every motion there.
- It shows a state with a `data-` mark of its own, `root.dataset.offen = 'ja'` styled as `[data-offen]`, and leaves
  the classes to the markup, so a class it would add never meets one of the design's own by the same name.
- **The view:** `view.scrollX` and `view.scrollY` (read only), `view.width` and `view.height`, and
  `view.addEventListener('scroll' | 'resize', fn, { signal })` with its removal; the window's own stay out of reach.
- **Its own records:** a `const` set to an object or a list written out, at the top or in a function, is the script's
  own data: it reads, changes and takes apart any field, by any name but those every object answers from its prototype
  (`constructor`, `__proto__`, `__defineGetter__`, `__defineSetter__`, `__lookupGetter__`, `__lookupSetter__`,
  `hasOwnProperty`, `isPrototypeOf`, `propertyIsEnumerable`, `toLocaleString`, `toString`, `valueOf`). A `let`, a
  parameter, another name for a record or a `const` set to anything else is none. What a record holds is checked as
  anything else (`state.panel.hidden` passes, `state.position.x` is refused): one record per thing, or one list per
  field; brackets take written numbers only.

A script and its mark come together: a mark without a script, or a script the markup marks nothing for, is refused.

## The page's script

- One per design, `design/page.js`, pushed with the rest and kept with its versions:
  `export function attach(parts, view) { … }`.
- `parts` are the elements the header, the footer and the design's own section types mark
  `data-page-part="<name>"` (lowercase words joined by hyphens, up to 40 characters, read as `part.dataset.pagePart`),
  in the page's order. Each reaches itself and what lies under it, by the same lists as a section's script.
- An element may carry its type's `data-script` and a page mark both.
- Refused: a mark on or around the legal links (mark one beside the list instead), any mark in a section holding the
  contact form, the application form or the map, a page script with no part marked, and a mark without a page script.
- Like a section's script, it never runs in the editor.

## What it may use

All it reaches is `root` (the page's script: its `parts`) and what lies under it, its view and its own records. The
push checks every name against these lists, which hold all a script may use. `new` makes only an `AbortController`,
a `Date` or an `Intl.DateTimeFormat`; the current time is read, as `new Date()`, `Date.now()` or
`new Intl.DateTimeFormat(…)` give it, never set; a canvas is drawn on through `getContext('2d')` only.

- **Names it needn't declare:** `AbortController`, `Array`, `Boolean`, `Date`, `Infinity`, `Intl`, `Math`, `NaN`,
  `Number`, `String`, `cancelAnimationFrame`, `clearInterval`, `clearTimeout`, `isNaN`, `matchMedia`, `parseFloat`,
  `parseInt`, `requestAnimationFrame`, `setInterval`, `setTimeout` and `undefined`.
- **Members it may read or call:**
  - the element and what lies under it: `querySelector`, `querySelectorAll`, `matches`, `children`,
    `firstElementChild`, `lastElementChild`, `childElementCount`, `classList`, `add`, `remove`, `toggle`, `contains`,
    `dataset`, `style`, `setProperty`, `removeProperty`, `hidden`, `setAttribute`, `removeAttribute`, `getAttribute`,
    `hasAttribute`, `toggleAttribute`, `textContent`, `value`, `valueAsNumber`, `checked`, `disabled`, `focus` and
    `blur`;
  - its sizes and scrolling: `scrollTo`, `scrollBy`, `scrollLeft`, `scrollTop`, `scrollWidth`, `scrollHeight`,
    `clientWidth`, `clientHeight`, `offsetWidth`, `offsetHeight`, `offsetLeft`, `offsetTop`, `getBoundingClientRect`,
    `left`, `top`, `right`, `bottom`, `width` and `height`;
  - the page's scroll position, as its view gives it: `scrollX` and `scrollY`;
  - events, and what ends a listener: `addEventListener`, `removeEventListener`, `preventDefault`, `stopPropagation`,
    `target`, `currentTarget`, `type`, `key`, `code`, `repeat`, `shiftKey`, `altKey`, `ctrlKey`, `metaKey`, `button`,
    `clientX`, `clientY`, `pageX`, `pageY`, `deltaX`, `deltaY`, `pointerId`, `setPointerCapture`,
    `releasePointerCapture`, `signal`, `abort` and `media`; a swipe or a drag listens for pointer events, as a touch
    event's lists hold every finger on the screen;
  - the current time: `now`, `getFullYear`, `getMonth`, `getDate`, `getDay`, `getHours`, `getMinutes`, `getSeconds`,
    `getMilliseconds`, `getTime`, `getTimezoneOffset`, `toLocaleDateString`, `toLocaleTimeString`, `toLocaleString`,
    `toISOString`, `DateTimeFormat` and `format`;
  - drawing on its canvas: `getContext`, `fillRect`, `strokeRect`, `clearRect`, `beginPath`, `closePath`, `moveTo`,
    `lineTo`, `arc`, `arcTo`, `bezierCurveTo`, `quadraticCurveTo`, `rect`, `ellipse`, `fill`, `stroke`, `save`,
    `restore`, `translate`, `rotate`, `scale`, `setTransform`, `resetTransform`, `fillText`, `strokeText`, `measureText`,
    `createLinearGradient`, `createRadialGradient`, `addColorStop`, `setLineDash`, `fillStyle`, `strokeStyle`,
    `lineWidth`, `lineCap`, `lineJoin`, `globalAlpha`, `font`, `textAlign`, `textBaseline`, `shadowBlur`, `shadowColor`,
    `shadowOffsetX`, `shadowOffsetY` and `lineDashOffset`;
  - lists, text and numbers: `length`, `at`, `item`, `forEach`, `map`, `filter`, `find`, `findIndex`, `some`, `every`,
    `includes`, `indexOf`, `push`, `pop`, `shift`, `unshift`, `slice`, `splice`, `join`, `reduce`, `from`, `isArray`,
    `trim`, `split`, `replace`, `replaceAll`, `startsWith`, `endsWith`, `padStart`, `toLowerCase`, `toUpperCase`,
    `toFixed`, `isFinite`, `isInteger`, `min`, `max`, `round`, `floor`, `ceil`, `abs`, `sign`, `trunc`, `sqrt`, `pow`,
    `random` and `PI`.
- **Members it may change:** `hidden`, `textContent`, `value`, `valueAsNumber`, `checked`, `disabled`, `scrollLeft`,
  `scrollTop`, a canvas's `width` and `height`, its drawing's `fillStyle`, `strokeStyle`, `lineWidth`, `lineCap`,
  `lineJoin`, `globalAlpha`, `font`, `textAlign`, `textBaseline`, `shadowBlur`, `shadowColor`, `shadowOffsetX`,
  `shadowOffsetY` and `lineDashOffset`, and `dataset.<name>`.
- **Written as a string:** the attribute `setAttribute` and its kin name (`aria-*`, `data-*`, `hidden`, `tabindex`),
  the custom property `setProperty` names (`--…`), every selector, event name and media query. A timer runs a
  function, never a string.
- **A canvas** stands in the markup as `<canvas width="…" height="…">`, in whole pixels, marked `aria-hidden="true"`
  where it only decorates, or saying what it shows with `aria-label="…"` or words inside it; one that says nothing is
  refused. The script may set its `width` and `height` to its own size. Nothing reads its pixels back or draws a
  picture into it: `getImageData`, `toDataURL`, `toBlob`, `drawImage`, `createPattern` and `filter` are refused.

Never `window`, `document`, `this`, `import`, classes, `eval`, `innerHTML`, `fetch`, storage, `click()`, or any step
up or out of the section (`parentElement`, `closest`, `ownerDocument`). A click a script makes acts for the visitor:
it follows a link off the page or presses a button they never chose. To do what a button does, call the function its
listener runs.

## Instead of

| The habit | Write |
| --- | --- |
| `document.querySelector('.x')` | `root.querySelector('.x')` |
| `el.style.left = x + '%'` | ``root.style.setProperty('--position', `${x}%`)``, and `left: var(--position)` in the stylesheet |
| `el.innerHTML = …` | `textContent`, or toggle `hidden` and `data-` marks on elements the markup already holds |
| `el.classList.add('open')` | `el.dataset.offen = 'ja'`, and `[data-offen]` in the stylesheet |
| `items[i]` | `items.at(i)`, or `item(i)` on a list from `querySelectorAll` |
| `window.matchMedia(…)` | `matchMedia('(prefers-reduced-motion: reduce)').matches` |
| `getComputedStyle(row).columnGap` | a gap the script measures, such as the next item's `offsetLeft` minus this one's |
| `window.addEventListener('resize', …)` | `view.addEventListener('resize', …, { signal })`, or `matchMedia('(min-width: 48rem)')` and its `change` event |
| `window.scrollY`, `window.addEventListener('scroll', …)` | `view.scrollY`, `view.addEventListener('scroll', …, { signal })` |
| `el.closest('.card')` | keep the elements found from `root` |
| `setTimeout('next()', 5000)` | `setTimeout(next, 5000)` |
| `ctx.drawImage(img, …)` | the picture in the markup as an `<img>`, the canvas drawing around it |
| `canvas.toDataURL()` | none: nothing leaves the page |
| analytics (`gtag`, `dataLayer`) | none: the site measures visits itself |

## Steps that turn on a button

```js
export function attach(root) {
  const steps = Array.from(root.querySelectorAll('.schritt'));
  const next = root.querySelector('button.weiter');
  let current = 0;
  const show = () => {
    steps.forEach((step, index) => {
      step.hidden = index !== current;
    });
    root.dataset.schritt = String(current + 1);
  };
  const controller = new AbortController();
  next?.addEventListener(
    'click',
    () => {
      current = (current + 1) % steps.length;
      show();
    },
    { signal: controller.signal },
  );
  show();
  return () => controller.abort();
}
```

Its markup: `<section class="trocknung" data-script="trocknung">` holding each step as `<div class="schritt">` and
`<button type="button" class="weiter" data-word="next"></button>`, its words in `design/words/` (`design-folder.md`).
Without the script every step shows, one under the other, so the page reads whole.
