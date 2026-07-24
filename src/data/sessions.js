// Mock catalog used until a shared backend is wired up.
// Photos use Unsplash URLs (energetic, real movement).

export const CATEGORIES = [
  { id: 'yoga', label: 'Yoga', icon: 'Flower2' },
  { id: 'boxing', label: 'Boxing', icon: 'Swords' },
  { id: 'dance', label: 'Dance', icon: 'Music2' },
  { id: 'pilates', label: 'Pilates', icon: 'Activity' },
  { id: 'strength', label: 'Strength', icon: 'Dumbbell' },
  { id: 'wellness', label: 'Wellness', icon: 'HeartPulse' },
]

export const SESSIONS = [
  {
    id: 's1',
    title: 'Sunrise Vinyasa Flow',
    category: 'yoga',
    priceNim: 0.01,
    durationMin: 60,
    level: 'All levels',
    startsAt: '2026-07-25T08:00:00',
    location: 'Copacabana Beach',
    capacity: 12,
    booked: 10,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=70',
    coach: { name: 'Ana Ribeiro', rating: 4.9, sessions: 124, avatar: 'https://i.pravatar.cc/120?img=47', wallet: 'NQ64 0740 6X5E LNYF 2S4N 2UD3 4N0L BL88 8TAJ' },
    description:
      'Greet the day with a flowing vinyasa practice on the sand. Move with your breath, build heat and start the day grounded. All levels welcome.',
  },
  {
    id: 's2',
    title: 'Power Boxing Basics',
    category: 'boxing',
    priceNim: 8,
    durationMin: 50,
    level: 'Beginner',
    startsAt: '2026-07-25T18:30:00',
    location: 'Downtown Gym',
    capacity: 15,
    booked: 6,
    image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&q=70',
    coach: { name: 'Marcus Lee', rating: 4.8, sessions: 88, avatar: 'https://i.pravatar.cc/120?img=12', wallet: 'NQ64 0740 6X5E LNYF 2S4N 2UD3 4N0L BL88 8TAJ' },
    description:
      'Learn footwork, guard and combinations in a high-energy beginner class. Gloves provided. Come ready to sweat and have fun.',
  },
  {
    id: 's3',
    title: 'Afro House Dance Jam',
    category: 'dance',
    priceNim: 5,
    durationMin: 75,
    level: 'All levels',
    startsAt: '2026-07-26T19:00:00',
    location: 'Studio 9',
    capacity: 20,
    booked: 14,
    image: 'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?w=800&q=70',
    coach: { name: 'Joy Adeyemi', rating: 5.0, sessions: 210, avatar: 'https://i.pravatar.cc/120?img=32', wallet: 'NQ64 0740 6X5E LNYF 2S4N 2UD3 4N0L BL88 8TAJ' },
    description:
      'Feel the rhythm in a joyful Afro house session. No experience needed — just bring energy and a smile. We break down every move.',
  },
  {
    id: 's4',
    title: 'Core & Reformer Pilates',
    category: 'pilates',
    priceNim: 9,
    durationMin: 55,
    level: 'Intermediate',
    startsAt: '2026-07-27T09:30:00',
    location: 'Balance Studio',
    capacity: 10,
    booked: 9,
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=70',
    coach: { name: 'Sofia Marin', rating: 4.7, sessions: 63, avatar: 'https://i.pravatar.cc/120?img=45', wallet: 'NQ64 0740 6X5E LNYF 2S4N 2UD3 4N0L BL88 8TAJ' },
    description:
      'Build deep core strength and mobility on the reformer. Small group with personal corrections throughout. Some prior Pilates experience recommended.',
  },
  {
    id: 's5',
    title: 'Kettlebell Strength Circuit',
    category: 'strength',
    priceNim: 7,
    durationMin: 45,
    level: 'All levels',
    startsAt: '2026-07-27T17:00:00',
    location: 'Iron Yard',
    capacity: 14,
    booked: 5,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=70',
    coach: { name: 'Diego Torres', rating: 4.8, sessions: 97, avatar: 'https://i.pravatar.cc/120?img=15', wallet: 'NQ64 0740 6X5E LNYF 2S4N 2UD3 4N0L BL88 8TAJ' },
    description:
      'A full-body kettlebell circuit that builds power and conditioning. Every movement is scalable, so you work at your own level.',
  },
  {
    id: 's6',
    title: 'Sound Bath & Breathwork',
    category: 'wellness',
    priceNim: 5,
    durationMin: 60,
    level: 'All levels',
    startsAt: '2026-07-28T20:00:00',
    location: 'Lotus Loft',
    capacity: 18,
    booked: 7,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=70',
    coach: { name: 'Maya Chen', rating: 5.0, sessions: 156, avatar: 'https://i.pravatar.cc/120?img=20', wallet: 'NQ64 0740 6X5E LNYF 2S4N 2UD3 4N0L BL88 8TAJ' },
    description:
      'Unwind with guided breathwork and healing sound frequencies. Leave calm, clear and recharged. Mats and blankets provided.',
  },
  {
    id: 's7',
    title: 'Rooftop HIIT Blast',
    category: 'strength',
    priceNim: 6,
    durationMin: 30,
    level: 'Intermediate',
    startsAt: '2026-07-28T07:00:00',
    location: 'Skyline Terrace',
    capacity: 16,
    booked: 15,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=70',
    coach: { name: 'Leila Haddad', rating: 4.9, sessions: 141, avatar: 'https://i.pravatar.cc/120?img=25', wallet: 'NQ64 0740 6X5E LNYF 2S4N 2UD3 4N0L BL88 8TAJ' },
    description:
      'Twenty minutes of high-intensity intervals with a skyline view. Fast, fun and finished before work. Bring water — you will need it.',
  },
  {
    id: 's8',
    title: 'Hatha Yoga for Beginners',
    category: 'yoga',
    priceNim: 5,
    durationMin: 60,
    level: 'Beginner',
    startsAt: '2026-07-29T10:00:00',
    location: 'Green Park Studio',
    capacity: 12,
    booked: 4,
    image: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=800&q=70',
    coach: { name: 'Priya Nair', rating: 4.7, sessions: 52, avatar: 'https://i.pravatar.cc/120?img=41', wallet: 'NQ64 0740 6X5E LNYF 2S4N 2UD3 4N0L BL88 8TAJ' },
    description:
      'A gentle, slow-paced introduction to yoga postures and breathing. Perfect if you are just starting out. Mats available on site.',
  },
]

// Practical info shown on every session (kept generic for the demo).
export const GOOD_TO_KNOW = [
  'Arrive 10 minutes early to check in.',
  'Bring water and a towel.',
  'Free cancellation up to 2 hours before.',
]

// What to bring / amenities, shown on the detail page.
export const AMENITIES = ['Mat provided', 'Changing room', 'Water refill', 'Free parking']

// Focus areas per category (shown as tags on the detail page).
export const FOCUS = {
  yoga: ['Flexibility', 'Balance', 'Breath'],
  boxing: ['Cardio', 'Strength', 'Agility'],
  dance: ['Cardio', 'Coordination', 'Fun'],
  pilates: ['Core', 'Mobility', 'Posture'],
  strength: ['Strength', 'Power', 'Endurance'],
  wellness: ['Relaxation', 'Breath', 'Recovery'],
}

// Intensity derived from the session level.
export const INTENSITY = {
  Beginner: 'Low',
  'All levels': 'Moderate',
  Intermediate: 'High',
}

// Generic session flow shown under "What to expect".
export const AGENDA = [
  { phase: 'Warm-up', detail: 'Gentle mobilisation to prepare your body.' },
  { phase: 'Main set', detail: 'The core of the session, guided step by step.' },
  { phase: 'Cool-down', detail: 'Stretch and breathe to recover and finish.' },
]

// Sample reviews (social proof) — shared across sessions for the demo.
export const SAMPLE_REVIEWS = [
  {
    name: 'Camila S.',
    avatar: 'https://i.pravatar.cc/80?img=48',
    rating: 5,
    text: 'Amazing energy and clear guidance. I left feeling incredible — booking again next week.',
  },
  {
    name: 'Tom B.',
    avatar: 'https://i.pravatar.cc/80?img=13',
    rating: 5,
    text: 'Perfect for beginners. Welcoming, well paced, and the coach really pays attention to form.',
  },
  {
    name: 'Aisha K.',
    avatar: 'https://i.pravatar.cc/80?img=29',
    rating: 4,
    text: 'Solid session and a great vibe. Arrive early though — it fills up fast!',
  },
]
