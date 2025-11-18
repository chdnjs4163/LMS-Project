import React from 'react';
import ReactDOM from 'react-dom/client';
// .tsx 확장자를 제거합니다.
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
// .tsx 확장자를 제거합니다.
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 1. BrowserRouter로 전체 앱을 감싸서 라우팅 기능을 활성화합니다. */}
    <BrowserRouter>
      {/* 2. AuthProvider로 앱을 감싸서 모든 컴포넌트가 로그인 정보에 접근할 수 있게 합니다. */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

