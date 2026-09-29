import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'

export default function AuthPage() {
  const { login, register, users } = useApp()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' })
  const [errors, setErrors] = useState({})

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  function validate() {
    const next = {}
    if (mode === 'register' && !form.name.trim()) next.name = 'Name is required.'
    if (!form.email.trim()) next.email = 'Email is required.'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email.'
    if (!form.password.trim()) next.password = 'Password is required.'
    else if (form.password.length < 4) next.password = 'Password must be at least 4 characters.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    if (mode === 'login') {
      const result = login(form.email)
      if (!result.ok) {
        setErrors({ form: result.error })
        return
      }
      showToast(`Welcome back, ${result.user.name.split(' ')[0]}!`)
      navigate('/dashboard')
    } else {
      const result = register({ name: form.name, email: form.email, role: form.role })
      if (!result.ok) {
        setErrors({ form: result.error })
        return
      }
      showToast(`Account created — welcome, ${result.user.name.split(' ')[0]}!`)
      navigate('/dashboard')
    }
  }

  const demoUsers = users.slice(0, 6)

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-fade-in">
        <div className="mb-5 flex rounded-lg bg-slate-100 p-1 text-sm font-medium">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 rounded-md py-1.5 transition ${
              mode === 'login' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'
            }`}
          >
            Log in
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 rounded-md py-1.5 transition ${
              mode === 'register' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'
            }`}
          >
            Register
          </button>
        </div>

        <h1 className="text-lg font-semibold text-slate-800">
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Role-based redirect: professors land on their course list, students
          land on their enrolled courses.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          {errors.form && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-600">
              {errors.form}
            </p>
          )}

          {mode === 'register' && (
            <div>
              <label className="text-xs font-medium text-slate-600">Full name</label>
              <input
                value={form.name}
                onChange={update('name')}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-brand-500"
                placeholder="Your name"
              />
              {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-slate-600">Email</label>
            <input
              value={form.email}
              onChange={update('email')}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-brand-500"
              placeholder="you@joineazy.edu"
            />
            {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email}</p>}
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={update('password')}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-brand-500"
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-1 text-xs text-rose-500">{errors.password}</p>}
          </div>

          {mode === 'register' && (
            <div>
              <label className="text-xs font-medium text-slate-600">I am a</label>
              <div className="mt-1 flex gap-2">
                {['student', 'professor'].map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setForm((f) => ({ ...f, role: r }))}
                    className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium capitalize transition ${
                      form.role === r
                        ? 'border-brand-500 bg-brand-50 text-brand-700'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700"
          >
            {mode === 'login' ? 'Log in' : 'Create account'}
          </button>
        </form>

        {mode === 'login' && (
          <div className="mt-5 border-t border-slate-100 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Demo accounts (any password 4+ chars)
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {demoUsers.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, email: u.email, password: 'demo123' }))}
                  className="rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-600 transition hover:border-brand-500 hover:text-brand-600"
                >
                  {u.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
