# Sesión

Book fitness & wellness sessions and pay independent coaches directly in **NIM** — instant, no card, no borders, non-custodial. A [Nimiq Pay](https://www.nimiq.com/nimiq-pay/) Mini App.

## What it does

- **Clients** browse a marketplace of local classes (yoga, boxing, dance, pilates, strength, wellness), book a spot, pay the coach directly in NIM, and get a QR ticket.
- **Coaches** sign in with their Nimiq wallet, create sessions, share a link, receive payments straight to their wallet, and scan the QR to check attendees in.

Payments go **directly** from client to coach — Sesión never holds funds.

## Tech stack

- React + Vite + Tailwind CSS
- [`@nimiq/mini-app-sdk`](https://www.npmjs.com/package/@nimiq/mini-app-sdk)
- Deployed on Vercel

## Getting started

```bash
npm install
npm run dev
```

The app runs in a normal browser (with a mock payment provider) and inside Nimiq Pay via:

```
nimiqpay://miniapp?url=<your-hosted-url>
```

## Project structure

```
src/
  components/   Reusable UI (SessionCard, CategoryChips, BottomNav)
  data/         Mock catalog (until Supabase is wired up)
  lib/          Nimiq SDK wrapper + formatting helpers
  pages/        Screens (Home marketplace, ...)
```

See `DESIGN.md` for the full design system.
