/* =====================================================================
   Thread pilot-hole data for automated CNC quoting (ProtoLabs style).
   How to use: model the hole at the "Modeled pilot" diameter (any value
   inside Min-Max works), do NOT model the thread, then assign the thread
   in the quote. Max depth is the deepest thread the thread mill reaches.

   Inch tables: values in inches. Metric tables: values in millimetres.
   Source pages (public):
     https://www.protolabs.com/services/cnc-machining/threaded-holes-guidelines/standard-holes/
     https://www.protolabs.com/services/cnc-machining/threaded-holes-guidelines/coil-inserts/
     https://www.protolabs.com/services/cnc-machining/threaded-holes-guidelines/key-inserts/
     https://www.protolabs.com/services/cnc-machining/threaded-holes-guidelines/od-threads/
   Vendor tables change. Re-check the live page before releasing a design.
   ===================================================================== */

window.DFM_THREADS = {
  // Each table: id, title, unit, source url, note, and rows of
  // [thread, maxDepth, modeledPilot, minDiameter, maxDiameter]
  tables: [
    // ---------------- Standard tapped (thread-milled) holes ----------------
    {
      id: "std_unc",
      group: "standard",
      title: "UNC - standard threaded holes (milled)",
      unit: "in",
      source: "https://www.protolabs.com/services/cnc-machining/threaded-holes-guidelines/standard-holes/",
      note: "Right-hand internal threads, thread-milled. Hole axis must line up with a cardinal machining direction.",
      rows: [
        ["#2-56", 0.20, 0.070, 0.067, 0.074],
        ["#3-48", 0.20, 0.082, 0.076, 0.084],
        ["#4-40", 0.30, 0.089, 0.085, 0.094],
        ["#5-40", 0.30, 0.102, 0.098, 0.104],
        ["#6-32", 0.40, 0.109, 0.105, 0.114],
        ["#8-32", 0.40, 0.134, 0.130, 0.139],
        ["#10-24", 0.60, 0.150, 0.145, 0.156],
        ["#12-24", 0.60, 0.176, 0.171, 0.181],
        ["1/4-20", 0.65, 0.201, 0.196, 0.207],
        ["5/16-18", 0.65, 0.259, 0.252, 0.265],
        ["3/8-16", 1.00, 0.314, 0.307, 0.321],
        ["7/16-14", 1.00, 0.372, 0.360, 0.376],
        ["1/2-13", 1.20, 0.426, 0.417, 0.434]
      ]
    },
    {
      id: "std_unf",
      group: "standard",
      title: "UNF - standard threaded holes (milled)",
      unit: "in",
      source: "https://www.protolabs.com/services/cnc-machining/threaded-holes-guidelines/standard-holes/",
      note: "Right-hand internal threads, thread-milled.",
      rows: [
        ["#2-64", 0.20, 0.072, 0.069, 0.075],
        ["#3-56", 0.20, 0.083, 0.080, 0.084],
        ["#4-48", 0.30, 0.093, 0.087, 0.098],
        ["#5-44", 0.30, 0.104, 0.100, 0.104],
        ["#6-40", 0.40, 0.115, 0.111, 0.119],
        ["#8-36", 0.40, 0.138, 0.134, 0.142],
        ["#10-32", 0.60, 0.160, 0.156, 0.164],
        ["#12-28", 0.60, 0.182, 0.177, 0.186],
        ["1/4-28", 0.65, 0.215, 0.211, 0.220],
        ["5/16-24", 0.65, 0.272, 0.267, 0.277],
        ["3/8-24", 1.00, 0.335, 0.330, 0.340],
        ["7/16-20", 1.00, 0.389, 0.383, 0.395],
        ["1/2-20", 1.20, 0.451, 0.446, 0.457]
      ]
    },
    {
      id: "std_metric",
      group: "standard",
      title: "Metric - standard threaded holes (milled)",
      unit: "mm",
      source: "https://www.protolabs.com/services/cnc-machining/threaded-holes-guidelines/standard-holes/",
      note: "M1.6 x 0.35 is offered in soft metals only (aluminum, brass, copper).",
      rows: [
        ["M1.6 x 0.35 *", 3.00, 1.25, 1.22, 1.32],
        ["M2 x 0.4", 5.08, 1.60, 1.57, 1.68],
        ["M2.5 x 0.45", 5.08, 2.05, 2.01, 2.14],
        ["M3 x 0.5", 7.62, 2.50, 2.46, 2.60],
        ["M3.5 x 0.6", 10.16, 2.90, 2.85, 3.01],
        ["M4 x 0.7", 10.16, 3.30, 3.24, 3.42],
        ["M5 x 0.8", 15.24, 4.20, 4.14, 4.33],
        ["M6 x 1.0", 16.51, 5.00, 4.92, 5.15],
        ["M8 x 1.25", 16.51, 6.80, 6.65, 6.91],
        ["M10 x 1.5", 25.40, 8.50, 8.38, 8.68],
        ["M12 x 1.75", 30.48, 10.20, 10.00, 10.44]
      ]
    },

    // ---------------- Coil (HeliCoil style) insert holes ----------------
    {
      id: "coil_unc",
      group: "coil",
      title: "UNC - coil insert threaded holes",
      unit: "in",
      source: "https://www.protolabs.com/services/cnc-machining/threaded-holes-guidelines/coil-inserts/",
      note: "Thread listed is the screw size the installed insert accepts. The hole is cut with the insert's STI thread. Inserts are supplied and installed by you.",
      rows: [
        ["#2-56", 0.30, 0.091, 0.090, 0.096],
        ["#3-48", 0.40, 0.107, 0.105, 0.110],
        ["#4-40", 0.40, 0.119, 0.117, 0.125],
        ["#5-40", 0.40, 0.132, 0.131, 0.137],
        ["#6-32", 0.60, 0.147, 0.145, 0.153],
        ["#8-32", 0.60, 0.173, 0.171, 0.178],
        ["#10-24", 0.65, 0.201, 0.199, 0.208],
        ["#12-24", 0.65, 0.227, 0.225, 0.234],
        ["1/4-20", 0.65, 0.266, 0.261, 0.270],
        ["5/16-18", 1.00, 0.332, 0.324, 0.334],
        ["3/8-16", 1.20, 0.397, 0.389, 0.399],
        ["7/16-14", 1.20, 0.453, 0.453, 0.464],
        ["1/2-13", 1.20, 0.531, 0.515, 0.531]
      ]
    },
    {
      id: "coil_unf",
      group: "coil",
      title: "UNF - coil insert threaded holes",
      unit: "in",
      source: "https://www.protolabs.com/services/cnc-machining/threaded-holes-guidelines/coil-inserts/",
      note: "Thread listed is the screw size the installed insert accepts.",
      rows: [
        ["#2-64", 0.30, 0.092, 0.090, 0.095],
        ["#3-56", 0.30, 0.104, 0.103, 0.104],
        ["#4-48", 0.40, 0.120, 0.117, 0.123],
        ["#6-40", 0.60, 0.148, 0.144, 0.150],
        ["#8-36", 0.60, 0.174, 0.170, 0.177],
        ["#10-32", 0.65, 0.200, 0.197, 0.204],
        ["1/4-28", 0.65, 0.261, 0.258, 0.265],
        ["5/16-24", 1.00, 0.325, 0.322, 0.329],
        ["3/8-24", 1.00, 0.387, 0.384, 0.391],
        ["7/16-20", 1.20, 0.452, 0.448, 0.456],
        ["1/2-20", 1.20, 0.515, 0.511, 0.519]
      ]
    },
    {
      id: "coil_metric",
      group: "coil",
      title: "Metric - coil insert threaded holes",
      unit: "mm",
      source: "https://www.protolabs.com/services/cnc-machining/threaded-holes-guidelines/coil-inserts/",
      note: "Thread listed is the screw size the installed insert accepts.",
      rows: [
        ["M2 x 0.4", 5.08, 2.14, 2.09, 2.14],
        ["M2.5 x 0.45", 7.62, 2.60, 2.55, 2.65],
        ["M3 x 0.5", 10.16, 3.18, 3.11, 3.25],
        ["M3.5 x 0.6", 15.24, 3.70, 3.68, 3.79],
        ["M4 x 0.7", 15.24, 4.24, 4.15, 4.33],
        ["M5 x 0.8", 16.51, 5.27, 5.17, 5.37],
        ["M6 x 1.0", 16.51, 6.31, 6.22, 6.41],
        ["M8 x 1.25", 25.40, 8.38, 8.27, 8.48],
        ["M10 x 1.5", 30.48, 10.56, 10.33, 10.56],
        ["M12 x 1.75", 30.48, 12.51, 12.38, 12.64]
      ]
    },

    // ---------------- Key-locking insert holes ----------------
    {
      id: "key_unc",
      group: "key",
      title: "UNC - key insert threaded holes",
      unit: "in",
      source: "https://www.protolabs.com/services/cnc-machining/threaded-holes-guidelines/key-inserts/",
      note: "Thread listed is the fitting thread cut into the part for the insert's outside thread. Check the insert maker's data sheet for which insert uses that fitting thread.",
      rows: [
        ["#8-32", 0.40, 0.135, 0.133, 0.137],
        ["5/16-18", 0.65, 0.274, 0.271, 0.276],
        ["3/8-16", 1.00, 0.334, 0.331, 0.336],
        ["7/16-14", 1.00, 0.399, 0.396, 0.401],
        ["1/2-13", 1.00, 0.455, 0.452, 0.457]
      ]
    },
    {
      id: "key_unf",
      group: "key",
      title: "UNF - key insert threaded holes",
      unit: "in",
      source: "https://www.protolabs.com/services/cnc-machining/threaded-holes-guidelines/key-inserts/",
      note: "Thread listed is the fitting thread cut into the part for the insert's outside thread.",
      rows: [
        ["#10-32", 0.60, 0.162, 0.160, 0.164],
        ["#12-28", 0.60, 0.189, 0.186, 0.191],
        ["1/4-28", 0.65, 0.229, 0.227, 0.231]
      ]
    },

    // ---------------- External (OD) threads on turned parts ----------------
    {
      id: "od_unc",
      group: "od",
      title: "UNC - external (OD) threads, turned parts",
      unit: "in",
      source: "https://www.protolabs.com/services/cnc-machining/threaded-holes-guidelines/od-threads/",
      note: "Model the plain shaft at the listed diameter (no thread). Max length is about 2 x nominal diameter.",
      rows: [
        ["#4-40", 0.224, 0.109, 0.106, 0.113],
        ["#5-40", 0.250, 0.122, 0.119, 0.126],
        ["#6-32", 0.276, 0.134, 0.131, 0.139],
        ["#8-32", 0.328, 0.160, 0.157, 0.165],
        ["#10-24", 0.380, 0.185, 0.182, 0.191],
        ["#12-24", 0.432, 0.211, 0.208, 0.217],
        ["1/4-20", 0.500, 0.245, 0.241, 0.251],
        ["5/16-18", 0.625, 0.307, 0.303, 0.314],
        ["3/8-16", 0.750, 0.369, 0.364, 0.376],
        ["7/16-14", 0.875, 0.431, 0.426, 0.439],
        ["1/2-13", 1.000, 0.493, 0.488, 0.501],
        ["5/8-11", 1.250, 0.617, 0.611, 0.626],
        ["3/4-10", 1.500, 0.742, 0.735, 0.751]
      ]
    },
    {
      id: "od_unf",
      group: "od",
      title: "UNF - external (OD) threads, turned parts",
      unit: "in",
      source: "https://www.protolabs.com/services/cnc-machining/threaded-holes-guidelines/od-threads/",
      note: "Model the plain shaft at the listed diameter (no thread).",
      rows: [
        ["#5-44", 0.250, 0.122, 0.120, 0.126],
        ["#6-40", 0.276, 0.135, 0.132, 0.139],
        ["#8-36", 0.328, 0.161, 0.158, 0.165],
        ["#10-32", 0.380, 0.186, 0.183, 0.191],
        ["#12-28", 0.432, 0.212, 0.209, 0.217],
        ["1/4-28", 0.500, 0.246, 0.243, 0.251],
        ["5/16-24", 0.625, 0.308, 0.304, 0.314],
        ["3/8-24", 0.750, 0.370, 0.367, 0.376],
        ["7/16-20", 0.875, 0.432, 0.428, 0.439],
        ["1/2-20", 1.000, 0.495, 0.491, 0.501],
        ["5/8-18", 1.250, 0.619, 0.615, 0.626],
        ["3/4-16", 1.500, 0.744, 0.739, 0.751]
      ]
    },
    {
      id: "od_metric",
      group: "od",
      title: "Metric - external (OD) threads, turned parts",
      unit: "mm",
      source: "https://www.protolabs.com/services/cnc-machining/threaded-holes-guidelines/od-threads/",
      note: "Model the plain shaft at the listed diameter (no thread).",
      rows: [
        ["M3.5 x 0.6", 7, 3.42, 3.35, 3.53],
        ["M4 x 0.7", 8, 3.91, 3.84, 4.03],
        ["M5 x 0.8", 10, 4.90, 4.83, 5.03],
        ["M6 x 1.0", 12, 5.89, 5.79, 6.02],
        ["M8 x 1.25", 16, 7.87, 7.76, 8.03],
        ["M8 x 1.0 (fine)", 16, 7.88, 7.80, 8.03],
        ["M10 x 1.5", 20, 9.85, 9.73, 10.03],
        ["M10 x 1.25 (fine)", 20, 9.87, 9.76, 10.03],
        ["M10 x 0.75", 20, 9.91, 9.84, 10.03],
        ["M12 x 1.75", 24, 11.83, 11.70, 12.02],
        ["M12 x 1.5 (fine)", 24, 11.85, 11.73, 12.02],
        ["M12 x 1.25 (extra fine)", 24, 11.87, 11.76, 12.02],
        ["M12 x 1.0", 24, 11.88, 11.79, 12.02],
        ["M14 x 2.0", 28, 13.82, 13.68, 14.03],
        ["M14 x 1.5 (fine)", 28, 13.85, 13.73, 14.03],
        ["M15 x 1.0", 30, 14.88, 14.79, 15.03],
        ["M16 x 2.0", 32, 15.82, 15.68, 16.02],
        ["M16 x 1.5", 32, 15.85, 15.73, 16.02],
        ["M17 x 1.0", 34, 16.89, 16.79, 17.03],
        ["M18 x 1.5", 36, 17.85, 17.73, 18.03],
        ["M20 x 2.5", 40, 19.79, 19.62, 20.03],
        ["M20 x 1.5", 40, 19.85, 19.73, 20.03]
      ]
    }
  ],

  // ---------------- Special threads: internal NPT (pipe) ----------------
  // Offered in soft metals (aluminum, copper, brass). Values in inches.
  // Row: [size, minPilot, maxPilot, nominalPilot, minPilotDepthThrough, minPilotDepthBlind, threadDepth]
  npt: {
    title: "Internal NPT pipe threads (soft metals only)",
    unit: "in",
    source: "https://www.protolabs.com/services/cnc-machining/threaded-holes-guidelines/standard-holes/",
    rows: [
      ["1/16-27", 0.2343, 0.2494, 0.2421, 0.389, 0.419, 0.389],
      ["1/8-27", 0.3268, 0.3417, 0.3346, 0.389, 0.419, 0.389],
      ["1/4-18", 0.4232, 0.4448, 0.4331, 0.582, 0.621, 0.582],
      ["3/8-18", 0.5571, 0.5794, 0.5669, 0.582, 0.621, 0.582],
      ["1/2-14", 0.6870, 0.7165, 0.7008, 0.748, 0.795, 0.748],
      ["3/4-14", 0.8976, 0.9257, 0.9114, 0.748, 0.795, 0.748],
      ["1-11 1/2", 1.1280, 1.1625, 1.1437, 0.911, 0.966, 0.911],
      ["1 1/4-11 1/2", 1.4705, 1.5060, 1.4882, 0.911, 0.966, 0.911],
      ["1 1/2-11 1/2", 1.7106, 1.7450, 1.7264, 0.911, 0.966, 0.911],
      ["2-11 1/2", 2.1831, 2.2174, 2.1988, 0.911, 0.966, 0.911]
    ]
  }
};
