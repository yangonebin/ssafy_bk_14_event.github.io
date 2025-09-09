// dashboard.js 파일에 이 코드를 복사하세요.

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
const app = firebase.initializeApp(firebaseConfig);
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
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${doc.id}</td>
            <td>${submission.filename}</td>
            <td>${submission.date}</td>
            <td>${submission.name}</td>
        `;
        submissionsTableBody.appendChild(row);
    });
});

// 로그아웃 버튼 기능
logoutBtn.addEventListener('click', () => {
    window.location.href = 'admin.html';
});