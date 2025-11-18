import React from 'react'
import { Link } from 'react-router-dom'
import type { Assignment } from '../types'

type Props = {
  assignment: Assignment
  status: '제출 완료' | '지연 제출' | '미제출' | string
}

export default function AssignmentCard({ assignment, status }: Props) {
  const statusStyle: Record<string, string> = {
    '제출 완료': 'bg-green-100 text-green-800',
    '지연 제출': 'bg-yellow-100 text-yellow-800',
    '미제출': 'bg-red-100 text-red-800',
  }

  return (
    <Link to={`/assignment/${assignment.id}`} className="block">
      <div className="p-4 rounded-2xl shadow bg-white hover:shadow-lg transition">
        <h3 className="text-lg font-semibold">{assignment.title}</h3>
        <p className="text-sm text-gray-500">마감일: {assignment.dueDate}</p>
        <div
          className={`mt-3 inline-block px-3 py-1 rounded-full text-sm ${
            statusStyle[status] || 'bg-gray-100'
          }`}
        >
          {status || '미확인'}
        </div>
      </div>
    </Link>
  )
}