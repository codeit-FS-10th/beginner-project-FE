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
    const [error, setError] = useState(null);

    // 🔍 검색 필터 (NAME이 없을 때도 안전하게 처리)
    const filteredStudies = (studies ?? []).filter((study) => {
        const name = study?.NAME ?? "";
        return name.toLowerCase().includes(searchText.toLowerCase());
    });

    useEffect(() => {
        const data = getRecentStudies();
        setRecentStudy(data);
    }, []);

    useEffect(() => {
        const loadStudies = async () => {
            try {
                setLoading(true);
                const data = await fetchStudies(); // 백엔드에서 받은 배열
                setStudies(data);
            } catch (err) {
                console.error(err);
                setError("스터디 목록을 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        loadStudies();
    }, []);

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
                        <LoadMoreButton>더보기</LoadMoreButton>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Home;
