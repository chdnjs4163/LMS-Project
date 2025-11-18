📚 역할 기반 LMS 과제 제출 시스템 (Full-Stack)

React(TypeScript)와 Django(DRF)를 기반으로 학생, 교수, 관리자 3가지 역할에 따라 동적 UI와 API 권한이 제어되는 Full-Stack 과제 관리 웹 애플리케이션입니다.

🖥️ 실행 화면 (Screenshot)

<img width="517" height="268" alt="image" src="https://github.com/user-attachments/assets/be93e2f6-834c-4551-a75d-e7c8af0cfd82" />

<아키 텍처>
<img width="287" height="680" alt="image" src="https://github.com/user-attachments/assets/f0e5e0ac-a2f0-41b4-a2e6-7496958d538b" />

✨ 주요 기능

👨‍🎓 학생 (Student)

과목 참여: 교수님이 공유한 참여 코드를 입력하여 과목에 셀프로 수강 신청합니다.

대시보드: 수강 중인 과목 목록을 한눈에 확인하고, 클릭하여 과제 목록을 봅니다.

과제 제출: 마감일 시스템(정상/지연/차단)이 적용된 페이지에서 파일과 설명을 제출합니다.

과제 수정: 마감일 전까지 제출한 과제와 설명을 수정(재제출)할 수 있습니다.

성적 확인: "내 성적" 페이지에서 교수님이 채점한 점수와 피드백을 확인합니다.

알림: 헤더의 알림 벨을 통해 교수님의 피드백 등록, 마감 임박 알림을 실시간으로 확인합니다.

👨‍🏫 교수 (Professor)

과목 관리: 과목 생성, 수정, 삭제(CRUD)가 가능하며, 학생 초대를 위한 참여 코드를 확인합니다.

학생 관리: 과목 상세 페이지의 팝업(Modal) UI를 통해 수강생을 직접 추가/제외합니다.

과제 관리: 과목 상세 페이지 내에서 직접 과제를 생성, 수정, 삭제(CRUD)합니다.

채점 시스템: 과제별 제출 현황(정상/지연)을 확인하고, 학생이 제출한 파일과 설명을 보며 점수와 피드백을 입력/저장합니다.

👨‍💼 관리자 (Admin)

통계 대시보드: 전체 사용자, 과목, 과제, 제출물 현황을 실시간으로 모니터링합니다.

사용자 관리: 전체 사용자 목록을 조회하고, 드롭다운 메뉴를 통해 사용자의 역할(학생/교수/관리자)을 즉시 변경할 수 있습니다.

로그 관리: 시스템의 주요 활동(과제 제출, 채점 등) 기록을 실시간으로 조회합니다.

⚙️ 기술 스택 (Tech Stack)

🖥️ Frontend

React (v18+)

TypeScript

Vite

React Router (v6)

Axios (API Interceptor)

Tailwind CSS

React Context API (전역 인증 상태 관리)

⚙️ Backend

Python 3

Django

Django REST Framework (DRF)

MySQL (Database)

djangorestframework-simplejwt (JWT 인증)

django-cors-headers (CORS 보안)

djangorestframework-camel-case (JSON 형식 변환)

🚀 설치 및 실행 방법

이 프로젝트는 Frontend와 Backend 두 개의 서버를 동시에 실행해야 합니다.

# 1. 백엔드 (Backend)

* /backend 폴더로 이동
cd backend

# 2. 파이썬 가상환경 생성 및 활성화
* python -m venv .venv
* source .venv/Scripts/activate  (Windows: .venv\Scripts\activate)

# 3. 필요 라이브러리 설치
* (가상환경에 미리 requirements.txt를 생성해두는 것이 좋습니다: pip freeze > requirements.txt)
pip install django djangorestframework mysqlclient djangorestframework-simplejwt django-cors-headers djangorestframework-camel-case pymysql

# 4. 데이터베이스 설정
* (MySQL 서버가 실행 중이어야 하며, lms_db 데이터베이스와 lms_user 계정이 미리 생성되어 있어야 함)
* backend/settings.py 파일의 DATABASES 설정을 본인의 DB 정보로 수정합니다.

# 5. 데이터베이스 마이그레이션
python manage.py makemigrations
python manage.py migrate

# 6. (필수) 최고 관리자 계정 생성
python manage.py createsuperuser

# 7. 네트워크 모드로 서버 실행 (포트폴리오 시연용)
python manage.py runserver 0.0.0.0:8000


# 2. 프론트엔드 (Frontend)

# 1. /frontend 폴더로 이동 (프로젝트 이름이 assignment-ui인 경우)
cd frontend
# 2. 의존성 패키지 설치
npm install

# 3. (필수) API 주소 설정
** src/api/api.ts 파일의 baseURL을 백엔드 IP로 수정합니다.
** 예: baseURL: '[http://192.168.24.182:8000/api](http://192.168.24.182:8000/api)'

# 4. package.json 스크립트 수정 (권장)
** package.json 파일의 "scripts" 섹션을 다음과 같이 수정합니다.
** "dev": "vite --host --port 8080"

# 5. 네트워크 모드로 서버 실행 (포트폴리오 시연용)
npm run dev

 # 6. 브라우저에서 http://[내-PC-IP]:8080 으로 접속


💡 향후 개선 사항

학생 인증 강화: User 모델에 student_id(학번) 필드를 추가하여, 회원가입 시 학번을 이용한 중복 검증 및 인증 절차를 도입할 계획입니다.

보안 고도화: 현재 localStorage에 저장하는 JWT 토큰 방식을, Refresh Token을 사용하고 HttpOnly 쿠키에 토큰을 저장하는 방식으로 변경하여 XSS 공격으로부터 보안을 강화할 것입니다.

실제 서비스 배포: 로컬 네트워크 배포를 넘어, 프론트엔드(Vercel), 백엔드(Render), 데이터베이스(AWS RDS)를 각각 클라우드 서비스에 배포하여 실제 인터넷 환경에서 누구나 접속할 수 있는 서비스로 완성할 계획입니다.
