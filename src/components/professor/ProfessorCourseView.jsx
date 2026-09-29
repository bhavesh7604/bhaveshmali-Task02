import { useMemo, useState } from 'react'
import { useApp } from '../../context/AppContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import AssignmentFormModal from './AssignmentFormModal.jsx'
import AssignmentProgressCard from './AssignmentProgressCard.jsx'

export default function ProfessorCourseView({ course }) {
  const { assignmentsForCourse, addAssignment, updateAssignment, enrollments, groups, submissions } = useApp()
  const { showToast } = useToast()

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null) // assignment being edited, or null for "create"
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all') // all | submitted | pending

  const assignments = assignmentsForCourse(course.id)

  function completionPercent(assignment) {
    const isGroup = assignment.submissionType === 'group'
    if (isGroup) {
      const courseGroups = groups.filter((g) => g.courseId === course.id)
      if (courseGroups.length === 0) return 0
      const done = courseGroups.filter((g) =>
        submissions.some((s) => s.assignmentId === assignment.id && s.groupId === g.id && s.acknowledged),
      ).length
      return Math.round((done / courseGroups.length) * 100)
    }
    const enrolled = enrollments.filter((e) => e.courseId === course.id)
    if (enrolled.length === 0) return 0
    const done = enrolled.filter((e) =>
      submissions.some((s) => s.assignmentId === assignment.id && s.studentId === e.studentId && s.acknowledged),
    ).length
    return Math.round((done / enrolled.length) * 100)
  }

  const filtered = useMemo(() => {
    return assignments.filter((a) => {
      const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase())
      if (!matchesSearch) return false
      if (statusFilter === 'all') return true
      const pct = completionPercent(a)
      if (statusFilter === 'submitted') return pct === 100
      return pct < 100
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignments, search, statusFilter, submissions, groups, enrollments])

  function handleSave(form) {
    if (editing) {
      updateAssignment(editing.id, form)
      showToast('Assignment updated.')
    } else {
      addAssignment(course.id, form)
      showToast('Assignment created.')
    }
    setModalOpen(false)
    setEditing(null)
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-800">Assignments</h3>
        <button
          onClick={() => {
            setEditing(null)
            setModalOpen(true)
          }}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
        >
          + New assignment
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title…"
          className="flex-1 min-w-[180px] rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-brand-500"
        />
        <div className="flex overflow-hidden rounded-lg border border-slate-200 text-xs font-medium">
          {[
            ['all', 'All'],
            ['submitted', 'Fully submitted'],
            ['pending', 'Pending'],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={`px-3 py-2 transition ${
                statusFilter === value ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {filtered.map((assignment) => (
          <AssignmentProgressCard
            key={assignment.id}
            assignment={assignment}
            course={course}
            onEdit={() => {
              setEditing(assignment)
              setModalOpen(true)
            }}
          />
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-slate-500">No assignments match your filters.</p>
        )}
      </div>

      <AssignmentFormModal
        open={modalOpen}
        initial={editing}
        onCancel={() => {
          setModalOpen(false)
          setEditing(null)
        }}
        onSave={handleSave}
      />
    </div>
  )
}
