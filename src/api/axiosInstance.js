import axios from "axios";
import { getToken } from "@utils/tokenStorage";

// 로딩 상태 관리
let loadingCount = 0;
let setLoadingState = null;

export const setLoadingHandler = (handler) => {
    setLoadingState = handler;
};

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,  
    // withCredentials: true,
});

api.interceptors.request.use((config) => {
    // URL에서 studyId 추출 (예: /studies/10/habits/today)
    const studyIdMatch = config.url?.match(/\/studies\/(\d+)/);
    if (studyIdMatch) {
        const studyId = studyIdMatch[1];
        const token = getToken(studyId);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    
    // 기존 accessToken도 확인 (다른 인증용)
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    // 요청 시작
    loadingCount++;
    if (setLoadingState && loadingCount === 1) {
        setLoadingState(true);
    }
    
    return config;
});

api.interceptors.response.use(
    (res) => {
        // 응답 완료
        loadingCount--;
        if (setLoadingState && loadingCount <= 0) {
            loadingCount = 0;
            setLoadingState(false);
        }
        return res;
    },
    (err) => {
        
        // 에러 발생 시에도 로딩 종료
        loadingCount--;
        if (setLoadingState && loadingCount <= 0) {
            loadingCount = 0;
            setLoadingState(false);
        }
        
        return Promise.reject(err);
    }
);

export default api;
