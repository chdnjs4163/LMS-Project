import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/api';
import { Course } from '../types';

export default function CourseForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const isEditing = Boolean(id); // URL에 id가 있으면 수정 모드

  // 수정 모드일 경우, 기존 과목 데이터를 불러옵니다.
  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      apiClient.get<Course>(`/courses/${id}/`)
        .then(response => setName(response.data.name))
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const courseData = { name };

    try {
      if (isEditing) {
        // 수정 모드일 경우 PUT 요청으로 데이터를 전체 업데이트합니다.
        await apiClient.put(`/courses/${id}/`, courseData);
      } else {
        // 생성 모드일 경우 POST 요청으로 새 데이터를 생성합니다.
        await apiClient.post('/courses/', courseData);
      }
      navigate('/professor/courses'); // 성공 시 과목 관리 페이지로 이동합니다.
    } catch (error) {
      alert('저장에 실패했습니다.');
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return <div className="flex justify-center p-8">불러오는 중...</div>;
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{isEditing ? '과목 수정' : '새 과목 생성'}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2">과목 이름</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="flex items-center gap-4 mt-6">
          <button type="submit" disabled={loading} className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
            {loading ? '저장 중...' : '저장하기'}
          </button>
          <Link to="/professor/courses" className="text-gray-600 hover:underline">취소</Link>
        </div>
      </form>
    </div>
  );
}

