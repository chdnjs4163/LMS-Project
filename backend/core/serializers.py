from rest_framework import serializers
from .models import User, Course, Assignment, Submission, Notice, Notification, ActivityLog

# --- UserSerializer를 먼저 정의해야 다른 Serializer에서 재사용할 수 있습니다. ---
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']

# ✅ 이 부분이 바로 views.py가 찾고 있던 회원가입 전용 Serializer입니다.
class UserRegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'role']
        extra_kwargs = {'password': {'write_only': True}}
    def save(self):
        user = User(username=self.validated_data['username'], email=self.validated_data['email'], role=self.validated_data['role'])
        password, password2 = self.validated_data['password'], self.validated_data['password2']
        if password != password2:
            raise serializers.ValidationError({"password": "Passwords must match."})
        user.set_password(password)
        user.save()
        return user

class UserAdminUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['role']

class CourseSerializer(serializers.ModelSerializer):
    students = UserSerializer(many=True, read_only=True)
    class Meta:
        model = Course
        fields = ['id', 'name', 'professor', 'students', 'join_code']
        read_only_fields = ['professor', 'students', 'join_code']

class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = ['id', 'course', 'title', 'description', 'due_date', 'allow_late']
        read_only_fields = ['course']

class SubmissionSerializer(serializers.ModelSerializer):
    studentUsername = serializers.CharField(source='student.username', read_only=True)
    assignment_title = serializers.CharField(source='assignment.title', read_only=True)
    file_url = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    class Meta:
        model = Submission
        fields = ['id', 'assignment', 'assignment_title', 'student', 'studentUsername', 'file', 'file_url', 'description', 'submitted_at', 'is_late', 'grade', 'feedback', 'status']
        read_only_fields = ['id', 'assignment', 'assignment_title', 'student', 'studentUsername', 'submitted_at', 'is_late', 'grade', 'feedback', 'file_url', 'status']
        extra_kwargs = { 'file': {'write_only': True} }
    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and hasattr(obj.file, 'url'):
            return request.build_absolute_uri(obj.file.url)
        return None
    def get_status(self, obj):
        if obj.grade is not None:
            return "평가 완료"
        if obj.is_late:
            return "지연 제출"
        if obj.id is not None:
            return "제출 완료"
        return "제출 전"

class SubmissionGradingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = ['grade', 'feedback']

class NoticeSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)
    class Meta:
        model = Notice
        fields = ['id', 'title', 'content', 'created_at', 'author', 'author_username']
        read_only_fields = ['author', 'created_at', 'author_username']

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'message', 'is_read', 'created_at']

class ActivityLogSerializer(serializers.ModelSerializer):
    actor_username = serializers.CharField(source='actor.username', read_only=True)
    class Meta:
        model = ActivityLog
        fields = ['id', 'actor_username', 'action_type', 'details', 'created_at']
