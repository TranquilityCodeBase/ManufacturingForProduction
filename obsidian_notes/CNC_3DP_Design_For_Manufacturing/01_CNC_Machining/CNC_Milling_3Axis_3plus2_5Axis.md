---
tags: [dfm, cnc, milling, 5-axis, 3plus2]
source:
  - https://www.protolabs.com/services/cnc-machining/cnc-milling/design-guidelines/
  - https://www.protolabs.com/resources/design-tips/mastering-complex-features-on-machined-parts/
updated: 2026-11-04
---

# CNC Milling: 3-Axis, 3+2 and 5-Axis

Which milling style a part needs, what it costs, and how to design for each.

## Quick Rules
- Design for **3-axis** first: features on the 6 orthogonal faces, holes parallel to X, Y or Z.
- Angled features on a few faces -> **3+2 (indexed 5-axis)**. Swept / sculpted surfaces -> **continuous 5-axis**.
- Round parts with milled flats or cross holes -> **turning with live tooling** (often cheaper than milling).
- Simple **2.5D** geometry (flat floors, vertical walls) machined in **one setup** is the cheapest milled part.
- Standard cutters reach about **2 in (51 mm)** deep; deeper features need long tools or work from both sides.

## Relative Cost (cost tip guide, vs 3-axis milling)

| Process | Relative cost | Typical use |
|---|---:|---|
| CNC turning (lathe) | about -15% | Axially symmetric parts |
| 3-axis milling | baseline | Prismatic parts, 2.5D pockets, holes on cardinal axes |
| 3+2 indexed 5-axis | about +25% | Angled holes / faces, fewer setups on complex blocks |
| Continuous 5-axis | about +60% | Impellers, blades, sculpted surfaces, undercut-like contours |
| Mill-turn 5-axis | about +100% | Complex round + prismatic parts in one machine |

## 3-Axis Milling
- Tool moves X, Y, Z; the part is flipped by hand or fixture to reach other faces (each flip = a setup).
- Every milled feature should be cut straight down one of the cardinal directions.
- Holes to be threaded must line up with a cutting direction.
- Up to 6 orthogonal sides can be reached. ProtoLabs: parts larger than **10 x 7 in (254 x 178 mm)** are milled top and bottom only, no side setups.

## 3+2 (Indexed) 5-Axis
- Two rotary axes **tilt and lock** the part, then it is cut like 3-axis. Many angled faces in one fixture.
- Fewer setups -> better feature-to-feature accuracy than re-fixturing.
- Design tip: give each angled feature a flat face normal to its axis so the tool enters squarely.

## Continuous (Simultaneous) 5-Axis
- All five axes move while cutting. Needed for true freeform surfaces (propellers, turbine blades, implants).
- Ball and bullnose tools finish surfaces in many small steps: long cycle times. Only use where the shape demands it.
- ProtoLabs 5-axis uses rod stock; published max part extents about **2.6 x 2.9 x 3.9 in**.

## End Mill Types
| Type | Used for | Design impact |
|---|---|---|
| Flat end mill | Bulk removal, vertical walls, flat floors | Leaves sharp floor edge; corner R = tool radius |
| Bullnose | Same as flat, stronger edge, used in hard metals | Leaves small floor fillet = tool corner radius |
| Ball end mill | Fillets, chamfers, sloped / 3D surfaces | Slow surfacing passes; scallops on slopes |

## Envelopes (ProtoLabs published, automated service)

| Envelope | Size | Notes |
|---|---|---|
| Standard milling | 10 x 7 x 3.75 in (254 x 178 x 95 mm) | Aluminum and most plastics; steels/stainless/titanium/brass shallower (about 1.75 in) |
| Large blocks | up to 22 x 14 x 3.75 in (559 x 356 x 95 mm) | Two-sided milling only, mainly aluminum |
| 5-axis | about 2.6 x 2.9 x 3.9 in | Rod stock |
| Turning | 3.95 in dia x 9 in long | See [[CNC_Turning]] |
| Xometry milling | up to about 80 x 48 x 24 in | Network shops, manual review over 24 in tall |

Max size varies by material. Check the vendor's current table.

## Related
- [[CNC_Setups_And_Part_Orientation|Setups & Part Orientation]]
- [[CNC_Inside_Corners_And_Pocket_Radii|Inside Corners & Pocket Radii]]
- [[CNC_Turning|CNC Turning]]
- [[CNC_Stock_And_Blank_Sizes|Stock & Blank Sizes]]

Back to [[00_CNC_3DP_DFM_Table_Of_Contents|Table of Contents]]
