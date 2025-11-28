import { useState } from "react";
import "./Input.css";

export default function Input() {
  const [nickname, setNickname] = useState("");
  const [showPw1, setShowPw1] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  const isNicknameError = nickname.trim() === "";

  return (
    <div className="input-container">
      {/* 닉네임 입력 */}
      <div className="input-wrapper">
        <input
          id="nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          onBlur={() => setNickname(nickname.trim())}
          className={isNicknameError ? "error" : ""}
          placeholder="닉네임을 입력해주세요"
        />
        {isNicknameError && (
          <p className="error-message">*필수 입력 사항입니다.</p>
        )}
      </div>

      {/* 비밀번호 입력 */}
      <div className="input-wrapper">
        <input
          id="password2"
          type={showPw1 ? "text" : "password"}
          placeholder="비밀번호를 입력해주세요"
        />
        <img
          src={showPw1 ? "/img/eye2.svg" : "/img/eye1.svg"}
          className="eye-icon"
          alt="toggle password"
          onClick={() => setShowPw1(!showPw1)}
        />
      </div>

      {/* 비밀번호 확인 입력 */}
      <div className="input-wrapper">
        <input
          id="password2"
          type={showPw2 ? "text" : "password"}
          placeholder="에러사항입니다"
        />
        <img
          src={showPw2 ? "/img/eye2.svg" : "/img/eye1.svg"}
          className="eye-icon"
          alt="toggle password"
          onClick={() => setShowPw2(!showPw2)}
        />
      </div>

      <button type="submit">회원가입</button>
    </div>
  );
}
