# Branch 사용법
```
git checkout -b test
git add .
git commit -m "테스트 기능 추가"
git push origin test

# 메인으로 다시 이동
git checkout main
git merge test
git push origin main

# 브랜치 삭제
git checkout main
git branch -d test
git push origin --delete test
```
