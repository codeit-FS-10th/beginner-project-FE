import "@styles/pages/study.css";
import { mockBackgrounds } from "@mocks/studyBackgrounds";
import BaseButton from "@Atoms/button/BaseButton";
// import { useEffect } from "react";

function Study() {
    // useEffect(() => {
    //     fetchBackgroundList();
    // }, []);

    return (
        <div className="study-main-container">
            <section className="study-section">
                <form className="study-form">
                    <h2 className="study-header-title">스터디 만들기</h2>
                    <p>닉네임</p>
                    <input type="text" placeholder="sad" />
                    <p>스터디 이름</p>
                    <input type="text" placeholder="sad" />
                    <p>소개</p>
                    <input type="text" placeholder="sad" />
                    <p className="select-background">배경을 선택해주세요</p>
                    <div className="bg-list">
                        {mockBackgrounds.map((bg) => (
                            <img key={bg.id} src={bg.image} alt="background" />
                        ))}
                    </div>
                    <p>비밀번호</p>
                    <input type="password" placeholder="sad" />
                    <p>비밀번호 확인</p>
                    <input type="password" placeholder="sad" />
                    <BaseButton type="default" size="full">
                        만들기
                    </BaseButton>
                </form>
            </section>
        </div>
    );
}

export default Study;
