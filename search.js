/* Works out which helper a typed problem belongs to ("47 + 38" → The Carry Column, "15% of 80" → The Hundred Grid,
   "what is a denominator" → the Word List) and builds the link that opens it there. Used by the home page's
   "Type any problem" box and by the search box in the bar across the top of every page.
   HelperSearch.route(text) → { page, params, what, alt } (or { none:true }); HelperSearch.PAGE[file] → [name, colour class] */
(function(){
  "use strict";
  var PAGE = {
    "addition.html":["The Carry Column","c-add"], "subtraction.html":["The Borrow Bank","c-sub"],
    "multiplication.html":["The Product Ladder","c-mul"], "division.html":["The Division House","c-div"],
    "fractions.html":["The Fraction Bar","c-fra"], "percents.html":["The Hundred Grid","c-pct"],
    "factors.html":["The Factor Tree","c-fac"], "integers.html":["The Number Line","c-int"],
    "pemdas.html":["The Order Stack","c-ord"], "algebra.html":["The Balance Scale","c-alg"],
    "geometry.html":["The Shape Shop","c-geo"], "glossary.html":["the Word List","c-ink"], "ratios.html":["The Ratio Table","c-rat"],
    "lines.html":["The Slope Grid","c-lin"], "stats.html":["The Dot Plot","c-sta"],
    "wordproblems.html":["The Story Problem","c-wrd"], "flashcards.html":["The Flash Cards","c-fla"],
    "reference.html":["the reference sheets","c-ink"]
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
      var tables = span && +span[1] <= 12 && +span[2] <= 12 && +span[1] < +span[2] ? span[1] + "-" + span[2]
                 : (low.match(/\d+/g) || []).filter(function(n){ return +n <= 12; }).map(Number).join(",");
      return go("flashcards.html", "deck=" + deck + (tables && (deck === "times" || deck === "div") ? "&t=" + tables : ""), "flash cards");
    }
    // reference sheets: "formula sheet", "cheat sheet", "multiplication chart"
    if (/\b(reference|cheat ?sheets?|formula sheets?|formulas|(?:multiplication|times table) (?:chart|grid))\b/.test(low))
      return go("reference.html", /multiplication|times/.test(low) ? "#times" : /\b(area|perimeter|volume|geometry|shapes?)\b/.test(low) ? "#geometry" : "",
        "the reference sheets");
    // a story problem, unless it's about shapes (other than a rectangle's area), statistics, a ratio or a line
    if (isStory(s, low) && !/\b(circles?|triangles?|trapezoids?|parallelograms?|cylinders?|cones?|spheres?|prisms?|pyramids?|hypotenuse|angles?|polygons?|radius|diameter|circumference|volume|surface|mean|median|modes?|average|range|box ?plots?|quartiles?|outliers?|ratios?|proportion|scale|slope|intercepts?|graph)\b/.test(low))
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

  window.HelperSearch = { route:route, PAGE:PAGE, href:function(r){ return r && !r.none ? r.page + "?" + r.params : null; } };
})();
