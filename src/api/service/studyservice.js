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


// export const fetchRecentstudy = () => {
//     return api.get("/study/recent");
// };

// export const createStudy = (payload) => {
//     return api.post("/study", payload);
// };

// export const fetchStudyDetail = (studyId) => {
//     return api.get(`/study/${studyId}`);
// };

// export const updateStudy = (studyId, payload) => {
//     return api.patch(`/study/${studyId}`, payload);
// };

// export const deleteStudy = (studyId, password) => {
//     return api.delete(`/study/${studyId}`, { data: { password } });
// };

// export const fetchBackgroundList = () => {
//     return api.get("/study/backgrounds");
// };