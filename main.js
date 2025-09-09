// 모든 파이어베이스 SDK를 여기서 불러옵니다.
const fireApp = document.createElement('script');
fireApp.src = "https://www.gstatic.com/firebasejs/8.6.8/firebase-app.js";
document.head.appendChild(fireApp);

const fireStore = document.createElement('script');
fireStore.src = "https://www.gstatic.com/firebasejs/8.6.8/firebase-firestore.js";
document.head.appendChild(fireStore);

// 자바스크립트가 완전히 로드된 후 실행
document.addEventListener('DOMContentLoaded', () => {
    // 1초 대기 후 파이어베이스 초기화 및 기능 실행 (안정성 확보)
    setTimeout(() => {
        // 파이어베이스 설정: 이 부분에 당신의 실제 코드를 붙여넣으세요.
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

        // 현재 페이지의 URL에 따라 다른 기능 실행
        const pathname = window.location.pathname;

        if (pathname.includes('admin.html')) {
            // --- 로그인 페이지 기능 ---
            const loginForm = document.getElementById('login-form');
            if (loginForm) {
                loginForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    
                    const username = document.getElementById('username').value;
                    const password = document.getElementById('password').value;

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
            }
        } else if (pathname.includes('dashboard.html')) {
            // --- 대시보드 페이지 기능 ---
            const submissionsTableBody = document.getElementById('submissions-table-body');
            const logoutBtn = document.getElementById('logout-btn');

            db.collection('submissions').orderBy('date', 'desc').onSnapshot(snapshot => {
                submissionsTableBody.innerHTML = '';
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

            logoutBtn.addEventListener('click', () => {
                window.location.href = 'admin.html';
            });
        }
    }, 1000); // 1초 대기 후 실행 (안정성 확보)
});