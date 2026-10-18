# A section type's own script

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
- It exports one function, `export function attach(root) { … }`. Above it stand only declarations (`const`, `let`,
  `function`); nothing runs until a page attaches it.
- The markup marks the element it works with `data-script="<type>"`, the type's own name. Each marked element on a
  page is given to `attach` as `root`, once the page is read.
- `attach` returns its undo: listeners added with an `AbortController`'s `signal`, and `() => controller.abort()`
  returned.
- The page reads well without it: draw the still state in the markup and the stylesheet, as the editor shows it.
  The editor never runs the script; the Studio's preview, a share link and the published site do, so judge every
  motion there.
- It shows a state with a `data-` mark of its own, `root.dataset.offen = 'ja'` styled as `[data-offen]`, and leaves
  the classes to the markup, so a class it would add never meets one of the design's own by the same name.

A script and its mark come together: a mark without a script, or a script the markup marks nothing for, is refused.

## What it may use

All it reaches is `root` and what lies under it. The push checks every name against these lists, which hold all a
script may use.

- **Names it needn't declare:** `AbortController`, `Array`, `Boolean`, `Infinity`, `Math`, `NaN`, `Number`, `String`,
  `cancelAnimationFrame`, `clearInterval`, `clearTimeout`, `isNaN`, `matchMedia`, `parseFloat`, `parseInt`,
  `requestAnimationFrame`, `setInterval`, `setTimeout` and `undefined`.
- **Members it may read or call:**
  - the element and what lies under it: `querySelector`, `querySelectorAll`, `matches`, `children`,
    `firstElementChild`, `lastElementChild`, `childElementCount`, `classList`, `add`, `remove`, `toggle`, `contains`,
    `dataset`, `style`, `setProperty`, `removeProperty`, `hidden`, `setAttribute`, `removeAttribute`, `getAttribute`,
    `hasAttribute`, `toggleAttribute`, `textContent`, `value`, `valueAsNumber`, `checked`, `disabled`, `focus` and
    `blur`;
  - its sizes and scrolling: `scrollTo`, `scrollBy`, `scrollLeft`, `scrollTop`, `scrollWidth`, `scrollHeight`,
    `clientWidth`, `clientHeight`, `offsetWidth`, `offsetHeight`, `offsetLeft`, `offsetTop`, `getBoundingClientRect`,
    `left`, `top`, `right`, `bottom`, `width` and `height`;
  - events, and what ends a listener: `addEventListener`, `removeEventListener`, `preventDefault`, `stopPropagation`,
    `target`, `currentTarget`, `type`, `key`, `code`, `repeat`, `shiftKey`, `altKey`, `ctrlKey`, `metaKey`, `button`,
    `clientX`, `clientY`, `pageX`, `pageY`, `deltaX`, `deltaY`, `pointerId`, `setPointerCapture`,
    `releasePointerCapture`, `signal`, `abort` and `media`; a swipe or a drag listens for pointer events, as a touch
    event's lists hold every finger on the screen;
  - lists, text and numbers: `length`, `at`, `item`, `forEach`, `map`, `filter`, `find`, `findIndex`, `some`, `every`,
    `includes`, `indexOf`, `push`, `pop`, `shift`, `unshift`, `slice`, `splice`, `join`, `reduce`, `from`, `isArray`,
    `trim`, `split`, `replace`, `replaceAll`, `startsWith`, `endsWith`, `padStart`, `toLowerCase`, `toUpperCase`,
    `toFixed`, `isFinite`, `isInteger`, `min`, `max`, `round`, `floor`, `ceil`, `abs`, `sign`, `trunc`, `sqrt`, `pow`,
    `random` and `PI`.
- **Members it may change:** `hidden`, `textContent`, `value`, `valueAsNumber`, `checked`, `disabled`, `scrollLeft`,
  `scrollTop`, and `dataset.<name>`.
- **Written as a string:** the attribute `setAttribute` and its kin name (`aria-*`, `data-*`, `hidden`, `tabindex`),
  the custom property `setProperty` names (`--…`), every selector, event name and media query. A timer runs a
  function, never a string.

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
