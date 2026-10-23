/* Works out which helper a typed problem belongs to ("47 + 38" → The Carry Column, "15% of 80" → The Hundred Grid,
   "what is a denominator" → the Word List) and builds the link that opens it there. Used by the home page's
   "Type any problem" box and by the search box in the bar across the top of every page.
   HelperSearch.route(text) → { page, params, what, alt } (or { none:true }); HelperSearch.PAGE[file] → [name, color class];
   HelperSearch.href(result) → the full address to open (for result.alt too), wherever the page that asks is */
(function(){
  "use strict";
  var PAGE = {
    "addition.html":["The Carry Column","c-add"], "subtraction.html":["The Borrow Bank","c-sub"],
    "multiplication.html":["The Product Ladder","c-mul"], "division.html":["The Division House","c-div"],
    "fractions.html":["The Fraction Bar","c-fra"], "percents.html":["The Hundred Grid","c-pct"],
    "factors.html":["The Factor Tree","c-fac"], "integers.html":["The Number Line","c-int"],
    "pemdas.html":["The Order Stack","c-ord"], "algebra.html":["The Balance Scale","c-alg"],
    "geometry.html":["The Shape Shop","c-geo"], "glossary.html":["the Word List","c-ink"], "ratios.html":["The Ratio Table","c-rat"],
    "lines.html":["The Slope Grid","c-lin"], "stats.html":["The Dot Plot","c-sta"], "graphing.html":["The Graph Paper","c-gra"], "exponents.html":["The Power Tower","c-exp"], "probability.html":["The Chance Spinner","c-pro"], "trigonometry.html":["The Unit Circle","c-tri"], "calculus.html":["The Rate Machine","c-cal"],
    "number-sense.html":["The Place Value Chart","c-num"], "quadratics.html":["The Area Box","c-qua"],
    "logarithms.html":["The Log Ladder","c-log"], "sequences.html":["The Number Staircase","c-seq"],
    "wordproblems.html":["The Story Problem","c-wrd"], "flashcards.html":["The Flash Cards","c-fla"],
    "reference.html":["the reference sheets","c-ink"], "daily.html":["the problem of the day","c-day"], "scratch.html":["The Scratch Paper","c-scr"]
  };
  function go(page, params, what, alt){ return { page:page, params:params, what:what || "", alt:alt || null }; }
  function qp(s){ return "q=" + encodeURIComponent(s); }

  // a story problem: words around the numbers, and a question about them ("Ana has 12 shells. … How many …?")
  function isStory(s, low){
    if (!/\d/.test(s)) return false;
    var words = low.match(/[a-z']{2,}/g) || [];
    if (words.length < 7) return false;
    var asks = /\b(how (many|much|far|long|old|fast|tall|heavy|big)|what (is|was|will|time|did|does)|who|when|which|find)\b/.test(low) || /\?\s*$/.test(s);
    return asks && (/[.!?]\s+\S/.test(s) || words.length >= 12);
  }

  // numbers and operators, or null if it isn't plain arithmetic
  function tokens(s){
    var out = [], i = 0, m;
    while (i < s.length){
      var rest = s.slice(i);
      if ((m = /^\s+/.exec(rest))){ i += m[0].length; continue; }
      // a mixed number (2 3/4), a fraction (3/4) or a decimal; only when it isn't a division sign between two numbers
      if ((m = /^\d[\d,]*\s+\d+\/\d+/.exec(rest)) || (m = /^\d+\/\d+/.exec(rest)) || (m = /^(\d[\d,]*(\.\d*)?|\.\d+)/.exec(rest))){
        out.push({ t:"n", s:m[0].replace(/\s+/g, " "), frac:/\//.test(m[0]), dec:/\./.test(m[0]) }); i += m[0].length; continue;
      }
      var c = s[i];
      if ("+-−–×*x÷:^()²³|".indexOf(c) >= 0){ out.push({ t:"o", s:c }); i++; continue; }
      return null;
    }
    return out;
  }
  function route(raw){
    var s = String(raw).replace(/\s+/g, " ").trim();
    if (!s) return null;
    var low = s.toLowerCase();

    // flash cards: "7 times table", "6, 7 and 8 times tables", "times tables 2 to 5", "division facts"
    if (/\b(flash ?cards?|times ?tables?|multiplication (?:tables?|facts)|(?:math|number|division|addition|subtraction) facts)\b/.test(low)){
      var deck = /division/.test(low) ? "div" : /addition/.test(low) ? "add" : /subtraction/.test(low) ? "sub" : "times";
      var span = /\b(\d+)\s*(?:-|–|to|through)\s*(\d+)\b/.exec(low);
      var tables = span && +span[1] <= 20 && +span[2] <= 20 && +span[1] < +span[2] ? span[1] + "-" + span[2]
                 : (low.match(/\d+/g) || []).filter(function(n){ return +n <= 20; }).map(Number).join(",");
      var big = (tables.match(/\d+/g) || []).some(function(n){ return +n > 12; });       // the teens: facts up to × 20
      return go("flashcards.html", "deck=" + deck + (tables && (deck === "times" || deck === "div") ? "&t=" + tables + (big ? "&max=20" : "") : ""), "flash cards");
    }
    // doing it by hand on the scratch paper: "by hand 478 + 356", "scratch paper", "let me do 47 × 23 myself"
    if (/\b(?:by\s+hand|scratch\s+paper|on\s+paper|myself|let\s+me\s+(?:do|try|work))\b/.test(low)){
      var sum = s.replace(/\b(?:by\s+hand|scratch\s+paper|on\s+paper|myself|let\s+me\s+(?:do|try|work)(?:\s+it)?|do|work\s+out|i\s+want\s+to|can\s+i|please)\b/gi, " ").replace(/[?.!:]/g, " ").trim();
      var opm = /^[\d.,\s]+([+\-−×x*÷\/])[\d.,\s+\-−×x*÷\/]*$/.exec(sum), opk = opm && { "+":"add", "-":"sub", "−":"sub", "×":"mul", "x":"mul", "*":"mul", "÷":"div", "/":"div" }[opm[1]];
      return go("scratch.html", opk ? "op=" + opk + "&" + qp(sum.replace(/\s+/g, "").replace(/[x×]/g, "*").replace(/÷/g, "/").replace(/−/g, "-")) : "", "doing it by hand");
    }
    // the problem of the day
    if (/^\s*(?:today'?s\s+problem|problem\s+of\s+the\s+day|daily(?:\s+problem|\s+challenge)?|daily\s+math)\s*$/.test(low))
      return go("daily.html", "", "the problem of the day");
    // reference sheets: "formula sheet", "cheat sheet", "multiplication chart"
    if (/\b(reference(?!\s+angles?)|cheat ?sheets?|formula sheets?|formulas|(?:multiplication|times table|addition|hundreds?|prime) (?:chart|grid|table|square)s?|hundreds? chart|roman numerals?|primes? (?:to|up to|under) \d+|list of primes|prime factori[sz]ations? (?:chart|list|to \d+))\b/.test(low)){
      var big = Math.max.apply(null, (low.match(/\d+/g) || ["0"]).map(Number));
      return go("reference.html",
        /roman/.test(low) ? "#roman" : /prime factori/.test(low) ? "#factorizations" : /prime/.test(low) ? "#primes" : /hundred/.test(low) ? "#hundreds" :
        /addition/.test(low) ? "#addition" : /multiplication|times/.test(low) ? (big > 15 ? "#times20" : big > 12 ? "#times15" : "#times") :
        /\b(area|perimeter|volume|geometry|shapes?)\b/.test(low) ? "#geometry" : "", "the reference sheets");
    }
    // paper to print: graph paper, grid paper, dot paper, number lines (the maker), or a blank grid to draw on
    if (/\b(?:graph|grid|dot|isometric|coordinate|squared?)\s+paper\b|\bnumber\s+lines?\s+(?:to\s+print|paper|sheet)|\bblank\s+(?:coordinate\s+(?:plane|grid)|graph|grid)\b/.test(low))
      return /\b(?:draw|plot|online|virtual|on screen)\b/.test(low) ? go("graphing.html", "mode=free", "a blank sheet of graph paper")
        : go("reference.html", "#paper", "graph paper to print", { page:"graphing.html", params:"mode=free" });
    // calculus: derivatives, limits, integrals, tangent lines, maximum and minimum ("d/dx x^3", "lim x->3 …", "∫ 2x dx")
    var hasX = /(?:^|[^a-z])[xt](?![a-z])/.test(low.replace(/\b(?:d\s*\/\s*d[xt]|d[xt])\b/g, " "));
    if (/\bd\s*\/\s*d[xt]\b|\bd²\s*\/\s*d[xt]²|\bderivatives?\b|\bdifferentiate\b|\b[fgy]\s*(?:'+|′+|″)\s*(?:\(|$|\s)/.test(low) ||
        /\blim(?:its?)?\b|\b[xt]\s*(?:→|->)\s*[−-]?\s*(?:\d|∞|inf|π|pi)|\b[xt]\s+approaches\b/.test(low) && hasX ||
        /\bintegra(?:l|ls|te)\b|∫|\bantiderivatives?\b|\bint_/.test(low) ||
        /\btangent\s+(?:to|at)\b/.test(low) && hasX ||
        /\btangent\s+lines?\b|\bhorizontal\s+tangents?\b|\binstantaneous\s+rate\b|\bcritical\s+(?:points?|numbers?|values?)\b|\bextrem(?:a|um)\b|\binflection\b/.test(low) ||
        /\b(?:local|absolute|relative)?\s*(?:max(?:imum|ima)?|min(?:imum|ima)?)s?\b/.test(low) && (/x\s*(?:\^|\*\*|²|³)/.test(low) || /\[\s*[−-]?[\d.π]+\s*,\s*[−-]?[\d.π]+\s*\]/.test(s) && hasX) ||
        /\baverage\s+rate\s+of\s+change\b/.test(low) && /\[\s*[−-]?[\d.π]+\s*,\s*[−-]?[\d.π]+\s*\]/.test(s) && hasX)
      return go("calculus.html", /\d/.test(s) ? qp(s) : "mode=" + (/\blim/.test(low) ? "limit" : /integra|∫|antideriv/.test(low) ? "integral" : /tangent/.test(low) ? "tangent"
        : /max|min|critical|extrem|inflection/.test(low) ? "extrema" : /rate/.test(low) ? "rate" : "derivative"), "calculus");
    // a curve with sin, cos, tan, e^x or ln in it: graph it ("y = 3 sin(2x) + 1")
    if (/^\s*(?:graph\s*:?\s*)?(?:y|f\s*\(\s*x\s*\))\s*=/.test(low) && (s.match(/=/g) || []).length === 1 && /(?:^|[^a-z])x(?![a-z])/.test(low.replace(/^\s*f\s*\(\s*x\s*\)/, "")) &&
        /(?:^|[^a-z])(?:sin|cos|tan|ln|log)(?![a-z])|(?:^|[^a-z])e\s*(?:\^|\*\*)/.test(low) && !/\b(?:amplitude|period|midline|phase)\b/.test(low))
      return go("graphing.html", qp(s.replace(/^\s*graph\s*:?\s*/i, "")), "graphing");
    // "what is a logarithm", "define place value": the Word List (below), not the helper
    var asksWord = /^\s*(?:what\s+(?:is|are|does)|define|definition|meaning)\b/i.test(s) && !/\d/.test(s);
    var story = isStory(s, low);
    // college statistics: the normal curve, z-scores, binomial, intervals, tests, regression ("P(X < 85) mean 70 sd 10")
    // ("line of best fit" and "scatter" stay on the Graph Paper, above)
    if (!asksWord && (/\bz[-\s]?(?:scores?|tests?)\b|\bnormal(?:ly)?\s+distribut|\bbell\s+curve\b|\bbinomial\b|\bconfidence\s+intervals?\b|\bmargin\s+of\s+error\b|\bhypothes[ie]s\b|\bnull\b|\bp-?values?\b|\bt-?tests?\b|\bregression\b|\bcorrelation\b|\bleast[-\s]squares\b|\bcentral\s+limit\b|\bsampling\s+distribution\b|\bstandard\s+error\b|\bempirical\s+rule\b|\b68\s*[-–]\s*95\s*[-–]\s*99/.test(low) ||
        /\bp\s*\(\s*[x-z]?\s*[<>≤≥=]/.test(low) && /\b(?:mean|sd|standard\s+deviation|μ|σ|mu|sigma)\b|[μσ]/.test(low)))
      return go("college-statistics.html", qp(s), "statistics");
    // matrices and vectors: [[1,2],[3,4]], det, row reduce, <3, 4>, dot and cross products, three or more equations at once
    var eqList = s.split(/\s*(?:;|\band\b)\s*/i).filter(function(x){ return /=/.test(x); });
    if (!asksWord && (/\[\s*\[|\bmatri(?:x|ces)\b|\bdeterminants?\b|\bdet\s*[\[(]|\brref\b|\brow[-\s]?(?:reduc|echelon|operations?)|\baugmented\b|\bgauss(?:ian|-jordan)?\b|\bcramer|\bvectors?\b|\bdot\s+product\b|\bcross\s+product\b|\bunit\s+vector\b|\bprojection\s+of\b|\borthogonal\b/.test(low) ||
        /<\s*[−-]?\d+(?:\.\d+)?\s*,\s*[−-]?\d+(?:\.\d+)?(?:\s*,\s*[−-]?\d+(?:\.\d+)?)?\s*>/.test(s) || /\b\d*\s*i\s*[+−-]\s*\d*\s*j\b/.test(low) ||
        eqList.length >= 3 && eqList.every(function(x){ return /^[\s\d.a-z+\-−*×=\/()]+$/i.test(x) && !/[a-z]\s*\^/i.test(x); })))
      return go("matrices-and-vectors.html", qp(s), "matrices and vectors");
    // complex numbers: 3 + 2i, i^23, √−48, the conjugate, polar form, De Moivre
    var iOnly = low.replace(/\b(?:simplify|divide|multiply|add|subtract|find|write|in|as|form|the|of|and|polar|rectangular|standard|trig(?:onometric)?|modulus|argument|conjugate|plot|by|cos|sin|cis|to|what|is|degrees?|radians?|pi|e|sqrt|cbrt|square|cube|root)\b/g, " ");
    if (!asksWord && (/\bcomplex\b|\bimaginary\b|\bde\s*moivre\b|\bconjugate\b|\bcis\b|\bpolar\s+form\b|\bmodulus\b/.test(low) ||
        /(?:\d|\))\s*i(?![a-z])|[+−-]\s*i(?![a-z])|(?:^|[^a-z])i\s*(?:\^|\*\*)\s*[−-]?\d|(?:√|sqrt\s*\(?)\s*\(?\s*[−-]\s*\d/.test(low) && !/[a-hj-z]/.test(iOnly) ||
        /(?:^|[^a-z])i\s+sin\b/.test(low)))
      return go("complex-numbers.html", qp(s), "complex numbers");
    // functions: f(4) with the rule given, f(g(x)), domain and range of a formula, inverses, piecewise, even or odd
    var hasRule = /\b[fgh]\s*\(\s*x\s*\)\s*=/.test(low);
    if (!asksWord && !story && (/\bdomain\b|\bcompositions?\b|\bcompos(?:e|ite)\b|\bpiecewise\b|(?:\beven\s+or\s+odd\b|\bodd\s+or\s+even\b)(?=.*(?:x|[fgh]\s*\())|\bone[-\s]to[-\s]one\b|\bis\s+(?:it|this|that)\s+a\s+function\b|\bvertical\s+line\s+test\b|\bmapping\b/.test(low) ||
        /\b[fgh]\s*\(\s*[fgh]\s*\(/.test(low) || /\(\s*[fgh]\s*[∘o]\s*[fgh]\s*\)/.test(low) || /\b[fgh]\s*(?:\^\s*\(?\s*[−-]\s*1\s*\)?|⁻¹)/.test(low) ||
        /\binverse\b/.test(low) && /x/.test(low) ||
        /\brange\b/.test(low) && /x/.test(low) ||
        hasRule && /\b[fgh]\s*\(\s*(?:[−-]?\d|[a-wyz]\b|[a-z]\s*[+−-])/.test(low.replace(/\b[fgh]\s*\(\s*x\s*\)\s*=/g, " "))))
      return go("functions.html", qp(s), "functions");
    // radicals and rational expressions: rationalize, √ with letters, √12 + √27, radical and rational equations, 8^(2/3)
    // (a plain √50 or cube root of 64 stays on the Power Tower, below)
    var nRad = (s.match(/√|∛|sqrt|cbrt|square\s+root|cube\s+root/gi) || []).length;
    var ratTerms = (s.match(/\/\s*\(\s*[^()]*[a-z][^()]*\)|\/\s*[a-z]\b|\/\s*\d*[a-z]\s*(?:\^|²)/gi) || []).length;
    if (!asksWord && (/\brationali[sz]e\b|\brational\s+(?:expressions?|equations?|exponents?)\b|\bradicals?\b|\bsurds?\b|\bextraneous\b/.test(low) ||
        nRad >= 2 && /[+−\-×*·]|\)\s*\(/.test(s) ||
        nRad >= 1 && (/√\s*\(?[\d\s.]*[a-z](?![a-z])/.test(low.replace(/square\s+root\s+of|cube\s+root\s+of|sqrt|cbrt|square\s+root|cube\s+root|∛/g, "√")) ||
                      /\/\s*(?:√|sqrt)|(?:√|sqrt)[^\/]*\/|\/\s*\([^)]*(?:√|sqrt)/.test(low) || /\bsimplify\b/.test(low)) ||
        /^\s*\(?[−-]?\d+\)?\s*(?:\^|\*\*)\s*\(\s*[−-]?\d+\s*\/\s*\d+\s*\)\s*$/.test(s) ||
        ratTerms >= 1 && (/\bsimplify\b/.test(low) || ratTerms >= 2 || /=/.test(s) && !/^\s*y\s*=/.test(low))))
      return go("radicals.html", qp(s), "radicals and rational expressions");
    // sequences and series: "3, 7, 11, 15, …", "nth term of 5, 8, 11", "a1=4 d=3 n=10", "sum of the first 50 terms of …", "Σ"
    if (!asksWord && (/\b(?:sequences?|series|n-?th\s+term|\d+(?:st|nd|rd|th)\s+term|next\s+(?:terms?|numbers?)|common\s+(?:difference|ratio)|sigma|(?:arithmetic|geometric)\s+progressions?|terms?\s+of|first\s+\d+\s+terms|infinite\s+(?:sum|series))\b/.test(low) || /[Σ∑]/.test(s) ||
        /\d\s*,\s*(?:\.\.\.|…)/.test(s) ||                                                                            // is 100 in 3, 7, 11, …
        /\ba_?\{?1\}?\s*=\s*[−-]?\d/.test(low) && /\b[dr]\s*=\s*[−-]?\d/.test(low) || (low.match(/\ba_?\{?\d+\}?\s*=\s*[−-]?\d/g) || []).length >= 2 ||
        /^\s*[−-]?\d[\d.\/]*(?:\s*,\s*[−-]?\d[\d.\/]*){2,}\s*,?\s*(?:\.\.\.|…|_+|\?)\s*$/.test(s) ||                       // 3, 7, 11, ...
        /^\s*\d+\s*\+\s*\d+\s*\+\s*\d+\s*\+\s*(?:\.\.\.|…)/.test(s)))                                                         // 1 + 2 + 3 + ... + 100
      return go("sequences.html", qp(s), "a sequence");
    // logarithms, and equations with x in the exponent: "log2 32", "ln e^3", "3^(2x-1) = 27", "half-life", "compounded monthly"
    if (!asksWord && (/(?:^|[^a-z])(?:log|ln)(?![a-z])|\blogarithm(?:s|ic)?\b|\bhalf-?\s*life\b|\bcompound(?:ed|ing)?\b|\bexponential\s+(?:growth|decay|equations?)\b|\bdoubling\s+time\b|\bph\s+of\b/.test(low) ||
        (s.match(/=/g) || []).length === 1 && !/(?:^|[^a-z])y(?![a-z])/.test(low) && /(?:[\d)]|(?:^|[^a-z])e)\s*(?:\^|\*\*)\s*\(?[−-]?[\d.]*x/.test(low)))
      return go("logarithms.html", qp(s), "logarithms");
    // quadratics and polynomials: "(x+3)(x-5)", "factor x^2+5x+6", "x^2-5x+6=0", "vertex of y=2x^2-8x+3", "(x^3-8)/(x-2)"
    var sq = low.replace(/²/g, "^2").replace(/³/g, "^3").replace(/\*\*/g, "^").replace(/\b[fgh]\s*\(\s*x\s*\)/g, "y");   // f(x) = … is y = …
    var polyVars = sq.replace(/\b(?:factor\w*|solve|expand|simplify|multiply|divide|by|and|the|of|vertex|form|find|completely|fully|using|use|quadratics?|formula|completing|complete|square|synthetic|long|division|roots?|zeros?|polynomials?|trinomials?|binomials?|foil|discriminant|parabola|add|subtract|from|to|axis|symmetry|for|with|method|what|is|are|a|an)\b/g, " ")
      .match(/[a-z]/g) || [];
    polyVars = polyVars.filter(function(c){ return c !== "y"; });                                         // y = … is the same one
    var oneVar = polyVars.length > 0 && polyVars.every(function(c){ return c === polyVars[0]; });
    var squared = /[a-z]\s*\^\s*[2-9]|\([^()]*[a-z][^()]*\)\s*\^\s*[2-9]/.test(sq), sciNote = /\d\s*[x×*]\s*10\s*\^/.test(sq);
    if (!asksWord && !sciNote && oneVar && (
        /\b(?:quadratics?|polynomials?|trinomials?|binomials?|foil|discriminant|complet(?:e|ing)\s+the\s+square|synthetic\s+division|quadratic\s+formula)\b/.test(low) ||
        /\b(?:vertex|parabola|zeros|roots\s+of|axis\s+of\s+symmetry)\b/.test(low) && squared ||
        /\bfactor(?:i[sz]e|ing)?\b/.test(low) ||                                                            // factor 6x^2+7x-3 (letters: not a number to factor)
        /\([^()]*[a-z][^()]*\)\s*\(\s*[^()]*[a-z]/.test(sq) || /\([^()]*[a-z][^()]*[+−-][^()]*\)\s*\^\s*[2-9]/.test(sq) ||   // (x+3)(x-5), (2x-1)^2
        /\([^()]*[a-z]\s*\^\s*\d[^()]*\)\s*(?:\/|÷|[+−-])\s*\(/.test(sq) || /\bdivide\b[^=]*[a-z]\s*\^\s*\d[^=]*\bby\b/.test(sq) ||   // (x^3-8)/(x-2), (3x^2+1) - (x^2-4)
        squared && !/[<>≤≥;,]/.test(s) && !/(?:^|[^a-z])y(?![a-z])/.test(sq) && /[a-z\d)]\s*[+−-]\s*[\d(a-z]|=/.test(sq)))   // x^2-5x+6=0, x^2 = 49, 3x^2 + 2x
      return go("quadratics.html", qp(s), "a quadratic");
    // the early grades: place value, rounding, estimating, comparing, skip counting, telling time and money ("round 3,456 to the
    // nearest hundred", "45 minutes after 1:30", "3 quarters 2 dimes"); a story about them stays a story problem
    if (!asksWord && !story && /\d|\bo'?clock\b/.test(low) && !/%|\bpercent/.test(low) && (
        /\bround(?:ed|ing)?\b(?!\s+trip)|\bestimat(?:e|ing|ion)\b|\breasonable\b/.test(low) && !/\bprobab/.test(low) ||
        /\bplace\s+value\b|\bexpanded\s+form\b|\bin\s+words\b|\bvalue\s+of\s+(?:the\s+)?(?:digit\s+)?\d\s+in\b|\bwhich\s+digit\b|\b(?:ones|tens|hundreds|thousands|millions|tenths|hundredths|thousandths)\s+place\b|\b(?:1|10|100|1,?000)\s+(?:more|less)\s+than\b/.test(low) ||
        /\bskip\s*-?\s*count\w*|\bcount(?:ing)?\s+(?:back\s+)?by\b|\beven\s+or\s+odd\b|\bodd\s+or\s+even\b/.test(low) ||
        /\b\d{1,2}:\d{2}(?!\d)/.test(low) &&/\b(?:a\.?m\b\.?|p\.?m\b\.?|minutes?|hours?|time|clock|hands)|\d(?:am|pm)\b/.test(low) ||
        /\bo'?clock\b|\bquarter\s+(?:to|past|after)\s+\d|\bhalf\s+past\s+\d|\belapsed\s+time\b|\bfrom\s+\d{1,2}:\d{2}\s*(?:[ap]\.?m\.?)?\s+(?:to|until)\s+\d{1,2}:\d{2}/.test(low) ||
        /\b(?:quarters?|dimes?|nickels?|pennies|penny|coins?|cents?)\b|¢|\bchange\s+from\s+\$/.test(low) && !/\b(?:heads?|tails?|toss\w*|flip\w*|roll\w*|probability|chances?)\b/.test(low) ||
        /^\s*(?:compare|order)\b/.test(low) && !/\//.test(s) && !/[a-z]\s*[=<>]/.test(low)))
      return go("number-sense.html", qp(s), "number sense");
    // trigonometry: sin, cos and tan of an angle, degrees and radians, the unit circle, the laws of sines and cosines,
    // right triangles with SOH-CAH-TOA, angles of elevation, and identities ("sin 30", "cos 135°", "a=7 b=10 C=40")
    var noXY = !/(?:^|[^a-z])[xy](?![a-z])/.test(low);
    var trigLaw = /\blaws?\s+of\s+(?:sines?|cosines?)\b/.test(low), sohcah = /\bsoh\s*-?\s*cah\s*-?\s*toa\b/.test(low);
    var abcSet = (s.match(/\b[ABCabc]\s*=\s*\d/g) || []).length, abcLetters = (s.match(/\b[A-Za-z]\s*=/g) || []).length;
    if (trigLaw || sohcah || /\bunit\s+circle\b|\breference\s+angles?\b|\bcoterminal\b|\btrig(?:onometric)?\s+(?:identit|ratio|function)|\bpythagorean\s+identit/.test(low) ||
        /\bangles?\s+of\s+(?:elevation|depression)\b/.test(low) || /\bpoint\s+(?:at|for)\s+[−-]?\d+(?:\.\d+)?\s*°/.test(low) ||
        /\b(?:amplitude|midline|phase\s+shift)\b/.test(low) && /\b(?:sin|cos|sine|cosine)\b/.test(low) ||
        /\b(?:opposite|adjacent)\s+(?:side\s+)?(?:is\s+|of\s+|=\s*)?\d|\bfind\s+(?:the\s+)?(?:opposite|adjacent)\b/.test(low) ||
        /\bradians?\b/.test(low) && /\d|π|\bpi\b/.test(low) ||
        /(?:\d|π|\bpi\b)\s*(?:°|degrees?|deg)?\s+(?:to|in|into)\s+(?:radians?|degrees?)\b/.test(low) && /π|\bpi\b|radians?/.test(low) ||
        abcSet >= 3 && abcSet === abcLetters && /\b[ABC]\s*=\s*\d/.test(s) && /\b[abc]\s*=\s*\d/.test(s) ||
        noXY && /(?:^|[^a-z])(?:sin|cos|tan|csc|sec|cot|sine|cosine|tangent|secant|cosecant|cotangent)(?![a-z])\s*(?:of\s+|\(\s*)?[−-]?\s*(?:\d|π|\bpi\b|θ|theta)/.test(low) ||
        noXY && /\b(?:sin|cos|tan)\s*(?:,|and)\s*(?:cos|tan)\b.*\d/.test(low))
      return go("trigonometry.html", s.replace(/[^a-z]/gi, "") && !/\d/.test(s) ? "mode=" + (trigLaw ? "laws" : sohcah ? "right" : /unit\s+circle|reference|coterminal/.test(low) ? "circle" : /identit/.test(low) ? "identities" : "right") : qp(s), "trigonometry");
    // exponents: roots, scientific notation, one power on its own, and the exponent laws
    if (/\b(?:sqrt|square\s+root|cube\s+root)\b|[√∛]\s*\d/.test(low))
      return go("exponents.html", qp(s), "a root");
    if (/scientific\s+notation|\d(?:\.\d+)?\s*(?:x|×|\*)\s*10\s*(?:\^|\*\*)|^\s*[−-]?\d+(?:\.\d+)?e[+−-]?\d+\s*$/.test(low) ||
        (/standard\s+form/.test(low) && !/[a-z]\s*[=+]|=/.test(low.replace(/standard\s+form|to|in|write|as/g, ""))))
      return go("exponents.html", qp(s), "scientific notation");
    if (/^\s*(?:\(\s*[−-]?[\d.\/]+\s*\)|[−-]?[\d.]+)\s*(?:\^|\*\*)\s*\(?[−-]?\d+\)?\s*$/.test(s))
      return go("exponents.html", qp(s), "a power");
    var noNegExp = s.replace(/(\^|\*\*)\s*\(?[−-]/g, "$1");
    if (/[a-z]\s*(?:\^|\*\*)|\)\s*(?:\^|\*\*)/i.test(s) && /[a-z]/i.test(s) && !/[+=<>]|[−-]/.test(noNegExp) && !/\b(?:simplify|solve)\b.*[+=]/i.test(s))
      return go("exponents.html", qp(s.replace(/^\s*simplify\s*:?\s*/i, "")), "the exponent laws");
    // graphing: points on a grid, moving shapes, scatter plots, tables, curves, two lines to graph, shaded inequalities
    var PT = /\(\s*[−-]?\d+(?:\.\d+)?\s*,\s*[−-]?\d+(?:\.\d+)?\s*\)/;
    if (/\b(?:scatter|trend\s+line|line\s+of\s+best\s+fit)\b/.test(low) ||
        (PT.test(s) && /\b(?:plot|distance|midpoint|area|perimeter|quadrant|reflect|reflection|rotate|rotation|translate|translation|dilate|dilation|transform)\b/.test(low)) ||
        /^\s*table\b.*=/.test(low))
      return go("graphing.html", qp(s), "graphing");
    var eqCount = (s.match(/=/g) || []).length, ineqCount = (s.match(/[<>≤≥]/g) || []).length;
    if ((/y/i.test(s) && /x/i.test(s) && ineqCount >= 1 && !/[;,]|\band\b/i.test(s)) ||                                  // y < 2x + 1: shade it
        ineqCount >= 2 && !/y/i.test(s) ||                                                                               // −2 < x ≤ 3: a number line
        (/^\s*y\s*=/.test(low) && eqCount === 1 && /x\s*(?:\^|\*\*|²|³)|\|[^|]*x[^|]*\||\bsqrt|√|\d\s*(?:\^|\*\*)\s*x|\/\s*\(?\s*x/.test(low)) ||   // curves
        (/\bgraph\b/.test(low) && (eqCount >= 2 || /x\s*(?:\^|\*\*|²)/.test(low))))
      return go("graphing.html", qp(s.replace(/^\s*graph\s*:?\s*/i, "")), "graphing");
    // probability: "P(rolling a 4)", "probability of red from 3 red 5 blue", "two coins both heads", "roll a die 60 times"
    if (!(/^\s*(?:what\s+(?:is|are|does)|define|definition|meaning)\b/i.test(s) && !/\d/.test(s)) &&     // "what is likely": the Word List
        /\bprobability\b|\bchances?\b|\bodds\b|\bp\s*\(|\b(?:un)?likely\b|without replacement|\bspinner\b|\b(?:roll|rolls|rolling|toss|tosses|flip|flips|flipping)\b[^.?]*\b(?:die|dice|coins?)\b|\b(?:two|2|three|3)\s+coins\b|\bdeck\b|\b(?:pick|picks|draw|draws|drawn)\b[^.?]*\bmarbles?\b/.test(low))
      return go("probability.html", qp(s), "probability");
    // a story problem, unless it's about shapes (other than a rectangle's area), statistics, a ratio or a line
    var algebraAngles = /\bangles?\b/.test(low) && /\b(?:twice|times|more than|less than)\s+(?:as\s+\w+\s+as\s+)?(?:the\s+)?(?:first|second|smallest)\b/.test(low);
    if (isStory(s, low) && (algebraAngles || !/\b(circles?|triangles?|trapezoids?|parallelograms?|cylinders?|cones?|spheres?|prisms?|pyramids?|hypotenuse|angles?|polygons?|radius|diameter|circumference|volume|surface|mean|median|modes?|average|range|box ?plots?|quartiles?|outliers?|ratios?|proportion|scale|slope|intercepts?|graph)\b/.test(low)))
      return go("wordproblems.html", qp(s), "a story problem",
        /%|percent/.test(low) ? { page:"percents.html", params:qp(s) } : /\barea\b/.test(low) ? { page:"geometry.html", params:qp(s) } : null);
    // "7 times 8", "12 divided by 4": the words for the signs
    if (/^[\d\s.,\/]+(\s*\b(times|plus|minus|divided by)\b\s*[\d\s.,\/]+)+$/.test(low))
      s = low = low.replace(/\s*\btimes\b\s*/g, " × ").replace(/\s*\bplus\b\s*/g, " + ").replace(/\s*\bminus\b\s*/g, " − ").replace(/\s*\bdivided by\b\s*/g, " ÷ ").trim();

    if (/\b(area|perimeter|circumference|volume|surface|circle|rectangle|square|triangle|trapezoid|trapezium|parallelogram|cylinder|cone|sphere|cube|box(?!\s*-?\s*(?:plots?|and))|prism|pyramid|hypotenuse|legs?|angles?|supplement\w*|complement\w*|polygon|pentagon|hexagon|heptagon|octagon|nonagon|decagon|sided|radius|diameter|vertical)\b/.test(low))
      return go("geometry.html", qp(s));
    // "what is a denominator", "define slope", "meaning of median": the Word List
    var defn = /^\s*(?:what\s+(?:is|are|does)\s+(?:an?\s+|the\s+)?|define\s+|definition\s+of\s+|meaning\s+of\s+|what\s+does\s+)(.+?)(?:\s+mean)?\s*\??\s*$/i.exec(s);
    if (defn && !/\d/.test(defn[1])) return go("glossary.html", qp(defn[1]), "what “" + defn[1] + "” means");
    // statistics words
    if (/\b(mean|median|modes?|average|averages|range|box ?plots?|box-and-whisker|quartiles?|iqr|mad|deviation|frequency|outliers?)\b/.test(low))
      return go("stats.html", qp(s), "statistics");
    // lines: slope words, or two points like (1, 2) and (5, 4)
    if (/\b(slope|intercepts?|parallel|perpendicular|graph|point-slope|slope-intercept|standard form)\b/.test(low) ||
        /\(\s*[−-]?\d+(\.\d+)?\s*,\s*[−-]?\d+(\.\d+)?\s*\)[^()]*\(\s*[−-]?\d+(\.\d+)?\s*,\s*[−-]?\d+(\.\d+)?\s*\)/.test(s))
      return go("lines.html", qp(s), "a line");
    // ratios: a:b, rates, sharing, scale drawings (percent problems go to the Hundred Grid instead)
    if (!/%|percent/.test(low) && (/\d\s*:\s*\d/.test(s) || /\bfor\s+\$?\d/.test(low) ||
        /\b(ratios?|unit rate|rate|per|better buy|best buy|share|shared|split|scale|proportion|recipe|batch(es)?)\b/.test(low)))
      return go("ratios.html", qp(s), "ratios");
    // a proportion with one letter in it: 3/4 = x/20
    if (/^\s*[\d.a-z]+\s*\/\s*[\d.a-z]+\s*=\s*[\d.a-z]+\s*\/\s*[\d.a-z]+\s*$/i.test(s) && (s.match(/[a-z]/gi) || []).length === 1)
      return go("ratios.html", "mode=prop&" + qp(s), "a proportion");
    // one equation in x and y is a line to graph (two equations are a system, below)
    if ((s.match(/=/g) || []).length === 1 && /x/i.test(s) && /y/i.test(s) && !/[;,]|\band\b/i.test(s) && !/[a-wz]/i.test(s))
      return go("lines.html", qp(s), "a line");
    // a plain list of three or more numbers
    var listParts = s.split(/\s*,\s*|\s+/).filter(Boolean);
    if (!/[\/a-z%=<>+×*÷^()]/i.test(s) && listParts.length >= 3 && listParts.every(function(x){ return /^[−-]?\d*\.?\d+$/.test(x); })){
      var ints = listParts.every(function(x){ return /^[−-]?\d+$/.test(x); });
      return go("stats.html", qp(s), "a list of numbers",
        ints && listParts.length <= 8 ? { page:"integers.html", params:"mode=abs&" + qp(listParts.join(",")) } : null);
    }
    if (!/\d/.test(s)) return go("glossary.html", qp(s.replace(/\?+$/, "")), "what “" + s.replace(/\?+$/, "") + "” means");
    if (/\b(gcf|gcd|hcf|lcm|factors?|prime|primes|factori[sz]ation|factori[sz]e|divisib\w*|multiples?|composite)\b/.test(low))
      return go("factors.html", qp(s));
    if (/%|\bpercent|\bdiscount|\boff\b|\btax\b|\btip\b|\bmarkup\b|\binterest\b|\bout of\b/.test(low))
      return go("percents.html", qp(s));

    // letters left once "x" between two numbers is read as times → algebra
    var bare = low.replace(/\b(simplify|solve|for|expand|and)\b/g, " ")
                  .replace(/(\d|\))\s*x\s*(?=[\d(.])/g, "$1×");
    if (/[a-z]/.test(bare) || /[=<>≤≥]/.test(s)){
      if (/\b(simplify|reduce|convert|compare|order|equivalent)\b/.test(low) && !/[a-z]/.test(bare.replace(/\b(reduce|convert|compare|order|equivalent|to|as|a|decimal|percent|fraction|mixed|improper)\b/g, ""))
          && !/=/.test(s.replace(/\?/g, ""))) {
        // "simplify 18/24", "convert 7/4 to a decimal": fractions, not algebra
      } else {
        var eqs = s.replace(/^\s*(solve|simplify)\s*:?\s*/i, "");
        if ((eqs.match(/=/g) || []).length >= 2 && /[;,]|\band\b/i.test(eqs)){
          var parts = eqs.split(/\s*(?:;|,|\band\b)\s*/i).filter(function(x){ return /=/.test(x); });
          if (parts.length === 2) return go("algebra.html", "mode=sys&" + qp(parts.join(";")), "a system of two equations");
        }
        if (/[<>≤≥]/.test(eqs)) return go("algebra.html", "mode=ineq&" + qp(eqs), "an inequality");
        if (/=/.test(eqs) && !/\?/.test(eqs)) return go("algebra.html", "mode=solve&" + qp(eqs), "an equation");
        if (!/=/.test(eqs)) return go("algebra.html", "mode=simplify&" + qp(eqs), "an expression to simplify");
      }
    }

    // fractions: one fraction on its own, a list to compare, a missing number, or a conversion
    var fw = /\b(simplify|reduce)\b/.test(low) ? "simplify" : /\b(convert|decimal|percent|improper|mixed)\b/.test(low) ? "convert"
           : /\b(compare|order)\b/.test(low) ? "compare" : /\bequivalent\b/.test(low) ? "equiv" : "";
    var core = s.replace(/^\s*(simplify|reduce|convert|compare|order|equivalent)\s*:?\s*/i, "")
                .replace(/\s+(to|as|into)\s+(an?\s+)?(decimal|percent|fraction|mixed number|improper fraction)s?\s*$/i, "");
    if (/=\s*\?|\?\s*\/|\/\s*\?/.test(core)) return go("fractions.html", "mode=equiv&" + qp(core.replace(/\s+/g, "")), "equivalent fractions");
    if (/,/.test(core) && core.split(",").every(function(x){ return /^\s*(\d+\s+)?\d+\/\d+\s*$|^\s*\d*\.\d+\s*$/.test(x); }))
      return go("fractions.html", "mode=compare&" + qp(core.replace(/\s*,\s*/g, ",")), "fractions to compare");
    if (/^\d*\.\d*\(\d+\)$/.test(core)) return go("fractions.html", "mode=convert&" + qp(core), "a repeating decimal");
    if (fw && /^\s*(\d+\s+)?\d+\/\d+\s*$|^\s*\d*\.\d+\s*$/.test(core)) return go("fractions.html", "mode=" + fw + "&" + qp(core.trim()));

    var tk = tokens(s);
    if (!tk) return go("pemdas.html", qp(s));
    var nums = tk.filter(function(t){ return t.t === "n"; });
    // a lone fraction: simplify it, or divide if the top is the bigger number
    if (tk.length === 1 && nums.length === 1){
      if (nums[0].frac){
        var ab = nums[0].s.split("/");
        if (!/ /.test(nums[0].s) && Number(ab[0]) >= Number(ab[1]))
          return go("division.html", qp(ab[0] + "÷" + ab[1]), "", { page:"fractions.html", params:"mode=simplify&" + qp(nums[0].s) });
        return go("fractions.html", "mode=simplify&" + qp(nums[0].s), "a fraction to simplify");
      }
      return go("factors.html", qp(nums[0].s.replace(/,/g, "")), "a number to factor");
    }
    // which signs are operations, and which make a number negative
    var ops = [], negs = 0, prev = null, other = false;
    tk.forEach(function(t){
      if (t.t === "o"){
        var isMinus = "-−–".indexOf(t.s) >= 0;
        if (isMinus && (!prev || (prev.t === "o" && prev.s !== ")" && prev.s !== "²" && prev.s !== "³"))) negs++;
        else if ("()^²³|".indexOf(t.s) >= 0) other = true;
        else ops.push(isMinus ? "−" : t.s === "*" || t.s === "x" ? "×" : t.s === ":" ? "÷" : t.s);
      }
      prev = t;
    });
    var anyFrac = nums.some(function(t){ return t.frac; }), anyDec = nums.some(function(t){ return t.dec; });
    var ints = !anyFrac && !anyDec;
    if (/\|/.test(s) && ints) return go("integers.html", qp(s), "absolute value");
    if (negs && ints && ops.length >= 1 && (ops.length === 1 || ops.every(function(o){ return o === "+" || o === "−"; })) && !/\^|²|³/.test(s))
      return go("integers.html", qp(s), "negative numbers");
    if (other || negs || ops.length === 0 || ops.length > 1 && !ops.every(function(o){ return o === "+"; }))
      return go("pemdas.html", qp(s), "the order of operations");
    if (ops[0] === "+" && nums.length > (anyFrac ? 2 : 4)) return go("pemdas.html", qp(s), "the order of operations");
    var a = nums.map(function(t){ return t.s.replace(/,/g, ""); });
    if (ops[0] === "+") return go("addition.html", qp(a.join("+")));
    if (ops[0] === "−") return go("subtraction.html", qp(a.join("-")));
    if (ops[0] === "×") return go("multiplication.html", qp(a.join("*")));
    if (ops[0] === "÷") return go("division.html", qp(a.join("÷")));
    return go("pemdas.html", qp(s));
  }

  // the full address to open: site.js knows which folder each page is in (r.page stays the bare file name)
  function href(r){
    if (!r || r.none) return null;
    return window.HelperSite ? window.HelperSite.url(r.page, r.params) : r.page + (r.params ? (/^#/.test(r.params) ? "" : "?") + r.params : "");
  }
  window.HelperSearch = { route:route, PAGE:PAGE, href:href };
})();
