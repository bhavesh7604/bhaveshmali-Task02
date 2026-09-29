// Simulated backend. Task 2 adds courses, semesters, groups, and
// submission-type-aware acknowledgment (individual vs group).

export const seedUsers = [
  { id: 'prof-1', name: 'Dr.Preeti Naruka', email: 'preeti@joineazy.edu', role: 'professor' },
  { id: 'prof-2', name: 'Prof.Shailesh Sharma', email: 'shailesh@joineazy.edu', role: 'professor' },
  { id: 'student-1', name: 'Nikhil Singh', email: 'nikhilsingh@joineazy.edu', role: 'student' },
  { id: 'student-2', name: 'Gaurav Menaria', email: 'gaurav@joineazy.edu', role: 'student' },
  { id: 'student-3', name: 'Vikas Mishra', email: 'vikas@joineazy.edu', role: 'student' },
  { id: 'student-4', name: 'Bhavesh Mali', email: 'bhavesh@joineazy.edu', role: 'student' },
]

export const seedCourses = [
  { id: 'course-1', code: 'CS301', title: 'Data Structures', professorId: 'prof-1', semester: 'Fall 2026' },
  { id: 'course-2', code: 'CS302', title: 'Web Development', professorId: 'prof-1', semester: 'Fall 2026' },
  { id: 'course-3', code: 'CS401', title: 'AI Systems', professorId: 'prof-2', semester: 'Fall 2026' },
]

// Which students are enrolled in which course, for that semester.
export const seedEnrollments = [
  { courseId: 'course-1', studentId: 'student-1' },
  { courseId: 'course-1', studentId: 'student-2' },
  { courseId: 'course-1', studentId: 'student-3' },
  { courseId: 'course-1', studentId: 'student-4' },
  { courseId: 'course-2', studentId: 'student-1' },
  { courseId: 'course-2', studentId: 'student-2' },
  { courseId: 'course-3', studentId: 'student-3' },
  { courseId: 'course-3', studentId: 'student-4' },
]

// Groups are scoped to a course. Only the leader can acknowledge a
// group assignment on behalf of every member.
export const seedGroups = [
  {
    id: 'group-1',
    courseId: 'course-1',
    name: 'Group A',
    leaderId: 'student-1',
    memberIds: ['student-1', 'student-2'],
  },
  {
    id: 'group-2',
    courseId: 'course-3',
    name: 'Team AI',
    leaderId: 'student-3',
    memberIds: ['student-3', 'student-4'],
  },
  // Note: student-3 and student-4 are enrolled in course-1 but have no
  // group there — this demonstrates the "not part of any group" prompt.
]

export const seedAssignments = [
  {
    id: 'asg-1',
    courseId: 'course-1',
    title: 'Linked List Implementation',
    description: 'Implement singly and doubly linked lists with full CRUD operations.',
    deadline: '2026-10-05T23:59',
    oneDriveLink: 'https://onedrive.live.com/example-asg-1',
    submissionType: 'individual',
  },
  {
    id: 'asg-2',
    courseId: 'course-1',
    title: 'Binary Tree Group Project',
    description: 'In groups, implement a self-balancing BST and benchmark it.',
    deadline: '2026-10-12T23:59',
    oneDriveLink: 'https://onedrive.live.com/example-asg-2',
    submissionType: 'group',
  },
  {
    id: 'asg-3',
    courseId: 'course-2',
    title: 'Portfolio Website',
    description: 'Build and deploy a personal portfolio site.',
    deadline: '2026-10-08T18:00',
    oneDriveLink: 'https://onedrive.live.com/example-asg-3',
    submissionType: 'individual',
  },
  {
    id: 'asg-4',
    courseId: 'course-3',
    title: 'AI Research Paper',
    description: 'In groups, write a short paper surveying a subfield of AI.',
    deadline: '2026-10-15T23:59',
    oneDriveLink: 'https://onedrive.live.com/example-asg-4',
    submissionType: 'group',
  },
]

// Acknowledgment rows.
// Individual assignments: one row per (assignmentId, studentId).
// Group assignments: one row per (assignmentId, groupId) — students with
// no group in that course simply have no row and see the join prompt.
export const seedSubmissions = [
  { assignmentId: 'asg-1', studentId: 'student-1', acknowledged: true, acknowledgedAt: '2026-09-25T10:15:00Z' },
  { assignmentId: 'asg-1', studentId: 'student-2', acknowledged: false, acknowledgedAt: null },
  { assignmentId: 'asg-1', studentId: 'student-3', acknowledged: true, acknowledgedAt: '2026-09-26T09:40:00Z' },
  { assignmentId: 'asg-1', studentId: 'student-4', acknowledged: false, acknowledgedAt: null },

  { assignmentId: 'asg-2', groupId: 'group-1', acknowledged: true, acknowledgedAt: '2026-09-27T12:00:00Z', acknowledgedBy: 'student-1' },

  { assignmentId: 'asg-3', studentId: 'student-1', acknowledged: true, acknowledgedAt: '2026-09-24T08:00:00Z' },
  { assignmentId: 'asg-3', studentId: 'student-2', acknowledged: false, acknowledgedAt: null },

  { assignmentId: 'asg-4', groupId: 'group-2', acknowledged: false, acknowledgedAt: null, acknowledgedBy: null },
]

export const STORAGE_KEYS = {
  users: 'sms_users',
  courses: 'sms_courses',
  enrollments: 'sms_enrollments',
  groups: 'sms_groups',
  assignments: 'sms_assignments',
  submissions: 'sms_submissions',
  currentUser: 'sms_current_user',
  token: 'sms_token',
}
