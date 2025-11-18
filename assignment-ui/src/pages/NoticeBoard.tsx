import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/api";
import { Notice } from "../types"; // types.ts에서 Notice 타입을 가져옵니다.
import { useAuth } from "../context/AuthContext";

const Spinner = () => (
  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
);

export default function NoticeBoard() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // 현재 로그인한 사용자 정보를 가져와서 '새 글 작성' 버튼 표시 여부를 결정합니다.

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        // 백엔드의 /api/notices/ API를 호출합니다.
        const response = await apiClient.get<Notice[]>("/notices/");
        setNotices(response.data);
      } catch (error) {
        console.error("Failed to fetch notices", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []); // 컴포넌트가 처음 렌더링될 때 한 번만 실행합니다.

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">공지사항</h1>
        {/* 교수 또는 관리자일 때만 '새 글 작성' 버튼을 보여줍니다. */}
        {(user?.role === "professor" || user?.role === "admin") && (
          <Link
            to="/notices/new"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            새 글 작성
          </Link>
        )}
      </div>
      {loading ? (
        <div className="flex justify-center p-8">
          <Spinner />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md">
          <ul className="divide-y divide-gray-200">
            {notices.length > 0 ? (
              notices.map((notice) => (
                <li
                  key={notice.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <Link
                    to={`/notices/${notice.id}`}
                    className="font-semibold text-lg text-gray-800 hover:text-blue-600"
                  >
                    {notice.title}
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">
                    작성일: {new Date(notice.createdAt).toLocaleDateString()}
                  </p>
                </li>
              ))
            ) : (
              <p className="p-6 text-center text-gray-500">
                등록된 공지사항이 없습니다.
              </p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
