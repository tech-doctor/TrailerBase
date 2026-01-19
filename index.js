
// const copyRight = document.getElementById('copyright');
// const currentYear = new Date().getFullYear();
// if (copyRight) copyRight.textContent = `All reserved © ${currentYear}`;

// // API Configuration
// const imageUrl = 'https://image.tmdb.org/t/p/';
// const apiBaseURL = 'https://api.themoviedb.org/3/';
// const apiKey = 'af6b563ec687bcd938b75f366399aa4c';

// // Inject Shared Modal HTML if missing
// if (!document.getElementById('movie-modal')) {
//   const modalHTML = `
//       <div 
//       role="dialog"
//       aria-labelledby="modalTitle"
//       aria-describedby="modalOverview"
//       aria-modal="true"
//       id="movie-modal" class="modal" hidden>
//           <div class="modal-box">
//               <button 
//               type="button"
//               title="Close modal"
//               class="close" aria-label="Close modal">&times;</button>
//               <div class="modal-content">
//                   <div class="modal-loading" 
//                   aria-live="polite " style="display: none; text-align: center; padding: 50px;">
//                       <div class="loading"></div>
//                   </div>
//                   <div class="modal-body">
//                       <div class="moviePosterInModal">
//                           <img id="modalImage" src="" alt="Movie Poster">
//                       </div>
//                       <div class="movieDetails">
//                           <h2 id="modalTitle" class="movieName"></h2>
//                           <div>
//                               <div class="release">Release: <span id="modalDate"></span></div>
//                               <div class="rating"><span 
//                               aria-hidden="true"
//                               >⭐</span> <span id="modalRating"></span>/10</div>
//                           </div>
//                           <p id="modalOverview" class="overview"></p>

//                            <div class="showtimes-container">
//                               <h3>Showtimes</h3>
//                               <div class="grid-wrapper">
//                                   <div class="time-btn">8:30 AM</div>
//                                   <div class="time-btn">10:00 AM</div>
//                                   <div class="time-btn">12:30 PM</div>
//                                   <div class="time-btn">3:00 PM</div>
//                                   <div class="time-btn">4:10 PM</div>
//                                   <div class="time-btn">5:30 PM</div>
//                                   <div class="time-btn">8:00 PM</div>
//                                   <div class="time-btn">10:30 PM</div>
//                               </div>
//                           </div>

//                           <button 
//                           title="Watch Trailer"
//                           aria-label="Begin watching the trailer"
//                           id="playTrailerBtn">Watch Trailer</button>
//                           <div id="videoContainer"></div>
//                       </div>
//                   </div>
//               </div>
//           </div>
//       </div>`;
//   document.body.insertAdjacentHTML('beforeend', modalHTML);
// }

// // Modal Interaction Logic
// const modal = document.getElementById("movie-modal");
// const closeModalBtn = document.querySelector(".close");

// if (modal) {
//   if (closeModalBtn) {
//     closeModalBtn.onclick = () => {
//       modal.style.display = "none";
//       modal.hidden = true;
//       const vc = document.getElementById("videoContainer");
//       if (vc) vc.innerHTML = "";
//     }
//   }
//   window.onclick = (event) => {
//     if (event.target == modal) {
//       modal.style.display = "none";
//       const vc = document.getElementById("videoContainer");
//       if (vc) vc.innerHTML = "";
//     }
//   }
// }

// async function fetchHTMLtext() {
//   try {
//     const response = await fetch('/Component/header.html');
//     const result = await response.text();
//     return result;
//   } catch (err) {
//     console.error('Failed to load header:', err);
//   }
// }

// fetchHTMLtext().then(html => {
//   if (html) {
//     const header = document.querySelector('.header');
//     if (header) {
//       header.innerHTML = html;
//       if (typeof navbar === 'function') navbar();
//     }
//   }
// });

// function initApp() {
//   const movieBody = document.querySelectorAll('.div-area .body');
//   const spinner = document.querySelectorAll('.home-loader');

//   const nowPlayingUrl = `${apiBaseURL}movie/now_playing?api_key=${apiKey}`;
//   const topRatedUrl = `${apiBaseURL}movie/top_rated?api_key=${apiKey}`;

//   if (movieBody.length > 0) movieBody.forEach(el => el.innerHTML = '');

//   const fetchAll = async () => {
//     try {
//       const [nowPlayingResponse, topRatedResponse] = await Promise.all([
//         fetch(nowPlayingUrl),
//         fetch(topRatedUrl)
//       ]);

//       const nowPlaying = await nowPlayingResponse.json();
//       const topRated = await topRatedResponse.json();
//       return [nowPlaying.results, topRated.results];
//     } catch (error) {
//       console.error('Error fetching movies:', error);
//       return [[], []];
//     }
//   };

//   fetchAll().then(([nowPlayingData, topRatedData]) => {
//     renderList(nowPlayingData, 0);
//     renderList(topRatedData, 1);

//     spinner.forEach(s => s.style.display = 'none');
//   });

//   const renderList = (data, index) => {
//     if (!data || data.length === 0 || !movieBody[index]) return;

//     const htmlContent = data.map(movie => createCard(movie)).join('');
//     movieBody[index].innerHTML = htmlContent;
//   };

//   // function TextAbstract(text, length) {
//   //   if (text == null) return "";
//   //   if (text.length <= length) return text;
//   //   text = text.substring(0, length);
//   //   const last = text.lastIndexOf(" ");
//   //   text = text.substring(0, last);
//   //   return text + "...";
//   // }

//   const createCard = (data) => {
//     const { id, title, poster_path } = data;
//     // const minimalTitle = TextAbstract(title, 25); // Title not used in new card design
//     const poster = poster_path ? `${imageUrl}w500${poster_path}` : 'Assets/no-image.jpg';

//     return `
//       <button 
//       title = "${title}"

//       aria-label="Explore ${title} Trailers."
//        tabIndex = "0" class="card" onclick="openModal(${id})">
//        <div class="image">
//          <img loading="lazy" alt="Movie poster for ${title}" src="${poster}">
//        </div>
//       </button>
//     `;
//   };
// }

// // Global openModal function
// window.openModal = async (movieId) => {
//   const modal = document.getElementById("movie-modal");
//   const modalLoading = document.querySelector(".modal-loading");
//   const modalBody = document.querySelector(".modal-body");

//   // Refs
//   const modalImage = document.getElementById("modalImage");
//   const modalTitle = document.getElementById("modalTitle");
//   const modalDate = document.getElementById("modalDate");
//   const modalRating = document.getElementById("modalRating");
//   const modalOverview = document.getElementById("modalOverview");
//   const videoContainer = document.getElementById("videoContainer");
//   const playTrailerBtn = document.getElementById("playTrailerBtn");

//   modal.style.display = "flex";
//   if (modalLoading) modalLoading.style.display = "block";
//   if (modalBody) modalBody.style.display = "none";
//   if (videoContainer) videoContainer.innerHTML = "";

//   try {
//     const detailsUrl = `${apiBaseURL}movie/${movieId}?api_key=${apiKey}&language=en-US`;
//     const videosUrl = `${apiBaseURL}movie/${movieId}/videos?api_key=${apiKey}&language=en-US`;

//     const [detailsRes, videosRes] = await Promise.all([
//       fetch(detailsUrl),
//       fetch(videosUrl)
//     ]);

//     const details = await detailsRes.json();
//     const videosData = await videosRes.json();
//     const trailer = videosData.results.find(v => v.type === 'Trailer') || videosData.results[0];

//     // Populate
//     modalImage.src = details.poster_path ? `${imageUrl}w500${details.poster_path}` : 'Assets/no-image.jpg';
//     modalImage.alt = `Movie poster for ${details.title}`;
//     modalTitle.textContent = details.title;
//     modalTitle.title = details.title;
//     modalDate.textContent = details.release_date;
//     modalRating.textContent = details.vote_average;
//     modalOverview.textContent = details.overview;

//     if (trailer && trailer.key) {
//       playTrailerBtn.style.display = "inline-block";
//       playTrailerBtn.onclick = () => {
//         videoContainer.innerHTML = `<iframe src="https://www.youtube.com/embed/${trailer.key}?autoplay=1" frameborder="0" allowfullscreen allow="autoplay"></iframe>`;
//         playTrailerBtn.style.display = "none";
//       }
//     } else {
//       playTrailerBtn.style.display = "none";
//     }

//     if (modalLoading) modalLoading.style.display = "none";
//     if (modalBody) modalBody.style.display = "flex";

//   } catch (e) {
//     console.error(e);
//     if (modalLoading) modalLoading.textContent = "Error loading details";
//   }
// }

// // Intersection Observer
// const observer = new IntersectionObserver(entries => {
//   entries.forEach(entry => {
//     if (entry.isIntersecting) {
//       entry.target.classList.add('move-up');
//       observer.unobserve(entry.target);
//     }
//   });
// }, { threshold: 0.1 });

// initApp();

// const movieBodies = document.querySelectorAll('.div-area .body');
// movieBodies.forEach(el => observer.observe(el));

// const extraDiv = document.querySelector('.extra-div');
// if (extraDiv) observer.observe(extraDiv);

// // Scroll Up
// const angleUpButton = document.querySelector('.scroll_up');
// if (angleUpButton) {
//   window.addEventListener('scroll', () => {
//     if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
//       angleUpButton.style.display = "block";
//     } else {
//       angleUpButton.style.display = "none";
//     }
//   });

//   angleUpButton.addEventListener('click', () => {
//     document.body.scrollTop = 0;
//     document.documentElement.scrollTop = 0;
//   });
// }

// // Slider controls
// window.clickFunctionRight = (getSlider) => {
//   // Map identifier string to class or query
//   // original code used class passed as string. e.g. 'now_playing'
//   // But DOM structure: div.now_playing.body inside slider_container?
//   // Actually, original code:
//   // <i onclick="clickFunctionRight('now_playing')" ...>
//   // DOM: <div class="now_playing body">
//   // So querySelector(`.${getSlider}`) works if getSlider is 'now_playing'
//   const slider = document.querySelector(`.${getSlider}`);
//   if (slider) slider.scrollBy({ left: 300, behavior: 'smooth' });
// }

// window.clickFunctionLeft = (getSlider) => {
//   const slider = document.querySelector(`.${getSlider}`);
//   if (slider) slider.scrollBy({ left: -300, behavior: 'smooth' });
// }



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
      <div 
      role="dialog"
      aria-labelledby="modalTitle"
      aria-describedby="modalOverview"
      aria-modal="true"
      id="movie-modal" class="modal" hidden>
          <div class="modal-box">
              <button 
              type="button"
              title="Close modal"
              class="close" aria-label="Close modal">&times;</button>
              <div class="modal-content">
                  <div class="modal-loading" 
                  aria-live="polite " style="display: none; text-align: center; padding: 50px;">
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
                              <div class="rating"><span 
                              aria-hidden="true"
                              >⭐</span> <span id="modalRating"></span>/10</div>
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
                          title="Watch Trailer"
                          aria-label="Begin watching the trailer"
                          id="playTrailerBtn">Watch Trailer</button>
                          <div id="videoContainer"></div>
                      </div>
                  </div>
              </div>
          </div>
      </div>`;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Focus Management Variables
let previousActiveElement = null;
const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

// Modal Interaction Logic
const modal = document.getElementById("movie-modal");
const closeModalBtn = document.querySelector(".close");

if (modal) {
  if (closeModalBtn) {
    closeModalBtn.onclick = () => {
      modal.style.display = "none";
      const vc = document.getElementById("videoContainer");
      if (vc) vc.innerHTML = "";
      if (previousActiveElement) previousActiveElement.focus();
    }
  }
  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
      const vc = document.getElementById("videoContainer");
      if (vc) vc.innerHTML = "";
      if (previousActiveElement) previousActiveElement.focus();
    }
  }

  // Add Escape key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      modal.style.display = 'none';
      const vc = document.getElementById("videoContainer");
      if (vc) vc.innerHTML = "";
      if (previousActiveElement) previousActiveElement.focus();
    }
  });

}

if (modal) {
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

  // function TextAbstract(text, length) {
  //   if (text == null) return "";
  //   if (text.length <= length) return text;
  //   text = text.substring(0, length);
  //   const last = text.lastIndexOf(" ");
  //   text = text.substring(0, last);
  //   return text + "...";
  // }

  const createCard = (data) => {
    const { id, title, poster_path } = data;
    // const minimalTitle = TextAbstract(title, 25); // Title not used in new card design
    const poster = poster_path ? `${imageUrl}w500${poster_path}` : 'Assets/no-image.jpg';

    return `
      <button 
      title = "${title}"

      aria-label="Explore ${title} Trailers."
       tabIndex = "0" class="card" onclick="openModal(${id})">
       <div class="image">
         <img loading="lazy" alt="Movie poster for ${title}" src="${poster}">
       </div>
      </button>
    `;
  };
}

// Global openModal function
window.openModal = async (movieId) => {
  previousActiveElement = document.activeElement;
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
    modalImage.alt = `Movie poster for ${details.title}.`;
    modalTitle.textContent = details.title;
    modalTitle.title = details.title;
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

    // Move focus to close button or first focusable element
    const focusable = modal.querySelectorAll(focusableSelector);
    if (focusable.length > 0) focusable[0].focus();

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

// Enhance Accessibility for non-button interactive elements
function enhanceAccessibility() {
  const interactiveSelectors = [
    { selector: '.angle', label: 'Scroll Slider' },
    { selector: '.scroll_up', label: 'Scroll to Top' }
  ];

  interactiveSelectors.forEach(({ selector, label }) => {
    document.querySelectorAll(selector).forEach(el => {
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      if (!el.getAttribute('aria-label')) el.setAttribute('aria-label', label);

      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          el.click();
        }
      });
    });
  });
}

// Run enhancement after DOM changes or initially
enhanceAccessibility();
// Also re-run for dynamic content if needed, but here structure seems static mostly.
// But wait, .scroll_up exists. The angles exist.


// when #nowplaying is navigated to, focus the first card

const nowPlaying = document.getElementById('nowPlaying');
console.log(nowPlaying);
if (nowPlaying) {
  nowPlaying.addEventListener('focus', (e) => {
    const skipBtn = nowPlaying.querySelector('.content .nowPlaying-div .now-playing-skip-btn');
    console.log(skipBtn);
    if (skipBtn) {
      skipBtn.style.display = 'block';
      skipBtn.focus();
    }
  });
}





