# ManufacturingForProduction

Examples and suggestions for designing parts for automated production.

A static HTML / CSS / JavaScript reference site for design for manufacturing (DFM): CNC milling (3-axis, 3+2, 5-axis), CNC turning, holes and threads, stock sizes, setups, tolerances and finishes, and 3D printing (FDM, SLA, SLS, MJF, DMLS). It includes a calculator page with an inside-corner / pocket radius picker, unit conversions, part mass from CAD volume, a drill finder and a scratch pad.

## Viewing the site

No build step and no server needed.

- Locally: open `index.html` in a browser.
- Shared: enable GitHub Pages for this repository (Settings > Pages > Deploy from branch, root folder) and share the URL.

Scratch pad notes are saved in the viewer's own browser (localStorage) and are never sent anywhere.

## Folder structure

```
index.html              Home page
pages/                  All other pages (one HTML file per topic)
css/styles.css          Single stylesheet; colors are CSS variables with light and dark themes
js/site_nav.js          Left navigation definition (add a page here to add it to the menu;
                        Home and the "Back to" last-page link are added automatically)
js/main.js              Shared behavior: sidebar, section links, theme toggle, tabs, table filters
js/reference_tables.js  Renders thread and tap drill tables from the data files
js/corner_radius_tool.js  Inside corner / pocket radius picker
js/calculators.js       Unit converters, part mass, drill finder, scratch pad
js/data/                Data files (thread pilot tables, tap drills, standard cutters)
images/diagrams/        SVG diagrams used on the pages
obsidian_notes/         The same reference data as Obsidian notes, ready to copy into a vault
```

## Adding a page

1. Copy an existing page in `pages/` and change the `<title>`, `data-page` id and content.
2. Add an entry with the same id to `js/site_nav.js`.
3. Give every `<h2>` an `id`; it appears automatically as a section link in the sidebar.

## Data and sources

Values are compiled from public vendor design guides (ProtoLabs, Xometry) and general machining and additive practice. See `pages/references.html`. Always confirm against your vendor's current guidelines and quote DFM feedback.

This repository is public: it contains no credentials, keys, environment files or private data, and none should be added. PHP or other server code can be added later if interaction beyond the browser is needed.
