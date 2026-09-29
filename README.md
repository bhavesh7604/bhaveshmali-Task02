# Student, Group & Assignment Management System

Round 2 of the Joineazy Frontend Intern task — a frontend-polish pass on top
of the Task 1 prototype, rebuilt around the fuller spec: courses, semesters,
student groups, and submission-type-aware acknowledgment (individual vs.
group), with a proper auth flow and role-based redirect.

No real backend is wired up — data is seeded from mock objects and persisted
to `localStorage`, exactly as allowed by the brief ("mock API if needed").

## Tech stack

- React 18 + Vite
- React Router (client-side routes: `/login`, `/dashboard`, `/courses/:id`)
- Tailwind CSS
- Context API for shared state (auth, courses, groups, assignments,
  acknowledgments) + a small toast context for feedback

## Setup

```bash
npm install
npm run dev       # http://localhost:5173
npm run build      # production build into /dist
npm run preview    # preview the production build locally
```

No `.env` needed. `vercel.json` includes a SPA rewrite so refreshing a
route like `/courses/course-1` doesn't 404 on Vercel.

## UI flow

**Auth (`/login`)** — Log in or register, with client-side validation
(required fields, email format, password length). Registering lets you pick
a role (student/professor); logging in matches against seeded users by
email (any password 4+ characters works, since there's no real backend to
check it against). A mock JWT-shaped token is stored in `localStorage` on
success to keep the flow honest to the spec, and successful auth redirects
by role — everyone lands on `/dashboard`, which then renders differently
per role.

**Dashboard (`/dashboard`)** — Professors see the courses they teach;
students see the courses they're enrolled in this semester. Clicking a
course goes to its assignments page.

**Course page (`/courses/:id`)** — Access is guarded: a professor only
gets in if they teach the course, a student only if they're enrolled;
anyone else is redirected back to the dashboard.

- *Professor view*: create/edit assignments (title, description, deadline,
  OneDrive link, individual/group), search by title, filter by
  fully-submitted vs. pending, and expand any assignment to see the full
  roster with per-student or per-group status. Each assignment shows a
  progress bar (`X / Y students` or `X / Y groups` submitted).
- *Student view*: an overall course progress bar, a group panel (only shown
  when the course has a group assignment), and a card per assignment.

**Group logic** — Groups are scoped to a course. A student not in a group
sees a prompt to create or join one instead of a submit button. For a group
assignment, only the group's leader sees a "Yes, I have submitted" button;
once they confirm, every member's card shows "Acknowledged" with a
timestamp. For an individual assignment, every student acknowledges their
own row directly, also timestamped.

**Feedback** — Acknowledging a submission, creating a group, or joining one
all trigger a toast confirmation (bottom-right, auto-dismissing), and cards/
buttons use subtle hover and transition states throughout.

## Folder structure

```
src/
  data/
    mockData.js              # seed users, courses, enrollments, groups,
                              # assignments, acknowledgment rows
  hooks/
    useLocalStorage.js       # mirrors React state into localStorage
  context/
    AppContext.jsx            # auth + courses/groups/assignments/acks,
                               # and every action that mutates them
    ToastContext.jsx          # toast queue + auto-dismiss
  components/
    auth/
      AuthPage.jsx             # login/register, validation, role picker
    shared/
      Navbar.jsx               # current user, role, logout
      ProgressBar.jsx          # reused everywhere a % needs to render
      ConfirmModal.jsx         # reused for every "are you sure" step
      StatusBadge.jsx          # "Acknowledged" / "Pending" pill
    professor/
      ProfessorCourseView.jsx        # search, filter, assignment grid
      AssignmentFormModal.jsx         # create/edit form
      AssignmentProgressCard.jsx      # one assignment + expandable roster
    student/
      StudentCourseView.jsx           # overall progress + group panel + list
      GroupPanel.jsx                   # current group, or create/join UI
      AssignmentItem.jsx               # one assignment + ack logic by type
  pages/
    Dashboard.jsx              # role-aware course list
    CoursePage.jsx              # route guard + renders the role-specific view
  App.jsx                       # route table + auth guard
  main.jsx                      # BrowserRouter + AppProvider + ToastProvider
```

## Design decisions

- **Route-per-page over one giant component.** `/login`, `/dashboard`, and
  `/courses/:id` are real routes (React Router), not just state toggles —
  it matches how the spec describes distinct pages, makes deep-linking to
  a course possible, and keeps each page component focused.
- **Access is enforced where the data is read, not just hidden in the
  UI** — `CoursePage` checks `course.professorId` or the enrollments list
  before rendering anything, so a professor can't land on a course they
  don't teach even by typing the URL directly.
- **Groups live at the course level, not the assignment level.** A group a
  student is in for "Data Structures" carries across every group
  assignment in that course, which matches how real group projects work
  and avoids asking students to re-form groups per assignment.
- **Acknowledgment logic branches once, in `AssignmentItem`,** based on
  `assignment.submissionType` — individual rows are keyed by
  `(assignmentId, studentId)`, group rows by `(assignmentId, groupId)`, so
  a group's status is a single source of truth every member reads instead
  of a status duplicated per member.
- **Context API, still no external state library** — the shared state
  (auth, courses, groups, assignments, submissions) is one slice with a
  focused set of actions; a dedicated store would be overkill at this
  scope.
- **Mock JWT string** — `login`/`register` generate a base64 token shape
  and store it in `localStorage`, so the "JWT flow" in the spec is honored
  in form even though there's no server to actually issue or verify one.

## Known limitations (by design, given no backend)

- Auth is mock — any password of 4+ characters is accepted for a seeded
  email; there's no real credential check or token verification.
- All state resets if you clear the site's `localStorage`.
- Screenshots/GIFs of the UI flow aren't included in this README — add
  them from your own recording before submitting, since they need to show
  your actual deployed instance.
