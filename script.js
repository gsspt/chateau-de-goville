document.addEventListener("DOMContentLoaded", () => {
  // Menu toggle for mobile
  const toggle = document.getElementById("menu-toggle");
  const nav = document.querySelector(".main-nav");
  
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("active");
      toggle.classList.toggle("active");
    });
  }
  
  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (nav && nav.classList.contains("active") && 
        !nav.contains(e.target) && 
        e.target !== toggle) {
      nav.classList.remove("active");
      toggle.classList.remove("active");
    }
  });
  
  // Initialize all slideshows
  initSlideshows();
});

// Slideshow functionality with fade effect
function initSlideshows() {
  const slideshows = document.querySelectorAll(".slideshow-container");
  
  slideshows.forEach(slideshow => {
    const slides = slideshow.querySelectorAll(".slide");
    const prevBtn = slideshow.querySelector(".prev");
    const nextBtn = slideshow.querySelector(".next");
    
    if (slides.length === 0) return;
    
    let index = 0;
    const total = slides.length;
    
    // Create dots if they don't exist
    createDots(slideshow, total);
    updateDots(slideshow, index);
    
    // Show first slide
    showSlide(slideshow, index);
    
    // Add event listeners for buttons if they exist
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        index = (index - 1 + total) % total;
        showSlide(slideshow, index);
        resetAutoAdvance(slideshow);
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        index = (index + 1) % total;
        showSlide(slideshow, index);
        resetAutoAdvance(slideshow);
      });
    }
    
    // Add event listeners for dots
    const dots = slideshow.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        index = i;
        showSlide(slideshow, index);
        resetAutoAdvance(slideshow);
      });
    });
    
    // Set up auto-advance
    setupAutoAdvance(slideshow, () => {
      index = (index + 1) % total;
      showSlide(slideshow, index);
    });
  });
}

// Show specific slide
function showSlide(slideshow, index) {
  const slides = slideshow.querySelectorAll(".slide");
  const total = slides.length;
  
  // Hide all slides
  slides.forEach(slide => {
    slide.classList.remove("active");
  });
  
  // Show selected slide
  slides[index].classList.add("active");
  
  // Update dots
  updateDots(slideshow, index);
}

// Create dots for slideshow navigation
function createDots(slideshow, total) {
  // Check if dots already exist
  if (slideshow.querySelector('.slide-dots')) return;
  
  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'slide-dots';
  
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('span');
    dot.className = 'dot';
    dotsContainer.appendChild(dot);
  }
  
  slideshow.appendChild(dotsContainer);
}

// Update active dot
function updateDots(slideshow, index) {
  const dots = slideshow.querySelectorAll('.dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

// Auto-advance with reset capability
function setupAutoAdvance(slideshow, advanceFunction) {
  // Clear any existing interval
  if (slideshow.dataset.intervalId) {
    clearInterval(parseInt(slideshow.dataset.intervalId));
  }
  
  const intervalId = setInterval(advanceFunction, 5000); // Change toutes les 5 secondes
  
  // Store interval ID on slideshow element for later access
  slideshow.dataset.intervalId = intervalId;
}

function resetAutoAdvance(slideshow) {
  // Clear existing interval
  if (slideshow.dataset.intervalId) {
    clearInterval(parseInt(slideshow.dataset.intervalId));
  }
  
  // Get current index from active slide
  const slides = slideshow.querySelectorAll(".slide");
  let index = 0;
  
  slides.forEach((slide, i) => {
    if (slide.classList.contains("active")) {
      index = i;
    }
  });
  
  const total = slides.length;
  
  setupAutoAdvance(slideshow, () => {
    index = (index + 1) % total;
    showSlide(slideshow, index);
  });
}
