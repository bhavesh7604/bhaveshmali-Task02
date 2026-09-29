import { useState } from 'react'
import { useApp } from '../../context/AppContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'

export default function GroupPanel({ course }) {
  const { currentUser, users, groupForStudentInCourse, groupsInCourse, createGroup, joinGroup } = useApp()
  const { showToast } = useToast()
  const [newGroupName, setNewGroupName] = useState('')
  const [showJoin, setShowJoin] = useState(false)

  const myGroup = groupForStudentInCourse(currentUser.id, course.id)
  const joinableGroups = groupsInCourse(course.id).filter(
    (g) => !g.memberIds.includes(currentUser.id),
  )

  if (myGroup) {
    const isLeader = myGroup.leaderId === currentUser.id
    const memberNames = myGroup.memberIds
      .map((id) => users.find((u) => u.id === id)?.name)
      .filter(Boolean)

    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-800">{myGroup.name}</h3>
          {isLeader && (
            <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-brand-600">
              You're the leader
            </span>
          )}
        </div>
        <p className="mt-2 text-xs text-slate-500">{memberNames.join(', ')}</p>
      </div>
    )
  }

  function handleCreate() {
    if (!newGroupName.trim()) return
    createGroup(course.id, newGroupName.trim())
    showToast(`Group "${newGroupName.trim()}" created.`)
    setNewGroupName('')
  }

  function handleJoin(groupId, name) {
    joinGroup(groupId)
    showToast(`Joined ${name}.`)
    setShowJoin(false)
  }

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
      <p className="text-sm text-amber-800">
        You are not part of any group in this course. Form or join one to
        submit group assignments.
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <input
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          placeholder="New group name"
          className="min-w-[160px] flex-1 rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand-500"
        />
        <button
          onClick={handleCreate}
          className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
        >
          Create group
        </button>
        {joinableGroups.length > 0 && (
          <button
            onClick={() => setShowJoin((v) => !v)}
            className="rounded-lg border border-amber-300 bg-white px-3 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-100"
          >
            Join existing
          </button>
        )}
      </div>

      {showJoin && (
        <div className="mt-3 space-y-1.5 animate-fade-in">
          {joinableGroups.map((g) => (
            <button
              key={g.id}
              onClick={() => handleJoin(g.id, g.name)}
              className="flex w-full items-center justify-between rounded-lg border border-amber-200 bg-white px-3 py-2 text-left text-sm text-slate-700 transition hover:border-brand-400"
            >
              <span>{g.name}</span>
              <span className="text-xs text-slate-400">{g.memberIds.length} members</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
