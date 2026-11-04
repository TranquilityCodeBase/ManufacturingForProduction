---
tags: [dfm, 3dp, overhangs, supports, bridging]
source:
  - https://www.protolabs.com/resources/design-tips/7-mistakes-to-avoid-when-designing-3d-printed-parts/
  - https://blogs.solidworks.com/products/solidworks/introduction-designing-metal-3d-printing
  - https://www.fastradius.com/wp-content/uploads/2022/04/fdm-dfm-design-guide.pdf
updated: 2026-11-04
---

# 3DP Overhangs & Supports

Keep down-facing surfaces self-supporting to cut support material, cleanup and cost.

## Quick Rules
- **45° rule**: surfaces at **45° or steeper from horizontal** (i.e. at most 45° from vertical) usually print without support.
- Flatter than that, or horizontal ceilings, need supports or a redesign.
- FDM **bridges** (flat span supported at both ends): **5-10 mm reliable**, up to ~20 mm with good cooling.
- Replace down-facing **fillets with 45° chamfers**; the start of a fillet underside is nearly horizontal and sags.
- Horizontal holes: **teardrop or diamond top**; FDM round holes under ~10 mm usually self-support.
- **SLS / MJF need no supports** (powder bed carries the part), but thick sections still warp.
- **DMLS**: overhangs beyond about **0.5 mm (0.020 in)** or flatter than 45° need supports, which must be cut / machined / wire-EDM'd off. Supports also anchor the part against heat distortion.

## Overhang Limits by Process

| Process | Self-supporting angle (from horizontal) | Supports | Cleanup |
|---|---|---|---|
| FDM | >= 45° (some printers 30-35° with cooling) | Same or breakaway / soluble material | Marks on supported faces |
| SLA | >= ~30-45° | Fine resin supports | Small nubs to sand; orient to hide them |
| SLS / MJF | Any | None | Powder blast |
| DMLS | >= 45° | Metal, structural | Machining / EDM, adds cost and lead time |

## Orientation Tips
- Put cosmetic faces **up** or vertical; supported faces get marks.
- SLA: tilt flat faces 10-45° to reduce peel forces and suction; avoid unsupported "islands" (first points of a feature that start in mid-air).
- FDM: orient so loads are along layers, not peeling them apart (see [[3DP_Quality_Time_And_Cost_Tips]]).
- DMLS: orient to minimize supports on surfaces you can't machine afterwards.

## Design Fixes for Overhangs
| Problem | Fix |
|---|---|
| Flat ceiling / shelf | Add 45° chamfer or gusset underneath |
| Bottom-edge fillet | Change to 45° chamfer |
| Horizontal hole | Teardrop / diamond top, or print vertical |
| Long flat bridge | Shorten span, add a pillar, or reorient |
| Internal overhang (can't remove supports) | Self-supporting shape (see [[3DP_Internal_Passages_And_Escape_Holes]]) |
| Text on underside | Move to a side or top face |

## Related
- [[3DP_Internal_Passages_And_Escape_Holes|Internal Passages & Escape Holes]]
- [[3DP_Process_Selection|Process Selection]]
- [[3DP_Quality_Time_And_Cost_Tips|Quality, Time & Cost Tips]]

Back to [[00_CNC_3DP_DFM_Table_Of_Contents|Table of Contents]]
