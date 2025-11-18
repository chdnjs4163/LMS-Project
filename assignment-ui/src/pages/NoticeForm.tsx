import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/api';
import { Notice } from '../types';

export default function NoticeForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const isEditing = Boolean(id); // URL에 id가 있으면 수정 모드, 없으면 생성 모드

  // 수정 모드일 경우, 기존 공지사항 데이터를 불러옵니다.
  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      apiClient.get<Notice>(`/notices/${id}/`)
        .then(response => {
          setTitle(response.data.title);
          setContent(response.data.content);
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const noticeData = { title, content };

    try {
      if (isEditing) {
        // 수정 모드일 경우 PATCH 요청으로 데이터를 업데이트합니다.
        await apiClient.patch(`/notices/${id}/`, noticeData);
      } else {
        // 생성 모드일 경우 POST 요청으로 새 데이터를 생성합니다.
        await apiClient.post('/notices/', noticeData);
      }
      navigate('/notices'); // 성공 시 목록 페이지로 이동합니다.
    } catch (error) {
      alert('저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return <div className="flex justify-center p-8">불러오는 중...</div>;
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">{isEditing ? '공지사항 수정' : '새 공지사항 작성'}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-2">제목</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="content" className="block text-lg font-medium text-gray-700 mb-2">내용</label>
          <textarea
            id="content"
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="flex items-center gap-4">
          <button type="submit" disabled={loading} className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
            {loading ? '저장 중...' : '저장하기'}
          </button>
          <Link to="/notices" className="text-gray-600 hover:underline">취소</Link>
        </div>
      </form>
    </div>
  );
}

