from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, permissions, status
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.exceptions import PermissionDenied, ValidationError
from django.db.models import Q
from .models import User, Assignment, Course, Submission, Notice, ActivityLog, Notification
from .serializers import (
    UserRegisterSerializer, UserSerializer, AssignmentSerializer,
    UserAdminUpdateSerializer, SubmissionSerializer, SubmissionGradingSerializer,
    NoticeSerializer, CourseSerializer, NotificationSerializer, ActivityLogSerializer
)
from .permissions import IsProfessor, IsAdmin, IsProfessorOrAdmin, IsOwnerOfSubmission, IsProfessorOrAdminUser, \
    IsCourseProfessor


# --- 1. Authentication and User Views ---
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserRegisterSerializer


class MeView(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


# --- 2. Student-specific Views ---
class SubmissionCreateView(generics.CreateAPIView):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        assignment_id = self.kwargs.get('assignment_id')
        assignment = get_object_or_404(Assignment, pk=assignment_id)
        now = timezone.now()
        is_late = False

        if now > assignment.due_date:
            if not assignment.allow_late:
                raise PermissionDenied("This assignment is past the deadline and does not allow late submissions.")
            is_late = True

        if Submission.objects.filter(student=self.request.user, assignment=assignment).exists():
            raise ValidationError("You have already submitted this assignment. Please use the update functionality.")

        submission = serializer.save(student=self.request.user, assignment=assignment, is_late=is_late)
        ActivityLog.objects.create(
            actor=self.request.user,
            action_type="SUBMITTED_ASSIGNMENT",
            details=f"Assignment '{submission.assignment.title}' was submitted."
        )


class SubmissionUpdateView(generics.UpdateAPIView):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOfSubmission]
    parser_classes = [MultiPartParser, FormParser]

    def perform_update(self, serializer):
        submission = self.get_object()
        assignment = submission.assignment
        now = timezone.now()

        if now > assignment.due_date:
            raise PermissionDenied("You cannot update your submission after the deadline.")

        serializer.save()


class MySubmissionsListView(generics.ListAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Submission.objects.filter(student=self.request.user).order_by('-submitted_at')


class JoinCourseWithCodeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        join_code = request.data.get('join_code')
        if not join_code:
            return Response({"detail": "Join code is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            course = Course.objects.get(join_code=join_code)
            course.students.add(request.user)
            return Response({"detail": f"Successfully joined '{course.name}'."}, status=status.HTTP_200_OK)
        except Course.DoesNotExist:
            return Response({"detail": "Invalid join code."}, status=status.HTTP_404_NOT_FOUND)


# --- 3. Professor-specific Views ---
class AssignmentSubmissionsListView(generics.ListAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated, IsProfessor]

    def get_queryset(self):
        assignment_id = self.kwargs.get('assignment_id')
        assignment = get_object_or_404(Assignment, pk=assignment_id)
        if assignment.course.professor == self.request.user:
            return Submission.objects.filter(assignment=assignment)
        return Submission.objects.none()


class SubmissionGradeView(generics.UpdateAPIView):
    queryset = Submission.objects.all()
    serializer_class = SubmissionGradingSerializer
    permission_classes = [permissions.IsAuthenticated, IsProfessor]

    def perform_update(self, serializer):
        submission = serializer.save()

        Notification.objects.create(
            recipient=submission.student,
            message=f"'{submission.assignment.course.name}' 과목의 '{submission.assignment.title}' 과제에 새로운 피드백이 등록되었습니다."
        )
        ActivityLog.objects.create(
            actor=self.request.user,
            action_type="GRADED_SUBMISSION",
            details=f"Submission for '{submission.assignment.title}' by {submission.student.username} was graded with score {submission.grade}."
        )

    def get_object(self):
        submission = super().get_object()
        if submission.assignment.course.professor == self.request.user:
            return submission
        self.permission_denied(self.request)


class CourseStudentManagementView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsProfessor]

    def post(self, request, pk):
        course = get_object_or_404(Course, pk=pk)
        if course.professor != request.user:
            return Response({"detail": "You do not have permission to manage this course."},
                            status=status.HTTP_403_FORBIDDEN)
        student_ids = request.data.get('student_ids', [])
        students = User.objects.filter(id__in=student_ids, role='student')
        course.students.set(students)
        serializer = CourseSerializer(course, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


# --- 4. Admin-specific Views ---
class AdminDashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def get(self, request, *args, **kwargs):
        stats_data = {
            'totalCourses': Course.objects.count(),
            'totalAssignments': Assignment.objects.count(),
            'totalSubmissions': Submission.objects.filter(file__isnull=False).count(),
            'totalUsers': User.objects.count(),
        }
        return Response(stats_data)


class UserListView(generics.ListAPIView):
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsProfessorOrAdminUser]


class UserDetailUpdateView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def get_serializer_class(self):
        if self.request.method == 'PATCH':
            return UserAdminUpdateSerializer
        return UserSerializer


class ActivityLogListView(generics.ListAPIView):
    queryset = ActivityLog.objects.all()
    serializer_class = ActivityLogSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]


# --- 5. Shared Views (Permissions controlled internally) ---
class CourseListCreateView(generics.ListCreateAPIView):
    serializer_class = CourseSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'professor':
            return Course.objects.filter(professor=user)
        elif user.role == 'student':
            return Course.objects.filter(students=user)
        return Course.objects.none()

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated(), IsProfessor()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(professor=self.request.user)


class CourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CourseSerializer
    queryset = Course.objects.all()

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return Course.objects.filter(Q(professor=user) | Q(students=user)).distinct()
        return Course.objects.none()

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated(), IsCourseProfessor()]
        return [permissions.IsAuthenticated()]


class AssignmentListCreateView(generics.ListCreateAPIView):
    serializer_class = AssignmentSerializer

    def get_queryset(self):
        user = self.request.user
        course_id = self.request.query_params.get('course_id')

        if user.role == 'student':
            queryset = Assignment.objects.filter(course__students=user)
            if course_id:
                return queryset.filter(course_id=course_id)
            return queryset
        elif user.role == 'professor':
            queryset = Assignment.objects.filter(course__professor=user)
            if course_id:
                return queryset.filter(course_id=course_id)
            return queryset
        return Assignment.objects.none()

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated(), IsProfessor()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        course_id = self.request.data.get('course')
        course = get_object_or_404(Course, pk=course_id)
        if course.professor == self.request.user:
            serializer.save(course=course)
        else:
            raise PermissionDenied("You do not have permission to create assignments for this course.")


class AssignmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated(), IsProfessor()]


class NoticeListCreateView(generics.ListCreateAPIView):
    queryset = Notice.objects.all().order_by('-created_at')
    serializer_class = NoticeSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated(), IsProfessorOrAdmin()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class NoticeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Notice.objects.all()
    serializer_class = NoticeSerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated(), IsProfessorOrAdmin()]
        return [permissions.IsAuthenticated()]


class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)


class MarkNotificationAsReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        notification = get_object_or_404(Notification, pk=pk, recipient=request.user)
        notification.is_read = True
        notification.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

