import { getToken } from "./auth";

export async function apiFetch(url, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...options, headers });

  if (res.status === 401) {
    // 인증 실패 → 토큰 제거 + 비밀번호 재입력 요구
    localStorage.removeItem("study_access_token");
    alert("인증이 만료되어 다시 로그인 해주세요");
    window.location.href = "/study"; // 상세 페이지 이동
    return;
  }

  return res.json();
}