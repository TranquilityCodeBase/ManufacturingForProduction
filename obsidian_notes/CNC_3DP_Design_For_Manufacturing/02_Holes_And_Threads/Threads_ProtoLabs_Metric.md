---
tags: [dfm, cnc, threads, metric, protolabs]
source:
  - https://www.protolabs.com/services/cnc-machining/threaded-holes-guidelines/standard-holes/
  - https://www.protolabs.com/services/cnc-machining/threaded-holes-guidelines/coil-inserts/
updated: 2026-11-04
---

# ProtoLabs Metric Thread Pilot Holes

Pilot hole diameters (mm) to model for metric threads and coil inserts when quoting automated CNC.

> [!tip] How to use these tables
> 1. Model the hole as a **plain hole** at the "Model pilot at" diameter (anything inside min - max is recognized).
> 2. **Do not model the thread.** Add a cosmetic thread / hole callout in CAD if you want it on the drawing.
> 3. Assign the thread in the quote. Keep the thread length at or under the max thread depth.
> 4. Upload STEP (not STL) so the hole is recognized as a feature.
>
> Vendor tables change. Check the live ProtoLabs page before releasing a design.

## Standard Threaded Holes (milled)

| Thread | Max thread depth (mm) | Model pilot at (mm) | Allowed min - max (mm) |
|---|---:|---:|---:|
| M1.6 x 0.35 * | 3.00 | **1.25** | 1.22 - 1.32 |
| M2 x 0.4 | 5.08 | **1.60** | 1.57 - 1.68 |
| M2.5 x 0.45 | 5.08 | **2.05** | 2.01 - 2.14 |
| M3 x 0.5 | 7.62 | **2.50** | 2.46 - 2.60 |
| M3.5 x 0.6 | 10.16 | **2.90** | 2.85 - 3.01 |
| M4 x 0.7 | 10.16 | **3.30** | 3.24 - 3.42 |
| M5 x 0.8 | 15.24 | **4.20** | 4.14 - 4.33 |
| M6 x 1.0 | 16.51 | **5.00** | 4.92 - 5.15 |
| M8 x 1.25 | 16.51 | **6.80** | 6.65 - 6.91 |
| M10 x 1.5 | 25.40 | **8.50** | 8.38 - 8.68 |
| M12 x 1.75 | 30.48 | **10.20** | 10.00 - 10.44 |

*M1.6 x 0.35 is offered in soft metals only (aluminum, brass, copper).*

\* M1.6 is soft metals only.

## Coil Insert Holes

| Thread | Max thread depth (mm) | Model pilot at (mm) | Allowed min - max (mm) |
|---|---:|---:|---:|
| M2 x 0.4 | 5.08 | **2.14** | 2.09 - 2.14 |
| M2.5 x 0.45 | 7.62 | **2.60** | 2.55 - 2.65 |
| M3 x 0.5 | 10.16 | **3.18** | 3.11 - 3.25 |
| M3.5 x 0.6 | 15.24 | **3.70** | 3.68 - 3.79 |
| M4 x 0.7 | 15.24 | **4.24** | 4.15 - 4.33 |
| M5 x 0.8 | 16.51 | **5.27** | 5.17 - 5.37 |
| M6 x 1.0 | 16.51 | **6.31** | 6.22 - 6.41 |
| M8 x 1.25 | 25.40 | **8.38** | 8.27 - 8.48 |
| M10 x 1.5 | 30.48 | **10.56** | 10.33 - 10.56 |
| M12 x 1.75 | 30.48 | **12.51** | 12.38 - 12.64 |

*Thread listed is the screw size the installed insert accepts.*

> [!note] Key inserts
> ProtoLabs lists key insert holes for UNC and UNF only. See [[Threads_ProtoLabs_UNC|UNC]] / [[Threads_ProtoLabs_UNF|UNF]].

## Related
- [[Threads_Design_Rules|Thread Design Rules]]
- [[Threads_ProtoLabs_UNC|ProtoLabs UNC]] / [[Threads_ProtoLabs_UNF|UNF]] / [[Threads_ProtoLabs_Metric|Metric]]
- [[Threads_ProtoLabs_Special_NPT_And_OD|NPT & OD Threads]]
- [[Tap_Drill_Chart_Inch|Tap Drill Chart - Inch]] / [[Tap_Drill_Chart_Metric|Metric]]

Back to [[00_CNC_3DP_DFM_Table_Of_Contents|Table of Contents]]
