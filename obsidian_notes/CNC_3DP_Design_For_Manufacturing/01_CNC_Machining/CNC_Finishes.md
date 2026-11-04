---
tags: [dfm, cnc, finishes, anodize, plating]
source:
  - https://www.protolabs.com/services/cnc-machining/
  - https://www.xometry.com/
updated: 2026-11-04
---

# CNC Finishes

Common post-processing options, what they add dimensionally, and how to call them out.

## Quick Rules
- As-machined (63-125 µin Ra) is fine for most functional parts. Bead blast for a uniform matte look.
- Call finishes out by **specification** (MIL / AMS / ASTM), not just "anodize black".
- **Type III hardcoat adds up to ~0.003 in (0.076 mm) to a diameter and about twice that to threads.** Size close fits and threads for it.
- Threaded holes are usually plugged during anodize; masking may not be offered on quick-turn service.
- **One finish per part.** Mixing finishes adds masking and process steps.

## Finish Options

| Finish | Materials | Thickness / effect | Spec example | Use |
|---|---|---|---|---|
| Bead blast | Most metals | Matte, hides tool marks | - | Cosmetic, knocks down burrs |
| Anodize Type II | Aluminum | up to ~0.001 in, dyeable | MIL-A-8625 Type II Class 1 (clear) / Class 2 (color) | Corrosion, color |
| Hardcoat Type III | Aluminum | up to ~0.003 in on dia, gray/bronze/black | MIL-A-8625 Type III | Wear, hardness |
| Chem film / chromate | Aluminum | Negligible | MIL-DTL-5541 Type II Class 3 | Conductive corrosion protection, paint base |
| Electroless nickel | Steel, SS, Al, brass | Uniform, even in bores | AMS 2404 / MIL-C-26074 | Wear and corrosion, hard-to-reach areas |
| Bright nickel | Steel, brass | 0.00005-0.001 in | SAE AMS-QQ-N-290 | Decorative, corrosion |
| Zinc plate | Steel | Thin | ASTM B633 | Rust protection (not > 500 °F or marine) |
| Tin / silver / gold | Electrical parts | Thin | MIL-T-10727 (tin) | Solderability, conductivity |
| Passivation | Stainless | None | ASTM A967 / AMS 2700 | Removes free iron |
| Black oxide | Steel | Negligible | MIL-DTL-13924 | Mild corrosion, dark look |
| Powder coat | Conductive metals | Thick (~0.002-0.004 in) | Color by RAL / Sherwin-Williams code | Durable color |
| Wet paint | Most | Thin | Color code | Heat-sensitive parts, thin coats |
| Titanium anodize | Titanium | Color by voltage | AMS 2487 / 2488 | Color coding, corrosion |

## Design Notes
- Leftover material in corners gets coated with the part; don't rely on finishing to fill gaps.
- Sealing after anodize closes pores; ask about sealed vs unsealed for bonding or lubricity.
- Hardcoat grows half in, half out of the surface: a bore shrinks, a shaft grows.
- Color matching is generally not guaranteed except for paint.

## Related
- [[CNC_General_Rules_And_Tolerances|General Rules & Tolerances]]
- [[CNC_Materials|Materials]]
- [[Threads_Design_Rules|Thread Design Rules]]

Back to [[00_CNC_3DP_DFM_Table_Of_Contents|Table of Contents]]
