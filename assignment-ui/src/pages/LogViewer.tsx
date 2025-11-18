import React, { useState, useEffect } from 'react';
import apiClient from '../api/api';

// 백엔드로부터 받아올 로그 데이터의 타입을 정의합니다.
interface ActivityLog {
  id: number;
  actorUsername: string;
  actionType: string;
  details: string;
  createdAt: string;
}

const Spinner = () => <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>;

export default function LogViewer() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // 백엔드의 /api/admin/logs/ API를 호출합니다.
        const response = await apiClient.get<ActivityLog[]>('/admin/logs/');
        setLogs(response.data);
      } catch (error) {
        setError("활동 로그를 불러오는 데 실패했습니다.");
        console.error("Failed to fetch logs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) return <div className="flex justify-center p-8"><Spinner /></div>;
  if (error) return <div className="text-center text-red-600 bg-red-100 p-4 rounded-lg">{error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">시스템 활동 로그</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">시간</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">사용자</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">활동 유형</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상세 내용</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map(log => (
              <tr key={log.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(log.createdAt).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.actorUsername}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {log.actionType}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

