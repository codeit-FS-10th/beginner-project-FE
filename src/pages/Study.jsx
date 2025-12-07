import "@styles/pages/study.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { mockBackgrounds } from "@mocks/studyBackgrounds";
import BaseButton from "@atoms/button/BaseButton";
import Input from "../components/atoms/input/Input";
import {
    createStudy,
    fetchStudyDetail,
    updateStudy,
} from "@api/service/studyservice";
import { addRecentStudy } from "@utils/recentStudy";

import { showSuccessToast } from "@atoms/toast/Toast.jsx";

const passwordRegex =
    /^(?=.*[A-Za-z\uAC00-\uD7A3])(?=.*[^A-Za-z0-9\uAC00-\uD7A3\s]).{8,15}$/;

export default function Study() {
    const navigate = useNavigate();
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const isEditMode =
        (location.state && location.state.mode === "edit") ||
        searchParams.get("mode") === "edit";
    const editStudyId =
        (location.state && location.state.studyId) ||
        searchParams.get("id") ||
        (location.state &&
            location.state.study &&
            location.state.study.STUDY_ID);

    // ====== ref ======
    const nicknameRef = useRef(null);
    const studyNameRef = useRef(null);
    const introRef = useRef(null);
    const passwordRef = useRef(null);
    const passwordConfirmRef = useRef(null);
    const bgRef = useRef(null);

    const [shakeField, setShakeField] = useState("");

    const [nickname, setNickname] = useState("");
    const [studyName, setStudyName] = useState("");
    const [intro, setIntro] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [selectedBg, setSelectedBg] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [errors, setErrors] = useState({
        nickname: "",
        studyName: "",
        intro: "",
        password: "",
        passwordConfirm: "",
        selectedBg: "",
    });

    // ====== 단일 필드 검증 ======
    const validateNickname = (v) => {
        v = v.trim();
        if (!v) return "*닉네임을 입력해주세요";
        if (v.length > 10) return "*닉네임은 10자 이내로 입력해주세요";
        return "";
    };

    const validateStudyName = (v) => {
        v = v.trim();
        if (!v) return "*스터디 이름을 입력해주세요";
        if (v.length > 20) return "*스터디 이름은 20자 이내로 입력해주세요";
        return "";
    };

    const validateIntro = (v) => {
        v = v.trim();
        if (v.length > 500) return "*소개는 500자 이내로 작성해주세요";
        return "";
    };

    const validatePassword = (v) => {
        v = v.trim();
        if (!v) return "*비밀번호를 입력해주세요";
        if (!passwordRegex.test(v))
            return "*비밀번호는 8~15자, 한글/영문 포함, 특수문자 1개 이상이어야 합니다";
        return "";
    };

    const validatePasswordConfirm = (confirm, pwd) => {
        confirm = confirm.trim();
        pwd = pwd.trim();
        if (!confirm) return "*비밀번호 확인을 입력해주세요";
        if (confirm !== pwd) return "*비밀번호가 일치하지 않습니다";
        return "";
    };

    const validateSelectedBg = (v) => {
        if (!v) return "*배경을 선택해주세요";
        return "";
    };

    // ====== 실시간 검증 ======
    const handleNicknameChange = (e) => {
        const v = e.target.value;
        setNickname(v);
        setErrors((prev) => ({ ...prev, nickname: validateNickname(v) }));
    };

    const handleStudyNameChange = (e) => {
        const v = e.target.value;
        setStudyName(v);
        setErrors((prev) => ({ ...prev, studyName: validateStudyName(v) }));
    };

    const handleIntroChange = (e) => {
        const v = e.target.value;
        setIntro(v);
        setErrors((prev) => ({ ...prev, intro: validateIntro(v) }));
    };

    const handlePasswordChange = (e) => {
        const v = e.target.value;
        setPassword(v);

        if (!isEditMode) {
            setErrors((prev) => ({
                ...prev,
                password: validatePassword(v),
                passwordConfirm: prev.passwordConfirm
                    ? validatePasswordConfirm(passwordConfirm, v)
                    : prev.passwordConfirm,
            }));
        }
    };

    const handlePasswordConfirmChange = (e) => {
        const v = e.target.value;
        setPasswordConfirm(v);

        if (!isEditMode) {
            setErrors((prev) => ({
                ...prev,
                passwordConfirm: validatePasswordConfirm(v, password),
            }));
        }
    };

    const handleBgSelect = (bg) => {
        setSelectedBg(bg);
        setErrors((prev) => ({ ...prev, selectedBg: "" }));
    };

    const focusErrorField = (field) => {
        const refMap = {
            nickname: nicknameRef,
            studyName: studyNameRef,
            intro: introRef,
            password: passwordRef,
            passwordConfirm: passwordConfirmRef,
            selectedBg: bgRef,
        };

        const target = refMap[field]?.current;
        if (!target) return;

        target.scrollIntoView({ behavior: "smooth", block: "center" });

        if (target.focus) target.focus();

        setShakeField(field);
        setTimeout(() => setShakeField(""), 300); // shake 클래스 제거
    };

    // ====== 제출 처리 ======
    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {
            nickname: validateNickname(nickname),
            studyName: validateStudyName(studyName),
            intro: validateIntro(intro),
            selectedBg: validateSelectedBg(selectedBg),
            password: isEditMode ? "" : validatePassword(password),
            passwordConfirm: isEditMode
                ? ""
                : validatePasswordConfirm(passwordConfirm, password),
        };

        setErrors(newErrors);

        const firstError = Object.entries(newErrors).find(([_, msg]) => msg);
        if (firstError) {
            focusErrorField(firstError[0]);
            return;
        }

        const payload = {
            name: studyName.trim(),
            nickname: nickname.trim(),
            ...(password ? { password } : {}),
            intro: intro.trim(),
            image: selectedBg?.code ?? null,
        };

        try {
            setSubmitting(true);

            if (isEditMode && editStudyId) {
                await updateStudy(editStudyId, payload);
                const updatedStudy = await fetchStudyDetail(editStudyId);
                addRecentStudy(updatedStudy);
            } else {
                await createStudy(payload);
                showSuccessToast("스터디가 생성되었습니다!");
            }

            navigate("/", { replace: true });
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        if (!isEditMode || !editStudyId) {
            return;
        }

        const initForm = async () => {
            try {
                let baseStudy = location.state.study;

                if (!baseStudy) {
                    baseStudy = await fetchStudyDetail();
                }

                setNickname(baseStudy.NICKNAME);
                setStudyName(baseStudy.NAME);
                setIntro(baseStudy.INTRO);
                setSelectedBg(baseStudy.IMAGE);
            } catch (err) {
                showSuccessToast("데이터를 불러오는데 실패하였습니다");
                return;
            }
        };
        initForm();
    }, [isEditMode, editStudyId, location.state]);

    return (
        <div className="study-root-container">
            <div className="study-main-container">
                <section className="study-section">
                    <form className="study-form" onSubmit={handleSubmit}>
                        <h2 className="study-header-title">
                            {isEditMode ? "스터디 수정하기" : "스터디 만들기"}
                        </h2>

                        {/* 닉네임 */}
                        <p>닉네임</p>
                        <Input
                            ref={nicknameRef}
                            value={nickname}
                            onChange={handleNicknameChange}
                            placeholder="닉네임을 입력해 주세요"
                            error={errors.nickname}
                            shake={shakeField === "nickname"}
                            maxLength={10}
                        />

                        {/* 스터디 이름 */}
                        <p>스터디 이름</p>
                        <Input
                            ref={studyNameRef}
                            value={studyName}
                            onChange={handleStudyNameChange}
                            placeholder="스터디 이름을 입력해주세요"
                            error={errors.studyName}
                            shake={shakeField === "studyName"}
                            maxLength={20}
                        />

                        {/* 소개 */}
                        <p>소개</p>
                        <Input
                            ref={introRef}
                            multiline
                            value={intro}
                            onChange={handleIntroChange}
                            placeholder="소개 멘트를 작성해 주세요"
                            error={errors.intro}
                            shake={shakeField === "intro"}
                            maxLength={500}
                        />

                        {/* 배경 */}
                        <p ref={bgRef} className="select-background">
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
                                    onClick={() => handleBgSelect(bg)}
                                >
                                    {bg.image ? (
                                        <img src={bg.image} alt="background" />
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

                        {!isEditMode && (
                            <>
                                {/* 비밀번호 */}
                                <p>비밀번호</p>
                                <Input
                                    ref={passwordRef}
                                    type="password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    placeholder="비밀번호를 입력해 주세요"
                                    error={errors.password}
                                    shake={shakeField === "password"}
                                    maxLength={15}
                                />

                                {/* 비밀번호 확인 */}
                                <p>비밀번호 확인</p>
                                <Input
                                    ref={passwordConfirmRef}
                                    type="password"
                                    value={passwordConfirm}
                                    onChange={handlePasswordConfirmChange}
                                    placeholder="비밀번호를 다시 입력해 주세요"
                                    error={errors.passwordConfirm}
                                    shake={shakeField === "passwordConfirm"}
                                    maxLength={15}
                                />
                            </>
                        )}

                        <div className="study-make-button">
                            <BaseButton
                                type="default"
                                size="full"
                                disabled={submitting}
                            >
                                {submitting
                                    ? isEditMode
                                        ? "수정 중..."
                                        : "만드는 중..."
                                    : isEditMode
                                    ? "수정하기"
                                    : "만들기"}
                            </BaseButton>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    );
}
