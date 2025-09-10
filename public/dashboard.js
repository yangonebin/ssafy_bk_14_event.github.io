// dashboard.js

// 파이어베이스 설정: 당신의 실제 코드를 사용합니다.
const firebaseConfig = {
    apiKey: "AIzaSyAC-6B0FV9UI9hFB_UzEl4iXVQDjq9ukV0",
    authDomain: "yangonebinaievent.firebaseapp.com",
    projectId: "yangonebinaievent",
    storageBucket: "yangonebinaievent.firebasestorage.app",
    messagingSenderId: "136715708338",
    appId: "1:136715708338:web:cdf2743235b2829010a6ab"
};

// firebase.initializeApp() 호출 전 firebase-app-compat가 로드되었는지 확인
if (typeof firebase !== 'undefined' && firebase.app) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const storage = firebase.storage();
const storageRef = storage.ref();

const submissionsTable = document.getElementById('submissions-table');
const submissionsBody = document.getElementById('submissions-body');
const loadingMessage = document.getElementById('loading-message');
const noSubmissionsMessage = document.getElementById('no-submissions');

// Firestore에서 제출 목록을 가져와 점수(score)가 있는 순서로 정렬하여 표시
db.collection('submissions').onSnapshot(snapshot => {
    const submissions = [];
    snapshot.forEach(doc => {
        submissions.push(doc.data());
    });

    // 클라이언트 측에서 점수 순으로 정렬
    submissions.sort((a, b) => {
        const scoreA = a.score !== undefined ? a.score : -1;
        const scoreB = b.score !== undefined ? b.score : -1;
        return scoreB - scoreA;
    });

    submissionsBody.innerHTML = '';
    if (submissions.length === 0) {
        loadingMessage.style.display = 'none';
        submissionsTable.style.display = 'none';
        noSubmissionsMessage.style.display = 'block';
        return;
    }

    submissions.forEach(data => {
        const row = submissionsBody.insertRow();

        // 날짜 포맷 변경 (YYYY-MM-DD HH:MM)
        const date = new Date(data.date);
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        
        // 점수 필드가 없을 경우 '-'로 표시
        const score = data.score !== undefined ? data.score : '-';

        row.insertCell(0).innerText = data.name;
        row.insertCell(1).innerText = data.class_num + '반';
        row.insertCell(2).innerText = data.filename;
        row.insertCell(3).innerText = score; // 점수 셀 추가
        row.insertCell(4).innerText = formattedDate;

        const downloadCell = row.insertCell(5);
        const downloadLink = document.createElement('a');
        downloadLink.href = '#';
        downloadLink.innerText = '다운로드';
        downloadLink.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                const fileRef = storageRef.child('submissions/' + data.filename);
                const url = await fileRef.getDownloadURL();
                window.open(url, '_blank');
            } catch (error) {
                console.error("파일 다운로드 중 오류 발생:", error);
                alert('파일 다운로드에 실패했습니다. 올바른 경로인지 확인해주세요.');
            }
        });
        downloadCell.appendChild(downloadLink);
    });
    
    loadingMessage.style.display = 'none';
    submissionsTable.style.display = 'table';
});