---
tags: [dfm, cnc, threads, unc, protolabs]
source:
  - https://www.protolabs.com/services/cnc-machining/threaded-holes-guidelines/standard-holes/
  - https://www.protolabs.com/services/cnc-machining/threaded-holes-guidelines/coil-inserts/
  - https://www.protolabs.com/services/cnc-machining/threaded-holes-guidelines/key-inserts/
updated: 2026-11-04
---

# ProtoLabs UNC Thread Pilot Holes

Pilot hole diameters to model for UNC threads, coil inserts and key inserts when quoting automated CNC.

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
| #2-56 | 0.200 | **0.070** | 0.067 - 0.074 |
| #3-48 | 0.200 | **0.082** | 0.076 - 0.084 |
| #4-40 | 0.300 | **0.089** | 0.085 - 0.094 |
| #5-40 | 0.300 | **0.102** | 0.098 - 0.104 |
| #6-32 | 0.400 | **0.109** | 0.105 - 0.114 |
| #8-32 | 0.400 | **0.134** | 0.130 - 0.139 |
| #10-24 | 0.600 | **0.150** | 0.145 - 0.156 |
| #12-24 | 0.600 | **0.176** | 0.171 - 0.181 |
| 1/4-20 | 0.650 | **0.201** | 0.196 - 0.207 |
| 5/16-18 | 0.650 | **0.259** | 0.252 - 0.265 |
| 3/8-16 | 1.000 | **0.314** | 0.307 - 0.321 |
| 7/16-14 | 1.000 | **0.372** | 0.360 - 0.376 |
| 1/2-13 | 1.200 | **0.426** | 0.417 - 0.434 |

*Right-hand internal threads, thread-milled. Hole axis must line up with a cardinal machining direction.*

## Coil Insert Holes (HeliCoil style)

Thread = the screw size the installed insert accepts. The hole gets the insert's STI thread; you buy and install the insert.

| Thread | Max thread depth (in) | Model pilot at (in) | Allowed min - max (in) |
|---|---:|---:|---:|
| #2-56 | 0.300 | **0.091** | 0.090 - 0.096 |
| #3-48 | 0.400 | **0.107** | 0.105 - 0.110 |
| #4-40 | 0.400 | **0.119** | 0.117 - 0.125 |
| #5-40 | 0.400 | **0.132** | 0.131 - 0.137 |
| #6-32 | 0.600 | **0.147** | 0.145 - 0.153 |
| #8-32 | 0.600 | **0.173** | 0.171 - 0.178 |
| #10-24 | 0.650 | **0.201** | 0.199 - 0.208 |
| #12-24 | 0.650 | **0.227** | 0.225 - 0.234 |
| 1/4-20 | 0.650 | **0.266** | 0.261 - 0.270 |
| 5/16-18 | 1.000 | **0.332** | 0.324 - 0.334 |
| 3/8-16 | 1.200 | **0.397** | 0.389 - 0.399 |
| 7/16-14 | 1.200 | **0.453** | 0.453 - 0.464 |
| 1/2-13 | 1.200 | **0.531** | 0.515 - 0.531 |

*Thread listed is the screw size the installed insert accepts. The hole is cut with the insert's STI thread. Inserts are supplied and installed by you.*

## Key Insert Holes

Thread = the fitting thread cut into the part for the insert's outside thread. Match it to the insert maker's data sheet.

| Thread | Max length (in) | Model pilot at (in) | Allowed min - max (in) |
|---|---:|---:|---:|
| #8-32 | 0.400 | **0.135** | 0.133 - 0.137 |
| 5/16-18 | 0.650 | **0.274** | 0.271 - 0.276 |
| 3/8-16 | 1.000 | **0.334** | 0.331 - 0.336 |
| 7/16-14 | 1.000 | **0.399** | 0.396 - 0.401 |
| 1/2-13 | 1.000 | **0.455** | 0.452 - 0.457 |

*Thread listed is the fitting thread cut into the part for the insert's outside thread. Check the insert maker's data sheet for which insert uses that fitting thread.*


## Related
- [[Threads_Design_Rules|Thread Design Rules]]
- [[Threads_ProtoLabs_UNC|ProtoLabs UNC]] / [[Threads_ProtoLabs_UNF|UNF]] / [[Threads_ProtoLabs_Metric|Metric]]
- [[Threads_ProtoLabs_Special_NPT_And_OD|NPT & OD Threads]]
- [[Tap_Drill_Chart_Inch|Tap Drill Chart - Inch]] / [[Tap_Drill_Chart_Metric|Metric]]

Back to [[00_CNC_3DP_DFM_Table_Of_Contents|Table of Contents]]
