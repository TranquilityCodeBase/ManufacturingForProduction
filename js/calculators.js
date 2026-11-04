/* =====================================================================
   Calculators page: unit converters, part mass, fraction / drill finder
   cards. Needs js/data/tap_drill_data.js for drill sizes. The scratch pad
   itself lives in js/scratch_pad.js (shared by every page).
   Results are shown as "Label = value" rows (window.DFM.renderResults in
   main.js). Each row has a checkbox; "Send to pad" appends only the
   checked rows to the scratch pad, one per line.
   ===================================================================== */

(function () {
  "use strict";

  // ---------- Unit definitions: factor converts the unit to the base unit ----------
  // short = text used in results and pad lines, label = text in the unit list
  const converters = [
    {
      id: "length",
      title: "Length",
      defaultUnit: "in",
      units: [
        { id: "in", short: "in", label: "inch (in)", factor: 25.4 },
        { id: "ft", short: "ft", label: "foot (ft)", factor: 304.8 },
        { id: "thou", short: "thou", label: "thou / mil (0.001 in)", factor: 0.0254 },
        { id: "mm", short: "mm", label: "millimetre (mm)", factor: 1 },
        { id: "cm", short: "cm", label: "centimetre (cm)", factor: 10 },
        { id: "m", short: "m", label: "metre (m)", factor: 1000 },
        { id: "um", short: "µm", label: "micron (µm)", factor: 0.001 }
      ]
    },
    {
      id: "speed",
      title: "Speed / feed rate",
      defaultUnit: "mms",
      units: [
        { id: "mms", short: "mm/s", label: "mm per second (mm/s)", factor: 1 },
        { id: "mmmin", short: "mm/min", label: "mm per minute (mm/min)", factor: 1 / 60 },
        { id: "mmin", short: "m/min", label: "metres per minute (m/min, SMM)", factor: 1000 / 60 },
        { id: "ms", short: "m/s", label: "metres per second (m/s)", factor: 1000 },
        { id: "ips", short: "in/s", label: "inches per second (in/s)", factor: 25.4 },
        { id: "ipm", short: "IPM", label: "inches per minute (IPM)", factor: 25.4 / 60 },
        { id: "sfm", short: "ft/min", label: "feet per minute (ft/min, SFM)", factor: 304.8 / 60 },
        { id: "fps", short: "ft/s", label: "feet per second (ft/s)", factor: 304.8 }
      ]
    },
    {
      id: "mass",
      title: "Mass / weight",
      defaultUnit: "lb",
      units: [
        { id: "lb", short: "lb", label: "pound (lb)", factor: 453.59237 },
        { id: "oz", short: "oz", label: "ounce (oz)", factor: 28.349523125 },
        { id: "g", short: "g", label: "gram (g)", factor: 1 },
        { id: "kg", short: "kg", label: "kilogram (kg)", factor: 1000 }
      ]
    },
    {
      id: "force",
      title: "Force",
      defaultUnit: "lbf",
      units: [
        { id: "lbf", short: "lbf", label: "pound-force (lbf)", factor: 4.4482216 },
        { id: "N", short: "N", label: "newton (N)", factor: 1 },
        { id: "kN", short: "kN", label: "kilonewton (kN)", factor: 1000 },
        { id: "kgf", short: "kgf", label: "kilogram-force (kgf)", factor: 9.80665 }
      ]
    },
    {
      id: "torque",
      title: "Torque",
      defaultUnit: "inlb",
      units: [
        { id: "inlb", short: "in·lbf", label: "inch-pound (in·lbf)", factor: 0.112984829 },
        { id: "ftlb", short: "ft·lbf", label: "foot-pound (ft·lbf)", factor: 1.355817948 },
        { id: "Nm", short: "N·m", label: "newton-metre (N·m)", factor: 1 },
        { id: "Ncm", short: "N·cm", label: "newton-centimetre (N·cm)", factor: 0.01 }
      ]
    },
    {
      id: "pressure",
      title: "Pressure / stress",
      defaultUnit: "psi",
      units: [
        { id: "psi", short: "psi", label: "psi", factor: 6.894757 },
        { id: "ksi", short: "ksi", label: "ksi", factor: 6894.757 },
        { id: "kPa", short: "kPa", label: "kilopascal (kPa)", factor: 1 },
        { id: "MPa", short: "MPa", label: "megapascal (MPa = N/mm²)", factor: 1000 },
        { id: "bar", short: "bar", label: "bar", factor: 100 }
      ]
    },
    {
      id: "volume",
      title: "Volume",
      defaultUnit: "in3",
      units: [
        { id: "in3", short: "in³", label: "cubic inch (in³)", factor: 16.387064 },
        { id: "cm3", short: "cm³", label: "cubic centimetre (cm³ = mL)", factor: 1 },
        { id: "mm3", short: "mm³", label: "cubic millimetre (mm³)", factor: 0.001 },
        { id: "L", short: "L", label: "litre (L)", factor: 1000 },
        { id: "galUS", short: "US gal", label: "US gallon", factor: 3785.411784 }
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

  // ---------- Helpers ----------
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

  // ---------- Generic converter card ----------
  function renderConverter(host, def) {
    const options = def.units.map(function (u) {
      return '<option value="' + u.id + '"' + (u.id === def.defaultUnit ? " selected" : "") + ">" + u.label + "</option>";
    }).join("");

    const out = buildCard(host, def.title,
      '<div class="calc-row"><input type="number" step="any" value="1" aria-label="' + def.title + ' value">' +
      '<select aria-label="' + def.title + ' unit">' + options + "</select></div>");
    const input = host.querySelector("input");
    const select = host.querySelector("select");

    function update() {
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
          items.push({ key: u.id, label: u.short, value: niceNumber(baseValue / u.factor) });
        }
      });
      window.DFM.renderResults(out, def.id, items);
    }

    input.addEventListener("input", update);
    select.addEventListener("change", update);
    update();
  }

  // ---------- Temperature (offset units, so it is its own card) ----------
  function renderTemperature(host) {
    const out = buildCard(host, "Temperature",
      '<div class="calc-row"><input type="number" step="any" value="70" aria-label="Temperature">' +
      '<select aria-label="Temperature unit"><option value="F">°F</option><option value="C">°C</option><option value="K">K</option></select></div>');
    const input = host.querySelector("input");
    const select = host.querySelector("select");

    function update() {
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
        { key: "C", label: "°C", value: niceNumber(celsius) },
        { key: "F", label: "°F", value: niceNumber(celsius * 9 / 5 + 32) },
        { key: "K", label: "K", value: niceNumber(celsius + 273.15) }
      ];
      const items = [{ key: "input", label: "Temperature", value: niceNumber(value) + " " + (select.value === "K" ? "K" : "°" + select.value), big: true }]
        .concat(all.filter(function (item) {
          return item.key !== select.value;
        }));
      window.DFM.renderResults(out, "temperature", items);
    }

    input.addEventListener("input", update);
    select.addEventListener("change", update);
    update();
  }

  // ---------- Part mass from CAD volume ----------
  function renderPartMass(host) {
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
      '<div class="calc-row"><input type="number" step="any" value="1" aria-label="Volume">' +
      '<select aria-label="Volume unit"><option value="in3">in³</option><option value="cm3">cm³</option><option value="mm3">mm³</option></select></div>' +
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

    function update() {
      const volume = parseFloat(volumeIn.value);
      const qty = Math.max(1, parseInt(qtyIn.value, 10) || 1);
      const isCustom = matSel.value === "custom";
      customRow.hidden = !isCustom;
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
        { key: "g", label: "Mass (g)", value: niceNumber(grams), big: true },
        { key: "kg", label: "Mass (kg)", value: niceNumber(grams / 1000) },
        { key: "lb", label: "Mass (lb)", value: niceNumber(grams / 453.59237) },
        { key: "oz", label: "Mass (oz)", value: niceNumber(grams / 28.349523125) }
      ];
      if (qty > 1) {
        items.push({ key: "each", label: "Mass each (g)", value: niceNumber(grams / qty) });
      }
      window.DFM.renderResults(out, "mass-part", items);
    }

    [volumeIn, customIn, qtyIn].forEach(function (el) {
      el.addEventListener("input", update);
    });
    [volUnit, matSel].forEach(function (el) {
      el.addEventListener("change", update);
    });
    update();
  }

  // ---------- Fraction / decimal / drill finder ----------
  function parseLength(text, unit) {
    // Accepts 0.1875, 3/16, 1-3/16, 1 3/16 ; returns inches
    const clean = text.trim().replace(/"/g, "");
    if (!clean) {
      return null;
    }
    let value = null;
    const mixed = clean.match(/^(\d+)[\s-]+(\d+)\/(\d+)$/);   // 1-3/16 or 1 3/16
    const frac = clean.match(/^(\d+)\/(\d+)$/);               // 3/16
    if (mixed) {
      value = parseInt(mixed[1], 10) + parseInt(mixed[2], 10) / parseInt(mixed[3], 10);
    } else if (frac) {
      value = parseInt(frac[1], 10) / parseInt(frac[2], 10);
    } else if (isFinite(parseFloat(clean))) {
      value = parseFloat(clean);
    }
    if (value === null || !isFinite(value)) {
      return null;
    }
    return unit === "mm" ? value / 25.4 : value;
  }

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

  function buildDrillList() {
    // Every standard drill: fractional 1/64 steps to 1 in, number, letter, metric
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
    for (let mm = 0.5; mm <= 10.0001; mm += 0.1) {
      list.push({ name: mm.toFixed(1) + " mm", inches: mm / 25.4, type: "Metric" });
    }
    for (let mm = 10.5; mm <= 25.0001; mm += 0.5) {
      list.push({ name: mm.toFixed(1) + " mm", inches: mm / 25.4, type: "Metric" });
    }
    return list;
  }

  function renderDrillFinder(host) {
    const drills = buildDrillList();
    const out = buildCard(host, "Fraction, decimal &amp; nearest drill",
      '<div class="calc-row"><input type="text" value="0.201" aria-label="Size">' +
      '<select aria-label="Unit"><option value="in">in</option><option value="mm">mm</option></select></div>',
      "Type 0.201, 13/64, 1-3/16 or a metric size. Shows the nearest fractions and the closest standard drills.");
    const input = host.querySelector("input");
    const select = host.querySelector("select");

    function update() {
      const inches = parseLength(input.value, select.value);
      if (inches === null || inches <= 0) {
        showMessage(out, "drill-finder", "enter a size");
        return;
      }
      const sign = function (v) {
        return (v >= 0 ? "+" : "") + v.toFixed(4);
      };
      const items = [
        { key: "in", label: "Size (in)", value: inches.toFixed(4), big: true },
        { key: "mm", label: "Size (mm)", value: (inches * 25.4).toFixed(3) }
      ];
      [64, 32, 16].forEach(function (den) {
        const f = nearestFraction(inches, den);
        items.push({ key: "f" + den, label: "Nearest 1/" + den, value: f.text + " in (" + sign(f.value - inches) + ")" });
      });

      // Four closest drills of any type
      drills.map(function (d) {
        return { d: d, diff: d.inches - inches };
      }).sort(function (a, b) {
        return Math.abs(a.diff) - Math.abs(b.diff);
      }).slice(0, 4).forEach(function (n, i) {
        items.push({
          key: "drill" + i,
          label: "Drill " + (i + 1),
          value: n.d.name + "  " + n.d.inches.toFixed(4) + " in / " + (n.d.inches * 25.4).toFixed(2) + " mm (" + sign(n.diff) + ")"
        });
      });
      window.DFM.renderResults(out, "drill-finder", items);
    }

    input.addEventListener("input", update);
    select.addEventListener("change", update);
    update();
  }

  // ---------- Start up ----------
  document.addEventListener("DOMContentLoaded", function () {
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

    const massHost = document.getElementById("calc-part-mass");
    if (massHost) {
      renderPartMass(massHost);
    }

    const drillHost = document.getElementById("calc-drill-finder");
    if (drillHost) {
      renderDrillFinder(drillHost);
    }
  });
})();
