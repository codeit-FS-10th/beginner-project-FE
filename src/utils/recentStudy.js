
const STORAGE_KEY = "recentStudies";
const MAX_RECENT = 5;

export function getRecentStudies() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        return JSON.parse(raw);
    } catch (e) {
        console.error("getRecentStudies parse error:", e);
        return [];
    }
}


export function addRecentStudy(study) {
    if (!study || !study.id) return;

    const current = getRecentStudies()

    const filtered = current.filter((item) => item.id !== study.id);

    const updated = [study, ...filtered];

    const limited = updated.slice(0, MAX_RECENT);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
}
