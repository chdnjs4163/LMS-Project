import React, { useState, useEffect } from 'react';
import apiClient from '../api/api';
import { Submission } from '../types';

const Spinner = () => <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>;

export default function MySubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await apiClient.get<Submission[]>('/my-submissions/');
        setSubmissions(response.data);
      } catch (error) {
        console.error("Failed to fetch submissions", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">내 제출 현황 및 성적</h1>
      {loading ? <div className="flex justify-center p-8"><Spinner /></div> : (
        <div className="space-y-6">
          {submissions.length > 0 ? submissions.map(submission => (
            <div key={submission.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{submission.assignmentTitle}</h2>
                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-sm text-gray-500">
                      제출일: {submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : '미제출'}
                    </p>
                    {/* ✅ isLate가 true일 경우 '지연 제출' 배지를 보여줍니다. */}
                    {submission.isLate && (
                        <span className="px-2 py-0.5 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">지연 제출</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">점수</p>
                  <p className={`text-3xl font-bold ${submission.grade ? 'text-blue-600' : 'text-gray-400'}`}>
                    {submission.grade ?? 'N/A'}
                  </p>
                </div>
              </div>
              {submission.feedback && (
                <div className="mt-4 border-t pt-4">
                  <h3 className="text-md font-semibold text-gray-700">교수님 피드백</h3>
                  <p className="text-gray-600 mt-2 p-3 bg-gray-50 rounded-md whitespace-pre-wrap">
                    {submission.feedback}
                  </p>
                </div>
              )}
            </div>
          )) : (
            <p className="text-center text-gray-500 bg-white p-8 rounded-lg shadow-md">제출한 과제가 없습니다.</p>
          )}
        </div>
      )}
    </div>
  );
}

