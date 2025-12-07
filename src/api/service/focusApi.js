import api from "@api/axiosInstance.js";

export const fetchStudyDetail = (studyId) => {
    return api.get(`/studies/${studyId}`);
};

export const fetchFocusInfo = (studyId) => {
    return api.get(`/studies/${studyId}/focus`);
};

export const finishFocus = (studyId, timeSec) => {
    return api.post(`/studies/${studyId}/focus`, { timeSec });
};
export const verifyStudyPassword = (studyId, password) => {
    return api.post(`/studies/${studyId}/verify-password`, {
        password,
    });
};
