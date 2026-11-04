---
tags: [dfm, cnc, turning, lathe, live-tooling]
source:
  - https://www.protolabs.com/services/cnc-machining/cnc-turning/design-guidelines/
  - https://www.protolabs.com/resources/design-tips/mastering-complex-features-on-machined-parts/
  - https://www.xometry.com/
updated: 2026-11-04
---

# CNC Turning (Lathe)

When to turn instead of mill, and the feature limits for turned parts.

## Quick Rules
- Axially symmetric part (shafts, pins, fittings, pistons, spacers)? **Turn it.** Smoother, rounder, less waste, about 15% cheaper than milling.
- Long length-to-diameter parts suit the lathe far better than a mill.
- Live tooling + Y-axis adds flats, cross holes, slots and off-center holes in the same setup.
- Milled features on a lathe part should be **parallel or perpendicular** to the part axis.
- ProtoLabs turns **metals only** (aluminum, brass, low carbon steel, stainless, 4140, titanium).
- Model external threads as a **plain diameter**; assign the thread in the quote. See [[Threads_ProtoLabs_Special_NPT_And_OD]].

## Turn or Mill?
| Lathe candidate | Mill candidate | Either |
|---|---|---|
| Pint glass, dumbbell, hose barb, spool valve piston, shaft with grooves | Coffee cup with handle, valve body, picture frame, milk carton | Saucer (faster on a lathe), grill wheel (face cutouts need milling) |

Rule of thumb: if the outline is a profile spun around one axis, it is a lathe part. Square features on a round part -> live tooling or mill-turn.

## ProtoLabs Turning Limits (published)

| Feature | Limit |
|---|---|
| Max part size | 3.95 in (100 mm) dia x 9 in (228 mm) long |
| Min part size | 0.16 in (4 mm) dia x 0.050 in (1.3 mm) long |
| Conical points | Included angle > 30° |
| On-axis / axial holes | >= 0.040 in (1 mm) dia, depth <= 6 x dia |
| Radial (cross) holes | >= 0.080 in (2 mm) dia |
| Milled grooves / slots (live tool) | wider than 0.047 in (1.2 mm) |
| External grooves | <= 0.95 in (24 mm) deep, >= 0.047 in (1.2 mm) wide |
| Text | Raised preferred; line width and spacing >= 0.020 in (0.5 mm) |
| Turning tool nose radius | about 0.016 in (0.4 mm): inside shoulders get this radius, relieve mating parts |
| Internal threads (live tool) | about #4-40 to 1/2-20, M3 to M10 |

Other vendors (e.g. Xometry network) turn up to about 32 in dia x 62 in long, with Swiss and multi-spindle machines for small parts.

## Hole Types on Turned Parts
- **On-axis**: on the centerline, drilled/bored by the lathe itself. Best accuracy and finish.
- **Axial**: parallel to the axis but off center (live tool on the face).
- **Radial**: through the side, perpendicular to the axis (live tool). Keep entry on a flat or at least perpendicular to the surface.

## Design Tips
- Add a **thread relief groove** at the end of external threads and an undercut at shoulders where a mating part must seat flat.
- Keep wall thickness of tubes reasonable; thin tubes chatter and distort in the chuck.
- Use standard **bar stock diameters** so the OD may not even need turning (see [[CNC_Stock_And_Blank_Sizes]]).
- Avoid sharp internal corners at shoulders; the tool nose leaves a radius anyway.
- Turned surfaces are smoother than milled ones; milled flats may show tool marks (bead blast to blend).

## Related
- [[CNC_Milling_3Axis_3plus2_5Axis|Milling: 3-Axis, 3+2, 5-Axis]]
- [[Threads_ProtoLabs_Special_NPT_And_OD|NPT & OD Threads]]
- [[CNC_Setups_And_Part_Orientation|Setups & Part Orientation]]

Back to [[00_CNC_3DP_DFM_Table_Of_Contents|Table of Contents]]
