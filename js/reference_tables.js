/* =====================================================================
   Renders the reference tables from the data files so numbers live in
   one place (js/data/*.js) and every page shows the same values.

   Placeholders this script fills:
     <div data-thread-lookup></div>                        "Find a thread" box (all tables at once)
     <div data-thread-group="standard|coil|key|od"></div>  tabbed UNC / UNF / Metric tables
     <div data-npt-table></div>                            NPT pipe thread table
     <div data-tap-inch></div>                             inch tap & clearance drills
     <div data-tap-metric></div>                           metric tap & clearance drills
     <div data-drill-sizes></div>                          number & letter drill decimals
   ===================================================================== */

(function () {
  "use strict";

  // Folder of this script, used to load tap_drill_data.js when a page needs it
  const scriptBase = document.currentScript ? document.currentScript.src.replace(/[^/]*$/, "") : "";

  // ---------- Formatting ----------
  function fmt(value, unit, places) {
    // Inch values default to 3 places, metric to 2
    const digits = places !== undefined ? places : (unit === "in" ? 3 : 2);
    return Number(value).toFixed(digits);
  }

  function escapeHtml(text) {
    return String(text).replace(/[&<>"]/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[ch];
    });
  }

  // headers: [{ text, num, cls }] ; rows: arrays of cell strings
  function tableHtml(id, headers, rows, tableClass) {
    const head = headers.map(function (h) {
      const cls = [h.num ? "num" : "", h.cls || ""].join(" ").trim();
      return "<th" + (cls ? ' class="' + cls + '"' : "") + (h.hidden ? " hidden" : "") + ">" + h.text + "</th>";
    }).join("");
    const body = rows.map(function (row) {
      return "<tr>" + row.map(function (cell, i) {
        const h = headers[i] || {};
        const cls = [h.num ? "num" : "", h.cls || ""].join(" ").trim();
        return "<td" + (cls ? ' class="' + cls + '"' : "") + (h.hidden ? " hidden" : "") + ">" + cell + "</td>";
      }).join("") + "</tr>";
    }).join("");
    return '<div class="table-wrap"><table id="' + id + '"' + (tableClass ? ' class="' + tableClass + '"' : "") + "><thead><tr>" +
      head + "</tr></thead><tbody>" + body + "</tbody></table></div>";
  }

  // Thread name for display: "M1.6 x 0.35 *" -> name + "soft metals only" badge
  function threadLabel(name) {
    if (/\*\s*$/.test(name)) {
      return "<strong>" + escapeHtml(name.replace(/\s*\*\s*$/, "")) + '</strong> <span class="badge warn">soft metals only</span>';
    }
    return "<strong>" + escapeHtml(name) + "</strong>";
  }

  // ---------- Thread name parsing (shared by the lookup and the filters) ----------
  // Returns { system: "unified", size: "1/4", tpi: 20 } or { system: "metric", dia: 6, pitch: 1 }
  // (tpi / pitch null when only the size was typed), or null if it is not a thread.
  function mixedToNumber(text) {
    // "11 1/2" -> 11.5, "20" -> 20
    const parts = text.trim().split(/\s+/);
    let total = 0;
    parts.forEach(function (part) {
      const frac = part.match(/^(\d+)\/(\d+)$/);
      total += frac ? parseInt(frac[1], 10) / parseInt(frac[2], 10) : parseFloat(part);
    });
    return total;
  }

  function parseThread(text) {
    let clean = String(text).toLowerCase()
      .replace(/\(.*?\)/g, " ")                       // "(fine)" notes
      .replace(/\*/g, " ")
      .replace(/\b(unc|unf|unef|npt|nptf|thread|threads|coarse|fine|extra)\b/g, " ")
      .replace(/[×]/g, "x")
      .replace(/#/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (!clean) {
      return null;
    }

    // Metric: m6, m6x1, m6 x 1.0, m6-1
    const metric = clean.match(/^m\s*(\d+(?:\.\d+)?)(?:\s*[x-]\s*(\d+(?:\.\d+)?))?$/);
    if (metric) {
      return { system: "metric", dia: parseFloat(metric[1]), pitch: metric[2] ? parseFloat(metric[2]) : null };
    }

    // Unified: 10-32, 10x32, 10 32, 1/4-20, 1/4, 1-1/4-7, 1 1/4-11 1/2, 1-11 1/2
    clean = clean.replace(/\s*x\s*/g, "-").replace(/\s*-\s*/g, "-");
    const unified = clean.match(/^(\d+(?:\/\d+)?|\d+[ -]\d+\/\d+)(?:[- ](\d+(?: \d\/\d)?))?$/);
    if (unified) {
      return {
        system: "unified",
        size: unified[1].replace("-", " "),                    // "1-1/4" -> "1 1/4"
        tpi: unified[2] ? mixedToNumber(unified[2]) : null
      };
    }
    return null;
  }

  // Does a data row's thread match the query? (size must match; pitch only if typed)
  function threadMatches(query, row) {
    if (!query || !row || query.system !== row.system) {
      return false;
    }
    if (query.system === "metric") {
      return Math.abs(query.dia - row.dia) < 1e-6 && (query.pitch === null || Math.abs(query.pitch - row.pitch) < 1e-6);
    }
    return query.size === row.size && (query.tpi === null || Math.abs(query.tpi - row.tpi) < 1e-6);
  }

  // Key that groups results by exact thread (size + pitch)
  function threadKey(t) {
    return t.system === "metric" ? "m" + t.dia + "x" + t.pitch : t.size + "-" + t.tpi;
  }

  // ---------- Thread pilot-hole tables (one tab per thread series) ----------
  function renderThreadGroup(host) {
    const group = host.dataset.threadGroup;
    const tables = window.DFM_THREADS.tables.filter(function (t) {
      return t.group === group;
    });
    if (tables.length === 0) {
      return;
    }

    // Tab label from the table title ("UNC - ..." -> "UNC")
    const tabs = tables.map(function (t) {
      return '<button class="tab-btn" data-tab="' + t.id + '">' + t.title.split(" - ")[0] + "</button>";
    }).join("");

    const isOd = group === "od";
    const panels = tables.map(function (t) {
      // Column order: the pilot diameter you model comes right after the thread
      const headers = [
        { text: "Thread", cls: "nowrap" },
        { text: (isOd ? "Shaft dia" : "Pilot") + " (" + t.unit + ")", num: true },
        { text: "Min (" + t.unit + ")", num: true },
        { text: "Max (" + t.unit + ")", num: true },
        { text: (isOd ? "Max length" : "Max depth") + " (" + t.unit + ")", num: true }
      ];
      const rows = t.rows.map(function (r) {
        return [threadLabel(r[0]), fmt(r[2], t.unit), fmt(r[3], t.unit), fmt(r[4], t.unit), fmt(r[1], t.unit)];
      });
      return '<div class="tab-panel" data-tab-panel="' + t.id + '">' +
        tableHtml(t.id + "-table", headers, rows, "sticky-first") +
        '<p class="table-note">' + t.note + ' Source: <a href="' + t.source + '" target="_blank" rel="noopener">' +
        t.source.replace("https://www.", "") + "</a></p></div>";
    }).join("");

    host.innerHTML = '<div data-tab-group><div class="tabs" role="tablist">' + tabs + "</div>" + panels + "</div>";
  }

  // ---------- NPT table ----------
  function renderNpt(host) {
    const npt = window.DFM_THREADS.npt;
    const headers = [
      { text: "NPT size", cls: "nowrap" },
      { text: "Pilot (in)", num: true },
      { text: "Pilot range (in)", num: true },
      { text: "Min pilot depth, through (in)", num: true },
      { text: "Min pilot depth, blind (in)", num: true },
      { text: "Thread depth (in)", num: true }
    ];
    const rows = npt.rows.map(function (r) {
      return ["<strong>" + r[0] + "</strong>", fmt(r[3], "in", 4), fmt(r[1], "in", 4) + " - " + fmt(r[2], "in", 4),
        fmt(r[4], "in"), fmt(r[5], "in"), fmt(r[6], "in")];
    });
    host.innerHTML = tableHtml("npt-table", headers, rows, "sticky-first") +
      '<p class="table-note">Tapered pipe threads, offered in soft metals (aluminum, copper, brass). Model a straight pilot hole at the listed diameter. Source: <a href="' +
      npt.source + '" target="_blank" rel="noopener">ProtoLabs threaded hole guidelines</a></p>';
  }

  // ---------- Size-first filter for the tap / drill tables ----------
  // Matches the first (size) column first; if nothing matches there, falls back to the whole row.
  function sizeFilterInput(tableId, placeholder) {
    return '<input type="search" placeholder="' + placeholder + '" aria-label="Filter table by size" data-size-filter="' + tableId + '">';
  }

  function sizeFilter(tableId, placeholder) {
    return '<div class="toolbar">' + sizeFilterInput(tableId, placeholder) + "</div>";
  }

  function normalizeSize(text) {
    // "#10-32", "10x32", "10 - 32" -> "10-32" ; "M6 x 1.0" -> "m6-1"
    return String(text).toLowerCase().replace(/#/g, "").replace(/letter\s*/g, "").replace(/\s*[x×-]\s*/g, "-")
      .replace(/\s+/g, " ").replace(/\.0+\b/g, "").trim();
  }

  function initSizeFilters(scope) {
    scope.querySelectorAll("input[data-size-filter]").forEach(function (input) {
      const table = document.getElementById(input.dataset.sizeFilter);
      if (!table) {
        return;
      }
      const tbody = table.querySelector("tbody");
      const cols = table.querySelectorAll("thead th").length;
      const empty = document.createElement("tr");
      empty.className = "no-match";
      empty.hidden = true;
      empty.innerHTML = '<td colspan="' + cols + '">No matches. Try a size like 1/4-20, #10, M6 or 7.</td>';
      tbody.appendChild(empty);

      input.addEventListener("input", function () {
        const term = normalizeSize(input.value);
        const rows = Array.prototype.slice.call(tbody.querySelectorAll("tr:not(.no-match)"));
        if (!term) {
          rows.forEach(function (row) {
            row.hidden = false;
          });
          empty.hidden = true;
          return;
        }
        // Size column: exact match, or the size without its pitch ("1/4" finds 1/4-20 and 1/4-28)
        const bySize = rows.filter(function (row) {
          const size = normalizeSize(row.cells[0].textContent);
          return size === term || size.indexOf(term + "-") === 0;
        });
        const shown = bySize.length ? bySize : rows.filter(function (row) {
          return normalizeSize(row.textContent).indexOf(term) !== -1;
        });
        rows.forEach(function (row) {
          row.hidden = shown.indexOf(row) === -1;
        });
        empty.hidden = shown.length > 0;
      });
    });
  }

  // ---------- Inch tap and clearance drills ----------
  // Drill and its decimal share one cell: "#7 · 0.2010"
  function drillCell(name, dec, places) {
    return '<span class="nowrap">' + escapeHtml(name) + " &middot; " + fmt(dec, "in", places === undefined ? 4 : places) + "</span>";
  }

  function diameterToggle(tableId) {
    return '<label class="toggle-dia"><input type="checkbox" data-dia-toggle="' + tableId + '"> Show major / minor diameters</label>';
  }

  function renderTapInch(host) {
    const data = window.DFM_TAP_DRILLS.inch;
    const headers = [
      { text: "Size", cls: "nowrap" }, { text: "Series" },
      { text: "Major dia (in)", num: true, cls: "col-dia", hidden: true },
      { text: "Minor dia (in)", num: true, cls: "col-dia", hidden: true },
      { text: "75% tap drill (in)" }, { text: "50% tap drill (in)" },
      { text: "Close fit (in)" }, { text: "Free fit (in)" }
    ];
    const rows = data.map(function (r) {
      return ["<strong>" + r[0] + "-" + r[2] + "</strong>", r[3], fmt(r[1], "in", 4), fmt(r[4], "in", 4),
        drillCell(r[5], r[6]), drillCell(r[7], r[8]), drillCell(r[9], r[10]), drillCell(r[11], r[12])];
    });
    host.innerHTML = '<div class="toolbar">' + sizeFilterInput("tap-inch-table", "Filter by size, e.g. 1/4-20, #10, 10-32") +
      diameterToggle("tap-inch-table") + "</div>" + tableHtml("tap-inch-table", headers, rows, "sticky-first");
  }

  // ---------- Metric tap and clearance drills ----------
  function renderTapMetric(host) {
    const data = window.DFM_TAP_DRILLS.metric;
    const headers = [
      { text: "Size", cls: "nowrap" }, { text: "Series" },
      { text: "75% tap (mm &middot; inch drill)" }, { text: "50% tap (mm &middot; inch drill)" },
      { text: "Close fit (mm &middot; inch drill)" }, { text: "Normal fit (mm &middot; inch drill)" }
    ];
    const cell = function (mm, drill) {
      return '<span class="nowrap">' + fmt(mm, "mm") + " &middot; " + escapeHtml(drill) + "</span>";
    };
    const rows = data.map(function (r) {
      return ["<strong>" + r[0] + " x " + r[1] + "</strong>", r[2], cell(r[3], r[4]), cell(r[5], r[6]), cell(r[7], r[8]), cell(r[9], r[10])];
    });
    host.innerHTML = sizeFilter("tap-metric-table", "Filter by size, e.g. M6 or M8 x 1") + tableHtml("tap-metric-table", headers, rows, "sticky-first");
  }

  // ---------- Number and letter drill decimal equivalents ----------
  function renderDrillSizes(host) {
    const data = window.DFM_TAP_DRILLS;
    const all = data.numberDrills.concat(data.letterDrills.map(function (d) {
      return ["Letter " + d[0], d[1]];
    }));
    const headers = [{ text: "Drill", cls: "nowrap" }, { text: "Inch", num: true }, { text: "mm", num: true }];
    const rows = all.map(function (d) {
      return ["<strong>" + d[0] + "</strong>", fmt(d[1], "in", 4), fmt(d[1] * 25.4, "mm", 3)];
    });
    host.innerHTML = sizeFilter("drill-size-table", "Filter, e.g. #7 or F") + tableHtml("drill-size-table", headers, rows, "sticky-first");
  }

  // Show / hide the major and minor diameter columns
  function initDiameterToggles(scope) {
    scope.querySelectorAll("input[data-dia-toggle]").forEach(function (box) {
      box.addEventListener("change", function () {
        const table = document.getElementById(box.dataset.diaToggle);
        table.querySelectorAll(".col-dia").forEach(function (cell) {
          cell.hidden = !box.checked;
        });
      });
    });
  }

  // ---------- "Find a thread": one box that searches every thread table ----------
  function collectThreadData() {
    // Flatten every thread source into rows { thread, label, kind, anchor, text }
    const out = [];
    const kinds = {
      standard: { label: "Milled tapped hole", anchor: "#standard-holes" },
      coil: { label: "Coil insert hole", anchor: "#coil-inserts" },
      key: { label: "Key insert fitting thread", anchor: "#key-inserts" },
      od: { label: "External thread, turned", anchor: "#od-threads" }
    };
    window.DFM_THREADS.tables.forEach(function (t) {
      t.rows.forEach(function (r) {
        const parsed = parseThread(r[0]);
        if (!parsed) {
          return;
        }
        const u = t.unit;
        const isOd = t.group === "od";
        out.push({
          thread: parsed,
          name: r[0].replace(/\s*\*\s*$/, ""),
          kind: kinds[t.group].label + (/\*\s*$/.test(r[0]) ? " (soft metals only)" : ""),
          anchor: kinds[t.group].anchor,
          text: (isOd ? "Shaft " : "Pilot ") + fmt(r[2], u) + " " + u + " (range " + fmt(r[3], u) + "-" + fmt(r[4], u) + "), " +
            (isOd ? "max length " : "max depth ") + fmt(r[1], u) + " " + u
        });
      });
    });
    window.DFM_THREADS.npt.rows.forEach(function (r) {
      const parsed = parseThread(r[0]);
      if (parsed) {
        out.push({
          thread: parsed, name: r[0] + " NPT", kind: "NPT pipe thread (soft metals)", anchor: "#npt-threads", npt: true,
          text: "Pilot " + fmt(r[3], "in", 4) + " in (range " + fmt(r[1], "in", 4) + "-" + fmt(r[2], "in", 4) + "), thread depth " + fmt(r[6], "in") + " in"
        });
      }
    });

    // Shop tap and clearance drills (tap_drill_charts.html)
    const tap = window.DFM_TAP_DRILLS;
    if (tap) {
      tap.inch.forEach(function (r) {
        out.push({
          thread: { system: "unified", size: r[0].replace("#", ""), tpi: r[2] }, name: r[0] + "-" + r[2] + " " + r[3],
          kind: "Shop tap / clearance drills", anchor: "tap_drill_charts.html#inch",
          text: "Tap 75% " + r[5] + " (" + fmt(r[6], "in", 4) + "), 50% " + r[7] + " (" + fmt(r[8], "in", 4) + "); clearance close " +
            r[9] + " (" + fmt(r[10], "in", 4) + "), free " + r[11] + " (" + fmt(r[12], "in", 4) + ")"
        });
      });
      tap.metric.forEach(function (r) {
        out.push({
          thread: { system: "metric", dia: parseFloat(r[0].slice(1)), pitch: r[1] }, name: r[0] + " x " + r[1] + " " + r[2].toLowerCase(),
          kind: "Shop tap / clearance drills", anchor: "tap_drill_charts.html#metric",
          text: "Tap 75% " + fmt(r[3], "mm") + " mm (" + r[4] + "), 50% " + fmt(r[5], "mm") + " mm (" + r[6] + "); clearance close " +
            fmt(r[7], "mm") + " mm, normal " + fmt(r[9], "mm") + " mm"
        });
      });
    }
    return out;
  }

  function renderThreadLookup(host) {
    host.innerHTML =
      '<div class="toolbar"><input type="search" id="thread-lookup-input" placeholder="Type a thread: 1/4-20, #10-32, M6, M8x1.25" ' +
      'aria-label="Find a thread" autocomplete="off" style="flex:1 1 320px"></div>' +
      '<div class="thread-lookup-results" aria-live="polite"></div>';
    const input = host.querySelector("input");
    const out = host.querySelector(".thread-lookup-results");
    let data = collectThreadData();

    function show() {
      const raw = input.value.trim();
      if (!raw) {
        out.innerHTML = '<p class="table-note" style="margin:8px 0 0">Shows every table entry for that size: milled pilot hole, coil and key insert holes, turned OD thread, NPT, and the shop tap and clearance drills. Leave off the pitch (1/4, M6) to see every pitch.</p>';
        return;
      }
      const query = parseThread(raw);
      const hits = query ? data.filter(function (d) {
        // NPT only when asked for, or when the exact pitch was typed
        return threadMatches(query, d.thread) && (!d.npt || /npt/i.test(raw) || (query.tpi !== null && query.system === "unified"));
      }) : [];
      if (hits.length === 0) {
        out.innerHTML = '<p class="table-note" style="margin:8px 0 0"><strong>No thread found</strong> for "' + escapeHtml(raw) +
          '". Try 1/4-20, #10-32, M6 or M8x1.25. The tables cover UNC / UNF #2 to 1/2 in, metric M1.6 to M20 and NPT.</p>';
        return;
      }

      // One card per exact thread (size + pitch); NPT kept separate
      const groups = {};
      const order = [];
      hits.forEach(function (h) {
        const key = (h.npt ? "npt:" : "") + threadKey(h.thread);
        if (!groups[key]) {
          groups[key] = { title: h.npt ? h.name : "", items: [] };
          order.push(key);
        }
        if (!groups[key].title && /Shop tap/.test(h.kind)) {
          groups[key].title = h.name;              // "1/4-20 UNC" / "M6 x 1 coarse"
        }
        groups[key].items.push(h);
      });

      out.innerHTML = order.map(function (key) {
        const g = groups[key];
        const title = g.title || g.items[0].name;
        const rows = g.items.map(function (h) {
          return '<tr><td><a href="' + h.anchor + '">' + h.kind + "</a></td><td>" + escapeHtml(h.text) + "</td></tr>";
        }).join("");
        return '<div class="lookup-card"><h3>' + escapeHtml(title) + '</h3><div class="table-wrap"><table><thead><tr><th>Use</th><th>Values</th></tr></thead><tbody>' +
          rows + "</tbody></table></div></div>";
      }).join("");
    }

    input.addEventListener("input", show);

    // Site search links arrive as thread_tables.html?q=1/4-20#thread-lookup: prefill the box
    try {
      const fromSearch = new URLSearchParams(window.location.search).get("q");
      if (fromSearch) {
        input.value = fromSearch;
      }
    } catch (error) {
      // Old browser without URLSearchParams: just start empty
    }
    show();

    // Tap drill data may arrive a moment later (loaded on demand): refresh then
    host.addEventListener("dfm-tapdata", function () {
      data = collectThreadData();
      show();
    });
  }

  function ensureTapData(callback) {
    // thread_tables.html does not include the tap drill data file in its head; load it on demand
    if (window.DFM_TAP_DRILLS) {
      callback();
      return;
    }
    const script = document.createElement("script");
    script.src = scriptBase + "data/tap_drill_data.js";
    script.onload = callback;
    document.head.appendChild(script);
  }

  // Exposed so other scripts (site search, calculators) can reuse the parser
  window.DFM_THREAD_PARSE = parseThread;

  // ---------- Start up ----------
  document.addEventListener("DOMContentLoaded", function () {
    if (window.DFM_THREADS) {
      document.querySelectorAll("[data-thread-group]").forEach(renderThreadGroup);
      document.querySelectorAll("[data-npt-table]").forEach(renderNpt);
      document.querySelectorAll("[data-thread-lookup]").forEach(function (host) {
        renderThreadLookup(host);
        ensureTapData(function () {
          host.dispatchEvent(new Event("dfm-tapdata"));
        });
      });
    }
    if (window.DFM_TAP_DRILLS) {
      document.querySelectorAll("[data-tap-inch]").forEach(renderTapInch);
      document.querySelectorAll("[data-tap-metric]").forEach(renderTapMetric);
      document.querySelectorAll("[data-drill-sizes]").forEach(renderDrillSizes);
    }
    initSizeFilters(document);
    initDiameterToggles(document);
    // Content was added after main.js ran, so wire up tabs and the table helpers
    // (tall tables scroll in their own box so the header row stays visible) again
    if (window.DFM) {
      window.DFM.initTabs();
      window.DFM.enhanceTables();
    }
  });
})();
