import React, { useEffect, useRef, useState, useCallback } from "react";
import Footer from "../components/layout/Footer";

interface Milestone {
  id: number;
  year: string;
  phase: string;
  title: string;
  story: string;
  lessons: string[];
  metrics: { label: string; value: string }[];
  color: string;
  icon: string;
  quote: string;
}

const milestones: Milestone[] = [
  {
    id: 1,
    year: "2020",
    phase: "The Spark",
    title: "First Lines of Code",
    story: "Started in a small room with a laptop, tutorials, and infinite curiosity. Those first console.log moments felt like magic—like speaking a secret language that computers understood.",
    lessons: ["Every expert was once a beginner", "Consistency beats intensity", "Curiosity is the best debugger"],
    metrics: [
      { label: "Hours Coded", value: "500+" },
      { label: "Projects", value: "12" },
      { label: "Coffee Cups", value: "∞" },
    ],
    color: "#FF6B6B",
    icon: "🔥",
    quote: "The journey of a thousand miles begins with a single commit.",
  },
  {
    id: 2,
    year: "2021",
    phase: "The Grind",
    title: "Drowning & Learning to Swim",
    story: "Hit the wall hard. Imposter syndrome was real. But every bug fixed, every failed deployment, every 3 AM Stack Overflow rabbit hole built resilience. Started understanding that struggle is the tuition for mastery.",
    lessons: ["Failure is data, not destiny", "Community > Competition", "Rest is part of the work"],
    metrics: [
      { label: "Bugs Crushed", value: "1000+" },
      { label: "Mentors Found", value: "3" },
      { label: "Breakthroughs", value: "Countless" },
    ],
    color: "#F8B500",
    icon: "⚡",
    quote: "It's not that I'm so smart, it's just that I stay with problems longer.",
  },
  {
    id: 3,
    year: "2022",
    phase: "The Rise",
    title: "Building in Public",
    story: "Started shipping. Real projects, real users, real impact. The transition from 'learning to code' to 'engineering solutions' was profound. Discovered that code is meaningless without empathy for the humans using it.",
    lessons: ["Ship before you're ready", "User feedback is oxygen", "Done is better than perfect"],
    metrics: [
      { label: "Users Reached", value: "10K+" },
      { label: "Revenue Generated", value: "$50K" },
      { label: "Team Collaborations", value: "8" },
    ],
    color: "#4ECDC4",
    icon: "🚀",
    quote: "The best way to predict the future is to build it, one feature at a time.",
  },
  {
    id: 4,
    year: "2023",
    phase: "The Evolution",
    title: "Systems & Scale",
    story: "Stepped back to see the bigger picture. Architecture, team dynamics, product strategy. Realized that seniority isn't about knowing more syntax—it's about making better decisions with incomplete information.",
    lessons: ["Complexity is the enemy", "Mentorship multiplies impact", "Legacy is built in pull requests"],
    metrics: [
      { label: "Code Reviews", value: "500+" },
      { label: "Junior Developers Mentored", value: "5" },
      { label: "System Uptime", value: "99.9%" },
    ],
    color: "#917FB3",
    icon: "🧬",
    quote: "First you learn the rules. Then you learn when to break them. Then you write new ones.",
  },
  {
    id: 5,
    year: "2024",
    phase: "The Horizon",
    title: "Infinite Learner",
    story: "Today, I'm more aware than ever of how much I don't know. AI is reshaping our field, users expect more, and the bar keeps rising. But I've learned to love the climb itself. The growth never stops—it just gets more interesting.",
    lessons: ["Adaptability is the only constant", "Teaching cements learning", "The best code is no code"],
    metrics: [
      { label: "Technologies Mastered", value: "15+" },
      { label: "Talks Given", value: "6" },
      { label: "Future Possibilities", value: "∞" },
    ],
    color: "#FF6B9D",
    icon: "🌟",
    quote: "Stay hungry, stay foolish, but most importantly—stay growing.",
  },
];

const ParticleField: React.FC = () => {
  return (
    <div className="particle-field">
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="growth-particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${10 + Math.random() * 10}s`,
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
          }}
        />
      ))}
    </div>
  );
};

const ProgressRings: React.FC<{ progress: number; color: string }> = ({ progress, color }) => (
  <svg className="progress-ring" viewBox="0 0 100 100">
    <circle
      className="progress-ring-bg"
      cx="50"
      cy="50"
      r="45"
      fill="none"
      stroke="rgba(255,255,255,0.1)"
      strokeWidth="4"
    />
    <circle
      className="progress-ring-fill"
      cx="50"
      cy="50"
      r="45"
      fill="none"
      stroke={color}
      strokeWidth="4"
      strokeLinecap="round"
      strokeDasharray={`${progress * 2.83} 283`}
      transform="rotate(-90 50 50)"
      style={{ filter: `drop-shadow(0 0 10px ${color})` }}
    />
  </svg>
);

const Growth: React.FC = () => {
  const [visibleMilestones, setVisibleMilestones] = useState<Set<number>>(new Set());
  const [activeMilestone, setActiveMilestone] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [celebrating, setCelebrating] = useState<number | null>(null);
  const milestoneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = rect.height - window.innerHeight;
      const scrolled = Math.max(0, Math.min(1, -rect.top / sectionHeight));
      setScrollProgress(scrolled);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setVisibleMilestones((prev) => new Set([...prev, index]));
            setCelebrating(index);
            setTimeout(() => setCelebrating(null), 2000);
          }
        });
      },
      { threshold: 0.3, rootMargin: "0px 0px -100px 0px" }
    );

    milestoneRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const setMilestoneRef = (index: number) => (el: HTMLDivElement | null) => {
    milestoneRefs.current[index] = el;
  };

  const getPathD = () => {
    const points = milestones.map((_, i) => ({
      x: 50,
      y: 10 + i * 20,
    }));
    return `M ${points[0].x} ${points[0].y} ` + 
           points.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ");
  };

  return (
    <section className="growth-section" id="growth" ref={sectionRef}>
      {/* Background Effects */}
      <div className="growth-bg">
        <div className="gradient-orb orb-1" />
        <div className="gradient-orb orb-2" />
        <div className="gradient-orb orb-3" />
      </div>
      <ParticleField />
      
      {/* Grid Pattern */}
      <div className="growth-grid" />

      <div className="growth-container">
        {/* Header */}
        <header className="growth-header">
          <div className="growth-badge">
            <span className="badge-pulse" />
            <span>Continuous Evolution</span>
          </div>
          
          <h1 className="growth-title">
            <span className="title-word">The</span>
            <span className="title-word highlight">Journey</span>
            <span className="title-word">of</span>
            <span className="title-word highlight-alt">Becoming</span>
          </h1>
          
          <p className="growth-subtitle">
            Every expert was once a beginner. Here's my unfiltered path from 
            <span className="text-gradient"> "Hello World" </span> 
            to building worlds.
          </p>

          {/* Wisdom Dialog */}
          <div className="growth-dialog">
            <div className="dialog-icon">🌱</div>
            <div className="dialog-content">
              <p>"Growth isn't linear—and that's the point. The detours taught me more than the destination ever could."</p>
              <div className="dialog-sparkles">
                <span>✨</span><span>✨</span><span>✨</span>
              </div>
            </div>
          </div>
        </header>

        {/* Timeline */}
        <div className="timeline-container">
          {/* SVG Path */}
          <svg className="timeline-path" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              ref={pathRef}
              className="path-bg"
              d={getPathD()}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="0.5"
            />
            <path
              className="path-fill"
              d={getPathD()}
              fill="none"
              stroke="url(#pathGradient)"
              strokeWidth="0.8"
              strokeLinecap="round"
              strokeDasharray="100"
              strokeDashoffset={100 - scrollProgress * 100}
            />
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FF6B6B" />
                <stop offset="25%" stopColor="#F8B500" />
                <stop offset="50%" stopColor="#4ECDC4" />
                <stop offset="75%" stopColor="#917FB3" />
                <stop offset="100%" stopColor="#FF6B9D" />
              </linearGradient>
            </defs>
          </svg>

          {/* Milestones */}
          <div className="milestones-wrapper">
            {milestones.map((milestone, index) => (
              <div
                key={milestone.id}
                ref={setMilestoneRef(index)}
                data-index={index}
                className={`milestone-card ${visibleMilestones.has(index) ? "visible" : ""} ${
                  activeMilestone === index ? "active" : ""
                }`}
                style={{
                  "--milestone-color": milestone.color,
                  transitionDelay: `${index * 150}ms`,
                } as React.CSSProperties}
                onClick={() => setActiveMilestone(activeMilestone === index ? null : index)}
              >
                {/* Celebration Effect */}
                {celebrating === index && (
                  <div className="celebration-burst">
                    {[...Array(12)].map((_, i) => (
                      <span
                        key={i}
                        className="burst-particle"
                        style={{
                          transform: `rotate(${i * 30}deg)`,
                          background: milestone.color,
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Progress Ring */}
                <div className="milestone-ring">
                  <ProgressRings 
                    progress={visibleMilestones.has(index) ? 100 : 0} 
                    color={milestone.color} 
                  />
                  <span className="ring-icon">{milestone.icon}</span>
                </div>

                {/* Content */}
                <div className="milestone-content">
                  <div className="milestone-header">
                    <span className="milestone-year">{milestone.year}</span>
                    <span className="milestone-phase" style={{ color: milestone.color }}>
                      {milestone.phase}
                    </span>
                  </div>
                  
                  <h3 className="milestone-title">{milestone.title}</h3>
                  
                  <p className="milestone-story">{milestone.story}</p>

                  {/* Expandable Details */}
                  <div className={`milestone-details ${activeMilestone === index ? "expanded" : ""}`}>
                    {/* Lessons */}
                    <div className="lessons-section">
                      <h4>Key Lessons 💡</h4>
                      <ul className="lessons-list">
                        {milestone.lessons.map((lesson, i) => (
                          <li key={i} style={{ animationDelay: `${i * 100}ms` }}>
                            <span className="lesson-bullet" style={{ background: milestone.color }} />
                            {lesson}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Metrics */}
                    <div className="metrics-grid">
                      {milestone.metrics.map((metric, i) => (
                        <div key={i} className="metric-card" style={{ animationDelay: `${i * 150}ms` }}>
                          <span className="metric-value" style={{ color: milestone.color }}>
                            {metric.value}
                          </span>
                          <span className="metric-label">{metric.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="milestone-quote">
                      <span className="quote-icon">"</span>
                      {milestone.quote}
                      <span className="quote-icon">"</span>
                    </blockquote>
                  </div>

                  {/* Toggle */}
                  <button className="milestone-toggle">
                    <span>{activeMilestone === index ? "Collapse" : "Explore This Chapter"}</span>
                    <svg className={activeMilestone === index ? "rotated" : ""} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                </div>

                {/* Connector Line */}
                <div className="milestone-connector" style={{ background: milestone.color }} />
              </div>
            ))}
          </div>
        </div>

        {/* Future CTA */}
        <div className="growth-future">
          <div className="future-content">
            <div className="future-icon">🔮</div>
            <h3 className="future-title">The Next Chapter is Unwritten</h3>
            <p className="future-text">
              Every day is Day One. I'm currently exploring 
              <span className="highlight-text"> AI-augmented development</span>, 
              <span className="highlight-text"> systems design at scale</span>, and 
              <span className="highlight-text"> technical leadership</span>. 
              The best way to predict my growth? 
              <span className="glow-text"> Let's build something together.</span>
            </p>
            <div className="future-actions">
              <a href="Contact" className="future-btn primary">
                <span>Join the Journey</span>
                <div className="btn-shimmer" />
              </a>
              <a href="Work" className="future-btn secondary">
                See Where I've Been
              </a>
            </div>
          </div>

          {/* Floating Wisdom */}
          <div className="wisdom-float">
            <span className="wisdom-icon">🎯</span>
            <p>"The only way to do great work is to love what you do—and never stop learning how to do it better."</p>
          </div>
        </div>

        {/* Footer section */}
        <br />
        <br />
      </div>
        <Footer/>

      <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;600;700&display=swap');

  /* CSS VARIABLES - ADD THIS ENTIRE BLOCK */
  :root {
    /* Dark Mode (Default) */
    --bg-color: #0d1b2a;
    --bg-gradient-start: #0d1b2a;
    --bg-gradient-mid: #1b263b;
    --bg-gradient-end: #0d1b2a;
    --card-bg: rgba(255, 255, 255, 0.03);
    --card-bg-hover: rgba(255, 255, 255, 0.06);
    --card-border: rgba(255, 255, 255, 0.08);
    --card-border-hover: rgba(255, 255, 255, 0.15);
    --text-primary: #FBEAEB;
    --text-secondary: rgba(251, 234, 235, 0.7);
    --text-muted: rgba(251, 234, 235, 0.75);
    --text-dark: rgba(251, 234, 235, 0.5);
    --accent-coral: #FF6B6B;
    --accent-teal: #4ECDC4;
    --accent-purple: #917FB3;
    --accent-gold: #F8B500;
    --accent-cream: #FFEAA7;
    --shadow-color: rgba(0, 0, 0, 0.3);
    --grid-line: rgba(255, 255, 255, 0.03);
    --orb-1: #FF6B6B;
    --orb-2: #4ECDC4;
    --orb-3: #917FB3;
    --dialog-bg: rgba(255, 255, 255, 0.05);
    --dialog-border: rgba(255, 255, 255, 0.1);
    --metrics-bg: rgba(0, 0, 0, 0.2);
    --future-bg: linear-gradient(135deg, rgba(145, 127, 179, 0.1) 0%, rgba(78, 205, 196, 0.1) 100%);
    --future-border: rgba(255, 255, 255, 0.1);
    --btn-secondary-border: rgba(255, 255, 255, 0.2);
    --btn-secondary-hover-bg: rgba(145, 127, 179, 0.1);
    --quote-bg: rgba(var(--milestone-color-rgb), 0.05);
    --particle-color: rgba(255, 255, 255, 0.5);
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
    --accent-coral: #E85D75;
    --accent-teal: #7C3AED;
    --accent-purple: #9B6EF3;
    --accent-gold: #D4A574;
    --accent-cream: #F4E7C5;
    --shadow-color: rgba(47, 44, 79, 0.08);
    --grid-line: rgba(155, 110, 243, 0.06);
    --orb-1: #E85D75;
    --orb-2: #9B6EF3;
    --orb-3: #D4A574;
    --dialog-bg: #FFFFFF;
    --dialog-border: rgba(155, 110, 243, 0.2);
    --metrics-bg: rgba(155, 110, 243, 0.05);
    --future-bg: linear-gradient(135deg, rgba(155, 110, 243, 0.08) 0%, rgba(232, 93, 117, 0.05) 100%);
    --future-border: rgba(155, 110, 243, 0.2);
    --btn-secondary-border: rgba(155, 110, 243, 0.3);
    --btn-secondary-hover-bg: rgba(155, 110, 243, 0.08);
    --quote-bg: rgba(155, 110, 243, 0.05);
    --particle-color: rgba(155, 110, 243, 0.3);
    --toggle-hover-bg: rgba(155, 110, 243, 0.1);
  }

  /* Typography Enhancements - ADD THIS */
  .growth-title {
    font-size: clamp(2.5rem, 6vw, 4rem);
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.02em;
    margin: 0 0 1.5rem 0;
    color: var(--text-primary);
    font-family: 'Space Grotesk', sans-serif;
  }

  [data-theme="light"] .growth-title {
    background: linear-gradient(135deg, #9B6EF3 0%, #E85D75 100%);
    -webkit-background-clip: text;
    // -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  [data-theme="light"] .highlight {
    background: linear-gradient(135deg, #9B6EF3 0%, #E85D75 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  [data-theme="light"] .highlight-alt {
    background: linear-gradient(135deg, #7C3AED 0%, #D4A574 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  /* END ADD BLOCK */

        // .growth-section {
        //   width: 100%;
        //   min-height: 100vh;
        //   background: linear-gradient(180deg, #0d1b2a 0%, #1b263b 50%, #0d1b2a 100%);
        //   padding: 5rem 1.5rem;
        //   position: relative;
        //   overflow: hidden;
        //   box-sizing: border-box;
        // }

        .growth-section {
          width: 100%;
          min-height: 100vh;
          background: linear-gradient(180deg, var(--bg-gradient-start) 0%, var(--bg-gradient-mid) 50%, var(--bg-gradient-end) 100%);
          padding: 5rem 1.5rem;
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
          transition: background 0.5s ease;
        }

        /* Background Effects */
        .growth-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.4;
          animation: orbFloat 20s ease-in-out infinite;
        }

        // .orb-1 {
        //   width: 500px;
        //   height: 500px;
        //   background: radial-gradient(circle, #FF6B6B 0%, transparent 70%);
        //   top: -10%;
        //   left: -10%;
        //   animation-delay: 0s;
        // }

        // .orb-2 {
        //   width: 400px;
        //   height: 400px;
        //   background: radial-gradient(circle, #4ECDC4 0%, transparent 70%);
        //   top: 40%;
        //   right: -10%;
        //   animation-delay: -5s;
        // }

        // .orb-3 {
        //   width: 350px;
        //   height: 350px;
        //   background: radial-gradient(circle, #917FB3 0%, transparent 70%);
        //   bottom: -10%;
        //   left: 30%;
        //   animation-delay: -10s;
        // }

        .orb-1 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, var(--orb-1) 0%, transparent 70%);
          top: -10%;
          left: -10%;
          animation-delay: 0s;
          opacity: 0.4;
        }
        
        .orb-2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, var(--orb-2) 0%, transparent 70%);
          top: 40%;
          right: -10%;
          animation-delay: -5s;
          opacity: 0.4;
        }
        
        .orb-3 {
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, var(--orb-3) 0%, transparent 70%);
          bottom: -10%;
          left: 30%;
          animation-delay: -10s;
          opacity: 0.4;
        }
        
        [data-theme="light"] .orb-1,
        [data-theme="light"] .orb-2,
        [data-theme="light"] .orb-3 {
          opacity: 0.25;
          filter: blur(100px);
        }

        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        /* Particle Field */
        .particle-field {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

       

        // .growth-particle {
        //   position: absolute;
        //   background: rgba(255, 255, 255, 0.5);
        //   border-radius: 50%;
        //   animation: particleRise linear infinite;
        //   bottom: -10px;
        // }

        .growth-particle {
          position: absolute;
          background: var(--particle-color);
          border-radius: 50%;
          animation: particleRise linear infinite;
          bottom: -10px;
        }

        @keyframes particleRise {
          0% {
            transform: translateY(0) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) scale(1.5);
            opacity: 0;
          }
        }

        /* Grid Pattern */
        // .growth-grid {
        //   position: absolute;
        //   inset: 0;
        //   background-image: 
        //     linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        //     linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
        //   background-size: 50px 50px;
        //   pointer-events: none;
        // }

        .growth-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(var(--grid-line) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
          background-size: 50px 50px;
          pointer-events: none;
        }

        /* Container */
        .growth-container {
          max-width: 900px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        /* Header */
        .growth-header {
          text-align: center;
          margin-bottom: 5rem;
        }

        .growth-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.625rem 1.25rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 9999px;
          margin-bottom: 2rem;
          position: relative;
        }

        .badge-pulse {
          width: 8px;
          height: 8px;
          background: #4ECDC4;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
          box-shadow: 0 0 10px #4ECDC4;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
        }

        // .growth-badge span:last-child {
        //   color: rgba(251, 234, 235, 0.9);
        //   font-size: 0.875rem;
        //   font-weight: 600;
        // }

        .growth-badge span:last-child {
          color: var(--text-primary);
          font-size: 0.875rem;
          font-weight: 600;
        }

        .growth-title {
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 800;
          line-height: 1.1;
          margin: 0 0 1.5rem 0;
          color: #FBEAEB;
          font-family: 'Space Grotesk', sans-serif;
        }

        .title-word {
          display: inline-block;
          margin: 0 0.25rem;
          opacity: 0;
          transform: translateY(30px);
          animation: wordReveal 0.6s ease forwards;
        }

        [data-theme="light"] .title-word {
          color : #000000
        }

        .title-word:nth-child(1) { animation-delay: 0.1s; }
        .title-word:nth-child(2) { animation-delay: 0.2s; }
        .title-word:nth-child(3) { animation-delay: 0.3s; }
        .title-word:nth-child(4) { animation-delay: 0.4s; }

        @keyframes wordReveal {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .highlight {
          background: linear-gradient(135deg, #FF6B6B 0%, #F8B500 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .highlight-alt {
          background: linear-gradient(135deg, #4ECDC4 0%, #917FB3 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        // .growth-subtitle {
        //   font-size: clamp(1.125rem, 2.5vw, 1.375rem);
        //   color: rgba(251, 234, 235, 0.7);
        //   max-width: 600px;
        //   margin: 0 auto 2.5rem;
        //   line-height: 1.7;
        // }

        .growth-subtitle {
          font-size: clamp(1.125rem, 2.5vw, 1.375rem);
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto 2.5rem;
          line-height: 1.7;
        }

        // .text-gradient {
        //   background: linear-gradient(90deg, #4ECDC4, #917FB3);
        //   -webkit-background-clip: text;
        //   -webkit-text-fill-color: transparent;
        //   background-clip: text;
        //   font-weight: 600;
        // }

        .text-gradient {
          background: linear-gradient(90deg, var(--accent-teal), var(--accent-purple));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 600;
        }
        
        [data-theme="light"] .text-gradient {
          background: linear-gradient(90deg, #9B6EF3, #E85D75);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Dialog */
        // .growth-dialog {
        //   display: inline-flex;
        //   align-items: center;
        //   gap: 1rem;
        //   background: rgba(255, 255, 255, 0.05);
        //   border: 1px solid rgba(255, 255, 255, 0.1);
        //   border-radius: 20px;
        //   padding: 1.25rem 1.5rem;
        //   backdrop-filter: blur(10px);
        //   max-width: 600px;
        //   animation: dialogFloat 4s ease-in-out infinite;
        // }

        .growth-dialog {
          display: inline-flex;
          align-items: center;
          gap: 1rem;
          background: var(--dialog-bg);
          border: 1px solid var(--dialog-border);
          border-radius: 20px;
          padding: 1.25rem 1.5rem;
          backdrop-filter: blur(10px);
          max-width: 600px;
          animation: dialogFloat 4s ease-in-out infinite;
          box-shadow: 0 4px 20px var(--shadow-color);
          transition: all 0.3s ease;
        }

        @keyframes dialogFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .dialog-icon {
          font-size: 2rem;
          animation: iconWiggle 3s ease-in-out infinite;
        }

        @keyframes iconWiggle {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }

        .dialog-content {
          text-align: left;
        }

        // .dialog-content p {
        //   margin: 0 0 0.5rem 0;
        //   color: rgba(251, 234, 235, 0.9);
        //   font-size: 1rem;
        //   line-height: 1.6;
        //   font-style: italic;
        // }

        .dialog-content p {
          margin: 0 0 0.5rem 0;
          color: var(--text-primary);
          font-size: 1rem;
          line-height: 1.6;
          font-style: italic;
        }

        .dialog-sparkles {
          display: flex;
          gap: 0.25rem;
        }

        .dialog-sparkles span {
          font-size: 0.875rem;
          animation: sparkle 1.5s ease-in-out infinite;
        }

        .dialog-sparkles span:nth-child(2) { animation-delay: 0.2s; }
        .dialog-sparkles span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes sparkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        /* Timeline */
        .timeline-container {
          position: relative;
          margin-bottom: 5rem;
        }

        .timeline-path {
          position: absolute;
          left: 40px;
          top: 0;
          bottom: 0;
          width: 4px;
          height: 100%;
          overflow: visible;
        }

        .path-bg {
          stroke-dasharray: 5, 5;
        }

        .path-fill {
          transition: stroke-dashoffset 0.1s ease;
          filter: drop-shadow(0 0 10px rgba(78, 205, 196, 0.5));
        }

        .milestones-wrapper {
          display: flex;
          flex-direction: column;
          gap: 3rem;
          position: relative;
        }

        /* Milestone Cards */
        .milestone-card {
          position: relative;
          display: flex;
          gap: 2rem;
          opacity: 0;
          transform: translateX(-50px);
          transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: pointer;
        }

        .milestone-card.visible {
          opacity: 1;
          transform: translateX(0);
        }

        .milestone-card:hover {
          transform: translateX(10px);
        }

        /* Celebration Burst */
        .celebration-burst {
          position: absolute;
          top: 40px;
          left: 40px;
          width: 0;
          height: 0;
          z-index: 10;
          pointer-events: none;
        }

        .burst-particle {
          position: absolute;
          width: 4px;
          height: 30px;
          border-radius: 2px;
          top: 50%;
          left: 50%;
          margin-left: -2px;
          margin-top: -15px;
          animation: burst 1s ease-out forwards;
          transform-origin: center;
        }

        @keyframes burst {
          0% {
            transform: rotate(var(--rotation, 0deg)) translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: rotate(var(--rotation, 0deg)) translateY(100px) scale(0);
            opacity: 0;
          }
        }

        /* Progress Ring */
        .milestone-ring {
          position: relative;
          width: 80px;
          height: 80px;
          flex-shrink: 0;
        }

        .progress-ring {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }

        .progress-ring-fill {
          transition: stroke-dasharray 1s ease;
        }

        .ring-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 1.75rem;
          animation: iconPulse 2s ease-in-out infinite;
        }

        @keyframes iconPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.2); }
        }

        /* Content */
        // .milestone-content {
        //   flex: 1;
        //   background: rgba(255, 255, 255, 0.03);
        //   border: 1px solid rgba(255, 255, 255, 0.08);
        //   border-radius: 20px;
        //   padding: 1.75rem;
        //   backdrop-filter: blur(10px);
        //   transition: all 0.3s ease;
        // }

        // .milestone-card:hover .milestone-content {
        //   background: rgba(255, 255, 255, 0.06);
        //   border-color: rgba(255, 255, 255, 0.15);
        //   box-shadow: 0 20px 40px -20px rgba(0, 0, 0, 0.3);
        // }

        .milestone-content {
          flex: 1;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 20px;
          padding: 1.75rem;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        
        .milestone-card:hover .milestone-content {
          background: var(--card-bg-hover);
          border-color: var(--card-border-hover);
          box-shadow: 0 20px 40px -20px var(--shadow-color);
          transform: translateY(-4px);
        }
        
        [data-theme="light"] .milestone-content {
          box-shadow: 0 4px 20px var(--shadow-color);
        }
        
        [data-theme="light"] .milestone-card:hover .milestone-content {
          box-shadow: 0 20px 40px -10px rgba(155, 110, 243, 0.15);
          border-color: #9B6EF3;
        }

        .milestone-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.75rem;
        }

        // .milestone-year {
        //   font-family: 'Space Grotesk', sans-serif;
        //   font-size: 0.875rem;
        //   font-weight: 700;
        //   color: rgba(251, 234, 235, 0.5);
        //   padding: 0.25rem 0.75rem;
        //   background: rgba(255, 255, 255, 0.05);
        //   border-radius: 8px;
        // }

        .milestone-year {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--text-dark);
          padding: 0.25rem 0.75rem;
          background: var(--dialog-bg);
          border: 1px solid var(--dialog-border);
          border-radius: 8px;
        }

        .milestone-phase {
          font-size: 0.8125rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        // .milestone-title {
        //   font-size: 1.375rem;
        //   font-weight: 700;
        //   color: #FBEAEB;
        //   margin: 0 0 0.75rem 0;
        //   transition: color 0.3s ease;
        // }

        .milestone-title {
          font-size: 1.375rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 0.75rem 0;
          transition: color 0.3s ease;
          letter-spacing: -0.01em;
        }

        .milestone-card:hover .milestone-title {
          color: var(--milestone-color);
        }

        // .milestone-story {
        //   font-size: 1rem;
        //   line-height: 1.7;
        //   color: rgba(251, 234, 235, 0.75);
        //   margin: 0;
        // }

        .milestone-story {
          font-size: 1rem;
          line-height: 1.7;
          color: var(--text-muted);
          margin: 0;
        }

        /* Expandable Details */
        .milestone-details {
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .milestone-details.expanded {
          max-height: 800px;
          opacity: 1;
          margin-top: 1.5rem;
        }

        /* Lessons */
        .lessons-section {
          margin-bottom: 1.5rem;
        }

        .lessons-section h4 {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--milestone-color);
          margin: 0 0 0.75rem 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .lessons-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        // .lessons-list li {
        //   display: flex;
        //   align-items: center;
        //   gap: 0.75rem;
        //   font-size: 0.9375rem;
        //   color: rgba(251, 234, 235, 0.8);
        //   opacity: 0;
        //   transform: translateX(-10px);
        //   animation: lessonSlide 0.4s ease forwards;
        // }

        .lessons-list li {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.9375rem;
          color: var(--text-secondary);
          opacity: 0;
          transform: translateX(-10px);
          animation: lessonSlide 0.4s ease forwards;
        }

        @keyframes lessonSlide {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .lesson-bullet {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        /* Metrics */
        // .metrics-grid {
        //   display: grid;
        //   grid-template-columns: repeat(3, 1fr);
        //   gap: 1rem;
        //   margin-bottom: 1.5rem;
        //   padding: 1.25rem;
        //   background: rgba(0, 0, 0, 0.2);
        //   border-radius: 12px;
        // }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
          padding: 1.25rem;
          background: var(--metrics-bg);
          border-radius: 12px;
          border: 1px solid var(--card-border);
        }

        .metric-card {
          text-align: center;
          opacity: 0;
          transform: scale(0.8);
          animation: metricPop 0.5s ease forwards;
        }

        @keyframes metricPop {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .metric-value {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        // .metric-label {
        //   font-size: 0.6875rem;
        //   color: rgba(251, 234, 235, 0.6);
        //   text-transform: uppercase;
        //   letter-spacing: 0.05em;
        // }

        .metric-label {
          font-size: 0.6875rem;
          color: var(--text-dark);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Quote */
        // .milestone-quote {
        //   margin: 0;
        //   padding: 1.25rem;
        //   background: rgba(var(--milestone-color), 0.05);
        //   border-left: 3px solid var(--milestone-color);
        //   border-radius: 0 12px 12px 0;
        //   font-style: italic;
        //   color: rgba(251, 234, 235, 0.9);
        //   font-size: 0.9375rem;
        //   line-height: 1.6;
        // }

        .milestone-quote {
          margin: 0;
          padding: 1.25rem;
          background: var(--quote-bg);
          border-left: 3px solid var(--milestone-color);
          border-radius: 0 12px 12px 0;
          font-style: italic;
          color: var(--text-primary);
          font-size: 0.9375rem;
          line-height: 1.6;
        }
        
        [data-theme="light"] .milestone-quote {
          background: rgba(155, 110, 243, 0.05);
          border-left-color: #9B6EF3;
        }

        .quote-icon {
          color: var(--milestone-color);
          font-size: 1.25rem;
          line-height: 0;
          vertical-align: middle;
        }

        /* Toggle */
        // .milestone-toggle {
        //   display: inline-flex;
        //   align-items: center;
        //   gap: 0.5rem;
        //   margin-top: 1.25rem;
        //   padding: 0.625rem 1.25rem;
        //   background: transparent;
        //   border: 1px solid rgba(255, 255, 255, 0.2);
        //   border-radius: 10px;
        //   color: rgba(251, 234, 235, 0.8);
        //   font-size: 0.875rem;
        //   font-weight: 600;
        //   cursor: pointer;
        //   transition: all 0.3s ease;
        // }

        .milestone-toggle {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1.25rem;
          padding: 0.625rem 1.25rem;
          background: transparent;
          border: 1px solid var(--btn-secondary-border);
          border-radius: 10px;
          color: var(--text-secondary);
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .milestone-toggle:hover {
          background: var(--toggle-hover-bg);
          border-color: var(--accent-purple);
          color: var(--accent-purple);
        }

        .milestone-toggle:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--milestone-color);
          color: var(--milestone-color);
        }

        .milestone-toggle svg {
          width: 16px;
          height: 16px;
          transition: transform 0.3s ease;
        }

        .milestone-toggle svg.rotated {
          transform: rotate(180deg);
        }

        /* Connector */
        .milestone-connector {
          position: absolute;
          left: 40px;
          top: 80px;
          width: 2px;
          height: calc(100% + 3rem);
          opacity: 0.3;
        }

        .milestone-card:last-child .milestone-connector {
          display: none;
        }

        /* Future Section */
        // .growth-future {
        //   position: relative;
        //   text-align: center;
        //   padding: 4rem 2rem;
        //   background: linear-gradient(135deg, rgba(145, 127, 179, 0.1) 0%, rgba(78, 205, 196, 0.1) 100%);
        //   border: 1px solid rgba(255, 255, 255, 0.1);
        //   border-radius: 24px;
        //   overflow: hidden;
        // }

        .growth-future {
          position: relative;
          text-align: center;
          padding: 4rem 2rem;
          background: var(--future-bg);
          border: 1px solid var(--future-border);
          border-radius: 24px;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        [data-theme="light"] .growth-future {
          box-shadow: 0 8px 32px rgba(155, 110, 243, 0.1);
        }

        .future-content {
          position: relative;
          z-index: 1;
        }

        .future-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          animation: crystalFloat 4s ease-in-out infinite;
          filter: drop-shadow(0 0 30px rgba(145, 127, 179, 0.5));
        }

        @keyframes crystalFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }

        // .future-title {
        //   font-size: clamp(1.75rem, 4vw, 2.5rem);
        //   font-weight: 800;
        //   color: #FBEAEB;
        //   margin: 0 0 1rem 0;
        // }

        .future-title {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 1rem 0;
          letter-spacing: -0.02em;
        }
        
        [data-theme="light"] .future-title {
          background: linear-gradient(135deg, #2F2C4F 0%, #9B6EF3 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        // .future-text {
        //   font-size: 1.125rem;
        //   color: rgba(251, 234, 235, 0.75);
        //   max-width: 600px;
        //   margin: 0 auto 2rem;
        //   line-height: 1.8;
        // }

        .future-text {
          font-size: 1.125rem;
          color: var(--text-muted);
          max-width: 600px;
          margin: 0 auto 2rem;
          line-height: 1.8;
        }

        // .highlight-text {
        //   color: #4ECDC4;
        //   font-weight: 600;
        // }

        // .glow-text {
        //   color: #FFEAA7;
        //   text-shadow: 0 0 20px rgba(255, 234, 167, 0.3);
        // }

        .highlight-text {
          color: var(--accent-teal);
          font-weight: 600;
        }
        
        [data-theme="light"] .highlight-text {
          color: #9B6EF3;
        }
        
        .glow-text {
          color: var(--accent-cream);
          text-shadow: 0 0 20px rgba(255, 234, 167, 0.3);
        }
        
        [data-theme="light"] .glow-text {
          color: #D4A574;
          text-shadow: none;
          font-weight: 600;
        }

        .future-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
        }

        .future-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 1rem 2.5rem;
          border-radius: 16px;
          font-size: 1rem;
          font-weight: 700;
          text-decoration: none;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .future-btn.primary {
          background: linear-gradient(135deg, #917FB3 0%, #4ECDC4 100%);
          color: white;
          box-shadow: 0 10px 40px -10px rgba(145, 127, 179, 0.5);
        }

        .future-btn.primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 60px -10px rgba(145, 127, 179, 0.6);
        }

        .btn-shimmer {
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
          transition: left 0.6s ease;
        }

        .future-btn.primary:hover .btn-shimmer {
          left: 100%;
        }

        // .future-btn.secondary {
        //   background: transparent;
        //   color: rgba(251, 234, 235, 0.8);
        //   border: 2px solid rgba(255, 255, 255, 0.2);
        // }

        // .future-btn.secondary:hover {
        //   border-color: #917FB3;
        //   color: #917FB3;
        //   background: rgba(145, 127, 179, 0.1);
        // }

        .future-btn.secondary {
          background: transparent;
          color: var(--text-secondary);
          border: 2px solid var(--btn-secondary-border);
        }
        
        .future-btn.secondary:hover {
          border-color: var(--accent-purple);
          color: var(--accent-purple);
          background: var(--btn-secondary-hover-bg);
        }

        /* Wisdom Float */
        // .wisdom-float {
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
        //   animation: wisdomSlide 1s ease-out;
        //   max-width: 280px;
        // }

        .wisdom-float {
          position: absolute;
          bottom: 20px;
          right: 20px;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          background: var(--dialog-bg);
          border: 1px solid var(--dialog-border);
          border-radius: 16px;
          backdrop-filter: blur(10px);
          animation: wisdomSlide 1s ease-out;
          max-width: 280px;
          box-shadow: 0 4px 20px var(--shadow-color);
        }

        @keyframes wisdomSlide {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .wisdom-icon {
          font-size: 1.5rem;
          animation: targetPulse 2s ease-in-out infinite;
        }

        @keyframes targetPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.3); }
        }

        // .wisdom-float p {
        //   margin: 0;
        //   font-size: 0.8125rem;
        //   color: rgba(251, 234, 235, 0.8);
        //   font-style: italic;
        //   line-height: 1.5;
        //   text-align: left;
        // }

        .wisdom-float p {
          margin: 0;
          font-size: 0.8125rem;
          color: var(--text-secondary);
          font-style: italic;
          line-height: 1.5;
          text-align: left;
        }

        /* Responsive */
        @media (min-width: 768px) {
          .growth-section {
            padding: 6rem 3rem;
          }

          .timeline-path {
            left: 40px;
          }

          .future-actions {
            flex-direction: row;
            justify-content: center;
          }

          .metrics-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 640px) {
          .milestone-card {
            flex-direction: column;
            gap: 1rem;
          }

          .timeline-path {
            left: 20px;
          }

          .milestone-ring {
            width: 60px;
            height: 60px;
            align-self: center;
          }

          .ring-icon {
            font-size: 1.25rem;
          }

          .milestone-connector {
            left: 20px;
            top: 60px;
          }

          .metrics-grid {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }

          .metric-card {
            display: flex;
            justify-content: space-between;
            align-items: center;
            text-align: left;
          }

          .wisdom-float {
            position: relative;
            bottom: auto;
            right: auto;
            margin-top: 2rem;
            max-width: 100%;
          }
        }

        /* Light Mode Premium Enhancements */
        [data-theme="light"] .growth-section {
          background-attachment: fixed;
        }
      
        [data-theme="light"] .growth-badge {
          background: rgba(155, 110, 243, 0.08);
          border-color: rgba(155, 110, 243, 0.2);
        }
      
        [data-theme="light"] .badge-pulse {
          background: #9B6EF3;
          box-shadow: 0 0 10px rgba(155, 110, 243, 0.5);
        }
      
        [data-theme="light"] .milestone-phase {
          color: #9B6EF3;
        }
      
        [data-theme="light"] .metric-value {
          color: #2F2C4F;
        }
      
        [data-theme="light"] .future-btn.primary {
          background: linear-gradient(135deg, #9B6EF3 0%, #E85D75 100%);
          box-shadow: 0 10px 40px -10px rgba(155, 110, 243, 0.4);
        }
      
        [data-theme="light"] .future-btn.primary:hover {
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
      `}</style>
      
    </section>
  );
};

export default Growth;