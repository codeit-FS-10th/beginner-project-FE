console.log('input.js 로드됨!');

const nicknameInput = document.getElementById('nickname');
const passwordInput = document.getElementById('password');
const password2Input = document.getElementById('password2');
const submitButton = document.querySelector('button[type="submit"]')


nicknameInput.addEventListener('blur', function() {
    const errorElement = nicknameInput.nextElementSibling;

    if (nicknameInput.value === '') {
        //에러 표시
      nicknameInput.classList.add('error');
        errorElement.textContent = '*필수 입력 사항입니다.';
        errorElement.classList.add('show');
    } else {
        //에러 해제
      nicknameInput.classList.remove('error');
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
});

toggleBtn.addEventListener('click', function() {
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    toggleBtn.src = 'eye2.svg'; // 눈 뜬 아이콘으로 변경
  } else {
    passwordInput.type = 'password';
    toggleBtn.src = 'eye1.svg'; // 눈 감은 아이콘으로 변경
  }
});