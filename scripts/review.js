document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("userId");

  displayReviews(userId);
});

const displayReviews = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/review/user/${userId}`);
    displayReviewsDetails(response.data);
  } catch (error) {
    displayReviewsDetails(error.response.data);
  }
};

const searchMovies = async (movieId) => {
  const apiKey = "e82db80f9be0ebd98345d4ec3396ad2e"; // TMDB API Key
  const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=ko-KR`;
  // const posterPath = movie.poster_path
  //     ? `<img src="https://image.tmdb.org/t/p/w500${reponse.data.poster_path}" class="movie-poster card-img-top" alt="${movie.title}">`
  //     : `<div class="main-poster">이미지 준비 중</div>`;

  try {
    const response = await axios.get(url);
    return response.data.title; // 영화 제목 반환
  } catch (error) {
    console.error("영화 제목을 가져오지 못했습니다.", error);
    return "영화 제목을 불러올 수 없습니다."; // 실패 시 기본값 반환
  }
};

const displayReviewsDetails = (reviews) => {
  const myReviewContainer = document.getElementById("myReviewContainer");
  const isReviews = typeof reviews === "object";

  myReviewContainer.innerHTML = isReviews
    ? reviews
        .map(
          (review) => `
          <div class="review-card">
            <div class="review-header">
  <span class="review-title">
    🎬 <span class="movie-title" id="movie-title-${review.movieId}">영화 제목 로딩 중...</span>
  </span>
  <div class="rating">${"⭐".repeat(review.rating)}</div>
</div>

            <p class="review-content">${review.content}</p>
            <div class="review-actions">
              <a class="btn btn-primary btn-sm" href="movie-detail.html?movieId=${review.movieId}">
                영화 상세 정보 보러가기
              </a>
            </div>
          </div>`
        )
        .join("")
    : `<p class="text-white">${reviews}</p>`;

  // 영화 제목을 각 리뷰에 맞게 업데이트
  reviews.forEach(async (review) => {
    const movieTitleElement = document.getElementById(`movie-title-${review.movieId}`);
    const title = await searchMovies(review.movieId);
    movieTitleElement.textContent = title; // 제목 업데이트
  });
};
