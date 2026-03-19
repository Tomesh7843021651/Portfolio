import React, { useEffect, useRef, useState } from 'react';
import Contact from "../../pages/Contact";


interface CTAButton {
  text: string;
  href: string;
  variant: 'primary' | 'secondary';
  icon?: string;
}

interface CTAProps {
  heading?: string;
  subtext?: string;
  primaryButton?: CTAButton;
  secondaryButton?: CTAButton;
}

const defaultPrimaryButton: CTAButton = {
  text: 'Start a Conversation',
  href: 'Contact',
  variant: 'primary',
  icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
};

const defaultSecondaryButton: CTAButton = {
  text: 'View Resume',
  href: '/Tomesh-Dhongade-Resume.pdf',
  variant: 'secondary',
  icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
};

const CTA: React.FC<CTAProps> = ({
  heading = "Let's build something meaningful.",
  subtext = "Have a project in mind or just want to talk tech? I'd love to connect.",
  primaryButton = defaultPrimaryButton,
  secondaryButton = defaultSecondaryButton,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

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
      { threshold: 0.3, rootMargin: '0px 0px -50px 0px' }
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

  const renderButton = (button: CTAButton, index: number) => {
    const isPrimary = button.variant === 'primary';
    const isHovered = hoveredButton === button.text;
    const accentColor = isPrimary ? '#FF6B9D' : '#4ECDC4';

    return (
      <a
        key={button.text}
        href={button.href}
        download={button.variant === 'secondary'}
        target="_blank"
        className={`cta-button ${button.variant}`}
        style={{
          animationDelay: prefersReducedMotion ? '0s' : `${0.3 + index * 0.15}s`,
          '--button-accent': accentColor,
        } as React.CSSProperties}
        onMouseEnter={() => setHoveredButton(button.text)}
        onMouseLeave={() => setHoveredButton(null)}
        aria-label={button.text}
      >
        {/* Glow Effect */}
        <div
          className="button-glow"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x * 50 + 50}% ${
              mousePosition.y * 50 + 50
            }%, ${accentColor}40 0%, transparent 70%)`,
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* Icon */}
        {button.icon && (
          <svg
            className="button-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d={button.icon} />
          </svg>
        )}

        {/* Text */}
        <span className="button-text">{button.text}</span>

        {/* Shine Sweep */}
        <div className="button-shine" />

        {/* Pulse Animation for Primary */}
        {isPrimary && !prefersReducedMotion && (
          <div className="pulse-ring" style={{ borderColor: accentColor }} />
        )}
      </a>
    );
  };

  return (
    <section
      ref={sectionRef}
      className="cta-section"
      aria-labelledby="cta-heading"
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

      {/* Main Content Container */}
      <div className={`content-container ${isVisible ? 'visible' : ''}`}>
        {/* CTA Card */}
        <div className="cta-card">
          {/* Ambient Glow */}
          <div className="ambient-glow" />

          {/* Floating Decorative Elements */}
          <div className="float-element float-1" />
          <div className="float-element float-2" />
          <div className="float-element float-3" />

          {/* Content */}
          <div className="cta-content">
            {/* Heading */}
            <h2 id="cta-heading" className="cta-heading">
              {heading.split(' ').map((word, index) => (
                <span key={index} className={index >= 3 ? 'heading-accent' : ''}>
                  {word}{' '}
                </span>
              ))}
            </h2>

            {/* Subtext */}
            <p className="cta-subtext">{subtext}</p>

            {/* Buttons */}
            <div className="buttons-container" role="group" aria-label="Call to action buttons">
              {renderButton(primaryButton, 0)}
              {renderButton(secondaryButton, 1)}
            </div>
          </div>

          {/* Gradient Border Effect */}
          <div className="gradient-border" />
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
    --text-muted: rgba(251, 234, 235, 0.5);
    --accent-pink: #FF6B9D;
    --accent-teal: #4ECDC4;
    --accent-gold: #F8B500;
    --accent-purple: #917FB3;
    --accent-coral: #C44569;
    --shadow-color: rgba(0, 0, 0, 0.3);
    --shadow-pink: rgba(255, 107, 157, 0.3);
    --shadow-teal: rgba(78, 205, 196, 0.2);
    --grid-line: rgba(255, 255, 255, 0.03);
    --orb-1: #FF6B9D;
    --orb-2: #4ECDC4;
    --orb-3: #917FB3;
    --particle-color: rgba(251, 234, 235, 0.3);
    --progress-bg: rgba(255, 255, 255, 0.05);
    --ambient-glow: rgba(145, 127, 179, 0.15);
    --float-1: #FF6B9D20;
    --float-2: #4ECDC420;
    --float-3: #F8B50015;
    --btn-secondary-border: rgba(255, 255, 255, 0.2);
    --btn-secondary-hover-bg: rgba(78, 205, 196, 0.1);
    --btn-shine: rgba(255, 255, 255, 0.3);
    --gradient-border: linear-gradient(135deg, #FF6B9D, #4ECDC4, #F8B500, #917FB3);
    --heading-gradient: linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 50%, #F8B500 100%);
    --primary-btn-text: #0a0a1a;
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
    --accent-coral: #D64570;
    --shadow-color: rgba(47, 44, 79, 0.08);
    --shadow-pink: rgba(232, 93, 117, 0.25);
    --shadow-teal: rgba(124, 58, 237, 0.2);
    --grid-line: rgba(155, 110, 243, 0.06);
    --orb-1: #E85D75;
    --orb-2: #9B6EF3;
    --orb-3: #D4A574;
    --particle-color: rgba(155, 110, 243, 0.4);
    --progress-bg: rgba(155, 110, 243, 0.1);
    --ambient-glow: rgba(155, 110, 243, 0.1);
    --float-1: rgba(232, 93, 117, 0.15);
    --float-2: rgba(155, 110, 243, 0.15);
    --float-3: rgba(212, 165, 116, 0.1);
    --btn-secondary-border: rgba(155, 110, 243, 0.3);
    --btn-secondary-hover-bg: rgba(155, 110, 243, 0.08);
    --btn-shine: rgba(255, 255, 255, 0.4);
    --gradient-border: linear-gradient(135deg, #E85D75, #9B6EF3, #D4A574, #7C3AED);
    --heading-gradient: linear-gradient(135deg, #E85D75 0%, #9B6EF3 50%, #D4A574 100%);
    --primary-btn-text: #FFFFFF;
  }

  /* Typography Enhancements - ADD THIS */
  .cta-heading {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.15;
    color: var(--text-primary);
    margin: 0 0 1.5rem 0;
  }

  [data-theme="light"] .cta-heading {
    background: linear-gradient(135deg, #2F2C4F 0%, #9B6EF3 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  [data-theme="light"] .heading-accent {
    background: linear-gradient(135deg, #E85D75 0%, #9B6EF3 50%, #D4A574 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  /* END ADD BLOCK */

        // .cta-section {
        //   position: relative;
        //   min-height: 80vh;
        //   width: 100%;
        //   background: linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%);
        //   overflow: hidden;
        //   padding: 6rem 2rem;
        //   box-sizing: border-box;
        //   display: flex;
        //   align-items: center;
        //   justify-content: center;
        // }

        .cta-section {
          position: relative;
          min-height: 80vh;
          width: 100%;
          background: linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
          overflow: hidden;
          padding: 6rem 2rem;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
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

        /* Content Container */
        .content-container {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 900px;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.34, 1.56, 0.64, 1),
                      transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .content-container.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* CTA Card */
        // .cta-card {
        //   position: relative;
        //   background: rgba(255, 255, 255, 0.03);
        //   border: 1px solid rgba(255, 255, 255, 0.08);
        //   border-radius: 32px;
        //   padding: 4rem;
        //   text-align: center;
        //   overflow: hidden;
        //   backdrop-filter: blur(10px);
        //   opacity: 0;
        //   transform: translateY(30px);
        //   animation: cardEntrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        //   animation-delay: 0.1s;
        // }

        .cta-card {
          position: relative;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 32px;
          padding: 4rem;
          text-align: center;
          overflow: hidden;
          backdrop-filter: blur(10px);
          opacity: 0;
          transform: translateY(30px);
          animation: cardEntrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          animation-delay: 0.1s;
          transition: all 0.3s ease;
        }
        
        [data-theme="light"] .cta-card {
          box-shadow: 0 20px 60px rgba(155, 110, 243, 0.1);
        }

        @keyframes cardEntrance {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Ambient Glow */
        // .ambient-glow {
        //   position: absolute;
        //   top: -50%;
        //   left: -50%;
        //   width: 200%;
        //   height: 200%;
        //   background: radial-gradient(
        //     ellipse at center,
        //     rgba(145, 127, 179, 0.15) 0%,
        //     transparent 70%
        //   );
        //   pointer-events: none;
        //   z-index: 0;
        //   animation: ambientPulse 6s ease-in-out infinite;
        // }

        .ambient-glow {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(
            ellipse at center,
            var(--ambient-glow) 0%,
            transparent 70%
          );
          pointer-events: none;
          z-index: 0;
          animation: ambientPulse 6s ease-in-out infinite;
        }
        
        [data-theme="light"] .ambient-glow {
          opacity: 0.6;
        }

        @keyframes ambientPulse {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }

        /* Floating Elements */
        .float-element {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 1;
        }

        // .float-1 {
        //   width: 60px;
        //   height: 60px;
        //   background: linear-gradient(135deg, #FF6B9D20, transparent);
        //   top: 10%;
        //   right: 15%;
        //   animation: float1 5s ease-in-out infinite;
        // }

        // .float-2 {
        //   width: 40px;
        //   height: 40px;
        //   background: linear-gradient(135deg, #4ECDC420, transparent);
        //   bottom: 20%;
        //   left: 10%;
        //   animation: float2 6s ease-in-out infinite;
        // }

        // .float-3 {
        //   width: 80px;
        //   height: 80px;
        //   background: linear-gradient(135deg, #F8B50015, transparent);
        //   top: 60%;
        //   right: 5%;
        //   animation: float3 7s ease-in-out infinite;
        // }

        .float-1 {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, var(--float-1), transparent);
          top: 10%;
          right: 15%;
          animation: float1 5s ease-in-out infinite;
        }
        
        .float-2 {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, var(--float-2), transparent);
          bottom: 20%;
          left: 10%;
          animation: float2 6s ease-in-out infinite;
        }
        
        .float-3 {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, var(--float-3), transparent);
          top: 60%;
          right: 5%;
          animation: float3 7s ease-in-out infinite;
        }
        
        [data-theme="light"] .float-element {
          opacity: 0.6;
        }

        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(15px, -20px) rotate(10deg); }
        }

        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-20px, 15px) rotate(-10deg); }
        }

        @keyframes float3 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(10px, 10px) rotate(5deg); }
        }

        /* CTA Content */
        .cta-content {
          position: relative;
          z-index: 2;
        }

        /* Heading */
        .cta-heading {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.1;
          color: #FBEAEB;
          margin: 0 0 1.5rem 0;
        }

        // .heading-accent {
        //   background: linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 50%, #F8B500 100%);
        //   -webkit-background-clip: text;
        //   -webkit-text-fill-color: transparent;
        //   background-clip: text;
        // }

        .heading-accent {
          background: var(--heading-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Subtext */
        // .cta-subtext {
        //   font-family: 'Inter', sans-serif;
        //   font-size: 1.25rem;
        //   font-weight: 400;
        //   line-height: 1.7;
        //   color: rgba(251, 234, 235, 0.7);
        //   max-width: 500px;
        //   margin: 0 auto 3rem auto;
        // }

        .cta-subtext {
          font-family: 'Inter', sans-serif;
          font-size: 1.25rem;
          font-weight: 400;
          line-height: 1.7;
          color: var(--text-secondary);
          max-width: 500px;
          margin: 0 auto 3rem auto;
        }

        /* Buttons Container */
        .buttons-container {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
        }

        /* CTA Button */
        .cta-button {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1.25rem 2.5rem;
          border-radius: 50px;
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          overflow: hidden;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
                      box-shadow 0.3s ease;
          opacity: 0;
          transform: translateY(20px);
          animation: buttonEntrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          outline: none;
          border: none;
        }

        @keyframes buttonEntrance {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .cta-button:hover {
          transform: translateY(-8px) scale(1.02);
        }

        .cta-button:focus-visible {
          outline: 2px solid #FBEAEB;
          outline-offset: 4px;
        }

        /* Primary Button */
        // .cta-button.primary {
        //   background: linear-gradient(135deg, #FF6B9D 0%, #C44569 100%);
        //   color: #0a0a1a;
        //   box-shadow: 0 10px 30px rgba(255, 107, 157, 0.3);
        // }

        // .cta-button.primary:hover {
        //   box-shadow: 0 20px 40px rgba(255, 107, 157, 0.4);
        // }

        .cta-button.primary {
          background: linear-gradient(135deg, var(--accent-pink) 0%, var(--accent-coral) 100%);
          color: var(--primary-btn-text);
          box-shadow: 0 10px 30px var(--shadow-pink);
        }
        
        .cta-button.primary:hover {
          box-shadow: 0 20px 40px var(--shadow-pink);
        }
        
        [data-theme="light"] .cta-button.primary {
          box-shadow: 0 10px 30px rgba(232, 93, 117, 0.25);
        }
        
        [data-theme="light"] .cta-button.primary:hover {
          box-shadow: 0 20px 40px rgba(232, 93, 117, 0.35);
        }

        /* Secondary Button */
        // .cta-button.secondary {
        //   background: transparent;
        //   color: #FBEAEB;
        //   border: 2px solid rgba(255, 255, 255, 0.2);
        //   backdrop-filter: blur(10px);
        // }

        // .cta-button.secondary:hover {
        //   border-color: #4ECDC4;
        //   background: rgba(78, 205, 196, 0.1);
        //   box-shadow: 0 10px 30px rgba(78, 205, 196, 0.2);
        // }

        .cta-button.secondary {
          background: transparent;
          color: var(--text-primary);
          border: 2px solid var(--btn-secondary-border);
          backdrop-filter: blur(10px);
        }
        
        .cta-button.secondary:hover {
          border-color: var(--accent-teal);
          background: var(--btn-secondary-hover-bg);
          box-shadow: 0 10px 30px var(--shadow-teal);
        }
        
        [data-theme="light"] .cta-button.secondary:hover {
          box-shadow: 0 10px 30px rgba(124, 58, 237, 0.15);
        }

        /* Button Glow */
        .button-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
          border-radius: 50px;
        }

        /* Button Icon */
        .button-icon {
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          flex-shrink: 0;
        }

        .cta-button:hover .button-icon {
          transform: scale(1.2) rotate(-5deg);
        }

        /* Button Text */
        .button-text {
          position: relative;
          z-index: 2;
        }

        /* Button Shine */
        // .button-shine {
        //   position: absolute;
        //   top: 0;
        //   left: -100%;
        //   width: 50%;
        //   height: 100%;
        //   background: linear-gradient(
        //     90deg,
        //     transparent,
        //     rgba(255, 255, 255, 0.3),
        //     transparent
        //   );
        //   transform: skewX(-25deg);
        //   transition: left 0.7s ease;
        //   pointer-events: none;
        //   z-index: 1;
        // }

        .button-shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            var(--btn-shine),
            transparent
          );
          transform: skewX(-25deg);
          transition: left 0.7s ease;
          pointer-events: none;
          z-index: 1;
        }

        .cta-button:hover .button-shine {
          left: 150%;
        }

        /* Pulse Ring for Primary */
        .pulse-ring {
          position: absolute;
          top: -4px;
          left: -4px;
          right: -4px;
          bottom: -4px;
          border-radius: 50px;
          border: 2px solid;
          opacity: 0;
          animation: pulse 3s ease-out infinite;
          pointer-events: none;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.05);
            opacity: 0;
          }
          100% {
            transform: scale(1.1);
            opacity: 0;
          }
        }

        /* Gradient Border */
        // .gradient-border {
        //   position: absolute;
        //   top: -2px;
        //   left: -2px;
        //   right: -2px;
        //   bottom: -2px;
        //   background: linear-gradient(135deg, #FF6B9D, #4ECDC4, #F8B500, #917FB3);
        //   border-radius: 34px;
        //   z-index: -1;
        //   opacity: 0.3;
        //   filter: blur(10px);
        //   animation: borderGlow 4s ease-in-out infinite;
        // }

        .gradient-border {
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: var(--gradient-border);
          border-radius: 34px;
          z-index: -1;
          opacity: 0.3;
          filter: blur(10px);
          animation: borderGlow 4s ease-in-out infinite;
        }
        
        [data-theme="light"] .gradient-border {
          opacity: 0.4;
        }

        @keyframes borderGlow {
          0%, 100% {
            opacity: 0.3;
            filter: blur(10px);
          }
          50% {
            opacity: 0.6;
            filter: blur(15px);
          }
        }

        /* Mobile Responsive */
        @media (max-width: 968px) {
          .cta-section {
            padding: 4rem 1.5rem;
            min-height: auto;
          }

          .cta-card {
            padding: 3rem 2rem;
            border-radius: 24px;
          }

          .cta-heading {
            font-size: clamp(2rem, 8vw, 3rem);
          }

          .cta-subtext {
            font-size: 1.1rem;
            margin-bottom: 2.5rem;
          }

          .buttons-container {
            flex-direction: column;
            gap: 1rem;
            width: 100%;
          }

          .cta-button {
            width: 100%;
            justify-content: center;
            padding: 1.25rem 2rem;
          }

          .gradient-orb {
            opacity: 0.2;
          }

          .float-element {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .cta-card {
            padding: 2.5rem 1.5rem;
          }

          .cta-heading {
            font-size: 1.75rem;
          }

          .cta-subtext {
            font-size: 1rem;
          }

          .cta-button {
            font-size: 0.9rem;
            padding: 1.1rem 1.5rem;
          }
        }

        /* Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          .content-container,
          .cta-card,
          .cta-button {
            transition: opacity 0.3s ease;
            animation: none;
            transform: none;
            opacity: 1;
          }

          .gradient-orb,
          .particle,
          .ambient-glow,
          .float-element,
          .pulse-ring,
          .gradient-border {
            animation: none;
            transition: none;
          }

          .cta-button:hover {
            transform: none;
          }

          .button-icon,
          .button-shine {
            transition: none;
          }
        }

        /* High Contrast Mode */
        // @media (prefers-contrast: high) {
        //   .cta-card {
        //     border: 2px solid rgba(255, 255, 255, 0.5);
        //   }

        //   .cta-button.secondary {
        //     border: 3px solid rgba(255, 255, 255, 0.8);
        //   }

        //   .cta-subtext {
        //     color: #FBEAEB;
        //   }
        // }

        /* High Contrast Mode */
@media (prefers-contrast: high) {
  .cta-card {
    border: 2px solid rgba(255, 255, 255, 0.5);
  }

  .cta-button.secondary {
    border: 3px solid rgba(255, 255, 255, 0.8);
  }

  .cta-subtext {
    color: #FBEAEB;
  }
}

[data-theme="light"] .cta-card {
  border: 2px solid rgba(155, 110, 243, 0.3);
}

[data-theme="light"] .cta-button.secondary {
  border: 2px solid rgba(155, 110, 243, 0.4);
}

[data-theme="light"] .cta-subtext {
  color: #2F2C4F;
}



/* Light Mode Premium Enhancements */
[data-theme="light"] .cta-section {
  background-attachment: fixed;
}

[data-theme="light"] .content-container {
  max-width: 1100px;
}

[data-theme="light"] .cta-button:focus-visible {
  outline: 2px solid #9B6EF3;
  outline-offset: 4px;
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
  [data-theme="light"] .cta-section {
    padding: 4rem 1.5rem;
  }

  [data-theme="light"] .cta-card {
    padding: 3rem 2rem;
  }
}

@media (max-width: 480px) {
  [data-theme="light"] .cta-section {
    padding: 3rem 1rem;
  }

  [data-theme="light"] .cta-card {
    padding: 2.5rem 1.5rem;
  }
}
`}</style>
    </section>
  );
};

export default CTA;