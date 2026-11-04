/* =====================================================================
   Calculators page: unit converters, part mass, fraction / drill finder
   and the scratch pad. Needs js/data/tap_drill_data.js for drill sizes.
   Every result box has a "Send to pad" button that appends the result
   to the scratch pad so notes can be built while working in CAD.
   ===================================================================== */

(function () {
  "use strict";

  // ---------- Unit definitions: factor converts the unit to the base unit ----------
  const converters = [
    {
      id: "length",
      title: "Length",
      base: "mm",
      defaultUnit: "in",
      units: [
        { id: "in", label: "inch (in)", factor: 25.4 },
        { id: "ft", label: "foot (ft)", factor: 304.8 },
        { id: "thou", label: "thou / mil (0.001 in)", factor: 0.0254 },
        { id: "mm", label: "millimetre (mm)", factor: 1 },
        { id: "cm", label: "centimetre (cm)", factor: 10 },
        { id: "m", label: "metre (m)", factor: 1000 },
        { id: "um", label: "micron (µm)", factor: 0.001 }
      ]
    },
    {
      id: "mass",
      title: "Mass / weight",
      base: "g",
      defaultUnit: "lb",
      units: [
        { id: "lb", label: "pound (lb)", factor: 453.59237 },
        { id: "oz", label: "ounce (oz)", factor: 28.349523125 },
        { id: "g", label: "gram (g)", factor: 1 },
        { id: "kg", label: "kilogram (kg)", factor: 1000 }
      ]
    },
    {
      id: "force",
      title: "Force",
      base: "N",
      defaultUnit: "lbf",
      units: [
        { id: "lbf", label: "pound-force (lbf)", factor: 4.4482216 },
        { id: "N", label: "newton (N)", factor: 1 },
        { id: "kN", label: "kilonewton (kN)", factor: 1000 },
        { id: "kgf", label: "kilogram-force (kgf)", factor: 9.80665 }
      ]
    },
    {
      id: "torque",
      title: "Torque",
      base: "Nm",
      defaultUnit: "inlb",
      units: [
        { id: "inlb", label: "inch-pound (in·lbf)", factor: 0.112984829 },
        { id: "ftlb", label: "foot-pound (ft·lbf)", factor: 1.355817948 },
        { id: "Nm", label: "newton-metre (N·m)", factor: 1 },
        { id: "Ncm", label: "newton-centimetre (N·cm)", factor: 0.01 }
      ]
    },
    {
      id: "pressure",
      title: "Pressure / stress",
      base: "kPa",
      defaultUnit: "psi",
      units: [
        { id: "psi", label: "psi", factor: 6.894757 },
        { id: "ksi", label: "ksi", factor: 6894.757 },
        { id: "kPa", label: "kilopascal (kPa)", factor: 1 },
        { id: "MPa", label: "megapascal (MPa = N/mm²)", factor: 1000 },
        { id: "bar", label: "bar", factor: 100 }
      ]
    },
    {
      id: "volume",
      title: "Volume",
      base: "cm3",
      defaultUnit: "in3",
      units: [
        { id: "in3", label: "cubic inch (in³)", factor: 16.387064 },
        { id: "cm3", label: "cubic centimetre (cm³ = mL)", factor: 1 },
        { id: "mm3", label: "cubic millimetre (mm³)", factor: 0.001 },
        { id: "L", label: "litre (L)", factor: 1000 },
        { id: "galUS", label: "US gallon", factor: 3785.411784 }
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

  function escapeHtml(text) {
    return String(text).replace(/[&<>"]/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[ch];
    });
  }

  // Each result box gets a button that appends its text to the scratch pad
  function padButton(getText) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn";
    btn.textContent = "Send to pad";
    btn.addEventListener("click", function () {
      const text = getText();
      if (text) {
        appendToPad(text);
      }
    });
    return btn;
  }

  // ---------- Generic converter card ----------
  function renderConverter(host, def) {
    const options = def.units.map(function (u) {
      return '<option value="' + u.id + '"' + (u.id === def.defaultUnit ? " selected" : "") + ">" + u.label + "</option>";
    }).join("");

    host.innerHTML =
      "<h3>" + def.title + "</h3>" +
      '<div class="calc-row"><input type="number" step="any" value="1" aria-label="' + def.title + ' value">' +
      '<select aria-label="' + def.title + ' unit">' + options + "</select></div>" +
      '<div class="calc-out"></div>' +
      '<div class="calc-row" style="margin:8px 0 0"></div>';

    const input = host.querySelector("input");
    const select = host.querySelector("select");
    const out = host.querySelector(".calc-out");
    let lastText = "";

    function update() {
      const value = parseFloat(input.value);
      const from = def.units.find(function (u) {
        return u.id === select.value;
      });
      if (!isFinite(value)) {
        out.textContent = "Enter a number";
        lastText = "";
        return;
      }
      const baseValue = value * from.factor;                    // convert to base unit first
      const lines = def.units.filter(function (u) {
        return u.id !== from.id;
      }).map(function (u) {
        return niceNumber(baseValue / u.factor) + "  " + u.label;  // then from base to each target
      });
      out.innerHTML = '<span class="big">' + escapeHtml(niceNumber(value) + " " + from.label) + "</span>\n= " +
        lines.map(escapeHtml).join("\n= ");
      lastText = def.title + ": " + niceNumber(value) + " " + from.id + " = " + def.units.filter(function (u) {
        return u.id !== from.id;
      }).map(function (u) {
        return niceNumber(baseValue / u.factor) + " " + u.id;
      }).join(", ");
    }

    input.addEventListener("input", update);
    select.addEventListener("change", update);
    host.querySelector(".calc-row:last-child").appendChild(padButton(function () {
      return lastText;
    }));
    update();
  }

  // ---------- Temperature (offset units, so it is its own card) ----------
  function renderTemperature(host) {
    host.innerHTML =
      "<h3>Temperature</h3>" +
      '<div class="calc-row"><input type="number" step="any" value="70" aria-label="Temperature">' +
      '<select aria-label="Temperature unit"><option value="F">°F</option><option value="C">°C</option><option value="K">K</option></select></div>' +
      '<div class="calc-out"></div><div class="calc-row" style="margin:8px 0 0"></div>';

    const input = host.querySelector("input");
    const select = host.querySelector("select");
    const out = host.querySelector(".calc-out");
    let lastText = "";

    function update() {
      const value = parseFloat(input.value);
      if (!isFinite(value)) {
        out.textContent = "Enter a number";
        return;
      }
      // Convert everything through Celsius
      let celsius = value;
      if (select.value === "F") {
        celsius = (value - 32) * 5 / 9;
      } else if (select.value === "K") {
        celsius = value - 273.15;
      }
      const fahrenheit = celsius * 9 / 5 + 32;
      const kelvin = celsius + 273.15;
      out.innerHTML = '<span class="big">' + niceNumber(value) + " " + (select.value === "K" ? "K" : "°" + select.value) + "</span>\n= " +
        niceNumber(celsius) + " °C\n= " + niceNumber(fahrenheit) + " °F\n= " + niceNumber(kelvin) + " K";
      lastText = "Temperature: " + niceNumber(celsius) + " °C = " + niceNumber(fahrenheit) + " °F";
    }

    input.addEventListener("input", update);
    select.addEventListener("change", update);
    host.querySelector(".calc-row:last-child").appendChild(padButton(function () {
      return lastText;
    }));
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

    host.innerHTML =
      "<h3>Part mass from CAD volume</h3>" +
      '<p class="table-note" style="margin:0 0 10px">Copy the volume from your CAD mass properties, pick a material, get the weight.</p>' +
      '<div class="calc-row"><input type="number" step="any" value="1" aria-label="Volume">' +
      '<select aria-label="Volume unit"><option value="16.387064">in³</option><option value="1">cm³</option><option value="0.001">mm³</option></select></div>' +
      '<div class="calc-row"><select aria-label="Material" style="flex:1 1 100%">' + matOptions + "</select></div>" +
      '<div class="calc-row custom-density" hidden><input type="number" step="any" value="1.00" aria-label="Custom density"><span>g/cm³</span></div>' +
      '<div class="calc-row"><label>Quantity <input type="number" min="1" step="1" value="1" style="width:90px" aria-label="Quantity"></label></div>' +
      '<div class="calc-out"></div><div class="calc-row" style="margin:8px 0 0"></div>';

    const inputs = host.querySelectorAll("input");
    const volumeIn = inputs[0];
    const customIn = inputs[1];
    const qtyIn = inputs[2];
    const selects = host.querySelectorAll("select");
    const volUnit = selects[0];
    const matSel = selects[1];
    const customRow = host.querySelector(".custom-density");
    const out = host.querySelector(".calc-out");
    let lastText = "";

    function update() {
      const volume = parseFloat(volumeIn.value);
      const qty = Math.max(1, parseInt(qtyIn.value, 10) || 1);
      const isCustom = matSel.value === "custom";
      customRow.hidden = !isCustom;
      const density = isCustom ? parseFloat(customIn.value) : densities[parseInt(matSel.value, 10)].value;
      const matName = isCustom ? "custom " + density + " g/cm³" : densities[parseInt(matSel.value, 10)].name;
      if (!isFinite(volume) || !isFinite(density)) {
        out.textContent = "Enter volume and density";
        return;
      }
      const cm3 = volume * parseFloat(volUnit.value);   // volume in cm³
      const grams = cm3 * density * qty;                 // mass = volume x density
      out.innerHTML = '<span class="big">' + niceNumber(grams) + " g</span>\n= " + niceNumber(grams / 1000) + " kg\n= " +
        niceNumber(grams / 453.59237) + " lb\n= " + niceNumber(grams / 28.349523125) + " oz" +
        (qty > 1 ? "\n(" + qty + " parts, " + niceNumber(grams / qty) + " g each)" : "");
      lastText = "Mass: " + niceNumber(cm3) + " cm³ of " + matName + (qty > 1 ? " x" + qty : "") + " = " +
        niceNumber(grams) + " g / " + niceNumber(grams / 453.59237) + " lb";
    }

    [volumeIn, customIn, qtyIn].forEach(function (el) {
      el.addEventListener("input", update);
    });
    [volUnit, matSel].forEach(function (el) {
      el.addEventListener("change", update);
    });
    host.querySelector(".calc-row:last-child").appendChild(padButton(function () {
      return lastText;
    }));
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

    host.innerHTML =
      "<h3>Fraction, decimal &amp; nearest drill</h3>" +
      '<p class="table-note" style="margin:0 0 10px">Type 0.201, 13/64, 1-3/16 or a metric size. Shows the nearest fractions and the closest standard drills.</p>' +
      '<div class="calc-row"><input type="text" value="0.201" aria-label="Size">' +
      '<select aria-label="Unit"><option value="in">in</option><option value="mm">mm</option></select></div>' +
      '<div class="calc-out"></div><div class="calc-row" style="margin:8px 0 0"></div>';

    const input = host.querySelector("input");
    const select = host.querySelector("select");
    const out = host.querySelector(".calc-out");
    let lastText = "";

    function update() {
      const inches = parseLength(input.value, select.value);
      if (inches === null || inches <= 0) {
        out.textContent = "Enter a size";
        lastText = "";
        return;
      }
      const mm = inches * 25.4;
      const f64 = nearestFraction(inches, 64);
      const f32 = nearestFraction(inches, 32);
      const f16 = nearestFraction(inches, 16);

      // Three closest drills of any type
      const nearest = drills.map(function (d) {
        return { d: d, diff: d.inches - inches };
      }).sort(function (a, b) {
        return Math.abs(a.diff) - Math.abs(b.diff);
      }).slice(0, 4);

      const sign = function (v) {
        return (v >= 0 ? "+" : "") + v.toFixed(4);
      };

      out.innerHTML = '<span class="big">' + inches.toFixed(4) + " in = " + mm.toFixed(3) + " mm</span>\n" +
        "Nearest 1/64: " + f64.text + " in (" + sign(f64.value - inches) + ")\n" +
        "Nearest 1/32: " + f32.text + " in (" + sign(f32.value - inches) + ")\n" +
        "Nearest 1/16: " + f16.text + " in (" + sign(f16.value - inches) + ")\n" +
        "Closest drills:\n" + nearest.map(function (n) {
          return "  " + n.d.name + "  " + n.d.inches.toFixed(4) + " in / " + (n.d.inches * 25.4).toFixed(2) + " mm  (" + sign(n.diff) + " in)";
        }).join("\n");
      lastText = "Size " + inches.toFixed(4) + " in (" + mm.toFixed(3) + " mm) ~ " + f64.text + " in; closest drill " +
        nearest[0].d.name + " (" + nearest[0].d.inches.toFixed(4) + " in)";
    }

    input.addEventListener("input", update);
    select.addEventListener("change", update);
    host.querySelector(".calc-row:last-child").appendChild(padButton(function () {
      return lastText;
    }));
    update();
  }

  // ---------- Scratch pad ----------
  const padKey = "dfm-scratch-pad";
  let padArea = null;
  let padState = null;
  let saveTimer = null;

  function savePad() {
    // Save shortly after typing stops
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      window.DFM.writeSetting(padKey, padArea.value);
      padState.textContent = "Saved in this browser " + new Date().toLocaleTimeString();
    }, 400);
  }

  function appendToPad(text) {
    if (!padArea) {
      return;
    }
    const prefix = padArea.value && !padArea.value.endsWith("\n") ? "\n" : "";
    padArea.value += prefix + text + "\n";
    padArea.scrollTop = padArea.scrollHeight;    // keep the newest line visible
    savePad();
  }

  function initScratchPad() {
    padArea = document.getElementById("scratch-text");
    padState = document.getElementById("scratch-state");
    if (!padArea) {
      return;
    }

    // Restore the last saved notes
    const saved = window.DFM.readSetting(padKey);
    if (saved) {
      padArea.value = saved;
      padState.textContent = "Restored notes saved in this browser";
    }
    padArea.addEventListener("input", savePad);

    // Insert a time stamp line
    document.getElementById("scratch-stamp").addEventListener("click", function () {
      appendToPad("--- " + new Date().toLocaleString() + " ---");
    });

    // Copy the whole pad to the clipboard
    document.getElementById("scratch-copy").addEventListener("click", function () {
      padArea.select();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(padArea.value).then(function () {
          padState.textContent = "Copied to clipboard";
        }, function () {
          padState.textContent = "Select the text and press Ctrl+C to copy";
        });
      } else {
        padState.textContent = "Select the text and press Ctrl+C to copy";
      }
    });

    // Download the pad as a text file
    document.getElementById("scratch-download").addEventListener("click", function () {
      const blob = new Blob([padArea.value], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "dfm_notes_" + new Date().toISOString().slice(0, 10) + ".txt";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(function () {
        URL.revokeObjectURL(link.href);
      }, 1000);
    });

    // Clear after confirmation
    document.getElementById("scratch-clear").addEventListener("click", function () {
      if (padArea.value && !window.confirm("Clear the scratch pad? This cannot be undone.")) {
        return;
      }
      padArea.value = "";
      savePad();
    });
  }

  // Let other tools on the page (corner radius picker) add lines to the pad
  window.DFM_PAD = { append: appendToPad };

  // ---------- Start up ----------
  document.addEventListener("DOMContentLoaded", function () {
    initScratchPad();

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
