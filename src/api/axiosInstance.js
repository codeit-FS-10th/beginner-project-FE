import axios from "axios";

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
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
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
        console.error("API Error:", err);
        
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
