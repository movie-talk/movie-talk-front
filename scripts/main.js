let debounceTimer;
let userId;

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
  checkAuthStatus();
});

const checkAuthStatus = async () => {
  const response = await axios.get(`${BASE_URL}/users/me`, {
    withCredentials: true,
  });

  userId = response.data.id

  const loginButton = document.getElementById("loginButton");
  const signupButton = document.getElementById("signupButton");
  const myReviewButton = document.getElementById("myReviewButton");
  const logoutButton = document.getElementById("logoutButton");

  loginButton.innerHTML = response.data
    ? null
    : `<button class="nav-link text-white">로그인</button>`;

  signupButton.innerHTML = response.data
    ? null
    : `<button class="nav-link text-white">회원가입</button>`;

  myReviewButton.innerHTML = response.data
    ? `<a class="nav-link text-white" href="/review.html?userId=${response.data.id}">마이리뷰</a>`
    : null;
  logoutButton.innerHTML = response.data
    ? `<button class="nav-link text-white">로그아웃</button>`
    : null;
};

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

  moviesContainer.innerHTML = "";

  movies.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.className = "col";

    const posterPath = movie.poster_path
      ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="movie-poster card-img-top" alt="${movie.title}">`
      : `<div class="main-poster">이미지 준비 중</div>`;

    movieCard.innerHTML = `
            <div class="card movie-card">
                ${posterPath}
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
                    <a href="movie-detail.html?movieId=${
                      movie.id
                    }&userId=${userId}" class="btn btn-primary w-100">상세 정보</a>
                </div>
            </div>
        `;

    moviesContainer.appendChild(movieCard);
  });
};

async function checkIdAvailability() {
  const signupId = document.getElementById("signupId").value;
  const errorElement = document.getElementById("idError");

  if (!idRegex.test(signupId)) {
    errorElement.style.display = "block";
    errorElement.textContent =
      "아이디는 6~12자의 영문, 숫자로 입력해야 합니다.";
    return;
  }

  try {
    console.log(`Checking ID: ${signupId}`);

    const response = await axios.post(`${BASE_URL}/users/check-id`, {
      id: signupId,
    });

    console.log("Server Response:", response.data);

    if (response.data.exists) {
      errorElement.style.display = "block";
      errorElement.textContent = "이미 사용 중인 아이디입니다.";
    } else {
      errorElement.style.display = "none";
    }
  } catch (error) {
    console.error(
      "아이디 중복 검사 오류:",
      error.response?.data || error.message
    );
    errorElement.style.display = "block";
    errorElement.textContent = "아이디 중복 검사를 할 수 없습니다.";
  }
}

async function checkNicknameAvailability() {
  const signupNickname = document.getElementById("signupNickname").value;
  const errorElement = document.getElementById("nicknameError");

  if (!nicknameRegex.test(signupNickname)) {
    errorElement.style.display = "block";
    errorElement.textContent =
      "닉네임은 2~10자의 한글, 영문, 숫자로 입력해야 합니다.";
    return;
  }

  try {
    const response = await axios.post(`${BASE_URL}/users/check-nickname`, {
      nickname: signupNickname,
    });

    if (response.data.exists) {
      errorElement.style.display = "block";
      errorElement.textContent = "이미 사용 중인 닉네임입니다.";
    } else {
      errorElement.style.display = "none";
    }
  } catch (error) {
    console.error("닉네임 중복 검사 오류:", error);
    errorElement.style.display = "block";
    errorElement.textContent = "닉네임 중복 검사를 할 수 없습니다.";
  }
}

document.getElementById("signupId").addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(checkIdAvailability, 300);
});

document.getElementById("signupNickname").addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(checkNicknameAvailability, 300);
});

// 회원가입 폼 제출 처리
document
  .getElementById("signupForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // 폼 제출 시 페이지 새로고침 방지

    const signupId = document.getElementById("signupId").value;
    const signupPassword = document.getElementById("signupPassword").value;
    const signupPasswordConfirm = document.getElementById(
      "signupPasswordConfirm"
    ).value;
    const signupNickname = document.getElementById("signupNickname").value;

    // 입력 값 검증
    if (signupPassword !== signupPasswordConfirm) {
      document.getElementById("passwordConfirmError").style.display = "block";
      return;
    } else {
      document.getElementById("passwordConfirmError").style.display = "none";
    }
    try {
      const response = await axios.post(`${BASE_URL}/users/signup`, {
        id: signupId,
        password: signupPassword,
        nickname: signupNickname,
      });

      alert(response.data); // "회원가입 성공" 메시지
      document.getElementById("signupClose").click(); // 모달 닫기
    } catch (error) {
      alert(error.response.data);
    }
  });

// 로그인 폼 제출 처리
document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // 폼 제출 시 페이지 새로고침 방지

    const loginId = document.getElementById("loginId").value;
    const loginPassword = document.getElementById("loginPassword").value;

    try {
      // API 호출 (로그인)
      const response = await axios.post(
        `${BASE_URL}/users/login`,
        {
          id: loginId,
          password: loginPassword,
        },
        { withCredentials: true }
      );

      // 로그인 성공 시
      alert(response.data);
      document.getElementById("loginClose").click(); // 모달 닫기
      location.reload();
    } catch (error) {
      alert(error.response.data);
    }
  });

// 로그아웃 처리
document
  .getElementById("logoutButton")
  .addEventListener("click", async function () {
    try {
      const response = await axios.post(`${BASE_URL}/users/logout`, {
        withCredentials: true,
      });

      alert(response.data);

      location.href="/main.html";
    } catch (error) {
      alert(error.response.data);
    }
  });

document
  .getElementById("myReviewButton")
  .addEventListener("click", async function () {
    try {
      const response = await axios.post(`${BASE_URL}/users/logout`, {
        withCredentials: true,
      });

      alert(response.data);
    } catch (error) {
      alert(error.response.data);
    }
  });

document
  .getElementById("searchForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // 폼 제출 방지
    const query = document.getElementById("searchInput").value.trim();

    if (query === "") {
      alert("검색어를 입력하세요!");
      return;
    }

    searchMovies(query);
    searchInput.value = "";
  });

function searchMovies(query) {
  const apiKey = "e82db80f9be0ebd98345d4ec3396ad2e"; // 🔹 여기에 실제 API 키 입력
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=ko-KR&query=${encodeURIComponent(
    query
  )}`;

  axios
    .get(url)
    .then((response) => {
      const movies = response.data.results;
      displayMovies2(movies);
    })
    .catch((error) => {
      console.error("검색 오류:", error);
    });
}

function displayMovies2(movies) {
  const moviesContainer = document.getElementById("movies");

  if (!moviesContainer) return;

  moviesContainer.innerHTML = "";

  movies.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.className = "col";

    console.log(movie.id);
    const posterPath = movie.poster_path
  ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="movie-poster card-img-top" alt="${movie.title}">`
  : `<div class="movie-poster-placeholder card-img-top d-flex align-items-center justify-content-center">
        이미지 준비 중
     </div>`;

     movieCard.innerHTML = `
     <div class="card movie-card">
         ${posterPath}
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
             <a href="movie-detail.html?movieId=${
               movie.id
             }&userId=${userId}" class="btn btn-primary w-100">상세 정보</a>
         </div>
     </div>
 `;


    moviesContainer.appendChild(movieCard);
  });
}