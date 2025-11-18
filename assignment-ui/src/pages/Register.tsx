import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  // Django 모델에 맞게 name 대신 username을 사용합니다.
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      // AuthContext의 실제 API를 호출하는 register 함수를 사용합니다.
      await register(username, email, password, role);
      alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
      navigate("/login");
    } catch (err) {
      setError("회원가입에 실패했습니다. 이미 사용 중인 아이디 또는 이메일일 수 있습니다.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">📘 LMS 회원가입</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">사용자 이름</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">역할 선택</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="student">학생</option>
              <option value="professor">교수</option>
              <option value="admin">관리자</option>
            </select>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-md"
            >
              회원가입
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600">
          계정이 이미 있으신가요?{" "}
          <Link to="/login" className="font-medium text-blue-600 hover:underline">
            로그인하기
          </Link>
        </p>
      </div>
    </div>
  );
}