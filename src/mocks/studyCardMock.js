import bg1 from "@img/mockImg/card_background1.jpg";
import bg2 from "@img/mockImg/card_background2.jpg";
import bg3 from "@img/mockImg/card_background3.jpg";
import bg4 from "@img/mockImg/card_background4.jpg";
import bg5 from "@img/mockImg/card_background5.jpg";
import bg6 from "@img/mockImg/card_background6.jpg";
import bg7 from "@img/mockImg/card_background7.jpg";
import bg8 from "@img/mockImg/card_background8.jpg";

// 카드 배경 이미지

export const BACKGROUNDS = {
    "color-light-green": {
        id: "color-light-green",
        type: "color",
        value: "#E1EDDE",
    },
    "color-cream": { id: "color-cream", type: "color", value: "#FFF1CC" },
    "color-blue": { id: "color-blue", type: "color", value: "#E0F1F5" },
    "color-pink": { id: "color-pink", type: "color", value: "#FDE0E9" },
    "img-desk": { id: "img-desk", type: "image", value: bg1 },
    "img-window": { id: "img-window", type: "image", value: bg2 },
    "img-tile": { id: "img-tile", type: "image", value: bg3 },
    "img-plant": { id: "img-plant", type: "image", value: bg4 },
};

// reaction 태그 데이터
const REACTIONS_BY_ID = {
    1: [
        { id: "dev", emoji: "🧑‍💻", value: 37 },
        { id: "fire", emoji: "🔥", value: 26 },
        { id: "heart", emoji: "🤍", value: 14 },
    ],
    2: [
        { id: "dev", emoji: "🌟", value: 54 },
        { id: "fire", emoji: "🤩", value: 88 },
        { id: "heart", emoji: "👍🏻", value: 10 },
    ],
    3: [
        { id: "dev", emoji: "👌🏻", value: 76 },
        { id: "fire", emoji: "🥰", value: 11 },
        { id: "heart", emoji: "👀", value: 32 },
    ],
};

function getReactionData(id) {
    return REACTIONS_BY_ID[id];
}

// 스터디 Card 컴포넌트 데이터
export const MOCK_STUDIES = [
    {
        id: 1,
        studyName: "UX 스터디",
        auther: "아유디",
        point: 310,
        day: 62,
        goal: "Slow And Steady Wins The Race!!",
        reactionData: getReactionData(1),
        background: BACKGROUNDS["img-desk"],
    },
    {
        id: 2,
        studyName: "UX 스터디",
        auther: "K.K.",
        point: 310,
        day: 62,
        goal: "나비보벳따우",
        reactionData: getReactionData(2),
        background: BACKGROUNDS["color-light-green"],
    },
    {
        id: 3,
        studyName: "개발공장",
        auther: "연우",
        point: 50,
        day: 10,
        goal: "Slow And Steady Wins The Race!",
        reactionData: getReactionData(2),
        background: BACKGROUNDS["color-cream"],
    },
];
