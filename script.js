document.addEventListener("DOMContentLoaded", () => {
    initializeMobileMenu();
    initSlideshows();
});

// Menu mobile principal
function initializeMobileMenu() {
    const toggle = document.getElementById("menu-toggle");
    const nav = document.querySelector(".main-nav");
    
    if (!toggle || !nav) return;
    
    // Événement click sur le toggle
    toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        nav.classList.toggle("active");
        toggle.classList.toggle("active");
    });
    
    // Fermer le menu en cliquant à l'extérieur
    document.addEventListener("click", (e) => {
        if (nav.classList.contains("active") && 
            !nav.contains(e.target) && 
            e.target !== toggle) {
            nav.classList.remove("active");
            toggle.classList.remove("active");
        }
    });
    
    // Fermer le menu en cliquant sur un lien
    const navLinks = nav.querySelectorAll("a");
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("active");
            toggle.classList.remove("active");
        });
    });
}

// Slideshow functionality (conservé de votre version)
function initSlideshows() {
    const slideshows = document.querySelectorAll(".slideshow-container");
    
    slideshows.forEach(slideshow => {
        const slides = slideshow.querySelectorAll(".slide");
        const prevBtn = slideshow.querySelector(".prev");
        const nextBtn = slideshow.querySelector(".next");
        
        if (slides.length === 0) return;
        
        let index = 0;
        const total = slides.length;
        
        createDots(slideshow, total);
        updateDots(slideshow, index);
        showSlide(slideshow, index);
        
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
        
        const dots = slideshow.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                index = i;
                showSlide(slideshow, index);
                resetAutoAdvance(slideshow);
            });
        });
        
        setupAutoAdvance(slideshow, () => {
            index = (index + 1) % total;
            showSlide(slideshow, index);
        });
        
        addTouchSupport(slideshow);
    });
}

function showSlide(slideshow, index) {
    const slides = slideshow.querySelectorAll(".slide");
    const total = slides.length;
    
    if (index >= total) return;
    
    slides.forEach(slide => {
        slide.classList.remove("active");
    });
    
    slides[index].classList.add("active");
    updateDots(slideshow, index);
}

function createDots(slideshow, total) {
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

function updateDots(slideshow, index) {
    const dots = slideshow.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function setupAutoAdvance(slideshow, advanceFunction) {
    if (slideshow.dataset.intervalId) {
        clearInterval(parseInt(slideshow.dataset.intervalId));
    }
    
    const intervalId = setInterval(advanceFunction, 5000);
    slideshow.dataset.intervalId = intervalId;
}

function resetAutoAdvance(slideshow) {
    if (slideshow.dataset.intervalId) {
        clearInterval(parseInt(slideshow.dataset.intervalId));
    }
    
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

function addTouchSupport(slideshow) {
    let startX = 0;
    
    slideshow.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    }, { passive: true });
    
    slideshow.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;
        
        if (Math.abs(diffX) > 50) {
            const slides = slideshow.querySelectorAll(".slide");
            let currentIndex = 0;
            
            slides.forEach((slide, i) => {
                if (slide.classList.contains("active")) {
                    currentIndex = i;
                }
            });
            
            if (diffX > 0) {
                currentIndex = (currentIndex + 1) % slides.length;
            } else {
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            }
            
            showSlide(slideshow, currentIndex);
            resetAutoAdvance(slideshow);
        }
    }, { passive: true });
}
