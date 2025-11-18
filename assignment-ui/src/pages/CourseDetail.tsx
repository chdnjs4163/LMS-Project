import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api/api';
import { Course, Assignment, User } from '../types';

const Spinner = () => <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>;

// AssignmentEditor와 StudentManagementModal 컴포넌트는 이전과 동일하게 유지됩니다.
const AssignmentEditor = ({ 
  courseId, 
  assignmentToEdit,
  onFinish
}: { 
  courseId: number, 
  assignmentToEdit: Assignment | null,
  onFinish: () => void 
}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [loading, setLoading] = useState(false);
    const isEditing = !!assignmentToEdit;

    useEffect(() => {
        if (isEditing && assignmentToEdit) {
            setTitle(assignmentToEdit.title);
            setDescription(assignmentToEdit.description);
            const localDueDate = new Date(assignmentToEdit.dueDate).toISOString().slice(0, 16);
            setDueDate(localDueDate);
        } else {
            setTitle('');
            setDescription('');
            setDueDate('');
        }
    }, [assignmentToEdit, isEditing]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const assignmentData = {
            title,
            description,
            due_date: new Date(dueDate).toISOString(),
            course: courseId,
        };

        try {
            if (isEditing && assignmentToEdit) {
                await apiClient.patch(`/assignments/${assignmentToEdit.id}/`, assignmentData);
            } else {
                await apiClient.post('/assignments/', assignmentData);
            }
            onFinish();
        } catch (error) {
            alert('저장에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-semibold mb-4">{isEditing ? '과제 수정' : '새 과제 생성'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="과제 제목" value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-2 border rounded" />
                <textarea placeholder="과제 설명" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border rounded" rows={4}></textarea>
                <input type="datetime-local" value={dueDate} onChange={e => setDueDate(e.target.value)} required className="w-full p-2 border rounded" />
                <div className="flex items-center gap-4">
                    <button type="submit" disabled={loading} className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
                        {loading ? '저장 중...' : '저장하기'}
                    </button>
                    {isEditing && <button type="button" onClick={onFinish} className="text-gray-600 hover:underline">취소</button>}
                </div>
            </form>
        </div>
    );
};

const StudentManagementModal = ({ course, allStudents, onClose, onSave }: { course: Course, allStudents: User[], onClose: () => void, onSave: (updatedCourse: Course) => void }) => {
    const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>(() => course.students.map(s => s.id));
    const [isSaving, setIsSaving] = useState(false);

    const handleStudentSelect = (studentId: number) => {
        setSelectedStudentIds(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await apiClient.post<Course>(`/courses/${course.id}/students/`, {
                student_ids: selectedStudentIds
            });
            onSave(response.data);
        } catch (error) {
            alert('학생 정보 저장에 실패했습니다.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-4">'{course.name}' 수강생 관리</h2>
                <p className="text-gray-600 mb-4">과목에 참여할 학생들을 선택하세요.</p>
                <div className="max-h-96 overflow-y-auto border p-4 rounded-md">
                    {allStudents.map(student => (
                        <div key={student.id} className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md">
                            <label htmlFor={`student-${student.id}`} className="flex items-center cursor-pointer w-full">
                                <input
                                    type="checkbox"
                                    id={`student-${student.id}`}
                                    checked={selectedStudentIds.includes(student.id)}
                                    onChange={() => handleStudentSelect(student.id)}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-3 text-gray-700">{student.username} ({student.email})</span>
                            </label>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <button onClick={onClose} className="py-2 px-4 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">취소</button>
                    <button onClick={handleSave} disabled={isSaving} className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400">
                        {isSaving ? '저장 중...' : '저장하기'}
                    </button>
                </div>
            </div>
        </div>
    );
};


export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [allStudents, setAllStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [isStudentModalOpen, setStudentModalOpen] = useState(false);

  // --- 기존 함수들은 그대로 둡니다 ---
  const fetchAssignments = async (courseId: string) => {
    const assignmentsRes = await apiClient.get<Assignment[]>(`/assignments/?course_id=${courseId}`);
    setAssignments(assignmentsRes.data);
  };

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const [courseRes, allStudentsRes] = await Promise.all([
            apiClient.get<Course>(`/courses/${id}/`),
            apiClient.get<User[]>('/admin/users/')
        ]);
        
        setCourse(courseRes.data);
        setAllStudents(allStudentsRes.data.filter(u => u.role === 'student'));
        await fetchAssignments(id);

      } catch (error) {
        console.error("Failed to fetch course details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleFormFinish = async () => {
    if (id) {
        await fetchAssignments(id);
    }
    setEditingAssignment(null);
  };

  const handleDeleteAssignment = async (assignmentId: number) => {
    if (window.confirm('정말로 이 과제를 삭제하시겠습니까?')) {
        try {
            await apiClient.delete(`/assignments/${assignmentId}/`);
            setAssignments(assignments.filter(a => a.id !== assignmentId));
            alert('과제가 삭제되었습니다.');
        } catch (error) {
            alert('과제 삭제에 실패했습니다.');
        }
    }
  };
    
  const handleStudentSave = (updatedCourse: Course) => {
    setCourse(updatedCourse);
    setStudentModalOpen(false);
  };


  if (loading) return <div className="flex justify-center p-8"><Spinner/></div>;
  if (!course) return <div>과목을 찾을 수 없습니다.</div>;

  return (
    <div>
      <Link to="/professor/courses" className="text-blue-600 hover:underline mb-4 block">&larr; 전체 과목 목록으로</Link>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{course.name}</h1>
        <Link to={`/professor/courses/${id}/edit`} className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600">
            과목 정보 수정
        </Link>
      </div>
      
      {/* ✅ 과목 헤더에 참여 코드를 표시하는 부분을 추가합니다. */}
      <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg mb-6">
        <h3 className="font-bold">과목 참여 코드</h3>
        <p className="text-2xl font-mono mt-2 tracking-widest">{course.joinCode}</p>
        <p className="text-sm mt-1">학생들에게 이 코드를 공유하여 과목에 참여하도록 안내하세요.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">과제 관리</h2>
                <ul className="divide-y divide-gray-200">
                    {assignments.map(assignment => (
                    <li key={assignment.id} className="py-3 flex justify-between items-center">
                        <p className="font-medium text-gray-800">{assignment.title}</p>
                        <div className="flex items-center gap-4">
                            <Link to={`/professor/assignments/${assignment.id}/submissions`} className="text-sm text-blue-600 hover:underline">제출 현황</Link>
                            <button onClick={() => setEditingAssignment(assignment)} className="text-sm text-yellow-600 hover:underline">수정</button>
                            <button onClick={() => handleDeleteAssignment(assignment.id)} className="text-sm text-red-600 hover:underline">삭제</button>
                        </div>
                    </li>
                    ))}
                </ul>
            </div>
            <AssignmentEditor 
                courseId={course.id} 
                assignmentToEdit={editingAssignment} 
                onFinish={handleFormFinish} 
            />
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">수강 학생 목록</h2>
            <button onClick={() => setStudentModalOpen(true)} className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600">
                학생 관리
            </button>
          </div>
          <ul className="divide-y divide-gray-200">
            {course.students.map(student => (
              <li key={student.id} className="py-3">
                <p className="font-medium text-gray-800">{student.username}</p>
                <p className="text-sm text-gray-500">{student.email}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {isStudentModalOpen && (
        <StudentManagementModal 
            course={course}
            allStudents={allStudents}
            onClose={() => setStudentModalOpen(false)}
            onSave={handleStudentSave}
        />
      )}
    </div>
  );
}

