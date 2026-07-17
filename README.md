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

## Ograniczenie animacji

Przełącznik „Ogranicz animacje” zapisuje wybór użytkownika w przeglądarce i
respektuje również systemowe `prefers-reduced-motion`.

Po włączeniu:

- automatyczne i dekoracyjne animacje zostają zatrzymane,
- dekoracyjne filmy są pauzowane,
- animacje interfejsu i przejścia slajdów odbywają się natychmiast,
- ręczne sterowanie sliderem oraz przyciski Play/Pause pozostają dostępne.

Slidery nie uruchamiają autoplay samodzielnie. Jeżeli użytkownik świadomie
włączy Play, slider nadal może zmieniać slajdy, ale bez animowanego przejścia.

Animacja wejścia tekstów w `.section_hero` również respektuje to ustawienie.
Na desktopie tekst przechodzi ze środka do układu z Bricks, a na mobile
wykonywany jest tylko krótki fade z przesunięciem `y: 10px`.

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

1. Wejdź w WordPress → Ustawienia → **Bemke Instagram** i ustaw:
   - `token webhooka` (`X-Secret-Token`), który będzie wysyłał Make.
2. W Make ustaw zadanie, które raz dziennie pobiera max. 12 ostatnich postów i wywołuje endpoint:
   - `POST /wp-json/bemke/v1/instagram-post`
3. W payloadzie Make wysyłaj albo:
   - pojedynczy obiekt posta
   - albo tablicę `items` / `posts` z ostatnimi postami.
4. Na stronie `falcons-wadowice` feed pojawi się automatycznie na końcu treści. Jeśli chcesz sterować miejscem ręcznie, wstaw shortcode:
   - `[bemke_instagram_feed limit="8" columns="4"]`

## Popup zespołu (o-nas)

Mechanika popupów członków zespołu działa teraz na atrybutach:

- link / przycisk otwierający: `data-number="01"` (lub `01`, `1` itd.)
- popup: `.popup-team[data-number="01"]`

Na starcie popupy są ukryte, a po kliknięciu pokazuje się odpowiedni popup na środku wraz z ciemnym overlay.

Zamykanie:
- kliknięcie w `X` (`.exit-button`) wewnątrz popupu,
- kliknięcie w tło overlay,
- klawisz `Esc`.

## Ważne

- `dist/` musi być commitowany do repo (to pliki produkcyjne pobierane przez WordPress).
- `Template: bricks` w `style.css` musi odpowiadać nazwie folderu parent theme.
 
