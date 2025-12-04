import api from "../axiosInstance.js"

export const fetchWeekHabits =  async (studyId) => {
    const res = await api.get(`/studies/${studyId}/habits`);
    return res.data;
};

export const fetchTodayHabits =  async (studyId) => {
    const res = await api.get(`/studies/${studyId}/habits/today`);
    return res.data;
};




// export const createHabit = (studyId, payload) => {
//     return api.post(`/studies/${studyId}/habits`, payload);
// };

// export const updateHabit = (studyId, habitId, payload) => {
//     return api.patch(`/studies/${studyId}/habits/${habitId}`, payload);
// };

// export const deleteHabit = (studyId, habitId) => {
//     return api.delete(`/studies/${studyId}/habits/${habitId}`);
// };

// export const toggleHabitCheck = (studyId, habitId, dateString) => {
//     return api.patch(`/studies/${studyId}/habits/${habitId}/check`, {
//         date: dateString,
//     });
// };
