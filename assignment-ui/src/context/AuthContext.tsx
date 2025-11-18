import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';
import apiClient from '../api/api'; // 1단계에서 만든 API 클라이언트를 가져옵니다.
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  user: User | null;
  loading: boolean; // 로딩 상태 추가
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, email: string, password: string, role: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // 앱 시작 시 인증 상태 확인 중임을 표시

  useEffect(() => {
    // 앱이 처음 로드될 때 토큰을 확인하여 로그인 상태를 복원합니다.
    const token = localStorage.getItem('access_token');
    if (token) {
        // 토큰이 유효한지 확인하기 위해 '내 정보' API를 호출합니다.
        apiClient.get('/auth/me/')
            .then(response => {
                setUser(response.data);
            })
            .catch(() => {
                // 토큰이 유효하지 않으면 로그아웃 처리
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                setUser(null);
            })
            .finally(() => {
                setLoading(false);
            });
    } else {
        setLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    const response = await apiClient.post('/auth/login/', { username, password });
    const { access, refresh } = response.data;
    
    // 토큰을 localStorage에 저장합니다.
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    
    // '내 정보' API를 호출하여 사용자 정보를 가져옵니다.
    const userResponse = await apiClient.get('/auth/me/');
    setUser(userResponse.data);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  };

  const register = async (username: string, email: string, password: string, role: string) => {
    // Django 백엔드의 회원가입 API를 호출합니다.
    await apiClient.post('/auth/register/', {
      username,
      email,
      password,
      password2: password, // 확인용 비밀번호
      role,
    });
  };

  const value = { user, loading, login, logout, register };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

