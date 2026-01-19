
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

// Focus Management
let previousActiveElement = null;
const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

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

    renderResults(results);

  } catch (error) {
    console.error(error);
    movieGrid.innerHTML = `<p class="placeholder-text" style="color: red;">Something went wrong. Please try again later.</p>`;
  }
}

function renderResults(movies) {
  movieGrid.innerHTML = movies.map(movie => createCard(movie)).join('');
}

function createCard(data) {
  const { id, title, poster_path } = data;
  const poster = poster_path ? `${imageUrl}w500${poster_path}` : '/Assets/no-image.jpg';

  // Changed to button for accessibility
  return `
      <button 
        class="card" 
        onclick="openModal(${id})"
        aria-label="Explore ${title} details."
        title="${title}"
      >
       <div class="image">
         <img loading="lazy" alt="${title} poster." src="${poster}">
       </div>
      </button>
    `;
}

// --- MODAL LOGIC ---

window.openModal = async (movieId) => {
  // Save focus
  previousActiveElement = document.activeElement;

  modal.style.display = "flex";
  modalLoading.style.display = "block";
  modalBody.style.display = "none";
  videoContainer.innerHTML = ""; // Clear old video

  try {
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
    modalImage.alt = `${details.title} poster.`;
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

    // Focus on close button or first focusable element inside modal
    const focusableContent = modal.querySelectorAll(focusableSelector);
    if (focusableContent.length) {
      focusableContent[0].focus();
    }

  } catch (e) {
    console.error(e);
    modalLoading.textContent = "Failed to load details.";
  }
}

const closeModal = () => {
  modal.style.display = "none";
  videoContainer.innerHTML = ""; // Stop video
  if (previousActiveElement) {
    previousActiveElement.focus();
  }
}

closeModalBtn.onclick = closeModal;

window.onclick = (event) => {
  if (event.target == modal) {
    closeModal();
  }
}

// Focus Trap
modal.addEventListener('keydown', function (e) {
  const isTabPressed = e.key === 'Tab' || e.keyCode === 9;
  if (!isTabPressed) return;

  const focusableContent = modal.querySelectorAll(focusableSelector);
  if (focusableContent.length === 0) return;

  const firstFocusableElement = focusableContent[0];
  const lastFocusableElement = focusableContent[focusableContent.length - 1];

  if (e.shiftKey) { // Shift + Tab
    if (document.activeElement === firstFocusableElement) {
      lastFocusableElement.focus();
      e.preventDefault();
    }
  } else { // Tab
    if (document.activeElement === lastFocusableElement) {
      firstFocusableElement.focus();
      e.preventDefault();
    }
  }
});

// Escape key to close
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.style.display === 'flex') {
    closeModal();
  }
});
