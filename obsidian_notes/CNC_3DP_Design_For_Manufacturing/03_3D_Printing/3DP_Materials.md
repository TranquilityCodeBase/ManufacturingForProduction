---
tags: [dfm, 3dp, materials]
source:
  - https://www.protolabs.com/services/3d-printing/
  - https://www.hubs.com/knowledge-base/
updated: 2026-11-04
---

# 3D Printing Materials

Common materials by process and when to pick each. Ratings are relative (Good / Fair / Poor), not datasheet values.

## Quick Rules
- Pick the process first ([[3DP_Process_Selection]]), then the material within it.
- Heat, UV and chemicals kill many printed plastics. Check heat deflection temperature for anything near motors, lights or sun.
- Standard SLA resins are brittle and creep; use tough / engineering resins for functional parts.
- For production-like plastic parts, nylon (PA12 / PA11) from SLS or MJF is the default.

## FDM
| Material | Strength | Heat | Notes / pick when |
|---|---|---|---|
| PLA | Fair | Poor (~55 °C) | Concept models, easy printing |
| PETG | Good | Fair | Tough general purpose, some chemical resistance |
| ABS / ASA | Good | Fair-Good | ASA is UV stable for outdoor; both warp, need enclosure |
| Nylon / CF nylon | Good | Good | Jigs, fixtures, wear; carbon fiber adds stiffness |
| PC | Good | Good | Impact and heat; hard to print |
| TPU | Flexible | Fair | Gaskets, bumpers, grips |
| ULTEM 9085 / 1010 | Good | Excellent | Flame-rated, aerospace, high temp tooling |

## SLA (resins)
| Resin type | Pick when |
|---|---|
| Standard | Visual models, fine detail |
| ABS-like / tough | Snap fits, enclosures, functional prototypes |
| PC-like | Stiffer, higher temp, clear options |
| PP-like | Flexible-ish, living-hinge feel |
| Clear | Light pipes, flow visualization (needs polishing) |
| High temp | Molding inserts, hot air / fluid tests |
| Elastomeric | Rubber-like seals and grips |
| Ceramic-filled | Very stiff, wind tunnel models, fixtures |

## SLS / MJF (powder bed)
| Material | Pick when |
|---|---|
| PA12 (nylon 12) | Default functional plastic, good chemical resistance |
| PA11 | More ductile, better impact, bio-based |
| Glass / mineral-filled PA | Stiffness, heat, dimensional stability |
| TPU | Flexible lattices, seals, shoes |
| PP (MJF) | Chemical resistance, low moisture, weldable |

## DMLS (metal)
| Material | Pick when |
|---|---|
| AlSi10Mg aluminum | Lightweight housings, heat exchangers |
| Stainless 316L | Corrosion resistance |
| 17-4 PH stainless | Strength + corrosion, heat-treatable |
| Ti-6Al-4V titanium | Strength-to-weight, medical, aerospace |
| Inconel 718 / 625 | High temperature, oxidizing environments |
| Cobalt chrome | Wear, medical, high temp |
| Maraging steel | Tooling inserts, very high strength |
| Copper alloys | Thermal / electrical conduction |

## Related
- [[3DP_Process_Selection|Process Selection]]
- [[CNC_Materials|CNC Materials]]

Back to [[00_CNC_3DP_DFM_Table_Of_Contents|Table of Contents]]
