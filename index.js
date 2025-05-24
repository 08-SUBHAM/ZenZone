function locomotiveAnimation() {
    gsap.registerPlugin(ScrollTrigger);
  
    // Using Locomotive Scroll from Locomotive https://github.com/locomotivemtl/locomotive-scroll
  
    const locoScroll = new LocomotiveScroll({
        el: document.querySelector("#main"),
        smooth: true,
        multiplier: 0.9,
        lerp: 0.03,
        smoothMobile: true,
        direction: 'vertical',
        getDirection: true,
        tablet: {
          smooth: true
        },
        smartphone: {
          smooth: true
        }
      });
    // each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
    locoScroll.on("scroll", ScrollTrigger.update);
  
    // tell ScrollTrigger to use these proxy methods for the "#main" element since Locomotive Scroll is hijacking things
    ScrollTrigger.scrollerProxy("#main", {
      scrollTop(value) {
        return arguments.length
          ? locoScroll.scrollTo(value, 0, 0)
          : locoScroll.scroll.instance.scroll.y;
      }, // we don't have to define a scrollLeft because we're only scrolling vertically.
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
      pinType: document.querySelector("#main").style.transform
        ? "transform"
        : "fixed",
    });
  
    // each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll.
    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
  
    // after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
    ScrollTrigger.refresh();
  }
  locomotiveAnimation();


// Navigation
const nav = document.querySelector('nav');
const hero = document.querySelector('.hero');

// Mood data
const moodData = {
    amazing: { emoji: '😊', label: 'Amazing', count: 0 },
    good: { emoji: '🙂', label: 'Good', count: 0 },
    meh: { emoji: '😐', label: 'Meh', count: 0 },
    down: { emoji: '😔', label: 'Down', count: 0 },
    anxious: { emoji: '😰', label: 'Anxious', count: 0 }
};

// Current user's mood
let userMood = null;

// DOM Elements
const moodEmoji = document.querySelector('.mood-emoji');
const currentMood = document.getElementById('current-mood');
const moodCount = document.getElementById('mood-count');
const moodButtons = document.querySelectorAll('.mood-btn');
const membersCount = document.getElementById('members-count');
const activeToday = document.getElementById('active-today');
const affirmationText = document.getElementById('affirmation-text');

// Affirmations
const affirmations = [
    'You are stronger than you think, and your feelings are valid.',
    'It\'s okay not to be okay. You\'re doing your best.',
    'Your mental health is a priority. Your happiness is essential.',
    'You are not alone in this journey. We\'re here with you.',
    'Small progress is still progress. Celebrate every step forward.'
];

// Initialize the page
function init() {
    setupEventListeners();
    updateStats();
    setRandomAffirmation();
    loadMoodData();
}

// Set up event listeners
function setupEventListeners() {
    // Mood buttons
    moodButtons.forEach(button => {
        button.addEventListener('click', () => handleMoodSelection(button.dataset.mood));
    });

    // Navbar scroll behavior
    let lastScroll = 0;
    const navbarHeight = 80; // Height of your navbar in pixels
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class based on scroll position
        if (currentScroll > 10) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        // Hide navbar on scroll down, show on scroll up
        if (currentScroll <= 0) {
            nav.classList.remove('hidden');
            return;
        }
        
        if (currentScroll > lastScroll && currentScroll > navbarHeight) {
            // Scroll down
            nav.classList.add('hidden');
        } else if (currentScroll < lastScroll) {
            // Scroll up
            nav.classList.remove('hidden');
        }
        
        lastScroll = currentScroll;
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('load', updateHeroPadding);
    window.addEventListener('resize', updateHeroPadding);
}

// Handle mood selection
function handleMoodSelection(mood) {
    if (userMood) {
        moodData[userMood].count--;
    }
    
    userMood = mood;
    moodData[mood].count++;
    
    updateMoodDisplay();
    saveMoodData();
    
    // Visual feedback
    moodButtons.forEach(btn => {
        if (btn.dataset.mood === mood) {
            btn.style.transform = 'scale(1.2)';
            setTimeout(() => {
                btn.style.transform = 'translateY(-5px)';
            }, 200);
        } else {
            btn.style.transform = 'scale(1)';
        }
    });
}

// Update mood display
function updateMoodDisplay() {
    if (!userMood) return;
    
    const mood = moodData[userMood];
    moodEmoji.textContent = mood.emoji;
    currentMood.textContent = mood.label;
    moodCount.textContent = mood.count;
    
    // Update button states
    moodButtons.forEach(btn => {
        if (btn.dataset.mood === userMood) {
            btn.style.backgroundColor = '#e0e7ff';
            btn.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.3)';
        } else {
            btn.style.backgroundColor = 'white';
            btn.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
        }
    });
}

// Save mood data to localStorage
function saveMoodData() {
    localStorage.setItem('moodData', JSON.stringify(moodData));
    localStorage.setItem('userMood', userMood);
}

// Load mood data from localStorage
function loadMoodData() {
    const savedMoodData = localStorage.getItem('moodData');
    const savedUserMood = localStorage.getItem('userMood');
    
    if (savedMoodData) {
        Object.assign(moodData, JSON.parse(savedMoodData));
    }
    
    if (savedUserMood) {
        userMood = savedUserMood;
        updateMoodDisplay();
    }
}

// Update stats with animation
function updateStats() {
    // Animate members count
    animateValue('members-count', 0, 10000, 2000);
    
    // Animate active users
    const randomActive = Math.floor(Math.random() * 1000) + 100;
    animateValue('active-today', 0, randomActive, 1500);
}

// Helper function to animate number values
function animateValue(id, start, end, duration) {
    const element = document.getElementById(id);
    if (!element) return;
    
    const range = end - start;
    const minFrameTime = 30;
    const totalFrames = Math.ceil(duration / minFrameTime);
    let frame = 0;
    
    const counter = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const current = Math.floor(start + (progress * range));
        
        element.textContent = current.toLocaleString() + (frame === totalFrames ? '+' : '');
        
        if (frame === totalFrames) {
            clearInterval(counter);
        }
    }, minFrameTime);
}

// Set random affirmation
function setRandomAffirmation() {
    if (!affirmationText) return;
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    affirmationText.textContent = affirmations[randomIndex];
}

// Update hero padding based on navbar height
function updateHeroPadding() {
    const navHeight = nav.offsetHeight;
    document.documentElement.style.setProperty('--nav-height', `${navHeight}px`);
    if (hero) {
        hero.style.paddingTop = `calc(var(--nav-height) + 4rem)`;
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', init);