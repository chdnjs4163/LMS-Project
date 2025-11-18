from django.contrib import admin
from django.urls import path, include
# ✅ 아래 두 줄을 새로 import 합니다.
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),
]

# ✅ 아래 코드를 파일 맨 아래에 추가합니다.
# 개발 모드(DEBUG=True)일 때만 MEDIA_URL로 오는 요청을 MEDIA_ROOT에서 찾아 처리하라는 의미입니다.
# 이렇게 해야 나중에 제출된 파일을 관리자 페이지 등에서 바로 확인할 수 있습니다.
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

