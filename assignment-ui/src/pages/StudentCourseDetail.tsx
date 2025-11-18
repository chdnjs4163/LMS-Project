import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api/api';
import { Course, Assignment, Submission } from '../types';
import StatusBadge from '../components/StatusBadge';

const Spinner = () => <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>;

export default function StudentCourseDetail() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const [courseRes, assignmentsRes, submissionsRes] = await Promise.all([
          apiClient.get<Course>(`/courses/${id}/`),
          apiClient.get<Assignment[]>(`/assignments/?course_id=${id}`),
          apiClient.get<Submission[]>('/my-submissions/')
        ]);
        setCourse(courseRes.data);
        setAssignments(assignmentsRes.data);
        setSubmissions(submissionsRes.data);
      } catch (error) {
        console.error("Failed to fetch course details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const getSubmissionStatus = (assignmentId: number): Submission['status'] => {
    const submission = submissions.find(s => s.assignment === assignmentId);
    return submission ? submission.status : "제출 전";
  };

  if (loading) return <div className="flex justify-center p-8"><Spinner/></div>;
  if (!course) return <div>과목을 찾을 수 없습니다.</div>;

  return (
    <div>
      <Link to="/student" className="text-blue-600 hover:underline mb-4 block">&larr; 대시보드로 돌아가기</Link>
      <h1 className="text-3xl font-bold mb-6">{course.name} 과제 목록</h1>
      
      <div className="bg-white rounded-lg shadow-md">
        <ul className="divide-y divide-gray-200">
          {assignments.length > 0 ? assignments.map(assignment => (
            <li key={assignment.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
              <div>
                <Link to={`/student/assignments/${assignment.id}`} className="font-semibold text-lg text-gray-800 hover:text-blue-600">
                  {assignment.title}
                </Link>
                <p className="text-sm text-gray-500 mt-1">마감: {new Date(assignment.dueDate).toLocaleString()}</p>
              </div>
              <StatusBadge status={getSubmissionStatus(assignment.id)} />
            </li>
          )) : (
            <p className="p-6 text-center text-gray-500">이 과목에는 아직 등록된 과제가 없습니다.</p>
          )}
        </ul>
      </div>
    </div>
  );
}

