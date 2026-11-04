---
tags: [dfm, cnc, threads, npt, od-threads, turning, protolabs]
source:
  - https://www.protolabs.com/services/cnc-machining/threaded-holes-guidelines/standard-holes/
  - https://www.protolabs.com/services/cnc-machining/threaded-holes-guidelines/od-threads/
updated: 2026-11-04
---

# ProtoLabs Special Threads: NPT and OD (Turned)

Internal NPT pipe threads and external (OD) threads on turned parts.

## Quick Rules
- NPT is offered in soft metals only (aluminum, copper, brass).
- OD threads need the part to qualify for **turning**. Model the plain shaft at the listed diameter; do not model the thread.
- OD max thread length is about 2x the nominal diameter.
- External threads milled on a mill are a special case (see [[Threads_Design_Rules]]).

## Internal NPT (inches)

| NPT size | Pilot min - max | Model pilot at | Min pilot depth, through | Min pilot depth, blind | Thread depth |
|---|---:|---:|---:|---:|---:|
| 1/16-27 | 0.2343 - 0.2494 | **0.2421** | 0.389 | 0.419 | 0.389 |
| 1/8-27 | 0.3268 - 0.3417 | **0.3346** | 0.389 | 0.419 | 0.389 |
| 1/4-18 | 0.4232 - 0.4448 | **0.4331** | 0.582 | 0.621 | 0.582 |
| 3/8-18 | 0.5571 - 0.5794 | **0.5669** | 0.582 | 0.621 | 0.582 |
| 1/2-14 | 0.6870 - 0.7165 | **0.7008** | 0.748 | 0.795 | 0.748 |
| 3/4-14 | 0.8976 - 0.9257 | **0.9114** | 0.748 | 0.795 | 0.748 |
| 1-11 1/2 | 1.1280 - 1.1625 | **1.1437** | 0.911 | 0.966 | 0.911 |
| 1 1/4-11 1/2 | 1.4705 - 1.5060 | **1.4882** | 0.911 | 0.966 | 0.911 |
| 1 1/2-11 1/2 | 1.7106 - 1.7450 | **1.7264** | 0.911 | 0.966 | 0.911 |
| 2-11 1/2 | 2.1831 - 2.2174 | **2.1988** | 0.911 | 0.966 | 0.911 |

## OD Threads - UNC (inches)

| Thread | Max thread length (in) | Model shaft at (in) | Allowed min - max (in) |
|---|---:|---:|---:|
| #4-40 | 0.224 | **0.109** | 0.106 - 0.113 |
| #5-40 | 0.250 | **0.122** | 0.119 - 0.126 |
| #6-32 | 0.276 | **0.134** | 0.131 - 0.139 |
| #8-32 | 0.328 | **0.160** | 0.157 - 0.165 |
| #10-24 | 0.380 | **0.185** | 0.182 - 0.191 |
| #12-24 | 0.432 | **0.211** | 0.208 - 0.217 |
| 1/4-20 | 0.500 | **0.245** | 0.241 - 0.251 |
| 5/16-18 | 0.625 | **0.307** | 0.303 - 0.314 |
| 3/8-16 | 0.750 | **0.369** | 0.364 - 0.376 |
| 7/16-14 | 0.875 | **0.431** | 0.426 - 0.439 |
| 1/2-13 | 1.000 | **0.493** | 0.488 - 0.501 |
| 5/8-11 | 1.250 | **0.617** | 0.611 - 0.626 |
| 3/4-10 | 1.500 | **0.742** | 0.735 - 0.751 |

*Model the plain shaft at the listed diameter (no thread). Max length is about 2 x nominal diameter.*

## OD Threads - UNF (inches)

| Thread | Max thread length (in) | Model shaft at (in) | Allowed min - max (in) |
|---|---:|---:|---:|
| #5-44 | 0.250 | **0.122** | 0.120 - 0.126 |
| #6-40 | 0.276 | **0.135** | 0.132 - 0.139 |
| #8-36 | 0.328 | **0.161** | 0.158 - 0.165 |
| #10-32 | 0.380 | **0.186** | 0.183 - 0.191 |
| #12-28 | 0.432 | **0.212** | 0.209 - 0.217 |
| 1/4-28 | 0.500 | **0.246** | 0.243 - 0.251 |
| 5/16-24 | 0.625 | **0.308** | 0.304 - 0.314 |
| 3/8-24 | 0.750 | **0.370** | 0.367 - 0.376 |
| 7/16-20 | 0.875 | **0.432** | 0.428 - 0.439 |
| 1/2-20 | 1.000 | **0.495** | 0.491 - 0.501 |
| 5/8-18 | 1.250 | **0.619** | 0.615 - 0.626 |
| 3/4-16 | 1.500 | **0.744** | 0.739 - 0.751 |

*Model the plain shaft at the listed diameter (no thread).*

## OD Threads - Metric (mm)

| Thread | Max thread length (mm) | Model shaft at (mm) | Allowed min - max (mm) |
|---|---:|---:|---:|
| M3.5 x 0.6 | 7.00 | **3.42** | 3.35 - 3.53 |
| M4 x 0.7 | 8.00 | **3.91** | 3.84 - 4.03 |
| M5 x 0.8 | 10.00 | **4.90** | 4.83 - 5.03 |
| M6 x 1.0 | 12.00 | **5.89** | 5.79 - 6.02 |
| M8 x 1.25 | 16.00 | **7.87** | 7.76 - 8.03 |
| M8 x 1.0 (fine) | 16.00 | **7.88** | 7.80 - 8.03 |
| M10 x 1.5 | 20.00 | **9.85** | 9.73 - 10.03 |
| M10 x 1.25 (fine) | 20.00 | **9.87** | 9.76 - 10.03 |
| M10 x 0.75 | 20.00 | **9.91** | 9.84 - 10.03 |
| M12 x 1.75 | 24.00 | **11.83** | 11.70 - 12.02 |
| M12 x 1.5 (fine) | 24.00 | **11.85** | 11.73 - 12.02 |
| M12 x 1.25 (extra fine) | 24.00 | **11.87** | 11.76 - 12.02 |
| M12 x 1.0 | 24.00 | **11.88** | 11.79 - 12.02 |
| M14 x 2.0 | 28.00 | **13.82** | 13.68 - 14.03 |
| M14 x 1.5 (fine) | 28.00 | **13.85** | 13.73 - 14.03 |
| M15 x 1.0 | 30.00 | **14.88** | 14.79 - 15.03 |
| M16 x 2.0 | 32.00 | **15.82** | 15.68 - 16.02 |
| M16 x 1.5 | 32.00 | **15.85** | 15.73 - 16.02 |
| M17 x 1.0 | 34.00 | **16.89** | 16.79 - 17.03 |
| M18 x 1.5 | 36.00 | **17.85** | 17.73 - 18.03 |
| M20 x 2.5 | 40.00 | **19.79** | 19.62 - 20.03 |
| M20 x 1.5 | 40.00 | **19.85** | 19.73 - 20.03 |

*Model the plain shaft at the listed diameter (no thread).*


## Related
- [[Threads_Design_Rules|Thread Design Rules]]
- [[Threads_ProtoLabs_UNC|ProtoLabs UNC]] / [[Threads_ProtoLabs_UNF|UNF]] / [[Threads_ProtoLabs_Metric|Metric]]
- [[Threads_ProtoLabs_Special_NPT_And_OD|NPT & OD Threads]]
- [[Tap_Drill_Chart_Inch|Tap Drill Chart - Inch]] / [[Tap_Drill_Chart_Metric|Metric]]
- [[CNC_Turning|CNC Turning]]

Back to [[00_CNC_3DP_DFM_Table_Of_Contents|Table of Contents]]
