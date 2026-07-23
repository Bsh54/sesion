import { Routes, Route, useLocation } from 'react-router-dom'
import Landing from './pages/Landing'
import Home from './pages/Home'
import Placeholder from './pages/Placeholder'
import BottomNav from './components/BottomNav'

export default function App() {
  const { pathname } = useLocation()
  const isLanding = pathname === '/'

  return (
    <div className="min-h-dvh bg-bg">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<Home />} />
        <Route path="/search" element={<Placeholder title="Search" />} />
        <Route path="/create" element={<Placeholder title="Create a session" />} />
        <Route path="/tickets" element={<Placeholder title="My tickets" />} />
        <Route path="/profile" element={<Placeholder title="Profile" />} />
        <Route path="/session/:id" element={<Placeholder title="Session details" />} />
        <Route path="*" element={<Placeholder title="Not found" />} />
      </Routes>
      {!isLanding && <BottomNav />}
    </div>
  )
}
