import React, { useEffect, useState, useMemo } from "react";
import { fetchStudies, fetchStudyPoints } from "@api/service/studyservice";
import { fetchEmoji } from "@api/service/Emojiservice";
import { getRecentStudies } from "@utils/recentStudy";
import LoadMoreButton from "@atoms/button/LoadMoreButton";
import Dropdown from "@atoms/dropdown/Dropdown";
import Card from "@molecule/card/Card";
import searchIcon from "@assets/Img/searchIcon.svg";

import "@styles/pages/home.css";

const SORT_OPTIONS = {
    DEFAULT: "정렬 기준",
    NEWEST: "최근 순",
    OLDEST: "오래된 순",
    POINT_DESC: "많은 포인트 순",
    POINT_ASC: "적은 포인트 순",
};

const LIMIT = 6; // 한 페이지당 6개 (필요하면 숫자만 바꾸면 됨)

function Home() {
    const [sortOption, setSortOption] = useState(SORT_OPTIONS.DEFAULT);
    const [page, setPage] = useState(1);

    const [searchText, setSearchText] = useState("");
    const [recentStudy, setRecentStudy] = useState([]);
    const [studies, setStudies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);

    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);

    const getCreatedAt = (study) => {
        const raw =
            study?.REG_DATE ??
            study?.CREATED_AT ??
            study?.createdAt ??
            study?.regDate ??
            null;

        return raw ? new Date(raw) : new Date(0);
    };

    const getPoint = (study) => Number(study.point ?? 0);

    // CODE를 이모지로 변환하는 함수
    const codeToEmoji = (code) => {
        if (!code) return "";
        try {
            // "1f600" 형식을 "1F600"으로 변환 후 코드 포인트로 변환
            const codePoint = parseInt(code.toUpperCase(), 16);
            return String.fromCodePoint(codePoint);
        } catch (err) {
            console.error("이모지 변환 실패:", code, err);
            return "";
        }
    };

    // 최근 조회한 스터디 (localStorage 기반) - 이모지 데이터 추가
    useEffect(() => {
        const loadRecentStudiesWithEmojis = async () => {
            const data = getRecentStudies();
            if (!data || data.length === 0) {
                setRecentStudy([]);
                return;
            }

            // 각 최근 스터디의 이모지 데이터 가져오기
            const recentWithEmojis = await Promise.all(
                data.map(async (study) => {
                    try {
                        const studyId = study.STUDY_ID;
                        if (!studyId) {
                            return { ...study, reactionData: [] };
                        }

                        const emojiList = await fetchEmoji(studyId);
                        const rawEmojis = Array.isArray(emojiList)
                            ? emojiList
                            : [];

                        const reactionData = rawEmojis.map((item) => {
                            const code = (item.CODE || "").toLowerCase();
                            const emoji = codeToEmoji(code);

                            return {
                                id: code,
                                emoji: emoji,
                                value: item.COUNTING || 0,
                            };
                        });

                        return {
                            ...study,
                            reactionData: reactionData,
                        };
                    } catch (err) {
                        console.error("최근 스터디 이모지 불러오기 실패:", err);
                        return { ...study, reactionData: [] };
                    }
                })
            );

            setRecentStudy(recentWithEmojis);
        };

        loadRecentStudiesWithEmojis();
    }, []);

    // 스터디 목록 불러오기
    const loadStudies = async ({ pageToLoad = 1, append = false } = {}) => {
        try {
            if (append) {
                setLoadingMore(true);
            } else {
                setLoading(true);
                setError(null);
            }

            const res = await fetchStudies({
                page: pageToLoad,
                limit: LIMIT,
            });

            const items = res.items ?? [];
            const totalPages = res.totalPages ?? 1;

            // 각 스터디 포인트 및 이모지 조회
            const itemsWithData = await Promise.all(
                items.map(async (study) => {
                    try {
                        const studyId = study.STUDY_ID;

                        if (!studyId) {
                            return { ...study, point: 0, reactionData: [] };
                        }

                        // 포인트 조회
                        const pointData = await fetchStudyPoints(studyId);
                        const totalPoint = pointData?.totalPoint ?? 0;

                        // 이모지 조회
                        let reactionData = [];
                        try {
                            const emojiList = await fetchEmoji(studyId);
                            const rawEmojis = Array.isArray(emojiList)
                                ? emojiList
                                : [];

                            reactionData = rawEmojis.map((item) => {
                                const code = (item.CODE || "").toLowerCase();
                                const emoji = codeToEmoji(code);

                                return {
                                    id: code,
                                    emoji: emoji,
                                    value: item.COUNTING || 0,
                                };
                            });
                        } catch (emojiErr) {
                            console.error("이모지 불러오기 실패:", emojiErr);
                            reactionData = [];
                        }

                        return {
                            ...study,
                            point: totalPoint,
                            reactionData: reactionData,
                        };
                    } catch (err) {
                        console.error("데이터 불러오기 실패:", err);
                        return {
                            ...study,
                            point: 0,
                            reactionData: [],
                        };
                    }
                })
            );

            setStudies((prev) =>
                append ? [...prev, ...itemsWithData] : itemsWithData
            );

            setHasMore(pageToLoad < totalPages);
            setPage(pageToLoad);
        } catch (err) {
            console.error(err);
            setError("스터디 목록을 불러오는 데 실패했습니다.");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    // 첫 로딩 때 1페이지 가져오기
    useEffect(() => {
        loadStudies({ pageToLoad: 1, append: false });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 정렬 옵션 변경
    const handleSortChange = (option) => {
        setSortOption(option);
        // 필요하면 정렬 바꿀 때 첫 페이지로 다시 불러오고 싶으면 아래 두 줄 주석 해제
        // setPage(1);
        // loadStudies({ pageToLoad: 1, append: false });
    };

    // 더보기
    const handleLoadMore = () => {
        if (!hasMore || loadingMore) return;
        loadStudies({ pageToLoad: page + 1, append: true });
    };

    // 검색 필터링
    const filteredStudies = useMemo(() => {
        return (studies ?? []).filter((study) => {
            const name = study?.NAME ?? "";
            return name.toLowerCase().includes(searchText.toLowerCase());
        });
    }, [studies, searchText]);

    // 정렬 적용
    const sortedStudies = useMemo(() => {
        const arr = [...filteredStudies];

        switch (sortOption) {
            case SORT_OPTIONS.NEWEST:
                return arr.sort((a, b) => getCreatedAt(b) - getCreatedAt(a));
            case SORT_OPTIONS.OLDEST:
                return arr.sort((a, b) => getCreatedAt(a) - getCreatedAt(b));
            case SORT_OPTIONS.POINT_DESC:
                return arr.sort((a, b) => getPoint(b) - getPoint(a));
            case SORT_OPTIONS.POINT_ASC:
                return arr.sort((a, b) => getPoint(a) - getPoint(b));
            default:
                return arr;
        }
    }, [filteredStudies, sortOption]);

    return (
        <div className="root-container">
            <div className="main-container">
                {/* 최근 조회한 스터디 */}
                <section className="recent-container">
                    <h2 className="section-title">최근 조회한 스터디</h2>
                    <div className="recent-list">
                        {recentStudy.length === 0 ? (
                            <p className="recent-title">
                                최근에 조회한 스터디가 없습니다.
                            </p>
                        ) : (
                            <Card
                                size="lg"
                                theme="light"
                                studyData={recentStudy}
                            />
                        )}
                    </div>
                </section>

                {/* 스터디 둘러보기 */}
                <section className="study-container">
                    <div className="study-header">
                        <h2 className="section-title">스터디 둘러보기</h2>
                    </div>

                    <div className="study-controls">
                        <div className="study-search-wrapper">
                            <img
                                src={searchIcon}
                                alt="검색"
                                className="study-search-icon"
                            />
                            <input
                                className="study-search-input"
                                type="text"
                                placeholder="검색"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </div>
                        <Dropdown
                            items={[
                                SORT_OPTIONS.NEWEST,
                                SORT_OPTIONS.OLDEST,
                                SORT_OPTIONS.POINT_DESC,
                                SORT_OPTIONS.POINT_ASC,
                            ]}
                            label={sortOption}
                            onSelect={handleSortChange}
                        />
                    </div>

                    <div className="study-list">
                        {loading ? (
                            <p>불러오는 중...</p>
                        ) : error ? (
                            <p>{error}</p>
                        ) : sortedStudies.length === 0 ? (
                            <p>아직 둘러 볼 스터디가 없어요</p>
                        ) : (
                            <Card
                                size="lg"
                                theme="light"
                                studyData={sortedStudies}
                            />
                        )}
                    </div>

                    <div className="pagination">
                        {hasMore && !loading && (
                            <LoadMoreButton onClick={handleLoadMore}>
                                {loadingMore ? "불러오는 중..." : "더보기"}
                            </LoadMoreButton>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Home;
