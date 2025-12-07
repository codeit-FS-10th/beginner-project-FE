// 토큰을 sessionStorage에 안전하게 저장/조회하는 유틸리티

const TOKEN_KEY_PREFIX = "study_token_";

export const saveToken = (studyId, token) => {
    if (!studyId || !token) return;
    try {
        sessionStorage.setItem(`${TOKEN_KEY_PREFIX}${studyId}`, token);
    } catch (error) {
        console.error("토큰 저장 실패:", error);
    }
};

export const getToken = (studyId) => {
    if (!studyId) return null;
    try {
        return sessionStorage.getItem(`${TOKEN_KEY_PREFIX}${studyId}`);
    } catch (error) {
        console.error("토큰 조회 실패:", error);
        return null;
    }
};

export const removeToken = (studyId) => {
    if (!studyId) return;
    try {
        sessionStorage.removeItem(`${TOKEN_KEY_PREFIX}${studyId}`);
    } catch (error) {
        console.error("토큰 삭제 실패:", error);
    }
};

export const clearAllTokens = () => {
    try {
        const keys = Object.keys(sessionStorage);
        keys.forEach((key) => {
            if (key.startsWith(TOKEN_KEY_PREFIX)) {
                sessionStorage.removeItem(key);
            }
        });
    } catch (error) {
        console.error("모든 토큰 삭제 실패:", error);
    }
};

