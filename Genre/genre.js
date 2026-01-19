
const genreFunc = (genre_id) => {
  const apiBaseURL = 'https://api.themoviedb.org/3/';
  const apiKey = 'af6b563ec687bcd938b75f366399aa4c';
  // Removed imageUrl here as we use it globally or recalculate
  const imageUrl = 'https://image.tmdb.org/t/p/';

  // Inject the Shared Modal HTML if it doesn't exist
  if (!document.getElementById('movie-modal')) {
    const modalHTML = `
        <div 
        role="dialog"
        aria-labelledby="modalTitle"
        aria-describedby="modalOverview"
        aria-modal="true"
        id="movie-modal" class="modal">
            <div class="modal-box">
                <button
                type="button"
                title="Close modal" 
                class="close" aria-label="Close modal">&times;</button>
                <div class="modal-content">
                    <div class="modal-loading" style="display: none; text-align: center; padding: 50px;">
                        <div class="loading"></div>
                    </div>
                    <div class="modal-body">
                        <div class="moviePosterInModal">
                            <img id="modalImage" src="" alt="Movie Poster">
                        </div>
                        <div class="movieDetails">
                            <h2 id="modalTitle" class="movieName"></h2>
                            <div>
                                <div class="release">Release: <span id="modalDate"></span></div>
                                <div class="rating"><span>⭐</span> <span id="modalRating"></span>/10</div>
                            </div>
                            <p id="modalOverview" class="overview"></p>
                            
                             <div class="showtimes-container">
                                <h3>Showtimes</h3>
                                <div class="grid-wrapper">
                                    <div class="time-btn">8:30 AM</div>
                                    <div class="time-btn">10:00 AM</div>
                                    <div class="time-btn">12:30 PM</div>
                                    <div class="time-btn">3:00 PM</div>
                                    <div class="time-btn">4:10 PM</div>
                                    <div class="time-btn">5:30 PM</div>
                                    <div class="time-btn">8:00 PM</div>
                                    <div class="time-btn">10:30 PM</div>
                                </div>
                            </div>
                            <button 
                            id="playTrailerBtn"
                            title="Watch Trailer"
                            aria-label="Begin watching the trailer"
                            >Watch Trailer</button>
                            <div id="videoContainer"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  // DOM Elements after injection
  const modal = document.getElementById("movie-modal");
  const closeModalBtn = document.querySelector(".close");
  const modalBody = document.querySelector(".modal-body");
  const modalLoading = document.querySelector(".modal-loading");

  // Focus Management Variables
  let previousActiveElement = null;
  const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  // Check if elements exist to avoid null errors (if injection failed)
  if (modal) {
    closeModalBtn.onclick = () => {
      modal.style.display = "none";
      document.getElementById("videoContainer").innerHTML = "";
      if (previousActiveElement) previousActiveElement.focus();
    }
    window.onclick = (event) => {
      if (event.target == modal) {
        modal.style.display = "none";
        document.getElementById("videoContainer").innerHTML = "";
        if (previousActiveElement) previousActiveElement.focus();
      }
    }
  }

  // Modal Focus Trap
  modal.addEventListener('keydown', function (e) {
    const isTabPressed = e.key === 'Tab' || e.keyCode === 9;
    if (!isTabPressed) return;

    const focusableContent = modal.querySelectorAll(focusableSelector);
    if (focusableContent.length === 0) return;

    const firstFocusableElement = focusableContent[0];
    const lastFocusableElement = focusableContent[focusableContent.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstFocusableElement) {
        lastFocusableElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusableElement) {
        firstFocusableElement.focus();
        e.preventDefault();
      }
    }
  });

  // Escape Key to Close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      modal.style.display = 'none';
      document.getElementById("videoContainer").innerHTML = "";
      if (previousActiveElement) previousActiveElement.focus();
    }
  });



  const actionUrl = `${apiBaseURL}genre/${genre_id}/movies?api_key=${apiKey}`;

  const fetchGenre = async () => {
    try {
      const response = await fetch(actionUrl);
      const data = await response.json();
      renderResults(data.results);
      updateTitle();
    } catch (error) {
      console.error(error);
      document.getElementById("movie-grid").innerHTML = '<p class="error">Failed to load movies.</p>';
    }
  }

  const renderResults = (movies) => {
    const movieGrid = document.getElementById("movie-grid");
    movieGrid.innerHTML = movies.map(movie => createCard(movie)).join('');
  }

  const createCard = (data) => {
    const { id, title, poster_path } = data;
    const poster = poster_path ? `${imageUrl}w500${poster_path}` : '/Assets/no-image.jpg';
    // We use global openModal function attached to window or defined here
    return `
        <button 
        title="${title}"
        aria-label="Explore ${title} details."
        class="card" onclick="openGenreModal(${id})">
            <div class="image">
                <img loading="lazy" alt="${title} poster." src="${poster}">
            </div>
        </button>`;
  }

  // Define openModal specific to this scope or globally unique
  window.openGenreModal = async (movieId) => {
    previousActiveElement = document.activeElement;
    const modal = document.getElementById("movie-modal");
    const modalLoading = document.querySelector(".modal-loading");
    const modalBody = document.querySelector(".modal-body");

    // Element Refs
    const modalImage = document.getElementById("modalImage");
    const modalTitle = document.getElementById("modalTitle");

    const modalDate = document.getElementById("modalDate");
    const modalRating = document.getElementById("modalRating");
    const modalOverview = document.getElementById("modalOverview");
    const videoContainer = document.getElementById("videoContainer");
    const playTrailerBtn = document.getElementById("playTrailerBtn");

    modal.style.display = "flex";
    modalLoading.style.display = "block";
    modalBody.style.display = "none";
    videoContainer.innerHTML = "";

    try {
      const detailsUrl = `${apiBaseURL}movie/${movieId}?api_key=${apiKey}&language=en-US`;
      const videosUrl = `${apiBaseURL}movie/${movieId}/videos?api_key=${apiKey}&language=en-US`;

      const [detailsRes, videosRes] = await Promise.all([
        fetch(detailsUrl),
        fetch(videosUrl)
      ]);

      const details = await detailsRes.json();
      const videosData = await videosRes.json();
      const trailer = videosData.results.find(v => v.type === 'Trailer') || videosData.results[0];

      // Populate
      modalImage.src = details.poster_path ? `${imageUrl}w500${details.poster_path}` : '/Assets/no-image.jpg';

      modalTitle.textContent = details.title;
      modalDate.textContent = details.release_date;
      modalRating.textContent = details.vote_average;
      modalOverview.textContent = details.overview;

      if (trailer && trailer.key) {
        playTrailerBtn.style.display = "inline-block";
        playTrailerBtn.onclick = () => {
          videoContainer.innerHTML = `<iframe src="https://www.youtube.com/embed/${trailer.key}?autoplay=1" frameborder="0" allowfullscreen allow="autoplay"></iframe>`;
          playTrailerBtn.style.display = "none";
        }
      } else {
        playTrailerBtn.style.display = "none";
      }

      modalLoading.style.display = "none";
      modalBody.style.display = "flex";

      // Move focus to close button
      const focusable = modal.querySelectorAll(focusableSelector);
      if (focusable.length > 0) focusable[0].focus();

    } catch (e) {
      console.error(e);
      modalLoading.textContent = "Error loading details";
    }
  }

  function updateTitle() {
    const movieTitleLabel = document.getElementById("movieTitleLabel");
    const helper = {
      28: 'ACTION',
      16: 'ANIMATION',
      35: 'COMEDY',
      80: 'CRIME',
      18: 'DRAMA',
      10402: 'MUSIC',
      10749: 'ROMANCE'
    }
    const genreName = helper[genre_id] || 'MOVIES';
    movieTitleLabel.textContent = genreName;
  }

  // Start
  fetchGenre();

}

