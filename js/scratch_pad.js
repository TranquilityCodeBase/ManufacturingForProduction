/* =====================================================================
   Scratch pad, available on every page.
   - On the calculators page it uses the pad panel already in the page.
   - On every other page it builds a slide-out drawer, opened from the
     "Pad" button in the top bar (main.js) or the P key.
   Notes are kept in localStorage (this browser only) and saved as you
   type, when you leave the page, and when another tab changes them.
   Other scripts add lines with window.DFM_PAD.append(text).
   ===================================================================== */

(function () {
  "use strict";

  const padKey = "dfm-scratch-pad";            // localStorage key shared by every page and tab
  let area = null;                             // the textarea in use (inline panel or drawer)
  let stateEl = null;                          // small status line under the buttons
  let drawer = null;                           // drawer element (null on the calculators page)
  let saveTimer = null;
  const listeners = [];                        // callbacks told when the line count changes

  // ---------- Storage (guarded: storage can be blocked) ----------
  function load() {
    try {
      return window.localStorage.getItem(padKey) || "";
    } catch (error) {
      return "";
    }
  }

  function store(text) {
    try {
      window.localStorage.setItem(padKey, text);
      return true;
    } catch (error) {
      return false;
    }
  }

  // ---------- Helpers ----------
  function lineCount() {
    // Number of non-empty lines, shown on the top bar Pad button
    return area ? area.value.split("\n").filter(function (line) {
      return line.trim() !== "";
    }).length : 0;
  }

  function notify() {
    listeners.forEach(function (fn) {
      fn(lineCount());
    });
  }

  function setState(text) {
    if (stateEl) {
      stateEl.textContent = text;
    }
  }

  function saveNow() {
    clearTimeout(saveTimer);
    if (area && store(area.value)) {
      setState("Saved in this browser " + new Date().toLocaleTimeString());
    }
    notify();
  }

  function saveSoon() {
    // Save shortly after typing stops (and always on page hide, below)
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveNow, 400);
    notify();
  }

  // Each send is one block of lines; a blank line separates it from the previous block
  function append(text) {
    if (!area || !text) {
      return;
    }
    let prefix = "";
    if (area.value.trim() !== "") {
      prefix = area.value.endsWith("\n\n") ? "" : (area.value.endsWith("\n") ? "\n" : "\n\n");
    }
    area.value += prefix + text + "\n";
    area.scrollTop = area.scrollHeight;         // keep the newest line visible
    saveNow();
  }

  // ---------- Markup for the drawer (other pages) ----------
  function controlsHtml() {
    return '<div class="calc-row">' +
      '<button type="button" class="btn" data-pad-action="stamp">Time stamp</button>' +
      '<button type="button" class="btn" data-pad-action="copy">Copy</button>' +
      '<button type="button" class="btn" data-pad-action="download">Download .txt</button>' +
      '<button type="button" class="btn" data-pad-action="clear">Clear</button></div>' +
      '<span class="save-state" data-pad-state>Notes are saved in this browser only. Nothing is sent anywhere.</span>';
  }

  function buildDrawer() {
    drawer = document.createElement("aside");
    drawer.className = "pad-drawer";
    drawer.id = "pad-drawer";
    drawer.setAttribute("aria-label", "Scratch pad");
    drawer.hidden = true;
    drawer.innerHTML =
      '<div class="pad-drawer-head"><h2>Scratch pad</h2>' +
      '<button type="button" class="icon-btn" data-pad-close aria-label="Close scratch pad">&times;</button></div>' +
      '<div class="scratch" data-pad-root>' +
      '<label for="pad-drawer-text">Notes for the part you are working on</label>' +
      '<textarea id="pad-drawer-text" data-pad-text spellcheck="true" placeholder="Pilot sizes, critical dimensions, questions for the shop..."></textarea>' +
      controlsHtml() + "</div>";
    document.body.appendChild(drawer);
    drawer.querySelector("[data-pad-close]").addEventListener("click", close);
    return drawer.querySelector("[data-pad-root]");
  }

  // ---------- Wire up buttons inside a pad container ----------
  function bindControls(root) {
    area = root.querySelector("[data-pad-text]");
    stateEl = root.querySelector("[data-pad-state]");
    area.value = load();
    area.addEventListener("input", saveSoon);

    root.querySelectorAll("[data-pad-action]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const action = btn.dataset.padAction;
        if (action === "stamp") {
          append("--- " + new Date().toLocaleString() + " ---");
        } else if (action === "copy") {
          area.select();
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(area.value).then(function () {
              setState("Copied to clipboard");
            }, function () {
              setState("Select the text and press Ctrl+C to copy");
            });
          } else {
            setState("Select the text and press Ctrl+C to copy");
          }
        } else if (action === "download") {
          // CRLF line endings so Windows editors show one item per line
          const blob = new Blob([area.value.replace(/\r?\n/g, "\r\n")], { type: "text/plain" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "dfm_notes_" + new Date().toISOString().slice(0, 10) + ".txt";
          document.body.appendChild(link);
          link.click();
          link.remove();
          setTimeout(function () {
            URL.revokeObjectURL(link.href);
          }, 1000);
        } else if (action === "clear") {
          if (area.value && !window.confirm("Clear the scratch pad? This cannot be undone.")) {
            return;
          }
          area.value = "";
          saveNow();
        }
      });
    });
  }

  // ---------- Open / close (drawer, or focus the inline pad) ----------
  function open() {
    if (!area) {
      return;
    }
    if (!drawer) {
      // Calculators page: bring the inline pad into view
      area.scrollIntoView({ block: "center", behavior: "smooth" });
      area.focus({ preventScroll: true });
      return;
    }
    drawer.hidden = false;
    document.body.classList.add("pad-open");
    area.focus();
  }

  function close() {
    if (drawer) {
      drawer.hidden = true;
      document.body.classList.remove("pad-open");
    }
  }

  function toggle() {
    if (drawer && !drawer.hidden) {
      close();
    } else {
      open();
    }
  }

  // ---------- Public API (defined now so other scripts see it before the page loads) ----------
  window.DFM_PAD = {
    append: append,
    open: open,
    close: close,
    toggle: toggle,
    count: lineCount,
    isInline: function () {
      return !drawer;
    },
    onChange: function (fn) {
      listeners.push(fn);
    }
  };

  document.addEventListener("DOMContentLoaded", function () {
    // Use the page's own pad panel if there is one, otherwise build the drawer
    const inline = document.querySelector("[data-pad-root]");
    bindControls(inline || buildDrawer());
    if (inline && load()) {
      setState("Restored notes saved in this browser");
    }
    notify();

    // Escape closes the drawer
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && drawer && !drawer.hidden) {
        close();
      }
    });

    // Never lose the last keystrokes when leaving the page
    window.addEventListener("pagehide", saveNow);
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "hidden") {
        saveNow();
      }
    });

    // Another tab changed the pad: pick up its text (unless typing here right now)
    window.addEventListener("storage", function (event) {
      if (event.key !== padKey || !area) {
        return;
      }
      if (document.activeElement === area) {
        setState("Changed in another tab. Your typing here will overwrite it when saved.");
      } else {
        area.value = event.newValue || "";
        setState("Updated from another tab");
        notify();
      }
    });
  });
})();
