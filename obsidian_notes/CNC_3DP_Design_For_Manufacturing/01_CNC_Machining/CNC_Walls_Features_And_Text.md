---
tags: [dfm, cnc, walls, features, text, undercuts]
source:
  - https://www.protolabs.com/services/cnc-machining/cnc-milling/design-guidelines/
  - https://www.xometry.com/
updated: 2026-11-04
---

# CNC Walls, Features & Text

Wall thickness, tall/thin features, slots, undercuts, edge breaks and engraved text.

## Quick Rules
- Minimum wall: **metal 0.030 in (0.8 mm)**, **plastic 0.060 in (1.5 mm)**. Absolute floor ~0.020 in (0.5 mm), which may break or warp.
- Wall height : thickness about **3:1** is comfortable; keep thin features under **4:1** or brace them.
- Maximum practical wall / feature depth about **2 in (51 mm)** with standard tooling.
- Deep slots: depth **< 6 x slot width**; leave >= 0.020 in (0.5 mm) of wall next to them.
- Holes and pockets at least **0.030 in (0.8 mm) from a wall** in metal, double that in plastic.
- Text: **recessed**, stroke and spacing >= **0.020 in (0.5 mm)**, **20 pt+ sans serif** (Arial, Verdana, Helvetica). Laser marking is cheaper.
- Edge breaks: a **45° chamfer** is cheaper than a fillet. Consider deburring by hand instead of modeling it.

## Walls
| Material | Minimum wall | Comfortable wall |
|---|---:|---:|
| Aluminum, brass, steel | 0.030 in (0.8 mm) | 0.060 in+ (1.5 mm+) |
| Plastics, composites | 0.060 in (1.5 mm) | 0.120 in+ (3 mm+) |

- Thin walls chatter, ripple, deflect away from the cutter and miss tolerance. They can also warp after release from the stock.
- Taller wall -> thicker wall. 1-3° of draft on a tall wall makes it stiffer and easier to cut.
- Do not make walls needlessly thick either; it is extra material to clear at 10,000-15,000 rpm.
- Add ribs or connect small features to a wall to stiffen them.

## Tall, Thin and Small Features
- Feature height : width < 4. Above that, add bracing or rethink the feature.
- Ribbed heatsink-like features are possible but each fin is a thin wall problem. Check with the vendor.
- Very deep, narrow cavities need long, small tools: slow, fragile, expensive.

## Undercuts
- Cut with T-slot, keyseat or dovetail cutters from the side.
- Use **standard cutter widths and depths** (e.g. 1/8, 3/16, 1/4 in widths). Odd sizes mean custom tools.
- Shallow is better; there is no "standard" depth but cutter reach is limited.
- The tool must physically reach the undercut from an open side. Model clearance for the shank.

## Edge Breaks and Deburring
- Most shops break sharp edges by default. Note edges that must stay sharp.
- Modeled fillets on outside edges are cut with ball mills in 3D motion: slow. Chamfers use a chamfer mill in one pass.
- Cosmetic only? Leave it off the model and deburr with a file, abrasive or deburring tool.

## Text and Part Marking
| Method | Cost | Notes |
|---|---|---|
| Engraved (recessed) text | Medium-high | Small ball/flat end mill traces every letter. Fine for prototypes, adds up at volume |
| Embossed (raised) text | High | Clears all surrounding material. Avoid on milled parts |
| Laser marking / etch | Low | Crisp, permanent, little lead time impact |
| Ink stamp / silk screen | Low / medium | Non-permanent or color graphics |
| Bag and tag | Lowest | Part number on the bag only |

- Engraving minimums: 0.020 in (0.5 mm) stroke and spacing, 20 pt sans serif. Soft metals and plastic: ~14 pt Arial Rounded 0.3 mm deep works; hard metals ~22 pt.
- Supply a vector file (DXF / AI) for logos.

## Avoid Unnecessary Machining
- Don't pocket out large areas that could be cut away as the outside profile. Cutting a shape free from the block can halve machine time versus milling around it.
- Lightening pockets only to save weight cost machine time; question them on prototypes.
- If a design is very complex, split it into simpler parts and fasten them.

## Related
- [[CNC_Inside_Corners_And_Pocket_Radii|Inside Corners & Pocket Radii]]
- [[CNC_General_Rules_And_Tolerances|General Rules & Tolerances]]
- [[Holes_Design_Rules|Hole Design Rules]]

Back to [[00_CNC_3DP_DFM_Table_Of_Contents|Table of Contents]]
