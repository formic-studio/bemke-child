# bemke-child

Child theme for Bricks with a Vite pipeline and WordPress panel deployment from GitHub.

## 1. Local setup

```bash
cd bemke-child
npm install
```

Run Vite dev server:

```bash
npm run dev
```

Build production assets:

```bash
npm run build
```

## 2. WordPress integration

This repo already contains:

- `style.css` (child theme header)
- `functions.php` (Vite dev mode + production manifest loader)

In your local `wp-config.php`, add:

```php
define( 'BEMKE_VITE_DEV_SERVER', true );
define( 'BEMKE_VITE_DEV_SERVER_URL', 'http://127.0.0.1:5173' );
```

When you want production-like mode locally, set:

```php
define( 'BEMKE_VITE_DEV_SERVER', false );
```

and run:

```bash
npm run build
```

## 3. Git repository

If this folder is still not connected to GitHub:

```bash
git init
git branch -M main
git remote add origin git@github.com:formic-studio/bemke-child.git
```

Then:

```bash
git add .
git commit -m "Initial child theme + Vite + deploy pipeline"
git push -u origin main
```

## 4. Deploy from WordPress panel (no server access)

### Recommended route: WP Pusher

This route gives you automatic theme update after every push to GitHub.

1. In WordPress admin, install and activate WP Pusher.
2. Open `WP Pusher -> Install Theme`.
3. Set:
   - `Repository host`: GitHub
   - `Theme repository`: `formic-studio/bemke-child`
   - `Repository branch`: `main`
   - `Repository is private`: enable only if repo is private
   - `Push-to-Deploy`: enabled
4. Install theme and activate `Bemke Child`.
5. Push new commit to GitHub. WP Pusher webhook triggers update automatically.

Important:

- If your repo is private, WP Pusher requires a paid license.
- If your repo is public, WP Pusher free tier is enough.

### Alternative route: Deployer for Git (WordPress.org plugin)

You can also use `Deployer for Git` from the WordPress plugin directory. It supports GitHub and automatic deploy from commits. For private repositories, the PRO version is required.

## 5. Build before every push

Because production WordPress runs built files from `assets/dist`, always do:

```bash
npm run build
git add .
git commit -m "Your change"
git push
```

## 6. Important note about Bricks parent template

In `style.css` we set:

```txt
Template: bricks
```

If your parent Bricks folder name is different, update this value.
