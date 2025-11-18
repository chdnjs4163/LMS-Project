from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from core.models import Assignment, Notification, Submission


class Command(BaseCommand):
    help = 'Finds assignments with deadlines in the next 24 hours and sends notifications to students who have not submitted.'

    def handle(self, *args, **options):
        now = timezone.now()
        # 마감일이 지금으로부터 24시간 후 ~ 25시간 후 사이인 과제들을 찾습니다.
        # (매시간 실행될 것을 가정하여 중복 알림을 피하기 위함)
        upcoming_deadline = now + timedelta(days=1)

        assignments = Assignment.objects.filter(
            due_date__gt=now,
            due_date__lte=upcoming_deadline
        )

        notification_count = 0
        for assignment in assignments:
            # 이 과제를 수강하는 모든 학생을 가져옵니다.
            students = assignment.course.students.all()

            # 이 과제에 이미 제출한 학생들의 ID 목록을 가져옵니다.
            submitted_student_ids = Submission.objects.filter(assignment=assignment).values_list('student_id',
                                                                                                 flat=True)

            for student in students:
                # 아직 과제를 제출하지 않은 학생에게만 알림을 보냅니다.
                if student.id not in submitted_student_ids:
                    # 중복 알림을 방지하기 위해, 이미 같은 알림이 있는지 확인합니다.
                    message = f"마감 임박: '{assignment.title}' 과제 마감이 24시간 남았습니다."
                    if not Notification.objects.filter(recipient=student, message=message).exists():
                        Notification.objects.create(
                            recipient=student,
                            message=message
                        )
                        notification_count += 1

        # 터미널에 성공 메시지를 출력합니다.
        self.stdout.write(
            self.style.SUCCESS(f'Successfully sent {notification_count} deadline reminder notifications.'))




