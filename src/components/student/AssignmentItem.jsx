import { useState } from 'react'
import { useApp } from '../../context/AppContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import ConfirmModal from '../shared/ConfirmModal.jsx'
import StatusBadge from '../shared/StatusBadge.jsx'

export default function AssignmentItem({ assignment, course }) {
  const { currentUser, users, groupForStudentInCourse, submissions, acknowledgeIndividual, acknowledgeGroup } = useApp()
  const { showToast } = useToast()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const isGroup = assignment.submissionType === 'group'
  const myGroup = isGroup ? groupForStudentInCourse(currentUser.id, course.id) : null

  let acknowledged = false
  let acknowledgedAt = null
  let acknowledgedByName = null
  let canAcknowledge = false

  if (!isGroup) {
    const row = submissions.find(
      (s) => s.assignmentId === assignment.id && s.studentId === currentUser.id,
    )
    acknowledged = !!row?.acknowledged
    acknowledgedAt = row?.acknowledgedAt
    canAcknowledge = !acknowledged
  } else if (myGroup) {
    const row = submissions.find(
      (s) => s.assignmentId === assignment.id && s.groupId === myGroup.id,
    )
    acknowledged = !!row?.acknowledged
    acknowledgedAt = row?.acknowledgedAt
    acknowledgedByName = row?.acknowledgedBy
      ? users.find((u) => u.id === row.acknowledgedBy)?.name
      : null
    canAcknowledge = !acknowledged && myGroup.leaderId === currentUser.id
  }

  function handleConfirm() {
    if (isGroup && myGroup) {
      acknowledgeGroup(assignment.id, myGroup.id)
      showToast('Acknowledged for your group — all members will see this.')
    } else if (!isGroup) {
      acknowledgeIndividual(assignment.id)
      showToast('Submission acknowledged.')
    }
    setConfirmOpen(false)
  }

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
        <StatusBadge acknowledged={acknowledged} pendingLabel="Pending" />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <a
          href={assignment.oneDriveLink}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-medium text-brand-600 hover:underline"
        >
          Open OneDrive link ↗
        </a>

        {acknowledged && acknowledgedAt && (
          <span className="text-xs text-slate-400">
            {isGroup && acknowledgedByName ? `by ${acknowledgedByName} · ` : ''}
            {new Date(acknowledgedAt).toLocaleString()}
          </span>
        )}

        {isGroup && !myGroup && (
          <span className="ml-auto text-xs text-amber-600">
            Join a group above to submit this assignment.
          </span>
        )}

        {isGroup && myGroup && !acknowledged && !canAcknowledge && (
          <span className="ml-auto text-xs text-slate-400">
            Waiting for your group leader to acknowledge.
          </span>
        )}

        {canAcknowledge && (
          <button
            onClick={() => setConfirmOpen(true)}
            className="ml-auto rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-brand-700"
          >
            Yes, I have submitted
          </button>
        )}
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Confirm submission"
        message={
          isGroup
            ? `This acknowledges "${assignment.title}" for your whole group — every member's dashboard will show it as submitted.`
            : `This marks "${assignment.title}" as submitted, with a timestamp.`
        }
        confirmLabel="Yes, I have submitted"
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}
