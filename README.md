# bemke-child

Child theme for Bricks with Vite build.

Docelowy flow:

1. Lokalnie edytujesz kod.
2. Budujesz `dist/`.
3. Pushujesz do GitHub.
4. WordPress pobiera aktualizację theme z repo (WP Pusher / Deployer for Git).

## Struktura

```txt
bemke-child/
├── style.css
├── functions.php
├── src/
│   ├── js/main.js
│   └── css/main.css
├── dist/
│   ├── main.min.js
│   └── main.min.css
├── package.json
└── vite.config.js
```

## Build

Instalacja:

```bash
npm install
```

Watch:

```bash
npm run dev
```

Production build:

```bash
npm run build
```

`functions.php` ładuje:

- `dist/main.min.css`
- `dist/main.min.js` (`defer`)

## WordPress (GitHub -> WP)

### Opcja A: WP Pusher

1. W panelu WordPress zainstaluj WP Pusher.
2. `WP Pusher -> Install Theme`.
3. Repo: `formic-studio/bemke-child`, branch: `main`.
4. Zainstaluj i aktywuj theme.
5. Włącz `Push-to-Deploy` (webhook), jeśli chcesz auto update po pushu.

### Opcja B: Deployer for Git

1. Zainstaluj plugin `Deployer for Git` z WordPress.org.
2. Dodaj repo `formic-studio/bemke-child` jako theme.
3. Ustaw branch `main`.
4. Włącz auto deploy/webhook.

## Codzienny workflow

1. Pracujesz w `src/`.
2. Uruchamiasz `npm run dev` (watch) lub ręcznie `npm run build`.
3. Commit + push do GitHub:

```bash
git add .
git commit -m "Opis zmian"
git push origin main
```

4. WordPress aktualizuje theme z repo.

## Ważne

- `dist/` musi być commitowany do repo (to pliki produkcyjne pobierane przez WordPress).
- `Template: bricks` w `style.css` musi odpowiadać nazwie folderu parent theme.
