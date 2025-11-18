import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/api';
import { Notice } from '../types';
import { useAuth } from '../context/AuthContext';

const Spinner = () => <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>;

export default function NoticeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!id) return;
    const fetchNotice = async () => {
      try {
        const response = await apiClient.get<Notice>(`/notices/${id}/`);
        setNotice(response.data);
      } catch (error) {
        console.error("Failed to fetch notice", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotice();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('정말로 이 공지사항을 삭제하시겠습니까?')) {
      try {
        await apiClient.delete(`/notices/${id}/`);
        alert('삭제되었습니다.');
        navigate('/notices');
      } catch (error) {
        alert('삭제에 실패했습니다.');
      }
    }
  };

  if (loading) return <div className="flex justify-center p-8"><Spinner /></div>;
  if (!notice) return <div className="text-center">공지사항을 찾을 수 없습니다.</div>;

  // 작성자이거나 관리자일 경우 수정/삭제 버튼을 보여줄지 결정합니다.
  const canModify = user?.id === notice.author || user?.role === 'admin';

  return (
    <div className="bg-white p-8 rounded-lg shadow-md animate-fade-in">
      <Link to="/notices" className="text-blue-600 hover:underline mb-4 block">&larr; 목록으로</Link>
      <h1 className="text-3xl font-bold mb-2">{notice.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        작성일: {new Date(notice.createdAt).toLocaleString()}
      </p>
      <div className="prose max-w-none text-gray-700 leading-relaxed">
        {/* 백엔드에서 받은 content를 pre-wrap으로 렌더링하여 줄바꿈 등을 유지합니다. */}
        <p style={{ whiteSpace: 'pre-wrap' }}>{notice.content}</p>
      </div>
      {canModify && (
        <div className="mt-8 border-t pt-4 flex gap-2">
          <button onClick={() => alert('수정 기능 구현 예정')} className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors">
            수정
          </button>
          <button onClick={handleDelete} className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
            삭제
          </button>
        </div>
      )}
    </div>
  );
}

