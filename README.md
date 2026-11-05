# SysDash — Starter

Das Startprojekt für unser Kursprojekt **SysDash**: ein Dashboard, das Systemzustände anzeigt. Es wächst über die 8 Kurstage mit — von statischen Kacheln bis zu echten Daten aus einer API.

Gebaut mit **Next.js (App Router)** + **Tailwind CSS** + **TypeScript** — mit Typsicherheit von Anfang an.

## Loslegen

Dieses Projekt ist ein GitHub-**Template**. Hol es dir nicht per Clone dieses Repos, sondern:
**„Use this template" → „Create a new repository"** unter deinem eigenen Account. Dann **dein neues Repo** klonen.

Voraussetzung: **Node.js** (LTS) ist installiert (`node -v`).

```bash
git clone https://github.com/DEIN-NAME/sysdash.git
cd sysdash
npm install     # einmalig: Abhängigkeiten laden
npm run dev     # Entwicklungsserver starten
```

Dann im Browser öffnen: **http://localhost:3000**

Ändere eine Datei, speichere — der Browser aktualisiert sich **sofort** (Hot Reload). Das ist deine Arbeitsschleife.

## Was liegt wo

| Datei | Wofür |
|---|---|
| `app/page.tsx` | Die Startseite — hier entsteht dein Dashboard |
| `components/Tile.tsx` | Eine wiederverwendbare Dashboard-Kachel (typisierte Props `title`, `value`, `unit`) |
| `data/systems.ts` | Mock-Systemdaten + Typ `System` (werden später durch eine echte API ersetzt) |
| `app/globals.css` | Globale Styles + Tailwind-Einbindung |
| `app/layout.tsx` | Das Grundgerüst der Seite |
| `tsconfig.json` | TypeScript-Konfiguration |

## Deine ersten Aufgaben

Die ausführliche Anleitung bekommst du im Unterricht. Kurz:

1. Eigenes Repo aus diesem Template anlegen, klonen, starten (oben).
2. In `app/page.tsx` die Kachel ändern (Titel + Wert) und live beobachten.
3. Statt einzelner Kacheln alle aus `data/systems.ts` erzeugen (`.map(...)`).
4. Nach jeder Änderung committen & pushen — dein Repo ist dein Netz.

> Trau dich, Dinge auszuprobieren und kaputtzumachen. Jeder Commit ist zurückrollbar (Git-Grundlagen folgen später im Kurs).
