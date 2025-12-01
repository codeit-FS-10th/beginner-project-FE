// focusMock.js 같은 곳
export const MOCK_FOCUS_PAGE = {
    studyId: "study-001",
    studyName: "연우의 개발새발",
    ownerName: "철수",
    totalPoint: 777,

    password: "1234",

    // 타이머 설정(숫자 직접 입력 기반)
    timerConfig: {
        defaultMinutes: 25, // 처음에 보이는 25
        minMinutes: 1, // 최소 몇 분까지 허용할지
        maxMinutes: 180, // 최대 몇 분까지 허용할지 (예: 3시간)
    },

    rewardConfig: {
        basePoint: 3,
        per10Min: 1,
    },
};
