from django.contrib import admin
# ✅ Django의 강력한 사용자 관리 도구인 UserAdmin을 가져옵니다.
from django.contrib.auth.admin import UserAdmin
from .models import User, Course, Assignment, Submission, Notice


# UserAdmin을 상속받아 우리만의 CustomUserAdmin을 만듭니다.
# 이렇게 하면 기존 UserAdmin의 모든 기능(비밀번호 변경 등)을 사용하면서
# 우리가 추가한 'role' 필드도 함께 관리할 수 있습니다.
class CustomUserAdmin(UserAdmin):
    # User 목록 화면에 보여줄 필드 목록에 'role'을 추가합니다.
    list_display = ('username', 'email', 'role', 'is_staff', 'is_active')

    # User 수정 페이지에서 'role' 필드를 편집할 수 있도록 추가합니다.
    # 기존 UserAdmin의 fieldsets 설정에 우리의 'role' 필드를 덧붙이는 방식입니다.
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('role',)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Custom Fields', {'fields': ('role',)}),
    )


# 기존의 간단한 등록 방식은 삭제합니다.
# admin.site.register(User)

# ✅ 이제 User 모델을 등록할 때, 우리가 만든 특별한 CustomUserAdmin을 함께 등록합니다.
admin.site.register(User, CustomUserAdmin)

# 나머지 일반 모델들은 기존 방식대로 등록합니다.
admin.site.register(Course)
admin.site.register(Assignment)
admin.site.register(Submission)
admin.site.register(Notice)

