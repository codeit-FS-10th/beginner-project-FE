import React, { useEffect, useState } from "react";
import { MOCK_STUDIES } from "@mocks/studyCardMock";
import { getRecentStudies } from "@utils/recentStudy";
import LoadMoreButton from "@atoms/button/LoadMoreButton";
import Dropdown from "@atoms/dropdown/Dropdown";

import Card from "@molecule/card/Card";
import "@styles/pages/home.css";

function Home() {
    const [sortOption, setSortOption] = useState("정렬 기준");
    const [searchText, setSearchText] = useState("");
    const [recentStudy, setRecentStudy] = useState([]);

    const filteredStudies = MOCK_STUDIES.filter((study) =>
        study.studyName.toLowerCase().includes(searchText.toLowerCase())
    );

    useEffect(() => {
        const data = getRecentStudies();
        setRecentStudy(data);
    }, []);

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
                        {filteredStudies.length === 0 ? (
                            <p>아직 둘러 볼 스터디가 없어요</p>
                        ) : (
                            <Card
                                size={"lg"}
                                theme={"light"}
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
