# GitHub에 프로젝트 올리는 방법

현재 PC에서 `git` 명령어가 실행되지 않아 자동으로 처리해 드릴 수 없었습니다. 아래 순서대로 진행해 주세요.

## 1. Git 설치하기 (안 되어 있는 경우)
만약 컴퓨터에 Git이 설치되어 있지 않다면 먼저 설치해야 합니다.
1. [Git for Windows 다운로드](https://git-scm.com/download/win) 페이지로 이동합니다.
2. "Click here to download"를 눌러 설치 프로그램을 받습니다.
3. 설치 프로그램을 실행하고, 계속 "Next"를 눌러 설치를 완료합니다.
4. **설치 후에는 사용 중인 VS Code나 터미널을 완전히 껐다가 다시 켜야 합니다.**

## 2. GitHub에 저장소(Repository) 만들기
1. [GitHub](https://github.com/)에 로그인합니다.
2. 우측 상단의 `+` 버튼을 누르고 **"New repository"**를 선택합니다.
3. **Repository name**에 `money-tracker` (또는 원하는 이름)를 입력합니다.
4. **Public**(공개) 또는 **Private**(비공개)를 선택합니다. (무료 배포를 하려면 Public이 편합니다, Private도 Vercel 배포는 가능합니다)
5. 다른 설정(README 추가 등)은 건드리지 말고 맨 아래 **"Create repository"** 버튼을 누릅니다.
6. 생성 후 나오는 화면에서 **URL** (예: `https://github.com/사용자명/money-tracker.git`)을 복사해 둡니다.

## 3. 코드 업로드하기 (터미널 명령어)
VS Code의 터미널(단축키: `Ctrl + J`)을 열고 아래 명령어를 **한 줄씩** 순서대로 입력하세요.

```bash
# 1. Git 초기화
git init

# 2. 모든 파일 담기
git add .

# 3. 변경 사항 저장 (이름과 이메일은 본인 것으로 변경 추천, 안 해도 됨)
git commit -m "첫 번째 버전 완성"

# 4. 브랜치 이름 변경
git branch -M main

# 5. GitHub 저장소와 연결 (아까 복사한 URL을 붙여넣으세요!)
git remote add origin https://github.com/사용자명/리포지토리이름.git

# 6. GitHub로 파일 보내기
git push -u origin main
```

## 4. 이후 PC 없이 사용하는 법 (무료 배포)
코드가 GitHub에 올라갔다면, [Vercel](https://vercel.com/) 같은 사이트를 이용해 무료로 배포할 수 있습니다.
1. Vercel에 GitHub 계정으로 가입/로그인합니다.
2. "Add New Project" -> 아까 올린 `money-tracker`를 선택 -> "Import" 클릭.
3. "Deploy" 버튼을 누르면 끝!
4. 생성된 `https://money-tracker-....vercel.app` 주소로 접속하면, **PC가 꺼져 있어도 언제든 접속 가능합니다.**
