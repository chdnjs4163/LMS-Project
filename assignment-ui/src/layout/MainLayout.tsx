import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "../components/NotificationBell";

export default function MainLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <aside className="w-64 bg-blue-800 text-white flex flex-col flex-shrink-0">
        {/* ✅ LMS 시스템 로고를 클릭 가능한 홈 링크로 변경했습니다. */}
        <Link to="/" className="block p-4 text-xl font-bold border-b border-blue-700 hover:bg-blue-700 transition-colors">
          📘 LMS 시스템
        </Link>
        <nav className="flex-1 p-4 space-y-2">
          {user?.role === "student" && (
            <>
              <Link to="/student" className="block hover:bg-blue-700 p-2 rounded transition-colors">학생 대시보드</Link>
              <Link to="/my-submissions" className="block hover:bg-blue-700 p-2 rounded transition-colors">내 성적 확인</Link>
              <Link to="/notices" className="block hover:bg-blue-700 p-2 rounded transition-colors">공지사항</Link>
            </>
          )}
          {user?.role === "professor" && (
             <>
              <Link to="/professor" className="block hover:bg-blue-700 p-2 rounded transition-colors">교수 대시보드</Link>
              <Link to="/professor/courses" className="block hover:bg-blue-700 p-2 rounded transition-colors">과목 관리</Link>
              <Link to="/notices" className="block hover:bg-blue-700 p-2 rounded transition-colors">공지사항 관리</Link>
            </>
          )}
          {user?.role === "admin" && (
            <>
              <Link to="/admin" className="block hover:bg-blue-700 p-2 rounded transition-colors">관리자 대시보드</Link>
              <Link to="/notices" className="block hover:bg-blue-700 p-2 rounded transition-colors">전체 공지사항</Link>
              <Link to="/admin/logs" className="block hover:bg-blue-700 p-2 rounded transition-colors">로그 관리</Link>
            </>
          )}
        </nav>
        <div className="p-4 border-t border-blue-700">
          <button onClick={logout} className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded transition-colors">로그아웃</button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center z-10">
          <h1 className="text-2xl font-semibold text-gray-800">환영합니다, {user?.username}님</h1>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <span className="text-gray-600 capitalize bg-gray-200 px-3 py-1 rounded-full text-sm font-medium">{user?.role}</span>
          </div>
        </header>
        
        <div className="flex-1 p-6 lg:p-8 overflow-y-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

