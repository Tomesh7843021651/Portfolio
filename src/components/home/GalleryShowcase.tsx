import React, { useState, useEffect, useRef, useCallback } from 'react';
import image1 from "../../Assets/image1.jpeg";
import image2 from "../../Assets/image2.jpeg";
import image3 from "../../Assets/image3.jpeg";
import image4 from "../../Assets/image4.jpeg";
import image5 from "../../Assets/image5.jpeg";


interface GalleryItem {
  id: number;
  type: 'image' | 'video';
  src: string;
  title: string;
  category: string;
}

interface GalleryShowcaseProps {
  items?: GalleryItem[];
}

const defaultItems: GalleryItem[] = [
  {
    id: 1,
    type: 'image',
    src: image1,
    title: 'Neon Horizons',
    category: 'Digital Art'
  },
  {
    id: 2,
    type: 'image',
    src: image2,
    title: 'Abstract Flow',
    category: '3D Design'
  },
  {
    id: 3,
    type: 'image',
    src: image3,
    title: 'Cyber Interface',
    category: 'UI/UX'
  },
  {
    id: 4,
    type: 'image',
    src: image4,
    title: 'Liquid Dreams',
    category: 'Motion'
  },
  {
    id: 5,
    type: 'image',
    src: image5,
    title: 'Prism Core',
    category: 'Branding'
  }
];

const GalleryShowcase: React.FC<GalleryShowcaseProps> = ({ items = defaultItems }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef(0);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Intersection Observer for entrance animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Mouse tracking for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (prefersReducedMotion) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      setMousePosition({
        x: (clientX / innerWidth - 0.5) * 2,
        y: (clientY / innerHeight - 0.5) * 2,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReducedMotion]);

  // Auto-slide functionality
  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (isAutoPlaying && !isDragging) {
      autoPlayRef.current = setInterval(nextSlide, 4000);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlaying, isDragging, nextSlide]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsAutoPlaying(false);
    touchStartX.current = e.touches[0].clientX;
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    setTranslateX(diff);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const endX = e.changedTouches[0].clientX;
    const diff = endX - touchStartX.current;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    }
    
    setIsDragging(false);
    setTranslateX(0);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  // Mouse drag handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsAutoPlaying(false);
    setStartX(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - startX;
    setTranslateX(diff);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - startX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    }
    
    setIsDragging(false);
    setTranslateX(0);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setTranslateX(0);
      setTimeout(() => setIsAutoPlaying(true), 5000);
    }
  };

  const getSlideStyle = (index: number) => {
    const diff = index - activeIndex;
    const absDistance = Math.abs(diff);
    
    let translateXValue = diff * 60;
    let translateZValue = -absDistance * 100;
    let rotateYValue = diff * -15;
    let scaleValue = 1 - absDistance * 0.15;
    let opacityValue = 1 - absDistance * 0.3;
    let zIndexValue = 10 - absDistance;

    if (isDragging) {
      translateXValue += translateX * 0.5;
    }

    // Handle wrapping for infinite feel
    if (diff > items.length / 2) {
      translateXValue = (diff - items.length) * 60;
      rotateYValue = (diff - items.length) * -15;
    } else if (diff < -items.length / 2) {
      translateXValue = (diff + items.length) * 60;
      rotateYValue = (diff + items.length) * -15;
    }

    return {
      transform: `translateX(${translateXValue}%) translateZ(${translateZValue}px) rotateY(${rotateYValue}deg) scale(${Math.max(scaleValue, 0.5)})`,
      opacity: Math.max(opacityValue, 0),
      zIndex: zIndexValue,
      transition: isDragging ? 'none' : 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
    };
  };

  const getAccentColor = (index: number) => {
    const colors = ['#FF6B9D', '#4ECDC4', '#F8B500', '#917FB3', '#FF6B6B'];
    return colors[index % colors.length];
  };

  return (
    <section
      ref={sectionRef}
      className="gallery-showcase-section"
      aria-label="Project Gallery Showcase"
    >
      {/* Dynamic Background */}
      <div className="dynamic-background">
        <div
          className="gradient-orb orb-1"
          style={{
            transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px)`,
          }}
        />
        <div
          className="gradient-orb orb-2"
          style={{
            transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * 20}px)`,
          }}
        />
        <div
          className="gradient-orb orb-3"
          style={{
            transform: `translate(${mousePosition.x * 15}px, ${mousePosition.y * -25}px)`,
          }}
        />
      </div>

      {/* Particle Field */}
      <div className="particle-field" aria-hidden="true">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${3 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Grid Overlay */}
      <div className="grid-overlay" aria-hidden="true" />

      {/* Scroll Progress Bar */}
      <div className="scroll-progress-container" aria-hidden="true">
        <div className="scroll-progress-bar" />
      </div>

      {/* Content Container */}
      <div className={`content-wrapper ${isVisible ? 'visible' : ''}`}>
        {/* Section Header */}
        <div className="section-header">
          <div className="label-wrapper">
            <span className="section-label">Portfolio</span>
            <div className="accent-line" />
          </div>
          <h2 className="section-title">
            Featured <span className="title-accent">Works</span>
          </h2>
        </div>

        {/* Carousel Container */}
        <div 
          className="carousel-container"
          ref={carouselRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <div className="carousel-stage">
            {items.map((item, index) => {
              const isActive = index === activeIndex;
              const accentColor = getAccentColor(index);
              
              return (
                <div
                  key={item.id}
                  className={`slide ${isActive ? 'active' : ''}`}
                  style={getSlideStyle(index)}
                  onClick={() => {
                    if (!isDragging) {
                      setActiveIndex(index);
                      setIsAutoPlaying(false);
                      setTimeout(() => setIsAutoPlaying(true), 5000);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${item.title}`}
                  aria-pressed={isActive}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveIndex(index);
                    }
                  }}
                >
                  <div 
                    className="slide-inner"
                    style={{
                      boxShadow: isActive 
                        ? `0 0 40px ${accentColor}40, 0 25px 50px -12px rgba(0,0,0,0.5)`
                        : '0 25px 50px -12px rgba(0,0,0,0.5)'
                    }}
                  >
                    {/* Glowing Border for Active */}
                    {isActive && (
                      <div 
                        className="glow-border"
                        style={{
                          background: `linear-gradient(90deg, ${accentColor}, transparent, ${accentColor})`,
                        }}
                      />
                    )}
                    
                    {/* Media */}
                    <div className="media-wrapper">
                      {item.type === 'image' ? (
                        <img 
                          src={item.src} 
                          alt={item.title}
                          className="slide-media"
                          draggable={false}
                        />
                      ) : (
                        <video 
                          src={item.src}
                          className="slide-media"
                          muted
                          loop
                          playsInline
                        />
                      )}
                      
                      {/* Spotlight Overlay */}
                      <div className={`spotlight-overlay ${isActive ? 'active' : ''}`} />
                    </div>

                    {/* Content Overlay */}
                    <div className={`slide-content ${isActive ? 'visible' : ''}`}>
                      <span 
                        className="slide-category"
                        style={{ color: accentColor }}
                      >
                        {item.category}
                      </span>
                      <h3 className="slide-title">{item.title}</h3>
                    </div>

                    {/* Shine Effect on Hover */}
                    <div className="shine-effect" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Arrows */}
          <button
            className="nav-arrow arrow-prev"
            onClick={() => {
              prevSlide();
              setIsAutoPlaying(false);
              setTimeout(() => setIsAutoPlaying(true), 5000);
            }}
            aria-label="Previous slide"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            className="nav-arrow arrow-next"
            onClick={() => {
              nextSlide();
              setIsAutoPlaying(false);
              setTimeout(() => setIsAutoPlaying(true), 5000);
            }}
            aria-label="Next slide"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Indicators */}
        <div className="indicators" role="tablist" aria-label="Gallery slides">
          {items.map((item, index) => (
            <button
              key={item.id}
              className={`indicator ${index === activeIndex ? 'active' : ''}`}
              onClick={() => {
                setActiveIndex(index);
                setIsAutoPlaying(false);
                setTimeout(() => setIsAutoPlaying(true), 5000);
              }}
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Go to slide ${index + 1}: ${item.title}`}
              style={{
                background: index === activeIndex ? getAccentColor(index) : undefined
              }}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div 
            className="progress-bar"
            style={{
              width: `${((activeIndex + 1) / items.length) * 100}%`,
              background: `linear-gradient(90deg, ${getAccentColor(activeIndex)}, ${getAccentColor((activeIndex + 1) % items.length)})`
            }}
          />
        </div>
      </div>

      <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');

  /* CSS VARIABLES - ADD THIS ENTIRE BLOCK */
  :root {
    /* Dark Mode (Default) */
    --bg-color: #0a0a1a;
    --bg-gradient-start: #0a0a1a;
    --bg-gradient-end: #1a1a3e;
    --card-bg: rgba(255, 255, 255, 0.03);
    --card-border: rgba(255, 255, 255, 0.08);
    --text-primary: #FBEAEB;
    --text-secondary: rgba(251, 234, 235, 0.7);
    --text-muted: rgba(251, 234, 235, 0.6);
    --accent-pink: #FF6B9D;
    --accent-teal: #4ECDC4;
    --accent-gold: #F8B500;
    --accent-purple: #917FB3;
    --shadow-color: rgba(0, 0, 0, 0.3);
    --grid-line: rgba(255, 255, 255, 0.03);
    --orb-1: #FF6B9D;
    --orb-2: #4ECDC4;
    --orb-3: #917FB3;
    --particle-color: rgba(251, 234, 235, 0.3);
    --progress-bg: rgba(255, 255, 255, 0.05);
    --accent-line: linear-gradient(90deg, transparent, #917FB3, transparent);
    --heading-gradient: linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 50%, #F8B500 100%);
    --spotlight-bg: rgba(10, 10, 26, 0.4);
    --slide-content-bg: linear-gradient(to top, rgba(10, 10, 26, 0.95) 0%, transparent 100%);
    --nav-arrow-bg: rgba(255, 255, 255, 0.05);
    --nav-arrow-border: rgba(255, 255, 255, 0.1);
    --nav-arrow-hover-bg: rgba(255, 255, 255, 0.1);
    --indicator-border: rgba(255, 255, 255, 0.2);
    --indicator-hover-border: rgba(255, 255, 255, 0.5);
    --progress-container-bg: rgba(255, 255, 255, 0.1);
    --shine-effect: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  }

  /* Light Mode - ADD THIS ENTIRE BLOCK */
  [data-theme="light"] {
    --bg-color: #FBF4F6;
    --bg-gradient-start: #FBF4F6;
    --bg-gradient-end: #FFFFFF;
    --card-bg: #FFFFFF;
    --card-border: rgba(155, 110, 243, 0.15);
    --text-primary: #2F2C4F;
    --text-secondary: #6B5E7A;
    --text-muted: #9B8AA8;
    --accent-pink: #E85D75;
    --accent-teal: #7C3AED;
    --accent-gold: #D4A574;
    --accent-purple: #9B6EF3;
    --shadow-color: rgba(47, 44, 79, 0.08);
    --grid-line: rgba(155, 110, 243, 0.06);
    --orb-1: #E85D75;
    --orb-2: #9B6EF3;
    --orb-3: #D4A574;
    --particle-color: rgba(155, 110, 243, 0.4);
    --progress-bg: rgba(155, 110, 243, 0.1);
    --accent-line: linear-gradient(90deg, transparent, #9B6EF3, transparent);
    --heading-gradient: linear-gradient(135deg, #E85D75 0%, #9B6EF3 50%, #D4A574 100%);
    --spotlight-bg: rgba(251, 244, 246, 0.6);
    --slide-content-bg: linear-gradient(to top, rgba(47, 44, 79, 0.9) 0%, transparent 100%);
    --nav-arrow-bg: #FFFFFF;
    --nav-arrow-border: rgba(155, 110, 243, 0.2);
    --nav-arrow-hover-bg: #FFFFFF;
    --indicator-border: rgba(155, 110, 243, 0.2);
    --indicator-hover-border: rgba(155, 110, 243, 0.5);
    --progress-container-bg: rgba(155, 110, 243, 0.15);
    --shine-effect: linear-gradient(90deg, transparent, rgba(155, 110, 243, 0.15), transparent);
  }

  /* Typography Enhancements - ADD THIS */
  .section-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.15;
    color: var(--text-primary);
    margin: 0;
  }

  [data-theme="light"] .section-title {
    background: linear-gradient(135deg, #2F2C4F 0%, #9B6EF3 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  [data-theme="light"] .title-accent {
    background: linear-gradient(135deg, #E85D75 0%, #9B6EF3 50%, #D4A574 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  /* END ADD BLOCK */   

        // .gallery-showcase-section {
        //   position: relative;
        //   min-height: 100vh;
        //   width: 100%;
        //   background: linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%);
        //   overflow: hidden;
        //   padding: 6rem 2rem;
        //   box-sizing: border-box;
        //   perspective: 1000px;
        // }

        .gallery-showcase-section {
          position: relative;
          min-height: 100vh;
          width: 100%;
          background: linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
          overflow: hidden;
          padding: 6rem 2rem;
          box-sizing: border-box;
          perspective: 1000px;
          transition: background 0.5s ease;
        }

        /* Dynamic Background */
        .dynamic-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }

        .gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.4;
          transition: transform 0.3s ease-out;
        }

        // .orb-1 {
        //   width: 600px;
        //   height: 600px;
        //   background: radial-gradient(circle, #FF6B9D 0%, transparent 70%);
        //   top: -200px;
        //   right: -100px;
        // }

        // .orb-2 {
        //   width: 500px;
        //   height: 500px;
        //   background: radial-gradient(circle, #4ECDC4 0%, transparent 70%);
        //   bottom: -150px;
        //   left: -100px;
        // }

        // .orb-3 {
        //   width: 400px;
        //   height: 400px;
        //   background: radial-gradient(circle, #917FB3 0%, transparent 70%);
        //   top: 50%;
        //   left: 50%;
        //   transform: translate(-50%, -50%);
        // }

        .orb-1 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, var(--orb-1) 0%, transparent 70%);
          top: -200px;
          right: -100px;
          opacity: 0.4;
        }
        
        .orb-2 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, var(--orb-2) 0%, transparent 70%);
          bottom: -150px;
          left: -100px;
          opacity: 0.4;
        }
        
        .orb-3 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, var(--orb-3) 0%, transparent 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          opacity: 0.4;
        }
        
        [data-theme="light"] .orb-1,
        [data-theme="light"] .orb-2,
        [data-theme="light"] .orb-3 {
          opacity: 0.25;
          filter: blur(100px);
        }

        /* Particle Field */
        .particle-field {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        // .particle {
        //   position: absolute;
        //   width: 3px;
        //   height: 3px;
        //   background: rgba(251, 234, 235, 0.3);
        //   border-radius: 50%;
        //   animation: floatParticle infinite ease-in-out;
        // }

        .particle {
          position: absolute;
          width: 3px;
          height: 3px;
          background: var(--particle-color);
          border-radius: 50%;
          animation: floatParticle infinite ease-in-out;
        }

        @keyframes floatParticle {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.8;
          }
        }

        /* Grid Overlay */
        // .grid-overlay {
        //   position: absolute;
        //   top: 0;
        //   left: 0;
        //   width: 100%;
        //   height: 100%;
        //   background-image: 
        //     linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        //     linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
        //   background-size: 60px 60px;
        //   pointer-events: none;
        //   z-index: 1;
        // }

        .grid-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(var(--grid-line) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
          z-index: 1;
        }

        /* Scroll Progress Bar */
        // .scroll-progress-container {
        //   position: fixed;
        //   top: 0;
        //   left: 0;
        //   width: 100%;
        //   height: 3px;
        //   background: rgba(255, 255, 255, 0.05);
        //   z-index: 100;
        // }

        // .scroll-progress-bar {
        //   height: 100%;
        //   background: linear-gradient(90deg, #FF6B9D, #4ECDC4, #F8B500, #917FB3);
        //   width: 0%;
        //   animation: scrollProgress linear;
        //   animation-timeline: scroll();
        // }

        .scroll-progress-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: var(--progress-bg);
          z-index: 100;
        }
        
        .scroll-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, var(--accent-pink), var(--accent-teal), var(--accent-gold), var(--accent-purple));
          width: 0%;
          animation: scrollProgress linear;
          animation-timeline: scroll();
        }
        
        [data-theme="light"] .scroll-progress-bar {
          background: linear-gradient(90deg, #E85D75, #9B6EF3, #D4A574, #7C3AED);
        }

        @keyframes scrollProgress {
          to { width: 100%; }
        }

        /* Content Wrapper */
        .content-wrapper {
          position: relative;
          z-index: 2;
          max-width: 1400px;
          margin: 0 auto;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.34, 1.56, 0.64, 1),
                      transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .content-wrapper.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Section Header */
        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .label-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        // .section-label {
        //   font-family: 'Inter', sans-serif;
        //   font-size: 0.875rem;
        //   font-weight: 600;
        //   text-transform: uppercase;
        //   letter-spacing: 0.1em;
        //   color: rgba(251, 234, 235, 0.7);
        // }

        .section-label {
          font-family: 'Inter', sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-secondary);
        }

        // .accent-line {
        //   width: 60px;
        //   height: 1px;
        //   background: linear-gradient(90deg, transparent, #917FB3, transparent);
        // }

        .accent-line {
          width: 60px;
          height: 1px;
          background: var(--accent-line);
        }

        .section-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.1;
          color: #FBEAEB;
          margin: 0;
        }

        // .title-accent {
        //   background: linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 50%, #F8B500 100%);
        //   -webkit-background-clip: text;
        //   -webkit-text-fill-color: transparent;
        //   background-clip: text;
        // }

        .title-accent {
          background: var(--heading-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Carousel Container */
        .carousel-container {
          position: relative;
          width: 100%;
          height: 600px;
          display: flex;
          align-items: center;
          justify-content: center;
          user-select: none;
          -webkit-user-select: none;
        }

        .carousel-stage {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          transform-style: preserve-3d;
        }

        /* Slides */
        .slide {
          position: absolute;
          width: 600px;
          height: 450px;
          border-radius: 20px;
          cursor: pointer;
          outline: none;
        }

        .slide:focus-visible {
          outline: 2px solid #917FB3;
          outline-offset: 4px;
        }

        // .slide-inner {
        //   position: relative;
        //   width: 100%;
        //   height: 100%;
        //   border-radius: 20px;
        //   overflow: hidden;
        //   background: rgba(255, 255, 255, 0.03);
        //   border: 1px solid rgba(255, 255, 255, 0.08);
        //   transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
        //               box-shadow 0.3s ease;
        // }

        .slide-inner {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 20px;
          overflow: hidden;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
                      box-shadow 0.3s ease;
        }
        
        [data-theme="light"] .slide-inner {
          box-shadow: 0 10px 40px rgba(155, 110, 243, 0.1);
        }
        
        [data-theme="light"] .slide:hover .slide-inner {
          box-shadow: 0 25px 50px -12px rgba(155, 110, 243, 0.2);
          border-color: #9B6EF3;
        }

        .slide:hover .slide-inner {
          transform: translateY(-8px) scale(1.02);
        }

        /* Glow Border */
        .glow-border {
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          border-radius: 22px;
          z-index: -1;
          opacity: 0.8;
          animation: rotateBorder 3s linear infinite;
        }

        @keyframes rotateBorder {
          0% { filter: hue-rotate(0deg) blur(10px); }
          100% { filter: hue-rotate(360deg) blur(10px); }
        }

        /* Media */
        .media-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .slide-media {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .slide:hover .slide-media {
          transform: scale(1.1);
        }

        /* Spotlight Overlay */
        // .spotlight-overlay {
        //   position: absolute;
        //   top: 0;
        //   left: 0;
        //   width: 100%;
        //   height: 100%;
        //   background: radial-gradient(circle at center, transparent 0%, rgba(10, 10, 26, 0.4) 100%);
        //   opacity: 0.6;
        //   transition: opacity 0.5s ease;
        // }

        .spotlight-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at center, transparent 0%, var(--spotlight-bg) 100%);
          opacity: 0.6;
          transition: opacity 0.5s ease;
        }

        .spotlight-overlay.active {
          opacity: 0;
        }

        /* Slide Content */
        // .slide-content {
        //   position: absolute;
        //   bottom: 0;
        //   left: 0;
        //   right: 0;
        //   padding: 2rem;
        //   background: linear-gradient(to top, rgba(10, 10, 26, 0.95) 0%, transparent 100%);
        //   transform: translateY(20px);
        //   opacity: 0;
        //   transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        // }

        .slide-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 2rem;
          background: var(--slide-content-bg);
          transform: translateY(20px);
          opacity: 0;
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .slide-content.visible {
          transform: translateY(0);
          opacity: 1;
        }

        .slide-category {
          font-family: 'Inter', sans-serif;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          display: block;
          margin-bottom: 0.5rem;
        }

        // .slide-title {
        //   font-family: 'Space Grotesk', sans-serif;
        //   font-size: 1.75rem;
        //   font-weight: 700;
        //   color: #FBEAEB;
        //   margin: 0;
        //   letter-spacing: -0.02em;
        // }

        .slide-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
          letter-spacing: -0.02em;
        }
        
        [data-theme="light"] .slide-content .slide-title {
          color: #FFFFFF;
        }

        /* Shine Effect */
        // .shine-effect {
        //   position: absolute;
        //   top: 0;
        //   left: -100%;
        //   width: 50%;
        //   height: 100%;
        //   background: linear-gradient(
        //     90deg,
        //     transparent,
        //     rgba(255, 255, 255, 0.2),
        //     transparent
        //   );
        //   transform: skewX(-25deg);
        //   transition: left 0.7s ease;
        //   pointer-events: none;
        // }

        .shine-effect {
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: var(--shine-effect);
          transform: skewX(-25deg);
          transition: left 0.7s ease;
          pointer-events: none;
        }

        .slide:hover .shine-effect {
          left: 150%;
        }

        /* Navigation Arrows */
        // .nav-arrow {
        //   position: absolute;
        //   top: 50%;
        //   transform: translateY(-50%);
        //   width: 50px;
        //   height: 50px;
        //   border-radius: 50%;
        //   background: rgba(255, 255, 255, 0.05);
        //   border: 1px solid rgba(255, 255, 255, 0.1);
        //   color: #FBEAEB;
        //   display: flex;
        //   align-items: center;
        //   justify-content: center;
        //   cursor: pointer;
        //   z-index: 20;
        //   transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        //   backdrop-filter: blur(10px);
        // }

        .nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: var(--nav-arrow-bg);
          border: 1px solid var(--nav-arrow-border);
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 20;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          backdrop-filter: blur(10px);
        }
        
        .nav-arrow:hover {
          background: var(--nav-arrow-hover-bg);
          transform: translateY(-50%) scale(1.2) rotate(-5deg);
          border-color: var(--accent-purple);
          box-shadow: 0 10px 30px rgba(155, 110, 243, 0.2);
        }
        
        [data-theme="light"] .nav-arrow {
          color: #2F2C4F;
          box-shadow: 0 4px 15px rgba(155, 110, 243, 0.1);
        }
        
        [data-theme="light"] .nav-arrow:hover {
          box-shadow: 0 15px 30px rgba(155, 110, 243, 0.2);
        }

        .nav-arrow:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-50%) scale(1.2) rotate(-5deg);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .nav-arrow:focus-visible {
          outline: 2px solid #917FB3;
          outline-offset: 2px;
        }

        .arrow-prev {
          left: 2rem;
        }

        .arrow-next {
          right: 2rem;
        }

        /* Indicators */
        .indicators {
          display: flex;
          justify-content: center;
          gap: 0.75rem;
          margin-top: 3rem;
          padding: 1rem;
        }

        // .indicator {
        //   width: 12px;
        //   height: 12px;
        //   border-radius: 50%;
        //   border: 2px solid rgba(255, 255, 255, 0.2);
        //   background: transparent;
        //   cursor: pointer;
        //   transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        //   padding: 0;
        // }

        // .indicator:hover {
        //   transform: scale(1.2);
        //   border-color: rgba(255, 255, 255, 0.5);
        // }

        .indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid var(--indicator-border);
          background: transparent;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          padding: 0;
        }
        
        .indicator:hover {
          transform: scale(1.2);
          border-color: var(--indicator-hover-border);
        }
        
        [data-theme="light"] .indicator.active {
          box-shadow: 0 0 20px currentColor;
        }

        .indicator.active {
          transform: scale(1.3);
          border-color: transparent;
          box-shadow: 0 0 20px currentColor;
        }

        .indicator:focus-visible {
          outline: 2px solid #917FB3;
          outline-offset: 2px;
        }

        /* Progress Container */
        // .progress-container {
        //   width: 200px;
        //   height: 3px;
        //   background: rgba(255, 255, 255, 0.1);
        //   border-radius: 3px;
        //   margin: 2rem auto 0;
        //   overflow: hidden;
        // }

        .progress-container {
          width: 200px;
          height: 3px;
          background: var(--progress-container-bg);
          border-radius: 3px;
          margin: 2rem auto 0;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          border-radius: 3px;
          transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* Mobile Responsive */
        @media (max-width: 968px) {
          .gallery-showcase-section {
            padding: 4rem 1rem;
          }

          .carousel-container {
            height: 500px;
          }

          .slide {
            width: 85vw;
            height: 350px;
          }

          .nav-arrow {
            display: none;
          }

          .slide-content {
            padding: 1.5rem;
          }

          .slide-title {
            font-size: 1.25rem;
          }

          .gradient-orb {
            opacity: 0.2;
          }
        }

        @media (max-width: 480px) {
          .carousel-container {
            height: 400px;
          }

          .slide {
            width: 90vw;
            height: 300px;
          }

          .section-title {
            font-size: 2rem;
          }
        }

        /* Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          .content-wrapper {
            transition: opacity 0.3s ease;
            transform: none;
          }

          .gradient-orb,
          .particle,
          .slide,
          .slide-media,
          .shine-effect,
          .glow-border {
            animation: none !important;
            transition: none !important;
          }

          .carousel-stage {
            transform-style: flat;
          }
        }

        /* High Contrast */
        // @media (prefers-contrast: high) {
        //   .slide-inner {
        //     border: 2px solid rgba(255, 255, 255, 0.5);
        //   }

        //   .nav-arrow {
        //     border: 2px solid rgba(255, 255, 255, 0.8);
        //   }
        // }

        /* High Contrast */
@media (prefers-contrast: high) {
  .slide-inner {
    border: 2px solid rgba(255, 255, 255, 0.5);
  }

  .nav-arrow {
    border: 2px solid rgba(255, 255, 255, 0.8);
  }
}

[data-theme="light"] .slide-inner {
  border: 2px solid rgba(155, 110, 243, 0.3);
}

[data-theme="light"] .nav-arrow {
  border: 2px solid rgba(155, 110, 243, 0.4);
}


/* Light Mode Premium Enhancements */
[data-theme="light"] .gallery-showcase-section {
  background-attachment: fixed;
}

[data-theme="light"] .content-wrapper {
  max-width: 1100px;
  margin: 0 auto;
}

[data-theme="light"] .section-header {
  margin-bottom: 6rem;
}

[data-theme="light"] .slide-category {
  color: rgba(255, 255, 255, 0.9);
}

/* Smooth theme transition for all elements */
* {
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Enhanced mobile experience for light mode */
@media (max-width: 968px) {
  [data-theme="light"] .gallery-showcase-section {
    padding: 4rem 1rem;
  }

  [data-theme="light"] .slide-content {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  [data-theme="light"] .gallery-showcase-section {
    padding: 3rem 1rem;
  }

  [data-theme="light"] .section-title {
    font-size: 2rem;
  }
}
`}</style>
    </section>
  );
};

export default GalleryShowcase;