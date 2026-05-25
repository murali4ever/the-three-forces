# The Three Forces — Interactive Web Book

**Electricity, Plastic, AI — and the Question Every Generation Must Answer**

A **SurrealDB Learn Book–inspired** edition: story-driven chapters, sidebar navigation, custom SVG illustrations, Kid's Corner explainers, and chapter quizzes — designed so readers **ages 10+** can follow along.

## Quick start

From the repository root:

```bash
cd book
python3 -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

## Rebuild from Word source

After editing `The Civilization Shift.docx`:

```bash
python3 scripts/build-book.py
```

(Title and subtitles in the web book are set in `build-book.py` and `data/book.json`.)

## Structure

| Path | Purpose |
|------|---------|
| `index.html` | App shell |
| `css/book.css` | Dark theme, layout, Kid's Corner & quiz styles |
| `js/book.js` | Routing, rendering, quizzes |
| `js/illustrations.js` | SVG chapter art |
| `data/book.json` | Full book content (generated from docx) |
| `js/supplemental-content.js` | “Why these three?” + FAQ (not overwritten by build) |
| `../docs/why-these-three-manuscript.md` | Same text for pasting into Word |

## Inspired by

[SurrealDB's Aeon's Surreal Renaissance](https://surrealdb.com/learn/book) — immersive narrative, chapter sidebar, progressive learning, and visual storytelling.
