import React, { useEffect, useState, useMemo } from "react";
import { fetchStudies } from "@api/service/studyservice";
import { getRecentStudies } from "@utils/recentStudy";
import { useDebounce } from "@hooks/useDebounce";
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

const LIMIT = 6;

function Home() {
    useEffect(() => {
        document.title = "공부의 숲 메인 페이지";
    }, []);

    const [sortOption, setSortOption] = useState(SORT_OPTIONS.DEFAULT);
    const [sortParam, setSortParam] = useState("newest");

    const [page, setPage] = useState(1);

    const [searchText, setSearchText] = useState("");
    const [recentStudy, setRecentStudy] = useState([]);
    const [studies, setStudies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);

    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);

    const debouncedSearchText = useDebounce(searchText, 400);
    const isSearching = debouncedSearchText.trim().length > 0;

    const codeToEmoji = (code) => {
        if (!code) return "";
        try {
            const codePoint = parseInt(code.toUpperCase(), 16);
            return String.fromCodePoint(codePoint);
        } catch (err) {
            if (process.env.NODE_ENV === "development") {
                console.error("이모지 변환 실패:", code, err);
            }
            return "";
        }
    };

    useEffect(() => {
        const loadRecentStudiesWithEmojis = () => {
            const data = getRecentStudies();
            if (!data || data.length === 0) {
                setRecentStudy([]);
                return;
            }

            const recentWithEmojis = data.map((study) => {
                const reactionData = (study.emojis || []).map((item) => {
                    const code = (item.code || "").toLowerCase();
                    const emoji = codeToEmoji(code);

                    return {
                        id: code,
                        emoji: emoji,
                        value: item.counting || 0,
                    };
                });

                return {
                    ...study,
                    point: study.totalPoint || 0,
                    reactionData: reactionData,
                };
            });

            setRecentStudy(recentWithEmojis);
        };

        loadRecentStudiesWithEmojis();
    }, []);

    const loadStudies = async ({
        pageToLoad = 1,
        append = false,
        sort = sortParam,
    } = {}) => {
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
                sort,
                search: debouncedSearchText || "",
            });

            const items = res.items ?? [];
            const totalPages = res.totalPages ?? 1;

            const itemsWithData = items.map((study) => {
                const reactionData = (study.emojis || []).map((item) => {
                    const code = (item.code || "").toLowerCase();
                    const emoji = codeToEmoji(code);

                    return {
                        id: code,
                        emoji: emoji,
                        value: item.counting || 0,
                    };
                });

                return {
                    ...study,
                    point: study.totalPoint || 0,
                    reactionData: reactionData,
                };
            });

            setStudies((prev) =>
                append ? [...prev, ...itemsWithData] : itemsWithData
            );

            setHasMore(pageToLoad < totalPages);
            setPage(pageToLoad);
        } catch (err) {
            if (process.env.NODE_ENV === "development") {
                console.error("스터디 목록 fetch 실패:", err);
            }
            setError("스터디 목록을 불러오는 데 실패했습니다.");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        loadStudies({ pageToLoad: 1, append: false, sort: sortParam });
    }, [sortParam, debouncedSearchText]);

    const handleSortChange = (option) => {
        setSortOption(option);

        const sortKey = mapSortOptionToParam(option);
        setSortParam(sortKey);

        setPage(1);
    };

    const handleLoadMore = () => {
        if (!hasMore || loadingMore) return;
        loadStudies({
            pageToLoad: page + 1,
            append: true,
            sort: sortParam, // ✅ 현재 정렬 기준 유지
        });
    };

    const mapSortOptionToParam = (option) => {
        switch (option) {
            case SORT_OPTIONS.NEWEST:
                return "newest";
            case SORT_OPTIONS.OLDEST:
                return "oldest";
            case SORT_OPTIONS.POINT_DESC:
                return "point_desc";
            case SORT_OPTIONS.POINT_ASC:
                return "point_asc";
            default:
                return "newest";
        }
    };

    return (
        <div className="root-container">
            <div className="main-container">
                <section className="recent-container">
                    <h2 className="section-title">최근 조회한 스터디</h2>
                    {recentStudy.length === 0 ? (
                        <div className="recent-empty-wrapper">
                            <p className="recent-title">
                                최근에 조회한 스터디가 없습니다.
                            </p>
                        </div>
                    ) : (
                        <div className="recent-list">
                            <Card
                                size="lg"
                                theme="light"
                                studyData={recentStudy}
                            />
                        </div>
                    )}
                </section>

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
                                maxLength={50}
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

                    {loading ? (
                        <p className="Home-notfound-study">불러오는 중...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : studies.length === 0 ? (
                        <p className="Home-notfound-study">
                            {isSearching
                                ? "해당 스터디를 찾을 수 없어요."
                                : "아직 둘러 볼 스터디가 없어요"}
                        </p>
                    ) : (
                        <div className="study-list">
                            <Card size="lg" theme="light" studyData={studies} />
                        </div>
                    )}

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
