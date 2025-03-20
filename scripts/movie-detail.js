let movieId = null;
let userId = null;
let rateValue;

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  movieId = urlParams.get("movieId");
  userId = urlParams.get("userId");

  if (!movieId) {
    window.location.href = "main.html";
    return;
  }

  fetchMovieDetails(movieId);
  displayReviews(movieId);
});

document
  .querySelectorAll(".star-rating:not(.readonly) label")
  .forEach((star) => {
    star.addEventListener("click", function () {
      this.style.transform = "scale(1.2)";
      setTimeout(() => {
        this.style.transform = "scale(1)";
      }, 200);
      const forValue = star.getAttribute("for");
      rateValue = forValue[forValue.length - 1];
    });
  });

const fetchMovieDetails = async (movieId) => {
  try {
    const response = await axios.get(`${MOVIE_API_URL}/${movieId}`);
    displayMovieDetails(response.data);
  } catch (error) {
    console.error("영화 데이터를 가져오는 중 오류 발생:", error);
  }
};

const displayReviews = async (movieId) => {
  try {
    const response = await axios.get(`${BASE_URL}/review/movie/${movieId}`);
    displayReviewsDetails(response.data);
  } catch (error) {
    displayReviewsDetails(error.response.data);
  }
};

const displayReviewsDetails = (reviews) => {
  const reviewsDetailContainer = document.getElementById("reviews");
  const isReviews = typeof reviews === "object";

  reviewsDetailContainer.innerHTML = isReviews
    ? reviews
        .map(
          (review) => `
          <div class="card mb-3 bg-transparent text-white border" data-review-id="${
            review.id
          }">
            <div class="card-body">
            <div class="mb-3 d-flex flex-row justify-content-between">
              <h5 class="card-title">${review.userId}</h5>
              <div class="rating">${"⭐".repeat(review.rating)}</div>
            </div>
              <p class="card-text">${review.content}</p>
              ${
                review.userId &&
                `<div class="d-flex justify-content-end">
                    <button class="btn btn-sm btn-outline-primary me-2 edit-btn">
                      <i class="bi bi-pencil"></i> 수정
                    </button>
                    <button class="btn btn-sm btn-outline-secondary delete-btn">
                      <i class="bi bi-trash3"></i> 삭제
                    </button>
                  </div>`
              }
            </div>
          </div>
        `
        )
        .join("")
    : `<p class="text-white">${reviews}</p>`;

  const editButtons = reviewsDetailContainer.querySelectorAll(".edit-btn");
  const deleteButtons = reviewsDetailContainer.querySelectorAll(".delete-btn");

  editButtons.forEach((button) => {
    const reviewId = button.closest(".card").getAttribute("data-review-id");
    button.addEventListener("click", () => updateReview(reviewId));
  });

  deleteButtons.forEach((button) => {
    const reviewId = button.closest(".card").getAttribute("data-review-id");
    button.addEventListener("click", () => deleteReview(reviewId));
  });
};

const updateReview = (reviewId) => {
  const reviewCard = document.querySelector(`[data-review-id="${reviewId}"]`);
  const reviewContent = reviewCard.querySelector(".card-text").textContent;
  const reviewRating = reviewCard.querySelector(".rating").textContent.length;

  reviewCard.innerHTML = `
    <div class="card-body">
      <div class="mb-3 d-flex flex-row justify-content-between">
        <h5 class="card-title">리뷰 수정</h5>
      </div>
      <div class="mb-3">
        <label class="form-label">별점</label>
        <div class="col-md-6">
          <div class="rating-card p-1">
            <div class="star-rating animated-stars">
              <input type="radio" id="star5" name="rating" value="5" 
                ${reviewRating === 5 ? "checked" : ""} />
              <label for="star5" class="bi bi-star-fill"></label>
              <input type="radio" id="star4" name="rating" value="4" 
                ${reviewRating === 4 ? "checked" : ""} />
              <label for="star4" class="bi bi-star-fill"></label>
              <input type="radio" id="star3" name="rating" value="3" 
                ${reviewRating === 3 ? "checked" : ""} />
              <label for="star3" class="bi bi-star-fill"></label>
              <input type="radio" id="star2" name="rating" value="2" 
                ${reviewRating === 2 ? "checked" : ""} />
              <label for="star2" class="bi bi-star-fill"></label>    
              <input type="radio" id="star1" name="rating" value="1" 
                {reviewRating === 1 ? "checked" : ""} />
              <label for="star1" class="bi bi-star-fill"></label>
            </div>
          </div>
        </div>
      </div>
      <label for="reviewContent" class="form-label">리뷰 내용</label>
      <textarea id="updated-content" class="form-control mb-3">${reviewContent}</textarea>
      <div class="d-flex justify-content-end">
        <button class="btn btn-sm btn-outline-success me-2" onclick="submitUpdateReview('${reviewId}')">수정 완료</button>
        <button class="btn btn-sm btn-outline-danger" onclick="cancelUpdateReview('${reviewId}')">취소</button>
      </div>
    </div>
  `;
};

const submitUpdateReview = (reviewId) => {
  const updatedContent = document.getElementById("updated-content").value;

  const updatedRating = document.querySelector(
    'input[name="rating"]:checked'
  ).value;

  updateReviewRequest(reviewId, updatedContent, updatedRating);
};

const cancelUpdateReview = (reviewId) => {
  const reviewCard = document.querySelector(`[data-review-id="${reviewId}"]`);
  displayReviews(movieId);
};

const updateReviewRequest = async (reviewId, content, rating) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/review/${reviewId}`,
      {
        content: content,
        rating: rating,
      },
      {
        withCredentials: true,
      }
    );
    alert(response.data);
    displayReviews(movieId);
  } catch (error) {
    console.log(error.response.data);
  }
};

const deleteReview = async (reviewId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/review/${reviewId}`, {
      withCredentials: true,
    });
    alert(response.data);
    location.reload();
  } catch (error) {
    alert(error.response.data);
  }
};

function displayMovieDetails(movie) {
  const movieDetailContainer = document.getElementById("movieDetail");

  if (!movieDetailContainer) return;

  const hasPoster = movie.poster_path;
  const posterSize = "300px"; // 원하는 포스터 크기 설정
  
  const posterContent = hasPoster
    ? `<img src="${MOVIE_IMAGE_URL}${movie.poster_path}" class="movie-poster img-fluid rounded shadow" alt="${movie.title}">`
    : `<div class="movie-poster no-poster">이미지 준비중입니다.</div>`;
  
  const backdropPath = movie.backdrop_path
    ? `${MOVIE_IMAGE_URL}${movie.backdrop_path}`
    : null;
  

  if (backdropPath) {
    document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${backdropPath})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.backgroundPosition = "center";
  } else {
    document.body.style.backgroundColor = "#060b2dff";
  }

  movieDetailContainer.innerHTML = `
        <div class="col-md-4 mb-4">
            ${posterContent}
        </div>
        <div class="col-md-8">
            <h1 class="mb-3">${movie.title}</h1>
            <p class="lead">${movie.tagline || ""}</p>
            
            <div class="mb-3">
                <span class="badge bg-primary me-2">개봉일: ${
                  movie.release_date || "정보 없음"
                }</span>
                <span class="badge bg-success me-2">평점: ${
                  movie.vote_average
                    ? movie.vote_average.toFixed(1)
                    : "정보 없음"
                }/10</span>
                <span class="badge bg-info me-2">상영 시간: ${
                  movie.runtime || "정보 없음"
                }분</span>
            </div>
            
            <h3 class="h5 mt-4">줄거리</h3>
            <p>${movie.overview || "줄거리 정보가 없습니다."}</p>
            
            <h3 class="h5 mt-4">장르</h3>
            <p>
                ${
                  movie.genres
                    ? movie.genres
                        .map(
                          (genre) =>
                            `<span class="badge bg-secondary me-2">${genre.name}</span>`
                        )
                        .join("")
                    : "정보 없음"
                }
            </p>
        </div>
    `;
  document.title = `${movie.title} - MOVIETALK`;
}

const insertReview = async () => {
  const reviewInput = document.getElementById("reviewContent");
  const reviewContent = reviewInput.value;

  try {
    const response = await axios.post(
      `${BASE_URL}/review`,
      {
        rating: rateValue,
        content: reviewContent,
      },
      {
        params: { movieId: movieId },
        withCredentials: true,
      }
    );

    alert(response.data);
    location.reload();
  } catch (error) {
    alert(error.response.data);
  }
};

const goToMyReviews = () => {
  window.location.href = `/review.html?userId=${userId}`;
};