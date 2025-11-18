import React from 'react'
import type { Course } from '../types'

type Props = {
  course: Course
}

export default function CourseCard({ course }: Props) {
  return (
    <div className="p-4 bg-white rounded-2xl shadow hover:shadow-lg transition cursor-pointer">
      <h3 className="text-lg font-semibold">{course.name}</h3>
      <p className="text-sm text-gray-500 mt-1">과목 ID: {course.id}</p>
    </div>
  )
}
