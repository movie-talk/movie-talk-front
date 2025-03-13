let debounceTimer;

function validateInputWithDebounce(inputId, errorElementId, regex) {
  // 이전의 타이머를 지운다.
  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    const inputValue = document.getElementById(inputId).value;
    const errorElement = document.getElementById(errorElementId);

    // 유효성 검사
    if (!regex.test(inputValue)) {
      errorElement.style.display = 'block';  // 유효하지 않으면 오류 메시지 보이기
    } else {
      errorElement.style.display = 'none';  // 유효하면 오류 메시지 숨기기
    }
  }, 500);  // 500ms 후에 유효성 검사 실행
}

// 사용 예시
document.getElementById('loginId').addEventListener('input', () => {
  validateInputWithDebounce('loginId', 'idError', /^[a-zA-Z0-9]{6,12}$/);  // 아이디 유효성 검사
});

document.getElementById('loginPassword').addEventListener('input', () => {
  validateInputWithDebounce('loginPassword', 'passwordError', /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/);  // 비밀번호 유효성 검사
});


// 아이디 유효성 검사
const idRegex = /^[a-zA-Z0-9]{6,12}$/;
// 비밀번호 유효성 검사
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
// 이메일 유효성 검사
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

// 로그인 폼 유효성 검사
function validateLogin() {
  const loginId = document.getElementById('loginId').value;
  const loginPassword = document.getElementById('loginPassword').value;

  let valid = true;

  // 아이디 검증
  if (!idRegex.test(loginId)) {
    document.getElementById('idError').style.display = 'block';
    valid = false;
  } else {
    document.getElementById('idError').style.display = 'none';
  }

  // 비밀번호 검증
  if (!passwordRegex.test(loginPassword)) {
    document.getElementById('passwordError').style.display = 'block';
    valid = false;
  } else {
    document.getElementById('passwordError').style.display = 'none';
  }

  if (valid) {
    // 로그인 성공 로직 처리
    alert("로그인 성공");
  }
}

// 회원가입 폼 유효성 검사
function validateSignup() {
  const signupId = document.getElementById('signupId').value;
  const signupPassword = document.getElementById('signupPassword').value;
  const signupEmail = document.getElementById('signupEmail').value;

  let valid = true;

  // 아이디 검증
  if (!idRegex.test(signupId)) {
    document.getElementById('signupIdError').style.display = 'block';
    valid = false;
  } else {
    document.getElementById('signupIdError').style.display = 'none';
  }

  // 비밀번호 검증
  if (!passwordRegex.test(signupPassword)) {
    document.getElementById('signupPasswordError').style.display = 'block';
    valid = false;
  } else {
    document.getElementById('signupPasswordError').style.display = 'none';
  }

  // 이메일 검증
  if (!emailRegex.test(signupEmail)) {
    document.getElementById('signupEmailError').style.display = 'block';
    valid = false;
  } else {
    document.getElementById('signupEmailError').style.display = 'none';
  }

  if (valid) {
    // 회원가입 성공 로직 처리
    alert("회원가입 성공");
  }
}
