import { Routes, Route, Navigate } from 'react-router-dom'
import useAuth from './hooks/useAuth'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import ConfigEditor from './pages/ConfigEditor'
import EmbedBuilder from './pages/EmbedBuilder'
import TebexLogs from './pages/TebexLogs'
import ProtectedUsers from './pages/ProtectedUsers'

export default function App() {
  const { user, loading } = useAuth()

  if (loading) return <p className="p-6">🔄 Checking login...</p>
  if (!user) return (window.location.href = '/login')

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <Navbar user={user} />
      <div className="p-6 max-w-5xl mx-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/config" element={<ConfigEditor />} />
          <Route path="/embed" element={<EmbedBuilder />} />
          <Route path="/tebex" element={<TebexLogs />} />
          <Route path="/protection" element={<ProtectedUsers />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  )
}
