---
tags: [dfm, cnc, materials, machinability, cost]
source:
  - https://www.protolabs.com/services/cnc-machining/
  - https://www.xometry.com/
updated: 2026-11-04
---

# CNC Materials

Machinability, relative cost and when to pick common machined metals and plastics.

## Quick Rules
- Soft metals and plastics machine fastest. Aluminum cuts about **4x faster** than carbon steel; stainless about **half** the speed of carbon steel.
- Don't specify titanium, PEEK, PEI or 17-4 PH unless the function needs them.
- Free-machining grades (303 stainless, C360 brass) cost more per pound but save machine time at volume.
- Plastics hold tolerance less well and can warp after machining; allow ~2x metal tolerance.

## Relative Bulk Material Price (cost tip example)

| Metal | Price | Plastic | Price |
|---|---:|---|---:|
| Aluminum 6061 | $25 | ABS | $17 |
| Aluminum 7075 | $80 | POM (Delrin) | $27 |
| Stainless 304 | $90 | Nylon 6 | $30 |
| C360 brass | $148 | PEEK | $300 |
| Stainless 303 | $150 | | |

Illustrative relative bulk prices for the same block; real prices move. The ranking is what matters.

## Metals

| Material | Pick it for | Notes |
|---|---|---|
| Aluminum 6061-T6 | General purpose, brackets, housings | Best value, easy to machine, anodizes well |
| Aluminum 7075-T6 | Higher strength, aerospace | Harder, pricier, less weldable |
| Brass C360 | Fittings, small turned parts | Free machining; great at volume |
| Copper 101/110 | Electrical / thermal | Gummy, expensive; aluminum is nearly as conductive and easier |
| Steel 1018 | Low cost structural, case-hardenable | Rusts; plate or coat |
| Steel 4140 | Hardness, wear, shafts | Can be heat treated |
| Stainless 303 | Machined fittings, volume parts | Free machining, slightly lower corrosion resistance, poor weldability (welding not recommended) |
| Stainless 304 / 316L | Corrosion resistance, food / marine | Work hardens; slower |
| Stainless 17-4 PH | High strength + corrosion | Hard to cut; use 304/316L if strength not needed |
| Titanium Ti-6Al-4V | Strength-to-weight, medical, aerospace | Slow, expensive |

## Plastics

| Material | Pick it for | Notes |
|---|---|---|
| Acetal / POM (Delrin) | Gears, bushings, wear parts | Machines beautifully, stable, low moisture uptake |
| ABS | Housings, prototypes of molded parts | Cheap, tough |
| Nylon 6 / 6/6 | Wear, impact | Absorbs moisture -> dimensions move |
| Polycarbonate | Clear / impact parts | Machined faces go matte |
| Acrylic (PMMA) | Clear covers, light pipes | Chips easily |
| UHMW / HDPE | Wear strips, low friction | Soft, hard to hold tolerance |
| PTFE | Seals, chemical resistance | Very slippery, creeps, poor tolerance |
| PEEK, PEI (Ultem) | High temp, chemical, medical | 5x+ the cost of common plastics |
| Glass-filled grades | Stiffness | Wears tools faster |

## Substitution Tips
- 17-4 PH -> 304 or 316L if strength is not critical.
- Copper -> aluminum if conductivity requirements allow.
- 4140 -> 1018 + case hardening for low cost hardness.
- Brass or magnesium are free-machining when properties fit.

## Related
- [[CNC_Finishes|Finishes]]
- [[CNC_Cost_Reduction_Tips|Cost Reduction Tips]]
- [[3DP_Materials|3DP Materials]]

Back to [[00_CNC_3DP_DFM_Table_Of_Contents|Table of Contents]]
