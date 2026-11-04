---
tags: [dfm, toc, cnc, 3dp]
updated: 2026-11-04
---

# CNC & 3D Printing - Design for Manufacturing

One-stop quick reference for machining and 3D printing rules while designing.

## Quick Numbers

| Rule | Value |
|---|---|
| Standard CNC tolerance | ±0.005 in (±0.13 mm) |
| Inside corner radius | 1.3 x tool radius (never equal to it); R >= depth / 3 |
| Floor fillet | Smaller than wall radius, or none |
| Pocket depth | < 4 x width (6 x max) |
| Min wall | Metal 0.030 in (0.8 mm), plastic 0.060 in (1.5 mm) |
| Hole depth | < 10 x D, 4 x D optimal |
| Thread length | <= 2-3 x D; blind holes + 0.5 x D unthreaded |
| Threads in CAD | Model the pilot hole + cosmetic thread, not the helix |
| Engraved text | Recessed, 0.020 in (0.5 mm) stroke, 20 pt sans serif |
| 3DP overhang | Self-supporting at >= 45° from horizontal |
| Powder / resin escape holes | 2+ holes, opposite ends, ~3.5-5 mm (SLS/MJF) |

## CNC Machining
- [[CNC_General_Rules_And_Tolerances|General Rules & Tolerances]] - default tolerances, ISO 2768 table, surface finish, GD&T basics
- [[CNC_Inside_Corners_And_Pocket_Radii|Inside Corners & Pocket Radii]] - corner/floor radius rules and standard cutter picker table
- [[CNC_Walls_Features_And_Text|Walls, Features & Text]] - wall thickness, slots, undercuts, edge breaks, engraving
- [[CNC_Milling_3Axis_3plus2_5Axis|Milling: 3-Axis, 3+2, 5-Axis]] - when to use each, relative cost, envelopes
- [[CNC_Turning|CNC Turning]] - lathe limits, hole types, live tooling
- [[CNC_Setups_And_Part_Orientation|Setups & Part Orientation]] - fewer setups, datums, workholding checklist
- [[CNC_Stock_And_Blank_Sizes|Stock & Blank Sizes]] - blank allowance, common inch/metric stock
- [[CNC_Materials|Materials]] - machinability, relative cost, substitutions
- [[CNC_Finishes|Finishes]] - anodize, plating, coatings and their dimensional effects
- [[CNC_Cost_Reduction_Tips|Cost Reduction Tips]] - the cost checklist

## Holes & Threads
- [[Threads_Design_Rules|Thread Design Rules]] - don't model threads, lengths, blind holes, inserts
- [[Holes_Design_Rules|Hole Design Rules]] - drill sizes, depth ratios, placement, reaming
- [[Threads_ProtoLabs_UNC|ProtoLabs UNC]] - standard, coil insert and key insert pilot holes
- [[Threads_ProtoLabs_UNF|ProtoLabs UNF]] - standard, coil insert and key insert pilot holes
- [[Threads_ProtoLabs_Metric|ProtoLabs Metric]] - standard and coil insert pilot holes
- [[Threads_ProtoLabs_Special_NPT_And_OD|ProtoLabs NPT & OD Threads]] - pipe threads and turned external threads
- [[Tap_Drill_Chart_Inch|Tap & Clearance Drills - Inch]] - 75/50% tap drills, close/free clearance, number/letter drills
- [[Tap_Drill_Chart_Metric|Tap & Clearance Drills - Metric]] - ISO coarse and fine

## 3D Printing
- [[3DP_Process_Selection|Process Selection]] - FDM vs SLA vs SLS vs MJF vs DMLS, 3DP vs CNC
- [[3DP_Materials|Materials]] - materials by process
- [[3DP_Internal_Passages_And_Escape_Holes|Internal Passages & Escape Holes]] - channels, hollowing, powder/resin removal
- [[3DP_Overhangs_And_Supports|Overhangs & Supports]] - 45° rule, bridging, teardrop holes, DMLS supports
- [[3DP_Quality_Time_And_Cost_Tips|Quality, Time & Cost Tips]] - min features, fits, orientation, cost drivers

## References
- [[DFM_Source_Links|Source Links]] - vendor pages and source files
