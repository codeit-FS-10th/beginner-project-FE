import api from "@api/axiosinstance.js";

export const fetchStudyDetail = (studyId, password) => {
    return api.get(`/studies/${studyId}`, {
        params: { password },
    });
};

export const fetchFocusInfo = (studyId, password) => {
    return api.get(`/studies/${studyId}/focus`, {
        params: { password },
    });
};

// export const finishFocus = (studyId, seconds) => {
//     return api.post(`/studies/${studyId}/focus`, {
//         timeSec: seconds,
//     });
// };
export const finishFocus = (studyId, password, timeSec) => {
    return api.post(
        `/studies/${studyId}/focus`,
        { timeSec },
        { params: { password } }
    );
};
export const verifyStudyPassword = (studyId, password) => {
    return api.post(`/studies/${studyId}/verify-password`, {
        password,
    });
};

// export const startFocus = (studyId, payload) => {
//     return api.post(`/studies/${studyId}/focus/start`, payload);
// };

// export const finishFocus = (studyId) => {
//     return api.post(`/studies/${studyId}/focus/finish`);
// };
