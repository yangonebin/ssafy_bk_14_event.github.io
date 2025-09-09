alert("자바스크립트 파일이 연결되었습니다!");
// 모든 파이어베이스 SDK를 여기서 불러옵니다.
const fireApp = document.createElement('script');
fireApp.src = "https://www.gstatic.com/firebasejs/8.6.8/firebase-app.js";
document.head.appendChild(fireApp);

const fireStore = document.createElement('script');
fireStore.src = "https://www.gstatic.com/firebasejs/8.6.8/firebase-firestore.js";
document.head.appendChild(fireStore);

// HTML 요소 가져오기
const form = document.querySelector('form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

// 파이어베이스 설정 코드
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
setTimeout(() => {
    firebase.initializeApp(firebaseConfig);
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
}, 1000); // 1초 대기 후 실행