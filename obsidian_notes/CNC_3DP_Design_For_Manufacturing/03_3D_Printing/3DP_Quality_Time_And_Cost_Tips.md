---
tags: [dfm, 3dp, quality, cost, fits, inserts]
source:
  - https://www.protolabs.com/resources/design-tips/3d-printing-tolerances/
  - https://www.protolabs.com/resources/design-tips/7-mistakes-to-avoid-when-designing-3d-printed-parts/
  - https://www.protolabs.com/en-gb/resources/blog/designing-a-part-for-multi-jet-fusion/
updated: 2026-11-04
---

# 3DP Quality, Time & Cost Tips

Design and orientation choices that make prints better, faster and cheaper.

## Quick Rules
- **Orientation** sets strength (FDM), surface quality (supports) and time (Z height for SLA / DMLS).
- **Cost drivers**: FDM / SLA = material volume + support volume + time; SLS / MJF = bounding box volume (nesting); DMLS = height, supports, post-machining.
- Keep walls **uniform**; avoid big thick slabs (warp, sink, cost). Hollow or shell thick parts.
- Holes print **undersize**: print small and **drill / ream** to size if critical.
- Use **heat-set inserts** for threads in plastic prints; tap holes for occasional use. Model printed threads only for coarse threads at **1/4-20 / M6 and larger**; below that, tap or insert.
- Combine parts (part consolidation) when it removes fasteners and assembly, but keep features printable.

## Minimum Walls and Features (conservative design values)

| Process | Min wall | Min feature / pin | Min hole | Embossed / engraved text |
|---|---:|---:|---:|---|
| FDM | 1.2 mm (3 perimeters at 0.4 mm) | 2 mm | 2 mm | 0.6-1 mm deep, 10 pt+ bold |
| SLA | 0.6 mm unsupported / 0.4 mm supported | 0.3 mm | 0.5-1 mm | 0.3-0.5 mm deep |
| SLS | 0.8-1.0 mm (PA12) | 0.8 mm | 1.5 mm | 0.5-1 mm deep |
| MJF | 0.8 mm (2.5-4 mm ideal) | 0.5-0.8 mm | 1.5 mm | 0.5-1 mm deep |
| DMLS | 0.5 mm min (1 mm preferred) | 0.5 mm | 1 mm | 0.3-0.5 mm deep |

Thinner may print but won't survive handling or post-processing. Taller features need more thickness.

## Fits and Clearances

| Process | Sliding / easy fit, per side | Same fit, on diameter | Light press fit | Print-in-place moving parts (per side) |
|---|---:|---:|---:|---:|
| FDM | 0.2-0.5 mm (0.008-0.020 in) | 0.4-1.0 mm | 0-0.1 mm, then test | >= 0.5 mm |
| SLA | 0.1-0.2 mm (0.004-0.008 in) | 0.2-0.4 mm | not recommended (brittle) | >= 0.5 mm |
| SLS / MJF | 0.3-0.5 mm (0.012-0.020 in) | 0.6-1.0 mm | 0-0.1 mm (nylon is forgiving) | 0.5-0.8 mm, plus powder escape |
| DMLS | machine mating faces | machine to size | machine to size | rarely practical |

Print a fit-test coupon on the actual machine/material when fits matter.

## Strength and Warp
- FDM is weakest **across layers** (Z). Orient so bending / pulling loads run along the layers.
- Add fillets where walls meet the base; sharp inside corners concentrate stress.
- Large flat areas warp (FDM, SLS, DMLS). Add ribs, break up flats, or reorient at an angle.
- MJF / SLS: hollow sections thicker than ~4 mm to 2-4 mm walls with escape holes.

## Reduce Print Time and Cost
- Lower Z height for SLA and DMLS (time is mostly layers). For SLS / MJF, shrink the **bounding box** so more parts nest per build.
- Reduce support volume: 45° chamfers, self-supporting holes, smart orientation.
- FDM: thicker layers (0.2-0.3 mm) and lower infill (15-25%) for non-critical parts; 3-4 perimeters do more for strength than infill.
- Batch parts in one build; print multiple sizes of a fit-test at once.
- Use the **cheapest process that meets function**; don't SLA what FDM can do.

## File Prep
- Export STL / 3MF at fine enough resolution (chord ~0.01 mm, angle ~5°); coarse facets show on curved surfaces.
- Check units on export (mm vs inch is the classic 25.4x error).
- Send STEP for quoting where the vendor accepts it; keep a drawing for critical dimensions and post-machining.

## Related
- [[3DP_Process_Selection|Process Selection]]
- [[3DP_Overhangs_And_Supports|Overhangs & Supports]]
- [[3DP_Internal_Passages_And_Escape_Holes|Internal Passages & Escape Holes]]
- [[Threads_Design_Rules|Thread Design Rules]]

Back to [[00_CNC_3DP_DFM_Table_Of_Contents|Table of Contents]]
