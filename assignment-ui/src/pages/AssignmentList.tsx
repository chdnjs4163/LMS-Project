import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/api';
import { Assignment } from '../types';

const Spinner = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

export default function AssignmentList() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<Assignment[]>('/assignments/');
        setAssignments(response.data);
      } catch (err) {
        setError('과제 목록을 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <div className="text-center text-red-600 bg-red-100 p-4 rounded-lg">{error}</div>;
  
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">전체 과제 목록</h1>
        <p className="text-lg text-gray-600">수강 중인 과목의 모든 과제를 확인하세요.</p>
      </div>

      <section>
        <div className="bg-white rounded-xl shadow-lg">
          {assignments.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {assignments.map((assignment) => (
                <li key={assignment.id} className="p-5 flex justify-between items-center hover:bg-gray-50 transition-colors">
                  <div>
                    <Link to={`/student/assignments/${assignment.id}`} className="font-semibold text-lg text-gray-800 hover:text-blue-600">
                      {assignment.title}
                    </Link>
                    <p className="text-md text-gray-500 mt-1">
                      마감일: {new Date(assignment.dueDate).toLocaleString()}
                    </p>
                  </div>
                  {/* 나중에 제출 여부 상태를 표시할 수 있습니다. */}
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-6 text-center text-gray-500">진행 중인 과제가 없습니다.</p>
          )}
        </div>
      </section>
    </div>
  );
}
