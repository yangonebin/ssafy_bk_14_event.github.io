// 파이어베이스 설정 코드 (YOUR_API_KEY 부분을 당신의 코드로 교체하세요)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// 파이어베이스 초기화
firebase.initializeApp(firebaseConfig);

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
        window.location.href = 'dashboard.html';
    } else {
        alert('비밀번호가 올바르지 않습니다.');
    }
});