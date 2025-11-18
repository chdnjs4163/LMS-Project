import React, { useState, useEffect } from 'react';
import apiClient from '../api/api';
import UserManagement from '../components/UserManagement'; // ✅ 1. 새로 만든 컴포-넌트를 import 합니다.

// 통계 데이터의 타입
interface DashboardStats {
  totalCourses: number;
  totalAssignments: number;
  totalSubmissions: number;
  totalUsers: number;
}

const Spinner = () => <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>;

export default function DashboardAdmin() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get<DashboardStats>('/admin/stats/');
        setStats(response.data);
      } catch (err) {
        setError('대시보드 데이터를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading && !stats) return <div className="flex justify-center p-8"><Spinner /></div>;
  if (error && !stats) return <div className="text-center text-red-600 bg-red-100 p-4 rounded-lg">{error}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">관리자 대시보드</h1>

      {/* 요약 카드 */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="p-6 bg-white rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold text-gray-600">총 사용자</h3>
          <p className="text-4xl font-bold text-blue-600 mt-2">{stats?.totalUsers ?? '...'}</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold text-gray-600">총 과목</h3>
          <p className="text-4xl font-bold text-indigo-600 mt-2">{stats?.totalCourses ?? '...'}</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold text-gray-600">총 과제</h3>
          <p className="text-4xl font-bold text-green-600 mt-2">{stats?.totalAssignments ?? '...'}</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold text-gray-600">총 제출 수</h3>
          <p className="text-4xl font-bold text-purple-600 mt-2">{stats?.totalSubmissions ?? '...'}</p>
        </div>
      </section>

      {/* ✅ 2. 기존 placeholder 대신 UserManagement 컴포넌트를 여기에 배치합니다. */}
      <section>
        <UserManagement />
      </section>
    </div>
  );
}

