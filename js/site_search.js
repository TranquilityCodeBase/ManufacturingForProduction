/* =====================================================================
   Site search box in the top bar.
   Searches page titles, section headings, "At a glance" rules, table
   rows, glossary terms, thread sizes and calculators from the static
   index in js/data/search_index.js (rebuild with
   node tools/build_search_index.js after content changes).
   Keys: / focuses the box, Up / Down move, Enter opens, Escape closes.
   ===================================================================== */

(function () {
  "use strict";

  const maxResults = 12;
  // Kind order breaks ties between equally good matches
  const kindWeight = { Page: 9, Calculator: 8, Section: 7, Thread: 6, "Tap drill": 6, Term: 5, Rule: 4, Topic: 3, Table: 2 };

  function normalize(text) {
    // Same normalization the table filters use: "#10-32" = "10-32" = "10x32"
    return window.DFM && window.DFM.normalizeTerm ? window.DFM.normalizeTerm(text) : String(text).toLowerCase();
  }

  function escapeText(text) {
    return String(text).replace(/[&<>"]/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[ch];
    });
  }

  // Score one index entry against the query words (0 = no match)
  function score(entry, words, normQuery, looksLikeSize) {
    const title = entry[0].toLowerCase();
    const haystack = (entry[0] + " " + entry[1] + " " + entry[4]).toLowerCase();
    const allFound = words.every(function (w) {
      return haystack.indexOf(w) !== -1;
    });
    // Size-style queries also match normalized titles (10x32 -> #10-32)
    const sizeHit = looksLikeSize && normalize(entry[0]).indexOf(normQuery) === 0;
    if (!allFound && !sizeHit) {
      return 0;
    }
    let points = kindWeight[entry[3]] || 1;
    const query = words.join(" ");
    if (title === query || sizeHit && normalize(entry[0]) === normQuery) {
      points += 100;                             // exact title
    } else if (title.indexOf(query) === 0 || sizeHit) {
      points += 60;                              // title starts with the query
    } else if (title.indexOf(query) !== -1) {
      points += 40;                              // title contains the query
    } else if (words.every(function (w) {
      return title.indexOf(w) !== -1;
    })) {
      points += 25;                              // every word somewhere in the title
    }
    if (looksLikeSize && (entry[3] === "Thread" || entry[3] === "Tap drill")) {
      points += 30;                              // size searches favor thread data
    } else if (looksLikeSize && entry[3] === "Table") {
      points -= 50;                              // ...over table rows that only mention the size
    }
    return points;
  }

  function search(query) {
    const index = window.DFM_SEARCH_INDEX || [];
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      return [];
    }
    const normQuery = normalize(query);
    const looksLikeSize = /^(m?\d|#)/i.test(query.trim());
    return index.map(function (entry) {
      return { entry: entry, points: score(entry, words, normQuery, looksLikeSize) };
    }).filter(function (r) {
      return r.points > 0;
    }).sort(function (a, b) {
      return b.points - a.points || a.entry[0].length - b.entry[0].length;
    }).slice(0, maxResults);
  }

  function build() {
    const slot = document.getElementById("topbar-search");
    if (!slot) {
      return;
    }
    const rootPrefix = document.body.dataset.root || "";
    slot.innerHTML =
      '<button type="button" class="icon-btn search-toggle" aria-label="Search">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/>' +
      '<path d="M15.5 15.5L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>' +
      '<div class="site-search">' +
      '<input class="site-search-input" type="search" placeholder="Search pages, threads, terms...  ( / )" autocomplete="off" spellcheck="false"' +
      ' role="combobox" aria-label="Search the site" aria-expanded="false" aria-controls="search-results" aria-autocomplete="list">' +
      '<ul class="search-results" id="search-results" role="listbox" hidden></ul></div>';

    const input = slot.querySelector(".site-search-input");
    const list = slot.querySelector(".search-results");
    const toggle = slot.querySelector(".search-toggle");
    let results = [];
    let active = -1;

    function close() {
      list.hidden = true;
      input.setAttribute("aria-expanded", "false");
      active = -1;
    }

    function highlight(i) {
      active = i;
      list.querySelectorAll("li").forEach(function (li, n) {
        li.classList.toggle("active", n === active);
        li.setAttribute("aria-selected", n === active ? "true" : "false");
        if (n === active) {
          li.scrollIntoView({ block: "nearest" });
        }
      });
    }

    function render() {
      const query = input.value.trim();
      results = search(query);
      if (query === "") {
        close();
        return;
      }
      list.innerHTML = results.length ? results.map(function (r, i) {
        const e = r.entry;
        return '<li role="option" id="search-opt-' + i + '"><a href="' + rootPrefix + e[2] + '">' +
          '<span class="search-kind">' + escapeText(e[3]) + "</span>" +
          '<span class="search-title">' + escapeText(e[0]) + "</span>" +
          (e[1] ? '<span class="search-context">' + escapeText(e[1]) + "</span>" : "") + "</a></li>";
      }).join("") : '<li class="search-empty">No results. Try a size (1/4-20, M6), a term (helicoil, bullnose) or a topic.</li>';
      list.hidden = false;
      input.setAttribute("aria-expanded", "true");
      highlight(results.length ? 0 : -1);
    }

    input.addEventListener("input", render);
    input.addEventListener("focus", function () {
      if (input.value.trim()) {
        render();
      }
    });
    input.addEventListener("keydown", function (event) {
      if (event.key === "ArrowDown" && results.length) {
        event.preventDefault();
        highlight((active + 1) % results.length);
      } else if (event.key === "ArrowUp" && results.length) {
        event.preventDefault();
        highlight((active - 1 + results.length) % results.length);
      } else if (event.key === "Enter" && active >= 0) {
        event.preventDefault();
        window.location.href = list.querySelectorAll("li a")[active].href;
      } else if (event.key === "Escape") {
        if (input.value) {
          input.value = "";
          close();
        } else {
          input.blur();
          slot.classList.remove("open");
        }
      }
    });

    // Close when focus leaves the search area
    slot.addEventListener("focusout", function () {
      setTimeout(function () {
        if (!slot.contains(document.activeElement)) {
          close();
          slot.classList.remove("open");
        }
      }, 150);
    });

    // Phones: the magnifier opens the search field over the top bar
    toggle.addEventListener("click", function () {
      slot.classList.add("open");
      input.focus();
    });
  }

  document.addEventListener("DOMContentLoaded", build);
})();
