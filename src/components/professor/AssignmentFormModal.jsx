import { useEffect, useState } from 'react'

const empty = { title: '', description: '', deadline: '', oneDriveLink: '', submissionType: 'individual' }

export default function AssignmentFormModal({ open, initial, onCancel, onSave }) {
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setForm(initial ? { ...empty, ...initial } : empty)
      setError('')
    }
  }, [open, initial])

  if (!open) return null

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim() || !form.deadline || !form.oneDriveLink.trim()) {
      setError('Title, deadline, and OneDrive link are required.')
      return
    }
    onSave(form)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 animate-fade-in">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-xl bg-white p-5 shadow-xl animate-fade-in"
      >
        <h3 className="text-sm font-semibold text-slate-800">
          {initial ? 'Edit assignment' : 'Create assignment'}
        </h3>
        {error && <p className="mt-2 text-xs text-rose-500">{error}</p>}

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="sm:col-span-2 text-xs font-medium text-slate-600">
            Title
            <input
              value={form.title}
              onChange={update('title')}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-brand-500"
              placeholder="e.g. Binary Tree Group Project"
            />
          </label>

          <label className="sm:col-span-2 text-xs font-medium text-slate-600">
            Description
            <textarea
              value={form.description}
              onChange={update('description')}
              rows={2}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-brand-500"
              placeholder="What should students do?"
            />
          </label>

          <label className="text-xs font-medium text-slate-600">
            Deadline
            <input
              type="datetime-local"
              value={form.deadline}
              onChange={update('deadline')}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-brand-500"
            />
          </label>

          <label className="text-xs font-medium text-slate-600">
            Submission type
            <select
              value={form.submissionType}
              onChange={update('submissionType')}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-brand-500"
            >
              <option value="individual">Individual</option>
              <option value="group">Group</option>
            </select>
          </label>

          <label className="sm:col-span-2 text-xs font-medium text-slate-600">
            OneDrive link
            <input
              value={form.oneDriveLink}
              onChange={update('oneDriveLink')}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-brand-500"
              placeholder="https://onedrive.live.com/..."
            />
          </label>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-brand-700"
          >
            {initial ? 'Save changes' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  )
}
