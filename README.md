# bemke-child

Child theme for Bricks with local Vite build, direct upload to WordPress, and GitHub as code backup.

## Workflow docelowy

1. Pracujesz lokalnie w `src/`.
2. `npm run dev` robi watch build do `dist/`.
3. VS Code SFTP automatycznie uploaduje `dist/` (i inne zmienione pliki motywu) na serwer WordPress.
4. Równolegle robisz `git push` do GitHub jako backup historii zmian.

## Szybki start

```bash
npm install
npm run dev
```

`npm run dev` = watch mode (rebuild po każdym save).  
`npm run build` = jednorazowy build produkcyjny.

## Struktura

```txt
bemke-child/
├── style.css
├── functions.php
├── src/
│   ├── js/main.js
│   └── css/main.css
├── dist/                 # output Vite: main.min.js + main.min.css
├── package.json
├── vite.config.js
└── .vscode/
    ├── settings.json
    └── extensions.json
```

## Jak działa enqueue w WordPress

`functions.php` ładuje:

- `dist/main.min.css`
- `dist/main.min.js` (z `defer`)

Wersja plików jest brana z `filemtime`, więc po uploadzie cache busting dzieje się automatycznie.

## Konfiguracja VS Code SFTP

1. Zainstaluj rozszerzenie `SFTP` (`liximomo.sftp`).
2. Masz już gotowy plik `.vscode/sftp.json` w projekcie.
3. Uzupełnij tylko pola z `UZUPELNIJ_...`.
4. Zapisz plik i w VS Code zrób `SFTP: List` (Command Palette), żeby sprawdzić połączenie.
5. Włącz watcher komendą `SFTP: Watcher On` (raz na sesję VS Code).

Uwaga: `.vscode/sftp.json` jest ignorowany przez Git (hasło nie poleci do repo).

Uzupełniasz:

- `host`:
  skąd wziąć: panel hostingu -> FTP/SFTP details (serwer FTP/SFTP)
- `port`:
  skąd wziąć: panel hostingu (najczęściej `22` dla SFTP)
- `username`:
  skąd wziąć: login konta FTP/SFTP z panelu hostingu
- `password`:
  skąd wziąć: hasło do konta FTP/SFTP
- `remotePath`:
  skąd wziąć: pełna ścieżka serwerowa do aktywnego motywu, np. `/public_html/wp-content/themes/bemke-child`

Jeśli nie znasz `remotePath`, najszybciej:

1. W WordPress: `Narzędzia -> Stan witryny -> Informacje -> Katalogi i rozmiary` sprawdź ścieżki (`ABSPATH`/`wp-content`).
2. Albo zapytaj support hostingu o dokładną ścieżkę katalogu motywu.

Uploadujemy na serwer tylko:

- `style.css`
- `functions.php`
- `dist/*`

## GitHub backup

Repo jest backupem kodu źródłowego i historii zmian.

```bash
git add .
git commit -m "opis zmian"
git push origin main
```

## Codzienny workflow (dokładnie)

1. Uruchom raz terminal:

```bash
npm run dev
```

2. Edytujesz pliki w `src/` i zapisujesz (`Cmd+S`).
3. Vite przebudowuje `dist/main.min.js` i `dist/main.min.css`.
4. SFTP (`uploadOnSave`) wysyła zmienione pliki na WordPress.
5. Co jakiś czas robisz backup do GitHub:

```bash
git add .
git commit -m "opis zmian"
git push origin main
```

## Ważne

- `Template: bricks` w `style.css` musi pasować do nazwy folderu parent theme.
- `dist/` jest lokalnym artefaktem deployowym (generowanym automatycznie).
