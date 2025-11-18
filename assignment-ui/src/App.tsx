import React, { ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Page and Layout components
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardStudent from "./pages/DashboardStudent";
import AssignmentDetail from "./pages/AssignmentDetail";
import MainLayout from "./layout/MainLayout";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardProfessor from "./pages/DashboardProfessor";
import AssignmentSubmissions from "./pages/AssignmentSubmissions";
import MySubmissions from "./pages/MySubmissions";
import NoticeBoard from "./pages/NoticeBoard";
import NoticeDetail from "./pages/NoticeDetail";
import NoticeForm from "./pages/NoticeForm";
import CourseManagement from "./pages/CourseManagement";
import CourseForm from "./pages/CourseForm";
import CourseDetail from "./pages/CourseDetail";
import StudentCourseDetail from "./pages/StudentCourseDetail"; // ✅ 1. 새로 만든 페이지를 import 합니다.

function ProtectedRoute({ children }: { children: ReactNode }): React.ReactElement {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        {/* 학생 라우트 */}
        <Route path="/student" element={<DashboardStudent />} />
        {/* ✅ 2. 학생용 과목 상세 페이지를 위한 경로를 추가합니다. */}
        <Route path="/student/courses/:id" element={<StudentCourseDetail />} />
        <Route path="/student/assignments/:id" element={<AssignmentDetail />} />
        <Route path="/my-submissions" element={<MySubmissions />} />

        {/* 관리자 라우트 */}
        <Route path="/admin" element={<DashboardAdmin />} />

        {/* 교수 라우트 */}
        <Route path="/professor" element={<DashboardProfessor />} />
        <Route path="/professor/courses" element={<CourseManagement />} />
        <Route path="/professor/courses/new" element={<CourseForm />} />
        <Route path="/professor/courses/:id" element={<CourseDetail />} />
        <Route path="/professor/courses/:id/edit" element={<CourseForm />} />
        <Route path="/professor/assignments/:id/submissions" element={<AssignmentSubmissions />} />
        
        {/* 공지사항 관련 라우트 */}
        <Route path="/notices" element={<NoticeBoard />} />
        <Route path="/notices/new" element={<NoticeForm />} />
        <Route path="/notices/:id" element={<NoticeDetail />} />
        <Route path="/notices/:id/edit" element={<NoticeForm />} />
        
        <Route path="/" element={<Navigate to={user ? `/${user.role}` : "/login"} replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

