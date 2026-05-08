const slider = document.getElementById("slider");
const dotsContainer = document.getElementById("dots");
const progress = document.getElementById("progress");

let slides = [];
let dots = [];
let current = 0;
let interval;
const slideDuration = 5000; // 5 seconds for smooth auto-play

// Custom SVG Arrows
document.querySelector(".prev").innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>`;
document.querySelector(".next").innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>`;

fetch("slides.json")
  .then(res => res.json())
  .then(data => {
    data.forEach((item, index) => {
      const slide = document.createElement("div");
      slide.className = `slide ${index === 0 ? "active" : ""}`;

      // Added .overlay INSIDE the slide, right above the image but below the content
      slide.innerHTML = `
        <img src="${item.image}" alt="${item.title}">
        <div class="overlay"></div> 
        <div class="content">
          <h1>${item.title}</h1>
          <p>${item.description}</p>
          <a href="${item.link}" class="cta-btn">${item.button}</a>
        </div>
      `;
      slider.appendChild(slide);

      const dot = document.createElement("span");
      dot.className = `dot ${index === 0 ? "active" : ""}`;
      dot.addEventListener("click", () => {
        current = index;
        showSlide(current);
        restartAutoSlide();
      });
      dotsContainer.appendChild(dot);
    });

    slides = document.querySelectorAll(".slide");
    dots = document.querySelectorAll(".dot");

    startSlider();
    addSwipeSupport();
  });

function showSlide(index) {
  slides.forEach(slide => slide.classList.remove("active"));
  dots.forEach(dot => dot.classList.remove("active"));

  slides[index].classList.add("active");
  dots[index].classList.add("active");

  restartProgress();
}

function nextSlide() {
  current = (current + 1) % slides.length;
  showSlide(current);
}

function prevSlide() {
  current = (current - 1 + slides.length) % slides.length;
  showSlide(current);
}

document.querySelector(".next").addEventListener("click", () => {
  nextSlide();
  restartAutoSlide();
});

document.querySelector(".prev").addEventListener("click", () => {
  prevSlide();
  restartAutoSlide();
});

function startSlider() {
  interval = setInterval(nextSlide, slideDuration);
  animateProgress();
}

function restartAutoSlide() {
  clearInterval(interval);
  interval = setInterval(nextSlide, slideDuration);
  restartProgress();
}

function animateProgress() {
  progress.style.transition = "none";
  progress.style.width = "0%";

  setTimeout(() => {
    progress.style.transition = `${slideDuration}ms linear`;
    progress.style.width = "100%";
  }, 50);
}

function restartProgress() {
  animateProgress();
}

// Hover pause logic removed completely so the slider never gets stuck!

function addSwipeSupport() {
  let startX = 0;

  slider.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  });

  slider.addEventListener("touchend", e => {
    let endX = e.changedTouches[0].clientX;
    if (startX - endX > 50) nextSlide();
    if (endX - startX > 50) prevSlide();
  });
}