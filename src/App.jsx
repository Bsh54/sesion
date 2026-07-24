import { Routes, Route, useLocation } from 'react-router-dom'
import Landing from './pages/Landing'
import Home from './pages/Home'
import SessionDetail from './pages/SessionDetail'
import Tickets from './pages/Tickets'
import Profile from './pages/Profile'
import CoachLayout from './pages/CoachLayout'
import CoachDashboard from './pages/CoachDashboard'
import CoachEvents from './pages/CoachEvents'
import CoachEventDetail from './pages/CoachEventDetail'
import CoachProfile from './pages/CoachProfile'
import Create from './pages/Create'
import Placeholder from './pages/Placeholder'
import BottomNav from './components/BottomNav'

export default function App() {
  const { pathname } = useLocation()
  const hideNav = pathname === '/' || pathname.startsWith('/coach')

  return (
    <div className="min-h-dvh bg-bg">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<Home />} />
        <Route path="/session/:id" element={<SessionDetail />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search" element={<Placeholder title="Search" />} />

        {/* Coach space (own navigation) */}
        <Route path="/coach" element={<CoachLayout />}>
          <Route index element={<CoachDashboard />} />
          <Route path="events" element={<CoachEvents />} />
          <Route path="create" element={<Create />} />
          <Route path="profile" element={<CoachProfile />} />
          <Route path="event/:id" element={<CoachEventDetail />} />
        </Route>

        <Route path="*" element={<Placeholder title="Not found" />} />
      </Routes>
      {!hideNav && <BottomNav />}
    </div>
  )
}
