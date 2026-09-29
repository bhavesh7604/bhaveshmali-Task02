import { useState } from 'react'

const empty = { code: '', title: '', semester: '' }

export default function CreateCourseModal({ open, onCancel, onSave }) {
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')

  if (!open) return null

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.code.trim() || !form.title.trim() || !form.semester.trim()) {
      setError('Course code, title, and semester are required.')
      return
    }
    onSave(form)
    setForm(empty)
    setError('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 animate-fade-in">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl animate-fade-in"
      >
        <h3 className="text-sm font-semibold text-slate-800">New course</h3>
        {error && <p className="mt-2 text-xs text-rose-500">{error}</p>}

        <div className="mt-3 space-y-3">
          <label className="block text-xs font-medium text-slate-600">
            Course code
            <input
              value={form.code}
              onChange={update('code')}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-brand-500"
              placeholder="e.g. CS303"
            />
          </label>

          <label className="block text-xs font-medium text-slate-600">
            Title
            <input
              value={form.title}
              onChange={update('title')}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-brand-500"
              placeholder="e.g. Operating Systems"
            />
          </label>

          <label className="block text-xs font-medium text-slate-600">
            Semester
            <input
              value={form.semester}
              onChange={update('semester')}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-brand-500"
              placeholder="e.g. Fall 2026"
            />
          </label>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setForm(empty)
              setError('')
              onCancel()
            }}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-brand-700"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  )
}