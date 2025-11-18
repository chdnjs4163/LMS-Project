from rest_framework import permissions

# --- 기존 권한 클래스들은 그대로 둡니다 ---
class IsProfessor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'professor'

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'admin'

class IsProfessorOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        return request.user.role in ['professor', 'admin']

class IsProfessorOrAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        return request.user.role in ['professor', 'admin']

class IsOwnerOfSubmission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.student == request.user

# --- ✅ 아래에 '과목 담당 교수'인지 확인하는 권한 클래스를 새로 추가합니다 ---
class IsCourseProfessor(permissions.BasePermission):
    """
    객체 수준 권한으로, 요청을 보낸 사용자가 해당 과목의 담당 교수인지 확인합니다.
    """
    def has_object_permission(self, request, view, obj):
        # obj는 데이터베이스에서 조회한 Course 객체입니다.
        return obj.professor == request.user

