# Sesión

Book fitness & wellness sessions and pay coaches directly in **NIM** — instant, no card, no borders, non-custodial. A [Nimiq Pay](https://www.nimiq.com/nimiq-pay/) Mini App.

## What it does

Sesión is a marketplace for fitness & wellness classes (yoga, boxing, dance, pilates, strength, wellness). You:

1. **Browse** local sessions from independent coaches.
2. **Book** a spot and **pay the coach directly in NIM** — one tap, settled in seconds.
3. **Get a QR ticket** to show at the door.

Payments go **straight from you to the coach's wallet** — Sesión never holds funds, takes no card, and asks for no KYC. That means a coach anywhere in the world can get paid instantly, even where cards and Stripe don't work.

> The supply side (coaches and their sessions) is curated for now. A self-serve coach onboarding flow, backed by a shared database, is on the roadmap.

## Tech stack

- React + Vite + Tailwind CSS
- [`@nimiq/mini-app-sdk`](https://www.npmjs.com/package/@nimiq/mini-app-sdk) for wallet access and payments
- Deployed on Vercel

## Getting started

```bash
npm install
npm run dev
```

The app runs in a normal browser (with a mock payment provider for development) and inside Nimiq Pay via:

```
nimiqpay://miniapp?url=<your-hosted-url>
```

## Project structure

```
src/
  components/   Reusable UI (SessionCard, CategoryChips, BottomNav)
  data/         Demo catalog (seed content)
  lib/          Nimiq SDK wrapper, session store, formatting helpers
  pages/        Landing (public) + app screens (Home marketplace, ...)
```

See `DESIGN.md` for the full design system.
