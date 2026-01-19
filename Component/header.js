



async function fetchHTMLtext() {
  const response = await fetch('/Component/header.html');
  const result = await response.text();
  return result;
}

fetchHTMLtext()
  .then(html => {
    const header = document.querySelector('.header');
    header.innerHTML = html
    navbar()
    const navLinks = document.querySelectorAll('.nav_link a');
    navLinks.forEach(navLinks => {
      navLinks.style.display = 'none';
    })
  });


//////function for nav bar functionality
const navbar = () => {
  // Desktop Selectors
  const genreBtn = document.querySelector('.desktop-view .genre');
  const genreList = document.querySelector('.desktop-view .genre-lists');
  //const genreLists = document.querySelector('.desktop-view .genre-lists ul li a');

  // Mobile Selectors
  const mobileMenuTrigger = document.querySelector('.mobile-menu-trigger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const genreToggle = document.querySelector('.genre-toggle');
  const mobileGenreList = document.querySelector('.mobile-genrelists');



  // console.log(genreLists)
  // genreLists.forEach((link, index) => {
  //   link.addEventListener('keydown', (e) => {
  //     if (e.key === 'ArrowDown') {
  //       e.preventDefault();
  //       const next = genreList[index + 1] || genreList[0];
  //       next.focus();
  //     }

  //     if (e.key === 'ArrowUp') {
  //       e.preventDefault();
  //       const prev = genreList[index - 1] || genreList[links.length - 1];
  //       prev.focus();
  //     }
  //   });
  // });

  const links = document.querySelectorAll('.genre-lists ul li a ');

  console.log(links)
  links.forEach((link, index) => {
    link.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        links[index + 1].focus();
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        links[index - 1].focus();
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        closeMenu();
      }


      // 🚫 DO NOT preventDefault for Enter
      // Let the browser handle it naturally
    });
  });

  // Desktop Genre Hover/Click
  if (genreBtn && genreList) {
    genreBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = genreList.style.display === 'block';
      genreList.style.display = isVisible ? 'none' : 'block';
      genreBtn.setAttribute('aria-expanded', String(!isVisible));
    });

    // Close when clicking outside
    window.addEventListener('click', (e) => {
      if (genreList.style.display === 'block' && !genreList.contains(e.target) && e.target !== genreBtn) {
        genreList.style.display = 'none';
      }
    });
  }

  // Mobile Menu Toggle
  if (mobileMenuTrigger && mobileMenu) {
    mobileMenuTrigger.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      const icon = mobileMenuTrigger.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });
  }

  // Mobile Genre Toggle
  if (genreToggle && mobileGenreList) {
    genreToggle.addEventListener('click', () => {
      mobileGenreList.classList.toggle('active');
      const icon = genreToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('rotated');
      }
    });
  }

  // Handle Resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) {
      if (mobileMenu) mobileMenu.classList.remove('active');
      if (genreList) genreList.style.display = 'none';
    }
  });
}


//const links = document.querySelectorAll('#genreList a');










//export default navbar();

//     const navContent = document.querySelector('.heading .left');
// navContent.innerHTML += `<p ><a href="">Top rated</a></p>
// <p ><a href="">Now playing</a></p> `

