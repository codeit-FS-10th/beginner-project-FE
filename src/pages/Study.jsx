import "@styles/pages/study.css";
import { mockBackgrounds } from "@mocks/studyBackgrounds";
import BaseButton from "@atoms/button/BaseButton";
import Input from "../components/atoms/input/Input";
import Toast from "../components/atoms/toast/Toast";
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
                    <Input
                        onChange={() => {}}
                        placeholder="닉네임을 입력해 주세요"
                    />
                    <p>스터디 이름</p>
                    <Input
                        onChange={() => {}}
                        placeholder="스터디 이름을 입력해주세요"
                    />
                    <p>소개</p>
                    <Input placeholder="소개 멘트를 작성해 주세요" multiline />

                    <p className="select-background">배경을 선택해주세요</p>
                    <div className="bg-list">
                        {mockBackgrounds.map((bg) => (
                            <img key={bg.id} src={bg.image} alt="background" />
                        ))}
                    </div>
                    <p>비밀번호</p>
                    <Input
                        type="password"
                        onChange={() => {}}
                        placeholder="비밀번호를 입력해 주세요"
                    />
                    <p>비밀번호 확인</p>
                    <Input
                        type="password"
                        onChange={() => {}}
                        placeholder="비밀번호를 다시 한 번 입력해 주세요"
                    />
                    <BaseButton type="default" size="full">
                        만들기
                    </BaseButton>
                </form>
            </section>
        </div>
    );
}

export default Study;
