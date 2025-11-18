import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/api';
import { Assignment } from '../types';

const Spinner = () => <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>;

export default function DashboardProfessor() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        // 교수가 로그인하면, views.py의 get_queryset 로직에 따라
        // 자신이 담당하는 과제 목록만 자동으로 불러옵니다.
        const response = await apiClient.get<Assignment[]>('/assignments/');
        setAssignments(response.data);
      } catch (error) {
        console.error("Failed to fetch assignments", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">교수 대시보드</h1>
      <section>
        <h2 className="text-2xl font-semibold mb-4">내 과제 목록</h2>
        {loading ? <div className="flex justify-center p-8"><Spinner /></div> : (
          <div className="bg-white rounded-lg shadow-md">
            <ul className="divide-y divide-gray-200">
              {assignments.map(assignment => (
                <li key={assignment.id} className="p-4 hover:bg-gray-50 transition-colors">
                  {/* 각 과제를 클릭하면 해당 과제의 제출 현황을 보는 채점 페이지로 이동합니다. */}
                  <Link to={`/professor/assignments/${assignment.id}/submissions`} className="font-semibold text-lg text-gray-800 hover:text-blue-600">
                    {assignment.title}
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">마감: {new Date(assignment.dueDate).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}

