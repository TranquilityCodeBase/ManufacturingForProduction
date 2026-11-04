/* =====================================================================
   Renders the reference tables from the data files so numbers live in
   one place (js/data/*.js) and every page shows the same values.

   Placeholders this script fills:
     <div data-thread-group="standard|coil|key|od"></div>  tabbed UNC / UNF / Metric tables
     <div data-npt-table></div>                            NPT pipe thread table
     <div data-tap-inch></div>                             inch tap & clearance drills
     <div data-tap-metric></div>                           metric tap & clearance drills
     <div data-drill-sizes></div>                          number & letter drill decimals
   ===================================================================== */

(function () {
  "use strict";

  // ---------- Formatting ----------
  function fmt(value, unit, places) {
    // Inch values default to 3 places, metric to 2
    const digits = places !== undefined ? places : (unit === "in" ? 3 : 2);
    return Number(value).toFixed(digits);
  }

  function tableHtml(id, headers, rows) {
    // headers: [{ text, num }] ; rows: arrays of cell strings
    const head = headers.map(function (h) {
      return "<th" + (h.num ? ' class="num"' : "") + ">" + h.text + "</th>";
    }).join("");
    const body = rows.map(function (row) {
      return "<tr>" + row.map(function (cell, i) {
        return "<td" + (headers[i] && headers[i].num ? ' class="num"' : "") + ">" + cell + "</td>";
      }).join("") + "</tr>";
    }).join("");
    return '<div class="table-wrap"><table id="' + id + '"><thead><tr>' + head + "</tr></thead><tbody>" + body + "</tbody></table></div>";
  }

  function filterBox(tableIds, placeholder) {
    return '<div class="toolbar"><input type="search" placeholder="' + placeholder + '" aria-label="Filter table" data-filter-table="' +
      tableIds.join(",") + '"></div>';
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

    const depthLabel = group === "od" ? "Max thread length" : "Max thread depth";
    const pilotLabel = group === "od" ? "Modeled shaft dia" : "Modeled pilot dia";

    const panels = tables.map(function (t) {
      const headers = [
        { text: "Thread" },
        { text: depthLabel + " (" + t.unit + ")", num: true },
        { text: pilotLabel + " (" + t.unit + ")", num: true },
        { text: "Min dia (" + t.unit + ")", num: true },
        { text: "Max dia (" + t.unit + ")", num: true }
      ];
      const rows = t.rows.map(function (r) {
        return ["<strong>" + r[0] + "</strong>", fmt(r[1], t.unit), fmt(r[2], t.unit), fmt(r[3], t.unit), fmt(r[4], t.unit)];
      });
      return '<div class="tab-panel" data-tab-panel="' + t.id + '">' +
        filterBox([t.id + "-table"], "Filter, e.g. 1/4 or M6") +
        tableHtml(t.id + "-table", headers, rows) +
        '<p class="table-note">' + t.note + ' Source: <a href="' + t.source + '" target="_blank" rel="noopener">' +
        t.source.replace("https://www.", "") + "</a></p></div>";
    }).join("");

    host.innerHTML = '<div data-tab-group><div class="tabs" role="tablist">' + tabs + "</div>" + panels + "</div>";
  }

  // ---------- NPT table ----------
  function renderNpt(host) {
    const npt = window.DFM_THREADS.npt;
    const headers = [
      { text: "NPT size" },
      { text: "Modeled pilot (in)", num: true },
      { text: "Pilot range (in)", num: true },
      { text: "Min pilot depth, through (in)", num: true },
      { text: "Min pilot depth, blind (in)", num: true },
      { text: "Thread depth (in)", num: true }
    ];
    const rows = npt.rows.map(function (r) {
      return ["<strong>" + r[0] + "</strong>", fmt(r[3], "in", 4), fmt(r[1], "in", 4) + " - " + fmt(r[2], "in", 4),
        fmt(r[4], "in"), fmt(r[5], "in"), fmt(r[6], "in")];
    });
    host.innerHTML = tableHtml("npt-table", headers, rows) +
      '<p class="table-note">Tapered pipe threads, offered in soft metals (aluminum, copper, brass). Model a straight pilot hole at the listed diameter. Source: <a href="' +
      npt.source + '" target="_blank" rel="noopener">ProtoLabs threaded hole guidelines</a></p>';
  }

  // ---------- Inch tap and clearance drills ----------
  function renderTapInch(host) {
    const data = window.DFM_TAP_DRILLS.inch;
    const headers = [
      { text: "Size" }, { text: "TPI", num: true }, { text: "Series" }, { text: "Major dia", num: true },
      { text: "Minor dia", num: true }, { text: "75% tap drill" }, { text: "Dec", num: true },
      { text: "50% tap drill" }, { text: "Dec", num: true }, { text: "Close fit" }, { text: "Dec", num: true },
      { text: "Free fit" }, { text: "Dec", num: true }
    ];
    const rows = data.map(function (r) {
      return ["<strong>" + r[0] + "-" + r[2] + "</strong>", r[2], r[3], fmt(r[1], "in", 4), fmt(r[4], "in", 4),
        r[5], fmt(r[6], "in", 4), r[7], fmt(r[8], "in", 4), r[9], fmt(r[10], "in", 4), r[11], fmt(r[12], "in", 4)];
    });
    host.innerHTML = filterBox(["tap-inch-table"], "Filter, e.g. 1/4, 10-32, UNF") + tableHtml("tap-inch-table", headers, rows);
  }

  // ---------- Metric tap and clearance drills ----------
  function renderTapMetric(host) {
    const data = window.DFM_TAP_DRILLS.metric;
    const headers = [
      { text: "Size" }, { text: "Pitch (mm)", num: true }, { text: "Series" },
      { text: "75% tap (mm)", num: true }, { text: "Nearest inch drill" },
      { text: "50% tap (mm)", num: true }, { text: "Nearest inch drill" },
      { text: "Close fit (mm)", num: true }, { text: "Inch drill" },
      { text: "Normal fit (mm)", num: true }, { text: "Inch drill" }
    ];
    const rows = data.map(function (r) {
      return ["<strong>" + r[0] + " x " + r[1] + "</strong>", fmt(r[1], "mm"), r[2], fmt(r[3], "mm"), r[4],
        fmt(r[5], "mm"), r[6], fmt(r[7], "mm"), r[8], fmt(r[9], "mm"), r[10]];
    });
    host.innerHTML = filterBox(["tap-metric-table"], "Filter, e.g. M6 or Fine") + tableHtml("tap-metric-table", headers, rows);
  }

  // ---------- Number and letter drill decimal equivalents ----------
  function renderDrillSizes(host) {
    const data = window.DFM_TAP_DRILLS;
    // Show number drills and letter drills side by side in compact columns
    const all = data.numberDrills.concat(data.letterDrills.map(function (d) {
      return ["Letter " + d[0], d[1]];
    }));
    const headers = [{ text: "Drill" }, { text: "Inch", num: true }, { text: "mm", num: true }];
    const rows = all.map(function (d) {
      return ["<strong>" + d[0] + "</strong>", fmt(d[1], "in", 4), fmt(d[1] * 25.4, "mm", 3)];
    });
    host.innerHTML = filterBox(["drill-size-table"], "Filter, e.g. #7 or Letter F") + tableHtml("drill-size-table", headers, rows);
  }

  // ---------- Start up ----------
  document.addEventListener("DOMContentLoaded", function () {
    if (window.DFM_THREADS) {
      document.querySelectorAll("[data-thread-group]").forEach(renderThreadGroup);
      document.querySelectorAll("[data-npt-table]").forEach(renderNpt);
    }
    if (window.DFM_TAP_DRILLS) {
      document.querySelectorAll("[data-tap-inch]").forEach(renderTapInch);
      document.querySelectorAll("[data-tap-metric]").forEach(renderTapMetric);
      document.querySelectorAll("[data-drill-sizes]").forEach(renderDrillSizes);
    }
    // Content was added after main.js ran, so wire up tabs and filters again
    if (window.DFM) {
      window.DFM.initTabs();
      window.DFM.initTableFilters();
    }
  });
})();
