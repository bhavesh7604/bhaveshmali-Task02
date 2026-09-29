import { createContext, useContext, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import {
  seedUsers,
  seedCourses,
  seedEnrollments,
  seedGroups,
  seedAssignments,
  seedSubmissions,
  STORAGE_KEYS,
} from '../data/mockData.js'

const AppContext = createContext(null)


function makeMockToken(userId) {
  const payload = btoa(JSON.stringify({ sub: userId, iat: Date.now() }))
  return `mock.${payload}.token`
}

export function AppProvider({ children }) {
  const [users, setUsers] = useLocalStorage(STORAGE_KEYS.users, seedUsers)
  const [courses, setCourses] = useLocalStorage(STORAGE_KEYS.courses, seedCourses)
  const [enrollments, setEnrollments] = useLocalStorage(
    STORAGE_KEYS.enrollments,
    seedEnrollments,
  )
  const [groups, setGroups] = useLocalStorage(STORAGE_KEYS.groups, seedGroups)
  const [assignments, setAssignments] = useLocalStorage(
    STORAGE_KEYS.assignments,
    seedAssignments,
  )
  const [submissions, setSubmissions] = useLocalStorage(
    STORAGE_KEYS.submissions,
    seedSubmissions,
  )
  const [currentUserId, setCurrentUserId] = useLocalStorage(
    STORAGE_KEYS.currentUser,
    null,
  )
  const [token, setToken] = useLocalStorage(STORAGE_KEYS.token, null)

  const currentUser = useMemo(
    () => users.find((u) => u.id === currentUserId) || null,
    [users, currentUserId],
  )

  // --- Auth -----------------------------------------------------------
  function login(email) {
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (!user) return { ok: false, error: 'No account found with that email.' }
    setCurrentUserId(user.id)
    setToken(makeMockToken(user.id))
    return { ok: true, user }
  }

  function register({ name, email, role }) {
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: 'An account with that email already exists.' }
    }
    const newUser = { id: `${role}-${Date.now()}`, name, email, role }
    setUsers((prev) => [...prev, newUser])
    setCurrentUserId(newUser.id)
    setToken(makeMockToken(newUser.id))
    return { ok: true, user: newUser }
  }

  function logout() {
    setCurrentUserId(null)
    setToken(null)
  }

  // --- Courses ----------------------------------------------------------
  function coursesForProfessor(professorId) {
    return courses.filter((c) => c.professorId === professorId)
  }

  function createCourse({ code, title, semester }) {
    if (!currentUser || currentUser.role !== 'professor') return
    const newCourse = {
      id: `course-${Date.now()}`,
      code,
      title,
      semester,
      professorId: currentUser.id,
    }
    setCourses((prev) => [...prev, newCourse])
  }

  function coursesForStudent(studentId) {
    const ids = new Set(
      enrollments.filter((e) => e.studentId === studentId).map((e) => e.courseId),
    )
    return courses.filter((c) => ids.has(c.id))
  }

  // --- Groups -----------------------------------------------------------
  function groupForStudentInCourse(studentId, courseId) {
    return groups.find(
      (g) => g.courseId === courseId && g.memberIds.includes(studentId),
    )
  }

  function groupsInCourse(courseId) {
    return groups.filter((g) => g.courseId === courseId)
  }

  function createGroup(courseId, name) {
    if (!currentUser || currentUser.role !== 'student') return
    const newGroup = {
      id: `group-${Date.now()}`,
      courseId,
      name,
      leaderId: currentUser.id,
      memberIds: [currentUser.id],
    }
    setGroups((prev) => [...prev, newGroup])
  }

  function joinGroup(groupId) {
    if (!currentUser || currentUser.role !== 'student') return
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId && !g.memberIds.includes(currentUser.id)
          ? { ...g, memberIds: [...g.memberIds, currentUser.id] }
          : g,
      ),
    )
  }

  // --- Assignments --------------------------------------------------------
  function assignmentsForCourse(courseId) {
    return assignments.filter((a) => a.courseId === courseId)
  }

  function addAssignment(courseId, { title, description, deadline, oneDriveLink, submissionType }) {
    if (!currentUser || currentUser.role !== 'professor') return
    const newAssignment = {
      id: `asg-${Date.now()}`,
      courseId,
      title,
      description,
      deadline,
      oneDriveLink,
      submissionType,
    }
    setAssignments((prev) => [...prev, newAssignment])
  }

  function updateAssignment(assignmentId, updates) {
    if (!currentUser || currentUser.role !== 'professor') return
    setAssignments((prev) =>
      prev.map((a) => (a.id === assignmentId ? { ...a, ...updates } : a)),
    )
  }

  // --- Acknowledgments ------------------------------------------------------
  // Individual: the student acknowledges their own row.
  function acknowledgeIndividual(assignmentId) {
    if (!currentUser || currentUser.role !== 'student') return
    setSubmissions((prev) => {
      const exists = prev.some(
        (s) => s.assignmentId === assignmentId && s.studentId === currentUser.id,
      )
      const stamp = new Date().toISOString()
      if (!exists) {
        return [
          ...prev,
          { assignmentId, studentId: currentUser.id, acknowledged: true, acknowledgedAt: stamp },
        ]
      }
      return prev.map((s) =>
        s.assignmentId === assignmentId && s.studentId === currentUser.id
          ? { ...s, acknowledged: true, acknowledgedAt: stamp }
          : s,
      )
    })
  }

  // Group: only the leader can call this; it marks the whole group.
  function acknowledgeGroup(assignmentId, groupId) {
    if (!currentUser || currentUser.role !== 'student') return
    const group = groups.find((g) => g.id === groupId)
    if (!group || group.leaderId !== currentUser.id) return
    setSubmissions((prev) => {
      const exists = prev.some(
        (s) => s.assignmentId === assignmentId && s.groupId === groupId,
      )
      const stamp = new Date().toISOString()
      if (!exists) {
        return [
          ...prev,
          {
            assignmentId,
            groupId,
            acknowledged: true,
            acknowledgedAt: stamp,
            acknowledgedBy: currentUser.id,
          },
        ]
      }
      return prev.map((s) =>
        s.assignmentId === assignmentId && s.groupId === groupId
          ? { ...s, acknowledged: true, acknowledgedAt: stamp, acknowledgedBy: currentUser.id }
          : s,
      )
    })
  }

  const value = {
    users,
    courses,
    enrollments,
    groups,
    assignments,
    submissions,
    currentUser,
    token,
    login,
    register,
    logout,
    coursesForProfessor,
    createCourse,
    coursesForStudent,
    groupForStudentInCourse,
    groupsInCourse,
    createGroup,
    joinGroup,
    assignmentsForCourse,
    addAssignment,
    updateAssignment,
    acknowledgeIndividual,
    acknowledgeGroup,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}