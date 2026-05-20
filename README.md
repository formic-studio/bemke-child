# bemke-child

Child theme for Bricks with a Vite pipeline and GitHub Actions deployment.

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

## 4. GitHub Actions deploy

Workflow file:

- `.github/workflows/deploy.yml`

It does:

1. `npm ci`
2. `npm run build`
3. `rsync` to your server over SSH

Required repository/environment secrets:

- `SSH_PRIVATE_KEY` - private key used for deploy
- `SSH_KNOWN_HOSTS` - output of `ssh-keyscan -H your-host`
- `SSH_HOST` - server host
- `SSH_PORT` - SSH port (usually `22`)
- `SSH_USER` - deploy user
- `SSH_TARGET_DIR` - full server path to active child theme, e.g. `/var/www/example.com/public_html/wp-content/themes/bemke-child`

Generate known hosts value:

```bash
ssh-keyscan -H your-host.example.com
```

## 5. Important note about Bricks parent template

In `style.css` we set:

```txt
Template: bricks
```

If your parent Bricks folder name is different, update this value.
