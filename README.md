# Arithmetic Helpers

Fourteen single-page tools that work through a math problem step by step, the way it's done on paper, plus tools for practice and for the classroom. It installs like an app and works offline.

| Page | What it does |
| --- | --- |
| [The Carry Column](addition.html) | Addition of whole numbers, decimals (2–4 numbers) and fractions, with every carry shown |
| [The Borrow Bank](subtraction.html) | Subtraction with every borrow crossed out and written above |
| [The Product Ladder](multiplication.html) | Multiplication with partial products, then placing the decimal point |
| [The Division House](division.html) | Long division with remainders, fractions or decimals (including repeating) |
| [The Fraction Bar](fractions.html) | Fractions: simplifying, converting to decimals and percents, comparing and ordering, equivalent fractions |
| [The Hundred Grid](percents.html) | Percents: percent of a number, what percent, finding the whole, percent change, discounts, tax, tips and interest |
| [The Factor Tree](factors.html) | Factors and primes: factor pairs, prime factorization, prime or composite, GCF and LCM, divisibility rules |
| [The Number Line](integers.html) | Integers: adding, subtracting, multiplying and dividing negative numbers, absolute value and ordering |
| [The Ratio Table](ratios.html) | Ratios: simplifying, unit rates and better buys, proportions, sharing in a ratio, and scale |
| [The Order Stack](pemdas.html) | Order of operations (PEMDAS) for long problems with + − × ÷, parentheses and exponents |
| [The Balance Scale](algebra.html) | Algebra: simplifying expressions, solving equations and inequalities, and systems of two equations |
| [The Slope Grid](lines.html) | Lines: slope, the equation of a line, converting forms, graphing, and parallel or perpendicular lines |
| [The Shape Shop](geometry.html) | Geometry: area and perimeter, volume and surface area, the Pythagorean theorem, and angles |
| [The Dot Plot](stats.html) | Statistics: mean, median, mode and range, box plots, frequency tables, spread, and missing values |

| Tool | What it does |
| --- | --- |
| [Practice sets](practice.html) | Build a set of problems from any helpers and share it as one link; students work through it with Check my answer and get a score to hand in |
| [The Worksheet Maker](worksheet.html) | Printable worksheets mixing any of the topics, with an answer key on its own page (or turn the sheet into a practice link) |
| [Your progress](progress.html) | A private record, kept on the device, of what's been practised, right first time per topic, and mistakes to revisit |
| [The Word List](glossary.html) | Definitions of the math words the site uses, with examples and pictures |

Every helper page also has:

- a plain-English explanation of each step, including why it comes next; math words in it link to their definition, with a popup on hover, focus or tap
- **One step at a time** and **Check my answer** practice modes; checking accepts any equivalent answer (3/4, 0.75, 6/8) and points out common mistakes
- a **problem maker** in plain language, with a live "Makes problems like: …" preview
- a picture of the problem: tape diagrams, area models, fraction bars, hundred grids, factor trees, number lines, ratio tables, expression trees, balance scales, graphs, dot plots and shapes drawn to scale
- answers that aren't whole numbers shown as both fractions and decimals
- a link to the exact problem on screen (**Copy link**), light and dark themes, and a print layout
- **Next problem** straight after a right answer, using the same problem-maker settings

And across the whole site:

- light/dark and text size are remembered on every page, not one page at a time
- a **Type any problem** search box in the bar at the top of every page
- **Big screen** mode for a projector or smartboard, and **Read aloud** for the step-by-step explanation
- **Recent** problems on each page, and keyboard shortcuts (press `?` to see them)
- link previews when a page is shared, and a friendly page for broken links

The home page has a **Type any problem** box that works out which helper a problem belongs to and opens it there (and "what is a denominator" opens the Word List).

## Links to a problem

Every helper reads its problem from the address, so a link opens with that problem worked out. Add `practice=step` or `practice=check` to open it in a practice mode. Some examples:

- `addition.html?q=2 3/4+1 5/6`
- `division.html?q=847÷12&ans=fraction`
- `algebra.html?mode=sys&q=2x+y=7;x-y=2`
- `percents.html?q=15% of 80`
- `ratios.html?q=share 60 in 2:3`
- `lines.html?q=(1,2) (5,4)`
- `stats.html?q=4, 8, 6, 5, 7`
- `geometry.html?q=circle radius 5`

Each page lists the parameters it accepts in a `URL parameters` comment at the top of its script. `embed=1` shows just the problem and the answer box (practice sets use this).

## Testing

[`tests.html`](tests.html) checks every helper in the browser: each page loads with all its parts, a list of problems with known answers, **Check my answer** (right, equivalent, needs simplifying, wrong), problems from each page's problem maker re-worked by separate code on the test page, and each made problem reopened from its link. **Thorough** tries every problem-maker option (about 5,400 checks). Run it from the live site or a local server (`python -m http.server`, then open `http://localhost:8000/tests.html`); opened as a plain file, the browser won't let it look inside the other pages. `?run=1` starts it straight away, `&depth=thorough` runs the long version and `&pages=ratios,stats` tests just those. Your saved settings on each page are put back afterwards.

## How it's built

Each page is one self-contained HTML file with no build step. A few shared files sit beside them:

- `nav.js` adds the bar across the top of every page, makes the site installable (`manifest.webmanifest`, `icons/`) and offline (`sw.js`), and loads the definitions popups. To add a page, add it to the list in `nav.js` and to `PAGES` in `sw.js`.
- `glossary.js` holds every definition, and finds and links the math words on each page.
- `progress.js` records each Check my answer result in the browser and draws the "Your practice" panel.
- `tools.js` adds the site-wide settings, big screen, read aloud, recent problems, keyboard shortcuts and Next problem.
- `search.js` works out which helper a typed problem belongs to (used by the home page, the bar and `404.html`).
- Visits are counted with GoatCounter (no cookies, nothing personal); pages shown inside other pages and local testing aren't counted.

Each helper reports each check with a `helper:checked` event, and answers worksheet and practice-set requests through `postMessage` (`helper:options` and `helper:make`), so every worksheet and practice answer is worked out by the same code as the helper page.

Open a page in a browser, or use the live site: <https://chrisdfennell.github.io/arithmetic-helpers/>
