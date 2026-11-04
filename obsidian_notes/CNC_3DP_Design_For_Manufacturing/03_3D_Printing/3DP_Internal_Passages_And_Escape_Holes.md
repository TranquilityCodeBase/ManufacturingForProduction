---
tags: [dfm, 3dp, channels, escape-holes, hollow]
source:
  - https://www.protolabs.com/en-gb/resources/blog/designing-a-part-for-multi-jet-fusion/
  - https://www.protolabs.com/resources/design-tips/7-mistakes-to-avoid-when-designing-3d-printed-parts/
  - https://blogs.solidworks.com/products/solidworks/introduction-designing-metal-3d-printing
  - https://www.hubs.com/knowledge-base/how-design-parts-sls-3d-printing/
updated: 2026-11-04
---

# 3DP Internal Passages & Escape Holes

Design internal channels and hollow parts that print, clean out and inspect.

## Quick Rules
- Every enclosed volume needs a way for **unfused powder or uncured resin to get out**.
- Use **at least two escape holes**, on **opposite ends**, so air and material flow through.
- Powder parts (SLS / MJF): escape holes **>= 3.5-5 mm**; ~5-6 mm is safer for long cavities.
- DMLS: escape holes **2-5 mm**; **4 mm min if only one**, 2 mm if two or more.
- SLA: **drain + vent** holes (~2.5-4 mm) so hollow shells don't form suction cups and crack.
- Minimum gap between features / channel width: **0.8 mm (0.030 in)** for SLS and MJF. SLA features under ~0.635 mm (0.025 in) can seal shut.
- Metal channels: keep round channels **<= 8 mm (0.30 in)** or use a **teardrop / diamond** profile; larger round tops sag.
- Use **smooth, large-radius bends** and no dead ends; powder packs into sharp corners.
- Thick sections (> 4 mm in MJF) should be **hollowed to 2-4 mm walls**, with escape holes.

## Channel Sizing

| Process | Practical min channel | Recommended for long channels | Notes |
|---|---:|---:|---|
| FDM | ~2 mm | 3-5 mm+ | Supports inside channels are hard to remove; design self-supporting tops |
| SLA | ~0.5-1 mm short | 2-3 mm+ | Resin must drain; flush with solvent |
| SLS / MJF | 0.8 mm gap | 3-5 mm+ | Powder removal limits length; blow out with air |
| DMLS | ~1 mm | 2-8 mm | Self-supporting shapes; can't remove internal supports |

Long, small channels are the hard case: the longer the passage, the larger it should be. Rule of thumb: keep length under about 10-20 x diameter or add clean-out ports.

## Shapes That Print Without Supports
- **Teardrop**: round bottom, pointed 45° top. Prints self-supporting in FDM and DMLS.
- **Diamond / rotated square**: all faces at 45°.
- **Elliptical** with the long axis vertical.
- Flat ceilings inside a channel will sag or need supports you can't remove.

## Escape and Drain Holes
- Place at the **lowest and highest** points of the cavity in print orientation.
- Can be plugged afterwards (threaded plug, press-fit plug, epoxy, welded cap on metal).
- Hide them on non-cosmetic faces; account for them in sealing requirements.

## Finishing and Inspection
- Internal surfaces stay **as printed** (rough); you cannot polish them. Size flow passages for roughness.
- Critical bores: print undersize and **ream or machine** after.
- Verify clear passages: blow-through / flow test, borescope, CT scan for metal.
- Abrasive flow machining can smooth metal channels if needed (cost!).

## Related
- [[3DP_Overhangs_And_Supports|Overhangs & Supports]]
- [[3DP_Process_Selection|Process Selection]]
- [[3DP_Quality_Time_And_Cost_Tips|Quality, Time & Cost Tips]]

Back to [[00_CNC_3DP_DFM_Table_Of_Contents|Table of Contents]]
