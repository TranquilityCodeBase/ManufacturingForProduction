---
tags: [dfm, 3dp, fdm, sla, sls, mjf, dmls, process-selection]
source:
  - https://www.protolabs.com/resources/design-tips/3d-printing-tolerances/
  - https://www.protolabs.com/resources/design-tips/7-mistakes-to-avoid-when-designing-3d-printed-parts/
  - https://www.hubs.com/knowledge-base/how-design-parts-sls-3d-printing/
updated: 2026-11-04
---

# 3D Printing Process Selection

FDM vs SLA vs SLS vs MJF vs DMLS at a glance, and when to machine instead.

## Quick Rules
- Cheapest quick look-and-feel part: **FDM**. Fine detail and smooth surface: **SLA**. Tough functional nylon without supports: **SLS / MJF**. Metal with internal features: **DMLS**.
- Choose the **cheapest process that meets function**, not the best-looking one.
- Prints are **anisotropic** to some degree (worst in FDM along Z). Orient load paths in-plane.
- Plan to **drill / ream / tap critical holes** after printing.

## Process Comparison

| | FDM | SLA | SLS | MJF | DMLS |
|---|---|---|---|---|---|
| How | Extruded thermoplastic filament | UV laser cures liquid resin | Laser sinters nylon powder | Fusing agent + heat on nylon powder | Laser melts metal powder |
| Typical layer | 0.1-0.3 mm | 0.025-0.1 mm | 0.1-0.12 mm | 0.08 mm | 0.02-0.06 mm |
| Typical tolerance | ±0.2-0.5 mm (printer dependent) | ±0.002 in XY / ±0.005 in Z + 0.1% | ±0.010 in + 0.1% | ±0.012 in + 0.1% | ±0.003 in XY / ±0.006 in Z + 0.1% |
| Min wall | ~0.8-1.2 mm | 0.4 mm supported / 0.6 mm unsupported | ~0.8 mm (PA12) | 0.8 mm (2.5-4 mm ideal) | ~0.4-1.0 mm |
| Supports | Yes, over ~45° | Yes | No (powder) | No (powder) | Yes, plus anchoring for heat |
| Surface | Visible layers | Smoothest | Grainy matte | Grainy matte, gray/black | Rough, needs machining for fits |
| Strength | Weak across layers | Brittle to tough (resin) | Good, near isotropic | Good, near isotropic | Near wrought metal |
| Cost / speed | Lowest, slow per part | Low-medium, fast small parts | Medium, cheap when nested | Medium, fast batches | Highest |
| Best for | Concept models, jigs, fixtures | Detail, clear parts, masters | Functional nylon, snap fits, living hinges | Production nylon batches | Metal with channels, lattices, consolidated assemblies |

Tolerance values for SLA, SLS, MJF and DMLS are ProtoLabs published values (base + 0.1% of nominal). Other vendors quote looser numbers (e.g. ±0.3% with a ±0.3 mm floor).

## Pick It When
- **Need it tomorrow, looks matter little** -> FDM in-house.
- **Small, detailed, smooth, or clear** -> SLA.
- **Functional plastic, snap fits, no support marks, a few to a few hundred** -> SLS or MJF.
- **Rubber-like** -> SLA elastomer, TPU (SLS/MJF/FDM).
- **Metal with internal channels or that cannot be machined** -> DMLS (budget for post-machining).
- **Metal part that can be machined** -> CNC is usually cheaper, stronger and more accurate.

## 3D Printing vs CNC for Plastic Parts
- **Machining wins**: material choice (real engineering plastics), accuracy, long-term dimensional stability, surface finish, easier path to injection molding later.
- **Printing wins**: internal channels, hollow / lattice parts, organic shapes, parts that would be mostly chips if machined (rings, frames), very fast iteration.
- SLA parts are less dimensionally stable over time than machined parts; SLS is rougher but about as stable as machined nylon.
- Planning to mold later? Printed geometry often needs redesign for molding; a machined prototype of a moldable design is closer to production.

## Related
- [[3DP_Materials|3DP Materials]]
- [[3DP_Overhangs_And_Supports|Overhangs & Supports]]
- [[3DP_Internal_Passages_And_Escape_Holes|Internal Passages & Escape Holes]]
- [[3DP_Quality_Time_And_Cost_Tips|Quality, Time & Cost Tips]]

Back to [[00_CNC_3DP_DFM_Table_Of_Contents|Table of Contents]]
