
// 1. DOM REFS
const body = document.body;
const header = document.querySelector('.site-header');
const navLinks = document.querySelector('.nav-links');
const hamburger = document.querySelector('.hamburger');
const themeToggle = document.getElementById('themeToggle');
const revealItems = document.querySelectorAll('.reveal');
const timelineCards = document.querySelectorAll('.timeline-card');
const heroBg = document.querySelector('.hero-bg');

// 2. THEME TOGGLE (with localStorage persistence)
const savedTheme = localStorage.getItem('tribute-theme');
if (savedTheme === 'light') {
    body.classList.add('light-mode');
    themeToggle.checked = true;
}

themeToggle.addEventListener('change', function() {
    const isLight = themeToggle.checked;
    body.classList.toggle('light-mode', isLight);
    localStorage.setItem('tribute-theme', isLight ? 'light' : 'dark');
});

// 3. NAVBAR SCROLL EFFECT
function updateHeaderState() {
    if (window.scrollY > 30) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

updateHeaderState();
window.addEventListener('scroll', updateHeaderState);

// 4. PARALLAX EFFECT (Hero Background)
window.addEventListener('scroll', function() {
    const offset = window.scrollY * 0.18;
    heroBg.style.transform = 'translate3d(0, ' + offset + 'px, 0) scale(1.08)';
});

// 5. MOBILE HAMBURGER TOGGLE
hamburger.addEventListener('click', function() {
    const active = navLinks.classList.toggle('active');
    hamburger.classList.toggle('active', active);
    hamburger.setAttribute('aria-expanded', active ? 'true' : 'false');
});

navLinks.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    });
});

// 6. SCROLL REVEAL (Biography Paragraphs)
var revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

revealItems.forEach(function(item, index) {
    item.style.transitionDelay = (index * 100) + 'ms';
    revealObserver.observe(item);
});

// 7. SCROLL REVEAL (Timeline Cards)
var timelineObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            var card = entry.target;
            var direction = card.classList.contains('left-in') ? 'left' : 'right';
            card.classList.remove('left-in', 'right-in');
            card.style.opacity = '1';
            card.style.animation = direction === 'left' ? 'slideLeft 0.9s ease forwards' : 'slideRight 0.9s ease forwards';
            timelineObserver.unobserve(card);
        }
    });
}, { threshold: 0.2 });

timelineCards.forEach(function(card) {
    timelineObserver.observe(card);
});

// 8. DYNAMIC YEAR IN FOOTER
document.getElementById('year').textContent = new Date().getFullYear();