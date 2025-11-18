// User 역할을 명확하게 정의합니다.
export type UserRole = "student" | "professor" | "admin";

// User 객체의 구조를 정의합니다.
export interface User {
  id: number;
  username: string; 
  email: string;
  password?: string;
  role: UserRole;
}

// ✅ Course 타입에 joinCode 필드를 추가합니다.
export interface Course {
  id: number;
  name:string;
  professor: number;
  students: User[];
  joinCode: string;
}

// Assignment, Submission, Notice, Notification, ActivityLog 타입은 그대로 둡니다.
export interface Assignment {
  id: number;
  course: number;
  title: string;
  description: string;
  dueDate: string;
  allowLate: boolean;
}

export type SubmissionStatus = "제출 전" | "제출 완료" | "지연 제출" | "평가 완료";

export type Submission = {
  id: number;
  assignment: number;
  assignmentTitle?: string;
  student: number;
  studentUsername?: string;
  file: string | null;
  fileUrl?: string;
  description?: string;
  submittedAt: string | null;
  isLate: boolean;
  isFinal: boolean;
  grade?: number;
  feedback?: string;
  status: SubmissionStatus;
};

export interface Notice {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  author: number;
  authorUsername?: string;
}

export interface Notification {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface ActivityLog {
    id: number;
    actorUsername: string;
    actionType: string;
    details: string;
    createdAt: string;
}

