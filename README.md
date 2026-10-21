# Arithmetic Helpers

Eleven single-page tools that work through a math problem step by step, the way it's done on paper, plus a worksheet maker.

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
| [The Order Stack](pemdas.html) | Order of operations (PEMDAS) for long problems with + − × ÷, parentheses and exponents |
| [The Balance Scale](algebra.html) | Algebra: simplifying expressions, solving equations and inequalities, and systems of two equations |
| [The Shape Shop](geometry.html) | Geometry: area and perimeter, volume and surface area, the Pythagorean theorem, and angles |
| [The Worksheet Maker](worksheet.html) | Printable worksheets mixing any of the topics above, with an answer key on its own page |

Every helper page also has:

- a plain-English explanation of each step, including why it comes next
- **One step at a time** and **Check my answer** practice modes; checking accepts any equivalent answer (3/4, 0.75, 6/8) and points out common mistakes
- a **problem maker** that builds practice problems from the options you pick
- a picture of the problem: tape diagrams, area models, fraction bars, hundred grids, factor trees, number lines, expression trees, balance scales, graphs and shapes drawn to scale
- answers that aren't whole numbers shown as both fractions and decimals
- a link to the exact problem on screen (**Copy link**), light and dark themes, and a print layout

The home page has a **Type any problem** box that works out which helper a problem belongs to and opens it there.

## Links to a problem

Every helper reads its problem from the address, so a link opens with that problem worked out. Add `practice=step` or `practice=check` to open it in a practice mode. Some examples:

- `addition.html?q=2 3/4+1 5/6`
- `division.html?q=847÷12&ans=fraction`
- `algebra.html?mode=sys&q=2x+y=7;x-y=2`
- `percents.html?q=15% of 80`
- `geometry.html?q=circle radius 5`

Each page lists the parameters it accepts in a `URL parameters` comment at the top of its script.

## Testing

[`tests.html`](tests.html) checks every helper in the browser: each page loads with all its parts, a list of problems with known answers, **Check my answer** (right, equivalent, needs simplifying, wrong), problems from each page's problem maker re-worked by separate code on the test page, and each made problem reopened from its link. **Thorough** tries every problem-maker option (about 4,000 checks). Run it from the live site or a local server (`python -m http.server`, then open `http://localhost:8000/tests.html`); opened as a plain file, the browser won't let it look inside the other pages. Add `?run=1` to start it straight away. Your saved settings on each page are put back afterwards.

## How it's built

Each page is one self-contained HTML file with no build step. A shared `nav.js` adds the bar across the top of every page (back to the home page, and a link to each of the others); to add a page, add it to the list in that file. The worksheet maker loads the helpers in hidden frames and asks each one for problems and answers through `postMessage` (`helper:options` and `helper:make`), so every worksheet answer is worked out by the same code as the helper page.

Open a page in a browser, or use the live site: <https://chrisdfennell.github.io/arithmetic-helpers/>
