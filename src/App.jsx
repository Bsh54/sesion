import { Routes, Route, useLocation } from 'react-router-dom'
import Landing from './pages/Landing'
import Home from './pages/Home'
import SessionDetail from './pages/SessionDetail'
import Tickets from './pages/Tickets'
import Profile from './pages/Profile'
import Create from './pages/Create'
import Coach from './pages/Coach'
import Placeholder from './pages/Placeholder'
import BottomNav from './components/BottomNav'

export default function App() {
  const { pathname } = useLocation()
  const hideNav = pathname === '/' || pathname === '/create' || pathname === '/coach'

  return (
    <div className="min-h-dvh bg-bg">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<Home />} />
        <Route path="/session/:id" element={<SessionDetail />} />
        <Route path="/create" element={<Create />} />
        <Route path="/coach" element={<Coach />} />
        <Route path="/search" element={<Placeholder title="Search" />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Placeholder title="Not found" />} />
      </Routes>
      {!hideNav && <BottomNav />}
    </div>
  )
}
