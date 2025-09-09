// dashboard.js 파일에 아래 코드를 복사하세요.

// 파이어베이스 데이터베이스 초기화
const db = firebase.firestore();
const submissionsRef = db.collection('submissions');

// HTML 요소 가져오기
const submissionsTableBody = document.querySelector('tbody');
const logoutBtn = document.getElementById('logout-btn');

// 데이터베이스의 변경 사항을 실시간으로 감지
submissionsRef.orderBy('date', 'desc').onSnapshot(snapshot => {
    submissionsTableBody.innerHTML = ''; // 기존 목록 초기화
    snapshot.forEach(doc => {
        const submission = doc.data();

        // 새로운 행(<tr>) 생성
        const row = document.createElement('tr');

        // 셀(<td>)에 데이터 넣기
        row.innerHTML = `
            <td>${doc.id}</td>
            <td>${submission.filename}</td>
            <td>${submission.date}</td>
            <td>${submission.name}</td>
        `;

        // 테이블에 행 추가
        submissionsTableBody.appendChild(row);
    });
});

// 로그아웃 버튼 기능
logoutBtn.addEventListener('click', () => {
    window.location.href = 'admin.html'; // 로그인 페이지로 이동
});