// 모든 파이어베이스 SDK를 여기서 직접 불러옵니다.
const fireApp = document.createElement('script');
fireApp.src = "https://www.gstatic.com/firebasejs/8.6.8/firebase-app.js";
document.head.appendChild(fireApp);

const fireStore = document.createElement('script');
fireStore.src = "https://www.gstatic.com/firebasejs/8.6.8/firebase-firestore.js";
document.head.appendChild(fireStore);

const fireStorage = document.createElement('script');
fireStorage.src = "https://www.gstatic.com/firebasejs/8.6.8/firebase-storage.js";
document.head.appendChild(fireStorage);

// HTML 문서가 완전히 로드된 후 실행
document.addEventListener('DOMContentLoaded', () => {
  // 파이어베이스 SDK가 로드될 때까지 1초 대기 (안정성 확보)
  setTimeout(() => {
    const firebaseConfig = {
      apiKey: "AIzaSyAC-6B0FV9UI9hFB_UzEl4iXVQDjq9ukV0",
      authDomain: "yangonebinaievent.firebaseapp.com",
      projectId: "yangonebinaievent",
      storageBucket: "yangonebinaievent.firebasestorage.app",
      messagingSenderId: "136715708338",
      appId: "1:136715708338:web:cdf2743235b2829010a6ab",
      measurementId: "G-CH73R4Y2M1"
    };
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    const storage = firebase.storage();
    const storageRef = storage.ref();

    const pathname = window.location.pathname;

    if (pathname.includes('index.html')) {
      const submissionForm = document.getElementById('submission-form');
      if (submissionForm) {
        submissionForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const name = document.getElementById('name').value;
          const file = document.getElementById('file').files[0];
          if (!file) {
            alert('파일을 선택해주세요.');
            return;
          }
          const fileName = `${Date.now()}_${file.name}`;
          const fileRef = storageRef.child(fileName);
          try {
            await fileRef.put(file);
            await db.collection('submissions').add({
              name: name,
              filename: fileName,
              date: new Date().toISOString()
            });
            alert('파일이 성공적으로 제출되었습니다!');
            submissionForm.reset();
          } catch (error) {
            console.error("파일 제출 중 오류 발생:", error);
            alert('파일 제출에 실패했습니다. 다시 시도해주세요.');
          }
        });
      }
    } else if (pathname.includes('admin.html')) {
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
      const submissionsTableBody = document.getElementById('submissions-table-body');
      const logoutBtn = document.getElementById('logout-btn');

      db.collection('submissions').orderBy('date', 'desc').onSnapshot(async snapshot => {
        submissionsTableBody.innerHTML = '';
        for (const doc of snapshot.docs) {
          const submission = doc.data();
          const row = document.createElement('tr');

          const fileUrl = await storageRef.child(submission.filename).getDownloadURL();

          row.innerHTML = `
                        <td>${doc.id}</td>
                        <td><a href="${fileUrl}" target="_blank">${submission.filename}</a></td>
                        <td>${submission.date}</td>
                        <td>${submission.name}</td>
                    `;
          submissionsTableBody.appendChild(row);
        }
      });

      logoutBtn.addEventListener('click', () => {
        window.location.href = 'admin.html';
      });
    }
  }, 1000);
});