const STORAGE_KEY = "recentStudies";
const MAX_RECENT = 4; // 최근 조회 4개까지만 유지 같은 느낌

export const getRecentStudies = () => {
    if (typeof window === "undefined") return [];

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];
        const parsed = JSON.parse(stored);


        if (!Array.isArray(parsed)) return [];

        return parsed;
    } catch (e) {
        console.error("getRecentStudies error:", e);
        return [];
    }
};

export const addRecentStudy = (study) => {
    if (typeof window === "undefined" || !study) return;

    try {
        const prev = getRecentStudies();

        const filtered = prev.filter(
            (item) => item.STUDY_ID !== study.STUDY_ID
        );


        const next = [study, ...filtered].slice(0, MAX_RECENT);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
        console.error("addRecentStudy error:", e);
    }
};
