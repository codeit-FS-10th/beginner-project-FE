import api from "../axiosInstance.js";

export const fetchStudies = async ({ page = 1, limit = 6 } = {}) => {
    const res = await api.get("/studies", {
        params: { page, limit },
    });
    return res.data;
};

export const fetchStudyDetail = async (studyId) => {
    const res = await api.get(`/studies/${studyId}`);
    return res.data;
};

export const createStudy = async (payload) => {
    const res = await api.post("/studies", payload);
    return res.data;
};

export const fetchStudyPoints = async (studyId) => {
    if (!studyId) {
        throw new Error("studyId가 없습니다.");
    }

    const res = await api.get(`/studies/${studyId}/points`);
    return res.data;
};

export const verifyStudyPassword = async (studyId, password) => {
    const res = await api.post(`/studies/${studyId}/verify-password`, {
        password,
    });
    return res.data; // { verified: true }
};

// 스터디 수정하기
export const updateStudy = async (studyId, payload) => {
    const res = await api.patch(`/studies/${studyId}`, payload);
    return res.data;
};

// 스터디 삭제하기
export const deleteStudy = async (studyId) => {
    const res = await api.delete(`/studies/${studyId}`);
    return res.data;
};
