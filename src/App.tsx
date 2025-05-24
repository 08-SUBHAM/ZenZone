import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LocomotiveScroll from 'locomotive-scroll';

interface MoodData {
  emoji: string;
  label: string;
  count: number;
}

interface MoodMap {
  [key: string]: MoodData;
}

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);

  // Mood state
  const [moodData, setMoodData] = useState<MoodMap>({
    amazing: { emoji: '😊', label: 'Amazing', count: 0 },
    good: { emoji: '🙂', label: 'Good', count: 0 },
    meh: { emoji: '😐', label: 'Meh', count: 0 },
    down: { emoji: '😔', label: 'Down', count: 0 },
    anxious: { emoji: '😰', label: 'Anxious', count: 0 }
  });
  const [userMood, setUserMood] = useState<string | null>(null);

  // Load mood data from localStorage
  useEffect(() => {
    const savedMoodData = localStorage.getItem('moodData');
    const savedUserMood = localStorage.getItem('userMood');
    
    if (savedMoodData) {
      setMoodData(JSON.parse(savedMoodData));
    }
    
    if (savedUserMood) {
      setUserMood(savedUserMood);
    }
  }, []);

  // Save mood data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('moodData', JSON.stringify(moodData));
    if (userMood) {
      localStorage.setItem('userMood', userMood);
    }
  }, [moodData, userMood]);

  // Handle mood selection
  const handleMoodSelection = (mood: string) => {
    if (userMood) {
      setMoodData(prev => ({
        ...prev,
        [userMood]: { ...prev[userMood], count: prev[userMood].count - 1 }
      }));
    }
    
    setUserMood(mood);
    setMoodData(prev => ({
      ...prev,
      [mood]: { ...prev[mood], count: prev[mood].count + 1 }
    }));
  };

  useEffect(() => {
    // Initialize Locomotive Scroll
    const locoScroll = new LocomotiveScroll({
      el: document.querySelector("#main") as HTMLElement,
      smooth: true,
      multiplier: 0.9,
      lerp: 0.03,
      direction: 'vertical',
      getDirection: true
    });

    // Register GSAP ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Set up ScrollTrigger proxy for Locomotive Scroll
    ScrollTrigger.scrollerProxy("#main", {
      scrollTop(value) {
        if (arguments.length) {
          locoScroll.scrollTo(0);
          return;
        }
        return 0;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: 'fixed'
    });

    // Update ScrollTrigger on Locomotive Scroll update
    locoScroll.on("scroll", () => {
      ScrollTrigger.update();
    });

    // Update Locomotive Scroll on ScrollTrigger refresh
    ScrollTrigger.addEventListener("refresh", () => {
      locoScroll.update();
    });

    // Refresh ScrollTrigger after everything is set up
    ScrollTrigger.refresh();

    // Handle scroll events for navbar
    const handleScroll = () => {
      const currentScroll = window.pageYOffset;
      
      // Add/remove scrolled class based on scroll position
      if (currentScroll > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      
      // Hide navbar on scroll down, show on scroll up
      if (currentScroll <= 0) {
        setIsHidden(false);
        return;
      }
      
      if (currentScroll > lastScroll && currentScroll > 80) {
        setIsHidden(true);
      } else if (currentScroll < lastScroll) {
        setIsHidden(false);
      }
      
      setLastScroll(currentScroll);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => {
      if (locoScroll) {
        locoScroll.destroy();
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScroll]);

  // Stats animation
  useEffect(() => {
    const animateValue = (id: string, start: number, end: number, duration: number) => {
      const range = end - start;
      const increment = end > start ? 1 : -1;
      const stepTime = Math.abs(Math.floor(duration / range));
      let current = start;
      const element = document.getElementById(id);
      
      const timer = setInterval(() => {
        current += increment;
        if (element) {
          element.textContent = current.toString();
        }
        if (current === end) {
          clearInterval(timer);
        }
      }, stepTime);
    };

    // Animate stats when they come into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateValue('members-count', 0, 15000, 2000);
          animateValue('active-today', 0, 2500, 2000);
          observer.disconnect();
        }
      });
    });

    const statsSection = document.querySelector('.mission-stats');
    if (statsSection) {
      observer.observe(statsSection);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <nav className={`${isScrolled ? 'scrolled' : ''} ${isHidden ? 'hidden' : ''}`}>
        <div className="nav-container">
          <a href="#" className="logo">
            <img src="/zenzone_png.png" alt="ZenZone Logo" className="logo-img" />
          </a>
          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#resources">Resources</a></li>
            <li><a href="#about">About Us</a></li>
          </ul>
          <a href="#cta" className="cta-button">Get Started</a>
        </div>
      </nav>

      <main id="main">
        <section className="hero" id="home">
          <div className="container">
            <h1>Your Mental Health Journey Starts Here</h1>
            <p>Join a supportive community that understands. Get 24/7 access to resources, tools, and people who care about your wellbeing.</p>
            <div className="hero-buttons">
              <a href="/register" className="cta-button">Join Free</a>
              <a href="#features" className="cta-button secondary">Learn More</a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features" id="features">
          <div className="container">
            <div className="section-title">
              <h2>Features to Support Your Journey</h2>
              <p className="section-description">
                Discover tools and resources designed to help you understand, track, and improve your mental wellbeing.
              </p>
            </div>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🧘</div>
                <h3>Guided Meditation</h3>
                <p>Access a library of calming meditations led by experienced practitioners.</p>
                <ul className="feature-benefits">
                  <li>Daily sessions</li>
                  <li>Beginner friendly</li>
                  <li>Progress tracking</li>
                </ul>
              </div>
              <div className="feature-card featured">
                <span className="feature-badge">Popular</span>
                <div className="feature-icon">📝</div>
                <h3>Mood Journal</h3>
                <p>Track your emotional journey with our intuitive journaling tools.</p>
                <ul className="feature-benefits">
                  <li>Daily prompts</li>
                  <li>Mood patterns</li>
                  <li>Private entries</li>
                </ul>
              </div>
              <div className="feature-card">
                <div className="feature-icon">👥</div>
                <h3>Support Groups</h3>
                <p>Connect with others who understand what you're going through.</p>
                <ul className="feature-benefits">
                  <li>24/7 support</li>
                  <li>Verified members</li>
                  <li>Safe space</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Mood Meter Section */}
        <section className="mood-meter">
          <div className="container">
            <h2>How are you feeling today?</h2>
            <div className="mood-container">
              <div className="mood-display">
                <div className="mood-emoji">
                  {userMood ? moodData[userMood].emoji : '😊'}
                </div>
                <div className="mood-text">
                  <p id="current-mood">{userMood ? moodData[userMood].label : 'Select your mood'}</p>
                  <p>Shared by <span id="mood-count">{userMood ? moodData[userMood].count : 0}</span> others</p>
                </div>
              </div>
              <div className="mood-actions">
                <p>Track your mood to get personalized support</p>
                <div className="mood-buttons">
                  {Object.entries(moodData).map(([key, { emoji }]) => (
                    <button
                      key={key}
                      className={`mood-btn ${userMood === key ? 'active' : ''}`}
                      data-mood={key}
                      onClick={() => handleMoodSelection(key)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mission" id="about">
          <div className="container">
            <div className="mission-content">
              <h2>Our Mission</h2>
              <p>
                We believe everyone deserves access to quality mental health support.
                Our mission is to break down barriers and create a world where mental
                wellbeing is prioritized and accessible to all.
              </p>
            </div>
            <div className="mission-stats">
              <div className="stat-item">
                <span className="stat-number" id="members-count">0</span>
                <span className="stat-label">Active Members</span>
              </div>
              <div className="stat-item">
                <span className="stat-number" id="active-today">0</span>
                <span className="stat-label">Daily Check-ins</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
