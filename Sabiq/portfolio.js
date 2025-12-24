/**
 * Hussain Quaid Portfolio - High-Level JavaScript
 * Optimized for performance using Intersection Observer and efficient DOM manipulation.
 */

// --- 1. CORE DOM SELECTORS ---
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const scrollAnimElements = document.querySelectorAll('.skill-card, .timeline-item');
const skillProgressBars = document.querySelectorAll('.progress-bar');
const heroTitle = document.querySelector('.hero-title');
const sections = document.querySelectorAll('section[id]');
const slides = document.querySelectorAll('.slide');


// --- 2. NAVIGATION & SCROLLING ---

// Mobile Navigation Toggle (Toggles 'active' classes, CSS handles the look)
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu on link click
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});

// Scroll Effects (Navbar style, Parallax, Active Link Highlighting)
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    
    // 2.1 Navbar style toggle (Adds/removes 'scrolled' class)
    if (scrolled > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // 2.2 Parallax effect for the hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        const translateY = scrolled * 0.4;
        const opacity = 1 - (scrolled / window.innerHeight) * 0.8;
        hero.style.transform = `translateY(${translateY > 0 ? translateY : 0}px)`; 
        hero.style.opacity = opacity > 0.2 ? opacity : 0.2; 
    }

    // 2.3 Active link highlighting
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - navbar.offsetHeight - 50; 
        if (scrolled >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active-link');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active-link');
        }
    });
});


// --- 3. ANIMATIONS & OBSERVERS ---

// 3.1 Intersection Observer for Scroll Animations (Skills, Timeline)
const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

scrollAnimElements.forEach(el => scrollObserver.observe(el));


// 3.2 Skill Progress Bar Animation
const skillObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            skillProgressBars.forEach(bar => {
                const progress = bar.getAttribute('data-progress');
                bar.style.width = progress + '%';
            });
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const skillsSection = document.querySelector('.skills');
if (skillsSection) {
    skillObserver.observe(skillsSection);
}


// 3.3 Typing Effect for Hero Title
if (heroTitle) {
    const originalHTML = heroTitle.innerHTML; 
    heroTitle.innerHTML = ''; 
    
    const contentToType = originalHTML.replace(/<[^>]+>/g, (match) => `|TAG|${match}|TAG|`).split('|TAG|');
    
    let currentContentIndex = 0;
    let charIndex = 0;
    
    const typeWriter = () => {
        if (currentContentIndex < contentToType.length) {
            let piece = contentToType[currentContentIndex];
            
            if (piece.startsWith('<')) {
                heroTitle.innerHTML += piece;
                currentContentIndex++;
                charIndex = 0;
                setTimeout(typeWriter, 0); 
            } else if (charIndex < piece.length) {
                heroTitle.innerHTML += piece.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, 40); 
            } else {
                currentContentIndex++;
                charIndex = 0;
                setTimeout(typeWriter, 100);
            }
        }
    };
    
    window.addEventListener('load', () => {
        setTimeout(typeWriter, 500); 
    });
}


// --- 4. PORTFOLIO SLIDER ---
let currentSlide = 0;
const totalSlides = slides.length;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === index) {
            slide.classList.add('active');
        }
    });
}

window.changeSlide = (direction) => { 
    currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
    showSlide(currentSlide);
};

showSlide(currentSlide);

setInterval(() => {
    changeSlide(1);
}, 5000); 

document.querySelectorAll('.slide img').forEach(img => {
    img.addEventListener('mouseenter', () => img.style.transform = 'scale(1.05)');
    img.addEventListener('mouseleave', () => img.style.transform = 'scale(1)');
});


// --- 5. RIPPLE EFFECT & CONTACT FORM ---

document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const x = e.clientX - button.getBoundingClientRect().left;
        const y = e.clientY - button.getBoundingClientRect().top;
        
        const ripple = document.createElement('span');
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const message = contactForm.querySelector('textarea').value;
        
        if (name && email && message) {
            alert('JazakAllah Khair! Your message has been sent. I will get back to you soon, InshaAllah.');
            contactForm.reset();
        } else {
            alert('Please fill in all the required fields.');
        }
    });
}