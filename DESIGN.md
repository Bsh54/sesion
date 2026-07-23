# 🎨 Sesión — Carte graphique (Design System)

> Mini App Nimiq Pay · mobile-first · marketplace fitness & bien-être · paiements NIM directs.
> Direction issue du skill ui-ux-pro-max (pattern *Marketplace*, style *Exaggerated Minimalism*, typo *Sports/Fitness*).

---

## 0. Direction artistique — « Athletic Editorial »
Un look de **magazine sportif premium**, pas une app crypto. Fond crème éditorial, encre quasi-noire, **un seul accent qui claque (lime électrique)**, titres condensés surdimensionnés, beaucoup de vide. High contrast, énergique, humain (vraies photos de coachs).

**Ce qu'on évite :** dégradés violets/bleus "web3", glassmorphism générique, dark mode néon crypto, emojis en guise d'icônes.

---

## 1. Palette (exacte)

### Light (par défaut)
| Rôle | Hex | Usage |
|---|---|---|
| `bg` (canvas) | `#FAF7F0` | fond crème éditorial |
| `surface` (card) | `#FFFFFF` | cartes, sheets |
| `ink` (primary text/btn) | `#14161B` | texte, boutons principaux |
| `ink-soft` | `#565A66` | texte secondaire |
| `lime` (signature/accent) | `#C8FF3D` | highlight, prix, actif, badges |
| `on-lime` | `#14161B` | texte sur lime (contraste ok) |
| `coral` (urgence/live) | `#FF5A3C` | "2 places restantes", live |
| `success` | `#16A34A` | check-in, paiement ok |
| `border` | `#E9E4D8` | séparateurs sur crème |
| `muted` | `#F1EEE6` | fonds inertes, skeleton |
| `destructive` | `#DC2626` | annulation |
| `ring` (focus) | `#C8FF3D` | anneau focus 2px |

### Dark (optionnel, v2)
`bg #101216` · `surface #191C22` · `ink #F5F3EC` · `ink-soft #A2A6B0` · `lime #C8FF3D` (garde) · `border #262A31`.
Règle : lime reste identique, le reste se désature (pas d'inversion brute). Tester le contraste séparément.

**Règle d'or accent :** lime = highlight/positif, coral = urgence/rareté. Jamais les deux côte à côte comme CTA.

---

## 2. Typographie — Barlow Condensed + Barlow
```
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800&family=Barlow:wght@400;500;600;700&display=swap');
```
- **Display / titres** : `Barlow Condensed` (impact athlétique)
- **Corps / UI** : `Barlow` (lisible)

### Échelle (mobile → desktop)
| Token | Taille | Font / poids | Notes |
|---|---|---|---|
| display | `clamp(40px, 11vw, 72px)` | Cond. 800, tracking -0.03em | hero, souvent UPPERCASE |
| h1 | 32px | Cond. 700 | titres de page |
| h2 | 24px | Cond. 700 | sections |
| h3 | 20px | Cond. 600 | titres de carte |
| body-lg | 18px | Barlow 400, lh 1.6 | intro |
| **body** | **16px** | Barlow 400, lh 1.6 | **min mobile (anti-zoom iOS)** |
| label | 14px | Barlow 600 | chips, nav, boutons |
| micro | 12px | Barlow 600, **tabular-nums** | prix, minuteurs, dates |

> **Prix & nombres = `font-variant-numeric: tabular-nums`** (évite les sauts de layout). Format : `◆ 6 NIM` + fiat secondaire `≈ $0.05` (via `getHostFiat`).

---

## 3. Espacement, rayons, ombres
- **Spacing** (rythme 4/8) : `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64`
- **Gouttières** mobiles : 20px de marge latérale (`px-5`)
- **Rayons** : boutons **pill** (`rounded-full`) pour l'énergie ; cartes `rounded-3xl` (24px) ; sheets `rounded-t-[28px]` ; ticket `rounded-2xl` (16px) + perforation.
- **Ombres** (basses, douces) :
  - `card` : `0 4px 16px rgba(20,22,27,.06)`
  - `sheet` : `0 -8px 32px rgba(20,22,27,.12)`
  - `float/CTA` : `0 8px 24px rgba(20,22,27,.14)`

---

## 4. Composants (specs précises)

### Boutons
- **Primary** : bg `ink`, texte crème, `rounded-full`, hauteur **52px**, label 16/600, `active:scale-95` (150ms ease-out), focus ring lime 2px. Un seul par écran.
- **Accent** : bg `lime`, texte `ink` (pour les moments "positifs" : Réserver, Payer).
- **Secondary** : bordure `ink`, fond transparent, texte `ink`.
- **Ghost/icon** : 44×44 min, hitSlop si icône plus petite.
- État chargement : spinner + `disabled` (opacity .5), texte "Traitement…".

### Chip catégorie (scroll horizontal)
Pill 36px, label 14/600, icône Lucide 18px à gauche. Actif : bg `ink`, texte crème. Inactif : bg `muted`, texte `ink-soft`.

### Carte session (marketplace)
```
┌───────────────────────────┐
│  [photo 4:5, overlay ink]  │  ← vraie photo, gradient bas pour lisibilité
│  ⦿ catégorie (chip lime)   │
│                            │
│  YOGA SUNRISE   (h3 cond.) │
│  ◆ 6 NIM  ·  sam. 8:00     │  ← prix lime, date tabular
│  [avatar] Coach Ana · 4.9★ │
│  🟥 2 places restantes      │  ← coral SI rareté (texte + couleur)
└───────────────────────────┘
```
Card blanche, `rounded-3xl`, ombre `card`, `active:scale-[.98]`. Photo lazy + `aspect-ratio` réservé (anti-CLS).

### Marketplace / accueil (pattern Marketplace)
1. **Header** : logo Sesión + solde/localisation.
2. **Barre de recherche = la CTA** (grande, `rounded-full`, icône loupe, placeholder "Yoga, boxe, près de toi…").
3. **Catégories** : rangée de chips scrollable (Yoga, Boxe, Danse, Pilates, Muscu, Bien-être).
4. **Featured / Cette semaine** : grille 1 col (mobile) / 2 col (≥768).
5. **Bandeau confiance** : "Payé direct au coach · sans carte · sans frais".
6. **CTA hôte** : "Tu es coach ? Crée ta session".

### Navigation (bottom nav, ≤5, icône+label Lucide)
`Découvrir` · `Recherche` · **`+ Créer` (bouton central proéminent, lime)** · `Billets` · `Profil`. Actif = `ink` + point lime. Safe-area bottom respectée.

### Détail session
- Hero photo pleine largeur (ratio 4:5), bouton retour flottant.
- Titre display, prix lime tabular, date/lieu.
- Bloc coach (avatar, nom, ★, lien social vérifié).
- **Mur "qui vient"** : rangée d'avatars + "8 inscrits" (preuve sociale).
- Compteur de places (coral si <20% restant).
- **CTA collant en bas** : `Réserver · ◆ 6 NIM` (barre fixe, safe-area, ombre float).

### Flow de réservation
1. Tap CTA → **bottom sheet** (slide-up depuis le CTA, scrim 50% noir).
2. Récap : session, date, prix, "payé direct au coach, non-custodial".
3. `Payer ◆ 6 NIM` (accent lime) → **popup native Nimiq Pay** (`sendBasicTransactionWithData`).
4. **Succès** : checkmark animé (draw 300ms) + `navigator.vibrate(10)` + confetti léger.
5. → **Billet QR** généré.

### Billet QR (motif ticket)
```
┌───────────────────────────┐
│  YOGA SUNRISE              │
│  Coach Ana · sam. 8:00     │
│ - - - - - perforation - - -│  ← encoche + pointillés
│      [ QR CODE ]           │
│  #TICKET-7 · Confirmé ✅    │  ← statut (booked/checked-in)
└───────────────────────────┘
```
Fond blanc, `rounded-2xl`, liseré lime en haut, QR haute-résolution (≥ 220px), texte tabular. État "Checked-in" → tampon success vert.

### Dashboard coach
- En-tête : **gains cumulés** `◆ 128 NIM` (tabular, gros).
- Liste "Mes sessions" : carte compacte (titre, date, `12/15 inscrits`, bouton **Scanner** pour check-in).
- Bouton flottant `+ Nouvelle session`.
- **Scanner check-in** : ouvre la caméra → scan QR élève → toast success + haptic.

### États vides (jamais d'écran blanc)
- Marketplace vide : illustration duotone (ink+lime) + "Aucune session ici pour l'instant" + CTA "Explore une autre catégorie".
- Billets vides : "Pas encore de réservation" + CTA "Découvrir des sessions".
- Dashboard vide : "Crée ta première session en 30 s" + CTA.

---

## 5. Iconographie & imagerie
- **Icônes** : Lucide React uniquement, stroke **1.75**, tailles tokens `18 / 24`. Un seul style (outline). Jamais d'emoji structurel.
- **Photos** : vraies images de mouvement (yoga, boxe…), énergiques, humaines. Traitement **duotone ink+lime** sur les héros/états vides pour unifier et éviter le "stock". Sur cartes : photo réelle + gradient `ink` en bas pour lisibilité du texte.
- **Glyphe NIM** : `◆` stylisé lime devant les montants.

---

## 6. Micro-interactions / motion
- Durées **150–250ms**, `ease-out` à l'entrée, sortie ~70% plus courte. `transform`/`opacity` uniquement (jamais width/height).
- **Press** : `active:scale-95` (boutons), `active:scale-[.98]` (cartes).
- **Apparition liste** : stagger 40ms/carte.
- **Rareté** : chip coral "X places" en pulse subtil.
- **Succès paiement** : checkmark draw + confetti court + haptic `vibrate(10)`.
- **Sheets/modals** : animent depuis leur source (slide+fade).
- `prefers-reduced-motion` : désactive confetti/parallax, garde les fondus.

---

## 7. Accessibilité (checklist)
- Contraste : `ink` sur `bg` ✅, `ink` sur `lime` ✅, crème sur `ink` ✅ (≥4.5:1).
- Touch targets ≥ 44px, gap ≥ 8px.
- Focus visible (ring lime 2px), ordre logique.
- Jamais la couleur seule (rareté = texte "2 places" + coral).
- `viewport` sans blocage du zoom ; body 16px min ; safe-areas (notch + barre gestuelle).
- Labels aria sur boutons icône ; `aria-live=polite` pour toasts.

---

## 8. Tailwind — tokens prêts à coller
```js
// tailwind.config.js → theme.extend
colors: {
  bg: '#FAF7F0', surface: '#FFFFFF',
  ink: '#14161B', 'ink-soft': '#565A66',
  lime: '#C8FF3D', coral: '#FF5A3C',
  success: '#16A34A', border: '#E9E4D8',
  muted: '#F1EEE6', destructive: '#DC2626',
},
fontFamily: {
  display: ['"Barlow Condensed"', 'sans-serif'],
  sans: ['Barlow', 'system-ui', 'sans-serif'],
},
borderRadius: { card: '24px', sheet: '28px', ticket: '16px' },
boxShadow: {
  card: '0 4px 16px rgba(20,22,27,.06)',
  sheet: '0 -8px 32px rgba(20,22,27,.12)',
  float: '0 8px 24px rgba(20,22,27,.14)',
},
```

---

## 9. Résumé "one-liner"
**Crème + encre + lime électrique. Titres Barlow Condensed surdimensionnés. Vraies photos duotone. Boutons pill noirs, accents lime, urgence coral. Prix tabulaires. Motion douce + haptic. = un magazine fitness premium qui encaisse en NIM, pas une app crypto.**
