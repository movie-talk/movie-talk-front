let movieId = null;

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  movieId = urlParams.get("id");

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
    });
  });

const fetchMovieDetails = async (movieId) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/movies/now-playing/${movieId}`,
      { withCredentials: true }
    );
    displayMovieDetails(response.data);
  } catch (error) {
    console.error("영화 데이터를 가져오는 중 오류 발생:", error);
  }
};

function displayMovieDetails(movie) {
  const movieDetailContainer = document.getElementById("movieDetail");

  if (!movieDetailContainer) return;

  const posterPath = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";

  const backdropPath = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
    : null;

  if (backdropPath) {
    document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${backdropPath})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.backgroundPosition = "center";
    document.querySelector("main").style.color = "#fff";
  }

  movieDetailContainer.innerHTML = `
        <div class="col-md-4 mb-4">
            <img src="${posterPath}" class="img-fluid rounded shadow" alt="${
    movie.title
  }">
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
