# bemke-child

Child theme for Bricks with Vite build.

Docelowy flow:

1. Lokalnie edytujesz kod.
2. Budujesz `dist/`.
3. Pushujesz do GitHub.
4. WordPress pobiera aktualizację theme z repo (WP Pusher / Deployer for Git).

## Wymagania projektu

- Cały projekt musi spełniać WCAG 2.2 na poziomie AA.
- Każdy nowy komponent, animacja i interakcja musi być wdrażana i testowana pod dostępność (klawiatura, focus, kontrast, reduced motion, semantyka).

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

## Instagram feed (new)

Aby podpiąć zdjęcia z Instagrama:

1. W `wp-config.php` dodaj stałe:
   - `define( 'BEMKE_INSTAGRAM_USER_ID', 'TWOJE_IG_USER_ID' );`
   - `define( 'BEMKE_INSTAGRAM_ACCESS_TOKEN', 'TWOJ_LONG_LIVED_TOKEN' );`
2. Na stronie `falcons-wadowice` feed pojawi się automatycznie na końcu treści.
3. Jeśli chcesz sterować miejscem ręcznie, wstaw shortcode:
   - `[bemke_instagram_feed limit="8" columns="4"]`
4. Możesz też przekazać `user_id` i `access_token` bezpośrednio w shortcode, jeśli chcesz testować inne konto.

Uwaga: Instagram API działa tylko po poprawnej autoryzacji i tokenie; bez tego endpoint zwróci błąd.

## Ważne

- `dist/` musi być commitowany do repo (to pliki produkcyjne pobierane przez WordPress).
- `Template: bricks` w `style.css` musi odpowiadać nazwie folderu parent theme.
 
