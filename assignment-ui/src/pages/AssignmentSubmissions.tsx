import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api/api';
import { Submission } from '../types';
import StatusBadge from '../components/StatusBadge';

const Spinner = () => <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>;

export default function AssignmentSubmissions() {
  const { id } = useParams<{ id: string }>();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchSubmissions = async () => {
      try {
        const response = await apiClient.get<Submission[]>(`/assignments/${id}/submissions/`);
        setSubmissions(response.data);
      } catch (error) {
        console.error("Failed to fetch submissions", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [id]);

  const handleGradeChange = (submissionId: number, grade: number) => {
    setSubmissions(submissions.map(s => s.id === submissionId ? { ...s, grade } : s));
  };

  const handleFeedbackChange = (submissionId: number, feedback: string) => {
     setSubmissions(submissions.map(s => s.id === submissionId ? { ...s, feedback } : s));
  };

  const handleSaveGrade = async (submissionId: number) => {
    const submission = submissions.find(s => s.id === submissionId);
    if (!submission) return;

    try {
      await apiClient.patch(`/submissions/${submissionId}/grade/`, {
        grade: submission.grade,
        feedback: submission.feedback
      });
      alert("채점이 저장되었습니다.");
    } catch (error) {
      alert("채점 저장에 실패했습니다.");
    }
  };

  return (
    <div>
      <Link to="/professor" className="text-blue-600 hover:underline mb-4 block">&larr; 대시보드로 돌아가기</Link>
      <h1 className="text-3xl font-bold mb-6">과제 제출 현황</h1>
      {loading ? <div className="flex justify-center p-8"><Spinner /></div> : (
        <div className="space-y-4">
          {submissions.map(submission => (
            <div key={submission.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                <div className="font-semibold md:col-span-1">
                  <p>{submission.studentUsername}</p>
                </div>
                <div className="md:col-span-1">
                  <StatusBadge status={submission.status} />
                </div>
                <div className="md:col-span-1">
                  <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                    제출 파일 보기
                  </a>
                </div>
                <div className="flex items-center gap-2 md:col-span-1">
                   <input 
                      type="number"
                      placeholder="점수"
                      value={submission.grade ?? ''}
                      onChange={(e) => handleGradeChange(submission.id, parseInt(e.target.value) || 0)}
                      className="p-2 border rounded-md w-24"
                   />
                   <input
                      type="text"
                      placeholder="피드백"
                      value={submission.feedback ?? ''}
                      onChange={(e) => handleFeedbackChange(submission.id, e.target.value)}
                      className="p-2 border rounded-md flex-1"
                   />
                </div>
                <button 
                  onClick={() => handleSaveGrade(submission.id)} 
                  className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors justify-self-start md:col-span-1 md:justify-self-end"
                >
                  채점 저장
                </button>
              </div>
              {/* ✅ 학생이 남긴 설명이 있을 경우, 이 부분을 보여줍니다. */}
              {submission.description && (
                <div className="mt-4 border-t pt-4">
                  <h4 className="text-md font-semibold text-gray-700">학생이 남긴 말</h4>
                  <p className="text-gray-600 mt-2 p-3 bg-gray-50 rounded-md whitespace-pre-wrap">
                    {submission.description}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

