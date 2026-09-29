import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext.jsx'

export default function Navbar() {
  const { currentUser, logout } = useApp()

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/dashboard">
          <p className="text-sm font-semibold text-slate-800">
            Student, Group &amp; Assignment Management
          </p>
          <p className="text-xs text-slate-500">
            {currentUser.role === 'professor' ? 'Professor view' : 'Student view'}
          </p>
        </Link>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-700">{currentUser.name}</p>
            <p className="text-xs capitalize text-slate-400">{currentUser.role}</p>
          </div>
          <button
            onClick={logout}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  )
}
