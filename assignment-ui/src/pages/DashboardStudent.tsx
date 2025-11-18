import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/api';
import { Course } from '../types';

const Spinner = () => <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>;

// 학생이 과목에 참여하는 폼 (기존과 동일)
const JoinCourseForm = ({ onCourseJoined }: { onCourseJoined: () => void }) => {
    const [joinCode, setJoinCode] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            await apiClient.post('/courses/join/', { join_code: joinCode });
            alert('과목에 성공적으로 참여했습니다!');
            onCourseJoined();
            setJoinCode('');
        } catch (err: any) {
            setError(err.response?.data?.detail || '참여에 실패했습니다. 코드를 확인해주세요.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">새 과목 참여하기</h3>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
                <input 
                    type="text" 
                    placeholder="참여 코드를 입력하세요"
                    value={joinCode}
                    onChange={e => setJoinCode(e.target.value.toUpperCase())}
                    className="flex-grow p-2 border rounded-md font-mono tracking-widest"
                />
                <button type="submit" disabled={isSubmitting} className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400">
                    {isSubmitting ? '처리 중...' : '참여'}
                </button>
            </form>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </section>
    );
};


export default function DashboardStudent() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const coursesRes = await apiClient.get<Course[]>('/courses/');
        setCourses(coursesRes.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [refreshKey]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">학생 대시보드</h1>
      
      <JoinCourseForm onCourseJoined={() => setRefreshKey(prev => prev + 1)} />

      {loading ? <div className="flex justify-center p-8"><Spinner /></div> : (
        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">내 과목</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              // ✅ 이제 각 과목이 상세 페이지로 가는 링크가 됩니다.
              <Link to={`/student/courses/${course.id}`} key={course.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 block">
                <h3 className="font-bold text-lg text-blue-800">{course.name}</h3>
                <p className="text-sm text-gray-500 mt-1">과목 ID: {course.id}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

