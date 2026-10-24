"""Lay out the site's code the usual way: every .js file, and every <script> and <style> block in the .html pages, through
a standard formatter (one statement per line, 2-space indent; CSS one property per line). The HTML markup around them is
left as it is. Run it after editing, or let the page builders call it:

    python scripts/format.py              format the whole site (the folder this script is in, one up)
    python scripts/format.py FILE ...     just those files
    python scripts/format.py --check      say which files aren't formatted yet; change nothing

It needs the formatter: pip install jsbeautifier cssbeautifier"""
import io, os, re, sys, glob, textwrap
import jsbeautifier, cssbeautifier

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKIP = ("docs/", ".git/", ".github/", "scripts/")

JS = jsbeautifier.default_options()
JS.indent_size = 2
JS.brace_style = "collapse,preserve-inline"     # { a:1, b:2 } and one-line functions stay on one line
JS.preserve_newlines = True
JS.max_preserve_newlines = 2
JS.space_in_empty_paren = False
JS.end_with_newline = False
JS.wrap_line_length = 0                          # long regular expressions and strings stay whole
CSS = cssbeautifier.default_options()
CSS.indent_size = 2
CSS.newline_between_rules = False

BLOCK = re.compile(r"(<(script|style)\b([^>]*)>)(.*?)(</\2>)", re.S | re.I)

def indent_of(s, i):
    j = s.rfind("\n", 0, i) + 1
    return re.match(r"[ \t]*", s[j:i]).group(0)

def pretty_js(code):
    # a block kept on one line but holding several statements comes out half split ("{ a = 1;\n b = 2; }");
    # the next pass lays it out fully, so go round until nothing changes
    for _ in range(6):
        out = jsbeautifier.beautify(code, JS)
        if out == code: break
        code = out
    return out

def pretty_css(code):
    return cssbeautifier.beautify(code, CSS)

def block(kind, attrs, body, pad):
    """a script or style block's new body, indented under its tag; None to leave it"""
    if not body.strip() or (kind == "script" and re.search(r"type\s*=\s*[\"']?application/(?:ld\+)?json", attrs, re.I)): return None
    # take off the block's own indent first: the lines inside a /* … */ comment are kept as they are, so they would
    # otherwise move further right every time
    body = textwrap.dedent(body)
    out = pretty_js(body) if kind == "script" else pretty_css(body)
    inner = pad + "  "
    return "\n" + "\n".join((inner + x) if x.strip() else "" for x in out.strip("\n").split("\n")) + "\n" + pad

def format_text(path, s):
    if path.endswith(".js"):
        return pretty_js(s).rstrip("\n") + "\n"
    out, last = [], 0
    for m in BLOCK.finditer(s):
        new = block(m.group(2).lower(), m.group(3), m.group(4), indent_of(s, m.start()))
        if new is None: continue
        out.append(s[last:m.start(4)]); out.append(new); last = m.end(4)
    out.append(s[last:])
    return "".join(out)

def files(args):
    if args: return [os.path.abspath(a) for a in args]
    found = []
    for f in glob.glob(os.path.join(ROOT, "**", "*"), recursive=True):
        rel = os.path.relpath(f, ROOT).replace("\\", "/")
        if os.path.isfile(f) and rel.endswith((".html", ".js")) and not rel.startswith(SKIP): found.append(f)
    return sorted(found)

def main(argv):
    check = "--check" in argv
    todo, changed = files([a for a in argv if a != "--check"]), []
    for f in todo:
        raw = io.open(f, "rb").read().decode("utf-8")
        nl = "\r\n" if "\r\n" in raw else "\n"
        s = raw.replace("\r\n", "\n")
        new = format_text(f, s)
        if new != s:
            changed.append(os.path.relpath(f, ROOT))
            if not check: io.open(f, "w", encoding="utf-8", newline="").write(new.replace("\n", nl))
    print(("not formatted: " if check else "formatted: ") + str(len(changed)) + " of " + str(len(todo)) + " files")
    for c in changed[:50]: print("  " + c)
    return 1 if check and changed else 0

if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
