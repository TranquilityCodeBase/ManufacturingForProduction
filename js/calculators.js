/* =====================================================================
   Calculators page: unit converters, part mass, fraction / drill finder,
   percent thread, countersink and drill point cards. Needs
   js/data/tap_drill_data.js for drill and thread sizes. The scratch pad
   itself lives in js/scratch_pad.js (shared by every page).
   Results are shown as "Label = value" rows (window.DFM.renderResults in
   main.js). Each row has a checkbox; "Send to pad" appends only the
   checked rows to the scratch pad, one per line.
   Each card remembers its last inputs (localStorage, this browser only).
   ===================================================================== */

(function () {
  "use strict";

  // ---------- Unit definitions: factor converts the unit to the base unit ----------
  // short = text used in results and pad lines, label = text in the unit list,
  // sys = "imp" (inch / pound units) or "met" (metric), used by Fixed decimals
  const converters = [
    {
      id: "length",
      title: "Length",
      defaultUnit: "in",
      units: [
        { id: "in", short: "in", label: "in", factor: 25.4, sys: "imp" },
        { id: "ft", short: "ft", label: "ft", factor: 304.8, sys: "imp" },
        { id: "thou", short: "thou", label: "thou (0.001 in)", factor: 0.0254, sys: "imp" },
        { id: "mm", short: "mm", label: "mm", factor: 1, sys: "met" },
        { id: "cm", short: "cm", label: "cm", factor: 10, sys: "met" },
        { id: "m", short: "m", label: "m", factor: 1000, sys: "met" },
        { id: "um", short: "µm", label: "µm (micron)", factor: 0.001, sys: "met" }
      ]
    },
    {
      id: "speed",
      title: "Speed / feed rate",
      defaultUnit: "mms",
      units: [
        { id: "mms", short: "mm/s", label: "mm/s", factor: 1, sys: "met" },
        { id: "mmmin", short: "mm/min", label: "mm/min", factor: 1 / 60, sys: "met" },
        { id: "mmin", short: "m/min", label: "m/min (SMM)", factor: 1000 / 60, sys: "met" },
        { id: "ms", short: "m/s", label: "m/s", factor: 1000, sys: "met" },
        { id: "ips", short: "in/s", label: "in/s", factor: 25.4, sys: "imp" },
        { id: "ipm", short: "IPM", label: "IPM (in/min)", factor: 25.4 / 60, sys: "imp" },
        { id: "sfm", short: "ft/min", label: "ft/min (SFM)", factor: 304.8 / 60, sys: "imp" },
        { id: "fps", short: "ft/s", label: "ft/s", factor: 304.8, sys: "imp" }
      ]
    },
    {
      id: "mass",
      title: "Mass / weight",
      defaultUnit: "lb",
      units: [
        { id: "lb", short: "lb", label: "lb", factor: 453.59237, sys: "imp" },
        { id: "oz", short: "oz", label: "oz", factor: 28.349523125, sys: "imp" },
        { id: "g", short: "g", label: "g", factor: 1, sys: "met" },
        { id: "kg", short: "kg", label: "kg", factor: 1000, sys: "met" }
      ]
    },
    {
      id: "force",
      title: "Force",
      defaultUnit: "lbf",
      units: [
        { id: "lbf", short: "lbf", label: "lbf", factor: 4.4482216, sys: "imp" },
        { id: "N", short: "N", label: "N", factor: 1, sys: "met" },
        { id: "kN", short: "kN", label: "kN", factor: 1000, sys: "met" },
        { id: "kgf", short: "kgf", label: "kgf", factor: 9.80665, sys: "met" }
      ]
    },
    {
      id: "torque",
      title: "Torque",
      defaultUnit: "inlb",
      units: [
        { id: "inlb", short: "in·lbf", label: "in·lbf", factor: 0.112984829, sys: "imp" },
        { id: "ftlb", short: "ft·lbf", label: "ft·lbf", factor: 1.355817948, sys: "imp" },
        { id: "Nm", short: "N·m", label: "N·m", factor: 1, sys: "met" },
        { id: "Ncm", short: "N·cm", label: "N·cm", factor: 0.01, sys: "met" }
      ]
    },
    {
      id: "pressure",
      title: "Pressure / stress",
      defaultUnit: "psi",
      units: [
        { id: "psi", short: "psi", label: "psi", factor: 6.894757, sys: "imp" },
        { id: "ksi", short: "ksi", label: "ksi", factor: 6894.757, sys: "imp" },
        { id: "kPa", short: "kPa", label: "kPa", factor: 1, sys: "met" },
        { id: "MPa", short: "MPa", label: "MPa (N/mm²)", factor: 1000, sys: "met" },
        { id: "bar", short: "bar", label: "bar", factor: 100, sys: "met" }
      ]
    },
    {
      id: "volume",
      title: "Volume",
      defaultUnit: "in3",
      units: [
        { id: "in3", short: "in³", label: "in³", factor: 16.387064, sys: "imp" },
        { id: "cm3", short: "cm³", label: "cm³ (mL)", factor: 1, sys: "met" },
        { id: "mm3", short: "mm³", label: "mm³", factor: 0.001, sys: "met" },
        { id: "L", short: "L", label: "L", factor: 1000, sys: "met" },
        { id: "galUS", short: "US gal", label: "US gal", factor: 3785.411784, sys: "imp" }
      ]
    }
  ];

  // ---------- Material densities in g/cm³ (typical published values) ----------
  const densities = [
    { group: "Aluminum", name: "Aluminum 6061", value: 2.70 },
    { group: "Aluminum", name: "Aluminum 7075", value: 2.81 },
    { group: "Aluminum", name: "Aluminum MIC-6 cast plate", value: 2.65 },
    { group: "Steel", name: "Steel 1018 / A36", value: 7.87 },
    { group: "Steel", name: "Steel 4140", value: 7.85 },
    { group: "Stainless", name: "Stainless 303 / 304", value: 8.00 },
    { group: "Stainless", name: "Stainless 316", value: 8.00 },
    { group: "Stainless", name: "Stainless 17-4 PH", value: 7.80 },
    { group: "Other metals", name: "Brass C360", value: 8.50 },
    { group: "Other metals", name: "Copper C101 / C110", value: 8.94 },
    { group: "Other metals", name: "Titanium Ti-6Al-4V", value: 4.43 },
    { group: "Other metals", name: "Inconel 718", value: 8.19 },
    { group: "Plastics", name: "ABS", value: 1.05 },
    { group: "Plastics", name: "Acetal / Delrin (POM)", value: 1.41 },
    { group: "Plastics", name: "Nylon 6/6", value: 1.14 },
    { group: "Plastics", name: "Polycarbonate", value: 1.20 },
    { group: "Plastics", name: "Acrylic (PMMA)", value: 1.18 },
    { group: "Plastics", name: "PEEK", value: 1.30 },
    { group: "Plastics", name: "UHMW-PE", value: 0.93 },
    { group: "Plastics", name: "PTFE (Teflon)", value: 2.20 },
    { group: "3D printing", name: "PLA (solid)", value: 1.24 },
    { group: "3D printing", name: "PETG (solid)", value: 1.27 },
    { group: "3D printing", name: "PA12 nylon (SLS / MJF)", value: 1.01 },
    { group: "3D printing", name: "Standard SLA resin (approx.)", value: 1.15 },
    { group: "3D printing", name: "AlSi10Mg (DMLS)", value: 2.67 }
  ];

  // ---------- Remembered card inputs ----------
  const stateKey = "dfm-calc-state";            // one JSON object: { cardId: { field: value } }
  const decimalsKey = "dfm-calc-decimals";      // "auto" or "fixed"

  function loadState(cardId) {
    try {
      const all = JSON.parse(window.DFM.readSetting(stateKey) || "{}") || {};
      return all[cardId] || {};
    } catch (error) {
      return {};
    }
  }

  function saveState(cardId, values) {
    let all = {};
    try {
      all = JSON.parse(window.DFM.readSetting(stateKey) || "{}") || {};
    } catch (error) {
      all = {};
    }
    all[cardId] = values;
    window.DFM.writeSetting(stateKey, JSON.stringify(all));
  }

  function restoreSelect(select, value) {
    // Only restore values that still exist in the list
    if (value !== undefined && Array.prototype.some.call(select.options, function (o) {
      return o.value === value;
    })) {
      select.value = value;
    }
  }

  // ---------- Number formatting ----------
  // Auto  = up to 6 significant digits (default).
  // Fixed = inch / pound units 4 decimal places, metric units 3 decimal places.
  let decimalsMode = "auto";
  const updaters = [];                           // every card's update(), re-run when the mode changes

  function niceNumber(value) {
    // Show up to 6 significant digits without scientific notation for normal ranges
    if (!isFinite(value)) {
      return "-";
    }
    const abs = Math.abs(value);
    if (abs !== 0 && (abs < 0.0001 || abs >= 1e9)) {
      return value.toExponential(4);
    }
    return parseFloat(value.toPrecision(6)).toString();
  }

  function formatValue(value, sys) {
    if (decimalsMode === "fixed" && isFinite(value)) {
      return value.toFixed(sys === "imp" ? 4 : 3);
    }
    return niceNumber(value);
  }

  // Inch lengths to 4 places, millimetres to 3 (used by the hole calculators)
  function lengthText(value, unit) {
    return value.toFixed(unit === "in" ? 4 : 3) + " " + unit;
  }

  // ---------- Text input parsing (fractions allowed) ----------
  function parseNumberText(text) {
    // Accepts 0.75, .75, 3/16, 1-3/16 or 1 3/16; returns null for anything else
    const clean = String(text).trim().replace(/"/g, "");
    if (!clean) {
      return null;
    }
    const mixed = clean.match(/^(\d+)[\s-]+(\d+)\/(\d+)$/);   // 1-3/16 or 1 3/16
    const frac = clean.match(/^(\d+)\/(\d+)$/);               // 3/16
    let value = null;
    if (mixed) {
      value = parseInt(mixed[1], 10) + parseInt(mixed[2], 10) / parseInt(mixed[3], 10);
    } else if (frac) {
      value = parseInt(frac[1], 10) / parseInt(frac[2], 10);
    } else if (/^-?\d*\.?\d+$/.test(clean) || /^-?\d+\.$/.test(clean)) {
      value = parseFloat(clean);
    }
    return value !== null && isFinite(value) ? value : null;
  }

  function parseLength(text, unit) {
    // Same as parseNumberText, returned in inches (unit = unit of the typed number)
    const value = parseNumberText(text);
    if (value === null) {
      return null;
    }
    return unit === "mm" ? value / 25.4 : value;
  }

  // ---------- Card helpers ----------
  // Builds a calculator card: title, input row(s), result list, and the pad buttons.
  // inputsHtml = markup for the inputs; returns the result list element.
  function buildCard(host, title, inputsHtml, note) {
    host.innerHTML = "<h3>" + title + "</h3>" +
      (note ? '<p class="table-note" style="margin:0 0 10px">' + note + "</p>" : "") +
      inputsHtml + '<div class="calc-out"></div>';
    const out = host.querySelector(".calc-out");
    host.appendChild(window.DFM.resultActions(out));
    return out;
  }

  // Shows a message instead of results (bad input)
  function showMessage(out, calcId, text) {
    window.DFM.renderResults(out, calcId, [{ key: "msg", label: "Input", value: text }]);
  }

  // Input and unit select on one row: the input takes the space, the select keeps its width
  const inputStyle = ' style="flex:1 1 90px;min-width:0"';
  const selectStyle = ' style="flex:0 0 auto;max-width:55%"';

  // ---------- Generic converter card ----------
  function renderConverter(host, def) {
    const saved = loadState(def.id);
    const options = def.units.map(function (u) {
      return '<option value="' + u.id + '"' + (u.id === def.defaultUnit ? " selected" : "") + ">" + u.label + "</option>";
    }).join("");

    const out = buildCard(host, def.title,
      '<div class="calc-row" style="flex-wrap:nowrap"><input type="number" step="any" value="1" aria-label="' + def.title + ' value"' + inputStyle + ">" +
      '<select aria-label="' + def.title + ' unit"' + selectStyle + ">" + options + "</select></div>");
    const input = host.querySelector("input");
    const select = host.querySelector("select");
    if (saved.value !== undefined) {
      input.value = saved.value;
    }
    restoreSelect(select, saved.unit);

    function update() {
      saveState(def.id, { value: input.value, unit: select.value });
      const value = parseFloat(input.value);
      const from = def.units.find(function (u) {
        return u.id === select.value;
      });
      if (!isFinite(value)) {
        showMessage(out, def.id, "enter a number");
        return;
      }
      const baseValue = value * from.factor;                    // convert to base unit first
      // First row is the entered value, then one row per other unit
      const items = [{ key: "input", label: def.title, value: niceNumber(value) + " " + from.short, big: true }];
      def.units.forEach(function (u) {
        if (u.id !== from.id) {
          items.push({ key: u.id, label: u.short, value: formatValue(baseValue / u.factor, u.sys) });
        }
      });
      window.DFM.renderResults(out, def.id, items);
    }

    input.addEventListener("input", update);
    select.addEventListener("change", update);
    updaters.push(update);
    update();
  }

  // ---------- Temperature (offset units, so it is its own card) ----------
  function renderTemperature(host) {
    const saved = loadState("temperature");
    const out = buildCard(host, "Temperature",
      '<div class="calc-row" style="flex-wrap:nowrap"><input type="number" step="any" value="70" aria-label="Temperature"' + inputStyle + ">" +
      '<select aria-label="Temperature unit"' + selectStyle + '><option value="F">°F</option><option value="C">°C</option><option value="K">K</option></select></div>');
    const input = host.querySelector("input");
    const select = host.querySelector("select");
    if (saved.value !== undefined) {
      input.value = saved.value;
    }
    restoreSelect(select, saved.unit);

    function update() {
      saveState("temperature", { value: input.value, unit: select.value });
      const value = parseFloat(input.value);
      if (!isFinite(value)) {
        showMessage(out, "temperature", "enter a number");
        return;
      }
      // Convert everything through Celsius
      let celsius = value;
      if (select.value === "F") {
        celsius = (value - 32) * 5 / 9;
      } else if (select.value === "K") {
        celsius = value - 273.15;
      }
      const all = [
        { key: "C", label: "°C", value: formatValue(celsius, "met") },
        { key: "F", label: "°F", value: formatValue(celsius * 9 / 5 + 32, "imp") },
        { key: "K", label: "K", value: formatValue(celsius + 273.15, "met") }
      ];
      const items = [{ key: "input", label: "Temperature", value: niceNumber(value) + " " + (select.value === "K" ? "K" : "°" + select.value), big: true }]
        .concat(all.filter(function (item) {
          return item.key !== select.value;
        }));
      window.DFM.renderResults(out, "temperature", items);
    }

    input.addEventListener("input", update);
    select.addEventListener("change", update);
    updaters.push(update);
    update();
  }

  // ---------- Part mass from CAD volume ----------
  function renderPartMass(host) {
    const saved = loadState("mass-part");
    // Group densities into <optgroup>s for an easy pick list
    const groups = {};
    densities.forEach(function (d, index) {
      groups[d.group] = groups[d.group] || [];
      groups[d.group].push('<option value="' + index + '">' + d.name + " (" + d.value + " g/cm³)</option>");
    });
    const matOptions = Object.keys(groups).map(function (g) {
      return '<optgroup label="' + g + '">' + groups[g].join("") + "</optgroup>";
    }).join("") + '<option value="custom">Custom density...</option>';

    const out = buildCard(host, "Part mass from CAD volume",
      '<div class="calc-row" style="flex-wrap:nowrap"><input type="number" step="any" value="1" aria-label="Volume"' + inputStyle + ">" +
      '<select aria-label="Volume unit"' + selectStyle + '><option value="in3">in³</option><option value="cm3">cm³</option><option value="mm3">mm³</option></select></div>' +
      '<div class="calc-row"><select aria-label="Material" style="flex:1 1 100%">' + matOptions + "</select></div>" +
      '<div class="calc-row custom-density" hidden><input type="number" step="any" value="1.00" aria-label="Custom density"><span>g/cm³</span></div>' +
      '<div class="calc-row"><label>Quantity <input type="number" min="1" step="1" value="1" style="width:90px" aria-label="Quantity"></label></div>',
      "Copy the volume from your CAD mass properties, pick a material, get the weight.");

    const inputs = host.querySelectorAll("input");
    const volumeIn = inputs[0];
    const customIn = inputs[1];
    const qtyIn = inputs[2];
    const selects = host.querySelectorAll("select");
    const volUnit = selects[0];
    const matSel = selects[1];
    const customRow = host.querySelector(".custom-density");
    const volumeToCm3 = { in3: 16.387064, cm3: 1, mm3: 0.001 };   // unit -> cm³ factor
    const volumeLabel = { in3: "in³", cm3: "cm³", mm3: "mm³" };

    // Restore the last inputs
    if (saved.volume !== undefined) {
      volumeIn.value = saved.volume;
    }
    if (saved.custom !== undefined) {
      customIn.value = saved.custom;
    }
    if (saved.qty !== undefined) {
      qtyIn.value = saved.qty;
    }
    restoreSelect(volUnit, saved.volUnit);
    restoreSelect(matSel, saved.material);

    function update() {
      saveState("mass-part", { volume: volumeIn.value, custom: customIn.value, qty: qtyIn.value, volUnit: volUnit.value, material: matSel.value });
      const volume = parseFloat(volumeIn.value);
      const qty = Math.max(1, parseInt(qtyIn.value, 10) || 1);
      const isCustom = matSel.value === "custom";
      customRow.style.display = isCustom ? "" : "none";   // .calc-row sets display, so [hidden] alone is not enough
      const density = isCustom ? parseFloat(customIn.value) : densities[parseInt(matSel.value, 10)].value;
      const matName = isCustom ? "Custom" : densities[parseInt(matSel.value, 10)].name;
      if (!isFinite(volume) || !isFinite(density)) {
        showMessage(out, "mass-part", "enter volume and density");
        return;
      }
      const cm3 = volume * volumeToCm3[volUnit.value];    // volume in cm³
      const grams = cm3 * density * qty;                   // mass = volume x density
      const items = [
        { key: "volume", label: "Volume", value: niceNumber(volume) + " " + volumeLabel[volUnit.value] },
        { key: "material", label: "Material", value: matName },
        { key: "density", label: "Density", value: niceNumber(density) + " g/cm³" },
        { key: "qty", label: "Quantity", value: String(qty) },
        { key: "g", label: "Mass (g)", value: formatValue(grams, "met"), big: true },
        { key: "kg", label: "Mass (kg)", value: formatValue(grams / 1000, "met") },
        { key: "lb", label: "Mass (lb)", value: formatValue(grams / 453.59237, "imp") },
        { key: "oz", label: "Mass (oz)", value: formatValue(grams / 28.349523125, "imp") }
      ];
      if (qty > 1) {
        items.push({ key: "each", label: "Mass each (g)", value: formatValue(grams / qty, "met") });
      }
      window.DFM.renderResults(out, "mass-part", items);
    }

    [volumeIn, customIn, qtyIn].forEach(function (el) {
      el.addEventListener("input", update);
    });
    [volUnit, matSel].forEach(function (el) {
      el.addEventListener("change", update);
    });
    updaters.push(update);
    update();
  }

  // ---------- Fractions and standard drills ----------
  function nearestFraction(inches, denominator) {
    // Closest fraction with the given denominator, reduced to lowest terms
    const whole = Math.floor(inches);
    let numerator = Math.round((inches - whole) * denominator);
    let den = denominator;
    let w = whole;
    if (numerator === den) {
      w += 1;
      numerator = 0;
    }
    while (numerator > 0 && numerator % 2 === 0 && den > 1) {
      numerator /= 2;
      den /= 2;
    }
    const text = numerator === 0 ? String(w) : (w > 0 ? w + "-" : "") + numerator + "/" + den;
    const value = w + numerator / den;
    return { text: text, value: value };
  }

  let drillList = null;                          // built once on first use

  function buildDrillList() {
    // Every standard drill: fractional 1/64 steps to 1 in, number, letter, metric
    if (drillList) {
      return drillList;
    }
    const list = [];
    for (let n = 1; n <= 64; n += 1) {
      const f = nearestFraction(n / 64, 64);
      list.push({ name: f.text + " in", inches: n / 64, type: "Fractional" });
    }
    const data = window.DFM_TAP_DRILLS || { numberDrills: [], letterDrills: [] };
    data.numberDrills.forEach(function (d) {
      list.push({ name: d[0], inches: d[1], type: "Number" });
    });
    data.letterDrills.forEach(function (d) {
      list.push({ name: "Letter " + d[0], inches: d[1], type: "Letter" });
    });
    // Metric drills: 0.1 mm steps to 10 mm, then 0.5 mm steps to 25 mm
    for (let tenths = 5; tenths <= 100; tenths += 1) {
      const mm = tenths / 10;
      list.push({ name: mm.toFixed(1) + " mm", inches: mm / 25.4, type: "Metric" });
    }
    for (let halves = 21; halves <= 50; halves += 1) {
      const mm = halves / 2;
      list.push({ name: mm.toFixed(1) + " mm", inches: mm / 25.4, type: "Metric" });
    }
    drillList = list;
    return list;
  }

  function closestDrills(inches, count, system) {
    // The standard drills nearest to a size, closest first.
    // system: "inch" = fractional, number and letter drills only; "metric" = metric only; omitted = all
    return buildDrillList().filter(function (d) {
      return !system || (system === "metric" ? d.type === "Metric" : d.type !== "Metric");
    }).map(function (d) {
      return { d: d, diff: d.inches - inches };
    }).sort(function (a, b) {
      return Math.abs(a.diff) - Math.abs(b.diff);
    }).slice(0, count);
  }

  function signed(value, places) {
    return (value >= 0 ? "+" : "") + value.toFixed(places);
  }

  function renderDrillFinder(host) {
    const saved = loadState("drill-finder");
    const out = buildCard(host, "Fraction, decimal &amp; nearest drill",
      '<div class="calc-row" style="flex-wrap:nowrap"><input type="text" value="0.201" aria-label="Size"' + inputStyle + ">" +
      '<select aria-label="Unit"' + selectStyle + '><option value="in">in</option><option value="mm">mm</option></select></div>',
      "Type 0.201, 13/64, 1-3/16 or a metric size. Shows the nearest fractions and the closest standard drills.");
    const input = host.querySelector("input");
    const select = host.querySelector("select");
    if (saved.text !== undefined) {
      input.value = saved.text;
    }
    restoreSelect(select, saved.unit);
    const rank = ["Closest drill", "2nd closest", "3rd closest", "4th closest"];

    function update() {
      saveState("drill-finder", { text: input.value, unit: select.value });
      const inches = parseLength(input.value, select.value);
      if (inches === null || inches <= 0) {
        showMessage(out, "drill-finder", "enter a size");
        return;
      }
      const items = [
        { key: "in", label: "Size (in)", value: inches.toFixed(4), big: true },
        { key: "mm", label: "Size (mm)", value: (inches * 25.4).toFixed(3) }
      ];
      [64, 32, 16].forEach(function (den) {
        const f = nearestFraction(inches, den);
        items.push({ key: "f" + den, label: "Nearest 1/" + den, value: f.text + " in (" + signed(f.value - inches, 4) + ")" });
      });

      // Four closest drills of any type
      closestDrills(inches, 4).forEach(function (n, i) {
        items.push({
          key: "drill" + i,
          label: rank[i],
          value: n.d.name + "  " + n.d.inches.toFixed(4) + " in / " + (n.d.inches * 25.4).toFixed(2) + " mm (" + signed(n.diff, 4) + ")"
        });
      });
      window.DFM.renderResults(out, "drill-finder", items);
    }

    input.addEventListener("input", update);
    select.addEventListener("change", update);
    updaters.push(update);
    update();
  }

  // ---------- Percent thread from a chosen drill ----------
  // Inch:   % thread = TPI x (major - drill) / 0.01299
  // Metric: % thread = 76.98 x (major - drill) / pitch   (mm)
  function parseDrill(text, unit) {
    // Returns the drill diameter in inches: "#7", "F" / "Letter F", "13/64", "0.201", "5.1 mm"
    const clean = String(text).trim();
    if (!clean) {
      return null;
    }
    const data = window.DFM_TAP_DRILLS || { numberDrills: [], letterDrills: [] };
    const number = clean.match(/^(?:#|no\.?\s*)(\d{1,2})$/i);              // number drill
    if (number) {
      const found = data.numberDrills.find(function (d) {
        return d[0] === "#" + parseInt(number[1], 10);
      });
      return found ? found[1] : null;
    }
    const letter = clean.match(/^(?:letter\s*)?([a-z])$/i);                // letter drill
    if (letter) {
      const found = data.letterDrills.find(function (d) {
        return d[0] === letter[1].toUpperCase();
      });
      return found ? found[1] : null;
    }
    const withUnit = clean.match(/^(.+?)\s*(mm|in)$/i);                    // a typed unit wins over the list
    if (withUnit) {
      return parseLength(withUnit[1], withUnit[2].toLowerCase());
    }
    if (clean.indexOf("/") !== -1) {
      return parseLength(clean, "in");                                     // fractions are always inches
    }
    return parseLength(clean, unit);
  }

  function threadOptions() {
    // <optgroup> per thread series; option value "i:index" (inch) or "m:index" (metric)
    const data = window.DFM_TAP_DRILLS || { inch: [], metric: [] };
    const groups = {};
    const order = [];
    function add(group, value, text) {
      if (!groups[group]) {
        groups[group] = [];
        order.push(group);
      }
      groups[group].push('<option value="' + value + '">' + text + "</option>");
    }
    data.inch.forEach(function (r, i) {
      add(r[3], "i:" + i, r[0] + "-" + r[2] + " " + r[3]);
    });
    data.metric.forEach(function (r, i) {
      add("Metric " + r[2].toLowerCase(), "m:" + i, r[0] + " x " + r[1]);
    });
    return order.map(function (g) {
      return '<optgroup label="' + g + '">' + groups[g].join("") + "</optgroup>";
    }).join("");
  }

  function ratePercent(pct) {
    // Verdict for a percent thread value
    if (pct > 100) {
      return { cls: "bad", text: "Not possible: drill is below the minor diameter" };
    }
    if (pct > 85) {
      return { cls: "bad", text: "Too tight: hard tapping, high tap breakage risk" };
    }
    if (pct > 80) {
      return { cls: "warn", text: "Tight: OK in soft material, hard to tap in steel" };
    }
    if (pct >= 55) {
      return { cls: "good", text: "Normal" };
    }
    if (pct >= 50) {
      return { cls: "warn", text: "Light: acceptable in hard materials or thin parts" };
    }
    return { cls: "bad", text: "Weak: too little engagement" };
  }

  function renderPercentThread(host) {
    const saved = loadState("percent-thread");
    const out = buildCard(host, "Percent thread from a chosen drill",
      '<div class="calc-row"><select aria-label="Thread" style="flex:1 1 100%">' + threadOptions() + "</select></div>" +
      '<div class="calc-row" style="flex-wrap:nowrap"><input type="text" value="#7" aria-label="Drill size"' + inputStyle + ">" +
      '<select aria-label="Drill unit"' + selectStyle + '><option value="in">in</option><option value="mm">mm</option></select></div>' +
      '<div class="pt-verdict" style="margin:0 0 8px"></div>',
      "Drill as #7, F, 13/64, 0.201 or 5.1 mm. 75% thread suits aluminum, brass and plastics; 50-65% is easier to tap in steel and stainless with little loss of strength.");
    const threadSel = host.querySelector('select[aria-label="Thread"]');
    const drillIn = host.querySelector("input");
    const unitSel = host.querySelector('select[aria-label="Drill unit"]');
    const verdict = host.querySelector(".pt-verdict");
    restoreSelect(threadSel, saved.thread || "i:20");      // default 1/4-20 UNC
    if (saved.drill !== undefined) {
      drillIn.value = saved.drill;
    }
    restoreSelect(unitSel, saved.unit);

    function update() {
      saveState("percent-thread", { thread: threadSel.value, drill: drillIn.value, unit: unitSel.value });
      const data = window.DFM_TAP_DRILLS;
      const parts = threadSel.value.split(":");
      const isInch = parts[0] === "i";
      const row = isInch ? data.inch[parseInt(parts[1], 10)] : data.metric[parseInt(parts[1], 10)];
      const drillInches = parseDrill(drillIn.value, unitSel.value);
      if (!row || drillInches === null || drillInches <= 0) {
        verdict.innerHTML = "";
        showMessage(out, "percent-thread", "enter a drill size");
        return;
      }

      // Thread geometry in its own units (inch or mm)
      const unit = isInch ? "in" : "mm";
      const major = isInch ? row[1] : parseFloat(row[0].slice(1));
      const drill = isInch ? drillInches : drillInches * 25.4;
      const name = isInch ? row[0] + "-" + row[2] + " " + row[3] : row[0] + " x " + row[1];
      const pctFor = function (d) {
        return isInch ? row[2] * (major - d) / 0.01299 : 76.98 * (major - d) / row[1];
      };
      const drillFor = function (pct) {
        return isInch ? major - pct * 0.01299 / row[2] : major - pct * row[1] / 76.98;
      };
      const nearestText = function (size) {
        // Closest standard drill to a size (size in the thread's units) and its percent thread
        const best = closestDrills(isInch ? size : size / 25.4, 1, isInch ? "inch" : "metric")[0].d;
        const bestSize = isInch ? best.inches : best.inches * 25.4;
        return best.name + " (" + lengthText(bestSize, unit) + ", " + pctFor(bestSize).toFixed(0) + "%)";
      };

      const pct = pctFor(drill);
      const rating = drill >= major ? { cls: "bad", text: "Drill is at or above the major diameter: no thread" } : ratePercent(pct);
      verdict.innerHTML = '<span class="badge ' + rating.cls + '">' + rating.text + "</span>";

      const items = [
        { key: "thread", label: "Thread", value: name },
        { key: "drill", label: "Drill", value: drillIn.value.trim() + " = " + lengthText(drill, unit) },
        { key: "pct", label: "Percent thread", value: (drill >= major ? 0 : pct).toFixed(1) + "%", big: true },
        { key: "rating", label: "Rating", value: rating.text },
        { key: "d75", label: "Drill for 75%", value: lengthText(drillFor(75), unit) },
        { key: "n75", label: "Nearest std (75%)", value: nearestText(drillFor(75)) },
        { key: "d60", label: "Drill for 60%", value: lengthText(drillFor(60), unit) },
        { key: "n60", label: "Nearest std (60%)", value: nearestText(drillFor(60)) }
      ];
      window.DFM.renderResults(out, "percent-thread", items);
    }

    [threadSel, unitSel].forEach(function (el) {
      el.addEventListener("change", update);
    });
    drillIn.addEventListener("input", update);
    updaters.push(update);
    update();
  }

  // ---------- Countersink and 45° chamfer ----------
  // depth = (top diameter - hole diameter) / 2 / tan(angle / 2)
  function renderCountersink(host) {
    const saved = loadState("countersink");
    const idp = "csk";                           // id prefix for this card's fields
    const out = buildCard(host, "Countersink &amp; chamfer",
      '<div class="field-grid" style="grid-template-columns:repeat(2,minmax(0,1fr))">' +
      '<div class="field"><label for="' + idp + '-unit">Units</label><select data-f="unit" id="' + idp + '-unit"><option value="in">Inch</option><option value="mm">mm</option></select></div>' +
      '<div class="field"><label for="' + idp + '-angle">Included angle</label><select data-f="angle" id="' + idp + '-angle">' +
      '<option value="82">82° (inch flat head)</option><option value="90">90° (metric flat head, 45° chamfer)</option>' +
      '<option value="100">100° (aerospace)</option><option value="120">120°</option><option value="60">60° (center drill)</option></select></div>' +
      '<div class="field"><label for="' + idp + '-hole"><span data-u="Hole diameter">Hole diameter</span></label><input data-f="hole" id="' + idp + '-hole" type="text" inputmode="decimal" value="0.201"></div>' +
      '<div class="field"><label for="' + idp + '-mode">Solve for</label><select data-f="mode" id="' + idp + '-mode"><option value="depth">Depth (from top diameter)</option><option value="top">Top diameter (from depth)</option></select></div>' +
      '<div class="field" style="grid-column:1 / -1"><label for="' + idp + '-value"><span data-u="Top diameter">Top diameter</span></label><input data-f="value" id="' + idp + '-value" type="text" inputmode="decimal" value="0.5"></div>' +
      "</div>",
      "Fractions allowed. A 45° x C chamfer on a hole is a 90° countersink C deep (top diameter = hole + 2C).");
    const f = {};
    host.querySelectorAll("[data-f]").forEach(function (el) {
      f[el.dataset.f] = el;
    });
    ["hole", "value"].forEach(function (k) {
      if (saved[k] !== undefined) {
        f[k].value = saved[k];
      }
    });
    ["unit", "angle", "mode"].forEach(function (k) {
      restoreSelect(f[k], saved[k]);
    });

    function update() {
      saveState("countersink", { unit: f.unit.value, angle: f.angle.value, mode: f.mode.value, hole: f.hole.value, value: f.value.value });
      const unit = f.unit.value;
      const solveDepth = f.mode.value === "depth";
      // Labels follow the unit and the solve mode
      host.querySelectorAll("[data-u]").forEach(function (span) {
        const base = span.dataset.u === "Top diameter" ? (solveDepth ? "Top diameter" : "Countersink depth") : span.dataset.u;
        span.textContent = base + " (" + unit + ")";
      });

      const angle = parseFloat(f.angle.value);
      const hole = parseNumberText(f.hole.value);
      const value = parseNumberText(f.value.value);
      if (hole === null || value === null || hole < 0 || value <= 0) {
        showMessage(out, "countersink", "enter hole diameter and " + (solveDepth ? "top diameter" : "depth"));
        return;
      }
      const tanHalf = Math.tan(angle * Math.PI / 360);
      let top = value;
      let depth = value;
      if (solveDepth) {
        if (value <= hole) {
          showMessage(out, "countersink", "top diameter must be larger than the hole");
          return;
        }
        depth = (top - hole) / 2 / tanHalf;
      } else {
        top = hole + 2 * depth * tanHalf;
      }
      const items = [
        { key: "angle", label: "Included angle", value: angle + "°" },
        { key: "hole", label: "Hole diameter", value: lengthText(hole, unit) },
        { key: "top", label: "Top diameter", value: lengthText(top, unit), big: !solveDepth },
        { key: "depth", label: "Countersink depth", value: lengthText(depth, unit), big: solveDepth }
      ];
      if (angle === 90) {
        items.push({ key: "chamfer", label: "Same as 45° chamfer", value: lengthText(depth, unit) + " x 45°" });
      }
      window.DFM.renderResults(out, "countersink", items);
    }

    Object.keys(f).forEach(function (k) {
      f[k].addEventListener(f[k].tagName === "SELECT" ? "change" : "input", update);
    });
    updaters.push(update);
    update();
  }

  // ---------- Drill point depth ----------
  // point length = (D / 2) / tan(point angle / 2), about 0.300 x D at 118°
  function renderDrillPoint(host) {
    const saved = loadState("drill-point");
    const idp = "dpt";                           // id prefix for this card's fields
    const out = buildCard(host, "Drill point depth",
      '<div class="field-grid" style="grid-template-columns:repeat(2,minmax(0,1fr))">' +
      '<div class="field"><label for="' + idp + '-unit">Units</label><select data-f="unit" id="' + idp + '-unit"><option value="in">Inch</option><option value="mm">mm</option></select></div>' +
      '<div class="field"><label for="' + idp + '-angle">Point angle</label><select data-f="angle" id="' + idp + '-angle"><option value="118">118° (general purpose)</option>' +
      '<option value="135">135° (split point, steel)</option><option value="140">140° (carbide)</option></select></div>' +
      '<div class="field"><label for="' + idp + '-dia"><span data-u="Drill diameter">Drill diameter</span></label><input data-f="dia" id="' + idp + '-dia" type="text" inputmode="decimal" value="0.201"></div>' +
      '<div class="field"><label for="' + idp + '-depth"><span data-u="Full-diameter depth">Full-diameter depth</span></label><input data-f="depth" id="' + idp + '-depth" type="text" inputmode="decimal" value="0.5" placeholder="optional"></div>' +
      "</div>",
      "Blind holes: the drawing depth is usually to full diameter; the drill tip goes deeper by the point length.");
    const f = {};
    host.querySelectorAll("[data-f]").forEach(function (el) {
      f[el.dataset.f] = el;
    });
    ["dia", "depth"].forEach(function (k) {
      if (saved[k] !== undefined) {
        f[k].value = saved[k];
      }
    });
    ["unit", "angle"].forEach(function (k) {
      restoreSelect(f[k], saved[k]);
    });

    function update() {
      saveState("drill-point", { unit: f.unit.value, angle: f.angle.value, dia: f.dia.value, depth: f.depth.value });
      const unit = f.unit.value;
      host.querySelectorAll("[data-u]").forEach(function (span) {
        span.textContent = span.dataset.u + " (" + unit + ")";
      });
      const angle = parseFloat(f.angle.value);
      const dia = parseNumberText(f.dia.value);
      const depth = parseNumberText(f.depth.value);
      if (dia === null || dia <= 0) {
        showMessage(out, "drill-point", "enter a drill diameter");
        return;
      }
      const point = (dia / 2) / Math.tan(angle * Math.PI / 360);
      const items = [
        { key: "dia", label: "Drill diameter", value: lengthText(dia, unit) },
        { key: "angle", label: "Point angle", value: angle + "°" },
        { key: "point", label: "Point length", value: lengthText(point, unit), big: true },
        { key: "ratio", label: "Point length / D", value: (point / dia).toFixed(3) }
      ];
      if (depth !== null && depth > 0) {
        items.push({ key: "full", label: "Full-diameter depth", value: lengthText(depth, unit) });
        items.push({ key: "tip", label: "Depth to drill tip", value: lengthText(depth + point, unit) });
      }
      window.DFM.renderResults(out, "drill-point", items);
    }

    Object.keys(f).forEach(function (k) {
      f[k].addEventListener(f[k].tagName === "SELECT" ? "change" : "input", update);
    });
    updaters.push(update);
    update();
  }

  // ---------- Decimals control (Auto / Fixed) ----------
  function initDecimals() {
    const select = document.getElementById("decimals-mode");
    const saved = window.DFM.readSetting(decimalsKey);
    decimalsMode = saved === "fixed" ? "fixed" : "auto";
    if (!select) {
      return;
    }
    select.value = decimalsMode;
    select.addEventListener("change", function () {
      decimalsMode = select.value === "fixed" ? "fixed" : "auto";
      window.DFM.writeSetting(decimalsKey, decimalsMode);
      updaters.forEach(function (fn) {
        fn();                                    // re-render every card in the new format
      });
    });
  }

  // ---------- Start up ----------
  function mount(id, render) {
    // Render a card into an element with this id, if the page has it
    const host = document.getElementById(id);
    if (host) {
      render(host);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    initDecimals();

    // Unit converter cards
    const grid = document.getElementById("converter-grid");
    if (grid) {
      converters.forEach(function (def) {
        const card = document.createElement("div");
        card.className = "calc";
        card.id = "calc-" + def.id;
        grid.appendChild(card);
        renderConverter(card, def);
      });
      const temp = document.createElement("div");
      temp.className = "calc";
      temp.id = "calc-temperature";
      grid.appendChild(temp);
      renderTemperature(temp);
    }

    mount("calc-part-mass", renderPartMass);
    mount("calc-drill-finder", renderDrillFinder);
    mount("calc-percent-thread", renderPercentThread);
    mount("calc-countersink", renderCountersink);
    mount("calc-drill-point", renderDrillPoint);
  });
})();
