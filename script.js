// script.js 파일에 아래 코드를 복사하세요.

// 파이어베이스 설정
const firebaseConfig = {
    apiKey: "AIzaSyAC-6B0FV9UI9hFB_UzEl4iXVQDjq9ukV0",
    authDomain: "yangonebinaievent.firebaseapp.com",
    projectId: "yangonebinaievent",
    storageBucket: "yangonebinaievent.firebasestorage.app",
    messagingSenderId: "136715708338",
    appId: "1:136715708338:web:cdf2743235b2829010a6ab",
    measurementId: "G-CH73R4Y2M1"
};

// 파이어베이스 초기화
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// HTML 문서가 완전히 로드된 후 실행
document.addEventListener('DOMContentLoaded', () => {
    // HTML 요소 가져오기
    const form = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    // 폼 제출 이벤트 리스너
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // 페이지 새로고침 방지

        const username = usernameInput.value;
        const password = passwordInput.value;

        const adminsRef = db.collection('admins');
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
});