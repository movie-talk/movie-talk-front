let debounceTimer;

const idRegex = /^[a-zA-Z0-9]{6,12}$/;
const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
const nicknameRegex = /^[가-힣\w\d]{2,10}$/;

// 비밀번호 확인 유효성 검사
function validatePasswordConfirm() {
  const password = document.getElementById("signupPassword").value;
  const passwordConfirm = document.getElementById(
    "signupPasswordConfirm"
  ).value;
  const errorElement = document.getElementById("passwordConfirmError");

  if (password !== passwordConfirm) {
    errorElement.style.display = "block"; // 비밀번호 확인이 일치하지 않으면 오류 메시지 표시
    return false;
  } else {
    errorElement.style.display = "none"; // 비밀번호 확인이 일치하면 오류 메시지 숨기기
    return true;
  }
}
function validateInputWithDebounce(inputId, errorElementId, regex, formType) {
  // 이전의 타이머를 지운다.
  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    const inputValue = document.getElementById(inputId).value;
    const errorElement = errorElementId
      ? document.getElementById(errorElementId)
      : null;

    // 유효성 검사
    if (inputValue && !regex.test(inputValue)) {
      if (errorElement) {
        errorElement.style.display = "block"; // 회원가입 시에만 오류 메시지 표시
      }
    } else {
      if (errorElement) {
        errorElement.style.display = "none"; // 오류 메시지 숨기기
      }
    }
    validateForm(formType); // 폼 타입에 맞게 validateForm 호출
  }, 300);
}

// 즉시 검사 함수 (버튼 클릭 시)
function validateImmediately(inputId, errorElementId, regex) {
  const inputValue = document.getElementById(inputId).value;
  const errorElement = errorElementId
    ? document.getElementById(errorElementId)
    : null;

  if (inputValue && !regex.test(inputValue)) {
    if (errorElement) errorElement.style.display = "block";
    return false;
  } else {
    if (errorElement) errorElement.style.display = "none";
    return true;
  }
}

// 버튼 활성화/비활성화 함수
function validateForm(formType) {
  let isValid = false;

  if (formType === "login") {
    const loginIdValue = document.getElementById("loginId").value;
    const loginPasswordValue = document.getElementById("loginPassword").value;

    // 로그인 버튼 활성화 조건: 아이디와 비밀번호 입력 값이 각각 한 글자 이상일 경우
    if (loginIdValue && loginPasswordValue) {
      isValid = true;
    }

    // 로그인 모달의 '로그인' 버튼을 활성화/비활성화
    document.getElementById("loginOk").disabled = !isValid;
  } else if (formType === "signup") {
    const isIdValid = validateImmediately("signupId", "idError", idRegex);
    const isPasswordValid = validateImmediately(
      "signupPassword",
      "passwordError",
      passwordRegex
    );
    const isNicknameValid = validateImmediately(
      "signupNickname",
      "nicknameError",
      nicknameRegex
    );
    const isPasswordConfirmValid = validatePasswordConfirm();
    isValid =
      isIdValid && isPasswordValid && isNicknameValid && isPasswordConfirmValid;

    // 회원가입 모달의 '회원가입' 버튼을 활성화/비활성화
    document.getElementById("signupOk").disabled = !isValid;
  }
}

// 로그인 입력 필드 (오류 메시지 없음)
document.getElementById("loginId").addEventListener("input", () => {
  validateInputWithDebounce("loginId", null, idRegex, "login");
});
document.getElementById("loginPassword").addEventListener("input", () => {
  validateInputWithDebounce("loginPassword", null, passwordRegex, "login");
});

// 회원가입 입력 필드 (오류 메시지 표시)
document.getElementById("signupId").addEventListener("input", () => {
  validateInputWithDebounce("signupId", "idError", idRegex, "signup");
});
document.getElementById("signupPassword").addEventListener("input", () => {
  validateInputWithDebounce(
    "signupPassword",
    "passwordError",
    passwordRegex,
    "signup"
  );
});
document.getElementById("signupNickname").addEventListener("input", () => {
  validateInputWithDebounce(
    "signupNickname",
    "nicknameError",
    nicknameRegex,
    "signup"
  );
});
document
  .getElementById("signupPasswordConfirm")
  .addEventListener("input", () => {
    validatePasswordConfirm(); // 비밀번호 확인 검사를 실행합니다.
    validateForm("signup"); // 회원가입 폼 유효성 검사
  });


// 모달이 닫힐 때 입력 필드 초기화
document
  .getElementById("loginModal")
  .addEventListener("hidden.bs.modal", () => {
    document.getElementById("loginForm").reset();
    document.getElementById("loginOk").disabled = true;
  });

document
  .getElementById("signupModal")
  .addEventListener("hidden.bs.modal", () => {
    document.getElementById("signupForm").reset();
    document.getElementById("signupOk").disabled = true;

    document.getElementById("idError").style.display = "none";
    document.getElementById("passwordError").style.display = "none";
    document.getElementById("nicknameError").style.display = "none";
    document.getElementById("passwordConfirmError").style.display = "none";
  });

document.addEventListener("DOMContentLoaded", () => {
  fetchMovies();
});










const fetchMovies = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8080/api/movies/now-playing"
    );
    displayMovies(response.data.results);
  } catch (error) {
    console.error("영화 데이터를 가져오는 중 오류 발생:", error);
  }
};

const displayMovies = (movies) => {
  const moviesContainer = document.getElementById("movies");

  if (!moviesContainer) return;
  console.log(movies);

  moviesContainer.innerHTML = "";

  movies.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.className = "col";

    const posterPath = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "https://via.placeholder.com/500x750?text=No+Image";

    movieCard.innerHTML = `
            <div class="card movie-card">
                <img src="${posterPath}" class="movie-poster card-img-top" alt="${
      movie.title
    }">
                <div class="card-body">
                    <h5 class="card-title text-truncate">${movie.title}</h5>
                    <p class="card-text">
                        <small class="text-muted">개봉일: ${
                          movie.release_date || "정보 없음"
                        }</small>
                    </p>
                    <p class="card-text">평점: ${
                      movie.vote_average
                        ? movie.vote_average.toFixed(1)
                        : "정보 없음"
                    }/10</p>
                    <a href="movie-detail.html?id=${
                      movie.id
                    }" class="btn btn-primary w-100">상세 정보</a>
                </div>
            </div>
        `;

    moviesContainer.appendChild(movieCard);
  });
};


// 회원가입 폼 제출 처리
document.getElementById('signupForm').addEventListener('submit', async function (event) {
  event.preventDefault(); // 폼 제출 시 페이지 새로고침 방지

  const signupId = document.getElementById('signupId').value;
  const signupPassword = document.getElementById('signupPassword').value;
  const signupPasswordConfirm = document.getElementById('signupPasswordConfirm').value;
  const signupNickname = document.getElementById('signupNickname').value;

  // 입력 값 검증
  if (signupPassword !== signupPasswordConfirm) {
    document.getElementById('passwordConfirmError').style.display = 'block';
    return;
  } else {
    document.getElementById('passwordConfirmError').style.display = 'none';
  }

  try {
    // API 호출 (회원가입)
    const response = await axios.post('http://localhost:8080/users/signup', {
      id: signupId,
      password: signupPassword,
      nickname: signupNickname
    });

    // 성공적으로 회원가입된 경우
    alert(response.data); // "회원가입 성공" 메시지
    document.getElementById('signupClose').click(); // 모달 닫기
  } catch (error) {
    if (error.response) {
      // 서버에서 반환한 에러 메시지
      alert(error.response.data);
    } else {
      alert('회원가입 실패. 서버 오류.');
    }
  }
});

// 로그인 폼 제출 처리
document.getElementById('loginForm').addEventListener('submit', async function (event) {
  event.preventDefault(); // 폼 제출 시 페이지 새로고침 방지

  const loginId = document.getElementById('loginId').value;
  const loginPassword = document.getElementById('loginPassword').value;

  try {
    // API 호출 (로그인)
    const response = await axios.post('http://localhost:8080/users/login', {
      id: loginId,
      password: loginPassword
    });

    // 로그인 성공 시
    alert(response.data); // "로그인 성공"
    document.getElementById('loginClose').click(); // 모달 닫기

    // 로그인 후 처리 예시 (세션 관리 등)
    // 예: 로그인 후 화면에 사용자 정보 표시 등 추가 작업

  } catch (error) {
    if (error.response) {
      // 서버에서 반환한 에러 메시지
      alert(error.response.data); // 로그인 실패 메시지
    } else {
      alert('로그인 실패. 서버 오류.');
    }
  }
});
