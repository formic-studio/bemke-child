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
│   ├── chunks/
│   │   └── *.js
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
- `dist/main.min.js` jako moduł ES (`type="module"`)

`main.min.js` zawiera tylko kod wspólny dla każdej podstrony. Pozostałe
funkcje są budowane do `dist/chunks/` i pobierane dopiero wtedy, gdy na bieżącej
stronie istnieje obsługiwany komponent. Dotyczy to m.in. sliderów, tabsów,
map, formularzy, popupów zespołu, liczników i animacji GSAP. Wybrane moduły są
dodatkowo ograniczone breakpointem, np. menu desktopowe nie jest pobierane na
telefonie.

Podział jest oparty przede wszystkim na obecności komponentu w DOM, a nie na
sztywnej liście adresów URL. Dzięki temu ten sam komponent działa również po
przeniesieniu go na inną stronę w Bricks. Błąd pojedynczego opcjonalnego modułu
jest izolowany i nie zatrzymuje pozostałych funkcji strony.

Przy każdym wdrożeniu trzeba przesłać **cały katalog `dist/`**, łącznie z
`dist/chunks/`. Sam plik `main.min.js` nie wystarczy, ponieważ nazwy chunków
zawierają hash aktualnego buildu.

## Cookiebot – ręczne blokowanie

Wtyczka Cookiebot powinna mieć ustawione:

- `Cookie-blocking`: `Manual`,
- `Cookiebot script tag`: `async`,
- `Hide cookie popup`: wyłączone.

Child theme ręcznie oznacza Google Maps jako treść `marketing`, pozostawia
lokalny plakat filmu YouTube widoczny przed zgodą i ładuje odtwarzacz dopiero
po zgodzie. Adres osadzenia YouTube jest automatycznie zmieniany na
`youtube-nocookie.com`. Własny bundle `bemke-child-main` jest oznaczony jako
`data-cookieconsent="ignore"`, ponieważ nie zawiera trackerów i jest potrzebny
do działania dostępności oraz placeholderów zgody.

Sekcja newslettera korzysta z opublikowanego formularza GetResponse o ID
`edb4255b-4abf-4da5-8ee1-dce33fad4220`. GetResponse odpowiada za pola,
walidację, zapis do listy, zgodę oraz wygląd zawartości formularza. Child theme
osadza formularz w miejscu formularza Bricks i dopasowuje wyłącznie jego
zewnętrzny kontener. Formularza nie należy dodatkowo uzależniać od zgody
Cookiebota.

W trybach kontrastowych cała karta newslettera (nagłówek, opis, formularz
i odstępy wewnętrzne) otrzymuje stałe białe tło oraz ciemny tekst, ponieważ
GetResponse renderuje jego ciemne etykiety i treść zgody w zamkniętym Shadow
DOM, poza zasięgiem CSS motywu. Białe podłoże zachowuje czytelność bez zmian
w polach, walidacji i mechanizmie zapisu. Osobne białe podłoże pod każdą grafiką
otrzymują logotypy projektów (`img-project-home`, `img-logo-eu`) i partnera,
również na podstronach warsztatów. Napisy w tych logotypach są częścią grafiki.
Dekoracyjne cudzysłowy SVG (`quote`, `marks`) i obraz tła wspólnego komponentu
CTA są w trybach kontrastowych ukryte. Przyciski zmieniają jednocześnie tło
i kolor tekstu przy hoverze oraz focusie, także po aktywacji całej karty.

Jeśli później zostanie dodany Google Tag Manager, nie należy wklejać drugiego
niezależnego Cookiebota ani oznaczać całego GTM jako `ignore`. GTM trzeba
podłączyć przez integrację Cookiebota/Google Consent Mode i ustawić wymagania
zgody osobno dla poszczególnych tagów.

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

### Szkic strony głównej EN

Tymczasowe narzędzie **Narzędzia → Bemke Home EN** czyta plan
`data/home-bemke-en.json`, przygotowany z eksportu WXR z 17.09.2026 i
`tlumaczenie_bemkepl_EN.csv`. Sprawdza, czy polska strona główna (ID 7) nadal
jest opublikowana, przypisana do PL i zgodna z eksportem. Przed zapisem pokazuje
54 tłumaczenia pól Bricks, 7 pól Yoast i opis strony. Rozbieżność w źródle
blokuje utworzenie szkicu.

Po kliknięciu przycisku narzędzie tworzy **szkic** strony Home w EN, kopiuje
układ Bricks i obrazy, zapisuje angielskie treści i łączy stronę z polskim
oryginałem w Polylang. Ponowne uruchomienie nie tworzy kolejnej strony.
Synchronizacja pól własnych w Polylang musi być wyłączona, aby angielskie pola
Bricks i Yoast nie nadpisywały polskich.

Przed publikacją wymagane są: mapowanie linków do innych szkiców EN, kontrola
ALT i pozostałych etykiet dostępności, tłumaczenie szablonów Bricks nagłówka
i stopki, kontrola formularza GetResponse oraz podgląd na desktopie i telefonie.
Przełącznik języka w menu nadal prowadzi do obecnej zaślepki.

### Pierwsza partia głównych stron EN

Narzędzie **Narzędzia → Bemke strony EN** korzysta z planu
`data/main-pages-bemke-en.json`. Obejmuje sześć stron głównego poziomu:
O nas (173), Edukacja (341), Rozwój (376), Kontakt (378), Wspieraj Bemke
(857) i Darczyńcy (924). Plan zawiera teksty Bricks, także we właściwościach
komponentów, angielskie pola formularza Kontakt oraz metadane Yoast.

Przed zapisem narzędzie porównuje polskie strony z eksportem WXR, sprawdza
aktywność Polylang i wyłączenie synchronizacji pól własnych. Jedno kliknięcie
tworzy sześć powiązanych szkiców EN i mapuje linki Bricks pomiędzy nimi oraz
do istniejącego szkicu Home EN. Polskie strony pozostają bez zmian. Ponowny
import zostaje zablokowany, jeżeli szkice EN już istnieją.

Linki do podstron z późniejszych partii, ALT obrazów i pobierane polskie PDF
wymagają przeglądu przed publikacją. Przełącznik języka w menu pozostaje
skierowany na zaślepkę.

### Druga partia podstron oraz szablony EN

Narzędzie **Narzędzia → Bemke EN — partia 2** korzysta z
`data/child-pages-bemke-en.json`. Tworzy sześć powiązanych szkiców EN:
Nasza historia, Założyciele, Fundacja Bemke, Fundacja Campus Bemke,
Dla mediów i Praca. Każda strona dostaje właściwego rodzica EN z pierwszej
partii, angielskie teksty Bricks i metadane Yoast. Narzędzie blokuje zapis,
jeśli polskie źródło zmieniło się od eksportu. Po utworzeniu szkiców mapuje
wewnętrzne linki między gotowymi wersjami EN.

Następnie **Narzędzia → Bemke EN — nawigacja** tworzy osobne menu EN oraz
szkice szablonów Bricks nagłówka i stopki. Menu zawiera tylko pozycje, dla
których istnieje powiązana strona EN. Dołożenie kolejnych podstron pozwala
uruchomić synchronizację menu ponownie. Nagłówek EN wskazuje nowe menu.
Istniejący przełącznik PL/EN w nagłówku zachowuje obecne cele, w tym
zaślepkę EN. Szablony pozostają szkicami i nie zmieniają widoku publicznego.

Przed publikacją szablonów trzeba sprawdzić je w Bricks, uzupełnić brakujące
pozycje menu, przygotować EN Privacy Policy i Bemke Explore, sprawdzić
wszystkie linki, formularze, ALT obrazów i widoki mobilne. Dynamiczne listy
ofert pracy i komunikatów prasowych pochodzą z osobnych typów wpisów. Pliki
PDF pozostają tymczasowo po polsku. Etykiety dostępności menu, przycisków
kontrastu i wielkości tekstu oraz odnośników społecznościowych wybierają język
na podstawie `lang` strony.

### Trzecia partia stron EN

Narzędzie **Narzędzia → Bemke EN — partia 3** czyta plan
`data/third-pages-bemke-en.json`. Tworzy szkice Falcons Wadowice, Olympic
Taekwondo, Bemke Explore, STEAM Workshops, Campus Bemke Services oraz Founding
Campaign. Ich rodzicami są istniejące strony EN Rozwój, Campus Bemke i
Wspieraj Bemke. Przed zapisem narzędzie porównuje każdą stronę PL z eksportem
WXR; zapis jest blokowany, jeśli zmienił się układ Bricks, tytuł, opis lub
metadane Yoast. Polskie strony pozostają bez zmian.

Po utworzeniu szkiców narzędzie mapuje linki między już przetłumaczonymi
stronami. Na stronie Usługi tłumaczy też pola formularza i jego zgodę;
odnośnik do polityki prywatności nadal prowadzi do dokumentu PL i jest
oznaczony jako taki. Opisy ALT EN obrazów z biblioteki mediów uzupełnimy w
osobnym etapie, po treściach stron. Przed publikacją trzeba sprawdzić obrazy,
działanie formularza i pobierane pliki PDF, które wciąż są po polsku.

Po tej partii wróć do **Narzędzia → Bemke EN — nawigacja** i użyj synchronizacji
menu. Doda ona cztery dostępne już pozycje EN i zaktualizuje odnośnik do
Bemke Explore w szkicu stopki. Nagłówek, stopka i przełącznik języka nadal
nie są publikowane ani przełączane automatycznie.

### Warsztaty STEAM EN

W polskim menu pod „Rozwój → Warsztaty STEAM” są jeszcze trzy strony.
**Narzędzia → Bemke EN — warsztaty STEAM** tworzy ich powiązane szkice EN:
Recurring Workshops, Workshops for Teachers i Workshops for Schools.
Plan jest w `data/steam-pages-bemke-en.json`. Narzędzie sprawdza niezmienność
stron PL i zapisuje treści Bricks oraz pola Yoast wyłącznie w szkicach EN.
Opisy ALT obrazów pozostają do osobnego etapu. Linki do polskich regulaminów
PDF mają etykietę „in Polish”.

Po utworzeniu trzech szkiców uruchom **Narzędzia → Bemke EN — nawigacja →
Synchronizuj menu EN**. Menu będzie wtedy miało wszystkie 22 pozycje z
polskiego odpowiednika, łącznie z trzema podstronami warsztatów. Synchronizacja
nie publikuje szkiców ani nie zmienia przełącznika języka.

### Szkic Campus Bemke EN

Tymczasowe narzędzie **Narzędzia → Campus Bemke EN** wczytuje plan z
`data/campus-bemke-en.php`. Przed zapisem sprawdza, czy strona 4600 nadal jest
szkicem oznaczonym w Polylang jako EN, a treści Bricks, Yoast i polskie opisy
obrazów odpowiadają eksportowi z 17.09.2026. Rozbieżność blokuje cały import.

Po kliknięciu przycisku narzędzie zapisuje kopię danych w metadanych strony pod
`_bemke_campus_en_import_backup`, tłumaczy instancje komponentów Bricks, pola
Yoast i opisy ALT EN sześciu obrazów. Polskie opisy ALT pozostają bez zmian.
Import można uruchomić ponownie bez dublowania zmian. Strona pozostaje szkicem.
Przed publikacją należy sprawdzić podgląd strony i linki do pozostałych
polskich podstron. Przełącznik języka w menu nadal kieruje do zaślepki EN.

Po zakończeniu migracji narzędzie i plan należy usunąć z motywu; zapisane
tłumaczenia pozostaną w WordPressie.

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
tylko odczytujące funkcje. Jeśli bieżący darczyńca nie ma żadnych liczb ani
statystyk, frontend automatycznie ukrywa `.donners-number-wrapper`. Przy braku
cytatów ukrywane są `.donners-quote-heading` oraz `.quote-grid`.

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

## Kampania Założycielska – postęp zbiórki

Aktualną zebraną kwotę i cel zbiórki ustawia się w panelu WordPress w:
`Ustawienia → Kampania Założycielska`. W obu polach należy wpisać pełne kwoty
w PLN, bez spacji i skrótu `mln`, np. `160000000` oraz `200000000`.

Pasek oraz kropka na stronie kampanii zaczynają od 0 i animują się do procentu
wynikającego z relacji zebranej kwoty do celu. Pasek nie przekracza 100%, także
gdy zebrana kwota jest większa niż cel. Przy włączonym ograniczeniu ruchu od
razu pokazywany jest stan końcowy. Prawa etykieta skali jest automatycznie
aktualizowana zgodnie z ustawionym celem. Lewa etykieta animuje się równolegle
z paskiem od `0 PLN` do aktualnie zebranej kwoty.

## Ważne

- `dist/` musi być commitowany do repo (to pliki produkcyjne pobierane przez WordPress).
- Nie wolno pomijać `dist/chunks/` podczas aktualizacji motywu.
- `Template: bricks` w `style.css` musi odpowiadać nazwie folderu parent theme.
 
