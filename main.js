let debounceTimer;

// 아이디 유효성 검사
const idRegex = /^[a-zA-Z0-9]{6,12}$/;
// 비밀번호 유효성 검사
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
// 이메일 유효성 검사
//const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
//닉네임
const nicknameRegex = /^[가-힣\w\d]{2,10}$/;

// 비밀번호 확인 유효성 검사
function validatePasswordConfirm() {
  const password = document.getElementById('signupPassword').value;
  const passwordConfirm = document.getElementById('signupPasswordConfirm').value;
  const errorElement = document.getElementById('passwordConfirmError');

  if (password !== passwordConfirm) {
    errorElement.style.display = 'block';  // 비밀번호 확인이 일치하지 않으면 오류 메시지 표시
    return false;
  } else {
    errorElement.style.display = 'none';  // 비밀번호 확인이 일치하면 오류 메시지 숨기기
    return true;
  }
}

function validateInputWithDebounce(inputId, errorElementId, regex, formType) {
  // 이전의 타이머를 지운다.
  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    const inputValue = document.getElementById(inputId).value;
    const errorElement = errorElementId ? document.getElementById(errorElementId) : null;

    // 유효성 검사
    if (inputValue && !regex.test(inputValue)) {
      if (errorElement) {
        errorElement.style.display = 'block';  // 회원가입 시에만 오류 메시지 표시
      }
    } else {
      if (errorElement) {
        errorElement.style.display = 'none';  // 오류 메시지 숨기기
      }
    }
    validateForm(formType); // 폼 타입에 맞게 validateForm 호출
  }, 300);
}

// 즉시 검사 함수 (버튼 클릭 시)
function validateImmediately(inputId, errorElementId, regex) {
  const inputValue = document.getElementById(inputId).value;
  const errorElement = errorElementId ? document.getElementById(errorElementId) : null;

  if (inputValue && !regex.test(inputValue)) {
    if (errorElement) errorElement.style.display = 'block';
    return false;
  } else {
    if (errorElement) errorElement.style.display = 'none';
    return true;
  }
}

// 버튼 활성화/비활성화 함수
function validateForm(formType) {
  let isValid = false;

  if (formType === 'login') {
    const loginIdValue = document.getElementById('loginId').value;
    const loginPasswordValue = document.getElementById('loginPassword').value;

    // 로그인 버튼 활성화 조건: 아이디와 비밀번호 입력 값이 각각 한 글자 이상일 경우
    if (loginIdValue && loginPasswordValue) {
      isValid = true;
    }

    // 로그인 모달의 '로그인' 버튼을 활성화/비활성화
    document.getElementById('loginOk').disabled = !isValid;
  } else if (formType === 'signup') {
    const isIdValid = validateImmediately('signupId', 'idError', idRegex);
    const isPasswordValid = validateImmediately('signupPassword', 'passwordError', passwordRegex);
    const isNicknameValid = validateImmediately('signupNickname', 'nicknameError', nicknameRegex);
    const isPasswordConfirmValid = validatePasswordConfirm();
    isValid = isIdValid && isPasswordValid && isNicknameValid && isPasswordConfirmValid;

    // 회원가입 모달의 '회원가입' 버튼을 활성화/비활성화
    document.getElementById('signupOk').disabled = !isValid;
  }
}


// 로그인 입력 필드 (오류 메시지 없음)
document.getElementById('loginId').addEventListener('input', () => {
  validateInputWithDebounce('loginId', null, idRegex, 'login');
});
document.getElementById('loginPassword').addEventListener('input', () => {
  validateInputWithDebounce('loginPassword', null, passwordRegex, 'login');
});

// 회원가입 입력 필드 (오류 메시지 표시)
document.getElementById('signupId').addEventListener('input', () => {
  validateInputWithDebounce('signupId', 'idError', idRegex, 'signup');
});
document.getElementById('signupPassword').addEventListener('input', () => {
  validateInputWithDebounce('signupPassword', 'passwordError', passwordRegex, 'signup');
});
document.getElementById('signupNickname').addEventListener('input', () => {
  validateInputWithDebounce('signupNickname', 'nicknameError', nicknameRegex, 'signup');
});
document.getElementById('signupPasswordConfirm').addEventListener('input', () => {
  validatePasswordConfirm(); // 비밀번호 확인 검사를 실행합니다.
  validateForm('signup'); // 회원가입 폼 유효성 검사
});


// 로그인 버튼 클릭 시
document.getElementById('loginOk').addEventListener('click', () => {
  const isIdValid = validateImmediately('loginId', null, idRegex);
  const isPasswordValid = validateImmediately('loginPassword', null, passwordRegex);

  if (isIdValid && isPasswordValid) {
    alert("로그인 성공");

    // 로그인 모달 닫기
    const loginModalElement = document.getElementById('loginModal');
    const loginModal = bootstrap.Modal.getInstance(loginModalElement) || new bootstrap.Modal(loginModalElement);
    loginModal.hide();
  } else {
    alert("로그인 정보를 다시 확인하세요.");
  }
});

// 회원가입 버튼 클릭 시
document.getElementById('signupOk').addEventListener('click', () => {
  const isIdValid = validateImmediately('signupId', 'idError', idRegex);
  const isPasswordValid = validateImmediately('signupPassword', 'passwordError', passwordRegex);
  const isNicknameValid = validateImmediately('signupNickname', 'nicknameError', nicknameRegex);
  const isPasswordConfirmValid = validatePasswordConfirm();

  if (isIdValid && isPasswordValid && isNicknameValid && isPasswordConfirmValid) {
    alert("회원가입 성공");

    // 회원가입 모달 닫기
    const signupModalElement = document.getElementById('signupModal');
    const signupModal = bootstrap.Modal.getInstance(signupModalElement) || new bootstrap.Modal(signupModalElement);
    signupModal.hide();
  } else {
    alert("입력한 정보를 다시 확인하세요.");
  }
});

// 모달이 닫힐 때 입력 필드 초기화
document.getElementById('loginModal').addEventListener('hidden.bs.modal', () => {
  document.getElementById('loginId').value = "";
  document.getElementById('loginPassword').value = "";
  document.getElementById('loginOk').disabled = true;
});

document.getElementById('signupModal').addEventListener('hidden.bs.modal', () => {
  document.getElementById('signupId').value = "";
  document.getElementById('signupPassword').value = "";
  document.getElementById('signupPasswordConfirm').value = ""; // 비밀번호 확인 필드 초기화
  document.getElementById('signupNickname').value = "";
  document.getElementById('signupOk').disabled = true;

  document.getElementById('idError').style.display = "none";
  document.getElementById('passwordError').style.display = "none";
  document.getElementById('nicknameError').style.display = "none";
  document.getElementById('passwordConfirmError').style.display = "none"; // 비밀번호 확인 오류 메시지 숨기기
});