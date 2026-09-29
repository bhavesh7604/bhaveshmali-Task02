import { useMemo, useState } from 'react'
import { useApp } from '../../context/AppContext.jsx'
import ProgressBar from '../shared/ProgressBar.jsx'
import StatusBadge from '../shared/StatusBadge.jsx'

export default function AssignmentProgressCard({ assignment, course, onEdit }) {
  const { users, enrollments, groups, submissions } = useApp()
  const [expanded, setExpanded] = useState(false)

  const enrolledStudents = useMemo(
    () =>
      enrollments
        .filter((e) => e.courseId === course.id)
        .map((e) => users.find((u) => u.id === e.studentId))
        .filter(Boolean),
    [enrollments, users, course.id],
  )

  const courseGroups = useMemo(
    () => groups.filter((g) => g.courseId === course.id),
    [groups, course.id],
  )

  const isGroup = assignment.submissionType === 'group'

  const stats = useMemo(() => {
    if (!isGroup) {
      const rows = enrolledStudents.map((s) => ({
        label: s.name,
        acknowledged: submissions.some(
          (sub) => sub.assignmentId === assignment.id && sub.studentId === s.id && sub.acknowledged,
        ),
      }))
      const done = rows.filter((r) => r.acknowledged).length
      return { rows, done, total: rows.length, extraNote: null }
    }

    const studentsInAGroup = new Set(courseGroups.flatMap((g) => g.memberIds))
    const withoutGroup = enrolledStudents.filter((s) => !studentsInAGroup.has(s.id))

    const rows = courseGroups.map((g) => ({
      label: `${g.name} (${g.memberIds.length} members)`,
      acknowledged: submissions.some(
        (sub) => sub.assignmentId === assignment.id && sub.groupId === g.id && sub.acknowledged,
      ),
    }))
    const done = rows.filter((r) => r.acknowledged).length
    return {
      rows,
      done,
      total: rows.length,
      extraNote:
        withoutGroup.length > 0
          ? `${withoutGroup.length} enrolled student${withoutGroup.length === 1 ? '' : 's'} not in a group yet`
          : null,
    }
  }, [isGroup, enrolledStudents, courseGroups, submissions, assignment.id])

  const percent = stats.total === 0 ? 0 : Math.round((stats.done / stats.total) * 100)

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-800">{assignment.title}</h3>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">
              {assignment.submissionType}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">{assignment.description}</p>
          <p className="mt-2 text-xs text-slate-400">
            Due {new Date(assignment.deadline).toLocaleString()}
          </p>
        </div>
        <button
          onClick={onEdit}
          className="shrink-0 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
        >
          Edit
        </button>
      </div>

      <div className="mt-3">
        <ProgressBar
          percent={percent}
          label={`${stats.done} / ${stats.total} ${isGroup ? 'groups' : 'students'} submitted`}
        />
        {stats.extraNote && (
          <p className="mt-1 text-xs text-amber-600">{stats.extraNote}</p>
        )}
      </div>

      <button
        onClick={() => setExpanded((v) => !v)}
        className="mt-3 text-xs font-medium text-brand-600 hover:underline"
      >
        {expanded ? 'Hide' : 'Show'} details
      </button>

      {expanded && (
        <ul className="mt-2 divide-y divide-slate-100 animate-fade-in">
          {stats.rows.map((r) => (
            <li key={r.label} className="flex items-center justify-between py-2">
              <span className="text-sm text-slate-700">{r.label}</span>
              <StatusBadge acknowledged={r.acknowledged} />
            </li>
          ))}
          {stats.rows.length === 0 && (
            <p className="py-2 text-xs text-slate-400">Nothing to show yet.</p>
          )}
        </ul>
      )}
    </div>
  )
}
