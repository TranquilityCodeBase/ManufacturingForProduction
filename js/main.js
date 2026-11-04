/* =====================================================================
   Shared page behavior for every page:
     - builds the left sidebar from window.DFM_NAV (js/site_nav.js)
     - lists the current page's sections (h2 with an id) under its nav entry
     - builds the top bar (menu button, clickable breadcrumb, search slot,
       Pad button, theme toggle)
     - light/dark theme toggle (remembered in localStorage when allowed)
     - previous / next page links, back-to-top button, skip link
     - keyboard shortcuts: / search, b back, p pad, t theme
     - tab groups (UNC / UNF / Metric ...), table filters, table helpers
     - click-to-enlarge for diagrams
   Pages only need:
     <body data-page="page_id" data-root="../">
     <nav id="sidebar" class="sidebar"></nav>
     <header id="topbar" class="topbar"></header>
   ===================================================================== */

(function () {
  "use strict";

  // ---------- Small storage helpers (storage can be blocked, so always guard) ----------
  function readSetting(key) {
    try {
      return window.localStorage.getItem(key);   // may throw in private mode
    } catch (error) {
      return null;                               // behave as if nothing was saved
    }
  }

  function writeSetting(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      // Ignore: the setting simply will not be remembered
    }
  }

  // ---------- Theme ----------
  const themeKey = "dfm-theme";                  // localStorage key for the theme choice

  function applyTheme(theme) {
    // "light" or "dark" forces a theme; null follows the operating system
    if (theme === "light" || theme === "dark") {
      document.documentElement.setAttribute("data-theme", theme);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }

  function currentTheme() {
    // Work out which theme is showing right now (forced or from the OS)
    const forced = document.documentElement.getAttribute("data-theme");
    if (forced) {
      return forced;
    }
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  }

  applyTheme(readSetting(themeKey));             // apply the saved choice as early as possible

  // ---------- Page history for the "Back to" link ----------
  // Stored per browser tab in sessionStorage:
  //   current  = the page open now, with its scroll position (saved when leaving)
  //   previous = the page before it (target of the "Back to" link)
  //   restore  = id of the page the Back link is going to, so its scroll position is restored
  const historyKey = "dfm-page-history";

  function readHistory() {
    try {
      return JSON.parse(window.sessionStorage.getItem(historyKey) || "{}") || {};
    } catch (error) {
      return {};                                 // storage blocked or unreadable
    }
  }

  function writeHistory(state) {
    try {
      window.sessionStorage.setItem(historyKey, JSON.stringify(state));
    } catch (error) {
      // Ignore: the Back link simply will not appear
    }
  }

  function findPage(pageId) {
    // Look up a page's title and root-relative href from the nav definition
    if (window.DFM_HOME && pageId === window.DFM_HOME.id) {
      return window.DFM_HOME;
    }
    let found = null;
    (window.DFM_NAV || []).forEach(function (group) {
      if (group.page && group.page.id === pageId) {
        found = group.page;
      }
      group.items.forEach(function (item) {
        if (item.id === pageId) {
          found = item;
        }
      });
    });
    return found;
  }

  let pageHistory = {};                          // state for this page view
  let restoreScrollTo = null;                    // scroll position to restore after load (Back link)

  function updateHistory(pageId) {
    const state = readHistory();
    const page = findPage(pageId);
    if (!page) {
      return;
    }

    // Arrived with the Back link: remember where that page was scrolled to
    if (state.restore === pageId && state.previous && state.previous.id === pageId) {
      restoreScrollTo = state.previous.scroll || 0;
    }

    // A new page pushes the old current page into "previous"; a reload keeps it
    if (state.current && state.current.id !== pageId) {
      state.previous = state.current;
    }
    state.current = { id: pageId, href: page.href, title: page.title, scroll: 0 };
    delete state.restore;
    writeHistory(state);
    pageHistory = state;

    // Save this page's scroll position when leaving it
    window.addEventListener("pagehide", function () {
      const latest = readHistory();
      if (latest.current && latest.current.id === pageId) {
        latest.current.scroll = window.scrollY;
        writeHistory(latest);
      }
    });
  }

  function restoreScroll() {
    // Run after images and rendered tables have their final size
    if (restoreScrollTo !== null) {
      window.requestAnimationFrame(function () {
        window.scrollTo(0, restoreScrollTo);
      });
    }
  }

  // ---------- Sidebar ----------
  const navStateKey = "dfm-nav-groups";          // localStorage key for open / closed groups
  let openNavGroup = function () {};             // set by buildSidebar; used by the breadcrumb

  function buildSidebar(rootPrefix, pageId) {
    const sidebar = document.getElementById("sidebar");
    if (!sidebar || !window.DFM_NAV) {
      return;                                    // page has no sidebar placeholder
    }

    // Brand / home link at the top
    let html = '<a class="brand" href="' + rootPrefix + 'index.html">' +
      '<span class="brand-mark">DFM</span>' +
      '<span>Design for Manufacturing<small>CNC &amp; 3D printing reference</small></span></a>';

    // Fixed links: Home (always visible) and Back to the last page visited in this tab
    const home = window.DFM_HOME;
    const homeIcon = '<svg class="nav-icon" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">' +
      '<path d="M2 7.5L8 2.5l6 5M3.8 6.2V13.5h3V10h2.4v3.5h3V6.2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/></svg>';
    const backIcon = '<svg class="nav-icon" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">' +
      '<path d="M6 3.5L2.5 7 6 10.5M3 7h6.5a4 4 0 0 1 0 8H8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/></svg>';
    const previous = pageHistory.previous;
    html += '<div class="nav-fixed">' +
      '<a class="nav-home' + (pageId === home.id ? " active" : "") + '" href="' + rootPrefix + home.href + '"' +
      (pageId === home.id ? ' aria-current="page"' : "") + ">" + homeIcon + "<span>" + home.title + "</span></a>";
    if (previous && previous.id !== pageId) {
      html += '<a class="nav-back" href="' + rootPrefix + previous.href + '" title="Return to the last page you viewed, at the same scroll position">' +
        backIcon + '<span><small>Back to</small>' + previous.title + "</span></a>";
    }
    html += "</div>";

    // Collapse / expand every group at once (page search lives in the top bar)
    html += '<div class="nav-tools"><span>Sections</span>' +
      '<button type="button" class="nav-tool-btn" data-nav-all="0">Collapse all</button>' +
      '<button type="button" class="nav-tool-btn" data-nav-all="1">Expand all</button></div>';

    // Chevron icon used on collapsible rows (rotates when open)
    const chevron = '<svg class="chevron" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">' +
      '<path d="M4 2l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    // Remembered open / closed state of each group (null = not saved yet)
    let savedGroups = null;
    try {
      savedGroups = JSON.parse(readSetting(navStateKey) || "null");
    } catch (error) {
      savedGroups = null;                        // unreadable value: use defaults
    }

    // One collapsible block per nav group; the group label is the toggle
    window.DFM_NAV.forEach(function (group, index) {
      const holdsPage = (group.page && group.page.id === pageId) || group.items.some(function (item) {
        return item.id === pageId;
      });
      // Default: open the group that holds this page (all groups on the home page);
      // a saved choice wins, but the current page's group always opens
      let open = pageId === "home" || holdsPage;
      if (savedGroups && Object.prototype.hasOwnProperty.call(savedGroups, group.group)) {
        open = savedGroups[group.group] || holdsPage;
      }
      const listId = "nav-group-" + index;

      html += '<div class="nav-group' + (open ? " open" : "") + '" data-group="' + group.group + '">' +
        '<button class="nav-group-title" type="button" aria-expanded="' + open + '" aria-controls="' + listId + '">' +
        "<span>" + group.group + "</span>" + chevron + "</button>" +
        '<div class="nav-group-items" id="' + listId + '">';
      group.items.forEach(function (item) {
        const isActive = item.id === pageId;
        html += '<a class="nav-link' + (isActive ? " active open" : "") + '" href="' + rootPrefix + item.href + '"' +
          (isActive ? ' aria-current="page" aria-expanded="true" title="Click to show or hide this page\'s sections"' : "") + ">" +
          "<span>" + item.title + "</span>" + (isActive ? chevron : "") + "</a>";
        if (isActive) {
          html += '<div class="nav-sub" id="nav-sub"></div>';   // filled with this page's sections
        }
      });
      html += "</div></div>";
    });

    html += '<div class="sidebar-footer">Shortcuts: <kbd>/</kbd> search, <kbd>b</kbd> back, <kbd>p</kbd> pad, <kbd>t</kbd> theme.<br>' +
      'Reference data only. Always confirm against your vendor\'s current guidelines and quote DFM feedback.</div>';
    sidebar.innerHTML = html;

    // Back link: flag the target so it reopens at the same scroll position
    const backLink = sidebar.querySelector(".nav-back");
    if (backLink && previous) {
      backLink.addEventListener("click", function () {
        const state = readHistory();
        state.restore = previous.id;
        writeHistory(state);
      });
    }

    // Save the open / closed state of every group
    function saveGroups() {
      const state = {};
      sidebar.querySelectorAll(".nav-group").forEach(function (groupEl) {
        state[groupEl.dataset.group] = groupEl.classList.contains("open");
      });
      writeSetting(navStateKey, JSON.stringify(state));
    }

    // Open or close one group and keep its button state in step
    function setGroupOpen(groupEl, open) {
      groupEl.classList.toggle("open", open);
      groupEl.querySelector(".nav-group-title").setAttribute("aria-expanded", open ? "true" : "false");
    }

    // Group label click: expand or collapse that group
    sidebar.querySelectorAll(".nav-group-title").forEach(function (button) {
      button.addEventListener("click", function () {
        const groupEl = button.parentElement;
        setGroupOpen(groupEl, !groupEl.classList.contains("open"));
        saveGroups();
      });
    });

    // Collapse all / Expand all (the current page's group stays open on Collapse all)
    sidebar.querySelectorAll("[data-nav-all]").forEach(function (button) {
      button.addEventListener("click", function () {
        const open = button.dataset.navAll === "1";
        sidebar.querySelectorAll(".nav-group").forEach(function (groupEl) {
          const holdsActive = Boolean(groupEl.querySelector(".nav-link.active"));
          setGroupOpen(groupEl, open || holdsActive);
        });
        saveGroups();
      });
    });

    // Let the breadcrumb open a group by name
    openNavGroup = function (name) {
      const groupEl = sidebar.querySelector('.nav-group[data-group="' + name + '"]');
      if (groupEl) {
        setGroupOpen(groupEl, true);
        saveGroups();
        groupEl.scrollIntoView({ block: "nearest" });
      }
    };

    // Clicking the current page's own link shows / hides its section list instead of reloading
    const activeLink = sidebar.querySelector(".nav-link.active");
    if (activeLink) {
      activeLink.addEventListener("click", function (event) {
        if (!document.getElementById("nav-sub")) {
          return;                                // no section list: behave like a normal link
        }
        event.preventDefault();
        const open = !activeLink.classList.contains("open");
        activeLink.classList.toggle("open", open);
        activeLink.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    // Keep the current page's link in view inside a long sidebar
    const current = sidebar.querySelector(".nav-link.active, .nav-home.active");
    if (current && current.offsetTop > sidebar.clientHeight - 120) {
      sidebar.scrollTop = current.offsetTop - sidebar.clientHeight / 3;
    }
  }

  // ---------- Highlight the sidebar link of the section in view ----------
  function spyOnLinks(links) {
    if (!("IntersectionObserver" in window) || links.length === 0) {
      return;
    }
    const targets = [];
    links.forEach(function (link) {
      const id = link.getAttribute("href").split("#")[1];
      const target = id ? document.getElementById(id) : null;
      if (target) {
        targets.push(target);
      }
    });
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (link) {
            link.classList.toggle("current", link.getAttribute("href").split("#")[1] === entry.target.id);
          });
        }
      });
    }, { rootMargin: "-80px 0px -70% 0px" });
    targets.forEach(function (target) {
      observer.observe(target);
    });
  }

  // Quick Rules style groups: items that jump to sections of the page being viewed
  function spyOnSamePageGroups(pageId) {
    (window.DFM_NAV || []).forEach(function (group, index) {
      if (group.page && group.page.id === pageId) {
        const links = document.querySelectorAll("#nav-group-" + index + " .nav-link");
        links.forEach(function (link) {
          link.classList.add("anchor-link");
        });
        spyOnLinks(Array.prototype.slice.call(links));
      }
    });
  }

  // ---------- Current page section links ----------
  function buildSectionLinks() {
    const holder = document.getElementById("nav-sub");
    const headings = document.querySelectorAll("main h2[id]");
    if (holder && headings.length === 0) {
      // Page has no sections: drop the empty list and the toggle chevron
      const activeLink = document.querySelector(".nav-link.active");
      const icon = activeLink ? activeLink.querySelector(".chevron") : null;
      if (icon) {
        icon.remove();
      }
      if (activeLink) {
        activeLink.removeAttribute("aria-expanded");
        activeLink.removeAttribute("title");
      }
      holder.remove();
    }
    if (!holder || headings.length === 0) {
      return;
    }

    // One link per h2 that has an id
    headings.forEach(function (heading) {
      const link = document.createElement("a");
      link.href = "#" + heading.id;
      link.textContent = heading.getAttribute("data-nav") || heading.textContent;
      holder.appendChild(link);
    });

    // Highlight the section currently in view
    spyOnLinks(Array.prototype.slice.call(holder.querySelectorAll("a")));
  }

  // ---------- Top bar ----------
  const sunIcon = '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" stroke-width="2"/>' +
    '<path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  const moonIcon = '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';
  const padIcon = '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>' +
    '<path d="M8.5 8h7M8.5 12h7M8.5 16h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

  function buildTopbar(pageId) {
    const topbar = document.getElementById("topbar");
    if (!topbar) {
      return;
    }

    // Breadcrumb: the group name is a button that opens that group in the sidebar
    let crumb = '<span class="crumb-page">Home</span>';
    (window.DFM_NAV || []).forEach(function (group) {
      const crumbGroup = '<button type="button" class="crumb-group" data-group="' + group.group + '">' + group.group + "</button>";
      if (group.page && group.page.id === pageId) {
        crumb = crumbGroup;
      }
      group.items.forEach(function (item) {
        if (item.id === pageId && pageId !== "home") {
          crumb = crumbGroup + '<span class="crumb-sep" aria-hidden="true">/</span><span class="crumb-page">' + item.title + "</span>";
        }
      });
    });

    topbar.innerHTML =
      '<button class="icon-btn menu-btn" type="button" aria-label="Open navigation" aria-expanded="false">&#9776;</button>' +
      '<div class="crumb">' + crumb + "</div>" +
      '<div class="topbar-search" id="topbar-search"></div>' +                 // filled by js/site_search.js
      '<button class="icon-btn pad-btn" type="button" aria-label="Open scratch pad" title="Scratch pad (p)">' + padIcon +
      '<span class="pad-count" hidden></span></button>' +
      '<button class="icon-btn theme-btn" type="button" aria-label="Dark theme" title="Toggle theme (t)"></button>';

    // Breadcrumb group: open it in the sidebar (and open the phone menu)
    const crumbBtn = topbar.querySelector(".crumb-group");
    if (crumbBtn) {
      crumbBtn.addEventListener("click", function () {
        openNavGroup(crumbBtn.dataset.group);
        if (window.matchMedia("(max-width: 960px)").matches) {
          setNavOpen(true);
        }
      });
    }

    // Theme toggle flips between light and dark and remembers the choice
    const themeBtn = topbar.querySelector(".theme-btn");
    function showThemeState() {
      const dark = currentTheme() === "dark";
      themeBtn.innerHTML = dark ? sunIcon : moonIcon;          // icon shows what a click switches to
      themeBtn.setAttribute("aria-pressed", dark ? "true" : "false");
    }
    themeBtn.addEventListener("click", function () {
      toggleTheme();
      showThemeState();
    });
    showThemeState();

    // Pad button: open the scratch pad drawer; badge shows how many lines it holds
    const padBtn = topbar.querySelector(".pad-btn");
    const padCount = topbar.querySelector(".pad-count");
    if (window.DFM_PAD) {
      padBtn.addEventListener("click", function () {
        window.DFM_PAD.toggle();
      });
      window.DFM_PAD.onChange(function (count) {
        padCount.hidden = count === 0;
        padCount.textContent = count > 99 ? "99+" : String(count);
      });
    } else {
      padBtn.hidden = true;
    }

    // Menu button opens the sidebar on narrow screens
    const menuBtn = topbar.querySelector(".menu-btn");
    menuBtn.addEventListener("click", function () {
      setNavOpen(!document.body.classList.contains("nav-open"));
    });
  }

  function toggleTheme() {
    const next = currentTheme() === "dark" ? "light" : "dark";
    applyTheme(next);
    writeSetting(themeKey, next);
  }

  function setNavOpen(open) {
    document.body.classList.toggle("nav-open", open);
    const menuBtn = document.querySelector(".menu-btn");
    if (menuBtn) {
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    }

    // A scrim behind the menu closes it when tapped
    let scrim = document.querySelector(".nav-scrim");
    if (open && !scrim) {
      scrim = document.createElement("div");
      scrim.className = "nav-scrim";
      scrim.addEventListener("click", function () {
        setNavOpen(false);
      });
      document.body.appendChild(scrim);
    } else if (!open && scrim) {
      scrim.remove();
    }
  }

  // ---------- Tabs ----------
  // Markup: <div data-tab-group> <div class="tabs"><button class="tab-btn" data-tab="a">..</button></div>
  //         <div class="tab-panel" data-tab-panel="a">..</div> </div>
  function initTabs(scope) {
    (scope || document).querySelectorAll("[data-tab-group]").forEach(function (group) {
      if (group.dataset.tabsReady) {
        return;                                  // already initialised
      }
      group.dataset.tabsReady = "1";

      const buttons = group.querySelectorAll(":scope > .tabs .tab-btn");
      const panels = group.querySelectorAll(":scope > .tab-panel");

      function select(name) {
        buttons.forEach(function (btn) {
          btn.setAttribute("aria-selected", btn.dataset.tab === name ? "true" : "false");
        });
        panels.forEach(function (panel) {
          panel.hidden = panel.dataset.tabPanel !== name;
        });
      }

      buttons.forEach(function (btn) {
        const panel = group.querySelector(':scope > .tab-panel[data-tab-panel="' + btn.dataset.tab + '"]');
        if (panel) {
          panel.dataset.tabLabel = btn.textContent;   // printed above each panel (all tabs print)
        }
        btn.setAttribute("role", "tab");
        btn.type = "button";
        btn.addEventListener("click", function () {
          select(btn.dataset.tab);
        });
      });

      if (buttons.length > 0) {
        select(buttons[0].dataset.tab);          // first tab open by default
      }
    });
  }

  // ---------- Table filter boxes ----------
  // Markup: <input type="search" data-filter-table="tableId[,tableId]">
  // A size-like term (10-32, #4, 1/4, M6) matches the first (size) column first;
  // words, or sizes with no hit, search whole rows. "10-32", "#10-32" and
  // "10x32" all match "#10-32".
  function normalizeTerm(text) {
    return String(text).toLowerCase()
      .replace(/\s+/g, "")                         // ignore spaces
      .replace(/[x×]/g, "-")                       // 10x32, M6x1 -> 10-32, m6-1
      .replace(/^#/, "")                           // #10-32 -> 10-32
      .replace(/-1\.0$|-1$/, "-1.0");               // M6x1 -> m6-1.0
  }

  function filterTable(table, term) {
    const rows = Array.prototype.slice.call(table.querySelectorAll("tbody tr:not(.no-match)"));
    const norm = normalizeTerm(term);
    let shown = 0;

    // Pass 1 (only when the term looks like a size: 10-32, #4, 1/4, M6): size column starts with it
    const looksLikeSize = /^(m?\d|#)/i.test(term.trim());
    const sizeHits = !looksLikeSize ? [] : rows.filter(function (row) {
      const cell = row.cells[0] ? normalizeTerm(row.cells[0].textContent).replace(/^#/, "") : "";
      return norm !== "" && cell.indexOf(norm) === 0;
    });
    rows.forEach(function (row) {
      let show;
      if (term === "") {
        show = true;
      } else if (sizeHits.length) {
        show = sizeHits.indexOf(row) !== -1;
      } else {
        show = row.textContent.toLowerCase().indexOf(term.toLowerCase()) !== -1;   // pass 2: whole row
      }
      row.style.display = show ? "" : "none";
      if (show) {
        shown += 1;
      }
    });

    // Friendly empty state
    let empty = table.querySelector("tbody tr.no-match");
    if (shown === 0 && term !== "") {
      if (!empty) {
        empty = document.createElement("tr");
        empty.className = "no-match";
        empty.innerHTML = '<td colspan="' + (table.rows[0] ? table.rows[0].cells.length : 1) + '">No matches</td>';
        table.querySelector("tbody").appendChild(empty);
      }
      empty.style.display = "";
    } else if (empty) {
      empty.style.display = "none";
    }
  }

  function initTableFilters(scope) {
    (scope || document).querySelectorAll("input[data-filter-table]").forEach(function (input) {
      if (input.dataset.filterReady) {
        return;
      }
      input.dataset.filterReady = "1";
      input.addEventListener("input", function () {
        const term = input.value.trim();
        input.dataset.filterTable.split(",").forEach(function (id) {   // one box can filter several tables
          const table = document.getElementById(id.trim());
          if (table) {
            filterTable(table, term);
          }
        });
      });
    });
    enhanceTables(scope);                        // tables rendered later get the same treatment
  }

  // ---------- Table helpers: tall tables scroll in a box (sticky header works), keyboard access ----------
  function enhanceTables(scope) {
    (scope || document).querySelectorAll(".table-wrap").forEach(function (wrap) {
      const table = wrap.querySelector("table");
      if (!table) {
        return;
      }
      // Long tables get their own scroll box so the header row stays visible
      wrap.classList.toggle("tall", table.querySelectorAll("tbody tr").length > 15);
      // Scrollable regions must be reachable and named for keyboard / screen reader users
      if (!wrap.hasAttribute("tabindex")) {
        let label = "Table";
        let el = wrap.previousElementSibling;
        while (el && !/^H[2-4]$/.test(el.tagName) && !(el.classList && el.classList.contains("toolbar"))) {
          el = el.previousElementSibling;
        }
        const heading = el && /^H[2-4]$/.test(el.tagName) ? el : wrap.closest("section, .tab-panel, .calc, main").querySelector("h2, h3");
        if (heading) {
          label = heading.textContent.trim();
        }
        wrap.setAttribute("tabindex", "0");
        wrap.setAttribute("role", "region");
        wrap.setAttribute("aria-label", label);
      }
    });
  }

  // ---------- Selectable result list (calculators) ----------
  // Shows calculator results as "Label = value" rows. When a scratch pad is on
  // the page each row gets a checkbox; only checked rows are sent to the pad.
  // Unchecked rows are remembered per calculator (by item key) in localStorage.
  const pickKey = "dfm-result-picks";

  function readPicks() {
    try {
      return JSON.parse(readSetting(pickKey) || "{}") || {};
    } catch (error) {
      return {};
    }
  }

  function escapeText(text) {
    return String(text).replace(/[&<>"]/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[ch];
    });
  }

  // items: [{ key, label, value, big }] ; returns nothing, renders into container
  function renderResults(container, calcId, items) {
    const selectable = Boolean(window.DFM_PAD);   // checkboxes only when a pad exists
    const unchecked = readPicks()[calcId] || [];
    container.classList.add("result-list");
    container.dataset.calcId = calcId;
    container.innerHTML = items.map(function (item) {
      const isOn = unchecked.indexOf(item.key) === -1;
      const text = '<span class="result-label">' + escapeText(item.label) + '</span><span class="result-eq">=</span>' +
        '<span class="result-value">' + escapeText(item.value) + "</span>";
      if (!selectable) {
        return '<div class="result-row' + (item.big ? " main" : "") + '">' + text + "</div>";
      }
      return '<label class="result-row' + (item.big ? " main" : "") + '">' +
        '<input type="checkbox" data-key="' + escapeText(item.key) + '"' + (isOn ? " checked" : "") +
        ' aria-label="Include ' + escapeText(item.label) + ' when sending to the pad">' + text + "</label>";
    }).join("");
    container._items = items;                    // kept for building the pad text

    // Remember which rows the user turned off
    container.querySelectorAll("input[type=checkbox]").forEach(function (box) {
      box.addEventListener("change", function () {
        const picks = readPicks();
        const off = (picks[calcId] || []).filter(function (key) {
          return key !== box.dataset.key;
        });
        if (!box.checked) {
          off.push(box.dataset.key);
        }
        picks[calcId] = off;
        writeSetting(pickKey, JSON.stringify(picks));
      });
    });
  }

  // Text for the pad: one "Label = value" line per checked row
  function resultText(container) {
    const items = container._items || [];
    return items.filter(function (item) {
      const box = container.querySelector('input[data-key="' + item.key.replace(/"/g, '\\"') + '"]');
      return !box || box.checked;
    }).map(function (item) {
      return item.label + " = " + item.value;
    }).join("\n");
  }

  // Set every checkbox in a result list on or off (All / None buttons)
  function setAllResults(container, on) {
    container.querySelectorAll("input[type=checkbox]").forEach(function (box) {
      if (box.checked !== on) {
        box.checked = on;
        box.dispatchEvent(new Event("change"));
      }
    });
  }

  // Standard footer for a calculator card: Send to pad + All / None
  function resultActions(container) {
    const row = document.createElement("div");
    row.className = "calc-row calc-actions";
    if (!window.DFM_PAD) {
      return row;                                // no pad on this page: no buttons
    }
    row.innerHTML = '<button type="button" class="btn primary">Send to pad</button>' +
      '<button type="button" class="btn link-btn" data-all="1">All</button>' +
      '<button type="button" class="btn link-btn" data-all="0">None</button>';
    const sendBtn = row.querySelector(".primary");
    sendBtn.addEventListener("click", function () {
      const text = resultText(container);
      if (!text) {
        return;
      }
      window.DFM_PAD.append(text);
      // Brief confirmation on the button itself
      sendBtn.textContent = "Added \u2713";
      sendBtn.classList.add("sent");
      clearTimeout(sendBtn._timer);
      sendBtn._timer = setTimeout(function () {
        sendBtn.textContent = "Send to pad";
        sendBtn.classList.remove("sent");
      }, 1500);
    });
    row.querySelectorAll("[data-all]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setAllResults(container, btn.dataset.all === "1");
      });
    });
    return row;
  }

  // Expose helpers so page scripts that render content later can reuse them
  window.DFM = {
    initTabs: initTabs,
    initTableFilters: initTableFilters,
    readSetting: readSetting,
    writeSetting: writeSetting,
    renderResults: renderResults,
    resultActions: resultActions,
    enhanceTables: enhanceTables,
    normalizeTerm: normalizeTerm
  };

  // ---------- Previous / next page links (from nav order) ----------
  function buildPager(rootPrefix, pageId) {
    const main = document.getElementById("main");
    const footer = main ? main.querySelector(".site-footer") : null;
    if (!main || pageId === "home") {
      return;
    }
    // Every page in menu order (Quick Rules counts once, as its own page)
    const pages = [];
    (window.DFM_NAV || []).forEach(function (group) {
      if (group.page) {
        pages.push(group.page);
      } else {
        group.items.forEach(function (item) {
          pages.push(item);
        });
      }
    });
    const index = pages.findIndex(function (p) {
      return p.id === pageId;
    });
    if (index === -1) {
      return;
    }
    const prev = pages[index - 1];
    const next = pages[index + 1];
    const pager = document.createElement("nav");
    pager.className = "page-pager";
    pager.setAttribute("aria-label", "Previous and next page");
    pager.innerHTML =
      (prev ? '<a class="pager-prev" href="' + rootPrefix + prev.href + '"><small>Previous</small>' + prev.title + "</a>" : "<span></span>") +
      (next ? '<a class="pager-next" href="' + rootPrefix + next.href + '"><small>Next</small>' + next.title + "</a>" : "<span></span>");
    main.insertBefore(pager, footer);
  }

  // ---------- Back to top button (appears after one screen of scrolling) ----------
  function buildBackToTop() {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "to-top";
    btn.setAttribute("aria-label", "Back to top");
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 14l6-6 6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    btn.hidden = true;
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    document.body.appendChild(btn);
    window.addEventListener("scroll", function () {
      btn.hidden = window.scrollY < window.innerHeight;
    }, { passive: true });
  }

  // ---------- Skip link for keyboard users ----------
  function buildSkipLink() {
    const main = document.getElementById("main");
    if (!main) {
      return;
    }
    main.setAttribute("tabindex", "-1");         // lets the skip link move focus to the content
    const link = document.createElement("a");
    link.className = "skip-link";
    link.href = "#main";
    link.textContent = "Skip to content";
    document.body.insertBefore(link, document.body.firstChild);
  }

  // ---------- Click a diagram to view it full size ----------
  function initLightbox() {
    document.addEventListener("click", function (event) {
      const img = event.target.closest("figure.diagram img");
      if (!img || event.target.closest("a")) {
        return;                                  // diagrams that are links keep their link
      }
      const box = document.createElement("div");
      box.className = "lightbox";
      box.setAttribute("role", "dialog");
      box.setAttribute("aria-label", "Enlarged diagram. Press Escape or click to close.");
      box.innerHTML = '<button type="button" class="icon-btn lightbox-close" aria-label="Close">&times;</button>' +
        '<div class="lightbox-scroll"><img src="' + img.getAttribute("src") + '" alt="' + escapeText(img.alt) + '"></div>' +
        (img.closest("figure").querySelector("figcaption") ?
          '<p class="lightbox-caption">' + escapeText(img.closest("figure").querySelector("figcaption").textContent) + "</p>" : "");
      function close() {
        box.remove();
        document.body.classList.remove("lightbox-open");
        document.removeEventListener("keydown", onKey);
        img.focus({ preventScroll: true });
      }
      function onKey(e) {
        if (e.key === "Escape") {
          close();
        }
      }
      box.addEventListener("click", function (e) {
        // Click on the backdrop or close button closes; clicks on the image (for panning on phones) do not
        if (e.target === box || e.target.closest(".lightbox-close")) {
          close();
        }
      });
      document.addEventListener("keydown", onKey);
      document.body.appendChild(box);
      document.body.classList.add("lightbox-open");
      box.querySelector(".lightbox-close").focus();
    });

    // Mark diagrams as enlargeable (cursor + keyboard: Enter on a focused diagram)
    document.querySelectorAll("figure.diagram img").forEach(function (img) {
      if (img.closest("a")) {
        return;
      }
      img.classList.add("zoomable");
      img.setAttribute("tabindex", "0");
      img.setAttribute("title", "Click to enlarge");
      img.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          img.click();
        }
      });
    });
  }

  // ---------- Keyboard shortcuts ----------
  function initShortcuts() {
    document.addEventListener("keydown", function (event) {
      const target = event.target;
      const typing = target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
      if (typing || event.ctrlKey || event.metaKey || event.altKey) {
        return;                                  // never steal keys while typing or from browser shortcuts
      }
      if (event.key === "/") {
        const search = document.querySelector(".site-search-input");
        if (search) {
          event.preventDefault();
          search.focus();
        }
      } else if (event.key === "b") {
        const back = document.querySelector(".nav-back");
        if (back) {
          back.click();
        }
      } else if (event.key === "p" && window.DFM_PAD) {
        event.preventDefault();
        window.DFM_PAD.toggle();
      } else if (event.key === "t") {
        const themeBtn = document.querySelector(".theme-btn");
        if (themeBtn) {
          themeBtn.click();
        }
      }
    });
  }

  // ---------- Start up ----------
  document.addEventListener("DOMContentLoaded", function () {
    const pageId = document.body.dataset.page || "home";   // which nav entry is active
    const rootPrefix = document.body.dataset.root || "";   // "../" for pages in /pages

    updateHistory(pageId);
    buildSidebar(rootPrefix, pageId);
    buildTopbar(pageId);
    buildSectionLinks();
    spyOnSamePageGroups(pageId);
    initTabs();
    initTableFilters();
    buildPager(rootPrefix, pageId);
    buildBackToTop();
    buildSkipLink();
    initLightbox();
    initShortcuts();

    // Close the phone menu after a nav link is tapped
    document.querySelectorAll(".sidebar a:not(.active)").forEach(function (link) {
      link.addEventListener("click", function () {
        setNavOpen(false);
      });
    });

    // Back link arrivals return to the saved scroll position once everything has loaded
    if (document.readyState === "complete") {
      restoreScroll();
    } else {
      window.addEventListener("load", restoreScroll);
    }

    // Escape key closes the phone menu
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        setNavOpen(false);
      }
    });
  });
})();
