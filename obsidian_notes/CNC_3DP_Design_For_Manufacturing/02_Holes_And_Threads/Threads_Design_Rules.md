---
tags: [dfm, cnc, threads, tapped-holes, inserts]
source:
  - https://www.protolabs.com/services/cnc-machining/threaded-holes-guidelines/standard-holes/
  - https://www.xometry.com/
updated: 2026-11-04
---

# Thread Design Rules

How to model, size and specify threads so they get made right the first time.

## Quick Rules
- **Do not model helical threads in CAD** unless it is one of the special cases below.
- Model the **pilot (tap drill) diameter** and add a **cosmetic thread** / hole wizard callout. About 75% thread pilot always works with vendor ranges.
- Never model the hole at the **major** diameter; the screw will just spin.
- Thread length **<= 2 x D** is usually plenty in metal; **3 x D** is the practical max.
- **Blind holes**: add at least **0.5 x D unthreaded** below the last full thread for tap lead and chips. Drill point relief doesn't need modeling, just allow it on the drawing.
- Prefer **through holes** when the design allows. Easier to drill, tap and clean.
- Use **standard sizes and pitches** only. Coarse pitch unless there is a reason for fine.
- Threads below **M2 / #2** break taps easily; use the largest thread the design allows.
- **Soft materials** (aluminum, plastic) under repeated assembly: use **coil or key inserts**.
- Upload **STEP / IGES**, not STL. Mesh files lose the hole feature.

## Why Not Model Threads
- Machining software and quoting engines recognize a plain hole of the right diameter as threadable. A modeled helix is just a complex surface.
- Modeled threads bloat files, slow CAD, and can be misread as a non-standard thread.
- Thread class, depth and pitch belong in the **callout** (e.g. `1/4-20 UNC-2B x 0.50 DP`, `M6x1.0-6H x 12 DP`).

## Special Cases Where You DO Model Threads
| Case | Why |
|---|---|
| External thread milled on a mill (no lathe) | The thread is cut with ball / flat end mills from the modeled shape; expect root radii and plan to chase with a die |
| Large or non-standard coarse threads (custom lead screws, jar-style threads) | No standard tap / thread mill to call out |
| 3D printed threads, coarse, 1/4-20 / M6 and larger | The printer only makes what is in the model. Small printed threads are poor; use inserts or tap |
| Rendering / marketing models | Visual only; keep a production version without |

External threads on turned parts: model the plain diameter, assign the thread in the quote. See [[Threads_ProtoLabs_Special_NPT_And_OD]].

## Thread Depth Limits (thread-milled holes)
- Thread mills have limited reach; max depth grows with size (about 0.2 in for #2 up to ~1.2 in for 1/2 in; 5 mm for M2 up to ~30 mm for M12). See the tables.
- Long through hole deeper than the tool reaches: thread from the side the screw starts. If the screw must pass all the way, tap the rest as a secondary op.
- Threading **from both sides** is OK only if the two threads **don't meet**; overlapping threads risk cross-threading.
- Obstructions, lead-in chamfers and fixturing can reduce available depth.

## Inserts
| Insert | Good for | Notes |
|---|---|---|
| Coil (HeliCoil) | Aluminum, plastics, repair | Hole is tapped with STI thread; you install the insert |
| Key-locking (Keensert) | High pull-out, frequent assembly | Bigger hole; follow the insert data sheet |
| Heat-set / press-fit | Plastics, 3D prints | Molded-in style; follow maker's hole size |

Don't put inserts in the CAD assembly you upload for machining quotes; call them out on the drawing (part number, quantity, install direction).

## Related
- [[Holes_Design_Rules|Hole Design Rules]]
- [[Threads_ProtoLabs_UNC|ProtoLabs UNC]] / [[Threads_ProtoLabs_UNF|UNF]] / [[Threads_ProtoLabs_Metric|Metric]]
- [[Threads_ProtoLabs_Special_NPT_And_OD|NPT & OD Threads]]
- [[Tap_Drill_Chart_Inch|Tap Drill Chart - Inch]] / [[Tap_Drill_Chart_Metric|Metric]]

Back to [[00_CNC_3DP_DFM_Table_Of_Contents|Table of Contents]]
