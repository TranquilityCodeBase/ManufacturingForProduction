/* =====================================================================
   Inside corner & pocket floor radius picker.
   Renders into every element with the attribute data-corner-tool.
   Needs js/data/cutter_data.js loaded first.

   What it answers:
     1. "I drew corner radius R in a pocket D deep - is that OK?"
     2. "My pocket is D deep - which corner radius should I draw?"
     3. "Is my floor fillet machinable with a standard cutter?"

   Core rules used:
     - Corner radius must be LARGER than the cutter radius. A radius that
       exactly equals a standard cutter radius forces the tool to stop
       and pivot in the corner (chatter, marks), so shops drop to the
       next smaller cutter, which is slower.
     - Recommended corner radius = 1.3 x cutter radius (rounded up).
     - Pocket depth / cutter diameter decides if a standard length
       cutter can reach (bands in cutter_data.js).
     - Floor radius should be smaller than the wall radius and match
       a flat (0), bullnose corner radius, or ball (cutter radius).
   ===================================================================== */

(function () {
  "use strict";

  const epsilon = 1e-9;                          // tolerance for "equal" comparisons

  // ---------- Number helpers ----------
  function roundUp(value, step) {
    // Round up to the next multiple of step (avoid float noise first)
    return Math.ceil((value - epsilon) / step) * step;
  }

  function format(value, unit) {
    // Inch values to 3 places, millimetres to 2 places, trailing zeros trimmed for mm
    if (unit === "in") {
      return value.toFixed(3) + " in";
    }
    return parseFloat(value.toFixed(2)) + " mm";
  }

  function nearlyEqual(a, b, unit) {
    // Treat values within 0.0005 in or 0.01 mm as equal (typing precision)
    const tol = unit === "in" ? 0.0005 : 0.01;
    return Math.abs(a - b) <= tol;
  }

  function readNumber(input) {
    // Empty or invalid input returns null so it can be treated as "not given"
    const value = parseFloat(input.value);
    return isFinite(value) && value >= 0 ? value : null;
  }

  // ---------- Reach band lookup ----------
  function reachBand(ratio, material) {
    const bands = window.DFM_CUTTERS.reachBands[material];
    for (let i = 0; i < bands.length; i += 1) {
      if (ratio <= bands[i].maxRatio) {
        return bands[i];
      }
    }
    return bands[bands.length - 1];
  }

  // ---------- Build the rows for every standard cutter ----------
  function buildRows(set, depth, material) {
    return set.diameters.map(function (cutter) {
      const toolRadius = cutter.value / 2;
      const minRadius = toolRadius + set.clearance;                          // just enough to keep cutting through the corner
      const recRadius = roundUp(toolRadius * window.DFM_CUTTERS.recommendFactor, set.roundStep); // comfortable sweep
      const ratio = depth > 0 ? depth / cutter.value : 0;                   // pocket depth in cutter diameters
      const band = reachBand(ratio, material);

      // Floor radius options this cutter family can leave
      const bullnose = set.cornerRadii.filter(function (r) {
        return r < toolRadius - epsilon;                                    // corner radius must be smaller than the tool radius
      });

      return {
        label: cutter.label,
        diameter: cutter.value,
        toolRadius: toolRadius,
        minRadius: minRadius,
        recRadius: recRadius,
        ratio: ratio,
        band: band,
        bullnoseMax: bullnose.length ? bullnose[bullnose.length - 1] : null
      };
    });
  }

  // ---------- Verdict for a radius the user already drew ----------
  function checkDesignedRadius(rows, set, radius, depth) {
    const unit = set.unit;
    const messages = [];
    let level = "good";

    // Largest cutter that can finish this corner (tool radius + clearance <= drawn radius)
    const usable = rows.filter(function (row) {
      return row.minRadius <= radius + epsilon;
    });
    const finishing = usable.length ? usable[usable.length - 1] : null;

    // Does the drawn radius exactly equal a standard cutter radius?
    const exactMatch = rows.find(function (row) {
      return nearlyEqual(row.toolRadius, radius, unit);
    });

    if (!finishing) {
      // Smaller than anything a standard cutter can do
      level = "bad";
      messages.push("<strong>" + format(radius, unit) + " is smaller than the smallest standard cutter can leave.</strong> " +
        "Use a corner relief (dog-bone) if a sharp mating part must fit, or increase the radius to at least " +
        format(rows[0].minRadius, unit) + ".");
      return { level: level, messages: messages, finishing: null };
    }

    if (exactMatch) {
      // The classic mistake: R = tool radius
      level = "warn";
      messages.push("<strong>" + format(radius, unit) + " equals the radius of a standard " + exactMatch.label + " " + unit +
        " cutter.</strong> That cutter would have to stop and pivot in the corner, so the shop will finish with the smaller " +
        finishing.label + " " + unit + " cutter instead (slower). Change the radius to <strong>" + format(exactMatch.recRadius, unit) +
        "</strong> (recommended) or at least " + format(exactMatch.minRadius, unit) + " to let the " + exactMatch.label +
        " cutter sweep the corner.");
    } else {
      messages.push("Finishing cutter: <strong>" + finishing.label + " " + unit + "</strong> (radius " +
        format(finishing.toolRadius, unit) + "). The corner is " +
        format(radius - finishing.toolRadius, unit) + " larger than the tool radius.");
      if (radius < finishing.recRadius - epsilon) {
        messages.push("Workable, but " + format(finishing.recRadius, unit) +
          " (1.3 x tool radius) gives a smoother corner and less chatter.");
      }
    }

    // Reach check with the finishing cutter
    if (depth > 0) {
      const band = finishing.band;
      messages.push("Depth " + format(depth, unit) + " is " + finishing.ratio.toFixed(1) + " x the " +
        finishing.label + " cutter diameter: <strong>" + band.label + "</strong>.");
      if (band.status === "warn" && level === "good") {
        level = "warn";
      }
      if (band.status === "bad") {
        level = "bad";
        // Suggest the radius that would make the depth reachable
        const reachable = rows.find(function (row) {
          return row.band.status === "good" || row.band.status === "ok";
        });
        if (reachable) {
          messages.push("To reach this depth with a standard-length cutter, use at least a " + reachable.label + " " + unit +
            " cutter, which means a corner radius of about <strong>" + format(reachable.recRadius, unit) + "</strong>.");
        }
      }

      // ProtoLabs cost tip: corner radius at least one third of the cavity depth
      if (radius < depth / 3 - epsilon) {
        messages.push("Cost tip: a corner radius of at least depth / 3 (" + format(depth / 3, unit) +
          ") lets a larger, faster cutter finish the pocket.");
      }
    }

    return { level: level, messages: messages, finishing: finishing };
  }

  // ---------- Recommendation when no radius was drawn yet ----------
  function recommend(rows, set, depth, maxRadius) {
    const unit = set.unit;
    const messages = [];

    // Candidate cutters: not "too deep", and within the largest radius the design allows
    const candidates = rows.filter(function (row) {
      const fitsDesign = maxRadius === null || row.recRadius <= maxRadius + epsilon;
      return row.band.status !== "bad" && fitsDesign;
    });

    if (candidates.length === 0) {
      messages.push("<strong>No standard cutter fits.</strong> The pocket is too deep for a cutter small enough to stay " +
        "inside the allowed radius. Options: make the pocket shallower, allow a larger radius, open the pocket from the other side, or use corner reliefs.");
      return { level: "bad", messages: messages, best: null };
    }

    let best = null;
    if (maxRadius !== null) {
      // A limit was given: the largest cutter inside the limit is the fastest choice
      best = candidates[candidates.length - 1];
    } else {
      // No limit: smallest cutter that still reaches economically = tightest cheap corner
      const statusOrder = ["good", "ok", "warn"];
      for (let i = 0; i < statusOrder.length && !best; i += 1) {
        best = candidates.find(function (row) {
          return row.band.status === statusOrder[i];
        }) || null;
      }
    }

    // Tightest radius that is still reachable at all
    const tightest = candidates[0];

    messages.push("Recommended: draw a <strong>" + format(best.recRadius, unit) + "</strong> corner radius so a <strong>" +
      best.label + " " + unit + "</strong> cutter can finish it (" + best.band.label.toLowerCase() + ").");
    if (tightest !== best) {
      messages.push("Tightest practical corner at this depth: " + format(tightest.minRadius, unit) + " to " +
        format(tightest.recRadius, unit) + " with a " + tightest.label + " " + unit + " cutter (" +
        tightest.band.label.toLowerCase() + ").");
    }
    if (maxRadius === null) {
      messages.push("Larger is cheaper: if the design allows a bigger radius, every step up lets a larger, faster cutter clear the pocket.");
    }
    messages.push("Avoid drawing exactly " + format(best.toolRadius, unit) + " (the " + best.label +
      " cutter's own radius). Use the same radius on every inside corner so one tool does them all.");

    const level = best.band.status === "warn" ? "warn" : "good";
    return { level: level, messages: messages, best: best };
  }

  // ---------- Floor fillet check ----------
  function checkFloor(rows, set, floorRadius, wallRadius) {
    const unit = set.unit;
    if (floorRadius === null) {
      return null;
    }
    if (floorRadius === 0) {
      return { level: "good", text: "Sharp floor (0 radius): cut with a flat end mill. Cheapest option." };
    }

    const messages = [];
    let level = "good";

    // Floor radius should be smaller than the wall radius
    if (wallRadius !== null && floorRadius >= wallRadius - epsilon) {
      level = "warn";
      messages.push("Floor radius (" + format(floorRadius, unit) + ") should be smaller than the wall corner radius (" +
        format(wallRadius, unit) + ") so one cutter can do both and blend through the corner.");
    }

    // Standard bullnose corner radius?
    const isBullnose = set.cornerRadii.some(function (r) {
      return nearlyEqual(r, floorRadius, unit);
    });
    // Ball end mill (radius = half a standard diameter)?
    const ball = rows.find(function (row) {
      return nearlyEqual(row.toolRadius, floorRadius, unit);
    });

    if (isBullnose) {
      messages.push(format(floorRadius, unit) + " matches a standard bullnose (corner radius) end mill: machined in the same pass as the walls.");
    } else if (ball) {
      messages.push(format(floorRadius, unit) + " matches a " + ball.label + " " + unit +
        " ball end mill. Works, but ball finishing is slower than a bullnose.");
      if (level === "good") {
        level = "ok";
      }
    } else {
      level = "warn";
      messages.push(format(floorRadius, unit) + " is not a standard bullnose or ball size, so it needs 3D profiling with a smaller ball mill (slow). " +
        "Use a standard value such as " + set.cornerRadii.slice(1, 6).map(function (r) {
          return format(r, unit);
        }).join(", ") + ", or no floor radius.");
    }

    return { level: level, text: messages.join(" ") };
  }

  // ---------- Render one tool instance ----------
  function renderTool(host) {
    const uid = "ct" + Math.random().toString(36).slice(2, 8);   // unique ids per instance

    host.classList.add("calc");
    host.innerHTML =
      (host.hasAttribute("data-hide-title") ? "" : '<h3>Inside corner &amp; pocket radius picker</h3>') +
      '<p class="table-note" style="margin:0 0 12px">Enter the pocket depth. Optionally enter the corner radius you drew to check it, ' +
      'the largest radius your design can tolerate, and a floor fillet.</p>' +
      '<div class="field-grid">' +
      '  <div class="field"><label for="' + uid + '-unit">Units</label>' +
      '    <select id="' + uid + '-unit"><option value="in">Inch</option><option value="mm">Metric (mm)</option></select></div>' +
      '  <div class="field"><label for="' + uid + '-mat">Material</label>' +
      '    <select id="' + uid + '-mat"><option value="soft">Aluminum, brass, plastic</option><option value="hard">Steel, stainless, titanium</option></select></div>' +
      '  <div class="field"><label for="' + uid + '-depth">Pocket / wall depth</label>' +
      '    <input id="' + uid + '-depth" type="number" step="any" min="0" placeholder="e.g. 0.75"></div>' +
      '  <div class="field"><label for="' + uid + '-radius">Corner radius you drew (optional)</label>' +
      '    <input id="' + uid + '-radius" type="number" step="any" min="0" placeholder="e.g. 0.125"></div>' +
      '  <div class="field"><label for="' + uid + '-max">Largest corner radius allowed (optional)</label>' +
      '    <input id="' + uid + '-max" type="number" step="any" min="0" placeholder="leave blank if any"></div>' +
      '  <div class="field"><label for="' + uid + '-floor">Floor fillet radius (optional, 0 = sharp)</label>' +
      '    <input id="' + uid + '-floor" type="number" step="any" min="0" placeholder="e.g. 0.030"></div>' +
      '</div>' +
      '<div id="' + uid + '-verdict"></div>' +
      '<div class="calc-row" id="' + uid + '-pad" hidden><button type="button" class="btn">Send result to pad</button></div>' +
      '<div id="' + uid + '-floor-out"></div>' +
      '<div class="table-wrap"><table id="' + uid + '-table"><thead><tr>' +
      '<th>Cutter dia</th><th class="num">Tool radius</th><th class="num">Min corner R</th><th class="num">Recommended R</th>' +
      '<th class="num">Depth / dia</th><th>Reach</th><th>Floor radius options</th></tr></thead><tbody></tbody></table></div>' +
      '<p class="table-note">Min corner R = tool radius + ' + '0.005 in / 0.1 mm clearance. Recommended R = 1.3 x tool radius, rounded up. ' +
      'Reach bands are general guidance for standard-length cutters; long-reach tools exist but cost time.</p>';

    // Element references
    const unitSel = host.querySelector("#" + uid + "-unit");
    const matSel = host.querySelector("#" + uid + "-mat");
    const depthIn = host.querySelector("#" + uid + "-depth");
    const radiusIn = host.querySelector("#" + uid + "-radius");
    const maxIn = host.querySelector("#" + uid + "-max");
    const floorIn = host.querySelector("#" + uid + "-floor");
    const verdictOut = host.querySelector("#" + uid + "-verdict");
    const floorOut = host.querySelector("#" + uid + "-floor-out");
    const tbody = host.querySelector("#" + uid + "-table tbody");

    let lastUnit = unitSel.value;                // used to convert inputs when units change
    let lastSummary = "";                        // plain-text result for the scratch pad

    // Show the "Send to pad" button only when a scratch pad exists on the page
    const padRow = host.querySelector("#" + uid + "-pad");
    if (window.DFM_PAD) {
      padRow.hidden = false;
      padRow.querySelector("button").addEventListener("click", function () {
        if (lastSummary) {
          window.DFM_PAD.append(lastSummary);
        }
      });
    }

    function update() {
      const unit = unitSel.value;
      const set = unit === "in" ? window.DFM_CUTTERS.inch : window.DFM_CUTTERS.metric;
      const material = matSel.value;
      const depth = readNumber(depthIn) || 0;
      const radius = readNumber(radiusIn);
      const maxRadius = readNumber(maxIn);
      const floorRadius = readNumber(floorIn);

      // Placeholders follow the unit
      depthIn.placeholder = unit === "in" ? "e.g. 0.75" : "e.g. 20";
      radiusIn.placeholder = unit === "in" ? "e.g. 0.125" : "e.g. 3";
      floorIn.placeholder = unit === "in" ? "e.g. 0.030" : "e.g. 0.5";

      const rows = buildRows(set, depth, material);

      // Main verdict: check a drawn radius, otherwise recommend one
      let result = null;
      let highlight = null;
      if (radius !== null && radius > 0) {
        result = checkDesignedRadius(rows, set, radius, depth);
        highlight = result.finishing;
      } else if (depth > 0) {
        result = recommend(rows, set, depth, maxRadius);
        highlight = result.best;
      }

      // Plain-text summary (tags stripped) for the scratch pad
      lastSummary = result ? "Corner check (" + unit + ", depth " + depth + "): " +
        result.messages.map(function (m) {
          return m.replace(/<[^>]+>/g, "");
        }).join(" ") : "";

      if (result) {
        verdictOut.innerHTML = '<div class="verdict ' + result.level + '">' + result.messages.map(function (m) {
          return "<p style=\"margin:0 0 6px\">" + m + "</p>";
        }).join("") + "</div>";
      } else {
        verdictOut.innerHTML = '<div class="verdict"><p style="margin:0">Enter a pocket depth to get a recommendation, or a corner radius to check it.</p></div>';
      }

      // Floor fillet verdict
      const wallRadius = radius !== null && radius > 0 ? radius : (highlight ? highlight.recRadius : null);
      const floorResult = checkFloor(rows, set, floorRadius, wallRadius);
      floorOut.innerHTML = floorResult ?
        '<div class="verdict ' + (floorResult.level === "ok" ? "" : floorResult.level) + '"><p style="margin:0"><strong>Floor:</strong> ' + floorResult.text + "</p></div>" : "";

      // Table of all cutters
      tbody.innerHTML = rows.map(function (row) {
        const statusClass = row.band.status === "good" ? "good" : (row.band.status === "bad" ? "bad" : "warn");
        const reach = depth > 0 ? '<span class="badge ' + statusClass + '">' + row.band.label + "</span>" : "-";
        const floorOpts = "Flat" + (row.bullnoseMax !== null ? ", bullnose to " + format(row.bullnoseMax, unit) : "") +
          ", ball " + format(row.toolRadius, unit);
        const isBest = highlight && highlight.label === row.label;
        return "<tr" + (isBest ? ' class="best"' : "") + ">" +
          "<td>" + row.label + " " + unit + "</td>" +
          '<td class="num">' + format(row.toolRadius, unit) + "</td>" +
          '<td class="num">' + format(row.minRadius, unit) + "</td>" +
          '<td class="num">' + format(row.recRadius, unit) + "</td>" +
          '<td class="num">' + (depth > 0 ? row.ratio.toFixed(1) + " x" : "-") + "</td>" +
          "<td>" + reach + "</td>" +
          "<td>" + floorOpts + "</td></tr>";
      }).join("");
    }

    // Convert typed values when the unit changes so the user does not retype
    unitSel.addEventListener("change", function () {
      const factor = unitSel.value === "mm" && lastUnit === "in" ? 25.4 : (unitSel.value === "in" && lastUnit === "mm" ? 1 / 25.4 : 1);
      [depthIn, radiusIn, maxIn, floorIn].forEach(function (input) {
        const value = readNumber(input);
        if (value !== null && factor !== 1) {
          input.value = parseFloat((value * factor).toFixed(unitSel.value === "in" ? 4 : 2));
        }
      });
      lastUnit = unitSel.value;
      update();
    });

    [matSel, depthIn, radiusIn, maxIn, floorIn].forEach(function (el) {
      el.addEventListener("input", update);
      el.addEventListener("change", update);
    });

    update();
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!window.DFM_CUTTERS) {
      return;                                    // data file missing
    }
    document.querySelectorAll("[data-corner-tool]").forEach(renderTool);
  });
})();
