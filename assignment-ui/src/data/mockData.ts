import { User, Course, Assignment, Submission } from '../types';

export const mockUsers: User[] = [
  { id: 1, username: 'test_student', email: 'student@test.com', password: 'password123', role: 'student' },
  { id: 2, username: 'prof_kim', email: 'prof@test.com', password: 'password123', role: 'professor' },
  { id: 3, username: 'admin_user', email: 'admin@test.com', password: 'password123', role: 'admin' },
];

export const courses: Course[] = [
  { id: 1, name: '네트워크', professor: 2, students: [], joinCode: 'NET-101' },
  { id: 2, name: '데이터베이스', professor: 2, students: [], joinCode: 'DB-102' },
];

export const assignments: Assignment[] = [
  { id: 1, course: 1, title: '네트워크 보고서', description: "보고서 설명입니다.", dueDate: '2025-09-25', allowLate: true },
  { id: 2, course: 2, title: 'DB 설계 과제', description: "DB 설계 설명입니다.", dueDate: '2025-09-27', allowLate: false },
];

// ✅ 'status' 필드를 추가하여 types.ts와의 약속을 맞춥니다.
export const submissions: Submission[] = [
  { 
    id: 1, 
    assignment: 1, 
    student: 1, 
    file: 'report.pdf', 
    submittedAt: '2025-09-20T10:00:00', 
    isLate: false, 
    isFinal: true, 
    grade: 95, 
    feedback: '아주 잘 작성되었습니다.',
    status: '평가 완료' // grade가 있으므로 '평가 완료' 상태
  },
  { 
    id: 2, 
    assignment: 2, 
    student: 1, 
    file: 'db_design.pdf', 
    submittedAt: '2025-09-28T11:00:00', 
    isLate: true, 
    isFinal: true,
    status: '지연 제출' // isLate가 true이므로 '지연 제출' 상태
  },
];