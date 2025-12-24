document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. Theme Toggle Logic ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Load saved theme or default to 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }


    // --- 2. Scroll Animation (Progress Bars & Fade-In Elements) ---

    // A. Animate Skill Progress Bars
    const skillsSection = document.getElementById('skills');

    const skillBarObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate the progress bars when the section is in view
                document.querySelectorAll('#skills .progress-bar').forEach(bar => {
                    const progress = bar.getAttribute('aria-valuenow');
                    bar.style.width = progress + '%';
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    if (skillsSection) {
        skillBarObserver.observe(skillsSection);
    }
    
    // B. Generic Fade-In Animation (for cards, timeline, etc.)
    const fadeInElements = document.querySelectorAll('.fade-in-on-scroll');

    const fadeInObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = element.getAttribute('data-delay') || 0;
                
                // Use a timeout to apply the delay stagger effect
                setTimeout(() => {
                    element.classList.add('animate-visible');
                }, parseInt(delay));
                
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.1 });

    fadeInElements.forEach(element => {
        fadeInObserver.observe(element);
    });
    
    
    // --- 3. Smooth Scrolling & Mobile Nav Closing ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Prevent default for smooth scroll, but skip carousel controls
            if (this.classList.contains('carousel-control-prev') || this.classList.contains('carousel-control-next') || this.dataset.bsSlideTo) {
                return;
            }
            
            e.preventDefault();

            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                // Calculate position with offset for fixed navbar
                const navbarHeight = document.getElementById('main-navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight - 20; // 20px extra padding

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
            
            // Close the navbar on mobile devices after clicking a link (Bootstrap 5)
            const navbarCollapse = document.getElementById('navbarNav');
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                    toggle: false
                });
                bsCollapse.hide();
            }
        });
    });
});