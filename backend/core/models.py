from django.contrib.auth.models import AbstractUser
from django.db import models
import secrets # ✅ 참여 코드를 생성하기 위해 import 합니다.

# ✅ 참여 코드를 생성하는 함수
def generate_join_code():
    return secrets.token_urlsafe(8).upper() # 예: 'ABC123XYZ'


# --- ✅ 1. User 모델을 다른 모델보다 먼저 정의합니다 ---
class User(AbstractUser):
    ROLE_CHOICES = (
        ("student", "Student"),
        ("professor", "Professor"),
        ("admin", "Admin"),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')


# --- 2. 이제 다른 모델들이 User를 안전하게 참조할 수 있습니다 ---
class Course(models.Model):
    name = models.CharField(max_length=100)
    professor = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={"role": "professor"})
    students = models.ManyToManyField(User, related_name="courses", limit_choices_to={"role": "student"})
    # ✅ default 설정을 제거하고, save 메서드에서 코드를 생성하도록 변경합니다.
    join_code = models.CharField(max_length=16, unique=True, null=True, blank=True)

    def __str__(self):
        return self.name

    # ✅ save 메서드를 오버라이드하여, 새 과목이 저장될 때만 참여 코드를 생성합니다.
    def save(self, *args, **kwargs):
        if not self.join_code:
            self.join_code = generate_join_code()
        super().save(*args, **kwargs)


class Assignment(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="assignments")
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    due_date = models.DateTimeField()
    allow_late = models.BooleanField(default=False)
    def __str__(self): return f"{self.course.name} - {self.title}"

class Submission(models.Model):
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name="submissions")
    student = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={"role": "student"})
    file = models.FileField(upload_to="submissions/%Y/%m/%d/")
    description = models.TextField(blank=True, help_text="학생이 제출 시 작성하는 설명입니다.")
    submitted_at = models.DateTimeField(auto_now_add=True)
    is_late = models.BooleanField(default=False)
    is_final = models.BooleanField(default=True)
    grade = models.IntegerField(null=True, blank=True)
    feedback = models.TextField(blank=True)
    def __str__(self): return f"{self.student.username} - {self.assignment.title}"

class Notice(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    def __str__(self): return self.title

class Notification(models.Model):
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    message = models.CharField(max_length=255)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ['-created_at']
    def __str__(self): return f"Notification for {self.recipient.username}"

class ActivityLog(models.Model):
    actor = models.ForeignKey(User, on_delete=models.CASCADE, related_name="actions")
    action_type = models.CharField(max_length=100)
    details = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ['-created_at']
    def __str__(self): return f"{self.actor.username} - {self.action_type}"

