역할 기반 LMS 과제 제출 시스템 (Full-Stack)

React(TypeScript)와 Django(DRF)를 기반으로 학생, 교수, 관리자 3-Role 시스템을 구현한 Full-Stack SPA 프로젝트입니다.

시연 영상 링크 (→ 여기에 프로젝트 핵심 기능을 시연하는 1분짜리 GIF나 영상을 넣어주세요)

배포 주소: (예: http://192.168.24.182:8080)

개발 기간: 2025.09.01 ~ 2025.09.26 (4주)

개발 인원: 1인 개발 (Full-Stack)

📌 1. 기술 스택 (Tech Stack)

Frontend: React (TypeScript), Vite, React Router, Axios, Tailwind CSS, Context API

Backend: Python, Django, Django REST Framework (DRF), Simple JWT

Database: MySQL

Tools: Postman, Git, MySQL Workbench

📌 2. 아키텍처 구조

이 프로젝트는 프론트엔드(React)와 백엔드(Django)가 명확히 분리된 SPA(Single Page Application) 아키텍처를 기반으로 하며, 모든 통신은 JWT 토큰으로 인증된 REST API를 통해 이루어집니다.

graph TD
    subgraph "Frontend (Client Layer)"
        direction LR
        FE[<b>React (Vite) @ 8080</b><br>UI/UX 렌더링]
        FE_ROUTER[React Router<br>동적/보호 라우팅]
        FE_STATE[AuthContext<br>전역 상태 관리]
        FE_API[Axios Client<br>API 통신 (JWT 자동 주입)]
        
        FE -- 렌더링 --> FE_ROUTER -- UI 제공 --> FE_STATE -- 데이터 요청 --> FE_API
    end

    subgraph "Backend (Server Layer)"
        direction TB
        BE[<b>Django (DRF) @ 8000</b><br>API 서버]
        BE_URL[urls.py<br>API 경로 관리]
        BE_SEC[<b>보안 계층</b><br>JWT 인증 (SimpleJWT)<br>CORS / CSRF 방어<br>Custom Permissions]
        BE_LOGIC[<b>로직 계층</b><br>Views (핵심 로직)<br>Serializers (데이터 변환)]
        BE_DATA[<b>데이터 계층</b><br>Models (ORM)]
        
        BE --> BE_URL --> BE_SEC --> BE_LOGIC --> BE_DATA
    end
    
    subgraph "Database Layer"
        DB[(<img src="[https://img.icons8.com/color/48/mysql-logo.png](https://img.icons8.com/color/48/mysql-logo.png)" width="30" /><br>MySQL DB<br>lms_db)]
        FS[(<img src="[https://img.icons8.com/ios-filled/50/folder-invoices.png](https://img.icons8.com/ios-filled/50/folder-invoices.png)" width="30" /><br>File Storage<br>media/ 폴더)]
    end

    %% Define Flows
    FE_API -- "1. API 요청 (JSON + JWT Token)" --> BE
    BE_DATA -- "2. 데이터 조회/저장 (SQL)" --> DB
    BE_DATA -- "3. 파일 저장/조회" --> FS
    BE -- "4. API 응답 (JSON)" --> FE_API


📌 3. 주요 기능

👨‍🎓 학생 (Student)

대시보드: 수강 중인 과목 목록을 확인합니다.

과목 참여: 교수님이 공유한 참여 코드를 입력하여 과목에 셀프로 수강 신청합니다.

과제 확인: 과목을 클릭하여 해당 과목의 과제 목록과 마감일을 확인합니다.

과제 제출: 마감일 시스템(정상/지연/차단)이 적용된 과제 상세 페이지에서 파일과 설명을 제출합니다.

과제 수정: 마감일 전까지 제출한 과제와 설명을 수정(재제출)할 수 있습니다.

성적 확인: "내 성적 확인" 페이지에서 교수님이 채점한 점수와 피드백을 확인합니다.

알림: 헤더의 알림 벨을 통해 교수님의 피드백 등록 알림을 실시간으로 확인합니다.

👨‍🏫 교수 (Professor)

과목 관리: 과목 생성, 수정, 삭제(CRUD)가 가능하며, 학생 초대를 위한 참여 코드를 확인합니다.

학생 관리: 과목 상세 페이지의 팝업(Modal) UI를 통해 수강생을 직접 추가/제외합니다.

과제 관리: 과목 상세 페이지 내에서 직접 과제를 생성, 수정, 삭제(CRUD)합니다.

채점 시스템: 과제별 제출 현황(정상/지연)을 확인하고, 학생이 제출한 파일을 다운로드하며, 점수와 피드백을 입력/저장합니다. (채점 시 학생에게 알림 자동 전송)

👨‍💼 관리자 (Admin)

통계 대시보드: 전체 사용자, 과목, 과제, 제출물 현황을 실시간으로 모니터링합니다.

사용자 관리: 전체 사용자 목록을 조회하고, 역할(학생/교수/관리자)을 즉시 변경할 수 있습니다.

로그 관리: 시스템의 주요 활동(과제 제출, 채점 등) 기록을 실시간으로 조회하여 시스템 투명성을 확보합니다.

📌 4. 실행 방법 (Getting Started)

이 프로젝트는 Frontend와 Backend 두 개의 서버를 동시에 실행해야 합니다.

1. Backend (Django)

# 1. /backend 폴더로 이동
cd backend

# 2. 파이썬 가상환경 생성 및 활성화
python -m venv .venv
source .venv/Scripts/activate  # (Windows: .venv\Scripts\activate)

# 3. 의존성 패키지 설치
pip install -r requirements.txt  # (사전에 pip freeze > requirements.txt 로 파일 생성 필요)
# (또는: pip install django djangorestframework mysqlclient djangorestframework-simplejwt django-cors-headers djangorestframework-camel-case)

# 4. .env 파일 생성 및 데이터베이스 설정 (settings.py 참고)
# (MySQL에 lms_db 데이터베이스 및 lms_user 계정이 미리 생성되어 있어야 함)

# 5. 데이터베이스 마이그레이션
python manage.py makemigrations
python manage.py migrate

# 6. (필수) 최고 관리자 계정 생성
python manage.py createsuperuser

# 7. 네트워크 모드로 서버 실행
python manage.py runserver 0.0.0.0:8000


2. Frontend (React)

# 1. /frontend 폴더로 이동
cd frontend

# 2. 의존성 패키지 설치
npm install

# 3. (필수) API 주소 설정
# src/api/api.ts 파일의 baseURL을 백엔드 IP로 수정합니다.
# 예: baseURL: '[http://192.168.24.182:8000/api](http://192.168.24.182:8000/api)'

# 4. 네트워크 모드로 서버 실행 (포트폴리오 시연용)
npm run dev -- --host --port 8080

# 5. 브라우저에서 http://[내-PC-IP]:8080 으로 접속


📌 5. 핵심 문제 해결 경험

로컬 네트워크 배포 및 CORS/CSRF 보안 문제

문제: localhost에서는 정상 작동하던 앱이, 실제 IP(192.168...)로 네트워크 배포 시 DisallowedHost, 400 Bad Request 등 심각한 로그인/통신 오류가 발생했습니다.

해결: settings.py의 ALLOWED_HOSTS와 CSRF_TRUSTED_ORIGINS에 프론트엔드의 IP 주소를 명시적으로 추가하여 Django의 보안 장벽을 통과시켰습니다. 또한, runserver 0.0.0.0:8000 (백엔드) 및 vite --host (프론트엔드) 명령어로 서버를 올바른 네트워크 모드로 실행하여 다른 기기(스마트폰 등)에서의 시연 환경을 구축했습니다.

데이터 형식 비일치 문제 (snake_case vs camelCase)

문제: 학생 대시보드에서 마감일이 Invalid Date로 표시되고, 파일 링크 클릭 시 about:blank#blocked가 뜨는 등 데이터 바인딩 오류가 지속적으로 발생했습니다.

해결: djangorestframework-camel-case 라이브러리를 도입하여, 모든 API 응답을 camelCase로 자동 변환했습니다. 또한, SerializerMethodField를 활용하여 file.url을 fileUrl이라는 완성된 절대 경로로 가공하여 프론트엔드에 전달함으로써 about:blank 오류를 해결했습니다.

DB 스키마와 API 로직의 동기화 문제

문제: NameError: 'Notification' is not defined, OperationalError: Unknown column 'grade' 등 백엔드 서버 실행 실패 및 API 500 에러가 빈번하게 발생했습니다.

해결: **models.py 변경 → makemigrations → migrate**로 DB 스키마를 먼저 확정한 뒤, serializers.py와 views.py를 수정하는 명확한 개발 워크플로우를 수립하여 의존성 및 데이터베이스 동기화 문제를 해결했습니다.