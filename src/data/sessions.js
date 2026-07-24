// Mock catalog used until the Supabase backend is wired up.
// Photos use Unsplash source URLs (energetic, real movement).

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
    priceNim: 6,
    startsAt: '2026-07-25T08:00:00',
    location: 'Copacabana Beach',
    capacity: 12,
    booked: 10,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=70',
    coach: { name: 'Ana Ribeiro', rating: 4.9, avatar: 'https://i.pravatar.cc/120?img=47', wallet: 'NQ00 DEMO COACH' },
  },
  {
    id: 's2',
    title: 'Power Boxing Basics',
    category: 'boxing',
    priceNim: 8,
    startsAt: '2026-07-25T18:30:00',
    location: 'Downtown Gym',
    capacity: 15,
    booked: 6,
    image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&q=70',
    coach: { name: 'Marcus Lee', rating: 4.8, avatar: 'https://i.pravatar.cc/120?img=12', wallet: 'NQ00 DEMO COACH' },
  },
  {
    id: 's3',
    title: 'Afro House Dance Jam',
    category: 'dance',
    priceNim: 5,
    startsAt: '2026-07-26T19:00:00',
    location: 'Studio 9',
    capacity: 20,
    booked: 14,
    image: 'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?w=800&q=70',
    coach: { name: 'Joy Adeyemi', rating: 5.0, avatar: 'https://i.pravatar.cc/120?img=32', wallet: 'NQ00 DEMO COACH' },
  },
  {
    id: 's4',
    title: 'Core & Reformer Pilates',
    category: 'pilates',
    priceNim: 9,
    startsAt: '2026-07-27T09:30:00',
    location: 'Balance Studio',
    capacity: 10,
    booked: 9,
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=70',
    coach: { name: 'Sofia Marin', rating: 4.7, avatar: 'https://i.pravatar.cc/120?img=45', wallet: 'NQ00 DEMO COACH' },
  },
]
