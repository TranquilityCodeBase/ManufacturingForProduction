/* =====================================================================
   Builds js/data/search_index.js for the site search box.
   Run after changing page content or data files:
       node tools/build_search_index.js
   It reads every page (titles, section headings, "At a glance" items,
   glossary terms, first column of static tables) plus the thread and
   tap drill data, and writes one small static file. No server needed.
   Entry format: [title, context, url (from site root), kind, extra keywords]
   ===================================================================== */

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const entries = [];
const seen = new Set();                         // avoid duplicate entries

// ---------- Helpers ----------
const namedEntities = {
  amp: "&", lt: "<", gt: ">", quot: "\"", apos: "'", nbsp: " ", plusmn: "±", deg: "°",
  ge: "≥", le: "≤", micro: "µ", times: "×", rarr: "→", larr: "←", ndash: "–", mdash: "—",
  sup2: "²", sup3: "³", frac12: "½", frac14: "¼", frac34: "¾", asymp: "≈", middot: "·", prime: "′", Prime: "″"
};

function plain(htmlText) {
  // Strip tags and decode entities, collapse whitespace
  return htmlText
    .replace(/<[^>]+>/g, " ")
    .replace(/&#(\d+);/g, (m, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (m, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&([a-z0-9]+);/gi, (m, n) => (n in namedEntities ? namedEntities[n] : m))
    .replace(/\s+/g, " ")
    .trim();
}

function add(title, context, url, kind, keywords) {
  const key = kind + "|" + title + "|" + url;
  if (!title || seen.has(key)) {
    return;
  }
  seen.add(key);
  entries.push([title, context || "", url, kind, keywords || ""]);
}

// ---------- Pages ----------
const files = ["index.html"].concat(
  fs.readdirSync(path.join(root, "pages")).filter((f) => f.endsWith(".html")).sort().map((f) => "pages/" + f)
);

files.forEach((file) => {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  const pageTitle = plain((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || (html.match(/<title>(.*?)<\/title>/) || [])[1] || file);
  const description = plain((html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || "");
  const main = (html.match(/<main[\s\S]*?<\/main>/) || [html])[0];

  add(pageTitle, description, file, "Page");

  // Walk headings in order so table rows can link to the nearest section
  let currentId = "";
  let currentHeading = pageTitle;
  const tokenRe = /<h([23])([^>]*)>([\s\S]*?)<\/h\1>|<li><a href="(#[^"]+|[^"#]*\.html#[^"]+)"><span class="value">([\s\S]*?)<\/span><span class="label">([\s\S]*?)<\/span><\/a><\/li>|<tr>\s*<td[^>]*>([\s\S]*?)<\/td>([\s\S]*?)<\/tr>|<(dt|h3|div|p)[^>]*id="(term-[^"]+)"[^>]*>([\s\S]*?)<\/\9>/g;
  let m;
  while ((m = tokenRe.exec(main)) !== null) {
    if (m[1]) {
      // Section heading (h2 / h3)
      const idMatch = m[2].match(/id="([^"]+)"/);
      const text = plain(m[3]);
      if (m[1] === "2") {
        currentId = idMatch ? idMatch[1] : currentId;
        currentHeading = text;
      }
      const target = idMatch ? idMatch[1] : currentId;
      if (target && !file.endsWith("glossary.html")) {
        add(text, pageTitle, file + "#" + target, m[1] === "2" ? "Section" : "Topic");
      }
    } else if (m[4]) {
      // "At a glance" item
      const href = m[4].startsWith("#") ? file + m[4] : "pages/" + m[4].replace(/^\.\.\//, "");
      add(plain(m[5]) + " - " + plain(m[6]), pageTitle, href, "Rule");
    } else if (m[7] !== undefined) {
      // Static table row: first cell is the title, the rest are keywords
      const first = plain(m[7]);
      if (first && first.length <= 60 && currentId) {
        add(first, pageTitle + " · " + currentHeading, file + "#" + currentId, "Table", plain(m[8]).slice(0, 160));
      }
    } else if (m[10]) {
      // Glossary term
      add(plain(m[11]).replace(/:$/, ""), "Glossary", file + "#" + m[10], "Term");
    }
  }
});

// ---------- Glossary definitions (dd after dt) as keywords ----------
// (definitions are already reachable through the term entries above)

// ---------- Thread and tap drill data ----------
global.window = {};
require(path.join(root, "js/data/thread_data.js"));
require(path.join(root, "js/data/tap_drill_data.js"));
const threads = global.window.DFM_THREADS;
const taps = global.window.DFM_TAP_DRILLS;
const groupNames = { standard: "Standard threaded hole", coil: "Coil insert hole", key: "Key insert hole", od: "OD thread (turned)" };

threads.tables.forEach((table) => {
  table.rows.forEach((row) => {
    const size = String(row[0]).replace(/\s*\*$/, "").trim();
    const series = table.title.split(" - ")[0];
    add(size, groupNames[table.group] + " · " + series + " · pilot " + row[2] + " " + table.unit, "pages/thread_tables.html?q=" + encodeURIComponent(size) + "#thread-lookup", "Thread", series);
  });
});
threads.npt.rows.forEach((row) => {
  add(row[0] + " NPT", "Pipe thread · pilot " + row[3] + " in", "pages/thread_tables.html#npt-threads", "Thread", "npt pipe");
});
taps.inch.forEach((r) => {
  add(r[0] + "-" + r[2], r[3] + " · tap drill " + r[5] + " (" + r[6] + " in) · free fit " + r[11], "pages/tap_drill_charts.html#inch", "Tap drill", r[3]);
});
taps.metric.forEach((r) => {
  add(r[0] + " x " + r[1], r[2] + " · tap drill " + r[3] + " mm · normal fit " + r[9] + " mm", "pages/tap_drill_charts.html#metric", "Tap drill", "metric");
});

// ---------- Calculators (cards are built by JavaScript, so list them here) ----------
[
  ["Inside corner & pocket radius picker", "#corner-picker", "corner radius floor fillet bullnose cutter pocket"],
  ["Length converter", "#conversions", "inch mm metric"],
  ["Speed / feed rate converter", "#conversions", "ipm mm/s sfm smm feed"],
  ["Mass / weight converter", "#conversions", "lb kg grams oz"],
  ["Force, torque, pressure, volume, temperature", "#conversions", "lbf newton psi mpa"],
  ["Part mass from CAD volume", "#mass-drill", "weight density"],
  ["Fraction, decimal & nearest drill", "#mass-drill", "drill size fraction decimal"],
  ["Percent thread from drill", "#threads-holes", "thread engagement tap drill"],
  ["Countersink & drill point", "#threads-holes", "countersink chamfer drill point depth"],
  ["Scratch pad", "#scratch-pad", "notes"]
].forEach((c) => add(c[0], "Calculators", "pages/calculators.html" + c[1], "Calculator", c[2]));

// ---------- Write ----------
const out = "/* Generated by tools/build_search_index.js on " + new Date().toISOString().slice(0, 10) +
  ". Do not edit by hand. */\nwindow.DFM_SEARCH_INDEX = " + JSON.stringify(entries) + ";\n";
fs.writeFileSync(path.join(root, "js/data/search_index.js"), out);
console.log("search index:", entries.length, "entries,", Math.round(out.length / 1024), "KB");
