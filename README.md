# REKINDLE project website

A plain HTML/CSS/JS site (no build step) for GitHub Pages, structured like the OASIS Lab site.

## Publish on GitHub Pages
1. Create a new repository on GitHub (for example `REKINDLE_website`) and upload everything in this folder, keeping `assets/` and the `.nojekyll` file.
2. In the repository go to **Settings > Pages**, set **Source** to "Deploy from a branch", choose the `main` branch and the `/ (root)` folder, and save.
3. After a minute the site is live at `https://<your-username>.github.io/<repository-name>/`.

## Updating content
- **News, publications, presentations, student researchers, top announcement bar:** edit `assets/data.js` only. Copy an existing entry, paste it at the top of its list, and change the text.
- **Project, research, team, outreach and contact text:** edit the matching `.html` file.
- **Menu or footer:** edit `assets/site.js`.
- **Photos:** put images in an `images/` folder and reference them in `data.js` (for example `photo: "images/name.jpg"`).

## Still needed from the team
- Headshots and short bios for investigators, and names of student researchers
- Confirmation of which partners may be listed publicly, plus logos with permission
- Date and location of the first workshop
- Any papers, slides or posters that mention REKINDLE (add them in `assets/data.js`)
