import api from "../axiosInstance.js"

export const fetchEmoji =  async (studyId) => {
    const res = await api.get(`/studies/${studyId}/emoji`);
    return res.data;
};
