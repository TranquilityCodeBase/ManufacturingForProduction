/* =====================================================================
   Standard cutter data used by the inside corner / pocket radius picker.
   Sizes are common catalog end mill diameters. Reach rules are general
   shop guidance (length of cut vs. diameter), not one vendor's limits.
   ===================================================================== */

window.DFM_CUTTERS = {
  // Common flat / bullnose end mill diameters
  inch: {
    unit: "in",
    // bullnose = typical catalog corner radii offered for that diameter
    diameters: [
      { label: "1/32", value: 0.03125, bullnose: [0.005] },
      { label: "3/64", value: 0.046875, bullnose: [0.005] },
      { label: "1/16", value: 0.0625, bullnose: [0.005, 0.010, 0.015] },
      { label: "3/32", value: 0.09375, bullnose: [0.010, 0.015, 0.020] },
      { label: "1/8", value: 0.125, bullnose: [0.010, 0.015, 0.020, 0.030] },
      { label: "5/32", value: 0.15625, bullnose: [0.015, 0.020, 0.030] },
      { label: "3/16", value: 0.1875, bullnose: [0.015, 0.020, 0.030, 0.040] },
      { label: "1/4", value: 0.25, bullnose: [0.015, 0.020, 0.030, 0.060] },
      { label: "5/16", value: 0.3125, bullnose: [0.020, 0.030, 0.060] },
      { label: "3/8", value: 0.375, bullnose: [0.020, 0.030, 0.060, 0.090] },
      { label: "1/2", value: 0.5, bullnose: [0.030, 0.060, 0.090, 0.125] },
      { label: "5/8", value: 0.625, bullnose: [0.030, 0.060, 0.090, 0.125] },
      { label: "3/4", value: 0.75, bullnose: [0.030, 0.060, 0.090, 0.125] },
      { label: "1", value: 1.0, bullnose: [0.030, 0.060, 0.125] }
    ],
    // Common bullnose (corner radius) end mill radii, used for floor fillets
    cornerRadii: [0.005, 0.010, 0.015, 0.020, 0.030, 0.040, 0.060, 0.090, 0.125],
    clearance: 0.005,       // minimum extra radius over the tool radius
    roundStep: 0.005        // round recommended radii up to this step
  },

  metric: {
    unit: "mm",
    diameters: [
      { label: "0.8", value: 0.8, bullnose: [0.1] },
      { label: "1", value: 1, bullnose: [0.1, 0.2] },
      { label: "1.5", value: 1.5, bullnose: [0.1, 0.2] },
      { label: "2", value: 2, bullnose: [0.2, 0.5] },
      { label: "2.5", value: 2.5, bullnose: [0.2, 0.5] },
      { label: "3", value: 3, bullnose: [0.2, 0.5] },
      { label: "4", value: 4, bullnose: [0.2, 0.5, 1.0] },
      { label: "5", value: 5, bullnose: [0.5, 1.0] },
      { label: "6", value: 6, bullnose: [0.5, 1.0] },
      { label: "8", value: 8, bullnose: [0.5, 1.0, 1.5] },
      { label: "10", value: 10, bullnose: [0.5, 1.0, 2.0] },
      { label: "12", value: 12, bullnose: [0.5, 1.0, 2.0, 3.0] },
      { label: "16", value: 16, bullnose: [1.0, 2.0, 3.0] },
      { label: "20", value: 20, bullnose: [1.0, 2.0, 3.0] }
    ],
    cornerRadii: [0.1, 0.2, 0.3, 0.5, 1.0, 1.5, 2.0, 3.0],
    clearance: 0.1,
    roundStep: 0.1
  },

  // Depth-to-diameter bands (pocket depth / cutter diameter).
  // Soft = aluminum, brass, plastics. Hard = steel, stainless, titanium.
  reachBands: {
    soft: [
      { maxRatio: 3, status: "good", label: "Standard length, fast" },
      { maxRatio: 4, status: "ok", label: "Standard length, slower finish pass" },
      { maxRatio: 6, status: "warn", label: "Long reach tool, slower and more cost" },
      { maxRatio: Infinity, status: "bad", label: "Too deep for this cutter" }
    ],
    hard: [
      { maxRatio: 2, status: "good", label: "Standard length, fast" },
      { maxRatio: 3, status: "ok", label: "Standard length, slower finish pass" },
      { maxRatio: 5, status: "warn", label: "Long reach tool, slower and more cost" },
      { maxRatio: Infinity, status: "bad", label: "Too deep for this cutter" }
    ]
  },

  // Default floor radius suggestion: the largest catalog bullnose radius
  // that is no more than this fraction of the cutter diameter (about 12%
  // of D, e.g. 0.030 in on a 1/4 in cutter, 0.5 mm on a 6 mm cutter).
  preferredFloorFraction: 0.15,

  // How a sharp (0 radius) pocket floor is treated by material class.
  // Many automated / rapid prototyping services now reject sharp floors:
  // never accepted in hard metals, case by case in soft metals.
  sharpFloor: {
    plastic: { status: "warn", text: "Usually accepted in plastics, but a small bullnose radius is still preferred and is what most automated services default to." },
    soft: { status: "warn", text: "Soft metals: many rapid prototyping services reject or re-quote sharp floors. Draw a standard bullnose radius instead." },
    hard: { status: "bad", text: "Hard metals: sharp floors are not accepted. These materials are cut with bullnose (corner radius) cutters, so a floor radius is required." }
  },

  // Rule of thumb: corner radius about 1.3 x tool radius so the tool
  // sweeps the corner instead of stopping and pivoting in it.
  recommendFactor: 1.3
};
