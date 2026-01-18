
const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-box");
const movieGrid = document.getElementById("movie-grid");
const movieTitleLabel = document.getElementById("movieTitleLabel");
const searchForm = document.getElementById("search-form");

// Modal Elements
const modal = document.getElementById("movie-modal");
const closeModalBtn = document.querySelector(".close");
const overlay = document.getElementById("overlay");
const modalBody = document.querySelector(".modal-body");
const modalLoading = document.querySelector(".modal-loading");

const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalDate = document.getElementById("modalDate");
const modalRating = document.getElementById("modalRating");
const modalOverview = document.getElementById("modalOverview");
const videoContainer = document.getElementById("videoContainer");
const playTrailerBtn = document.getElementById("playTrailerBtn");

// API Config
const imageUrl = 'https://image.tmdb.org/t/p/';
const apiBaseURL = 'https://api.themoviedb.org/3/';
const apiKey = 'af6b563ec687bcd938b75f366399aa4c';

// Handle Search Submit
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = searchInput.value.trim();
  if (query) {
    searchMovie(query);
  }
});

async function searchMovie(query) {
  // Show Loader
  movieGrid.innerHTML = `<div class="loading"></div>`;
  movieTitleLabel.textContent = `Results for: "${query}"`;

  const searchMovieUrl = `${apiBaseURL}search/movie?api_key=${apiKey}&language=en-US&page=1&include_adult=false&query=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(searchMovieUrl);
    if (!response.ok) throw new Error('Search failed');

    const data = await response.json();
    const results = data.results;

    if (!results || results.length === 0) {
      movieGrid.innerHTML = `<p class="placeholder-text">No movies found matching "${query}". Try another name.</p>`;
      return;
    }

    // Save results globally or pass data? We'll render with IDs and fetch details on click.
    renderResults(results);

  } catch (error) {
    console.error(error);
    movieGrid.innerHTML = `<p class="placeholder-text" style="color: red;">Something went wrong. Please try again later.</p>`;
  }
}

function renderResults(movies) {
  movieGrid.innerHTML = movies.map(movie => createCard(movie)).join('');
}

function TextAbstract(text, length) {
  if (text == null) return "";
  if (text.length <= length) return text;
  text = text.substring(0, length);
  const last = text.lastIndexOf(" ");
  text = text.substring(0, last);
  return text + "...";
}

function createCard(data) {
  const { id, title, release_date, poster_path, overview, vote_average } = data;

  const poster = poster_path ? `${imageUrl}w500${poster_path}` : '/Assets/no-image.jpg';

  // Identify the card with the Movie ID to fetch details later
  // We can also store simple data in data-attributes to avoid a fetch if possible
  // BUT we need the trailer key, which requires a fetch.
  // So we'll fetch everything fresh or pass the known data.

  // JSON.stringify small data for the onClick to openModal
  // Note: Handling quotes in stringify is tricky in inline HTML.
  // Better to global accessible array or just fetch by ID. 
  // We'll fetch by ID for simplicity and robustness.

  return `
      <div class="card" onclick="openModal(${id})">
       <div class="image">
         <img loading="lazy" alt="${title}" src="${poster}">
       </div>
       <!-- Overlay removed to look cleaner, or add back if requested -->
      </div>
    `;
}

// --- MODAL LOGIC ---

window.openModal = async (movieId) => {
  modal.style.display = "flex";
  modalLoading.style.display = "block";
  modalBody.style.display = "none";
  videoContainer.innerHTML = ""; // Clear old video

  try {
    // Fetch Movie Details + Videos
    // Using append_to_response to get videos in one shot if we were using movie details endpoint
    // But here we might just need the scalar details we already had?
    // Let's re-fetch to be safe and simple.

    // 1. Fetch details
    const detailsUrl = `${apiBaseURL}movie/${movieId}?api_key=${apiKey}&language=en-US`;
    const detailsRes = await fetch(detailsUrl);
    const details = await detailsRes.json();

    // 2. Fetch Videos
    const videosUrl = `${apiBaseURL}movie/${movieId}/videos?api_key=${apiKey}&language=en-US`;
    const videosRes = await fetch(videosUrl);
    const videosData = await videosRes.json();
    const trailer = videosData.results.find(v => v.type === 'Trailer') || videosData.results[0];

    // Populate Modal
    modalImage.src = details.poster_path ? `${imageUrl}w500${details.poster_path}` : '/Assets/no-image.jpg';
    modalTitle.textContent = details.title;
    modalDate.textContent = details.release_date;
    modalRating.textContent = details.vote_average;
    modalOverview.textContent = details.overview;

    // Setup Trailer Button
    if (trailer && trailer.key) {
      playTrailerBtn.style.display = "inline-block";
      playTrailerBtn.onclick = () => {
        // Embed Youtube
        videoContainer.innerHTML = `
                 <iframe src="https://www.youtube.com/embed/${trailer.key}?autoplay=1" frameborder="0" allowfullscreen allow="autoplay"></iframe>
               `;
        playTrailerBtn.style.display = "none";
      };
    } else {
      playTrailerBtn.style.display = "none";
      videoContainer.innerHTML = "<p>No trailer available.</p>";
    }

    // Show
    modalLoading.style.display = "none";
    modalBody.style.display = "flex";

  } catch (e) {
    console.error(e);
    modalLoading.textContent = "Failed to load details.";
  }
}

closeModalBtn.onclick = () => {
  modal.style.display = "none";
  videoContainer.innerHTML = ""; // Stop video
}

window.onclick = (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
    videoContainer.innerHTML = "";
  }
}