import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);

  useEffect(() => {
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

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScroll]);

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'nav-scrolled' : ''} ${isHidden ? 'nav-hidden' : ''}`}>
      <div className="container nav-container">
        <Link to="/" className="logo">
          <img src="/zenzone_png.png" alt="ZenZone Logo" className="h-10" />
        </Link>
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#resources">Resources</a></li>
          <li><a href="#about">About Us</a></li>
        </ul>
        <a href="#cta" className="cta-button">Get Started</a>
      </div>
    </nav>
  );
};

export default Navbar; 