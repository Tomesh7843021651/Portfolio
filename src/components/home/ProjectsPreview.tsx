import React, { useEffect, useRef, useState } from 'react';

interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  link: string;
  accentColor: string;
}

interface ProjectsPreviewProps {
  projects?: Project[];
}

const defaultProjects: Project[] = [
  {
    id: 1,
    title: 'Neon Commerce',
    description: 'High-performance e-commerce platform with real-time inventory and AI-powered recommendations.',
    tags: ['Next.js', 'TypeScript', 'PostgreSQL', 'Redis'],
    link: 'https://github.com/Tomesh7843021651?tab=repositories',
    accentColor: '#FF6B9D'
  },
  {
    id: 2,
    title: 'Data Flow',
    description: 'Real-time analytics dashboard processing millions of events with sub-second latency.',
    tags: ['React', 'D3.js', 'Go', 'Kafka'],
    link: 'https://github.com/Tomesh7843021651?tab=repositories',
    accentColor: '#4ECDC4'
  },
  {
    id: 3,
    title: 'Cloud Sync',
    description: 'Distributed file synchronization system with end-to-end encryption and conflict resolution.',
    tags: ['Rust', 'WebAssembly', 'AWS', 'Docker'],
    link: 'https://github.com/Tomesh7843021651?tab=repositories',
    accentColor: '#F8B500'
  },
  {
    id: 4,
    title: 'AI Assistant',
    description: 'Natural language processing interface with context-aware responses and voice synthesis.',
    tags: ['Python', 'TensorFlow', 'FastAPI', 'WebRTC'],
    link: 'https://github.com/Tomesh7843021651?tab=repositories',
    accentColor: '#917FB3'
  },
  {
    id: 5,
    title: 'Crypto Vault',
    description: 'Multi-signature cryptocurrency wallet with hardware security module integration.',
    tags: ['Solidity', 'React Native', 'Node.js', 'GraphQL'],
    link: 'https://github.com/Tomesh7843021651?tab=repositories',
    accentColor: '#FF6B6B'
  },
  {
    id: 6,
    title: 'Design System',
    description: 'Comprehensive component library with accessibility-first approach and theming support.',
    tags: ['Storybook', 'Styled Components', 'Jest', 'CI/CD'],
    link: 'https://github.com/Tomesh7843021651?tab=repositories',
    accentColor: '#C44569'
  }
];

const ProjectsPreview: React.FC<ProjectsPreviewProps> = ({ projects = defaultProjects }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

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

  return (
    <section
      ref={sectionRef}
      className="projects-preview-section"
      aria-labelledby="projects-heading"
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
            <span className="section-label">Work</span>
            <div className="accent-line" />
          </div>
          <h2 id="projects-heading" className="section-title">
            Featured <span className="title-accent">Projects</span>
          </h2>
          <p className="section-description">
            A selection of recent work spanning full-stack development, 
            system architecture, and interactive experiences.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="projects-grid" role="list">
          {projects.map((project, index) => (
            <article
              key={project.id}
              className="project-card"
              style={{
                animationDelay: prefersReducedMotion ? '0s' : `${0.1 + index * 0.1}s`,
                '--card-accent': project.accentColor,
              } as React.CSSProperties}
              onMouseEnter={() => setHoveredCard(project.id)}
              onMouseLeave={() => setHoveredCard(null)}
              role="listitem"
            >
              {/* Gradient Highlight Bar */}
              <div 
                className="highlight-bar"
                style={{ background: project.accentColor }}
              />

              {/* Hover Glow Effect */}
              <div 
                className="card-glow"
                style={{
                  background: `radial-gradient(circle at ${mousePosition.x * 50 + 50}% ${mousePosition.y * 50 + 50}%, ${project.accentColor}20 0%, transparent 70%)`,
                  opacity: hoveredCard === project.id ? 1 : 0,
                }}
              />

              {/* Card Content */}
              <div className="card-content">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                
                {/* Tech Stack Tags */}
                <div className="tags-container">
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="tag"
                      style={{
                        borderColor: `${project.accentColor}30`,
                        color: project.accentColor,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* View Project Link */}
                <a
                 target="_blank"
                  href={project.link}
                  className="project-link"
                  aria-label={`View ${project.title} project details`}
                >
                  <span className="link-text">View Project</span>
                  <svg 
                    className="link-arrow" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                  <div className="link-shine" />
                </a>
              </div>

              {/* Ambient Border Glow */}
              <div 
                className="ambient-glow"
                style={{ 
                  boxShadow: `0 0 30px ${project.accentColor}20`,
                  opacity: hoveredCard === project.id ? 1 : 0 
                }}
              />
            </article>
          ))}
        </div>

        {/* View All CTA */}
        <div className="cta-container">
          <a href="Experiments" className="cta-button" aria-label="View all projects">
            <span className="cta-text">View All Projects</span>
            <div className="cta-shine" />
          </a>
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
    --text-muted: rgba(251, 234, 235, 0.7);
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
    --tag-bg: rgba(255, 255, 255, 0.03);
    --tag-bg-hover: rgba(255, 255, 255, 0.08);
    --link-shine: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    --cta-btn-bg: linear-gradient(135deg, #FF6B9D 0%, #917FB3 100%);
    --cta-btn-text: #0a0a1a;
    --cta-btn-shadow: rgba(255, 107, 157, 0.3);
    --cta-shine: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    --ambient-glow-opacity: 0.3;
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
    --tag-bg: rgba(155, 110, 243, 0.08);
    --tag-bg-hover: rgba(155, 110, 243, 0.12);
    --link-shine: linear-gradient(90deg, transparent, rgba(155, 110, 243, 0.15), transparent);
    --cta-btn-bg: linear-gradient(135deg, #E85D75 0%, #9B6EF3 100%);
    --cta-btn-text: #FFFFFF;
    --cta-btn-shadow: rgba(232, 93, 117, 0.25);
    --cta-shine: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
    --ambient-glow-opacity: 0.4;
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


        // .projects-preview-section {
        //   position: relative;
        //   min-height: 100vh;
        //   width: 100%;
        //   background: linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%);
        //   overflow: hidden;
        //   padding: 6rem 2rem;
        //   box-sizing: border-box;
        // }

        .projects-preview-section {
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

        /* Projects Grid */
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-bottom: 4rem;
        }

        /* Project Card */
        // .project-card {
        //   position: relative;
        //   background: rgba(255, 255, 255, 0.03);
        //   border: 1px solid rgba(255, 255, 255, 0.08);
        //   border-radius: 16px;
        //   overflow: hidden;
        //   opacity: 0;
        //   transform: translateY(30px);
        //   animation: cardEntrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        //   transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
        //               box-shadow 0.3s ease;
        //   cursor: pointer;
        // }

        .project-card {
          position: relative;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 16px;
          overflow: hidden;
          opacity: 0;
          transform: translateY(30px);
          animation: cardEntrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
                      box-shadow 0.3s ease;
          cursor: pointer;
        }
        
        .project-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px var(--shadow-hover);
          border-color: var(--card-accent);
        }
        
        [data-theme="light"] .project-card {
          box-shadow: 0 4px 20px var(--shadow-color);
        }
        
        [data-theme="light"] .project-card:hover {
          box-shadow: 0 25px 50px -12px rgba(155, 110, 243, 0.15);
          border-color: #9B6EF3;
        }

        @keyframes cardEntrance {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        // .project-card:hover {
        //   transform: translateY(-8px) scale(1.02);
        //   box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        //   border-color: var(--card-accent);
        // }

        /* Highlight Bar */
        .highlight-bar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          opacity: 0.8;
          transition: height 0.3s ease;
        }

        .project-card:hover .highlight-bar {
          height: 4px;
        }

        /* Card Glow */
        .card-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
          z-index: 1;
        }

        /* Card Content */
        .card-content {
          position: relative;
          z-index: 2;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 280px;
        }

        // .project-title {
        //   font-family: 'Space Grotesk', sans-serif;
        //   font-size: 1.5rem;
        //   font-weight: 700;
        //   color: #FBEAEB;
        //   margin: 0 0 1rem 0;
        //   letter-spacing: -0.02em;
        //   line-height: 1.2;
        // }

        .project-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 1rem 0;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }
        
        [data-theme="light"] .project-title {
          background: linear-gradient(135deg, #2F2C4F 0%, #4A4466 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        // .project-description {
        //   font-family: 'Inter', sans-serif;
        //   font-size: 0.95rem;
        //   font-weight: 400;
        //   line-height: 1.7;
        //   color: rgba(251, 234, 235, 0.7);
        //   margin: 0 0 1.5rem 0;
        //   flex-grow: 1;
        // }

        .project-description {
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem;
          font-weight: 400;
          line-height: 1.7;
          color: var(--text-muted);
          margin: 0 0 1.5rem 0;
          flex-grow: 1;
        }

        /* Tags */
        .tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        // .tag {
        //   font-family: 'Inter', sans-serif;
        //   font-size: 0.75rem;
        //   font-weight: 500;
        //   padding: 0.35rem 0.75rem;
        //   border-radius: 20px;
        //   border: 1px solid;
        //   background: rgba(255, 255, 255, 0.03);
        //   transition: all 0.3s ease;
        // }

        .tag {
          font-family: 'Inter', sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          padding: 0.35rem 0.75rem;
          border-radius: 20px;
          border: 1px solid;
          background: var(--tag-bg);
          transition: all 0.3s ease;
        }
        
        .tag:hover {
          transform: translateY(-2px);
          background: var(--tag-bg-hover);
        }
        
        [data-theme="light"] .tag {
          font-weight: 600;
          border-color: rgba(155, 110, 243, 0.2);
        }

        // .tag:hover {
        //   transform: translateY(-2px);
        //   background: rgba(255, 255, 255, 0.08);
        // }

        /* Project Link */
        // .project-link {
        //   position: relative;
        //   display: inline-flex;
        //   align-items: center;
        //   gap: 0.5rem;
        //   font-family: 'Inter', sans-serif;
        //   font-size: 0.9rem;
        //   font-weight: 600;
        //   color: #FBEAEB;
        //   text-decoration: none;
        //   padding: 0.75rem 0;
        //   overflow: hidden;
        //   align-self: flex-start;
        //   transition: color 0.3s ease;
        // }

        // .project-link:hover {
        //   color: var(--card-accent);
        // }

        .project-link {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
          text-decoration: none;
          padding: 0.75rem 0;
          overflow: hidden;
          align-self: flex-start;
          transition: color 0.3s ease;
        }
        
        .project-link:hover {
          color: var(--card-accent);
        }
        
        [data-theme="light"] .project-link {
          color: #2F2C4F;
        }

        .link-text {
          position: relative;
          z-index: 2;
        }

        .link-arrow {
          position: relative;
          z-index: 2;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .project-link:hover .link-arrow {
          transform: translateX(4px) scale(1.2) rotate(-5deg);
        }

        // .link-shine {
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

        .link-shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: var(--link-shine);
          transform: skewX(-25deg);
          transition: left 0.7s ease;
          pointer-events: none;
        }

        .project-link:hover .link-shine {
          left: 150%;
        }

        /* Ambient Glow */
        .ambient-glow {
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          border-radius: 18px;
          z-index: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }

        /* CTA Container */
        .cta-container {
          text-align: center;
        }

        // .cta-button {
        //   position: relative;
        //   display: inline-flex;
        //   align-items: center;
        //   justify-content: center;
        //   padding: 1rem 2.5rem;
        //   background: linear-gradient(135deg, #FF6B9D 0%, #917FB3 100%);
        //   border: none;
        //   border-radius: 50px;
        //   font-family: 'Space Grotesk', sans-serif;
        //   font-size: 1rem;
        //   font-weight: 600;
        //   color: #0a0a1a;
        //   text-decoration: none;
        //   cursor: pointer;
        //   overflow: hidden;
        //   transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
        //               box-shadow 0.3s ease;
        // }

        // .cta-button:hover {
        //   transform: translateY(-4px) scale(1.05);
        //   box-shadow: 0 20px 40px rgba(255, 107, 157, 0.3);
        // }

        .cta-button {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 1rem 2.5rem;
          background: var(--cta-btn-bg);
          border: none;
          border-radius: 50px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          color: var(--cta-btn-text);
          text-decoration: none;
          cursor: pointer;
          overflow: hidden;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
                      box-shadow 0.3s ease;
        }
        
        .cta-button:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 20px 40px var(--cta-btn-shadow);
        }
        
        [data-theme="light"] .cta-button:hover {
          box-shadow: 0 20px 40px rgba(232, 93, 117, 0.35);
          
        }

        .cta-text {
          position: relative;
          z-index: 2;
          color:#FBEAEBB3
        }

        // .cta-shine {
        //   position: absolute;
        //   top: 0;
        //   left: -100%;
        //   width: 50%;
        //   height: 100%;
        //   background: linear-gradient(
        //     90deg,
        //     transparent,
        //     rgba(255, 255, 255, 0.4),
        //     transparent
        //   );
        //   transform: skewX(-25deg);
        //   transition: left 0.7s ease;
        //   pointer-events: none;
        // }

        .cta-shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: var(--cta-shine);
          transform: skewX(-25deg);
          transition: left 0.7s ease;
          pointer-events: none;
        }

        .cta-button:hover .cta-shine {
          left: 150%;
        }

        .cta-button:focus-visible {
          outline: 2px solid #FBEAEB;
          outline-offset: 4px;
        }

        /* Mobile Responsive */
        @media (max-width: 968px) {
          .projects-preview-section {
            padding: 4rem 1.5rem;
          }

          .projects-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .project-card {
            min-height: auto;
          }

          .card-content {
            min-height: 240px;
            padding: 1.5rem;
          }

          .section-description {
            font-size: 1rem;
          }

          .gradient-orb {
            opacity: 0.2;
          }
        }

        @media (max-width: 480px) {
          .section-title {
            font-size: 2rem;
          }

          .project-title {
            font-size: 1.25rem;
          }

          .tags-container {
            gap: 0.35rem;
          }

          .tag {
            font-size: 0.7rem;
            padding: 0.25rem 0.6rem;
          }
        }

        /* Focus Visible States */
        .project-card:focus-visible {
          outline: 2px solid #917FB3;
          outline-offset: 4px;
        }

        .project-link:focus-visible {
          outline: 2px solid var(--card-accent);
          outline-offset: 4px;
          border-radius: 4px;
        }

        /* Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          .content-container {
            transition: opacity 0.3s ease;
            transform: none;
          }

          .project-card {
            animation: none;
            opacity: 1;
            transform: none;
          }

          .gradient-orb,
          .particle {
            animation: none;
            transition: none;
          }

          .project-card:hover,
          .cta-button:hover {
            transform: none;
          }

          .link-arrow,
          .tag,
          .highlight-bar,
          .card-glow,
          .ambient-glow {
            transition: none;
          }
        }

        /* High Contrast Mode */
        // @media (prefers-contrast: high) {
        //   .project-card {
        //     border: 2px solid rgba(255, 255, 255, 0.5);
        //   }

        //   .tag {
        //     border-width: 2px;
        //   }

        //   .project-description {
        //     color: #FBEAEB;
        //   }
        // }

        /* High Contrast Mode */
@media (prefers-contrast: high) {
  .project-card {
    border: 2px solid rgba(255, 255, 255, 0.5);
  }

  .tag {
    border-width: 2px;
  }

  .project-description {
    color: #FBEAEB;
  }
}

[data-theme="light"] .project-card {
  border: 2px solid rgba(155, 110, 243, 0.3);
}

[data-theme="light"] .tag {
  border-width: 2px;
  border-color: rgba(155, 110, 243, 0.3);
}

[data-theme="light"] .project-description {
  color: #2F2C4F;
}


/* Light Mode Premium Enhancements */
[data-theme="light"] .projects-preview-section {
  background-attachment: fixed;
}

[data-theme="light"] .content-container {
  max-width: 1100px;
  margin: 0 auto;
}

[data-theme="light"] .section-header {
  margin-bottom: 6rem;
}

[data-theme="light"] .projects-grid {
  gap: 2.5rem;
}

[data-theme="light"] .card-content {
  min-height: 280px;
}

[data-theme="light"] .ambient-glow {
  opacity: var(--ambient-glow-opacity);
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
  [data-theme="light"] .projects-preview-section {
    padding: 4rem 1.5rem;
  }

  [data-theme="light"] .projects-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  [data-theme="light"] .card-content {
    min-height: 240px;
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  [data-theme="light"] .projects-preview-section {
    padding: 3rem 1rem;
  }

  [data-theme="light"] .section-title {
    font-size: 2rem;
  }

  [data-theme="light"] .project-title {
    font-size: 1.25rem;
  }
}
`}</style>
    </section>
  );
};

export default ProjectsPreview;