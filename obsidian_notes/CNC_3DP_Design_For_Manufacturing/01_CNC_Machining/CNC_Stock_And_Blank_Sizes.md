---
tags: [dfm, cnc, stock, blank, material-size]
source:
  - https://www.xometry.com/
  - https://www.protolabs.com/services/cnc-machining/cnc-milling/design-guidelines/
updated: 2026-11-04
---

# CNC Stock & Blank Sizes

Set part extents so they fit inside common stock with clean-up allowance.

## Quick Rules
- The blank must be **larger than the finished part** so rough saw / mill faces can be cleaned up.
- Allow about **1/16-1/8 in (1.5-3 mm) per side** on cut faces. Example: 1 x 1 x 1 in part -> ~1.125 in cube blank.
- Cost tip rule of thumb: **part size < blank size - 3 mm**.
- The closer the part is to its bounding box, the less material is removed and the cheaper it is.
- Watch dimensions that land **just over** a stock size (1.010 in from 1 in plate forces 1.25 in plate). Shrink the design or move up deliberately.
- Thickness: design **under nominal plate thickness** so both faces can be skimmed, or accept as-rolled faces where tolerance allows.
- Round parts: pick a finished OD that fits a standard bar with ~0.03-0.06 in (1-1.5 mm) on diameter to clean up.
- Automated vendors keep fixed pre-stocked block sizes; extents near a block limit can jump to the next block or out of the instant quote.

## Common US Inch Stock

| Form | Common sizes |
|---|---|
| Aluminum plate / flat bar thickness | 1/8, 3/16, 1/4, 5/16, 3/8, 1/2, 5/8, 3/4, 1, 1-1/4, 1-1/2, 1-3/4, 2, 2-1/2, 3, 3-1/2, 4 in |
| Flat bar widths | 1/2, 3/4, 1, 1-1/4, 1-1/2, 2, 2-1/2, 3, 3-1/2, 4, 5, 6, 8, 10, 12 in |
| Round bar diameter | 1/8 in steps to 2 in, then 1/4 in steps to ~4 in, then 1/2 in steps |
| Square bar | 1/4, 3/8, 1/2, 5/8, 3/4, 1, 1-1/4, 1-1/2, 2, 2-1/2, 3, 4 in |
| Plastic sheet (Delrin, nylon, UHMW, ABS) | 1/8, 1/4, 3/8, 1/2, 3/4, 1, 1-1/2, 2, 3, 4 in |

Availability varies by alloy (6061 widest; 7075, stainless, brass narrower). Check your supplier.

## Common Metric Stock

| Form | Common sizes (mm) |
|---|---|
| Plate thickness | 3, 4, 5, 6, 8, 10, 12, 15, 16, 20, 25, 30, 35, 40, 50, 60, 80, 100 |
| Flat bar widths | 10, 12, 15, 20, 25, 30, 40, 50, 60, 80, 100, 120, 150, 200 |
| Round bar diameter | 3-20 in 1 mm steps, then 22, 25, 28, 30, 32, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 90, 100 |
| Square bar | 6, 8, 10, 12, 15, 20, 25, 30, 40, 50 |

## Finished Size -> Stock To Buy (examples)

| Finished part | Allowance | Stock to buy | Note |
|---|---|---|---|
| 0.875 in thick plate part | skim both faces | 1 in plate | Good fit |
| 1.000 in thick, faces critical | 0.030+ per face | 1-1/4 in plate | Or accept as-rolled 1 in faces |
| 0.98 in thick, faces non-critical | none | 1 in plate | Design for the stock |
| 2.90 x 1.90 in profile | 0.06 per side | 3 x 2 in bar | Profile cut on all sides |
| 0.740 in OD shaft | 0.010 on dia | 3/4 in bar | Tight; 7/8 if OD finish critical |
| 23 mm OD bushing | 1-2 mm on dia | 25 mm bar | Good fit |
| 9.5 mm thick plate part | skim both faces | 10 mm plate | Tight; 12 mm if flatness critical |

> [!warning] Just-over sizes
> A design 1.02 in thick, 3.1 in wide or 25.5 mm diameter wastes a whole stock size. Check extents against stock before detailing.

## Related
- [[CNC_Milling_3Axis_3plus2_5Axis|Milling envelopes]]
- [[CNC_Materials|Materials]]
- [[CNC_Cost_Reduction_Tips|Cost Reduction Tips]]

Back to [[00_CNC_3DP_DFM_Table_Of_Contents|Table of Contents]]
