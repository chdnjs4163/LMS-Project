import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/api';
import { Course } from '../types';

const Spinner = () => <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>;

export default function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await apiClient.get<Course[]>('/courses/');
        setCourses(response.data);
      } catch (error) {
        console.error("Failed to fetch courses", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleDelete = async (courseId: number) => {
    if (window.confirm('정말로 이 과목을 삭제하시겠습니까? 관련된 모든 과제와 제출물도 함께 삭제됩니다.')) {
      try {
        await apiClient.delete(`/courses/${courseId}/`);
        setCourses(courses.filter(course => course.id !== courseId));
        alert('과목이 성공적으로 삭제되었습니다.');
      } catch (error) {
        alert('과목 삭제에 실패했습니다.');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">과목 관리</h1>
        <Link to="/professor/courses/new" className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
          새 과목 생성
        </Link>
      </div>
      {loading ? <div className="flex justify-center p-8"><Spinner /></div> : (
        <div className="bg-white rounded-lg shadow-md">
          <ul className="divide-y divide-gray-200">
            {courses.map(course => (
              <li key={course.id} className="p-4 hover:bg-gray-50 flex justify-between items-center">
                <div>
                  <h2 className="font-semibold text-lg text-gray-800">{course.name}</h2>
                  <p className="text-sm text-gray-500">학생 수: {course.students.length}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Link to={`/professor/courses/${course.id}`} className="text-blue-600 hover:underline font-medium">
                    관리하기
                  </Link>
                  <button 
                    onClick={() => handleDelete(course.id)} 
                    className="bg-red-500 text-white text-sm py-1 px-3 rounded-md hover:bg-red-600 transition-colors"
                  >
                    삭제
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

