import React, { useEffect, useState, useRef } from "react";
import profileImage from "../../Assets/Gemini_Generated_Image_y6weljy6weljy6we.png";




// interface NavLinkItem {
//   label: string;
//   path: string;
//   icon: string;
//   color: string;
// }

// const navLinks: NavLinkItem[] = [
//   { label: "Home", path: "/", icon: "🏠", color: "#FF6B9D" },
//   { label: "Work", path: "/work", icon: "💼", color: "#4ECDC4" },
//   { label: "Thinking", path: "/thinking", icon: "💭", color: "#F8B500" },
//   { label: "Growth", path: "/growth", icon: "🌱", color: "#917FB3" },
//   { label: "Experiments", path: "/experiments", icon: "🧪", color: "#FF6B6B" },
//   { label: "Contact", path: "/contact", icon: "💌", color: "#C44569" },
// ];
const Hero: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeWord, setActiveWord] = useState<number | null>(null);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const highlightWords = [
    { text: "design", color: "#FF6B9D", icon: "🎨" },
    { text: "build", color: "#4ECDC4", icon: "⚡" },
    { text: "deployment", color: "#9B59B6", icon: "📦" },
    { text: "scale", color: "#F8B500", icon: "🚀" }
];
  return (
    <section 
      className={`hero ${isVisible ? "visible" : ""}`} 
      ref={heroRef}
      onMouseMove={handleMouseMove}
    >
      {/* Dynamic Background */}
      <div className="hero-bg">
        <div 
          className="gradient-orb orb-1"
          style={{ transform: `translate(${mousePos.x * 0.1}px, ${mousePos.y * 0.1}px)` }}
        />
        <div 
          className="gradient-orb orb-2"
          style={{ transform: `translate(${-mousePos.x * 0.15}px, ${-mousePos.y * 0.15}px)` }}
        />
        <div 
          className="gradient-orb orb-3"
          style={{ transform: `translate(${mousePos.x * 0.05}px, ${mousePos.y * 0.05}px)` }}
        />
      </div>

      {/* Particle Field */}
      <div className="particle-field">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Grid Overlay */}
      <div className="grid-overlay" />

      <div className="hero-container">
        {/* Left Content */}
        <div className="hero-content">
          {/* Badge */}
          <div className="hero-badge">
            <span className="badge-pulse" />
            <span>Available for Projects</span>
          </div>

          {/* Main Headline */}
          <h1 className="hero-title">
            <span className="title-line">Full Stack Developer</span>
            <span className="title-line">crafting{" "}</span>
            <span className="title-line">
              {highlightWords.map((word, index) => (
                <span
                  key={word.text}
                  className={`highlight-word ${activeWord === index ? "active" : ""}`}
                  style={{ "--word-color": word.color } as React.CSSProperties}
                  onMouseEnter={() => setActiveWord(index)}
                  onMouseLeave={() => setActiveWord(null)}
                >
                  <span className="word-icon">{word.icon}</span>
                  {word.text}
                  
                  <span className="word-glow" />
                  <span className="word-underline" />
                </span>
              )).reduce((prev, curr, i) => (
                <>{prev}{i > 0 && <span className="comma">, </span>}{curr}</>
              ))}
            </span>
            <span className="title-line">digital experiences</span>
            <span className="title-line">that matter.</span>
          </h1>

          {/* Subheading */}
          <p className="hero-subtitle">
            I transform complex problems into elegant solutions. 
            From <span className="text-accent">zero to production</span>, 
            I architect systems that are beautiful, robust, and 
            <span className="text-glow"> built to last</span>.
          </p>

          {/* Dialog */}
          <div className="hero-dialog">
            <div className="dialog-avatar">💡</div>
            <div className="dialog-content">
              <p>"The best code is poetry written in logic—every line should tell a story."</p>
              <div className="dialog-sparkles">
                <span>✨</span><span>🎯</span><span>✨</span>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hero-ctas">
            <a href="work" className="cta-primary">
              <span>Explore My Work</span>
              <div className="cta-shine" />
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a href="Contact" className="cta-secondary">
              <span>Let's Talk</span>
            </a>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-value">2+</span>
              <span className="stat-label">Years Experience</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-value">20+</span>
              <span className="stat-label">Projects Delivered</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-value">99%</span>
              <span className="stat-label">Client Satisfaction</span>
            </div>
          </div>
        </div>
        

        {/* Right Image */}
        <div className="hero-visual">
          <div className="image-container">
            <div className="image-glow" />
            <div className="image-ring ring-1" />
            <div className="image-ring ring-2" />
            <div className="image-ring ring-3" />
            
            <div className="profile-image">
              {/* Replace with your actual image */}
              <div className="image-placeholder">
                {/* <span>👨‍💻</span> */}
              <img src={profileImage} alt="Tomesh" />
              </div>
              {/* Or use: <img src="/your-image.jpg" alt="Tomesh" /> */}
            </div>

            {/* Floating Badges */}
            <div className="float-badge badge-1">
              <span>⚡</span>
              <span>React</span>
            </div>
            <div className="float-badge badge-2">
              <span>🔥</span>
              <span>Node.js</span>
            </div>
            <div className="float-badge badge-3">
              <span>🎯</span>
              <span>TypeScript</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator">
        <div className="scroll-mouse">
          <div className="scroll-wheel" />
        </div>
        <span>Scroll to explore</span>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700&display=swap');

        /* ============================================
           THEME VARIABLES - ADD THIS BLOCK
           ============================================ */
        
        /* DARK MODE (Default) - Your existing colors mapped to variables */
        :root {
          /* Backgrounds */
          --bg-color: linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 50%, #16213e 100%);
          --card-bg: rgba(255, 255, 255, 0.05);
          --card-border: rgba(255, 255, 255, 0.1);
          
          /* Text Colors */
          --text-primary: #FBEAEB;
          --text-secondary: rgba(251, 234, 235, 0.7);
          --text-muted: rgba(251, 234, 235, 0.6);
          
          /* Accents */
          --accent-primary: #917FB3;
          --accent-secondary: #4ECDC4;
          --accent-tertiary: #FF6B9D;
          --accent-warm: #F8B500;
          
          /* Gradients */
          --gradient-primary: linear-gradient(135deg, #917FB3 0%, #4ECDC4 100%);
          --gradient-text: linear-gradient(135deg, #FBEAEB 0%, #917FB3 100%);
          
          /* Glows & Effects */
          --glow-primary: rgba(145, 127, 179, 0.4);
          --glow-secondary: rgba(78, 205, 196, 0.4);
          --shadow-card: 0 20px 60px -20px rgba(0, 0, 0, 0.5);
        }

        /* LIGHT MODE - Country Garden Palette */
        .light {
          /* Backgrounds */
          --bg-color: #FBF4F6;
          --card-bg: #FFFFFF;
          --card-border: rgba(155, 110, 243, 0.15);
          
          /* Text Colors */
          --text-primary: #2F2C4F;
          --text-secondary: #6B5E7A;
          --text-muted: #6B5E7A;
          
          /* Accents */
          --accent-primary: #9B6EF3;
          --accent-secondary: #B794F6;
          --accent-tertiary: #D4A5A5;
          --accent-warm: #D4A574;
          
          /* Gradients */
          --gradient-primary: linear-gradient(135deg, #9B6EF3 0%, #B794F6 100%);
          --gradient-text: linear-gradient(135deg, #2F2C4F 0%, #9B6EF3 100%);
          
          /* Glows & Effects - softer in light mode */
          --glow-primary: rgba(155, 110, 243, 0.15);
          --glow-secondary: rgba(183, 148, 246, 0.15);
          --shadow-card: 0 10px 40px -10px rgba(47, 44, 79, 0.15);
        }

        /* ============================================
           END THEME VARIABLES
           ============================================ */

        .hero {
          width: 100%;
          min-height: 100vh;
          background: var(--bg-color);  /* CHANGED: Use variable */
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          padding: 6rem 1.5rem 4rem;
          box-sizing: border-box;
          opacity: 0;
          transform: translateY(30px);
          transition: all 1s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .hero.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Background */
        .hero-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.4;
          transition: transform 0.3s ease-out;
        }

        .orb-1 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, #917FB3 0%, transparent 70%);
          top: -20%;
          left: -10%;
        }

        .orb-2 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, #4ECDC4 0%, transparent 70%);
          bottom: -10%;
          right: -5%;
        }

        .orb-3 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, #FF6B9D 0%, transparent 70%);
          top: 40%;
          left: 30%;
          opacity: 0.2;
        }

        /* Particles */
        .particle-field {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          animation: float 15s infinite ease-in-out;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
            transform: scale(1);
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) scale(0);
            opacity: 0;
          }
        }

        /* Grid */
        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }

        /* Container */
        .hero-container {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          align-items: center;
          position: relative;
          z-index: 1;
          width: 100%;
        }

        /* Content */
        .hero-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          text-align: center;
        }

        /* Badge */
        // .hero-badge {
        //   display: inline-flex;
        //   align-items: center;
        //   gap: 0.75rem;
        //   padding: 0.625rem 1.25rem;
        //   background: rgba(78, 205, 196, 0.1);
        //   border: 1px solid rgba(78, 205, 196, 0.3);
        //   border-radius: 9999px;
        //   font-size: 0.875rem;
        //   font-weight: 600;
        //   color: #4ECDC4;
        //   align-self: center;
        //   animation: badgePulse 2s ease-in-out infinite;
        // }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.625rem 1.25rem;
          background: rgba(155, 110, 243, 0.1); /* Fallback */
          background: color-mix(in srgb, var(--accent-secondary) 10%, transparent);
          border: 1px solid color-mix(in srgb, var(--accent-secondary) 30%, transparent);
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--accent-secondary);
          align-self: center;
          animation: badgePulse 2s ease-in-out infinite;
        }

        // @keyframes badgePulse {
        //   0%, 100% { box-shadow: 0 0 0 0 rgba(78, 205, 196, 0.4); }
        //   50% { box-shadow: 0 0 20px 10px rgba(78, 205, 196, 0); }
        // }

        @keyframes badgePulse {
          0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent-secondary) 40%, transparent); }
          50% { box-shadow: 0 0 20px 10px transparent; }
        }

        // .badge-pulse {
        //   width: 8px;
        //   height: 8px;
        //   background: #4ECDC4;
        //   border-radius: 50%;
        //   animation: dotPulse 2s ease-in-out infinite;
        // }

        .badge-pulse {
          width: 8px;
          height: 8px;
          background: var(--accent-secondary);
          border-radius: 50%;
          animation: dotPulse 2s ease-in-out infinite;
        }

        @keyframes dotPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
        }

        /* Title */
        // .hero-title {
        //   font-family: 'Space Grotesk', sans-serif;
        //   font-size: clamp(2.5rem, 6vw, 4.5rem);
        //   font-weight: 800;
        //   line-height: 1.1;
        //   color: #FBEAEB;
        //   margin: 0;
        //   letter-spacing: -0.02em;
        // }

        .hero-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 800;
          line-height: 1.1;
          color: var(--text-primary);
          margin: 0;
          letter-spacing: -0.02em;
        }

        .title-line {
          display: block;
        }

        .highlight-word {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          color: var(--word-color);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .word-icon {
          font-size: 0.6em;
          opacity: 0;
          transform: scale(0) rotate(-180deg);
          transition: all 0.3s ease;
        }

        .highlight-word:hover .word-icon,
        .highlight-word.active .word-icon {
          opacity: 1;
          transform: scale(1) rotate(0deg);
        }

        .word-glow {
          position: absolute;
          inset: -10px;
          background: radial-gradient(circle, var(--word-color) 0%, transparent 70%);
          opacity: 0;
          filter: blur(20px);
          transition: opacity 0.3s ease;
          z-index: -1;
        }

        .highlight-word:hover .word-glow,
        .highlight-word.active .word-glow {
          opacity: 0.4;
        }

        .word-underline {
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 100%;
          height: 3px;
          background: var(--word-color);
          border-radius: 2px;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
          box-shadow: 0 0 10px var(--word-color);
        }

        .highlight-word:hover .word-underline,
        .highlight-word.active .word-underline {
          transform: scaleX(1);
        }

        // .comma {
        //   color: rgba(251, 234, 235, 0.5);
        // }
        .comma {
          color: var(--text-muted);
          opacity: 0.7;
        }

        /* Subtitle */
        // .hero-subtitle {
        //   font-size: clamp(1.125rem, 2.5vw, 1.375rem);
        //   line-height: 1.7;
        //   color: rgba(251, 234, 235, 0.7);
        //   max-width: 600px;
        //   margin: 0 auto;
        // }

        .hero-subtitle {
          font-size: clamp(1.125rem, 2.5vw, 1.375rem);
          line-height: 1.7;
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto;
        }

        // .text-accent {
        //   color: #917FB3;
        //   font-weight: 600;
        // }

        .text-accent {
          color: var(--accent-primary);
          font-weight: 600;
        }

        // .text-glow {
        //   color: #F8B500;
        //   font-weight: 600;
        //   text-shadow: 0 0 20px rgba(248, 181, 0, 0.3);
        // }

        .text-glow {
          color: var(--accent-warm);
          font-weight: 600;
          text-shadow: 0 0 20px color-mix(in srgb, var(--accent-warm) 30%, transparent);
        }

        /* Dialog */
        // .hero-dialog {
        //   display: inline-flex;
        //   align-items: center;
        //   gap: 1rem;
        //   padding: 1.25rem 1.5rem;
        //   background: rgba(255, 255, 255, 0.05);
        //   border: 1px solid rgba(255, 255, 255, 0.1);
        //   border-radius: 20px;
        //   backdrop-filter: blur(10px);
        //   align-self: center;
        //   animation: dialogFloat 4s ease-in-out infinite;
        // }

        .hero-dialog {
          display: inline-flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem 1.5rem;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 20px;
          backdrop-filter: blur(10px);
          align-self: center;
          animation: dialogFloat 4s ease-in-out infinite;
          box-shadow: var(--shadow-card);
        }

        @keyframes dialogFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        // .dialog-avatar {
        //   width: 50px;
        //   height: 50px;
        //   background: linear-gradient(135deg, #F8B500 0%, #FF6B6B 100%);
        //   border-radius: 50%;
        //   display: flex;
        //   align-items: center;
        //   justify-content: center;
        //   font-size: 1.5rem;
        //   animation: bulbPulse 2s ease-in-out infinite;
        // }

        .dialog-avatar {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, var(--accent-warm) 0%, var(--accent-tertiary) 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          animation: bulbPulse 2s ease-in-out infinite;
        }

        // @keyframes bulbPulse {
        //   0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(248, 181, 0, 0.4); }
        //   50% { transform: scale(1.1); box-shadow: 0 0 20px 10px rgba(248, 181, 0, 0); }
        // }

        @keyframes bulbPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent-warm) 40%, transparent); }
          50% { transform: scale(1.1); box-shadow: 0 0 20px 10px transparent; }
        }

        .dialog-content {
          text-align: left;
        }

        // .dialog-content p {
        //   margin: 0 0 0.5rem 0;
        //   color: rgba(251, 234, 235, 0.9);
        //   font-size: 0.9375rem;
        //   line-height: 1.6;
        //   font-style: italic;
        // }

        .dialog-content p {
          margin: 0 0 0.5rem 0;
          color: var(--text-primary);
          font-size: 0.9375rem;
          line-height: 1.6;
          font-style: italic;
          opacity: 0.9;
        }

        .dialog-sparkles {
          display: flex;
          gap: 0.5rem;
        }

        .dialog-sparkles span {
          animation: sparkle 1.5s ease-in-out infinite;
        }

        .dialog-sparkles span:nth-child(2) { animation-delay: 0.2s; }
        .dialog-sparkles span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes sparkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        /* CTAs */
        .hero-ctas {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
          margin-top: 0.5rem;
        }

        // .cta-primary {
        //   position: relative;
        //   display: inline-flex;
        //   align-items: center;
        //   gap: 0.75rem;
        //   padding: 1.125rem 2.5rem;
        //   background: linear-gradient(135deg, #917FB3 0%, #4ECDC4 100%);
        //   border-radius: 16px;
        //   color: white;
        //   font-size: 1.125rem;
        //   font-weight: 700;
        //   text-decoration: none;
        //   overflow: hidden;
        //   transition: all 0.3s ease;
        //   box-shadow: 0 10px 40px -10px rgba(145, 127, 179, 0.5);
        // }

        .cta-primary {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1.125rem 2.5rem;
          background: var(--gradient-primary);
          border-radius: 16px;
          color: white;
          font-size: 1.125rem;
          font-weight: 700;
          text-decoration: none;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 10px 40px -10px var(--glow-primary);
        }

        // .cta-primary:hover {
        //   transform: translateY(-3px) scale(1.02);
        //   box-shadow: 0 20px 60px -10px rgba(145, 127, 179, 0.6);
        // }

        .cta-primary:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 20px 60px -10px var(--glow-primary);
        }

        .cta-shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.6s ease;
        }

        .cta-primary:hover .cta-shine {
          left: 100%;
        }

        // .cta-secondary {
        //   padding: 1rem 2rem;
        //   color: rgba(251, 234, 235, 0.8);
        //   font-size: 1rem;
        //   font-weight: 600;
        //   text-decoration: none;
        //   border: 2px solid rgba(255, 255, 255, 0.2);
        //   border-radius: 12px;
        //   transition: all 0.3s ease;
        // }

        .cta-secondary {
          padding: 1rem 2rem;
          color: var(--text-secondary);
          font-size: 1rem;
          font-weight: 600;
          text-decoration: none;
          border: 2px solid var(--card-border);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        // .cta-secondary:hover {
        //   border-color: #917FB3;
        //   color: #917FB3;
        //   background: rgba(145, 127, 179, 0.1);
        // }

        .cta-secondary:hover {
          border-color: var(--accent-primary);
          color: var(--accent-primary);
          background: color-mix(in srgb, var(--accent-primary) 10%, transparent);
        }

        /* Stats */
        .hero-stats {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 2rem;
          margin-top: 1rem;
          padding-top: 2rem;
          // border-top: 1px solid rgba(255, 255, 255, 0.1);
          border-top: 1px solid var(--card-border);
        }

        .stat-item {
          text-align: center;
        }

        // .stat-value {
        //   display: block;
        //   font-family: 'Space Grotesk', sans-serif;
        //   font-size: 2rem;
        //   font-weight: 800;
        //   background: linear-gradient(135deg, #FBEAEB 0%, #917FB3 100%);
        //   -webkit-background-clip: text;
        //   -webkit-text-fill-color: transparent;
        //   background-clip: text;
        // }

        .stat-value {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 2rem;
          font-weight: 800;
          background: var(--gradient-text);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        // .stat-label {
        //   font-size: 0.875rem;
        //   color: rgba(251, 234, 235, 0.6);
        // }

        .stat-label {
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        // .stat-divider {
        //   width: 1px;
        //   height: 40px;
        //   background: rgba(255, 255, 255, 0.1);
        // }

        .stat-divider {
          width: 1px;
          height: 40px;
          background: var(--card-border);
        }

        /* Visual / Image Section */
        .hero-visual {
          display: flex;
          justify-content: center;
          align-items: center;
          order: -1; /* Image first on mobile */
        }

        .image-container {
          position: relative;
          width: 280px;
          height: 280px;
        }

        // .image-glow {
        //   position: absolute;
        //   inset: -20px;
        //   background: radial-gradient(circle, rgba(145, 127, 179, 0.4) 0%, transparent 70%);
        //   border-radius: 50%;
        //   animation: glowPulse 5s ease-in-out infinite;
        //   filter: blur(20px);
        // }

        .image-glow {
          position: absolute;
          inset: -20px;
          background: radial-gradient(circle, var(--glow-primary) 0%, transparent 70%);
          border-radius: 0%;
          animation: glowPulse 5s ease-in-out infinite;
          filter: blur(20px);
        }

        @keyframes glowPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.2); opacity: 0.8; }
        }

        // .image-ring {
        //   position: absolute;
        //   inset: 0;
        //   border: 2px solid rgba(145, 127, 179, 0.3);
        //   border-radius: 50%;
        //   animation: ringRotate 10s linear infinite;
        // }

        .image-ring {
          position: absolute;
          inset: 0;
          border: 2px solid color-mix(in srgb, var(--accent-primary) 30%, transparent);
          border-radius: 50%;
          animation: ringRotate 10s linear infinite;
        }

        .ring-1 {
          animation-duration: 10s;
          border-color: rgba(145, 127, 179, 0.3);
        }

        // .ring-2 {
        //   inset: -15px;
        //   animation-duration: 15s;
        //   animation-direction: reverse;
        //   border-color: rgba(78, 205, 196, 0.2);
        // }

        .ring-2 {
          inset: -15px;
          animation-duration: 15s;
          animation-direction: reverse;
          border-color: color-mix(in srgb, var(--accent-secondary) 20%, transparent);
        }

        // .ring-3 {
        //   inset: -30px;
        //   animation-duration: 20s;
        //   border-color: rgba(255, 107, 157, 0.15);
        // }

        .ring-3 {
          inset: -30px;
          animation-duration: 20s;
          border-color: color-mix(in srgb, var(--accent-tertiary) 15%, transparent);
        }

        @keyframes ringRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .profile-image {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 4px solid color-mix(in srgb, var(--accent-primary) 30%, transparent);
          overflow: hidden;
          background: linear-gradient(135deg, #1a1a3e 0%, #16213e 100%);
          // border: 4px solid rgba(145, 127, 179, 0.3);
          // box-shadow: 0 20px 60px -20px rgba(0, 0, 0, 0.5);
          box-shadow: var(--shadow-card);
          animation: imageFloat 6s ease-in-out infinite;
        }

        @keyframes imageFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }

        // .image-placeholder {
        //   width: 100%;
        //   height: 100%;
        //   display: flex;
        //   align-items: center;
        //   justify-content: center;
        //   font-size: 8rem;
        //   background: linear-gradient(135deg, #917FB3 0%, #4ECDC4 100%);
        //   -webkit-background-clip: text;
        //   -webkit-text-fill-color: transparent;
        // }

        .image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8rem;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .profile-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Floating Badges */
        // .float-badge {
        //   position: absolute;
        //   display: flex;
        //   align-items: center;
        //   gap: 0.5rem;
        //   padding: 0.5rem 1rem;
        //   background: rgba(255, 255, 255, 0.1);
        //   border: 1px solid rgba(255, 255, 255, 0.2);
        //   border-radius: 9999px;
        //   font-size: 0.875rem;
        //   font-weight: 600;
        //   color: #FBEAEB;
        //   backdrop-filter: blur(10px);
        //   animation: badgeFloat 3s ease-in-out infinite;
        // }

        .float-badge {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
          backdrop-filter: blur(10px);
          animation: badgeFloat 3s ease-in-out infinite;
          box-shadow: var(--shadow-card);
        }

        .badge-1 {
          top: 10%;
          right: -20%;
          animation-delay: 0s;
        }

        .badge-2 {
          bottom: 20%;
          left: -25%;
          animation-delay: 1s;
        }

        .badge-3 {
          bottom: 5%;
          right: -15%;
          animation-delay: 2s;
        }

        @keyframes badgeFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        /* Scroll Indicator */
        .scroll-indicator {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          // color: rgba(251, 234, 235, 0.5);
          color: var(--text-muted);
          font-size: 0.875rem;
          animation: indicatorFloat 2s ease-in-out infinite;
        }

        @keyframes indicatorFloat {
          0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.5; }
          50% { transform: translateX(-50%) translateY(10px); opacity: 1; }
        }

        .scroll-mouse {
          width: 26px;
          height: 40px;
          border: 2px solid rgba(251, 234, 235, 0.3);
          // border-radius: 13px;
          border: 2px solid var(--card-border);
          display: flex;
          justify-content: center;
          padding-top: 8px;
        }

        // .scroll-wheel {
        //   width: 4px;
        //   height: 8px;
        //   background: rgba(251, 234, 235, 0.5);
        //   border-radius: 2px;
        //   animation: wheelScroll 2s ease-in-out infinite;
        // }

        .scroll-wheel {
          width: 4px;
          height: 8px;
          background: var(--text-muted);
          border-radius: 2px;
          animation: wheelScroll 2s ease-in-out infinite;
        }

        @keyframes wheelScroll {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(8px); opacity: 0.3; }
        }

        /* Desktop Layout */
        @media (min-width: 968px) {
          .hero {
            padding: 2rem;
          }

          .hero-container {
            grid-template-columns: 1.2fr 1fr;
            gap: 4rem;
          }

          .hero-content {
            text-align: left;
            align-items: flex-start;
          }

          .hero-badge,
          .hero-dialog {
            align-self: flex-start;
          }

          .hero-ctas {
            flex-direction: row;
          }

          .hero-stats {
            justify-content: flex-start;
          }

          .hero-visual {
            order: 0; /* Image on right for desktop */
          }

          .image-container {
            width: 400px;
            height: 400px;
          }

          .float-badge {
            font-size: 1rem;
            padding: 0.625rem 1.25rem;
          }

          .badge-1 { right: -10%; }
          .badge-2 { left: -15%; }
          .badge-3 { right: -5%; }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 2rem;
          }

          .image-container {
            width: 240px;
            height: 240px;
          }

          .float-badge {
            display: none;
          }

          .hero-stats {
            flex-direction: column;
            gap: 1rem;
          }

          .stat-divider {
            width: 60px;
            height: 1px;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;