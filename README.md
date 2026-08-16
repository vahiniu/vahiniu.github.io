# Vahini Ummalaneni — personal website

A warm, modern, fully static site. No frameworks, no build step — just HTML + CSS + a tiny bit of
JavaScript. That makes it easy to maintain and **free to host** (GitHub Pages, Netlify, or Cloudflare Pages).

## Files

```
index.html        About, experience, education, research, honors, skills, community
travel.html       Travel diary — world map + trip cards (links to trip pages)
trips/            Individual trip pages (itinerary + photo gallery)
projects.html     Fun projects
assets/js/travelmap.js   World map data + rendering (pins, parks)
assets/css/       style.css — all the styling + theme colors
assets/js/        main.js — dark-mode toggle + scroll animations
assets/img/       Put your photos here
```

## Preview it locally

Double-click `index.html` to open it in a browser. (For the blog links to work cleanly you can also
run a tiny local server: `python3 -m http.server` from this folder, then visit
`http://localhost:8000`.)

## Publish for free with GitHub Pages

GitHub username: **vahiniu** → site will live at **https://vahiniu.github.io**

1. Create the repo: go to https://github.com/new (signed in as `vahiniu`).
   Repository name must be exactly **`vahiniu.github.io`** (all lowercase). Set it **Public**,
   don't add a README, click **Create repository**.
2. Upload the files: on the repo page click **"uploading an existing file"**, then drag in the
   *contents* of this folder (the files plus the `assets` and `trips` folders). `index.html`
   must end up at the top level of the repo — not inside a subfolder. Click **Commit changes**.
3. Enable Pages (usually automatic): **Settings → Pages → Source: Deploy from a branch**, branch
   **`main`**, folder **`/ (root)`**, Save.
4. Wait 1–2 minutes, then visit **https://vahiniu.github.io**.

Notes:
- Include the hidden **`.nojekyll`** file if you can (Finder: press Cmd+Shift+. to reveal hidden
  files). It tells GitHub to serve everything as-is. The site still works without it.
- To update later, drag the changed files into the repo again.
- For a custom domain later (e.g. a personal .com), add it under Settings → Pages and create a
  `CNAME` file — ask and I'll set it up.

## How to edit common things

**Add a profile photo** — drop a square image in `assets/img/` (e.g. `photo.jpg`), then in
`index.html` replace `<div class="avatar">VU</div>` with:
`<img class="avatar" src="assets/img/photo.jpg" alt="Vahini Ummalaneni">`

**Add your real links** — in `index.html`, the LinkedIn button currently points at
`#`. Replace those with your actual URLs.

**Add a hobby or project** — open the relevant page and copy one of the `card` blocks. To use a real
photo instead of an emoji cover, the comments in the file show exactly how.

**Travel trips** — 15 trips are already built in `trips/` (San Diego, Everest Base Camp, Hawaii,
Lassen, Lost Coast, Glacier, Bend, Peru, Pacific Northwest, Sikkim, St. Lucia, Utah/Yellowstone,
Colombia, Vegas/Page, Sonoma/Ukiah), each with an itinerary, food/lodging picks, tips, and a photo
gallery. Personal names and private details were stripped out.

To add photos to a trip: drop images in `assets/img/` (e.g. `peru-1.jpg`) and, in that trip's HTML,
replace each `<figure><div class="ph">…</div>…</figure>` with
`<figure><img src="../assets/img/peru-1.jpg" alt="…"><figcaption>caption</figcaption></figure>`.

To add a NEW trip: copy any file in `trips/` to `trips/your-trip.html`, edit it, then in `travel.html`
copy one trip `card` block and point it at the new page. (The pages were
generated from `trips.json` — you can also add an entry there and re-run the generator.)

**Recolor the whole site** — edit the color variables at the top of `assets/css/style.css`
(`--accent`, `--bg`, etc.). One change updates everything, including dark mode.

The moon/sun button in the nav toggles dark mode and remembers the visitor's choice.
