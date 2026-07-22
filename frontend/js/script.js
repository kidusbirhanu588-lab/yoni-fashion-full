// ==================== MOBILE MENU TOGGLE ====================
const hamburger = document.getElementById('hamburger');
const navList = document.querySelector('.nav-list');
const navLinks = document.querySelectorAll('.nav-link');

function toggleMenu() {
    navList.classList.toggle('active');
    if (hamburger) hamburger.classList.toggle('active');
}

if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
}

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navList.classList.contains('active')) toggleMenu();
    });
});

// ==================== ACTIVE NAVIGATION & SMOOTH SCROLL ====================
const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
    let scrollPos = window.scrollY + 150;
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
            const currentId = section.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ==================== THROTTLED SCROLL HANDLER (Fixes vibration) ====================
let ticking = false;
const header = document.getElementById('header');

function onScroll() {
    // update active nav
    updateActiveNav();
    
    // Sticky header: add/remove class 'scrolled' – no padding change
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Back to top button visibility
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        if (window.scrollY > 500) {
            backToTopBtn.style.display = 'flex';
        } else {
            backToTopBtn.style.display = 'none';
        }
    }
    
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(onScroll);
        ticking = true;
    }
});

// initial call
onScroll();

// ==================== SMOOTH SCROLL FOR ANCHOR LINKS ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === "#") return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ==================== TESTIMONIAL CAROUSEL (no auto-slide to avoid repaints) ====================
const testimonials = document.querySelectorAll('.testimonial-card');
const prevBtn = document.querySelector('.testimonial-prev');
const nextBtn = document.querySelector('.testimonial-next');
const dots = document.querySelectorAll('.dot');
let currentTestimonial = 0;

function showTestimonial(index) {
    if (!testimonials.length) return;
    testimonials.forEach((t, i) => {
        t.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    currentTestimonial = index;
}

function nextTestimonial() {
    let newIndex = currentTestimonial + 1;
    if (newIndex >= testimonials.length) newIndex = 0;
    showTestimonial(newIndex);
}

function prevTestimonial() {
    let newIndex = currentTestimonial - 1;
    if (newIndex < 0) newIndex = testimonials.length - 1;
    showTestimonial(newIndex);
}

if (nextBtn && prevBtn && testimonials.length) {
    nextBtn.addEventListener('click', nextTestimonial);
    prevBtn.addEventListener('click', prevTestimonial);
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => showTestimonial(idx));
    });
    // Auto-slide removed because it can cause reflows; enable if needed:
    // setInterval(nextTestimonial, 6000);
}

// ==================== BACK TO TOP CLICK ====================
const backToTopBtn = document.getElementById('backToTop');
if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ==================== CONTACT FORM SUBMISSION ====================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const feedback = document.getElementById('formFeedback');
        if (feedback) {
            feedback.textContent = '✨ Thank you! We will reach out soon.';
            feedback.style.color = '#b8904b';
            setTimeout(() => feedback.textContent = '', 4000);
        }
        contactForm.reset();
    });
}

// ==================== NEWSLETTER SUBSCRIPTION ====================
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thanks for subscribing! Stay tuned for cultural stories and offers.');
        newsletterForm.reset();
    });
}

// ==================== CART COUNT SIMULATION ====================
const cartCountSpan = document.querySelector('.cart-count');
if (cartCountSpan) {
    let count = 0;
    const addToCartButtons = document.querySelectorAll('.btn-card');
    addToCartButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            count++;
            cartCountSpan.innerText = count;
        });
    });
}

// for Hero section java script code
// Hamburger toggle
const mainNav = document.getElementById('mainNav');

if (hamburger && mainNav) {
  hamburger.addEventListener('click', () => {
    mainNav.classList.toggle('active');
  });
}

// Hero text animation
document.addEventListener("DOMContentLoaded", () => {
  const subtitle = document.querySelector(".hero-subtitle");
  const title = document.querySelector(".hero-title");

  // Animate subtitle
  setTimeout(() => {
    subtitle.style.transition = "all 1s ease";
    subtitle.style.opacity = "1";
    subtitle.style.transform = "translateY(0)";
  }, 500);

  // Animate title
  setTimeout(() => {
    title.style.transition = "all 1.2s ease";
    title.style.opacity = "1";
    title.style.transform = "translateY(0)";
  }, 1200);
});

// hero-section text animation

/* (function () {

    // Dynamic Text Effect
    const dynamicText = document.getElementById("dynamic-text");

    const texts = [
        "ዮናታን ጥበብ <br> Jonathan | Tibeb",
        "የሃገር ልብስ <br> Traditional Fashion",
        "Modern Ethiopian <br> Cultural Design",
        "Creative Fashion <br> Art Studio"
    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {

        const currentText = texts[textIndex];
        const plainText = currentText.replace(/<br>/g, "\n");

        if (!isDeleting) {
            charIndex++;
        } else {
            charIndex--;
        }

        let visibleText = plainText.substring(0, charIndex);

        // line break support
        visibleText = visibleText.replace("\n", "<br>");
        
        if (dynamicText) {
            dynamicText.innerHTML = visibleText;
        }

        let speed = isDeleting ? 50 : 100;

        // typing finished
        if (!isDeleting && charIndex === plainText.length) {
            speed = 2000;
            isDeleting = true;
        }

        // deleting finished
        else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            speed = 500;
        }

        setTimeout(typeEffect, speed);
    }

    typeEffect();

})(); */
