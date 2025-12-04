import "@styles/pages/study.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { mockBackgrounds } from "@mocks/studyBackgrounds";
import BaseButton from "@atoms/button/BaseButton";
import Input from "../components/atoms/input/Input";
import { createStudy } from "@api/service/studyservice";

import Toast, { showErrorToast, showSuccessToast } from "@atoms/Toast";

const passwordRegex =
    /^(?=.*[A-Za-z\uAC00-\uD7A3])(?=.*[^A-Za-z0-9\uAC00-\uD7A3\s]).{8,15}$/;

export default function Study() {
    const navigate = useNavigate();

    const [nickname, setNickname] = useState("");
    const [studyName, setStudyName] = useState("");
    const [intro, setIntro] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [selectedBg, setSelectedBg] = useState(null);

    const [errors, setErrors] = useState({
        nickname: "",
        studyName: "",
        intro: "",
        password: "",
        passwordConfirm: "",
        selectedBg: "",
    });

    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};

        const trimmedNickname = nickname.trim();
        const trimmedStudyName = studyName.trim();
        const trimmedIntro = intro.trim();

        if (!trimmedNickname) {
            newErrors.nickname = "*닉네임을 입력해주세요";
        } else if (trimmedNickname.length > 10) {
            newErrors.nickname = "*닉네임은 10자 이내로 입력해주세요";
        }

        if (!trimmedStudyName) {
            newErrors.studyName = "*스터디 이름을 입력해주세요";
        } else if (trimmedStudyName.length > 20) {
            newErrors.studyName = "*스터디 이름은 20자 이내로 입력해주세요";
        }

        if (trimmedIntro.length > 500) {
            newErrors.intro = "*소개는 500자 이내로 작성해주세요";
        }

        if (!selectedBg) {
            newErrors.selectedBg = "*배경을 선택해주세요";
        }

        if (!password.trim()) {
            newErrors.password = "*비밀번호를 입력해주세요";
        } else if (!passwordRegex.test(password)) {
            newErrors.password =
                "*비밀번호는 8~15자, 한글/영문 포함, 특수문자 1개 이상이어야 합니다";
        }

        if (!passwordConfirm.trim()) {
            newErrors.passwordConfirm = "*비밀번호 확인을 입력해주세요";
        } else if (password !== passwordConfirm) {
            newErrors.passwordConfirm = "*비밀번호가 일치하지 않습니다";
        }

        setErrors(newErrors);

        const firstError = Object.values(newErrors)[0];
        if (firstError) {
            showErrorToast(firstError.replace(/^\*/, ""));
            return;
        }

        const payload = {
            name: trimmedStudyName,
            nickname: trimmedNickname,
            password,
            intro: trimmedIntro,
            image: selectedBg?.image ?? null,
        };

        try {
            setSubmitting(true);

            await createStudy(payload);

            showSuccessToast("스터디가 생성되었습니다!");

            navigate("/", { replace: true });
        } catch (err) {
            console.error(err);
            showErrorToast("스터디 생성에 실패했습니다.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Toast />

            <div className="study-root-container">
                <div className="study-main-container">
                    <section className="study-section">
                        <form className="study-form" onSubmit={handleSubmit}>
                            <h2 className="study-header-title">
                                스터디 만들기
                            </h2>

                            {/* 닉네임 */}
                            <p>닉네임</p>
                            <Input
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                placeholder="닉네임을 입력해 주세요"
                                error={errors.nickname}
                            />

                            {/* 스터디 이름 */}
                            <p>스터디 이름</p>
                            <Input
                                value={studyName}
                                onChange={(e) => setStudyName(e.target.value)}
                                placeholder="스터디 이름을 입력해주세요"
                                error={errors.studyName}
                            />

                            {/* 소개 */}
                            <p>소개</p>
                            <Input
                                multiline
                                value={intro}
                                onChange={(e) => setIntro(e.target.value)}
                                placeholder="소개 멘트를 작성해 주세요"
                                error={errors.intro}
                            />

                            {/* 배경 */}
                            <p className="select-background">
                                배경을 선택해주세요
                            </p>
                            <div className="bg-list">
                                {mockBackgrounds.map((bg, index) => (
                                    <button
                                        key={`${bg.id}-${index}`}
                                        type="button"
                                        className={`bg-item ${
                                            selectedBg?.id === bg.id
                                                ? "bg-item--selected"
                                                : ""
                                        }`}
                                        onClick={() => setSelectedBg(bg)}
                                    >
                                        {bg.image ? (
                                            <img
                                                src={bg.image}
                                                alt="background"
                                            />
                                        ) : (
                                            <div
                                                className="bg-color-box"
                                                style={{
                                                    backgroundColor: bg.color,
                                                }}
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                            {errors.selectedBg && (
                                <p className="input-error-message">
                                    {errors.selectedBg}
                                </p>
                            )}

                            {/* 비밀번호 */}
                            <p>비밀번호</p>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="비밀번호를 입력해 주세요"
                                error={errors.password}
                            />

                            {/* 비밀번호 확인 */}
                            <p>비밀번호 확인</p>
                            <Input
                                type="password"
                                value={passwordConfirm}
                                onChange={(e) =>
                                    setPasswordConfirm(e.target.value)
                                }
                                placeholder="비밀번호를 다시 한 번 입력해 주세요"
                                error={errors.passwordConfirm}
                            />

                            {/* 버튼 */}
                            <div className="study-make-button">
                                <BaseButton
                                    type="default"
                                    size="full"
                                    disabled={submitting}
                                >
                                    {submitting ? "만드는 중..." : "만들기"}
                                </BaseButton>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </>
    );
}
