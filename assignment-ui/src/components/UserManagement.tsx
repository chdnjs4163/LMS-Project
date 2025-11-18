import React, { useState, useEffect } from 'react';
import apiClient from '../api/api';
import { User, UserRole } from '../types';

const Spinner = () => <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>;

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<User[]>('/admin/users/');
      setUsers(response.data);
    } catch (err) {
      setError('사용자 목록을 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ 사용자의 역할을 변경하는 함수에 확인 창 로직을 추가했습니다.
  const handleRoleChange = async (userId: number, newRole: UserRole) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    // 1. 사용자에게 변경 여부를 확인받습니다.
    if (window.confirm(`'${user.username}' 사용자의 역할을 '${newRole}'(으)로 변경하시겠습니까?`)) {
      const originalUsers = [...users]; // 롤백을 위해 원래 상태를 저장합니다.
      
      // 2. UI를 먼저 업데이트하여 빠른 반응성을 보여줍니다 (낙관적 업데이트).
      setUsers(users.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));
      
      try {
        // 3. 백엔드에 실제 변경 사항을 PATCH 요청으로 보냅니다.
        await apiClient.patch(`/admin/users/${userId}/`, { role: newRole });
      } catch (error) {
        alert('역할 변경에 실패했습니다.');
        // 4. 만약 실패하면, 원래 상태로 롤백합니다.
        setUsers(originalUsers);
      }
    }
    // 사용자가 '취소'를 누르면 아무 일도 일어나지 않습니다.
  };

  if (loading) return <div className="flex justify-center p-8"><Spinner /></div>;
  if (error) return <div className="text-center text-red-600 bg-red-100 p-4 rounded-lg">{error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">사용자 관리</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                    className="p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="student">Student</option>
                    <option value="professor">Professor</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

