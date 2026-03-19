import React, { useEffect, useRef, useState } from 'react';

interface Skill {
  name: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

interface SkillCategory {
  title: string;
  accentColor: string;
  icon: string;
  skills: Skill[];
}

interface SkillsPreviewProps {
  categories?: SkillCategory[];
}

const defaultCategories: SkillCategory[] = [
  {
    title: 'Frontend',
    accentColor: '#FF6B9D',
    icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
    skills: [
      { name: 'HTML5', level: 'Expert' },
      { name: 'CSS3', level: 'Expert' },
      { name: 'JavaScript', level: 'Expert' },
      { name: 'React.js', level: 'Advanced' },
      { name: 'Angular', level: 'Advanced' },
      { name: 'Shopify Liquid', level: 'Expert' },
      { name: 'Tailwind CSS', level: 'Advanced' },
      { name: 'Bootstrap', level: 'Advanced' },
      { name: 'Responsive Design', level: 'Expert' },
    ],
  },
  {
    title: 'Backend',
    accentColor: '#4ECDC4',
    icon: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01',
    skills: [
      { name: 'Java (Core + Advanced)', level: 'Advanced' },
      { name: 'DSA(Java)', level: 'Advanced' },
      { name: 'Spring Boot', level: 'Advanced' },
      { name: 'REST APIs', level: 'Advanced' },
      { name: 'Node.js', level: 'Intermediate' },
      { name: 'Python (Flask)', level: 'Intermediate' },
      { name: 'Typescript', level: 'Advanced' },
      { name: 'MySQL', level: 'Advanced' },
      { name: 'SQL', level: 'Advanced' },
    ],
  },
  {
    title: 'Tools',
    accentColor: '#F8B500',
    icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    skills: [
      { name: 'Git', level: 'Expert' },
      { name: 'Figma', level: 'Advanced' },
      { name: 'VS Code', level: 'Expert' },
      { name: 'Webpack', level: 'Advanced' },
      { name: 'Vite', level: 'Advanced' },
      { name: 'PostMan', level: 'Expert' },
      { name: 'Jest', level: 'Advanced' },
      { name: 'Cypress', level: 'Intermediate' },
      { name: 'BurpSuit', level: 'Intermediate' },
    ],
  },
  {
    title: 'Cloud',
    accentColor: '#917FB3',
    icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z',
    skills: [
      { name: 'AWS', level: 'Advanced' },
      { name: 'Vercel', level: 'Expert' },
      { name: 'Netlify', level: 'Expert' },
      { name: 'Firebase', level: 'Advanced' },
      { name: 'Kubernetes', level: 'Intermediate' },
      { name: 'Terraform', level: 'Intermediate' },
      { name: 'CI/CD', level: 'Advanced' },
      { name: 'Serverless', level: 'Advanced' },
    ],
  },
  {
    title: 'E-Commerce',
    accentColor: '#FF8C42',
    icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5',
    skills: [
      { name: 'Shopify Theme Development', level: 'Expert' },
      { name: 'Shopify Liquid', level: 'Expert' },
      { name: 'Shopify Custom Sections', level: 'Advanced' },
      { name: 'Shopify APIs', level: 'Advanced' },
      { name: 'Shopify Performance Optimization', level: 'Advanced' },
      { name: 'Shopify App Integration', level: 'Advanced' },
      { name: 'Payment Gateway Integration', level: 'Advanced' },
      { name: 'SEO for E-Commerce', level: 'Intermediate' },
    ],
  },
  {
    title: 'Creative & Marketing',
    accentColor: '#8B5CF6',
    icon: 'M12 4v16m8-8H4',
    skills: [
      { name: 'Graphic Design', level: 'Advanced' },
      { name: 'Product Creative Design', level: 'Advanced' },
      { name: 'Ad Creatives Design', level: 'Advanced' },
      { name: 'Photoshop', level: 'Intermediate' },
      { name: 'UI/UX Design', level: 'Intermediate' },
      { name: 'Merchant Center', level: 'Intermediate' },
      { name: 'Canva', level: 'Advanced' },
      { name: 'Google Ads', level: 'Intermediate' },
      { name: 'Meta Ads (Facebook & Instagram)', level: 'Advanced' },
      { name: 'Shopify Conversion Optimization', level: 'Advanced' },
     
      { name: 'Analytics & Performance Tracking', level: 'Intermediate' },
    ],
  },
];

const SkillsPreview: React.FC<SkillsPreviewProps> = ({ categories = defaultCategories }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

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
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
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

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Expert':
        return '#FF6B9D';
      case 'Advanced':
        return '#4ECDC4';
      case 'Intermediate':
        return '#F8B500';
      case 'Beginner':
        return '#917FB3';
      default:
        return '#FBEAEB';
    }
  };

  return (
    <section
      ref={sectionRef}
      className="skills-preview-section"
      aria-labelledby="skills-heading"
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
        {/* Section Header */}
        <div className="section-header">
          <div className="label-wrapper">
            <span className="section-label">Expertise</span>
            <div className="accent-line" />
          </div>
          <h2 id="skills-heading" className="section-title">
            Technical <span className="title-accent">Skills</span>
          </h2>
          <p className="section-description">
            A comprehensive toolkit built through years of shipping production code 
            across startups and enterprise environments.
          </p>
        </div>

        {/* Skills Categories */}
        <div className="skills-grid" role="list">
          {categories.map((category, categoryIndex) => (
            <article
              key={category.title}
              className="skill-category"
              style={{
                animationDelay: prefersReducedMotion ? '0s' : `${0.1 + categoryIndex * 0.15}s`,
                '--category-accent': category.accentColor,
              } as React.CSSProperties}
              role="listitem"
            >
              {/* Category Header */}
              <div className="category-header">
                <div 
                  className="category-icon-wrapper"
                  style={{ background: `${category.accentColor}15` }}
                >
                  <svg
                    className="category-icon"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={category.accentColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d={category.icon} />
                  </svg>
                </div>
                <h3 className="category-title" style={{ color: category.accentColor }}>
                  {category.title}
                </h3>
                <div 
                  className="category-accent-line"
                  style={{ background: category.accentColor }}
                />
              </div>

              {/* Skills Container */}
              <div className="skills-container">
                {category.skills.map((skill, skillIndex) => (
                  <div
                    key={skill.name}
                    className="skill-badge"
                    style={{
                      animationDelay: prefersReducedMotion 
                        ? '0s' 
                        : `${0.2 + categoryIndex * 0.15 + skillIndex * 0.05}s`,
                      '--skill-color': getLevelColor(skill.level || 'Intermediate'),
                      '--skill-accent': category.accentColor,
                    } as React.CSSProperties}
                    onMouseEnter={() => setHoveredSkill(skill.name)}
                    onMouseLeave={() => setHoveredSkill(null)}
                    role="button"
                    tabIndex={0}
                    aria-label={`${skill.name}, proficiency level: ${skill.level}`}
                  >
                    {/* Glow Effect */}
                    <div 
                      className="skill-glow"
                      style={{
                        background: `radial-gradient(circle at center, ${category.accentColor}30 0%, transparent 70%)`,
                        opacity: hoveredSkill === skill.name ? 1 : 0,
                      }}
                    />
                    
                    {/* Level Indicator */}
                    <span 
                      className="level-dot"
                      style={{ background: getLevelColor(skill.level || 'Intermediate') }}
                      title={skill.level}
                    />
                    
                    {/* Skill Name */}
                    <span className="skill-name">{skill.name}</span>

                    {/* Shine Effect */}
                    <div className="skill-shine" />
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        {/* Proficiency Legend */}
        <div className="legend-container">
          <span className="legend-title">Proficiency Levels:</span>
          <div className="legend-items">
            {[
              { level: 'Expert', color: '#FF6B9D' },
              { level: 'Advanced', color: '#4ECDC4' },
              { level: 'Intermediate', color: '#F8B500' },
              { level: 'Beginner', color: '#917FB3' },
            ].map((item) => (
              <div key={item.level} className="legend-item">
                <span 
                  className="legend-dot" 
                  style={{ background: item.color }}
                />
                <span className="legend-text">{item.level}</span>
              </div>
            ))}
          </div>
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
    --card-border-hover: rgba(255, 255, 255, 0.15);
    --text-primary: #FBEAEB;
    --text-secondary: rgba(251, 234, 235, 0.7);
    --text-muted: rgba(251, 234, 235, 0.85);
    --text-dark: rgba(251, 234, 235, 0.7);
    --accent-pink: #FF6B9D;
    --accent-teal: #4ECDC4;
    --accent-gold: #F8B500;
    --accent-purple: #917FB3;
    --shadow-color: rgba(0, 0, 0, 0.3);
    --shadow-hover: rgba(0, 0, 0, 0.3);
    --grid-line: rgba(255, 255, 255, 0.03);
    --orb-1: #FF6B9D;
    --orb-2: #4ECDC4;
    --orb-3: #917FB3;
    --particle-color: rgba(251, 234, 235, 0.3);
    --progress-bg: rgba(255, 255, 255, 0.05);
    --accent-line: linear-gradient(90deg, transparent, #917FB3, transparent);
    --heading-gradient: linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 50%, #F8B500 100%);
    --category-header-border: rgba(255, 255, 255, 0.08);
    --badge-bg: rgba(255, 255, 255, 0.03);
    --badge-border: rgba(255, 255, 255, 0.08);
    --skill-shine: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
    --legend-bg: rgba(255, 255, 255, 0.03);
    --legend-border: rgba(255, 255, 255, 0.08);
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
    --shadow-color: rgba(47, 44, 79, 0.08);
    --shadow-hover: rgba(155, 110, 243, 0.15);
    --grid-line: rgba(155, 110, 243, 0.06);
    --orb-1: #E85D75;
    --orb-2: #9B6EF3;
    --orb-3: #D4A574;
    --particle-color: rgba(155, 110, 243, 0.4);
    --progress-bg: rgba(155, 110, 243, 0.1);
    --accent-line: linear-gradient(90deg, transparent, #9B6EF3, transparent);
    --heading-gradient: linear-gradient(135deg, #E85D75 0%, #9B6EF3 50%, #D4A574 100%);
    --category-header-border: rgba(155, 110, 243, 0.15);
    --badge-bg: rgba(155, 110, 243, 0.08);
    --badge-border: rgba(155, 110, 243, 0.15);
    --skill-shine: linear-gradient(90deg, transparent, rgba(155, 110, 243, 0.1), transparent);
    --legend-bg: #FFFFFF;
    --legend-border: rgba(155, 110, 243, 0.15);
  }

  /* Typography Enhancements - ADD THIS */
  .section-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(2.5rem, 6vw, 4.5rem);
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
    background: linear-gradient(135deg, #E85D75 0%, #9B6EF3 50%, #D4A574 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  /* END ADD BLOCK */

        // .skills-preview-section {
        //   position: relative;
        //   min-height: 100vh;
        //   width: 100%;
        //   background: linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%);
        //   overflow: hidden;
        //   padding: 6rem 2rem;
        //   box-sizing: border-box;
        // }

        .skills-preview-section {
          position: relative;
          min-height: 100vh;
          width: 100%;
          background: linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
          overflow: hidden;
          padding: 6rem 2rem;
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
          background: linear-gradient(90deg, #E85D75, #9B6EF3, #D4A574, #7C3AED);
        }

        @keyframes scrollProgress {
          to { width: 100%; }
        }

        /* Content Container */
        .content-container {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.34, 1.56, 0.64, 1),
                      transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .content-container.visible {
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
          margin: 0 0 1.5rem 0;
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

        // .section-description {
        //   font-family: 'Inter', sans-serif;
        //   font-size: 1.125rem;
        //   font-weight: 400;
        //   line-height: 1.7;
        //   color: rgba(251, 234, 235, 0.7);
        //   max-width: 600px;
        //   margin: 0 auto;
        // }

        .section-description {
          font-family: 'Inter', sans-serif;
          font-size: 1.125rem;
          font-weight: 400;
          line-height: 1.7;
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto;
        }

        /* Skills Grid */
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2.5rem;
          margin-bottom: 3rem;
        }

        /* Skill Category */
        // .skill-category {
        //   background: rgba(255, 255, 255, 0.03);
        //   border: 1px solid rgba(255, 255, 255, 0.08);
        //   border-radius: 20px;
        //   padding: 2rem;
        //   opacity: 0;
        //   transform: translateY(30px);
        //   animation: categoryEntrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        //   transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
        //               box-shadow 0.3s ease,
        //               border-color 0.3s ease;
        // }

        .skill-category {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 20px;
          padding: 2rem;
          opacity: 0;
          transform: translateY(30px);
          animation: categoryEntrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
                      box-shadow 0.3s ease,
                      border-color 0.3s ease;
        }
        
        .skill-category:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px var(--shadow-hover);
          border-color: var(--category-accent);
        }
        
        [data-theme="light"] .skill-category {
          box-shadow: 0 4px 20px var(--shadow-color);
        }
        
        [data-theme="light"] .skill-category:hover {
          box-shadow: 0 25px 50px -12px rgba(155, 110, 243, 0.15);
          border-color: #9B6EF3;
        }

        @keyframes categoryEntrance {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        // .skill-category:hover {
        //   transform: translateY(-8px) scale(1.02);
        //   box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        //   border-color: var(--category-accent);
        // }

        /* Category Header */
        // .category-header {
        //   display: flex;
        //   align-items: center;
        //   gap: 1rem;
        //   margin-bottom: 1.5rem;
        //   padding-bottom: 1rem;
        //   border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        // }

        .category-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--category-header-border);
        }

        .category-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .skill-category:hover .category-icon-wrapper {
          transform: scale(1.2) rotate(-5deg);
        }

        .category-icon {
          transition: transform 0.3s ease;
        }

        // .category-title {
        //   font-family: 'Space Grotesk', sans-serif;
        //   font-size: 1.5rem;
        //   font-weight: 700;
        //   margin: 0;
        //   letter-spacing: -0.02em;
        //   flex-grow: 1;
        // }

        .category-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
          letter-spacing: -0.02em;
          flex-grow: 1;
          color: var(--text-primary);
        }
        
        [data-theme="light"] .category-title {
          background: linear-gradient(135deg, #2F2C4F 0%, #4A4466 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .category-accent-line {
          width: 40px;
          height: 3px;
          border-radius: 2px;
          opacity: 0.6;
        }

        /* Skills Container */
        .skills-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        /* Skill Badge */
        // .skill-badge {
        //   position: relative;
        //   display: inline-flex;
        //   align-items: center;
        //   gap: 0.5rem;
        //   padding: 0.6rem 1rem;
        //   background: rgba(255, 255, 255, 0.03);
        //   border: 1px solid rgba(255, 255, 255, 0.08);
        //   border-radius: 50px;
        //   font-family: 'Inter', sans-serif;
        //   font-size: 0.875rem;
        //   font-weight: 500;
        //   color: #FBEAEB;
        //   cursor: pointer;
        //   overflow: hidden;
        //   opacity: 0;
        //   transform: translateY(20px) scale(0.9);
        //   animation: skillEntrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        //   transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
        //               border-color 0.3s ease,
        //               box-shadow 0.3s ease;
        //   outline: none;
        // }

        .skill-badge {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1rem;
          background: var(--badge-bg);
          border: 1px solid var(--badge-border);
          border-radius: 50px;
          font-family: 'Inter', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
          cursor: pointer;
          overflow: hidden;
          opacity: 0;
          transform: translateY(20px) scale(0.9);
          animation: skillEntrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
                      border-color 0.3s ease,
                      box-shadow 0.3s ease;
          outline: none;
        }
        
        .skill-badge:hover,
        .skill-badge:focus-visible {
          transform: translateY(-4px) scale(1.05);
          border-color: var(--skill-accent);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }
        
        [data-theme="light"] .skill-badge {
          color: #2F2C4F;
          font-weight: 600;
        }
        
        [data-theme="light"] .skill-badge:hover,
        [data-theme="light"] .skill-badge:focus-visible {
          box-shadow: 0 10px 30px rgba(155, 110, 243, 0.15);
        }

        @keyframes skillEntrance {
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        // .skill-badge:hover,
        // .skill-badge:focus-visible {
        //   transform: translateY(-4px) scale(1.05);
        //   border-color: var(--skill-accent);
        //   box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        // }

        .skill-badge:focus-visible {
          outline: 2px solid var(--skill-accent);
          outline-offset: 2px;
        }

        /* Skill Glow */
        .skill-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
          border-radius: 50px;
        }

        /* Level Dot */
        .level-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
          box-shadow: 0 0 10px currentColor;
        }

        /* Skill Name */
        .skill-name {
          position: relative;
          z-index: 2;
        }

        /* Skill Shine */
        // .skill-shine {
        //   position: absolute;
        //   top: 0;
        //   left: -100%;
        //   width: 50%;
        //   height: 100%;
        //   background: linear-gradient(
        //     90deg,
        //     transparent,
        //     rgba(255, 255, 255, 0.15),
        //     transparent
        //   );
        //   transform: skewX(-25deg);
        //   transition: left 0.7s ease;
        //   pointer-events: none;
        // }

        .skill-shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: var(--skill-shine);
          transform: skewX(-25deg);
          transition: left 0.7s ease;
          pointer-events: none;
        }

        .skill-badge:hover .skill-shine {
          left: 150%;
        }

        /* Legend Container */
        // .legend-container {
        //   display: flex;
        //   align-items: center;
        //   justify-content: center;
        //   gap: 1.5rem;
        //   flex-wrap: wrap;
        //   padding: 1.5rem;
        //   background: rgba(255, 255, 255, 0.03);
        //   border: 1px solid rgba(255, 255, 255, 0.08);
        //   border-radius: 16px;
        //   max-width: 600px;
        //   margin: 0 auto;
        // }

        .legend-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          flex-wrap: wrap;
          padding: 1.5rem;
          background: var(--legend-bg);
          border: 1px solid var(--legend-border);
          border-radius: 16px;
          max-width: 600px;
          margin: 0 auto;
          transition: all 0.3s ease;
        }
        
        [data-theme="light"] .legend-container {
          box-shadow: 0 4px 20px rgba(155, 110, 243, 0.08);
        }

        // .legend-title {
        //   font-family: 'Inter', sans-serif;
        //   font-size: 0.875rem;
        //   font-weight: 600;
        //   color: rgba(251, 234, 235, 0.7);
        // }

        .legend-items {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          box-shadow: 0 0 8px currentColor;
        }

        // .legend-text {
        //   font-family: 'Inter', sans-serif;
        //   font-size: 0.8rem;
        //   font-weight: 500;
        //   color: rgba(251, 234, 235, 0.85);
        // }

        .legend-title {
          font-family: 'Inter', sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        
        .legend-text {
          font-family: 'Inter', sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--text-muted);
        }
        
        [data-theme="light"] .legend-text {
          font-weight: 600;
        }

        /* Mobile Responsive */
        @media (max-width: 968px) {
          .skills-preview-section {
            padding: 4rem 1.5rem;
          }

          .skills-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .skill-category {
            padding: 1.5rem;
          }

          .category-title {
            font-size: 1.25rem;
          }

          .skills-container {
            gap: 0.5rem;
          }

          .skill-badge {
            padding: 0.5rem 0.875rem;
            font-size: 0.8rem;
          }

          .legend-container {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .legend-items {
            justify-content: center;
            gap: 1rem;
          }

          .gradient-orb {
            opacity: 0.2;
          }
        }

        @media (max-width: 480px) {
          .section-title {
            font-size: 2rem;
          }

          .section-description {
            font-size: 1rem;
          }

          .category-header {
            gap: 0.75rem;
          }

          .category-icon-wrapper {
            width: 40px;
            height: 40px;
          }

          .category-icon {
            width: 20px;
            height: 20px;
          }
        }

        /* Focus Visible States */
        .skill-category:focus-visible {
          outline: 2px solid #917FB3;
          outline-offset: 4px;
        }

        /* Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          .content-container {
            transition: opacity 0.3s ease;
            transform: none;
          }

          .skill-category,
          .skill-badge {
            animation: none;
            opacity: 1;
            transform: none;
          }

          .gradient-orb,
          .particle {
            animation: none;
            transition: none;
          }

          .skill-category:hover,
          .skill-badge:hover {
            transform: none;
          }

          .category-icon-wrapper,
          .skill-glow,
          .skill-shine {
            transition: none;
          }
        }

        /* High Contrast Mode */
        // @media (prefers-contrast: high) {
        //   .skill-category {
        //     border: 2px solid rgba(255, 255, 255, 0.5);
        //   }

        //   .skill-badge {
        //     border: 2px solid rgba(255, 255, 255, 0.4);
        //   }

        //   .section-description {
        //     color: #FBEAEB;
        //   }
        // }

        /* High Contrast Mode */
@media (prefers-contrast: high) {
  .skill-category {
    border: 2px solid rgba(255, 255, 255, 0.5);
  }

  .skill-badge {
    border: 2px solid rgba(255, 255, 255, 0.4);
  }

  .section-description {
    color: #FBEAEB;
  }
}

[data-theme="light"] .skill-category {
  border: 2px solid rgba(155, 110, 243, 0.3);
}

[data-theme="light"] .skill-badge {
  border: 2px solid rgba(155, 110, 243, 0.3);
}

[data-theme="light"] .section-description {
  color: #2F2C4F;
}


/* Light Mode Premium Enhancements */
[data-theme="light"] .skills-preview-section {
  background-attachment: fixed;
}

[data-theme="light"] .content-container {
  max-width: 1100px;
  margin: 0 auto;
}

[data-theme="light"] .section-header {
  margin-bottom: 6rem;
}

[data-theme="light"] .skills-grid {
  gap: 2.5rem;
}

[data-theme="light"] .category-icon-wrapper {
  box-shadow: 0 4px 15px rgba(155, 110, 243, 0.15);
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
  [data-theme="light"] .skills-preview-section {
    padding: 4rem 1.5rem;
  }

  [data-theme="light"] .skills-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  [data-theme="light"] .skill-category {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  [data-theme="light"] .skills-preview-section {
    padding: 3rem 1rem;
  }

  [data-theme="light"] .section-title {
    font-size: 2rem;
  }

  [data-theme="light"] .category-title {
    font-size: 1.25rem;
  }
}
`}</style>
    </section>
  );
};

export default SkillsPreview;