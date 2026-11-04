/* =====================================================================
   Inside corner & pocket floor radius picker.
   Renders into every element with the attribute data-corner-tool.
   Needs js/data/cutter_data.js loaded first.

   What it answers:
     1. "I drew corner radius R in a pocket D deep - is that OK?"
     2. "My pocket is D deep - which corner radius should I draw?"
     3. "What floor fillet should I draw?" (suggested by default from the
        standard bullnose radii of the cutter that finishes the walls)

   Core rules used:
     - Corner radius must be LARGER than the cutter radius. A radius that
       exactly equals a standard cutter radius forces the tool to stop
       and pivot in the corner (chatter, marks), so shops drop to the
       next smaller cutter, which is slower.
     - Recommended corner radius = 1.3 x cutter radius (rounded up).
     - Pocket depth / cutter diameter decides if a standard length
       cutter can reach (bands in cutter_data.js).
     - Floor radius should be smaller than the wall radius and match a
       standard bullnose corner radius of the finishing cutter. Sharp (0)
       floors are rejected by many rapid prototyping services: never in
       hard metals, case by case in soft metals.
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
    const bandKey = material === "hard" ? "hard" : "soft";   // plastics reach like soft metals
    const bands = window.DFM_CUTTERS.reachBands[bandKey];
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

      // Standard bullnose corner radii offered for this diameter
      const bullnose = (cutter.bullnose || []).filter(function (r) {
        return r < toolRadius - epsilon;                                    // corner radius must be smaller than the tool radius
      });

      // Default floor suggestion: largest catalog radius up to about 15% of D, else the smallest offered
      const limit = cutter.value * window.DFM_CUTTERS.preferredFloorFraction;
      const fitting = bullnose.filter(function (r) {
        return r <= limit + epsilon;
      });
      const suggestedFloor = fitting.length ? fitting[fitting.length - 1] : (bullnose.length ? bullnose[0] : null);

      return {
        label: cutter.label,
        diameter: cutter.value,
        toolRadius: toolRadius,
        minRadius: minRadius,
        recRadius: recRadius,
        ratio: ratio,
        band: band,
        bullnose: bullnose,
        suggestedFloor: suggestedFloor
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
      return { level: level, messages: messages, finishing: null, exactMatch: null };
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

    return { level: level, messages: messages, finishing: finishing, exactMatch: exactMatch || null };
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

  // ---------- Floor fillet advice ----------
  // cutter = the row that finishes the walls (recommended or finishing cutter)
  function floorAdvice(rows, set, floorRadius, wallRadius, cutter, material) {
    const unit = set.unit;
    const policy = window.DFM_CUTTERS.sharpFloor[material];

    // List of this cutter's standard radii, suggested one in bold
    function optionList(row) {
      return row.bullnose.map(function (r) {
        return r === row.suggestedFloor ? "<strong>" + format(r, unit) + "</strong>" : format(r, unit);
      }).join(", ");
    }

    function suggestion(row) {
      if (!row || row.suggestedFloor === null) {
        return "";
      }
      return "Suggested floor radius: <strong>" + format(row.suggestedFloor, unit) + "</strong>, a standard bullnose on the " +
        row.label + " " + unit + " cutter that finishes the walls, so walls and floor are cut in one pass. " +
        "Other standard radii for this cutter: " + optionList(row) + ".";
    }

    // Nothing entered: suggest a floor radius by default
    if (floorRadius === null) {
      if (!cutter) {
        return null;                             // nothing to base a suggestion on yet
      }
      return { level: "good", text: suggestion(cutter) };
    }

    // Sharp floor: depends on material
    if (floorRadius === 0) {
      return { level: policy.status, text: "<strong>Sharp floor (0 radius).</strong> " + policy.text + " " + suggestion(cutter) };
    }

    const messages = [];
    let level = "good";

    // Floor radius must be smaller than the wall radius
    if (wallRadius !== null && floorRadius >= wallRadius - epsilon) {
      level = "warn";
      messages.push("Floor radius (" + format(floorRadius, unit) + ") should be smaller than the wall corner radius (" +
        format(wallRadius, unit) + ") so one cutter can do both and blend through the corner.");
    }

    // Best case: a standard bullnose radius on the cutter that finishes the walls
    const onCutter = cutter && cutter.bullnose.some(function (r) {
      return nearlyEqual(r, floorRadius, unit);
    });
    // Next best: a standard bullnose on some other cutter that still fits the wall radius
    const otherCutter = rows.find(function (row) {
      const fitsWall = wallRadius === null || row.minRadius <= wallRadius + epsilon;
      return fitsWall && row !== cutter && row.bullnose.some(function (r) {
        return nearlyEqual(r, floorRadius, unit);
      });
    });
    // Ball end mill (radius = half a standard diameter)
    const ball = rows.find(function (row) {
      return nearlyEqual(row.toolRadius, floorRadius, unit);
    });

    if (onCutter) {
      messages.push(format(floorRadius, unit) + " is a standard bullnose radius on the " + cutter.label + " " + unit +
        " cutter: walls and floor are machined in the same pass.");
    } else if (otherCutter) {
      if (level === "good") {
        level = "ok";
      }
      messages.push(format(floorRadius, unit) + " is a standard bullnose on a " + otherCutter.label + " " + unit +
        " cutter, not on the " + (cutter ? cutter.label + " " + unit : "wall") + " cutter, so it adds a tool. " + suggestion(cutter));
    } else if (ball) {
      level = "warn";
      messages.push(format(floorRadius, unit) + " matches a " + ball.label + " " + unit +
        " ball end mill. That means slower 3D finishing passes along the floor edge. " + suggestion(cutter));
    } else {
      level = "warn";
      messages.push(format(floorRadius, unit) + " is not a standard bullnose or ball size, so it needs 3D profiling with a small ball mill (slow). " +
        suggestion(cutter));
    }

    return { level: level, text: messages.join(" ") };
  }

  // ---------- Render one tool instance ----------
  function renderTool(host) {
    const uid = "ct" + Math.random().toString(36).slice(2, 8);   // unique ids per instance

    host.classList.add("calc");
    host.innerHTML =
      '<h3>Inside corner &amp; pocket radius picker</h3>' +
      '<p class="table-note" style="margin:0 0 12px">Enter the pocket depth. Optionally enter the corner radius you drew to check it, ' +
      'the largest radius your design can tolerate, and a floor fillet. A floor radius is suggested from standard bullnose cutters unless you enter one.</p>' +
      '<div class="field-grid">' +
      '  <div class="field"><label for="' + uid + '-unit">Units</label>' +
      '    <select id="' + uid + '-unit"><option value="in">Inch</option><option value="mm">Metric (mm)</option></select></div>' +
      '  <div class="field"><label for="' + uid + '-mat">Material</label>' +
      '    <select id="' + uid + '-mat"><option value="soft">Soft metal (aluminum, brass, copper)</option><option value="hard">Hard metal (steel, stainless, titanium)</option><option value="plastic">Plastic</option></select></div>' +
      '  <div class="field"><label for="' + uid + '-depth">Pocket / wall depth</label>' +
      '    <input id="' + uid + '-depth" type="number" step="any" min="0" placeholder="e.g. 0.75"></div>' +
      '  <div class="field"><label for="' + uid + '-radius">Corner radius you drew (optional)</label>' +
      '    <input id="' + uid + '-radius" type="number" step="any" min="0" placeholder="e.g. 0.125"></div>' +
      '  <div class="field"><label for="' + uid + '-max">Largest corner radius allowed (optional)</label>' +
      '    <input id="' + uid + '-max" type="number" step="any" min="0" placeholder="leave blank if any"></div>' +
      '  <div class="field"><label for="' + uid + '-floor">Floor fillet radius (blank = suggest one)</label>' +
      '    <input id="' + uid + '-floor" type="number" step="any" min="0" placeholder="e.g. 0.030"></div>' +
      '</div>' +
      '<div class="calc-out" id="' + uid + '-summary"></div>' +
      '<div id="' + uid + '-verdict"></div>' +
      '<div id="' + uid + '-floor-out"></div>' +
      '<div class="table-wrap"><table id="' + uid + '-table"><thead><tr>' +
      '<th>Cutter dia</th><th class="num">Tool radius</th><th class="num">Min corner R</th><th class="num">Recommended R</th>' +
      '<th class="num">Depth / dia</th><th>Reach</th><th class="num">Suggested floor R</th><th>Standard bullnose radii</th></tr></thead><tbody></tbody></table></div>' +
      '<p class="table-note">Min corner R = tool radius + ' + '0.005 in / 0.1 mm clearance. Recommended R = 1.3 x tool radius, rounded up. ' +
      'Reach bands are general guidance for standard-length cutters; long-reach tools exist but cost time. ' +
      'Bullnose radii are typical catalog sizes; check your shop or vendor tool list.</p>';

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

    const summaryOut = host.querySelector("#" + uid + "-summary");
    let lastUnit = unitSel.value;                // used to convert inputs when units change

    // Send to pad / All / None at the bottom of the card, like the other calculators
    host.appendChild(window.DFM.resultActions(summaryOut));

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

      // Floor fillet advice (a suggestion by default)
      const wallRadius = radius !== null && radius > 0 ? radius : (highlight ? highlight.recRadius : null);
      const floorResult = floorAdvice(rows, set, floorRadius, wallRadius, highlight, material);

      // "Label = value" summary rows (these are what can be sent to the pad)
      const items = [
        { key: "units", label: "Units", value: unit === "in" ? "inch" : "mm" },
        { key: "material", label: "Material", value: matSel.options[matSel.selectedIndex].text }
      ];
      if (depth > 0) {
        items.push({ key: "depth", label: "Pocket depth", value: format(depth, unit) });
      }
      if (radius !== null && radius > 0) {
        const status = !result.finishing ? "too small for standard cutters" :
          (result.exactMatch ? "equals " + result.exactMatch.label + " " + unit + " cutter radius" : "OK");
        const target = result.exactMatch || result.finishing;
        items.push({ key: "drawn", label: "Corner R drawn", value: format(radius, unit) });
        items.push({ key: "status", label: "Corner check", value: status });
        if (target) {
          items.push({ key: "rec", label: "Recommended corner R", value: format(target.recRadius, unit), big: true });
          items.push({ key: "min", label: "Min corner R", value: format(target.minRadius, unit) });
        }
        if (result.finishing) {
          items.push({ key: "cutter", label: "Finishing cutter", value: result.finishing.label + " " + unit });
        }
      } else if (highlight) {
        items.push({ key: "rec", label: "Recommended corner R", value: format(highlight.recRadius, unit), big: true });
        items.push({ key: "min", label: "Min corner R", value: format(highlight.minRadius, unit) });
        items.push({ key: "cutter", label: "Cutter", value: highlight.label + " " + unit });
      }
      if (highlight && depth > 0) {
        items.push({ key: "reach", label: "Reach", value: highlight.ratio.toFixed(1) + " x dia, " + highlight.band.label.toLowerCase() });
      }
      if (floorRadius === null && highlight && highlight.suggestedFloor !== null) {
        items.push({ key: "floor", label: "Floor R (suggested)", value: format(highlight.suggestedFloor, unit) });
      } else if (floorRadius !== null) {
        items.push({ key: "floor", label: "Floor R", value: format(floorRadius, unit) });
        if (floorResult) {
          const floorWords = { good: "OK", ok: "OK, adds a tool", warn: "check", bad: "not accepted" };
          items.push({ key: "floorcheck", label: "Floor check", value: floorWords[floorResult.level] || floorResult.level });
        }
      }
      window.DFM.renderResults(summaryOut, "corner-picker", items);

      if (result) {
        verdictOut.innerHTML = '<div class="verdict ' + result.level + '">' + result.messages.map(function (m) {
          return "<p style=\"margin:0 0 6px\">" + m + "</p>";
        }).join("") + "</div>";
      } else {
        verdictOut.innerHTML = '<div class="verdict"><p style="margin:0">Enter a pocket depth to get a recommendation, or a corner radius to check it.</p></div>';
      }

      // Floor fillet verdict
      floorOut.innerHTML = floorResult ?
        '<div class="verdict ' + (floorResult.level === "ok" ? "" : floorResult.level) + '"><p style="margin:0"><strong>Floor:</strong> ' + floorResult.text + "</p></div>" : "";

      // Table of all cutters
      tbody.innerHTML = rows.map(function (row) {
        const statusClass = row.band.status === "good" ? "good" : (row.band.status === "bad" ? "bad" : "warn");
        const reach = depth > 0 ? '<span class="badge ' + statusClass + '">' + row.band.label + "</span>" : "-";
        const floorOpts = row.bullnose.length ? row.bullnose.map(function (r) {
          return format(r, unit).replace(" " + unit, "");
        }).join(", ") + " " + unit : "-";
        const floorSuggest = row.suggestedFloor !== null ? format(row.suggestedFloor, unit) : "-";
        const isBest = highlight && highlight.label === row.label;
        return "<tr" + (isBest ? ' class="best"' : "") + ">" +
          "<td>" + row.label + " " + unit + "</td>" +
          '<td class="num">' + format(row.toolRadius, unit) + "</td>" +
          '<td class="num">' + format(row.minRadius, unit) + "</td>" +
          '<td class="num">' + format(row.recRadius, unit) + "</td>" +
          '<td class="num">' + (depth > 0 ? row.ratio.toFixed(1) + " x" : "-") + "</td>" +
          "<td>" + reach + "</td>" +
          '<td class="num">' + floorSuggest + "</td>" +
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
