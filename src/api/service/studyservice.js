import api from "../axiosInstance.js"

export const fetchStudies = async ({ page = 1, limit = 6 } = {}) => {
    const res = await api.get("/studies", {
        params: { page, limit },
    });
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
