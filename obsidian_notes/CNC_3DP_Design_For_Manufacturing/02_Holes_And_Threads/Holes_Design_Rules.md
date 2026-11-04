---
tags: [dfm, cnc, holes, drilling, reaming]
source:
  - https://www.xometry.com/
  - https://www.protolabs.com/services/cnc-machining/cnc-milling/design-guidelines/
updated: 2026-11-04
---

# Hole Design Rules

Diameters, depths and placement that drill fast and accurately.

## Quick Rules
- Use **standard drill sizes**: fractional / number / letter drills, or metric in **0.1 mm steps to 10 mm, 0.5 mm steps above**.
- Fewer different hole sizes = fewer tool changes.
- Depth : diameter **< 10 : 1** is achievable, **4 : 1 is optimal** (0.250 in hole x 1 in deep).
- Holes **end-milled** rather than drilled get hard past about **6 x D** (tool length); may need work from both sides.
- **Blind holes**: add about **25% extra depth** for the drill point and chips (and 0.5 x D below threads).
- Prefer **through holes**: easier to drill, ream, tap and deburr.
- Drill entry and exit **perpendicular to the surface**. Add a spot face or flat on curved / sloped faces.
- **Partial holes** at an edge: keep at least **75%** of the hole inside the material.
- Keep holes **>= 0.030 in (0.8 mm) from walls** in metal, about double in plastic.
- Avoid holes that break into cavities; if unavoidable keep the drill axis clear of the cavity.

## Hole Size and Tolerance

| Method | Typical tolerance | Use |
|---|---|---|
| Drilled | ±0.005 in (0.13 mm), slightly oversize | Clearance holes, tap drills |
| End-milled (interpolated) | ±0.005 in, good finish | Odd sizes, large holes |
| Reamed | ±0.0005 in (0.013 mm) | Dowel pins, bearing fits |
| Bored | ±0.0005-0.001 in | Large precision bores |

- Design the hole to the **exact drill size** when you can; otherwise the shop drills undersize and mills to size (slower).
- Reamed holes need a drilled pre-hole and some depth beyond the reamed length (or a through hole).
- For dowel pins, use one round hole and one slot to avoid over-constraint.

## Depth Guidance

| Depth / dia | Status |
|---|---|
| <= 4 | Standard drilling, fast |
| 4-10 | Peck drilling, slower; still standard |
| > 10 | Gun drilling or special tools; avoid on prototypes |

## Clearance Holes
- Use close fit for location-critical bolts, free / normal fit for general assembly. Values in [[Tap_Drill_Chart_Inch]] and [[Tap_Drill_Chart_Metric]].
- Counterbores and countersinks: use standard screw head sizes so standard counterbore tools work.

## Related
- [[Threads_Design_Rules|Thread Design Rules]]
- [[Tap_Drill_Chart_Inch|Tap Drill Chart - Inch]] / [[Tap_Drill_Chart_Metric|Metric]]
- [[CNC_Walls_Features_And_Text|Walls, Features & Text]]

Back to [[00_CNC_3DP_DFM_Table_Of_Contents|Table of Contents]]
