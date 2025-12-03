import React, { useEffect, useState, useMemo } from "react";
import { fetchStudies, fetchStudyPoints } from "@api/service/studyservice";
import { getRecentStudies } from "@utils/recentStudy";
import LoadMoreButton from "@atoms/button/LoadMoreButton";
import Dropdown from "@atoms/dropdown/Dropdown";

import Card from "@molecule/card/Card";
import "@styles/pages/home.css";

function Home() {
    const [sortOption, setSortOption] = useState("정렬 기준");
    const [searchText, setSearchText] = useState("");
    const [recentStudy, setRecentStudy] = useState([]);
    const [studies, setStudies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);

    const PAGE_SIZE = 6;

    const SORT_OPTIONS = {
        DEFAULT: "정렬 기준",
        NEWEST: "최근 순",
        OLDEST: "오래된 순",
        POINT_DESC: "많은 포인트 순",
        POINT_ASC: "적은 포인트 순",
    };

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

    useEffect(() => {
        const data = getRecentStudies();
        setRecentStudy(data);
    }, []);

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
                limit: PAGE_SIZE,
            });

            const items = res.items ?? [];
            const totalPages = res.totalPages ?? 1;

            const itemsWithPoints = await Promise.all(
                items.map(async (study) => {
                    try {
                        const studyId = study.STUDY_ID;

                        if (!studyId) {
                            return { ...study, point: 0 };
                        }

                        const pointData = await fetchStudyPoints(studyId);
                        const totalPoint = pointData?.totalPoint ?? 0;

                        return {
                            ...study,
                            point: totalPoint,
                        };
                    } catch (err) {
                        console.error("포인트 불러오기 실패:", err);
                        return {
                            ...study,
                            point: 0,
                        };
                    }
                })
            );

            setStudies((prev) =>
                append ? [...prev, ...itemsWithPoints] : itemsWithPoints
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

    useEffect(() => {
        loadStudies({ pageToLoad: 1, append: false });
    }, []);

    const handleLoadMore = () => {
        if (!hasMore || loadingMore) return;
        loadStudies({ pageToLoad: page + 1, append: true });
    };

    const filteredStudies = useMemo(() => {
        return (studies ?? []).filter((study) => {
            const name = study?.NAME ?? "";
            return name.toLowerCase().includes(searchText.toLowerCase());
        });
    }, [studies, searchText]);

    const sortedStudies = useMemo(() => {
        const arr = [...filteredStudies];

        switch (sortOption) {
            case SORT_OPTIONS.NEWEST: {
                return arr.sort((a, b) => {
                    const aDate = getCreatedAt(a);
                    const bDate = getCreatedAt(b);
                    return bDate - aDate;
                });
            }
            case SORT_OPTIONS.OLDEST: {
                return arr.sort((a, b) => {
                    const aDate = getCreatedAt(a);
                    const bDate = getCreatedAt(b);
                    return aDate - bDate;
                });
            }
            case SORT_OPTIONS.POINT_DESC: {
                return arr.sort((a, b) => getPoint(b) - getPoint(a));
            }
            case SORT_OPTIONS.POINT_ASC: {
                return arr.sort((a, b) => getPoint(a) - getPoint(b));
            }
            default:
                return arr;
        }
    }, [filteredStudies, sortOption]);

    return (
        <div className="root-container">
            <div className="main-container">
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

                <section className="study-container">
                    <div className="study-header">
                        <h2 className="section-title">스터디 둘러보기</h2>
                    </div>

                    <div className="study-controls">
                        <input
                            className="study-search-input"
                            type="text"
                            placeholder="검색"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <Dropdown
                            items={[
                                SORT_OPTIONS.NEWEST,
                                SORT_OPTIONS.OLDEST,
                                SORT_OPTIONS.POINT_DESC,
                                SORT_OPTIONS.POINT_ASC,
                            ]}
                            label={sortOption}
                            onSelect={(option) => setSortOption(option)}
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
