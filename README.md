# Seed Journal (MVP)

A dark-theme, local-first journaling app where every entry grows a seed into a tree.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Zustand
- IndexedDB (with in-memory fallback)
- Vitest for growth logic tests

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Core Loop

1. Write a journal message.
2. Submit.
3. Growth points are computed.
4. Tree stage evolves and the visual pulses.
5. A local rules-based reflection appears.

## Growth algorithm

`points = 10 + lengthBonus + streakBonus`

- Length bonus:
  - `+5` if chars `>= 50`
  - `+10` if chars `>= 150`
  - `+15` if chars `>= 300`
- Streak bonus:
  - `+2 * streakCount`, capped at `+14`
- Streak uses local calendar date keys (`YYYY-MM-DD`) and checks consecutive days.

### Stage thresholds

- `0–49`: seed
- `50–149`: sprout
- `150–299`: sapling
- `300–599`: young tree
- `600–999`: tree
- `1000+`: flourishing

## Persistence model

Database name: `seed-journal`

Object stores:
- `entries` (keyPath: `id`)
- `stats` (singleton key)

On startup, Zustand store hydrates from IndexedDB.
On submit, entry + stats are written in one transaction.
If IndexedDB fails/unavailable, app falls back to in-memory mode.

## Data model

- Entry: `id`, `createdAt`, `text`, `computedPoints`, optional `tags`, optional `mood`
- UserStats: `totalPoints`, `level`, `stage`, `streakCount`, `lastEntryDate`, `totalEntries`

## Accessibility

- Cmd/Ctrl+Enter submit
- Visible focus rings
- ARIA labels for key action buttons

## Safety note

The settings drawer includes: **“Not a substitute for professional care.”**
