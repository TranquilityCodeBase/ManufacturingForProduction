---
tags: [dfm, cnc, threads, unf, protolabs]
source:
  - https://www.protolabs.com/services/cnc-machining/threaded-holes-guidelines/standard-holes/
  - https://www.protolabs.com/services/cnc-machining/threaded-holes-guidelines/coil-inserts/
  - https://www.protolabs.com/services/cnc-machining/threaded-holes-guidelines/key-inserts/
updated: 2026-11-04
---

# ProtoLabs UNF Thread Pilot Holes

Pilot hole diameters to model for UNF threads, coil inserts and key inserts when quoting automated CNC.

> [!tip] How to use these tables
> 1. Model the hole as a **plain hole** at the "Model pilot at" diameter (anything inside min - max is recognized).
> 2. **Do not model the thread.** Add a cosmetic thread / hole callout in CAD if you want it on the drawing.
> 3. Assign the thread in the quote. Keep the thread length at or under the max thread depth.
> 4. Upload STEP (not STL) so the hole is recognized as a feature.
>
> Vendor tables change. Check the live ProtoLabs page before releasing a design.

## Standard Threaded Holes (milled)

| Thread | Max thread depth (in) | Model pilot at (in) | Allowed min - max (in) |
|---|---:|---:|---:|
| #2-64 | 0.200 | **0.072** | 0.069 - 0.075 |
| #3-56 | 0.200 | **0.083** | 0.080 - 0.084 |
| #4-48 | 0.300 | **0.093** | 0.087 - 0.098 |
| #5-44 | 0.300 | **0.104** | 0.100 - 0.104 |
| #6-40 | 0.400 | **0.115** | 0.111 - 0.119 |
| #8-36 | 0.400 | **0.138** | 0.134 - 0.142 |
| #10-32 | 0.600 | **0.160** | 0.156 - 0.164 |
| #12-28 | 0.600 | **0.182** | 0.177 - 0.186 |
| 1/4-28 | 0.650 | **0.215** | 0.211 - 0.220 |
| 5/16-24 | 0.650 | **0.272** | 0.267 - 0.277 |
| 3/8-24 | 1.000 | **0.335** | 0.330 - 0.340 |
| 7/16-20 | 1.000 | **0.389** | 0.383 - 0.395 |
| 1/2-20 | 1.200 | **0.451** | 0.446 - 0.457 |

*Right-hand internal threads, thread-milled.*

## Coil Insert Holes (HeliCoil style)

| Thread | Max thread depth (in) | Model pilot at (in) | Allowed min - max (in) |
|---|---:|---:|---:|
| #2-64 | 0.300 | **0.092** | 0.090 - 0.095 |
| #3-56 | 0.300 | **0.104** | 0.103 - 0.104 |
| #4-48 | 0.400 | **0.120** | 0.117 - 0.123 |
| #6-40 | 0.600 | **0.148** | 0.144 - 0.150 |
| #8-36 | 0.600 | **0.174** | 0.170 - 0.177 |
| #10-32 | 0.650 | **0.200** | 0.197 - 0.204 |
| 1/4-28 | 0.650 | **0.261** | 0.258 - 0.265 |
| 5/16-24 | 1.000 | **0.325** | 0.322 - 0.329 |
| 3/8-24 | 1.000 | **0.387** | 0.384 - 0.391 |
| 7/16-20 | 1.200 | **0.452** | 0.448 - 0.456 |
| 1/2-20 | 1.200 | **0.515** | 0.511 - 0.519 |

*Thread listed is the screw size the installed insert accepts.*

## Key Insert Holes

| Thread | Max length (in) | Model pilot at (in) | Allowed min - max (in) |
|---|---:|---:|---:|
| #10-32 | 0.600 | **0.162** | 0.160 - 0.164 |
| #12-28 | 0.600 | **0.189** | 0.186 - 0.191 |
| 1/4-28 | 0.650 | **0.229** | 0.227 - 0.231 |

*Thread listed is the fitting thread cut into the part for the insert's outside thread.*


## Related
- [[Threads_Design_Rules|Thread Design Rules]]
- [[Threads_ProtoLabs_UNC|ProtoLabs UNC]] / [[Threads_ProtoLabs_UNF|UNF]] / [[Threads_ProtoLabs_Metric|Metric]]
- [[Threads_ProtoLabs_Special_NPT_And_OD|NPT & OD Threads]]
- [[Tap_Drill_Chart_Inch|Tap Drill Chart - Inch]] / [[Tap_Drill_Chart_Metric|Metric]]

Back to [[00_CNC_3DP_DFM_Table_Of_Contents|Table of Contents]]
