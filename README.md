# Portfolio Website

A simple, responsive personal portfolio website built with HTML, CSS, and JavaScript.

## Files

- `index.html` - content and sections
- `style.css` - layout and styling
- `script.js` - mobile menu and footer year

## Customize

Update these parts in `index.html`:

- Name, role, and intro text
- About section text
- Projects and links
- Skills list
- Contact email

## Run locally

Open `index.html` directly in your browser, or run:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Deploy + connect your domain

### Option A: GitHub Pages

1. Create a new GitHub repo and upload these files.
2. In GitHub repo settings, enable Pages from the `main` branch root.
3. Add a file named `CNAME` in your repo root with your domain:

```txt
yourdomain.com
```

4. In your domain DNS provider, add:
   - `A` records for `@` pointing to GitHub Pages IPs:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - `CNAME` record for `www` to `<your-github-username>.github.io`

### Option B: Netlify

1. Create a new site in Netlify from your GitHub repo.
2. Build command: none
3. Publish directory: `.`
4. Add your custom domain in Netlify project settings.
5. Follow Netlify DNS instructions (usually CNAME or A records shown in dashboard).

## Tip

After DNS updates, domain changes can take a few minutes up to 48 hours to fully propagate.
