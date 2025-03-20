document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  userId = urlParams.get("userId");

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

const displayReviewsDetails = (reviews) => {
  const myReviewContainer = document.getElementById("myReviewContainer");
  const isReviews = typeof reviews === "object";

  myReviewContainer.innerHTML = isReviews
    ? reviews
        .map(
          (review) => `
          <div class="review-card">
            <div class="review-header">
            <span class="review-title">🎬 ${review.nickname}</span>
        </div>
        <div class="rating">${"⭐".repeat(review.rating)}</div>
        <p class="review-content">${review.content}</p>
        <div class="review-actions">
            <a class="btn btn-primary btn-sm" href="movie-detail.html?movieId=${
              review.movieId
            }">영화 상세 정보 보러가기</a>
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

document
  .getElementById("logoutButton")
  .addEventListener("click", async function () {
    try {
      const response = await axios.post(`${BASE_URL}/users/logout`, {
        withCredentials: true,
      });

      alert(response.data);

      location.replace("/main.html");
    } catch (error) {
      alert(error.response.data);
    }
  });
