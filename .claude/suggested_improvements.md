# Suggested Improvements (backlog)

Items from the November 2026 site review that were not picked for the first improvement batch.
Each line says where it applies and roughly how big it is (S = under an hour, M = a few hours, L = a day or more).
Tick items off or delete them as they are done.

## New calculators

- [ ] **Feeds and speeds** (M): SFM / SMM + cutter diameter -> RPM; flutes x chip load x RPM -> feed (IPM, mm/min); material removal rate. Pairs with the speed converter.
- [ ] **Bolt circle / hole pattern** (S): pitch circle diameter, number of holes, start angle -> X/Y table, send rows to the pad.
- [ ] **Tolerance stack-up** (M): list of +/- dimensions -> worst case and RSS.
- [ ] **ISO 286 fits** (M): H7/g6, H7/p6 etc. -> hole and shaft limits, clearance or interference.
- [ ] **Stock selector** (S): finished size + allowance -> next standard plate / bar using the Stock Sizes data.
- [ ] **True position** (S): +/-X and +/-Y -> diametral position tolerance (2 x sqrt(x^2 + y^2)).
- [ ] **3D print mass and cost** (S): volume, infill, material price -> mass and material cost.

## New diagrams

- [ ] **3D inside-corner sketch** (M), corners_pockets top: wall corner radius, floor fillet and tool in one picture.
- [ ] **Counterbore / countersink callout** (S), holes_threading #counterbores: diameter, depth, clearance hole, head seated 0.010-0.030 in below the surface.
- [ ] **Heat-set insert boss for prints** (S), 3dp_quality_cost #holes-threads: pilot, boss OD about 2-2.5 x insert OD, melt-flow room.
- [ ] **Long turned part, unsupported vs tailstock** (S), cnc_turning tips: length-to-diameter guidance.
- [ ] **GD&T symbol strip** (M), tolerances_finishes GD&T basics: true position, flatness, cylindricity, perpendicularity, runout, each with a tolerance-zone sketch.
- [ ] **T-slot / keyseat undercut cutter** (S), walls_features #undercuts: thin neck, reach limit, entry and exit clearance.
- [ ] **Plate thickness vs part thickness** (S), stock_sizes worked examples: where 0.45 / 0.52 / 0.48 in parts land against 1/2 and 5/8 in plate.
- [ ] **SLA orientation and support islands** (S), 3dp_overhangs #orientation: cosmetic face up vs supported face.
- [ ] **XY vs Z tolerance / anisotropy glyphs** (S), 3dp_processes comparison table.

## Diagram polish

- [ ] holes_clearance_fit.svg: the close-fit float arrowheads nearly merge; enlarge the gap slightly or use a leader label.
- [ ] milling three-ways diagram repeats the cost bars shown in the cost chart; drop the cost labels from one of them.
- [ ] Remove caption text that is duplicated inside an SVG and in its figcaption (check every figure).
- [ ] Dark mode: consider a slightly dimmed diagram panel (about #e6ebf1) instead of bright white.

## Content and readability

- [ ] corners_pockets: the static "Quick pick" table repeats the interactive picker; delete it or fold it into a closed details block.
- [ ] stock_sizes: show size lists as wrapping chips with mm equivalents; move the notes column into a table note (phone readability).
- [ ] stock_sizes: the square-bar example allows 0.05 in per side, below the page's 0.06-0.125 in rule; add a note that drawn / rolled faces need less cleanup.
- [ ] cnc_milling: add mm values to the steel and 5-axis rows of the envelope table.
- [ ] walls_features: replace the vague "network shop guideline" wording with the named sources; add one line that lathes prefer raised text (the exception to "engrave, don't emboss").
- [ ] cnc_turning: state the tailstock length-to-diameter rule as a range (about 3:1 to 6:1 depending on material).
- [ ] setups_orientation: caption says "same feature count" but the two blocks show 4 and 3 features.
- [ ] tolerances_finishes: left-align text cells in the roughness table.
- [ ] cnc_materials: consistent badge colors (4140 vs 1018; Excellent vs Good share a color); consider a relative-cost column so one chart can go.
- [ ] cost_reduction: "Six quick wins" largely repeats the Geometry list; merge or turn into links. Use one PEEK cost comparison with a named baseline (5x vs 10x appear on different pages).
- [ ] quick_reference: shorten the longest rule rows for phones (detail stays on the linked pages); note inch / metric in the column header.
- [ ] tap_drill_charts: the At a glance list adds little; consider removing it. Add an in / mm toggle to the inch table.
- [ ] 3dp_materials: add a short "best per requirement" row above the tabs.
- [ ] Data tables: add `<caption>` elements.

## Verification (needs network access to the vendor sites)

- [ ] Open every protolabs.com / hubs.com link on the References page and confirm it still resolves (this session's network policy blocked those hosts). Add which pages use each source and a "last verified" date.
- [ ] Confirm the key-insert table meaning of "fitting thread" against the ProtoLabs key-insert page.
- [ ] Confirm the DMLS unsupported overhang value (site uses 0.5 mm; one source says 0.8 mm).
- [ ] Confirm ProtoLabs' current minimum floor radius policy so the picker can use it as the default.

## Site and tooling

- [ ] Rebuild the search index automatically (GitHub Action or a pre-commit hook running `node tools/build_search_index.js`).
- [ ] Search: tolerate small typos (fuzzy matching).
- [ ] A "?" keyboard shortcut that shows the shortcut list.
- [ ] Enable GitHub Pages and confirm the `og:url` / `og:image` base URL in every page head matches the Pages URL.
- [ ] GitHub settings: turn on "Automatically delete head branches"; delete the merged `claude/busy-wright-nojd0v` branch (this session could not delete remote branches).
- [ ] Optional later: PHP back end for shared team notes or a feedback form.
