import api from "../axiosInstance.js";

export const fetchWeekHabits = async (studyId) => {
    const res = await api.get(`/studies/${studyId}/habits`);
    return res.data;
};
// 오늘의 습관 조회
export const fetchTodayHabits = async (studyId, password) => {
    const res = await api.get(`/studies/${studyId}/habits/today`, {
        params: { password },
    });
    return res.data;
};
// 오늘의 습관 생성
export const createHabit = async (studyId, payload) => {
    const res = await api.post(`/studies/${studyId}/habits`, payload);
    return res.data;
};

// 오늘의 습관 수정
export const updateHabit = async (studyId, habitId, payload) => {
    const res = await api.patch(
        `/studies/${studyId}/habits/${habitId}`,
        payload
    );
    return res.data;
};

// 오늘의 습관 삭제
export const deleteHabit = async (studyId, habitId) => {
    const res = await api.delete(`/studies/${studyId}/habits/${habitId}`);
    return res.data;
};

// 체크 토글
export const toggleHabitCheck = async (studyId, habitId, isDone) => {
    const res = await api.patch(`/studies/${studyId}/habits/${habitId}/today`, {
        isDone,
    });
    return res.data;
};

// 스터디 상세 조회: GET /studies/{studyId}
export const fetchStudyDetail = async (studyId) => {
    const res = await api.get(`/studies/${studyId}`);
    return res.data; // Swagger 예시 보면 DATA 안 쓰고 바로 JSON 주는 형태니까 data 그대로 리턴
};
