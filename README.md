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

Stan użytkownika jest zapisywany w `localStorage` pod kluczem
`bemke_a11y_reduce_motion`. Gdy ograniczenie jest aktywne, element `<html>`
otrzymuje atrybut `data-bemke-reduced-motion="true"`. Zmiana ustawienia emituje
zdarzenie `bemke:motion-change`, dzięki czemu komponenty mogą zareagować bez
odświeżania strony.

Systemowe `prefers-reduced-motion: reduce` ma pierwszeństwo przed ustawieniem
strony. Jeżeli ograniczenie ruchu jest włączone w systemie operacyjnym,
przełącznik na stronie nie pozwala wymusić animacji.

Po włączeniu:

- animacje i przejścia CSS są skracane do wartości praktycznie natychmiastowej,
- automatyczne oraz dekoracyjne animacje zostają zatrzymane,
- dekoracyjne filmy są pauzowane, a ich `autoplay` i `loop` wyłączane,
- animacje interfejsu, akordeonów, menu, zakładek i przejścia slajdów odbywają
  się natychmiast,
- liczniki od razu pokazują wartość końcową,
- nieskończone pętle zostają zatrzymane i mogą być przewijane ręcznie,
- ręczne sterowanie sliderem oraz przyciski Play/Pause pozostają dostępne.

Slidery nie uruchamiają autoplay samodzielnie. Jeżeli użytkownik świadomie
włączy Play, slider nadal może zmieniać slajdy, ale bez animowanego przejścia.

Animacja wejścia tekstów w `.section_hero` również respektuje to ustawienie.
Teksty pozostają w pozycjach ustawionych w Bricks. Na desktopie pojawiają się
z lekkim blurem, opacity i przesunięciem `y: 10px`, a na mobile bez blura.
Jeżeli tekst zajmuje kilka linii, kolejne linie mają subtelny stagger.

Zdjęcia z klasą `.img-scroll-expand` na desktopie rosną i maleją pod scrollem.
Po włączeniu ograniczenia animacji ich ScrollTriggery są usuwane, a zdjęcia
natychmiast otrzymują szerokość `100%`. Po ponownym wyłączeniu ograniczenia
animacje są odbudowywane bez przeładowania strony. Na ekranach do `767px`
animacja zdjęć nie jest uruchamiana niezależnie od ustawienia — zdjęcia od razu
mają szerokość `100%`.

Nowe animacje JS powinny przed uruchomieniem sprawdzać `isReducedMotion()` z
`src/js/modules/motion-preference.js` oraz reagować na
`MOTION_CHANGE_EVENT`. Efekt musi mieć bezpieczny stan końcowy, który można
pokazać natychmiast po włączeniu ograniczenia. Dla animacji CSS należy
uwzględnić selektor `html[data-bemke-reduced-motion="true"]`.

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

## Darczyńcy – powtarzalne liczby

Po aktywacji wtyczki Carbon Fields wpisy typu `Darczyńcy` otrzymują metabox
`Darczyńcy – liczby i statystyki`. Każdy wpis zawiera:

- liczbę lub krótki zapis wartości, np. `1600+`,
- opis.

Pola można dodawać bez limitu, usuwać i sortować. Metabox zapisuje wyłącznie
dane i nie ingeruje w szablon ani renderowanie frontendu.

Wpisy typu `Darczyńcy` otrzymują również metabox `Darczyńcy – cytaty`.
Można w nim dodać i sortować do 6 zestawów zawierających:

- cytat,
- imię i nazwisko,
- pozycję,
- zdjęcie.

Oba rodzaje danych są dostępne dla Bricks jako Array Query przez dedykowane,
tylko odczytujące funkcje. Jeśli bieżący darczyńca nie ma żadnego cytatu,
frontend automatycznie ukrywa `.donners-quote-heading` oraz `.quote-grid`.

## Dokumenty Fundacji – powtarzalne pliki

Wpisy typu `dokumenty-fundacja` otrzymują cztery niezależne metaboksy:

- Statut i pozostałe dokumenty,
- Sprawozdania merytoryczne,
- Sprawozdania finansowe,
- Listy darczyńców.

Każda sekcja pozwala dodać, usunąć i posortować dowolną liczbę dokumentów.
Pojedyncza pozycja zawiera nazwę dokumentu oraz plik z Biblioteki mediów.
Oba pola są opcjonalne, aby można było zapisywać również pozycje testowe.
Dane są wyłącznie zapisywane jako metadane i nie zmieniają automatycznie
szablonu ani frontendu. W Array Query dokumenty są zwracane od najpóźniej
dodanej pozycji do najwcześniejszej.

Provider Bricks korzysta z bieżącego wpisu `dokumenty-fundacja`, a na zwykłej
stronie, np. `/fundacja-bemke`, automatycznie używa ostatnio zmodyfikowanego
opublikowanego wpisu tego typu.

## Ważne

- `dist/` musi być commitowany do repo (to pliki produkcyjne pobierane przez WordPress).
- `Template: bricks` w `style.css` musi odpowiadać nazwie folderu parent theme.
 
