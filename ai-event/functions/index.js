const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');
const path = require('path');
const { getStorage, getDownloadURL } = require('firebase-admin/storage');

admin.initializeApp();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 함수 이름을 analyzeSubmission으로 변경
exports.analyzeSubmission = functions.storage.object().onFinalize(async (object) => {
    const filename = path.basename(object.name);

    if (!object.name.startsWith('submissions/')) {
        console.log('Not a submission file.');
        return null;
    }

    const fileBucket = object.bucket;
    const filePath = object.name;
    const bucket = getStorage().bucket(fileBucket);
    const file = bucket.file(filePath);
    const publicUrl = await getDownloadURL(file);

    let fileContent = '';
    try {
        const response = await axios.get(publicUrl, { responseType: 'text' });
        fileContent = response.data;
    } catch (error) {
        console.error('파일 다운로드 실패:', error);
        return null;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest"});
    const scoringRubric = `
        다음은 AI 공모전 제출물에 대한 채점 기준입니다. 각 항목에 대해 점수를 매기고, 최종 점수를 계산하세요.
        점수는 정수 형태로만 반환해주세요.
        1. 프롬프트의 완성도 (30점): AI에게 목표를 얼마나 명확하고 창의적으로 제시했는지 (0-30점)
        2. 학습 과정의 독창성 (30점): AI를 활용한 학습 전략이 얼마나 독창적이고 효율적이었는지 (0-30점)
        3. 결과물의 완성도 (20점): 최종 결과물이 얼마나 목표에 부합하고 품질이 높은지 (0-20점)
        4. 공유 및 기여도 (20점): 자신의 경험을 다른 사람에게 얼마나 잘 설명하고, 유용한 노하우를 공유했는지 (0-20점)
        결과는 반드시 JSON 형식으로 반환해야 합니다:
        { "scores": { "prompt_creativity": 점수, "learning_originality": 점수, "result_quality": 점수, "contribution": 점수 }, "total_score": 총점 }
    `;
    const prompt = `아래 제출물 내용을 바탕으로 채점 기준에 따라 각 항목의 점수를 계산하고 최종 점수를 JSON 형식으로 반환해줘.\n제출물 내용:\n${fileContent}`;

    try {
        const result = await model.generateContent(prompt);
        const textResult = result.response.text();
        const jsonResult = JSON.parse(textResult.replace(/```json|```/g, '').trim());
        const submissionsRef = admin.firestore().collection('submissions');
        const querySnapshot = await submissionsRef.where('filename', '==', filename).get();

        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            await doc.ref.update({
                score: jsonResult.total_score,
                scores_detail: jsonResult.scores
            });
            console.log(`채점 완료 및 점수 업데이트: ${filename}, 점수: ${jsonResult.total_score}`);
        }
    } catch (error) {
        console.error("AI 채점 중 오류 발생:", error);
        return null;
    }
    return null;
});