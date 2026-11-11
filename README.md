# SysDash

Ein Dashboard, das Systemzustände und echte Wetter-/Flugwetterdaten anzeigt. Der Status jeder Kachel wird aus Wert und Grenzwerten **berechnet**, nicht gespeichert.

Gebaut mit **Next.js (App Router)** + **Tailwind CSS v4** + **TypeScript** (strict, kein `any`).

## Loslegen

Voraussetzung: **Node.js** (LTS) ist installiert (`node -v`).

```bash
git clone https://github.com/MightyMojo/sysdash.git
cd sysdash
npm install
cp .env.example .env.local   # dann OPENWEATHER_API_KEY eintragen (siehe unten)
npm run dev
```

Dann im Browser öffnen: **http://localhost:3000**

## Konfiguration

Quelle 1 (OpenWeatherMap) braucht einen kostenlosen Key (openweathermap.org → Sign up → API keys). In `.env.local`:

```
OPENWEATHER_API_KEY=dein_key
```

`.env.local` ist git-ignoriert. Der Key wird nur auf dem Server gelesen (`app/api/weather/route.ts`) und landet nie im Browser-Bundle. Ohne Key zeigt die Wetter-Gruppe einen verständlichen Fehlerzustand, der Rest des Dashboards läuft weiter. Nach dem Anlegen von `.env.local` den Dev-Server neu starten.

## Architektur

| Pfad | Wofür |
|---|---|
| `lib/status.ts` | **Reine** Domänenlogik: `getStatus`, Sortierung nach Schwere, `summarize` (`reduce`), `assertNever` |
| `data/systems.ts` | Typ `System` (mit `limits?`) + Mock-Daten. Der Status wird **nicht** gespeichert, sondern berechnet |
| `lib/weather.ts` | JSON-Parser (OpenWeatherMap), defensiv: fehlendes Feld → keine Kachel |
| `lib/metar.ts` | XML-Parser (METAR) mit `DOMParser` |
| `app/api/weather`, `app/api/metar` | Server-Proxies: Key bleibt geheim; aviationweather.gov sendet keine CORS-Header |
| `lib/sources.ts`, `hooks/useRemoteData.ts` | Laden mit Timeout, Abbruch, Fehlerabbildung (429, Timeout, Netz, Parse) und Refresh |
| `components/` | `Dashboard`, `DashboardHeader` (Gesamtstatus), `DataSection` (Lade-/Leer-/Fehlerzustand), `Tile`, `StatusBadge`, `RefreshButton` |
| `app/globals.css` | Design-Tokens (Farben, Radius, Font) und globaler Fokus-Stil |

## Design-System & Barrierefreiheit

- Farben nur über Tokens (`bg-surface`, `text-ink-muted`, `border-crit` …), Abstände über die Tailwind-Skala.
- Status nie nur über Farbe: Icon + Wort (OK / Warnung / Kritisch); kritisch zusätzlich mit voller Füllung, dickem Rahmen und Ring.
- Kontrast (WCAG, berechnet): Text auf Canvas/Kachel 7.4–15.1:1, Status-Texte 5.9–8.8:1, Fokusring 12.9:1.
- Responsiv: 375 px → 1 Spalte, 1024 px → 2, 1440 px → 3 (`grid-cols-1 md:grid-cols-2 xl:grid-cols-3`).
- Bedienung per Tastatur: echte `<button>`-Elemente (Tab, Enter, Space), sichtbarer Fokus via `:focus-visible`.
- Lighthouse Accessibility (Production-Build): 100.
