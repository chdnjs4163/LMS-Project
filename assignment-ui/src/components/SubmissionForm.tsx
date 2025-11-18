import React, { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'

type SubmissionFormProps = {
  assignmentId: number
  onSubmit?: (payload: { assignmentId: number; fileName?: string; comment?: string }) => void
}

export default function SubmissionForm({ assignmentId, onSubmit }: SubmissionFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [comment, setComment] = useState<string>('')

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit && onSubmit({ assignmentId, fileName: file?.name, comment })
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl shadow space-y-4">
      <h2 className="text-lg font-bold">과제 제출</h2>
      <div>
        <label className="block text-sm text-gray-600 mb-1">파일</label>
        <input type="file" onChange={handleFileChange} />
        {file && <div className="text-sm mt-2">선택된 파일: {file.name}</div>}
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">설명(선택)</label>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="w-full p-2 border rounded" />
      </div>
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">제출하기</button>
    </form>
  )
}
