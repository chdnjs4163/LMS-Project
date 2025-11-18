import React, { useState, useEffect } from 'react';
import apiClient from '../api/api';
import { Notification } from '../types';

// 벨 아이콘 SVG
const BellIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 팝업이 열릴 때만 알림을 가져옵니다.
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      const response = await apiClient.get<Notification[]>('/notifications/');
      setNotifications(response.data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      await apiClient.post(`/notifications/${notificationId}/read/`);
      // UI에서 즉시 '읽음' 상태로 변경
      setNotifications(
        notifications.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };
  
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="relative text-gray-600 hover:text-gray-800 focus:outline-none">
        <BellIcon />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-20">
          <div className="p-4 font-bold border-b">알림</div>
          <ul className="divide-y max-h-96 overflow-y-auto">
            {notifications.length > 0 ? notifications.map(notification => (
              <li key={notification.id} className={`p-4 text-sm ${!notification.isRead ? 'bg-blue-50' : ''}`}>
                <p className="text-gray-700">{notification.message}</p>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500">{new Date(notification.createdAt).toLocaleString()}</p>
                  {!notification.isRead && (
                    <button onClick={() => markAsRead(notification.id)} className="text-xs text-blue-600 hover:underline">
                      읽음으로 표시
                    </button>
                  )}
                </div>
              </li>
            )) : (
              <li className="p-4 text-center text-gray-500">새로운 알림이 없습니다.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
