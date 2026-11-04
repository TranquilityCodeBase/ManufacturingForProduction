---
tags: [dfm, cnc, milling, corners, pockets, radii]
source:
  - https://www.protolabs.com/resources/design-tips/6-ways-to-optimize-part-design-for-cnc-machining/
  - https://www.xometry.com/
updated: 2026-11-04
---

# CNC Inside Corners & Pocket Radii

Pick inside corner and floor radii that a standard cutter can actually cut, quickly.

## Quick Rules
- Inside vertical corners are **never sharp**. A round end mill always leaves a radius of at least the tool radius.
- **Never make the corner radius equal to a standard tool radius** (0.125 in R for a 1/4 in cutter). The tool has to stop, pivot and restart in the corner, which causes chatter and marks.
- Make the corner radius about **1.3 x the tool radius** (1/4 in cutter -> R 0.165 in). Bare minimum is tool radius + 0.005 in (0.1 mm).
- Bigger is better: corner R of at least **1/3 of the pocket depth** lets a stiff, fast tool reach the floor.
- Use **one radius for all inside corners** on a part to avoid tool changes.
- **Floor fillet smaller than the wall radius**, or none. Use 0, a standard bullnose corner radius (0.010-0.030 in, 0.5-1 mm), or a full ball radius.
- Pocket depth **< 4 x pocket width** is ideal; > 6 x is "too deep".
- Need a sharp corner for a square mating part? Use a **dog-bone or T-bone relief**, not a tiny radius.

## Why 1.3 x Tool Radius
When corner R equals tool R, the cutter is buried on two walls at once and must change direction instantly. Slightly larger lets the tool arc through the corner with a steady chip load. Smaller corner radii force a smaller tool, which is shorter, slower and more fragile.

> [!warning] The common new-designer mistake
> Drawing R 0.125 in corners because "we'll use a 1/4 in end mill". Design R 0.130 in minimum, R 0.165 in preferred. Same idea in metric: 6 mm cutter -> R 3.1 mm minimum, R 3.9 mm preferred.

## Standard Cutter Picker

| Cutter dia | Tool R | Minimum corner R | Recommended corner R (1.3x) | Comfortable depth, soft (3x D) | Comfortable depth, hard (2x D) |
|---|---:|---:|---:|---:|---:|
| 1/16 in | 0.031 | 0.037 | **0.045** | 0.188 | 0.125 |
| 1/8 in | 0.063 | 0.068 | **0.085** | 0.375 | 0.250 |
| 3/16 in | 0.094 | 0.099 | **0.125** | 0.563 | 0.375 |
| 1/4 in | 0.125 | 0.130 | **0.165** | 0.750 | 0.500 |
| 3/8 in | 0.188 | 0.193 | **0.245** | 1.125 | 0.750 |
| 1/2 in | 0.250 | 0.255 | **0.325** | 1.500 | 1.000 |
| 2 mm | 1.0 | 1.1 | **1.3** | 6 | 4 |
| 3 mm | 1.5 | 1.6 | **2.0** | 9 | 6 |
| 4 mm | 2.0 | 2.1 | **2.6** | 12 | 8 |
| 6 mm | 3.0 | 3.1 | **3.9** | 18 | 12 |
| 8 mm | 4.0 | 4.1 | **5.2** | 24 | 16 |
| 10 mm | 5.0 | 5.1 | **6.5** | 30 | 20 |
| 12 mm | 6.0 | 6.1 | **7.8** | 36 | 24 |

Inch values in inches, metric in mm. Soft = aluminum, brass, plastics. Hard = steel, stainless, titanium. Up to ~4x D (soft) / 3x D (hard) is still standard tooling with a slower finish pass; beyond ~6x D needs long-reach tools and costs more.

> [!tip] Interactive version
> The website calculator does this for any depth and radius, inch or metric: `pages/calculators.html#corner-picker`.

## Picking a Radius From Pocket Depth
1. Pocket depth **d**. Target corner R >= d / 3 (cost tip).
2. Find the largest cutter whose recommended R fits your design and whose comfortable depth >= d.
3. If the design cannot accept that radius, use corner reliefs instead of a smaller tool.

Example: 0.75 in deep aluminum pocket -> d/3 = 0.25 in -> 3/8 in cutter (R 0.245 in, 1.125 in comfortable depth). A 1/4 in cutter also reaches (R 0.165) but runs slower.

## Floor Fillets
- A floor-to-wall fillet is cut by the **corner radius of the tool** (bullnose) or a ball end mill. Ball-milled floor fillets are slow 3D surfacing.
- Keep floor fillet < wall corner radius so one tool cuts both and flows through the corner.
- Standard bullnose corner radii: 0.005, 0.010, 0.015, 0.020, 0.030, 0.060, 0.090, 0.125 in; 0.2, 0.5, 1.0, 1.5, 2.0, 3.0 mm.
- No functional need? Leave the floor sharp (flat end mill) or use the smallest standard bullnose radius.

## Corner Reliefs (Dog-bones / T-bones)
- Drill or mill a relief into the corner so a square part seats fully.
- A 0.25 in (6.35 mm) wide relief gives functionally sharp corners about 1.25 in (32 mm) deep in steel, roughly twice that in aluminum or plastic.
- Dog-bone (diagonal) is less visible; T-bone (along one wall) is easier to hide in a mating part.
- Cheaper than EDM or a tiny end mill. A 0.031 in (0.8 mm) end mill leaves R 0.016 in but only reaches ~5 x D.

## Pocket Depth and Small Tools
- Depth < 4 x width ideal; 6 x width is the practical limit. Wider at the top (stepped pocket) helps tool access.
- Once depth passes ~2 x cutter diameter, feed rates drop and cycle time climbs.
- Smallest practical corner radii (~0.015 in) only reach a short depth; deep and sharp do not go together.
- Removing material only to save weight? Question whether the pocket is needed at all.

## Related
- [[CNC_Walls_Features_And_Text|Walls, Features & Text]]
- [[CNC_Milling_3Axis_3plus2_5Axis|Milling: 3-Axis, 3+2, 5-Axis]]
- [[CNC_Cost_Reduction_Tips|Cost Reduction Tips]]
- [[Holes_Design_Rules|Hole Design Rules]]

Back to [[00_CNC_3DP_DFM_Table_Of_Contents|Table of Contents]]
