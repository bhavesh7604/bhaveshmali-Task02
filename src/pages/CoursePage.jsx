import { Link, Navigate, useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import ProfessorCourseView from '../components/professor/ProfessorCourseView.jsx'
import StudentCourseView from '../components/student/StudentCourseView.jsx'

export default function CoursePage() {
  const { courseId } = useParams()
  const { currentUser, courses, enrollments } = useApp()
  const course = courses.find((c) => c.id === courseId)

  if (!course) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10 text-center sm:px-6">
        <p className="text-sm text-slate-600">Course not found.</p>
        <Link to="/dashboard" className="mt-2 inline-block text-sm text-brand-600 hover:underline">
          ← Back to dashboard
        </Link>
      </main>
    )
  }

  const isProfessor = currentUser.role === 'professor'
  const authorized = isProfessor
    ? course.professorId === currentUser.id
    : enrollments.some((e) => e.courseId === course.id && e.studentId === currentUser.id)

  if (!authorized) return <Navigate to="/dashboard" replace />

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <Link to="/dashboard" className="text-xs font-medium text-slate-500 hover:text-brand-600">
        ← All courses
      </Link>
      <div className="mt-2 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-brand-600">{course.code}</p>
          <h2 className="text-lg font-semibold text-slate-800">{course.title}</h2>
        </div>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
          {course.semester}
        </span>
      </div>

      <div className="mt-6">
        {isProfessor ? (
          <ProfessorCourseView course={course} />
        ) : (
          <StudentCourseView course={course} />
        )}
      </div>
    </main>
  )
}
