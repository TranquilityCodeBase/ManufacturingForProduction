/* =====================================================================
   Site navigation definition.
   Every page's left sidebar is built from this one list, so adding a
   page only means adding one entry here.
   href values are relative to the site root; main.js adds the prefix
   each page needs (pages in /pages use "../").
   ===================================================================== */

// Home is not part of this list: main.js always shows it as a fixed link
// at the top of the sidebar, followed by a "Back to" link for the last page visited.
window.DFM_HOME = { id: "home", title: "Home", href: "index.html" };

window.DFM_NAV = [
  {
    // Section of one page: the items jump to sections of the cheat sheet
    group: "Quick Rules",
    page: { id: "quick_reference", title: "Quick Rules Cheat Sheet", href: "pages/quick_reference.html" },
    items: [
      { id: "qr_cnc", title: "CNC Milling Rules", href: "pages/quick_reference.html#cnc-rules" },
      { id: "qr_holes", title: "Holes & Threads Rules", href: "pages/quick_reference.html#hole-rules" },
      { id: "qr_turning", title: "CNC Turning Rules", href: "pages/quick_reference.html#turning-rules" },
      { id: "qr_3dp", title: "3D Printing Rules", href: "pages/quick_reference.html#3dp-rules" }
    ]
  },
  {
    group: "CNC Machining",
    items: [
      { id: "cnc_milling", title: "Milling: 3-Axis, 3+2, 5-Axis", href: "pages/cnc_milling.html" },
      { id: "corners_pockets", title: "Inside Corners & Pockets", href: "pages/corners_pockets.html" },
      { id: "walls_features", title: "Walls, Features & Text", href: "pages/walls_features.html" },
      { id: "cnc_turning", title: "CNC Turning (Lathe)", href: "pages/cnc_turning.html" },
      { id: "setups_orientation", title: "Setups & Part Orientation", href: "pages/setups_orientation.html" },
      { id: "stock_sizes", title: "Stock Sizes & Design Extents", href: "pages/stock_sizes.html" },
      { id: "tolerances_finishes", title: "Tolerances & Finishes", href: "pages/tolerances_finishes.html" },
      { id: "cnc_materials", title: "Machining Materials", href: "pages/cnc_materials.html" },
      { id: "cost_reduction", title: "Cost Reduction Tips", href: "pages/cost_reduction.html" }
    ]
  },
  {
    group: "Holes & Threads",
    items: [
      { id: "holes_threading", title: "Hole & Thread Design Rules", href: "pages/holes_threading.html" },
      { id: "thread_tables", title: "Thread Pilot Hole Tables", href: "pages/thread_tables.html" },
      { id: "tap_drill_charts", title: "Tap & Clearance Drill Charts", href: "pages/tap_drill_charts.html" }
    ]
  },
  {
    group: "3D Printing",
    items: [
      { id: "3dp_processes", title: "FDM vs SLA vs SLS vs MJF vs DMLS", href: "pages/3dp_processes.html" },
      { id: "3dp_materials", title: "3DP Materials", href: "pages/3dp_materials.html" },
      { id: "3dp_internal_passages", title: "Internal Passages & Escape Holes", href: "pages/3dp_internal_passages.html" },
      { id: "3dp_overhangs", title: "Overhangs & Supports", href: "pages/3dp_overhangs.html" },
      { id: "3dp_quality_cost", title: "Quality, Time & Cost Tips", href: "pages/3dp_quality_cost.html" }
    ]
  },
  {
    group: "Tools",
    items: [
      { id: "calculators", title: "Calculators & Scratch Pad", href: "pages/calculators.html" },
      { id: "glossary", title: "Glossary", href: "pages/glossary.html" },
      { id: "references", title: "Sources & References", href: "pages/references.html" }
    ]
  }
];
