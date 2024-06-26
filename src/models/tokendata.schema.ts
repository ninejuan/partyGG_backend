import mongo from 'mongoose';

// 내용 추가하기
const tokenSchema = new mongo.Schema({
    pggId: { type: Number, required: true },
    token: { type: String, required: true },
    providerData: {
        refToken: { type: String, required: true },
        acToken: { type: String, required: true },
    }
    // 이대로 jwt에서 로드
});

/**
 * token expiration 관련 메모사항
 * 1. 로그인 유지 체크박스 disabled : Date.now() + 24h
 * 2. 로그인 유지 체크박스 enabled : Date.now() + 7d
 */

export default mongo.model('token_data', tokenSchema);