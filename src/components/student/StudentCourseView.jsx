import { useMemo } from 'react'
import { useApp } from '../../context/AppContext.jsx'
import ProgressBar from '../shared/ProgressBar.jsx'
import GroupPanel from './GroupPanel.jsx'
import AssignmentItem from './AssignmentItem.jsx'

export default function StudentCourseView({ course }) {
  const { currentUser, assignmentsForCourse, groupForStudentInCourse, submissions } = useApp()

  const assignments = assignmentsForCourse(course.id)
  const hasGroupAssignment = assignments.some((a) => a.submissionType === 'group')
  const myGroup = groupForStudentInCourse(currentUser.id, course.id)

  const progress = useMemo(() => {
    let done = 0
    for (const a of assignments) {
      if (a.submissionType === 'individual') {
        const row = submissions.find(
          (s) => s.assignmentId === a.id && s.studentId === currentUser.id,
        )
        if (row?.acknowledged) done += 1
      } else {
        const groupId = myGroup?.id
        const row = groupId
          ? submissions.find((s) => s.assignmentId === a.id && s.groupId === groupId)
          : null
        if (row?.acknowledged) done += 1
      }
    }
    return { done, total: assignments.length }
  }, [assignments, submissions, currentUser.id, myGroup])

  const percent = progress.total === 0 ? 0 : Math.round((progress.done / progress.total) * 100)

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-800">Your progress</h3>
          <span className="text-xs text-slate-500">
            {progress.done} / {progress.total} submitted
          </span>
        </div>
        <div className="mt-3">
          <ProgressBar percent={percent} />
        </div>
      </div>

      {hasGroupAssignment && <GroupPanel course={course} />}

      <div className="grid gap-4 sm:grid-cols-2">
        {assignments.map((assignment) => (
          <AssignmentItem key={assignment.id} assignment={assignment} course={course} />
        ))}
        {assignments.length === 0 && (
          <p className="text-sm text-slate-500">No assignments posted yet.</p>
        )}
      </div>
    </div>
  )
}
