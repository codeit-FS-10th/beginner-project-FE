import React, { useEffect, useState } from "react";
import { fetchStudies } from "@api/service/studyservice";
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

    const filteredStudies = (studies ?? []).filter((study) => {
        const name = study?.NAME ?? "";
        return name.toLowerCase().includes(searchText.toLowerCase());
    });

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

            setStudies((prev) => (append ? [...prev, ...items] : items));

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
                            items={["최신순", "오래된 순", "제목순"]}
                            label={sortOption}
                            onSelect={(option) => setSortOption(option)}
                        />
                    </div>

                    <div className="study-list">
                        {loading ? (
                            <p>불러오는 중...</p>
                        ) : error ? (
                            <p>{error}</p>
                        ) : filteredStudies.length === 0 ? (
                            <p>아직 둘러 볼 스터디가 없어요</p>
                        ) : (
                            <Card
                                size="lg"
                                theme="light"
                                studyData={filteredStudies}
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
