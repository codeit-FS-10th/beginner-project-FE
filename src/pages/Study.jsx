import "@styles/pages/study.css";
import { useState } from "react";
import { mockBackgrounds } from "@mocks/studyBackgrounds";
import BaseButton from "@atoms/button/BaseButton";
import Input from "../components/atoms/input/Input";
import { createStudy } from "@api/service/studyservice";

function Study() {
    const [nickname, setNickname] = useState("");
    const [studyName, setStudyName] = useState("");
    const [intro, setIntro] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [selectedBg, setSelectedBg] = useState(null);

    const [errors, setErrors] = useState({
        studyName: "",
        password: "",
        passwordConfirm: "",
    });

    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};

        if (!studyName.trim()) {
            newErrors.studyName = "*스터디 이름을 입력해주세요";
        }

        if (!password.trim()) {
            newErrors.password = "*비밀번호를 입력해주세요";
        }

        if (password && passwordConfirm && password !== passwordConfirm) {
            newErrors.passwordConfirm = "*비밀번호가 일치하지 않습니다";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        const payload = {
            name: studyName,
            nickname,
            password,
            intro,
            image: selectedBg?.image ?? null,
        };

        try {
            setSubmitting(true);
            await createStudy(payload);

            // 폼 초기화
            setNickname("");
            setStudyName("");
            setIntro("");
            setPassword("");
            setPasswordConfirm("");
            setSelectedBg(null);
            setErrors({
                studyName: "",
                password: "",
                passwordConfirm: "",
            });
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="study-main-container">
            <section className="study-section">
                <form className="study-form" onSubmit={handleSubmit}>
                    <h2 className="study-header-title">스터디 만들기</h2>

                    <p>닉네임</p>
                    <Input
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="닉네임을 입력해 주세요"
                        autoComplete="username"
                    />

                    <p>스터디 이름</p>
                    <Input
                        value={studyName}
                        onChange={(e) => setStudyName(e.target.value)}
                        placeholder="스터디 이름을 입력해주세요"
                        autoComplete="studyName"
                    />
                    {errors.studyName && (
                        <p className="error-text">{errors.studyName}</p>
                    )}

                    <p>소개</p>
                    <Input
                        value={intro}
                        onChange={(e) => setIntro(e.target.value)}
                        placeholder="소개 멘트를 작성해 주세요"
                        multiline
                    />

                    <p className="select-background">배경을 선택해주세요</p>
                    <div className="bg-list">
                        {mockBackgrounds.map((bg, index) => (
                            <button
                                key={`${bg.id}-${index}`} // 🔥 key 유니크하게
                                type="button"
                                className={`bg-item ${
                                    selectedBg?.id === bg.id
                                        ? "bg-item--selected"
                                        : ""
                                }`}
                                onClick={() => setSelectedBg(bg)}
                            >
                                <img src={bg.image} alt="background" />
                            </button>
                        ))}
                    </div>

                    <p>비밀번호</p>
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="비밀번호를 입력해 주세요"
                        autoComplete="new-password"
                    />
                    {errors.password && (
                        <p className="error-text">{errors.password}</p>
                    )}

                    <p>비밀번호 확인</p>
                    <Input
                        type="password"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        placeholder="비밀번호를 다시 한 번 입력해 주세요"
                        autoComplete="new-password" // 🔥 경고 제거
                    />
                    {errors.passwordConfirm && (
                        <p className="error-text">{errors.passwordConfirm}</p>
                    )}

                    <BaseButton
                        type="default"
                        size="full"
                        disabled={submitting}
                    >
                        {submitting ? "만드는 중..." : "만들기"}
                    </BaseButton>
                </form>
            </section>
        </div>
    );
}

export default Study;
