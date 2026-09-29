import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import CreateCourseModal from '../components/professor/CreateCourseModal.jsx'

export default function Dashboard() {
  const { currentUser, coursesForProfessor, coursesForStudent, assignmentsForCourse, createCourse } = useApp()
  const { showToast } = useToast()
  const isProfessor = currentUser.role === 'professor'
  const courses = isProfessor
    ? coursesForProfessor(currentUser.id)
    : coursesForStudent(currentUser.id)

  const [modalOpen, setModalOpen] = useState(false)

  function handleSave(form) {
    createCourse(form)
    showToast('Course created.')
    setModalOpen(false)
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">
            {isProfessor ? 'Courses you teach' : 'Your courses this semester'}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {isProfessor
              ? 'Click a course to manage its assignments and see submission progress.'
              : 'Click a course to view its assignments and acknowledge submissions.'}
          </p>
        </div>
        {isProfessor && (
          <button
            onClick={() => setModalOpen(true)}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
          >
            + New course
          </button>
        )}
      </div>

      <section className="mt-5 grid gap-4 sm:grid-cols-2">
        {courses.map((course) => {
          const count = assignmentsForCourse(course.id).length
          return (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-brand-600">{course.code}</p>
                  <h3 className="mt-0.5 text-sm font-semibold text-slate-800 group-hover:text-brand-700">
                    {course.title}
                  </h3>
                </div>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                  {course.semester}
                </span>
              </div>
              <p className="mt-3 text-xs text-slate-400">
                {count} assignment{count === 1 ? '' : 's'}
              </p>
            </Link>
          )
        })}
        {courses.length === 0 && (
          <p className="text-sm text-slate-500">
            {isProfessor ? 'You are not teaching any courses yet.' : 'You are not enrolled in any courses yet.'}
          </p>
        )}
      </section>

      {isProfessor && (
        <CreateCourseModal
          open={modalOpen}
          onCancel={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </main>
  )
}