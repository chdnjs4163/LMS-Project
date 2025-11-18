import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api/api';
import { Assignment, Submission } from '../types';

const Spinner = () => <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>;

const DeadlineStatus = ({ assignment }: { assignment: Assignment }) => {
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    const isPastDue = now > dueDate;

    if (!isPastDue) {
        return <span className="px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">진행 중</span>;
    }
    if (assignment.allowLate) {
        return <span className="px-3 py-1 text-sm font-medium text-yellow-800 bg-yellow-100 rounded-full">마감 (지연 제출 가능)</span>;
    }
    return <span className="px-3 py-1 text-sm font-medium text-red-800 bg-red-100 rounded-full">마감 (제출 불가)</span>;
};


export default function AssignmentDetail() {
  const { id } = useParams<{ id: string }>();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // ✅ 학생이 입력하는 설명을 저장할 새로운 state를 추가합니다.
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [assignmentRes, submissionsRes] = await Promise.all([
            apiClient.get<Assignment>(`/assignments/${id}/`),
            apiClient.get<Submission[]>('/my-submissions/')
        ]);
        
        setAssignment(assignmentRes.data);
        const currentSubmission = submissionsRes.data.find(sub => sub.assignment === parseInt(id));
        if (currentSubmission) {
          setSubmission(currentSubmission);
          // ✅ 수정 모드일 때 기존 설명을 불러와 폼에 채워줍니다.
          setDescription(currentSubmission.description || '');
        }
      } catch (err) {
        setError('정보를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile && !submission) { // 새로 제출할 때 파일이 없으면
      alert('제출할 파일을 선택해주세요.');
      return;
    }
    setIsSubmitting(true);
    setSubmitMessage(null);
    
    // FormData는 파일과 텍스트를 함께 보낼 때 사용하는 특별한 객체입니다.
    const formData = new FormData();
    // ✅ 파일과 설명을 함께 FormData에 담습니다.
    if (selectedFile) {
        formData.append('file', selectedFile);
    }
    formData.append('description', description);

    try {
      if (submission) {
        // 수정(재제출) 시에는 PATCH 요청을 보냅니다.
        await apiClient.patch(`/submissions/${submission.id}/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSubmitMessage({ type: 'success', text: '과제가 성공적으로 수정되었습니다!' });
      } else {
        // 새로 제출 시에는 POST 요청을 보냅니다.
        await apiClient.post(`/assignments/${id}/submit/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSubmitMessage({ type: 'success', text: '과제가 성공적으로 제출되었습니다!' });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || '제출에 실패했습니다. 다시 시도해주세요.';
      setSubmitMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <div className="text-center text-red-600 bg-red-100 p-4 rounded-lg">{error}</div>;
  if (!assignment) return <div className="text-center text-gray-500">과제 정보를 찾을 수 없습니다.</div>;

  const isPastDue = new Date() > new Date(assignment.dueDate);
  const canSubmit = !isPastDue || assignment.allowLate;
  const canUpdate = !isPastDue;

  return (
    <div className="w-full bg-white p-8 rounded-xl shadow-lg animate-fade-in">
      <div className="mb-6 pb-4 border-b">
        <Link to="/student" className="text-blue-600 hover:underline mb-4 block">&larr; 대시보드로 돌아가기</Link>
        <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold text-gray-800">{assignment.title}</h1>
            <DeadlineStatus assignment={assignment} />
        </div>
        <p className="text-md text-gray-500 mt-2">마감일: {new Date(assignment.dueDate).toLocaleString()}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">과제 설명</h2>
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap prose max-w-none">
            {assignment.description || '상세 설명이 없습니다.'}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            {submission ? '과제 다시 제출' : '과제 제출'}
          </h2>
          <div className="border p-6 rounded-lg bg-gray-50">
            {submission && (
              <div className='mb-4 p-3 bg-blue-100 rounded-md text-sm text-blue-800'>
                <p><strong>현재 제출된 파일:</strong></p>
                <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">
                  {submission.fileUrl?.split('/').pop()}
                </a>
              </div>
            )}
            { (submission && !canUpdate) || (!submission && !canSubmit) ? (
                <p className="text-center text-red-600 font-semibold p-4 bg-red-50 rounded-md">제출 기간이 아닙니다.</p>
            ) : (
                <>
                    <input type="file" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer" />
                    {/* ✅ 설명 입력창을 추가합니다. */}
                    <textarea 
                      placeholder="교수님께 남길 메시지 (선택)"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className="mt-4 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button onClick={handleSubmit} disabled={isSubmitting} className="mt-4 w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                        {isSubmitting ? '처리 중...' : (submission ? '수정하기' : '제출하기')}
                    </button>
                </>
            )}
            {submitMessage && <p className={`mt-4 text-sm text-center font-medium ${submitMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{submitMessage.text}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

