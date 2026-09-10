# Viewer Maintenance

## Scope and Sources

- This directory is the publishable Git repository for a personal offline game archive.
- Before changing the Viewer UI, read `VIEWER-UI-STANDARD.md`. Use the existing tumbler and regular-postcard editors as the reference.
- In the local workspace, generator sources live one directory above this repository: `../viewer_template.py`, `../goal_postcards_viewer.py`, `../goal_postcards_app.js`, `../tumbler_viewer.py`, and `../tumbler_app.js`.
- Change the relevant generator source and regenerate the output. Do not make a fix only in generated `viewer/index.html` when the generator is available. A standalone checkout may not contain these parent-directory tools; report that limitation accurately.
- From the parent workspace, regenerate with `python capsule.py generate --output GameTimeCapsule`, using the available Python environment with Pillow.

## UI Rules

- Image-list search, filter, and sorting controls go on the right of the toolbar, with any list title on the left. Reuse the owned-tumbler view's global input and responsive toolbar styles.
- Category tabs wrap horizontally. Counts use a separate small, muted span without parentheses.
- Composer pages use a preview on the left and thumbnail selectors on the right. Randomize and Save PNG sit at the far right of the material-category toolbar, outside the tablist, and wrap together on narrow screens.
- Keep undo, redo, and reset under the preview. Selecting an editable layer reveals inline sliders; do not add a separate manual-adjustment button.
- Respect the documented fixed and horizontal-only layers during initialization, selection, randomization, history, local-storage migration, and export. Show only permitted controls.
- Keep layout dimensions stable and prevent text overlap or horizontal overflow. Match existing styles rather than adding another visual system.

## Data and Offline Behavior

- Preserve original artwork and backup files. Store composition corrections separately in `parsed/normal-postcard-layouts.json`; do not overwrite source game coordinates.
- Distinguish recovered configuration, screenshot-based placement, and account ownership. Do not infer ownership or claim unverified placement rules come from the game.
- Keep the Viewer usable through `file://`, with local assets and offline PNG export. Do not introduce a server, remote fonts, analytics, or CDN dependencies.
- System backup packages, authentication data, and local audit files do not belong in this public repository. Keep those in the outer workspace.

## Verification

- Check affected views using Playwright at desktop width and 390px mobile width, including screenshots and actual interactions.
- For search/filter edits, verify right alignment, clearing searches, combined filters, empty results, and no overflow.
- For composition edits, verify nonblank rendered images, affected layer constraints, history, storage migration when changed, and real PNG downloads at the documented dimensions.
- Run checks appropriate to the changed behavior. Existing local verification scripts live under `../_local_backup_audit/` when the complete workspace is available.
- Update `VIEWER-UI-STANDARD.md` when the user changes a shared UI rule. Do not commit, push, or publish unless requested.
