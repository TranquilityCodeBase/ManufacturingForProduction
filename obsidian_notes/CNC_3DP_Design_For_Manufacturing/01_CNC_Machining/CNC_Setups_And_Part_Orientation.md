---
tags: [dfm, cnc, setups, fixturing, orientation, datums]
source:
  - https://www.protolabs.com/resources/design-tips/6-ways-to-optimize-part-design-for-cnc-machining/
  - https://www.xometry.com/
updated: 2026-11-04
---

# CNC Setups & Part Orientation

Design so the part can be finished in as few fixturings (setups) as possible.

## Quick Rules
- Every setup = re-fixture + re-indicate + new chance for error. Fewer setups -> lower cost and tighter feature-to-feature accuracy.
- Best case: a **2.5D part done in one setup** plus a quick flip to face off the back.
- Put features on as **few faces** as possible, and only on **orthogonal faces** for 3-axis.
- Align every hole with X, Y or Z. One angled hole can add a whole setup or force 3+2.
- Keep critical relationships (bore to bore, hole pattern to datum edge) **in the same setup**.
- Leave **flat, parallel clamping surfaces** or extra stock / tabs the machinist can hold and cut off later.
- Can't avoid many setups? **Split the part** into simpler pieces and assemble them.

## How Setups Add Up

| Part design | Typical setups | Comment |
|---|---:|---|
| Plate with pockets and through holes from the top | 1-2 | Second op only to face the back / remove holding stock |
| Block with features on top and bottom | 2 | Flip; tie tolerances to one datum |
| Block with features on 4-6 faces | 4-6 (3-axis) | Consider 3+2 to do it in 1-2 fixturings |
| Angled hole on one face | +1 or 3+2 | Add a flat face normal to the hole |
| Round part with flats / cross holes | 1 (live-tool lathe) | vs 2-3 if turned then milled separately |

## Orientation Strategy
1. Choose the face with the most features and the tightest tolerances as the **first side**. It is cut while the stock is most rigid and before any flip.
2. Cut the outside profile and through holes in that same setup when possible.
3. Keep the **last setup light**: the part is weakest then (most material removed, least to hold on).
4. Avoid features that force the tool to cut through or weaken the area the fixture holds.

## Datums
- Pick one datum scheme (e.g. bottom face + two edges) and dimension critical features from it.
- Datum features should be machined surfaces made early, not as-received stock faces.
- Don't chain-dimension toleranced features across setups; stack-up grows with every flip.

## Workholding Considerations
- Vise jaws need parallel faces; odd shapes need soft jaws or custom fixtures (adds cost on small quantities).
- Thin plates: provide holes for screw-down fixturing or leave tabs.
- Round parts milled on a mill need V-blocks or collets; better to turn them.
- Big parts beyond the standard envelope may only be machinable from two sides.

## Setup Checklist
- [ ] Can every feature be reached from 1-2 directions?
- [ ] Are all holes on cardinal axes?
- [ ] Are tight-tolerance features cut in the same setup?
- [ ] Is there somewhere flat and solid to clamp?
- [ ] Would 3+2 or a lathe remove setups?
- [ ] Would splitting the part be cheaper than a complex single part?

## Related
- [[CNC_Milling_3Axis_3plus2_5Axis|Milling: 3-Axis, 3+2, 5-Axis]]
- [[CNC_General_Rules_And_Tolerances|General Rules & Tolerances]]
- [[CNC_Cost_Reduction_Tips|Cost Reduction Tips]]

Back to [[00_CNC_3DP_DFM_Table_Of_Contents|Table of Contents]]
