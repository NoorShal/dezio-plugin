# A section type's own script

Most movement needs none: tabs, accordions and menus that open are `details`/`summary` or `input` and `:checked` in
the stylesheet, and transitions are CSS; a job's pictures before and after are the platform's `before_after` section.
Write a script only for what neither can do, such as steps that turn on a button.

## Its shape

- One file per section type that needs one: `design/sections/<type>.js`, pushed with the rest of the design.
- It exports one function, `export function attach(root) { … }`. Above it stand only declarations (`const`, `let`,
  `function`); nothing runs until a page attaches it.
- The markup marks the element it works with `data-script="<type>"`, the type's own name. Each marked element on a
  page is given to `attach` as `root`, once the page is read.
- `attach` returns its undo: listeners added with an `AbortController`'s `signal`, and `() => controller.abort()`
  returned.
- The page reads well without it: draw the still state in the markup and the stylesheet, as the editor shows it.
  The editor never runs the script; the Studio's preview and the published site do.

A script and its mark come together: a mark without a script, or a script the markup marks nothing for, is refused.

## What it may use

All it reaches is `root` and what lies under it.

- **Names it needn't declare:** `Math`, `Number`, `String`, `Boolean`, `Array`, `isNaN`, `parseFloat`, `parseInt`,
  `NaN`, `Infinity`, `undefined`, `AbortController`, `matchMedia`, `setTimeout`, `clearTimeout`, `setInterval`,
  `clearInterval`, `requestAnimationFrame`, `cancelAnimationFrame`.
- **Members:** finding under `root` (`querySelector`, `querySelectorAll`, `matches`, `children`), classes (`classList`
  and `add`, `remove`, `toggle`, `contains`), `dataset`, custom properties (`style.setProperty`,
  `style.removeProperty`), `hidden`, attributes, `textContent`, a control's `value`, `valueAsNumber`, `checked` and
  `disabled`, `focus`, sizes and scrolling, events (`addEventListener`, `preventDefault`, `key`, pointer and touch
  positions, `target`), and lists, text and numbers.
- **Changed:** only `hidden`, `textContent`, `value`, `valueAsNumber`, `checked`, `disabled`, `scrollLeft`,
  `scrollTop` and `dataset.<name>`.
- **Written as a string:** the attribute `setAttribute` and its kin name (`aria-*`, `data-*`, `hidden`, `tabindex`),
  the custom property `setProperty` names (`--…`), every selector, event name and media query. A timer runs a
  function, never a string.

Never `window`, `document`, `this`, `import`, classes, `eval`, `innerHTML`, `fetch`, storage, links' `click()`, or any
step up or out of the section (`parentElement`, `closest`, `ownerDocument`).

## Instead of

| The habit | Write |
| --- | --- |
| `document.querySelector('.x')` | `root.querySelector('.x')` |
| `el.style.left = x + '%'` | ``root.style.setProperty('--position', `${x}%`)``, and `left: var(--position)` in the stylesheet |
| `el.innerHTML = …` | `textContent`, or toggle `hidden` and classes on elements the markup already holds |
| `items[i]` | `items.at(i)`, or `item(i)` on a list from `querySelectorAll` |
| `window.matchMedia(…)` | `matchMedia('(prefers-reduced-motion: reduce)').matches` |
| `getComputedStyle(row).columnGap` | a gap the script measures, such as the next item's `offsetLeft` minus this one's |
| `window.addEventListener('resize', …)` | `matchMedia('(min-width: 48rem)')` and its `change` event |
| `el.closest('.card')` | keep the elements found from `root` |
| `setTimeout('next()', 5000)` | `setTimeout(next, 5000)` |
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
`<button type="button" class="weiter">Nächster Schritt</button>`. Without the script every step shows, one under the
other, so the page reads whole.
