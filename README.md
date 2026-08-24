# Anemoi Project Homepage

Source for [anemoi-project.github.io](https://anemoi-project.github.io/), the official
homepage for [Anemoi — Efficient Video Generation](https://github.com/anemoi-project/anemoi).

The site is intentionally dependency-free: plain HTML, CSS, and JavaScript can
be served directly by GitHub Pages without a build step.

## Optional local preview

```bash
python3 -m http.server 4173
```

Open <http://localhost:4173>. Use a local HTTP server rather than opening
`index.html` directly so video loading and browser security behavior match the
deployed site.

## Structure

```text
.
├── index.html
├── styles.css
├── main.js
└── assets/
    └── media/
```

## Video assets

All 50 directly playable comparison videos are optimized web editions derived
from `anemoi/asserts/visualization/videos/` in the main Anemoi repository. The source
videos are 4032×1536 six-panel composites; homepage editions are 2016×768,
H.264/yuv420p, muted, and prepared with `faststart` for browser streaming. The
eight annotated difference highlights are optimized derivatives of the review
images used in the main repository README.

Only the selected scene is loaded by the main player. Gallery posters load
lazily and other videos are fetched only when selected, which keeps the initial
page transfer small. The web media are regular Git files because GitHub Pages
cannot serve Git LFS objects. Original source videos are never modified.

## Deployment

Publish the `main` branch from the repository root in **Settings → Pages**.
The top-level `.nojekyll` file makes GitHub Pages serve the static files as-is.

## Accuracy notes

- RTX 4090 end-to-end results reproduce the public Anemoi README benchmark.
- The exact-cover layout statistic is identified as a physical-work efficiency
  example rather than an end-to-end speedup claim.
- MiniMax-H3 on SM89 is the only currently validated end-to-end path. Other
  model families are labeled adapter-scaffolded.

## License

Apache License 2.0. See [LICENSE](LICENSE).
