from django.urls import path
from .views import (
    RegisterView,
    MeView,
    AssignmentListCreateView,
    AssignmentDetailView,
    AdminDashboardStatsView,
    UserListView,
    UserDetailUpdateView,
    SubmissionCreateView,
    SubmissionUpdateView,
    AssignmentSubmissionsListView,
    SubmissionGradeView,
    MySubmissionsListView,
    NoticeListCreateView,
    NoticeDetailView,
    CourseListCreateView,
    CourseDetailView,
    CourseStudentManagementView,
    NotificationListView,
    MarkNotificationAsReadView,
    ActivityLogListView,
    JoinCourseWithCodeView  # ✅ 새로운 뷰를 import 합니다.
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # --- Auth ---
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', MeView.as_view(), name='me'),

    # --- Professor: Course Management ---
    path('courses/', CourseListCreateView.as_view(), name='course-list-create'),
    path('courses/<int:pk>/', CourseDetailView.as_view(), name='course-detail'),
    path('courses/<int:pk>/students/', CourseStudentManagementView.as_view(), name='course-student-management'),

    # --- Student: Join Course ---
    # ✅ 학생의 '코드로 참여하기' URL을 추가합니다.
    path('courses/join/', JoinCourseWithCodeView.as_view(), name='course-join-with-code'),

    # --- Assignments ---
    path('assignments/', AssignmentListCreateView.as_view(), name='assignment-list-create'),
    path('assignments/<int:pk>/', AssignmentDetailView.as_view(), name='assignment-detail'),

    # --- Submissions ---
    path('assignments/<int:assignment_id>/submit/', SubmissionCreateView.as_view(), name='submission-create'),
    path('assignments/<int:assignment_id>/submissions/', AssignmentSubmissionsListView.as_view(),
         name='assignment-submissions-list'),
    path('submissions/<int:pk>/', SubmissionUpdateView.as_view(), name='submission-update'),
    path('submissions/<int:pk>/grade/', SubmissionGradeView.as_view(), name='submission-grade'),
    path('my-submissions/', MySubmissionsListView.as_view(), name='my-submissions-list'),

    # --- Admin ---
    path('admin/stats/', AdminDashboardStatsView.as_view(), name='admin-stats'),
    path('admin/users/', UserListView.as_view(), name='admin-user-list'),
    path('admin/users/<int:pk>/', UserDetailUpdateView.as_view(), name='admin-user-detail-update'),
    path('admin/logs/', ActivityLogListView.as_view(), name='activity-log-list'),

    # --- Notices ---
    path('notices/', NoticeListCreateView.as_view(), name='notice-list-create'),
    path('notices/<int:pk>/', NoticeDetailView.as_view(), name='notice-detail'),

    # --- Notifications ---
    path('notifications/', NotificationListView.as_view(), name='notification-list'),
    path('notifications/<int:pk>/read/', MarkNotificationAsReadView.as_view(), name='notification-mark-read'),
]

