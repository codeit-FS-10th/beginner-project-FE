import api from "../axiosInstance.js";

export const fetchEmoji = async (studyId) => {
    const res = await api.get(`/studies/${studyId}/emoji`);
    const list = res.data?.data;
    return Array.isArray(list) ? list : [];
};

export const postEmoji = async (studyId, unicodeOrCode) => {
    // Accept either a string code (e.g. "1f923") or an object { code, emoji }
    let code = "";
    let emoji = "";

    if (typeof unicodeOrCode === "string") {
        code = unicodeOrCode;
    } else if (
        unicodeOrCode &&
        typeof unicodeOrCode === "object" &&
        unicodeOrCode.code
    ) {
        code = unicodeOrCode.code;
        emoji = unicodeOrCode.emoji || "";
    }

    // normalize code to lowercase hex without 0x prefix
    code = String(code || "").toLowerCase();

    // if emoji not provided, derive from code when possible
    if (!emoji && code) {
        try {
            const codePoint = parseInt(code, 16);
            emoji = String.fromCodePoint(codePoint);
        } catch (err) {
            // ignore
        }
    }

    const res = await api.post(`/studies/${studyId}/emoji`, {
        code,
        emoji,
    });

    return res.data;
};
