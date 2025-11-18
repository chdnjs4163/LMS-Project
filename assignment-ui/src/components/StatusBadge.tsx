import React from 'react';
import { SubmissionStatus } from '../types';

// 각 상태에 맞는 색상 스타일을 정의합니다.
const statusStyles: { [key in SubmissionStatus]: string } = {
  "제출 전": "bg-gray-100 text-gray-800",
  "제출 완료": "bg-green-100 text-green-800",
  "지연 제출": "bg-yellow-100 text-yellow-800",
  "평가 완료": "bg-blue-100 text-blue-800",
};

export default function StatusBadge({ status }: { status: SubmissionStatus }) {
  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusStyles[status] || statusStyles['제출 전']}`}>
      {status}
    </span>
  );
}
