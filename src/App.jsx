import { Navigate, Route, Routes } from 'react-router-dom'
import { useApp } from './context/AppContext.jsx'
import AuthPage from './components/auth/AuthPage.jsx'
import Navbar from './components/shared/Navbar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import CoursePage from './pages/CoursePage.jsx'

function RequireAuth({ children }) {
  const { currentUser } = useApp()
  if (!currentUser) return <Navigate to="/login" replace />
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      {children}
    </div>
  )
}

export default function App() {
  const { currentUser } = useApp()

  return (
    <Routes>
      <Route
        path="/login"
        element={currentUser ? <Navigate to="/dashboard" replace /> : <AuthPage />}
      />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/courses/:courseId"
        element={
          <RequireAuth>
            <CoursePage />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to={currentUser ? '/dashboard' : '/login'} replace />} />
    </Routes>
  )
}
