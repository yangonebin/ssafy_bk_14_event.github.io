// 이 코드를 script.js 파일에 복사하세요.

// HTML 요소 가져오기
const form = document.querySelector('form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

// 파이어베이스 데이터베이스와 연동
const db = firebase.firestore();
const adminsRef = db.collection('admins');

form.addEventListener('submit', async (e) => {
    e.preventDefault(); // 페이지 새로고침 방지

    const username = usernameInput.value;
    const password = passwordInput.value;

    // 데이터베이스에서 사용자 이름과 일치하는 문서 찾기
    const snapshot = await adminsRef.where('username', '==', username).get();

    if (snapshot.empty) {
        alert('관리자 아이디가 존재하지 않습니다.');
        return;
    }

    let isAdmin = false;
    snapshot.forEach(doc => {
        const adminData = doc.data();
        if (adminData.password === password) {
            isAdmin = true;
        }
    });

    if (isAdmin) {
        alert('로그인 성공! 관리자 페이지로 이동합니다.');
        window.location.href = 'dashboard.html'; // 예시: dashboard.html로 이동
    } else {
        alert('비밀번호가 올바르지 않습니다.');
    }
});