
const copyRight = document.getElementById('copyright');
const currentYear = new Date().getFullYear();
if (copyRight) copyRight.textContent = `All reserved © ${currentYear}`;

// API Configuration
const imageUrl = 'https://image.tmdb.org/t/p/';
const apiBaseURL = 'https://api.themoviedb.org/3/';
const apiKey = 'af6b563ec687bcd938b75f366399aa4c';

// Inject Shared Modal HTML if missing
if (!document.getElementById('movie-modal')) {
  const modalHTML = `
      <div id="movie-modal" class="modal">
          <div class="modal-box">
              <span class="close">&times;</span>
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

                          <button id="playTrailerBtn">Watch Trailer</button>
                          <div id="videoContainer"></div>
                      </div>
                  </div>
              </div>
          </div>
      </div>`;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Modal Interaction Logic
const modal = document.getElementById("movie-modal");
const closeModalBtn = document.querySelector(".close");

if (modal) {
  if (closeModalBtn) {
    closeModalBtn.onclick = () => {
      modal.style.display = "none";
      const vc = document.getElementById("videoContainer");
      if (vc) vc.innerHTML = "";
    }
  }
  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
      const vc = document.getElementById("videoContainer");
      if (vc) vc.innerHTML = "";
    }
  }
}

async function fetchHTMLtext() {
  try {
    const response = await fetch('/Component/header.html');
    const result = await response.text();
    return result;
  } catch (err) {
    console.error('Failed to load header:', err);
  }
}

fetchHTMLtext().then(html => {
  if (html) {
    const header = document.querySelector('.header');
    if (header) {
      header.innerHTML = html;
      if (typeof navbar === 'function') navbar();
    }
  }
});

function initApp() {
  const movieBody = document.querySelectorAll('.div-area .body');
  const spinner = document.querySelectorAll('.home-loader');

  const nowPlayingUrl = `${apiBaseURL}movie/now_playing?api_key=${apiKey}`;
  const topRatedUrl = `${apiBaseURL}movie/top_rated?api_key=${apiKey}`;

  if (movieBody.length > 0) movieBody.forEach(el => el.innerHTML = '');

  const fetchAll = async () => {
    try {
      const [nowPlayingResponse, topRatedResponse] = await Promise.all([
        fetch(nowPlayingUrl),
        fetch(topRatedUrl)
      ]);

      const nowPlaying = await nowPlayingResponse.json();
      const topRated = await topRatedResponse.json();
      return [nowPlaying.results, topRated.results];
    } catch (error) {
      console.error('Error fetching movies:', error);
      return [[], []];
    }
  };

  fetchAll().then(([nowPlayingData, topRatedData]) => {
    renderList(nowPlayingData, 0);
    renderList(topRatedData, 1);

    spinner.forEach(s => s.style.display = 'none');
  });

  const renderList = (data, index) => {
    if (!data || data.length === 0 || !movieBody[index]) return;

    const htmlContent = data.map(movie => createCard(movie)).join('');
    movieBody[index].innerHTML = htmlContent;
  };

  function TextAbstract(text, length) {
    if (text == null) return "";
    if (text.length <= length) return text;
    text = text.substring(0, length);
    const last = text.lastIndexOf(" ");
    text = text.substring(0, last);
    return text + "...";
  }

  const createCard = (data) => {
    const { id, title, poster_path } = data;
    // const minimalTitle = TextAbstract(title, 25); // Title not used in new card design
    const poster = poster_path ? `${imageUrl}w500${poster_path}` : 'Assets/no-image.jpg';

    return `
      <div class="card" onclick="openModal(${id})">
       <div class="image">
         <img loading="lazy" alt="${title}" src="${poster}">
       </div>
      </div>
    `;
  };
}

// Global openModal function
window.openModal = async (movieId) => {
  const modal = document.getElementById("movie-modal");
  const modalLoading = document.querySelector(".modal-loading");
  const modalBody = document.querySelector(".modal-body");

  // Refs
  const modalImage = document.getElementById("modalImage");
  const modalTitle = document.getElementById("modalTitle");
  const modalDate = document.getElementById("modalDate");
  const modalRating = document.getElementById("modalRating");
  const modalOverview = document.getElementById("modalOverview");
  const videoContainer = document.getElementById("videoContainer");
  const playTrailerBtn = document.getElementById("playTrailerBtn");

  modal.style.display = "flex";
  if (modalLoading) modalLoading.style.display = "block";
  if (modalBody) modalBody.style.display = "none";
  if (videoContainer) videoContainer.innerHTML = "";

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
    modalImage.src = details.poster_path ? `${imageUrl}w500${details.poster_path}` : 'Assets/no-image.jpg';
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

    if (modalLoading) modalLoading.style.display = "none";
    if (modalBody) modalBody.style.display = "flex";

  } catch (e) {
    console.error(e);
    if (modalLoading) modalLoading.textContent = "Error loading details";
  }
}

// Intersection Observer
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('move-up');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

initApp();

const movieBodies = document.querySelectorAll('.div-area .body');
movieBodies.forEach(el => observer.observe(el));

const extraDiv = document.querySelector('.extra-div');
if (extraDiv) observer.observe(extraDiv);

// Scroll Up
const angleUpButton = document.querySelector('.scroll_up');
if (angleUpButton) {
  window.addEventListener('scroll', () => {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      angleUpButton.style.display = "block";
    } else {
      angleUpButton.style.display = "none";
    }
  });

  angleUpButton.addEventListener('click', () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  });
}

// Slider controls
window.clickFunctionRight = (getSlider) => {
  // Map identifier string to class or query
  // original code used class passed as string. e.g. 'now_playing'
  // But DOM structure: div.now_playing.body inside slider_container?
  // Actually, original code:
  // <i onclick="clickFunctionRight('now_playing')" ...>
  // DOM: <div class="now_playing body">
  // So querySelector(`.${getSlider}`) works if getSlider is 'now_playing'
  const slider = document.querySelector(`.${getSlider}`);
  if (slider) slider.scrollBy({ left: 300, behavior: 'smooth' });
}

window.clickFunctionLeft = (getSlider) => {
  const slider = document.querySelector(`.${getSlider}`);
  if (slider) slider.scrollBy({ left: -300, behavior: 'smooth' });
}
