import React, { useEffect, useRef, useState } from 'react';

interface Metric {
  value: string;
  label: string;
  accentColor: string;
}

interface AboutPreviewProps {
  metrics?: Metric[];
}

const defaultMetrics: Metric[] = [
  { value: '8+', label: 'Projects Built', accentColor: '#FF6B9D' },
  { value: '18+', label: 'Technologies Mastered', accentColor: '#4ECDC4' },
  { value: '2+', label: 'Years Learning & Building', accentColor: '#F8B500' },
];

const AboutPreview: React.FC<AboutPreviewProps> = ({ metrics = defaultMetrics }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [lineWidth, setLineWidth] = useState(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -100px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

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

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [prefersReducedMotion]);

  // Animate divider line on mount
  useEffect(() => {
    if (isVisible && !prefersReducedMotion) {
      const timer = setTimeout(() => setLineWidth(60), 300);
      return () => clearTimeout(timer);
    } else if (isVisible) {
      setLineWidth(60);
    }
  }, [isVisible, prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="about-preview-section"
      aria-labelledby="about-heading"
    >
      {/* Dynamic Background with Gradient Orbs */}
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

      {/* Main Content */}
      <div className={`content-container ${isVisible ? 'visible' : ''}`}>
        <div className="about-grid">
          {/* Left Column - Text Content */}
          <div className="text-column">
            {/* Section Label */}
            <div className="label-wrapper">
              <span className="section-label">About</span>
              <div 
                className="accent-line" 
                style={{ width: lineWidth }}
              />
            </div>

            {/* Main Heading */}
            <h2 id="about-heading" className="section-title">
              Engineering meets{' '}
              <span className="title-accent">intentional design.</span>
            </h2>

            {/* Description Paragraph */}
            <p className="section-description">
              I'm a Full Stack Developer focused on building scalable, performance-driven 
              digital products. My experience spans e-commerce platforms, real-time systems, 
              and structured backend architectures. I blend clean system design, usability, 
              and business logic to create solutions that are not just functional — but 
              thoughtfully engineered.
            </p><br></br>

            {/* Metrics */}
            <div className="metrics-container" role="list">
              {metrics.map((metric, index) => (
                <div
                  key={metric.label}
                  className="metric-card"
                  style={{
                    animationDelay: prefersReducedMotion ? '0s' : `${0.3 + index * 0.15}s`,
                    '--metric-accent': metric.accentColor,
                  } as React.CSSProperties}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  role="listitem"
                  tabIndex={0}
                  aria-label={`${metric.value} ${metric.label}`}
                >
                  {/* Glow Effect */}
                  <div 
                    className="metric-glow"
                    style={{
                      background: `radial-gradient(circle at center, ${metric.accentColor}25 0%, transparent 70%)`,
                      opacity: hoveredCard === index ? 1 : 0,
                    }}
                  />
                  
                  {/* Accent Bar */}
                  <div 
                    className="metric-bar"
                    style={{ background: metric.accentColor }}
                  />
                  
                  <span 
                    className="metric-value"
                    style={{ color: metric.accentColor }}
                  >
                    {metric.value}
                  </span>
                  <span className="metric-label">{metric.label}</span>

                  {/* Shine Effect */}
                  <div className="metric-shine" />
                </div>
              ))}
            </div>

            {/* CTA Text */}
            <p className="cta-text">
              Currently building scalable commerce and product-driven platforms.
            </p>
          </div>

          {/* Right Column - Visual */}
          <div className="visual-column">
            <div 
              className="visual-container"
              style={{
                transform: `perspective(1000px) rotateY(${mousePosition.x * 5}deg) rotateX(${-mousePosition.y * 5}deg)`,
              }}
            >
              {/* Abstract Geometric Shape */}
              <div className="geometric-shape">
                <div className="shape-layer layer-1" />
                <div className="shape-layer layer-2" />
                <div className="shape-layer layer-3" />
                <div className="shape-glow" />
              </div>

              {/* Floating Elements */}
              <div className="float-element float-1" />
              <div className="float-element float-2" />
              <div className="float-element float-3" />
            </div>
          </div>
        </div>
      </div>

      <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');

  /* CSS VARIABLES - ADD THIS ENTIRE BLOCK */
  :root {
    /* Dark Mode (Default) */
    --bg-color: #0a0a1a;
    --bg-gradient-start: #0a0a1a;
    --bg-gradient-end: #1a1a3e;
    --card-bg: rgba(255, 255, 255, 0.03);
    --card-border: rgba(255, 255, 255, 0.08);
    --card-border-hover: rgba(255, 255, 255, 0.15);
    --text-primary: #FBEAEB;
    --text-secondary: rgba(251, 234, 235, 0.7);
    --text-muted: rgba(251, 234, 235, 0.6);
    --text-dark: rgba(251, 234, 235, 0.5);
    --accent-pink: #FF6B9D;
    --accent-teal: #4ECDC4;
    --accent-gold: #F8B500;
    --accent-purple: #917FB3;
    --accent-coral: #FF6B6B;
    --shadow-color: rgba(0, 0, 0, 0.3);
    --shadow-hover: rgba(0, 0, 0, 0.3);
    --grid-line: rgba(255, 255, 255, 0.03);
    --orb-1: #FF6B9D;
    --orb-2: #4ECDC4;
    --orb-3: #917FB3;
    --particle-color: rgba(251, 234, 235, 0.3);
    --progress-bg: rgba(255, 255, 255, 0.05);
    --metric-bar-opacity: 0.6;
    --layer-1-bg: linear-gradient(135deg, rgba(145, 127, 179, 0.2) 0%, rgba(78, 205, 196, 0.2) 100%);
    --layer-1-border: rgba(255, 255, 255, 0.1);
    --layer-2-bg: linear-gradient(135deg, rgba(255, 107, 157, 0.3) 0%, rgba(78, 205, 196, 0.3) 100%);
    --layer-2-border: rgba(255, 255, 255, 0.15);
    --layer-3-bg: linear-gradient(135deg, #F8B500 0%, #FF6B9D 100%);
    --layer-3-shadow: rgba(248, 181, 0, 0.4);
    --shape-glow: rgba(145, 127, 179, 0.4);
    --float-1: #FF6B9D;
    --float-2: #4ECDC4;
    --float-3: #F8B500;
    --accent-line: linear-gradient(90deg, #917FB3, transparent);
    --shine-gradient: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  }

  /* Light Mode - ADD THIS ENTIRE BLOCK */
  [data-theme="light"] {
    --bg-color: #FBF4F6;
    --bg-gradient-start: #FBF4F6;
    --bg-gradient-end: #FFFFFF;
    --card-bg: #FFFFFF;
    --card-border: rgba(155, 110, 243, 0.15);
    --card-border-hover: #9B6EF3;
    --text-primary: #2F2C4F;
    --text-secondary: #6B5E7A;
    --text-muted: #6B5E7A;
    --text-dark: #9B8AA8;
    --accent-pink: #E85D75;
    --accent-teal: #7C3AED;
    --accent-gold: #D4A574;
    --accent-purple: #9B6EF3;
    --accent-coral: #E85D75;
    --shadow-color: rgba(47, 44, 79, 0.08);
    --shadow-hover: rgba(155, 110, 243, 0.15);
    --grid-line: rgba(155, 110, 243, 0.06);
    --orb-1: #E85D75;
    --orb-2: #9B6EF3;
    --orb-3: #D4A574;
    --particle-color: rgba(155, 110, 243, 0.4);
    --progress-bg: rgba(155, 110, 243, 0.1);
    --metric-bar-opacity: 0.8;
    --layer-1-bg: linear-gradient(135deg, rgba(155, 110, 243, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%);
    --layer-1-border: rgba(155, 110, 243, 0.2);
    --layer-2-bg: linear-gradient(135deg, rgba(232, 93, 117, 0.15) 0%, rgba(124, 58, 237, 0.15) 100%);
    --layer-2-border: rgba(155, 110, 243, 0.25);
    --layer-3-bg: linear-gradient(135deg, #D4A574 0%, #E85D75 100%);
    --layer-3-shadow: rgba(212, 165, 116, 0.3);
    --shape-glow: rgba(155, 110, 243, 0.3);
    --float-1: #E85D75;
    --float-2: #9B6EF3;
    --float-3: #D4A574;
    --accent-line: linear-gradient(90deg, #9B6EF3, transparent);
    --shine-gradient: linear-gradient(90deg, transparent, rgba(155, 110, 243, 0.1), transparent);
  }

  /* Typography Enhancements - ADD THIS */
  .section-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(2.5rem, 5vw, 3.5rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.15;
    color: var(--text-primary);
    margin: 0 0 1.5rem 0;
  }

  [data-theme="light"] .section-title {
    background: linear-gradient(135deg, #2F2C4F 0%, #9B6EF3 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  [data-theme="light"] .title-accent {
    background: linear-gradient(135deg, #9B6EF3 0%, #7C3AED 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  /* END ADD BLOCK */

        // .about-preview-section {
        //   position: relative;
        //   min-height: 100vh;
        //   width: 100%;
        //   background: linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%);
        //   overflow: hidden;
        //   padding: 100px 2rem;
        //   box-sizing: border-box;
        // }

        .about-preview-section {
          position: relative;
          min-height: 100vh;
          width: 100%;
          background: linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
          overflow: hidden;
          padding: 100px 2rem;
          box-sizing: border-box;
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
          background: linear-gradient(90deg, #E85D75, #7C3AED, #D4A574, #9B6EF3);
        }

        @keyframes scrollProgress {
          to { width: 100%; }
        }

        /* Content Container */
        .content-container {
          position: relative;
          z-index: 2;
          max-width: 1000px;
          margin: 0 auto;
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s cubic-bezier(0.34, 1.56, 0.64, 1),
                      transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .content-container.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* About Grid */
        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
        }

        /* Text Column */
        .text-column {
          display: flex;
          flex-direction: column;
        }

        /* Label Wrapper */
        .label-wrapper {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        // .section-label {
        //   font-family: 'Inter', sans-serif;
        //   font-size: 0.875rem;
        //   font-weight: 600;
        //   text-transform: uppercase;
        //   letter-spacing: 0.15em;
        //   color: rgba(251, 234, 235, 0.7);
        // }

        .section-label {
          font-family: 'Inter', sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--text-secondary);
        }

        // .accent-line {
        //   height: 1px;
        //   background: linear-gradient(90deg, #917FB3, transparent);
        //   transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        // }

        .accent-line {
          height: 1px;
          background: var(--accent-line);
          transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* Section Title */
        .section-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2.5rem, 5vw, 3.5rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.1;
          color: #FBEAEB;
          margin: 0 0 1.5rem 0;
        }

        // .title-accent {
        //   background: linear-gradient(135deg, #917FB3 0%, #4ECDC4 100%);
        //   -webkit-background-clip: text;
        //   -webkit-text-fill-color: transparent;
        //   background-clip: text;
        // }

        .title-accent {
          background: linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-teal) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Section Description */
        // .section-description {
        //   font-family: 'Inter', sans-serif;
        //   font-size: 1.125rem;
        //   font-weight: 400;
        //   line-height: 1.7;
        //   color: rgba(251, 234, 235, 0.7);
        //   margin: 0 0 2.5rem 0;
        //   max-width: 90%;
        // }

        .section-description {
          font-family: 'Inter', sans-serif;
          font-size: 1.125rem;
          font-weight: 400;
          line-height: 1.7;
          color: var(--text-secondary);
          margin: 0 0 2.5rem 0;
          max-width: 90%;
        }

        /* Metrics Container */
        .metrics-container {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        /* Metric Card */
        // .metric-card {
        //   position: relative;
        //   flex: 1;
        //   background: rgba(255, 255, 255, 0.03);
        //   border: 1px solid rgba(255, 255, 255, 0.08);
        //   border-radius: 16px;
        //   padding: 1.5rem;
        //   overflow: hidden;
        //   opacity: 0;
        //   transform: translateY(30px);
        //   animation: metricEntrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        //   transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
        //               box-shadow 0.3s ease,
        //               border-color 0.3s ease;
        //   cursor: default;
        //   outline: none;
        // }

        .metric-card {
          position: relative;
          flex: 1;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 16px;
          padding: 1.5rem;
          overflow: hidden;
          opacity: 0;
          transform: translateY(30px);
          animation: metricEntrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
                      box-shadow 0.3s ease,
                      border-color 0.3s ease;
          cursor: default;
          outline: none;
        }
        
        [data-theme="light"] .metric-card {
          box-shadow: 0 4px 20px var(--shadow-color);
        }

        @keyframes metricEntrance {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        // .metric-card:hover,
        // .metric-card:focus-visible {
        //   transform: translateY(-6px);
        //   box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        //   border-color: var(--metric-accent);
        // }

        
        .metric-card:hover,
.metric-card:focus-visible {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px var(--shadow-hover);
  border-color: var(--metric-accent);
}

[data-theme="light"] .metric-card:hover,
[data-theme="light"] .metric-card:focus-visible {
  box-shadow: 0 25px 50px -12px rgba(155, 110, 243, 0.15);
}


        .metric-card:focus-visible {
          outline: 2px solid var(--metric-accent);
          outline-offset: 2px;
        }

        /* Metric Glow */
        .metric-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
          border-radius: 16px;
        }

        /* Metric Bar */
        // .metric-bar {
        //   position: absolute;
        //   top: 0;
        //   left: 0;
        //   right: 0;
        //   height: 3px;
        //   opacity: 0.6;
        //   transition: height 0.3s ease;
        // }

        .metric-bar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          opacity: var(--metric-bar-opacity);
          transition: height 0.3s ease;
        }

        .metric-card:hover .metric-bar {
          height: 4px;
        }

        /* Metric Value */
        .metric-value {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 2rem;
          font-weight: 700;
          display: block;
          margin-bottom: 0.25rem;
          letter-spacing: -0.02em;
        }

        /* Metric Label */
        // .metric-label {
        //   font-family: 'Inter', sans-serif;
        //   font-size: 0.875rem;
        //   font-weight: 500;
        //   color: rgba(251, 234, 235, 0.6);
        // }

        .metric-label {
          font-family: 'Inter', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-muted);
        }

        /* Metric Shine */
        // .metric-shine {
        //   position: absolute;
        //   top: 0;
        //   left: -100%;
        //   width: 50%;
        //   height: 100%;
        //   background: linear-gradient(
        //     90deg,
        //     transparent,
        //     rgba(255, 255, 255, 0.1),
        //     transparent
        //   );
        //   transform: skewX(-25deg);
        //   transition: left 0.7s ease;
        //   pointer-events: none;
        // }

        .metric-shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: var(--shine-gradient);
          transform: skewX(-25deg);
          transition: left 0.7s ease;
          pointer-events: none;
        }

        .metric-card:hover .metric-shine {
          left: 150%;
        }

        /* CTA Text */
        // .cta-text {
        //   font-family: 'Inter', sans-serif;
        //   font-size: 1rem;
        //   font-weight: 500;
        //   color: rgba(251, 234, 235, 0.5);
        //   font-style: italic;
        //   margin: 0;
        // }

        .cta-text {
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          font-weight: 500;
          color: var(--text-dark);
          font-style: italic;
          margin: 0;
        }

        /* Visual Column */
        .visual-column {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .visual-container {
          position: relative;
          width: 350px;
          height: 350px;
          transition: transform 0.3s ease-out;
        }

        /* Geometric Shape */
        .geometric-shape {
          position: relative;
          width: 100%;
          height: 100%;
          animation: shapeFloat 6s ease-in-out infinite;
        }

        @keyframes shapeFloat {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(2deg);
          }
        }

        .shape-layer {
          position: absolute;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        // .layer-1 {
        //   width: 280px;
        //   height: 280px;
        //   background: linear-gradient(135deg, rgba(145, 127, 179, 0.2) 0%, rgba(78, 205, 196, 0.2) 100%);
        //   backdrop-filter: blur(10px);
        //   border: 1px solid rgba(255, 255, 255, 0.1);
        //   animation: pulseLayer1 4s ease-in-out infinite;
        // }

        .layer-1 {
          width: 280px;
          height: 280px;
          background: var(--layer-1-bg);
          backdrop-filter: blur(10px);
          border: 1px solid var(--layer-1-border);
          animation: pulseLayer1 4s ease-in-out infinite;
        }

        @keyframes pulseLayer1 {
          0%, 100% { opacity: 0.8; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
        }

        // .layer-2 {
        //   width: 200px;
        //   height: 200px;
        //   background: linear-gradient(135deg, rgba(255, 107, 157, 0.3) 0%, rgba(78, 205, 196, 0.3) 100%);
        //   border: 1px solid rgba(255, 255, 255, 0.15);
        //   animation: pulseLayer2 5s ease-in-out infinite;
        // }

        .layer-2 {
          width: 200px;
          height: 200px;
          background: var(--layer-2-bg);
          border: 1px solid var(--layer-2-border);
          animation: pulseLayer2 5s ease-in-out infinite;
        }

        @keyframes pulseLayer2 {
          0%, 100% { opacity: 0.9; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        }

        // .layer-3 {
        //   width: 120px;
        //   height: 120px;
        //   background: linear-gradient(135deg, #F8B500 0%, #FF6B9D 100%);
        //   opacity: 0.9;
        //   box-shadow: 0 0 60px rgba(248, 181, 0, 0.4);
        //   animation: pulseLayer3 3s ease-in-out infinite;
        // }

        .layer-3 {
          width: 120px;
          height: 120px;
          background: var(--layer-3-bg);
          opacity: 0.9;
          box-shadow: 0 0 60px var(--layer-3-shadow);
          animation: pulseLayer3 3s ease-in-out infinite;
        }

        @keyframes pulseLayer3 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); box-shadow: 0 0 60px rgba(248, 181, 0, 0.4); }
          50% { transform: translate(-50%, -50%) scale(1.15); box-shadow: 0 0 80px rgba(248, 181, 0, 0.6); }
        }

        // .shape-glow {
        //   position: absolute;
        //   top: 50%;
        //   left: 50%;
        //   width: 300px;
        //   height: 300px;
        //   background: radial-gradient(circle, rgba(145, 127, 179, 0.4) 0%, transparent 70%);
        //   transform: translate(-50%, -50%);
        //   filter: blur(40px);
        //   z-index: -1;
        //   animation: glowPulse 4s ease-in-out infinite;
        // }

        .shape-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, var(--shape-glow) 0%, transparent 70%);
          transform: translate(-50%, -50%);
          filter: blur(40px);
          z-index: -1;
          animation: glowPulse 4s ease-in-out infinite;
        }
        
        [data-theme="light"] .shape-glow {
          opacity: 0.6;
        }

        @keyframes glowPulse {
          0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.2); }
        }

        /* Floating Elements */
        .float-element {
          position: absolute;
          border-radius: 50%;
          opacity: 0.6;
        }

        // .float-1 {
        //   width: 20px;
        //   height: 20px;
        //   background: #FF6B9D;
        //   top: 10%;
        //   right: 10%;
        //   animation: float1 4s ease-in-out infinite;
        // }

        // .float-2 {
        //   width: 15px;
        //   height: 15px;
        //   background: #4ECDC4;
        //   bottom: 20%;
        //   left: 5%;
        //   animation: float2 5s ease-in-out infinite;
        // }

        // .float-3 {
        //   width: 25px;
        //   height: 25px;
        //   background: #F8B500;
        //   top: 60%;
        //   right: 0%;
        //   animation: float3 6s ease-in-out infinite;
        // }

        .float-1 {
          width: 20px;
          height: 20px;
          background: var(--float-1);
          top: 10%;
          right: 10%;
          animation: float1 4s ease-in-out infinite;
        }
        
        .float-2 {
          width: 15px;
          height: 15px;
          background: var(--float-2);
          bottom: 20%;
          left: 5%;
          animation: float2 5s ease-in-out infinite;
        }
        
        .float-3 {
          width: 25px;
          height: 25px;
          background: var(--float-3);
          top: 60%;
          right: 0%;
          animation: float3 6s ease-in-out infinite;
        }
        
        [data-theme="light"] .float-element {
          opacity: 0.4;
        }

        @keyframes float1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(10px, -15px); }
        }

        @keyframes float2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-10px, 10px); }
        }

        @keyframes float3 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(15px, 5px); }
        }

        /* Mobile Responsive */
        @media (max-width: 968px) {
          .about-preview-section {
            padding: 80px 1.5rem;
          }

          .about-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }

          .text-column {
            order: 1;
            text-align: center;
          }

          .visual-column {
            order: 2;
          }

          .label-wrapper {
            justify-content: center;
          }

          .accent-line {
            display: none;
          }

          .section-description {
            max-width: 100%;
            font-size: 1rem;
          }

          .metrics-container {
            flex-direction: column;
            gap: 1rem;
          }

          .metric-card {
            padding: 1.25rem;
          }

          .metric-value {
            font-size: 1.75rem;
          }

          .visual-container {
            width: 280px;
            height: 280px;
          }

          .layer-1 { width: 220px; height: 220px; }
          .layer-2 { width: 160px; height: 160px; }
          .layer-3 { width: 100px; height: 100px; }
          .shape-glow { width: 240px; height: 240px; }

          .gradient-orb {
            opacity: 0.2;
            filter: blur(60px);
          }

          .orb-1 { width: 400px; height: 400px; }
          .orb-2 { width: 350px; height: 350px; }
          .orb-3 { width: 300px; height: 300px; }
        }

        @media (max-width: 480px) {
          .about-preview-section {
            padding: 60px 1rem;
          }

          .section-title {
            font-size: 2rem;
          }

          .section-description {
            font-size: 0.95rem;
          }

          .visual-container {
            width: 220px;
            height: 220px;
          }

          .layer-1 { width: 180px; height: 180px; }
          .layer-2 { width: 130px; height: 130px; }
          .layer-3 { width: 80px; height: 80px; }
          .shape-glow { width: 200px; height: 200px; }

          .metric-value {
            font-size: 1.5rem;
          }

          .cta-text {
            font-size: 0.9rem;
          }
        }

        /* Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          .content-container {
            transition: opacity 0.3s ease;
            transform: none;
          }

          .metric-card {
            animation: none;
            opacity: 1;
            transform: none;
          }

          .gradient-orb,
          .particle,
          .geometric-shape,
          .shape-layer,
          .shape-glow,
          .float-element,
          .accent-line {
            animation: none;
            transition: none;
          }

          .metric-card:hover {
            transform: none;
          }
        }

        /* High Contrast */
        // @media (prefers-contrast: high) {
        //   .metric-card {
        //     border: 2px solid rgba(255, 255, 255, 0.5);
        //   }

        //   .section-description {
        //     color: #FBEAEB;
        //   }
        // }

        /* High Contrast */
@media (prefers-contrast: high) {
  .metric-card {
    border: 2px solid rgba(255, 255, 255, 0.5);
  }

  .section-description {
    color: #FBEAEB;
  }
}

[data-theme="light"] .metric-card {
  border: 2px solid rgba(155, 110, 243, 0.3);
}

[data-theme="light"] .section-description {
  color: #2F2C4F;
}   

/* Light Mode Premium Enhancements */
[data-theme="light"] .about-preview-section {
  background-attachment: fixed;
}

[data-theme="light"] .content-container {
  max-width: 1100px;
  margin: 0 auto;
}

[data-theme="light"] .metric-value {
  color: #2F2C4F;
}

[data-theme="light"] .geometric-shape {
  filter: drop-shadow(0 10px 30px rgba(155, 110, 243, 0.1));
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
  [data-theme="light"] .about-preview-section {
    padding: 80px 1.5rem;
  }

  [data-theme="light"] .metric-card {
    padding: 1.25rem;
  }
}

@media (max-width: 480px) {
  [data-theme="light"] .about-preview-section {
    padding: 60px 1rem;
  }
}



      `}</style>
    </section>
  );
};

export default AboutPreview;