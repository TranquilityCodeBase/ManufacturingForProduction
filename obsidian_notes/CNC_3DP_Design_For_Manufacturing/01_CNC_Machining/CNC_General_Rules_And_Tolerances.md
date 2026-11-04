---
tags: [dfm, cnc, tolerances, gdt, surface-finish]
source:
  - https://www.protolabs.com/services/cnc-machining/cnc-milling/design-guidelines/
  - https://www.xometry.com/
updated: 2026-11-04
---

# CNC General Rules & Tolerances

Default tolerances, finishes and minimum features to assume before adding special callouts.

## Quick Rules
- Standard machining tolerance: **±0.005 in (±0.13 mm)** on size and location.
- Precision option: **±0.002 in (±0.05 mm)**; reamed holes **±0.0005 in (±0.013 mm)**; feature locations ±0.002 in when cut in the same setup.
- Plastics and composites: expect about **2x** the metal tolerance; parts can warp after machining.
- Minimum feature thickness **0.020 in (0.5 mm)**; keep nominal part thickness above **0.040 in (1.0 mm)**.
- Only tolerance what affects form, fit or function. Tight or GD&T callouts can more than double part cost.
- Reference all toleranced dimensions to **one datum** (e.g. two edges) to avoid stack-up.
- Stick to three-place inch dimensions (0.250, not 0.2500) unless the extra place is really needed.

## Standard Tolerances

| Source | Default | Notes |
|---|---|---|
| ProtoLabs (automated) | ±0.005 in (0.13 mm) | Bilateral. Same as +0.000/-0.010 unilateral band width |
| ProtoLabs precision | ±0.002 in (0.05 mm) | Must be called out on a drawing; longer lead time |
| Reamed holes | ±0.0005 in (0.013 mm) | Size only |
| Xometry default | ±0.005 in (size and location) | ISO 2768 based |
| Tight (most shops) | ±0.001 in | Reaming, grinding, special setups for tighter |

Example: a 1.000 in bracket at ±0.005 measures 0.995-1.005 in; a 0.250 in hole measures 0.245-0.255 in.

## Orientation, Form and Angle (Xometry defaults, metal)

| Part length | Orientation & form (flatness, parallelism, perpendicularity...) | Angularity |
|---|---:|---:|
| 0-12 in | ±0.005 in | ±0.5° |
| 12-24 in | ±0.010 in | ±0.5° |
| 24-36 in | ±0.016 in | ±1.0° |
| 36-60 in | ±0.031 in | ±1.0° |
| over 60 in | ±0.063 in | ±1.0° |

## Surface Finish
- Flat and perpendicular surfaces: about **63 µin Ra** (1.6 µm). Curved / 3D surfaces: **125 µin Ra** (3.2 µm) or better.
- Tool marks and swirl patterns are normal. Bead blast for a uniform matte look.
- Clear plastics machine to a matte / translucent finish; bead blast frosts them.
- Smoother than standard must be called out on the drawing.

## GD&T Basics
| Callout | Controls | Use when |
|---|---|---|
| True position (MMC/LMC) | Hole / feature location to datums | Bolt patterns, dowel holes |
| Flatness | Surface between two parallel planes | Sealing faces, thin plates that may warp |
| Cylindricity | Roundness + straightness of a bore | Bearing bores (±0.005 hole can be oval) |
| Concentricity / runout | Coaxial features | Bore to counterbore, turned shoulders |
| Perpendicularity | Squareness to a datum | Shoulders, mounting faces |

> [!note] GD&T and automated quoting
> Drawings with GD&T usually leave the instant-quote path for manual review and longer lead times. Apply it only to critical features.

## Related
- [[CNC_Finishes|Finishes]]
- [[CNC_Walls_Features_And_Text|Walls, Features & Text]]
- [[CNC_Setups_And_Part_Orientation|Setups & Part Orientation]]

Back to [[00_CNC_3DP_DFM_Table_Of_Contents|Table of Contents]]
