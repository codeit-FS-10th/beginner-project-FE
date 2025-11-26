function showPointToast(point) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  //toast 요소 생성
  const toast = document.createElement("div");
  toast.classList.add("point_content");

  toast.innerHTML = `
    <h1 class="point_lg">🎉<span class="point_number">$(point)</span>포인트를 획득했습니다!</h1>
    `;

  container.appendChild(toast);

  //애니메이션 후 toast 제거
  setTimeout(() => {
    toast.remove();
  }, 2000); //2초 후 제거
}





//경고 토스트

function showWarningToast() {
  const container = document.getElementById("toast-container");
  if (!container) return;

  //toast 요소 생성
  const toast = document.createElement("div");
  toast.classList.add("warning_content");

  toast.innerHTML = `
    <h3 class="warning_lg">🚨 집중이 중단되었습니다</h3>
    `;

  container.appendChild(toast);

  //애니메이션 후 toast 제거
  setTimeout(() => {
    toast.remove();
  }, 2000); //2초 후 제거
}
