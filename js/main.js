/* =====================================================================
   Shared page behavior for every page:
     - builds the left sidebar from window.DFM_NAV (js/site_nav.js)
     - lists the current page's sections (h2 with an id) under its nav entry
     - builds the top bar (menu button, breadcrumb, theme toggle)
     - light/dark theme toggle (remembered in localStorage when allowed)
     - tab groups (UNC / UNF / Metric ...)
     - table filter boxes
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

  // ---------- Sidebar ----------
  function buildSidebar(rootPrefix, pageId) {
    const sidebar = document.getElementById("sidebar");
    if (!sidebar || !window.DFM_NAV) {
      return;                                    // page has no sidebar placeholder
    }

    // Brand / home link at the top
    let html = '<a class="brand" href="' + rootPrefix + 'index.html">' +
      '<span class="brand-mark">DFM</span>' +
      '<span>Design for Manufacturing<small>CNC &amp; 3D printing reference</small></span></a>';

    // Filter box to quickly find a page
    html += '<input class="nav-filter" type="search" placeholder="Filter pages..." aria-label="Filter pages">';

    // One block per nav group
    window.DFM_NAV.forEach(function (group) {
      html += '<div class="nav-group"><div class="nav-group-title">' + group.group + "</div>";
      group.items.forEach(function (item) {
        const isActive = item.id === pageId;
        html += '<a class="nav-link' + (isActive ? " active" : "") + '" href="' + rootPrefix + item.href + '"' +
          (isActive ? ' aria-current="page"' : "") + ">" + item.title + "</a>";
        if (isActive) {
          html += '<div class="nav-sub" id="nav-sub"></div>';   // filled with this page's sections
        }
      });
      html += "</div>";
    });

    html += '<div class="sidebar-footer">Reference data only. Always confirm against your vendor\'s current guidelines and quote DFM feedback.</div>';
    sidebar.innerHTML = html;

    // Hook up the page filter
    const filter = sidebar.querySelector(".nav-filter");
    filter.addEventListener("input", function () {
      const term = filter.value.trim().toLowerCase();
      sidebar.querySelectorAll(".nav-group").forEach(function (groupEl) {
        let visibleCount = 0;
        groupEl.querySelectorAll(".nav-link").forEach(function (link) {
          const match = link.textContent.toLowerCase().indexOf(term) !== -1;
          link.style.display = match ? "" : "none";
          if (match) {
            visibleCount += 1;
          }
        });
        groupEl.style.display = visibleCount > 0 ? "" : "none";   // hide empty groups
      });
    });
  }

  // ---------- Current page section links ----------
  function buildSectionLinks() {
    const holder = document.getElementById("nav-sub");
    const headings = document.querySelectorAll("main h2[id]");
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
    if (!("IntersectionObserver" in window)) {
      return;
    }
    const links = holder.querySelectorAll("a");
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (link) {
            link.classList.toggle("current", link.getAttribute("href") === "#" + entry.target.id);
          });
        }
      });
    }, { rootMargin: "-80px 0px -70% 0px" });
    headings.forEach(function (heading) {
      observer.observe(heading);
    });
  }

  // ---------- Top bar ----------
  function buildTopbar(pageId) {
    const topbar = document.getElementById("topbar");
    if (!topbar) {
      return;
    }

    // Find the group and title of this page for the breadcrumb
    let crumb = "Home";
    (window.DFM_NAV || []).forEach(function (group) {
      group.items.forEach(function (item) {
        if (item.id === pageId && pageId !== "home") {
          crumb = group.group + "  /  " + item.title;
        }
      });
    });

    topbar.innerHTML =
      '<button class="icon-btn menu-btn" type="button" aria-label="Open navigation" aria-expanded="false">&#9776;</button>' +
      '<div class="crumb">' + crumb + "</div>" +
      '<button class="icon-btn theme-btn" type="button" aria-label="Toggle light or dark theme" title="Toggle theme">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/>' +
      '<path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/></svg></button>';

    // Theme toggle flips between light and dark and remembers the choice
    topbar.querySelector(".theme-btn").addEventListener("click", function () {
      const next = currentTheme() === "dark" ? "light" : "dark";
      applyTheme(next);
      writeSetting(themeKey, next);
    });

    // Menu button opens the sidebar on narrow screens
    const menuBtn = topbar.querySelector(".menu-btn");
    menuBtn.addEventListener("click", function () {
      setNavOpen(!document.body.classList.contains("nav-open"));
    });
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
  // Markup: <input type="search" data-filter-table="tableId">
  function initTableFilters(scope) {
    (scope || document).querySelectorAll("input[data-filter-table]").forEach(function (input) {
      if (input.dataset.filterReady) {
        return;
      }
      input.dataset.filterReady = "1";
      input.addEventListener("input", function () {
        const term = input.value.trim().toLowerCase();
        const ids = input.dataset.filterTable.split(",");   // one box can filter several tables
        ids.forEach(function (id) {
          const table = document.getElementById(id.trim());
          if (!table) {
            return;
          }
          table.querySelectorAll("tbody tr").forEach(function (row) {
            row.style.display = row.textContent.toLowerCase().indexOf(term) !== -1 ? "" : "none";
          });
        });
      });
    });
  }

  // Expose helpers so page scripts that render content later can reuse them
  window.DFM = {
    initTabs: initTabs,
    initTableFilters: initTableFilters,
    readSetting: readSetting,
    writeSetting: writeSetting
  };

  // ---------- Start up ----------
  document.addEventListener("DOMContentLoaded", function () {
    const pageId = document.body.dataset.page || "home";   // which nav entry is active
    const rootPrefix = document.body.dataset.root || "";   // "../" for pages in /pages

    buildSidebar(rootPrefix, pageId);
    buildTopbar(pageId);
    buildSectionLinks();
    initTabs();
    initTableFilters();

    // Close the phone menu after a nav link is tapped
    document.querySelectorAll(".sidebar a").forEach(function (link) {
      link.addEventListener("click", function () {
        setNavOpen(false);
      });
    });

    // Escape key closes the phone menu
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        setNavOpen(false);
      }
    });
  });
})();
