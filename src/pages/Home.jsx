import React from "react";
import Card from "@Molecule/Card/Card";
import "@styles/home.css";
import { MOCK_STUDIES } from "../mocks/studyCardMock";

function Home() {
    return (
        <div className="root-container">
            <div className="main-container">
                <section className="recent-container">
                    <h2 className="section-title">최근 조회한 스터디</h2>
                    <div className="recent-list">
                        <Card
                            size={"lg"}
                            theme={"light"}
                            studyData={MOCK_STUDIES}
                        />
                    </div>
                </section>

                <section className="study-container">
                    <div className="study-header">
                        <h2 className="section-title">스터디 둘러보기</h2>
                    </div>

                    <div className="study-controls">
                        <input className="study-search" placeholder="검색" />
                        <select className="study-sort">
                            <option>최근 순</option>
                            <option>오래된 순</option>
                        </select>
                    </div>

                    <div className="study-list">
                        {" "}
                        <Card
                            size={"lg"}
                            theme={"light"}
                            studyData={MOCK_STUDIES}
                        />
                        <Card
                            size={"lg"}
                            theme={"light"}
                            studyData={MOCK_STUDIES}
                        />
                    </div>

                    <div className="pagination">
                        <button>다ㅓ보기</button>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Home;
