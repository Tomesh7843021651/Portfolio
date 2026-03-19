import React, { useEffect, useRef, useState, useCallback } from "react";
import Footer from "../components/layout/Footer";

interface Project {
  id: number;
  title: string;
  headline: string;
  impact: string;
  description: string;
  fullStory: string;
  technologies: string[];
  stats: { label: string; value: string }[];
  color: string;
  emoji: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "Nexus Commerce",
    headline: "Revolutionizing Digital Retail",
    impact: "Global Scale E-Commerce Architecture",
    description: "A quantum leap in online shopping experiences. Built for the giants, perfected for the users.",
    fullStory: "Transformed a legacy monolith into a microservices masterpiece handling 50,000+ concurrent users with 99.99% uptime. The checkout flow I architected reduced cart abandonment by 40% through predictive UX and one-click purchasing.",
    technologies: ["Next.js 14", "PostgreSQL", "Redis", "Stripe", "AWS Lambda", "GraphQL"],
    stats: [
      { label: "Revenue Impact", value: "$12M+" },
      { label: "Load Time", value: "0.8s" },
      { label: "Uptime", value: "99.99%" },
    ],
    color: "#FF6B6B",
    emoji: "🚀",
  },
  {
    id: 2,
    title: "Synapse AI",
    headline: "Intelligence That Understands You",
    impact: "Machine Learning Platform",
    description: "Where artificial intelligence meets human intuition. Processing millions of data points in real-time.",
    fullStory: "Engineered a neural network pipeline that processes 2M+ events daily, delivering predictive insights 300ms faster than industry standard. The dashboard I designed became the gold standard for ML observability.",
    technologies: ["Python", "TensorFlow", "React", "D3.js", "Kubernetes", "Apache Kafka"],
    stats: [
      { label: "Data Points", value: "2M/day" },
      { label: "Accuracy", value: "94.7%" },
      { label: "Speed Gain", value: "300ms" },
    ],
    color: "#4ECDC4",
    emoji: "🧠",
  },
  {
    id: 3,
    title: "Orbit Collaboration",
    headline: "Teams in Perfect Harmony",
    impact: "Enterprise Workspace Suite",
    description: "The operating system for modern teams. Async-first, real-time when it matters.",
    fullStory: "Reimagined remote collaboration by building intelligent task routing that reduced project overhead by 60%. The AI-powered summarization feature I implemented saves teams 15 hours weekly.",
    technologies: ["TypeScript", "Node.js", "Socket.io", "MongoDB", "Docker", "WebRTC"],
    stats: [
      { label: "Active Users", value: "50K+" },
      { label: "Time Saved", value: "15h/week" },
      { label: "Efficiency", value: "+60%" },
    ],
    color: "#45B7D1",
    emoji: "🌟",
  },
  {
    id: 4,
    title: "Aether Design System",
    headline: "Crafting Digital Aesthetics",
    impact: "Component Library Ecosystem",
    description: "The foundation of beautiful interfaces. 200+ components, infinite possibilities.",
    fullStory: "Created a design system adopted by 12 product teams, accelerating development velocity by 3x. The accessibility-first approach I championed achieved WCAG 2.1 AAA compliance across all components.",
    technologies: ["React", "Storybook", "Figma API", "CSS-in-JS", "Jest", "Cypress"],
    stats: [
      { label: "Components", value: "200+" },
      { label: "Adoption", value: "12 Teams" },
      { label: "Speed Gain", value: "3x" },
    ],
    color: "#96CEB4",
    emoji: "🎨",
  },
];

const FloatingParticle: React.FC<{ delay: number; color: string }> = ({ delay, color }) => (
  <div
    className="floating-particle"
    style={{
      animationDelay: `${delay}s`,
      background: color,
    }}
  />
);

const ConfettiBurst: React.FC<{ active: boolean }> = ({ active }) => {
  if (!active) return null;
  return (
    
    <div className="confetti-container">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 0.5}s`,
            backgroundColor: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"][i % 6],
          }}
        />
      ))}
    </div>
  );
};

const Work: React.FC = () => {
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [celebrating, setCelebrating] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setVisibleCards((prev) => new Set([...prev, index]));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -100px 0px" }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const card = cardRefs.current[index];
    if (!card) return;
    
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setMousePosition({ x, y });
    card.style.setProperty("--mouse-x", `${x}%`);
    card.style.setProperty("--mouse-y", `${y}%`);
  }, []);

  const handleCardClick = (index: number) => {
    setActiveCard(activeCard === index ? null : index);
    setCelebrating(index);
    setTimeout(() => setCelebrating(null), 1500);
  };

  const setCardRef = (index: number) => (el: HTMLDivElement | null) => {
    cardRefs.current[index] = el;
  };

  return (
    <section className="work-section" id="work" ref={sectionRef}>
      {/* Ambient Background Effects */}
      <div className="ambient-glow" />
      <div className="grid-overlay" />
      
      {/* Floating Particles */}
      <div className="particles-container">
        {[...Array(15)].map((_, i) => (
          <FloatingParticle key={i} delay={i * 0.5} color={projects[i % 4].color} />
        ))}
      </div>

      <div className="work-container">
        {/* Hero Header with Typing Effect */}
        <header className="work-header">
          <div className="badge">✨ Featured Case Studies</div>
          <h2 className="work-title">
            <span className="title-line">Architecting Digital</span>
            <span className="title-line gradient-text">Excellence</span>
          </h2>
          <p className="work-intro">
            Every project is a <span className="highlight">masterpiece in motion</span>. 
            I don't just write code—I orchestrate symphonies of pixels and logic that 
            transform businesses and delight users. Dive into my universe of 
            <span className="highlight-alt"> production-grade wizardry</span>.
          </p>
          
          {/* Interactive Dialog */}
          <div className="dialog-bubble">
            <span className="dialog-emoji">💡</span>
            <p>"Great software is like magic—when done right, users never notice the complexity beneath."</p>
            <div className="dialog-tail" />
          </div>
        </header>

        {/* Projects Grid */}
        <div className="work-grid">
          {projects.map((project, index) => (
            <div
              key={project.id}
              ref={setCardRef(index)}
              data-index={index}
              className={`project-card ${visibleCards.has(index) ? "visible" : ""} ${
                activeCard === index ? "expanded" : ""
              }`}
              style={{ 
                transitionDelay: `${index * 150}ms`,
                "--project-color": project.color,
              } as React.CSSProperties}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onClick={() => handleCardClick(index)}
            >
              <ConfettiBurst active={celebrating === index} />
              
              {/* Glow Effect */}
              <div className="card-glow" />
              
              {/* Content */}
              <div className="card-content">
                <div className="card-shine" />
                
                <div className="card-header">
                  <span className="project-emoji">{project.emoji}</span>
                  <div className="project-meta">
                    <span className="project-category">{project.impact}</span>
                    <h3 className="project-title">{project.title}</h3>
                  </div>
                </div>

                <div className="card-body">
                  <h4 className="project-headline">{project.headline}</h4>
                  <p className="project-description">{project.description}</p>
                  
                  {/* Expandable Content */}
                  <div className="expandable-content">
                    <div className="story-section">
                      <h5>The Journey 🚀</h5>
                      <p>{project.fullStory}</p>
                    </div>
                    
                    {/* Stats Grid */}
                    <div className="stats-grid">
                      {project.stats.map((stat, i) => (
                        <div key={i} className="stat-item" style={{ animationDelay: `${i * 100}ms` }}>
                          <span className="stat-value">{stat.value}</span>
                          <span className="stat-label">{stat.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="tech-cloud">
                  {project.technologies.map((tech, i) => (
                    <span 
                      key={tech} 
                      className="tech-pill"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="card-footer">
                  <button className="explore-btn">
                    <span>Explore Case Study</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Engagement Section */}
        <div className="work-engagement">
          <div className="engagement-content">
            <div className="pulse-ring" />
            <h3 className="engagement-title">Ready to Create Something Extraordinary?</h3>
            <p className="engagement-text">
              These aren't just projects—they're <span className="glow-text">proof of what's possible</span> 
              when vision meets execution. Let's craft your success story together.
            </p>
            <div className="engagement-actions">
              <a href="Contact" className="cta-primary">
                <span>Start Your Project</span>
                <div className="btn-shine" />
              </a>
              <a href="Thinking" className="cta-secondary">
                See My Process
              </a>
            </div>
          </div>
          
          {/* Floating Dialog */}
          <div className="floating-dialog">
            <span>🎯</span>
            <p>"The best time to start was yesterday. The second best time is now."</p>
          </div>
        </div>

        {/* Footer section */}
        <br></br>
        <br></br>
      </div>
        <Footer/>

      <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

  /* CSS VARIABLES - ADD THIS ENTIRE BLOCK */
  :root {
    /* Dark Mode (Default) */
    --bg-color: #0f0f1a;
    --bg-gradient-start: #0f0f1a;
    --bg-gradient-mid: #1a1a2e;
    --bg-gradient-end: #16213e;
    --card-bg: rgba(255, 255, 255, 0.03);
    --card-bg-hover: rgba(255, 255, 255, 0.06);
    --card-border: rgba(255, 255, 255, 0.1);
    --card-border-hover: rgba(255, 255, 255, 0.2);
    --text-primary: #FBEAEB;
    --text-secondary: rgba(251, 234, 235, 0.8);
    --text-muted: rgba(251, 234, 235, 0.7);
    --text-dark: rgba(251, 234, 235, 0.6);
    --accent-purple: #917FB3;
    --accent-teal: #4ECDC4;
    --accent-coral: #FF6B6B;
    --accent-gold: #FFEAA7;
    --shadow-color: rgba(0, 0, 0, 0.3);
    --grid-line: rgba(145, 127, 179, 0.03);
    --dialog-bg: rgba(145, 127, 179, 0.1);
    --dialog-border: rgba(145, 127, 179, 0.3);
    --stats-border: rgba(255, 255, 255, 0.1);
    --engagement-bg: rgba(145, 127, 179, 0.05);
    --engagement-border: rgba(145, 127, 179, 0.2);
    --btn-secondary-border: rgba(145, 127, 179, 0.3);
    --btn-secondary-hover-bg: rgba(145, 127, 179, 0.1);
    --ambient-glow-1: rgba(145, 127, 179, 0.15);
    --ambient-glow-2: rgba(78, 205, 196, 0.1);
    --ambient-glow-3: rgba(255, 107, 107, 0.08);
    --particle-color: rgba(145, 127, 179, 0.6);
    --shine-color: rgba(255, 255, 255, 0.15);
    --toggle-hover-bg: rgba(255, 255, 255, 0.1);
  }

  /* Light Mode - ADD THIS ENTIRE BLOCK */
  [data-theme="light"] {
    --bg-color: #FBF4F6;
    --bg-gradient-start: #FBF4F6;
    --bg-gradient-mid: #FFFFFF;
    --bg-gradient-end: #F5E6EB;
    --card-bg: #FFFFFF;
    --card-bg-hover: #FFFFFF;
    --card-border: rgba(155, 110, 243, 0.15);
    --card-border-hover: #9B6EF3;
    --text-primary: #2F2C4F;
    --text-secondary: #6B5E7A;
    --text-muted: #6B5E7A;
    --text-dark: #9B8AA8;
    --accent-purple: #9B6EF3;
    --accent-teal: #7C3AED;
    --accent-coral: #E85D75;
    --accent-gold: #D4A574;
    --shadow-color: rgba(47, 44, 79, 0.08);
    --grid-line: rgba(155, 110, 243, 0.06);
    --dialog-bg: #FFFFFF;
    --dialog-border: rgba(155, 110, 243, 0.2);
    --stats-border: rgba(155, 110, 243, 0.1);
    --engagement-bg: rgba(155, 110, 243, 0.05);
    --engagement-border: rgba(155, 110, 243, 0.15);
    --btn-secondary-border: rgba(155, 110, 243, 0.3);
    --btn-secondary-hover-bg: rgba(155, 110, 243, 0.08);
    --ambient-glow-1: rgba(155, 110, 243, 0.08);
    --ambient-glow-2: rgba(232, 93, 117, 0.05);
    --ambient-glow-3: rgba(212, 165, 116, 0.06);
    --particle-color: rgba(155, 110, 243, 0.4);
    --shine-color: rgba(155, 110, 243, 0.1);
    --toggle-hover-bg: rgba(155, 110, 243, 0.1);
  }

  /* Typography Enhancements - ADD THIS */
  .work-title {
    font-size: clamp(2.5rem, 8vw, 4.5rem);
    font-weight: 900;
    line-height: 1.15;
    letter-spacing: -0.02em;
    margin: 0 0 1.5rem 0;
    color: var(--text-primary);
  }

  [data-theme="light"] .work-title {
    background: linear-gradient(135deg, #2F2C4F 0%, #9B6EF3 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  [data-theme="light"] .gradient-text {
    background: linear-gradient(135deg, #9B6EF3 0%, #E85D75 50%, #D4A574 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradientShift 5s ease infinite;
    background-size: 200% 200%;
  }
  /* END ADD BLOCK */
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        // .work-section {
        //   width: 100%;
        //   min-height: 100vh;
        //   background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%);
        //   padding: 4rem 1.5rem;
        //   box-sizing: border-box;
        //   position: relative;
        //   overflow: hidden;
        // }

        .work-section {
          width: 100%;
          min-height: 100vh;
          background: linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-mid) 50%, var(--bg-gradient-end) 100%);
          padding: 4rem 1.5rem;
          box-sizing: border-box;
          position: relative;
          overflow: hidden;
          transition: background 0.5s ease;
        }

        /* Ambient Background */
        // .ambient-glow {
        //   position: absolute;
        //   top: -50%;
        //   left: -50%;
        //   width: 200%;
        //   height: 200%;
        //   background: radial-gradient(circle at 20% 80%, rgba(145, 127, 179, 0.15) 0%, transparent 50%),
        //               radial-gradient(circle at 80% 20%, rgba(78, 205, 196, 0.1) 0%, transparent 50%),
        //               radial-gradient(circle at 40% 40%, rgba(255, 107, 107, 0.08) 0%, transparent 40%);
        //   animation: ambientMove 20s ease-in-out infinite;
        //   pointer-events: none;
        // }

        .ambient-glow {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at 20% 80%, var(--ambient-glow-1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, var(--ambient-glow-2) 0%, transparent 50%),
                      radial-gradient(circle at 40% 40%, var(--ambient-glow-3) 0%, transparent 40%);
          animation: ambientMove 20s ease-in-out infinite;
          pointer-events: none;
        }
        
        [data-theme="light"] .ambient-glow {
          opacity: 0.6;
        }

        @keyframes ambientMove {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
        }

        // .grid-overlay {
        //   position: absolute;
        //   inset: 0;
        //   background-image: 
        //     linear-gradient(rgba(145, 127, 179, 0.03) 1px, transparent 1px),
        //     linear-gradient(90deg, rgba(145, 127, 179, 0.03) 1px, transparent 1px);
        //   background-size: 60px 60px;
        //   pointer-events: none;
        // }

        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(var(--grid-line) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }

        /* Floating Particles */
        .particles-container {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        // .floating-particle {
        //   position: absolute;
        //   width: 4px;
        //   height: 4px;
        //   border-radius: 50%;
        //   opacity: 0.6;
        //   animation: float 15s infinite ease-in-out;
        //   filter: blur(1px);
        // }

        .floating-particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: var(--particle-color);
          border-radius: 50%;
          opacity: 0.6;
          animation: float 15s infinite ease-in-out;
          filter: blur(1px);
        }
        
        [data-theme="light"] .floating-particle {
          opacity: 0.4;
        }

        @keyframes float {
          0%, 100% { 
            transform: translateY(100vh) translateX(0) scale(0); 
            opacity: 0;
          }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { 
            transform: translateY(-100vh) translateX(100px) scale(1.5); 
            opacity: 0;
          }
        }

        /* Container */
        .work-container {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        /* Header */
        .work-header {
          text-align: center;
          margin-bottom: 5rem;
          position: relative;
        }

        // .badge {
        //   display: inline-flex;
        //   align-items: center;
        //   gap: 0.5rem;
        //   padding: 0.5rem 1rem;
        //   background: rgba(145, 127, 179, 0.1);
        //   border: 1px solid rgba(145, 127, 179, 0.3);
        //   border-radius: 9999px;
        //   color: #917FB3;
        //   font-size: 0.875rem;
        //   font-weight: 600;
        //   margin-bottom: 1.5rem;
        //   animation: badgePulse 2s ease-in-out infinite;
        // }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: var(--dialog-bg);
          border: 1px solid var(--dialog-border);
          border-radius: 9999px;
          color: var(--accent-purple);
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          animation: badgePulse 2s ease-in-out infinite;
        }
        
        [data-theme="light"] .badge {
          background: rgba(155, 110, 243, 0.08);
          box-shadow: 0 2px 8px rgba(155, 110, 243, 0.1);
        }

        @keyframes badgePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(145, 127, 179, 0.4); }
          50% { box-shadow: 0 0 0 10px rgba(145, 127, 179, 0); }
        }

        .work-title {
          font-size: clamp(2.5rem, 8vw, 4.5rem);
          font-weight: 900;
          line-height: 1.1;
          margin: 0 0 1.5rem 0;
          color: #FBEAEB;
        }

        .title-line {
          display: block;
        }

        .gradient-text {
          background: linear-gradient(135deg, #917FB3 0%, #4ECDC4 50%, #FF6B6B 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientShift 5s ease infinite;
          background-size: 200% 200%;
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        // .work-intro {
        //   font-size: clamp(1.125rem, 2.5vw, 1.375rem);
        //   line-height: 1.8;
        //   color: rgba(251, 234, 235, 0.8);
        //   max-width: 700px;
        //   margin: 0 auto 2rem;
        // }

        .work-intro {
          font-size: clamp(1.125rem, 2.5vw, 1.375rem);
          line-height: 1.8;
          color: var(--text-secondary);
          max-width: 700px;
          margin: 0 auto 2rem;
        }

        // .highlight {
        //   color: #FFEAA7;
        //   font-weight: 600;
        //   position: relative;
        // }

        // .highlight-alt {
        //   color: #4ECDC4;
        //   font-weight: 600;
        // }

        .highlight {
          color: var(--accent-gold);
          font-weight: 600;
          position: relative;
        }
        
        [data-theme="light"] .highlight {
          color: #D4A574;
        }
        
        .highlight-alt {
          color: var(--accent-teal);
          font-weight: 600;
        }
        
        [data-theme="light"] .highlight-alt {
          color: #9B6EF3;
        }

        /* Dialog Bubble */
        // .dialog-bubble {
        //   position: relative;
        //   display: inline-flex;
        //   align-items: flex-start;
        //   gap: 1rem;
        //   background: rgba(145, 127, 179, 0.1);
        //   border: 1px solid rgba(145, 127, 179, 0.3);
        //   border-radius: 20px;
        //   padding: 1.25rem 1.5rem;
        //   max-width: 500px;
        //   margin: 2rem auto 0;
        //   backdrop-filter: blur(10px);
        //   animation: dialogFloat 6s ease-in-out infinite;
        // }

        .dialog-bubble {
          position: relative;
          display: inline-flex;
          align-items: flex-start;
          gap: 1rem;
          background: var(--dialog-bg);
          border: 1px solid var(--dialog-border);
          border-radius: 20px;
          padding: 1.25rem 1.5rem;
          max-width: 500px;
          margin: 2rem auto 0;
          backdrop-filter: blur(10px);
          animation: dialogFloat 6s ease-in-out infinite;
          box-shadow: 0 4px 20px var(--shadow-color);
          transition: all 0.3s ease;
        }
        
        [data-theme="light"] .dialog-bubble {
          box-shadow: 0 8px 30px rgba(155, 110, 243, 0.12);
        }

        @keyframes dialogFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .dialog-emoji {
          font-size: 1.5rem;
          animation: emojiBounce 2s ease infinite;
        }

        @keyframes emojiBounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        // .dialog-bubble p {
        //   margin: 0;
        //   color: rgba(251, 234, 235, 0.9);
        //   font-size: 0.9375rem;
        //   font-style: italic;
        //   text-align: left;
        //   line-height: 1.6;
        // }

        .dialog-bubble p {
          margin: 0;
          color: var(--text-primary);
          font-size: 0.9375rem;
          font-style: italic;
          text-align: left;
          line-height: 1.6;
        }

        // .dialog-tail {
        //   position: absolute;
        //   bottom: -10px;
        //   left: 30px;
        //   width: 20px;
        //   height: 20px;
        //   background: rgba(145, 127, 179, 0.1);
        //   border-bottom: 1px solid rgba(145, 127, 179, 0.3);
        //   border-right: 1px solid rgba(145, 127, 179, 0.3);
        //   transform: rotate(45deg);
        //   backdrop-filter: blur(10px);
        // }

        .dialog-tail {
          position: absolute;
          bottom: -10px;
          left: 30px;
          width: 20px;
          height: 20px;
          background: var(--dialog-bg);
          border-bottom: 1px solid var(--dialog-border);
          border-right: 1px solid var(--dialog-border);
          transform: rotate(45deg);
          backdrop-filter: blur(10px);
        }

        /* Grid Layout */
        .work-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          margin-bottom: 5rem;
        }

        /* Project Cards */
        .project-card {
          position: relative;
          opacity: 0;
          transform: translateY(50px) rotateX(10deg);
          transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: pointer;
          perspective: 1000px;
        }

        .project-card.visible {
          opacity: 1;
          transform: translateY(0) rotateX(0);
        }

        .project-card:hover {
          transform: translateY(-10px) scale(1.02);
        }

        .project-card.expanded {
          transform: scale(1.05);
          z-index: 10;
        }

        .card-glow {
          position: absolute;
          inset: -2px;
          background: linear-gradient(135deg, var(--project-color) 0%, transparent 60%);
          border-radius: 24px;
          opacity: 0;
          transition: opacity 0.3s ease;
          filter: blur(20px);
        }

        .project-card:hover .card-glow {
          opacity: 0.5;
        }

        // .card-content {
        //   position: relative;
        //   background: rgba(255, 255, 255, 0.03);
        //   border: 1px solid rgba(255, 255, 255, 0.1);
        //   border-radius: 20px;
        //   padding: 2rem;
        //   overflow: hidden;
        //   backdrop-filter: blur(20px);
        //   transition: all 0.3s ease;
        // }

        // .project-card:hover .card-content {
        //   background: rgba(255, 255, 255, 0.06);
        //   border-color: rgba(255, 255, 255, 0.2);
        // }

        .card-content {
          position: relative;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 20px;
          padding: 2rem;
          overflow: hidden;
          backdrop-filter: blur(20px);
          transition: all 0.3s ease;
        }
        
        .project-card:hover .card-content {
          background: var(--card-bg-hover);
          border-color: var(--card-border-hover);
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -15px var(--shadow-color);
        }
        
        [data-theme="light"] .card-content {
          box-shadow: 0 4px 20px var(--shadow-color);
        }
        
        [data-theme="light"] .project-card:hover .card-content {
          box-shadow: 0 25px 50px -12px rgba(155, 110, 243, 0.15);
          border-color: #9B6EF3;
        }

        // .card-shine {
        //   position: absolute;
        //   inset: 0;
        //   background: radial-gradient(
        //     circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
        //     rgba(255, 255, 255, 0.15) 0%,
        //     transparent 50%
        //   );
        //   opacity: 0;
        //   transition: opacity 0.3s ease;
        //   pointer-events: none;
        // }

        .card-shine {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
            var(--shine-color) 0%,
            transparent 50%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .project-card:hover .card-shine {
          opacity: 1;
        }

        /* Card Header */
        .card-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .project-emoji {
          font-size: 3rem;
          filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.3));
          animation: emojiFloat 3s ease-in-out infinite;
        }

        @keyframes emojiFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }

        .project-meta {
          flex: 1;
        }

        .project-category {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--project-color);
          margin-bottom: 0.25rem;
        }

        // .project-title {
        //   font-size: 1.75rem;
        //   font-weight: 800;
        //   color: #FBEAEB;
        //   margin: 0;
        //   line-height: 1.2;
        // }

        .project-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0;
          line-height: 1.2;
          letter-spacing: -0.01em;
        }
        
        [data-theme="light"] .project-title {
          background: linear-gradient(135deg, #2F2C4F 0%, #4A4466 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Card Body */
        .card-body {
          margin-bottom: 1.5rem;
        }

        // .project-headline {
        //   font-size: 1.125rem;
        //   font-weight: 700;
        //   color: rgba(251, 234, 235, 0.95);
        //   margin: 0 0 0.75rem 0;
        // }

        // .project-description {
        //   font-size: 1rem;
        //   line-height: 1.7;
        //   color: rgba(251, 234, 235, 0.7);
        //   margin: 0 0 1rem 0;
        // }

        .project-headline {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 0.75rem 0;
        }
        
        .project-description {
          font-size: 1rem;
          line-height: 1.7;
          color: var(--text-muted);
          margin: 0 0 1rem 0;
        }

        /* Expandable Content */
        .expandable-content {
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .project-card.expanded .expandable-content {
          max-height: 500px;
          opacity: 1;
          margin-top: 1.5rem;
        }

        // .story-section h5 {
        //   font-size: 0.875rem;
        //   font-weight: 700;
        //   color: var(--project-color);
        //   margin: 0 0 0.5rem 0;
        //   text-transform: uppercase;
        //   letter-spacing: 0.05em;
        // }

        // .story-section p {
        //   font-size: 0.9375rem;
        //   line-height: 1.7;
        //   color: rgba(251, 234, 235, 0.8);
        //   margin: 0;
        // }

        .story-section h5 {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--project-color);
          margin: 0 0 0.5rem 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .story-section p {
          font-size: 0.9375rem;
          line-height: 1.7;
          color: var(--text-secondary);
          margin: 0;
        }

        /* Stats Grid */
        // .stats-grid {
        //   display: grid;
        //   grid-template-columns: repeat(3, 1fr);
        //   gap: 1rem;
        //   margin-top: 1.5rem;
        //   padding-top: 1.5rem;
        //   border-top: 1px solid rgba(255, 255, 255, 0.1);
        // }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--stats-border);
        }

        .stat-item {
          text-align: center;
          opacity: 0;
          transform: translateY(20px);
          animation: statPop 0.5s ease forwards;
        }

        @keyframes statPop {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .stat-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--project-color);
          margin-bottom: 0.25rem;
        }

        // .stat-label {
        //   font-size: 0.75rem;
        //   color: rgba(251, 234, 235, 0.6);
        //   text-transform: uppercase;
        //   letter-spacing: 0.05em;
        // }

        .stat-label {
          font-size: 0.75rem;
          color: var(--text-dark);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Tech Cloud */
        .tech-cloud {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        // .tech-pill {
        //   padding: 0.375rem 0.875rem;
        //   background: rgba(145, 127, 179, 0.1);
        //   border: 1px solid rgba(145, 127, 179, 0.3);
        //   border-radius: 9999px;
        //   font-size: 0.8125rem;
        //   font-weight: 500;
        //   color: #917FB3;
        //   opacity: 0;
        //   transform: scale(0.8);
        //   animation: pillPop 0.4s ease forwards;
        // }

        .tech-pill {
          padding: 0.375rem 0.875rem;
          background: var(--dialog-bg);
          border: 1px solid var(--dialog-border);
          border-radius: 9999px;
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--accent-purple);
          opacity: 0;
          transform: scale(0.8);
          animation: pillPop 0.4s ease forwards;
        }
        
        [data-theme="light"] .tech-pill {
          background: rgba(155, 110, 243, 0.08);
          font-weight: 600;
        }

        @keyframes pillPop {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Card Footer */
        .card-footer {
          display: flex;
          justify-content: flex-end;
        }

        .explore-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          background: linear-gradient(135deg, var(--project-color) 0%, rgba(255,255,255,0.1) 100%);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 0.9375rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .explore-btn:hover {
          transform: translateX(5px);
          box-shadow: 0 10px 30px -10px var(--project-color);
        }

        .explore-btn svg {
          transition: transform 0.3s ease;
        }

        .explore-btn:hover svg {
          transform: translate(3px, -3px);
        }

        /* Confetti */
        .confetti-container {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 100;
        }

        .confetti-piece {
          position: absolute;
          width: 10px;
          height: 10px;
          top: 50%;
          left: 50%;
          animation: confettiExplode 1.5s ease-out forwards;
        }

        @keyframes confettiExplode {
          0% {
            transform: translate(-50%, -50%) rotate(0deg) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(
              calc(-50% + (var(--random-x, 0) * 200px)),
              calc(-50% + (var(--random-y, 0) * 200px))
            ) rotate(720deg) scale(0);
            opacity: 0;
          }
        }

        /* Engagement Section */
        // .work-engagement {
        //   position: relative;
        //   text-align: center;
        //   padding: 4rem 2rem;
        //   background: rgba(145, 127, 179, 0.05);
        //   border: 1px solid rgba(145, 127, 179, 0.2);
        //   border-radius: 24px;
        //   overflow: hidden;
        // }

        .work-engagement {
          position: relative;
          text-align: center;
          padding: 4rem 2rem;
          background: var(--engagement-bg);
          border: 1px solid var(--engagement-border);
          border-radius: 24px;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        [data-theme="light"] .work-engagement {
          background: linear-gradient(135deg, rgba(155, 110, 243, 0.05) 0%, rgba(232, 93, 117, 0.03) 100%);
          box-shadow: 0 8px 32px rgba(155, 110, 243, 0.08);
        }

        .engagement-content {
          position: relative;
          z-index: 1;
        }

        .pulse-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100px;
          height: 100px;
          border: 2px solid rgba(145, 127, 179, 0.3);
          border-radius: 50%;
          animation: pulseRing 3s ease-out infinite;
        }

        @keyframes pulseRing {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(4); opacity: 0; }
        }

        // .engagement-title {
        //   font-size: clamp(1.5rem, 4vw, 2.25rem);
        //   font-weight: 800;
        //   color: #FBEAEB;
        //   margin: 0 0 1rem 0;
        // }

        .engagement-title {
          font-size: clamp(1.5rem, 4vw, 2.25rem);
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 1rem 0;
          letter-spacing: -0.02em;
        }
        
        [data-theme="light"] .engagement-title {
          background: linear-gradient(135deg, #2F2C4F 0%, #9B6EF3 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        // .engagement-text {
        //   font-size: 1.125rem;
        //   color: rgba(251, 234, 235, 0.8);
        //   max-width: 600px;
        //   margin: 0 auto 2rem;
        //   line-height: 1.7;
        // }

        .engagement-text {
          font-size: 1.125rem;
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto 2rem;
          line-height: 1.7;
        }

        // .glow-text {
        //   color: #FFEAA7;
        //   text-shadow: 0 0 20px rgba(255, 234, 167, 0.3);
        // }

        .glow-text {
          color: var(--accent-gold);
          text-shadow: 0 0 20px rgba(255, 234, 167, 0.3);
        }
        
        [data-theme="light"] .glow-text {
          color: #D4A574;
          text-shadow: none;
          font-weight: 700;
        }

        .engagement-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
        }

        .cta-primary {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 1.125rem 2.5rem;
          background: linear-gradient(135deg, #917FB3 0%, #4ECDC4 100%);
          border-radius: 16px;
          color: white;
          font-size: 1.125rem;
          font-weight: 700;
          text-decoration: none;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 10px 40px -10px rgba(145, 127, 179, 0.5);
        }

        .cta-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 60px -10px rgba(145, 127, 179, 0.6);
        }

        .btn-shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          transition: left 0.5s ease;
        }

        .cta-primary:hover .btn-shine {
          left: 100%;
        }

        // .cta-secondary {
        //   padding: 1rem 2rem;
        //   color: rgba(251, 234, 235, 0.8);
        //   font-size: 1rem;
        //   font-weight: 600;
        //   text-decoration: none;
        //   border: 2px solid rgba(145, 127, 179, 0.3);
        //   border-radius: 12px;
        //   transition: all 0.3s ease;
        // }

        // .cta-secondary:hover {
        //   border-color: #917FB3;
        //   color: #917FB3;
        //   background: rgba(145, 127, 179, 0.1);
        // }

        .cta-secondary {
          padding: 1rem 2rem;
          color: var(--text-secondary);
          font-size: 1rem;
          font-weight: 600;
          text-decoration: none;
          border: 2px solid var(--btn-secondary-border);
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        
        .cta-secondary:hover {
          border-color: var(--accent-purple);
          color: var(--accent-purple);
          background: var(--btn-secondary-hover-bg);
        }

        /* Floating Dialog */
        // .floating-dialog {
        //   position: absolute;
        //   bottom: 20px;
        //   right: 20px;
        //   display: flex;
        //   align-items: center;
        //   gap: 0.75rem;
        //   padding: 1rem 1.25rem;
        //   background: rgba(255, 255, 255, 0.05);
        //   border: 1px solid rgba(255, 255, 255, 0.1);
        //   border-radius: 16px;
        //   backdrop-filter: blur(10px);
        //   animation: dialogSlide 1s ease-out;
        //   max-width: 250px;
        // }

        .floating-dialog {
          position: absolute;
          bottom: 20px;
          right: 20px;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 16px;
          backdrop-filter: blur(10px);
          animation: dialogSlide 1s ease-out;
          max-width: 250px;
          box-shadow: 0 4px 20px var(--shadow-color);
        }

        @keyframes dialogSlide {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .floating-dialog span {
          font-size: 1.5rem;
        }

        // .floating-dialog p {
        //   margin: 0;
        //   font-size: 0.8125rem;
        //   color: rgba(251, 234, 235, 0.8);
        //   font-style: italic;
        //   text-align: left;
        //   line-height: 1.5;
        // }

        .floating-dialog p {
          margin: 0;
          font-size: 0.8125rem;
          color: var(--text-secondary);
          font-style: italic;
          text-align: left;
          line-height: 1.5;
        }

        /* Responsive */
        @media (min-width: 768px) {
          .work-section {
            padding: 6rem 3rem;
          }

          .work-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 2.5rem;
          }

          .engagement-actions {
            flex-direction: row;
            justify-content: center;
          }

          .floating-dialog {
            max-width: 300px;
          }
        }

        @media (min-width: 1024px) {
          .work-grid {
            gap: 3rem;
          }

          .card-content {
            padding: 2.5rem;
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }

          .stat-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            text-align: left;
          }

          .floating-dialog {
            position: relative;
            bottom: auto;
            right: auto;
            margin-top: 2rem;
            max-width: 100%;
          }
        }

        /* Light Mode Premium Enhancements */
        [data-theme="light"] .work-section {
          background-attachment: fixed;
        }
      
        [data-theme="light"] .project-emoji {
          filter: drop-shadow(0 0 20px rgba(155, 110, 243, 0.2));
        }
      
        [data-theme="light"] .pulse-ring {
          border-color: rgba(155, 110, 243, 0.2);
        }
      
        [data-theme="light"] .stat-value {
          color: #2F2C4F;
        }
      
        [data-theme="light"] .cta-primary {
          background: linear-gradient(135deg, #9B6EF3 0%, #E85D75 100%);
          box-shadow: 0 10px 40px -10px rgba(155, 110, 243, 0.4);
        }
      
        [data-theme="light"] .cta-primary:hover {
          box-shadow: 0 20px 60px -10px rgba(155, 110, 243, 0.5);
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
      
        /* Enhanced container for light mode */
        [data-theme="light"] .work-container {
          max-width: 1100px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
      
        [data-theme="light"] .work-header {
          margin-bottom: 6rem;
        }
      `}</style>
      
    </section>
  );
};

export default Work;