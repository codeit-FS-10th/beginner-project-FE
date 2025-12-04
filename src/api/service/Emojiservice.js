import api from "../axiosInstance.js"

export const fetchEmoji = async (studyId) => {
    const res = await api.get(`/studies/${studyId}/emoji`);
    const list = res.data?.data;
    return Array.isArray(list) ? list : [];
};

export const postEmoji = async (studyId, unicode) => {
    const res = await api.post(`/studies/${studyId}/emoji`, {
        unicode, 
    });
    return res.data;
};