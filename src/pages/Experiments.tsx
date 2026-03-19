import React, { useEffect, useRef, useState, useCallback } from "react";
import Footer from "../components/layout/Footer";

interface Experiment {
  id: number;
  title: string;
  category: string;
  description: string;
  concept: string;
  tech: string[];
  color: string;
  icon: string;
  status: "Live" | "Beta" | "Concept";
  interactions: number;
}

const experiments: Experiment[] = [
  {
    id: 1,
    title: "Kinetic Typography Engine",
    category: "Motion Design",
    description: "Text that breathes, dances, and responds to your cursor like it's alive.",
    concept: "What if letters had personalities? Each character reacts to proximity with spring physics, creating organic waves of motion that turn reading into an experience.",
    tech: ["Canvas API", "Spring Physics", "Variable Fonts"],
    color: "#FF6B9D",
    icon: "🔤",
    status: "Live",
    interactions: 12500,
  },
  {
    id: 2,
    title: "Neural Network Visualizer",
    category: "AI Visualization",
    description: "Watch artificial intelligence think in real-time through flowing particle synapses.",
    concept: "Demystifying the black box of AI by visualizing how data flows through layers, activates neurons, and transforms into decisions. Education meets art.",
    tech: ["WebGL", "TensorFlow.js", "GPGPU"],
    color: "#4ECDC4",
    icon: "🧠",
    status: "Beta",
    interactions: 8300,
  },
  {
    id: 3,
    title: "Generative Art Studio",
    category: "Creative Coding",
    description: "Algorithms that paint. Every visit creates a unique masterpiece you'll never see again.",
    concept: "Combining Perlin noise, color theory, and emergent behavior to create infinite variations of digital art. Users can freeze, mutate, and export their favorites.",
    tech: ["p5.js", "Web Workers", "IndexedDB"],
    color: "#F8B500",
    icon: "🎨",
    status: "Live",
    interactions: 22100,
  },
  {
    id: 4,
    title: "Haptic Audio Lab",
    category: "Web Audio",
    description: "Feel sound. See vibrations. A synesthetic journey through web audio APIs.",
    concept: "Translating audio frequencies into visual waveforms and haptic feedback. Users can compose, visualize, and feel their music through multiple senses.",
    tech: ["Web Audio API", "Oscillators", "WebRTC"],
    color: "#C44569",
    icon: "🎵",
    status: "Concept",
    interactions: 0,
  },
  {
    id: 5,
    title: "Spatial Memory Palace",
    category: "WebXR",
    description: "Navigate your bookmarks as a 3D city. Memory palace technique meets browser history.",
    concept: "Transforming abstract data into spatial environments. Your most-visited sites become towering skyscrapers; forgotten links fade into mist.",
    tech: ["Three.js", "WebXR", "Spatial Indexing"],
    color: "#917FB3",
    icon: "🏛️",
    status: "Beta",
    interactions: 5600,
  },
  {
    id: 6,
    title: "Emoji Physics Playground",
    category: "Game Design",
    description: "Drop emojis, watch them bounce, stack, and explode with realistic physics.",
    concept: "Pure joy through simplicity. Matter.js-powered physics simulation where everyday emojis become playthings with mass, friction, and elasticity.",
    tech: ["Matter.js", "Collision Detection", "Touch API"],
    color: "#FF6B6B",
    icon: "⚽",
    status: "Live",
    interactions: 34200,
  },
];

const MorphingBlob: React.FC<{ color: string; delay: number }> = ({ color, delay }) => (
  <div
    className="morphing-blob"
    style={{
      background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
      animationDelay: `${delay}s`,
    }}
  />
);

const FloatingEmoji: React.FC<{ emoji: string; delay: number; x: number }> = ({ emoji, delay, x }) => (
  <div
    className="floating-emoji"
    style={{
      left: `${x}%`,
      animationDelay: `${delay}s`,
    }}
  >
    {emoji}
  </div>
);

const ParticleBurst: React.FC<{ active: boolean; color: string }> = ({ active, color }) => {
  if (!active) return null;
  return (
    <div className="particle-burst">
      {[...Array(16)].map((_, i) => (
        <span
          key={i}
          className="burst-dot"
          style={{
            transform: `rotate(${i * 22.5}deg)`,
            background: color,
          }}
        />
      ))}
    </div>
  );
};

const Experiments: React.FC = () => {
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const [activeExperiment, setActiveExperiment] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [celebrating, setCelebrating] = useState<number | null>(null);
  const [tiltValues, setTiltValues] = useState<{ [key: number]: { x: number; y: number } }>({});
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setVisibleCards((prev) => new Set([...prev, index]));
            setTimeout(() => {
              setCelebrating(index);
              setTimeout(() => setCelebrating(null), 1500);
            }, 300);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent, index: number) => {
    const card = cardRefs.current[index];
    if (!card) return;
    
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMousePos({ x: x * 100, y: y * 100 });
    
    // 3D tilt effect
    const tiltX = (y - 0.5) * 20;
    const tiltY = (x - 0.5) * -20;
    setTiltValues((prev) => ({ ...prev, [index]: { x: tiltX, y: tiltY } }));
  }, []);

  const handleMouseLeave = (index: number) => {
    setTiltValues((prev) => ({ ...prev, [index]: { x: 0, y: 0 } }));
    setHoveredCard(null);
  };

  const setCardRef = (index: number) => (el: HTMLDivElement | null) => {
    cardRefs.current[index] = el;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Live": return "#4ECDC4";
      case "Beta": return "#F8B500";
      case "Concept": return "#FF6B6B";
      default: return "#917FB3";
    }
  };

  return (
    <section className="experiments-section" id="experiments" ref={sectionRef}>
      {/* Dynamic Background */}
      <div className="experiments-bg">
        <div className="gradient-mesh" />
        {[...Array(6)].map((_, i) => (
          <MorphingBlob 
            key={i} 
            color={experiments[i % experiments.length].color} 
            delay={i * 0.5} 
          />
        ))}
      </div>

      {/* Floating Emojis */}
      <div className="emoji-field">
        {["🔬", "⚗️", "🧪", "🔭", "🎲", "🎯", "🚀", "💡"].map((emoji, i) => (
          <FloatingEmoji 
            key={i} 
            emoji={emoji} 
            delay={i * 0.3} 
            x={10 + i * 10} 
          />
        ))}
      </div>

      {/* Grid Pattern */}
      <div className="experiments-grid" />

      <div className="experiments-container">
        {/* Header */}
        <header className="experiments-header">
          <div className="header-orbit">
            <span className="orbit-center">⚛️</span>
            <div className="orbit-ring ring-1" />
            <div className="orbit-ring ring-2" />
            <div className="orbit-ring ring-3" />
          </div>

          <h1 className="experiments-title">
            <span className="title-glitch" data-text="Creative">Creative</span>
            <span className="title-highlight">Experiments</span>
            <span className="title-lab">Lab</span>
          </h1>

          <p className="experiments-subtitle">
            Where <span className="text-pop">curiosity</span> meets{" "}
            <span className="text-pop">code</span>. A playground of interactive prototypes, 
            visual explorations, and delightful digital toys.
          </p>

          {/* Dialog */}
          <div className="curiosity-dialog">
            <div className="dialog-avatar">🤔</div>
            <div className="dialog-bubble">
              <p>"What happens when curiosity leads the way? You break things beautifully, 
              learn unexpectedly, and occasionally create something that makes people smile."</p>
              <div className="dialog-sparkles">
                <span>✨</span><span>🧪</span><span>✨</span>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Bar */}
        <div className="experiments-stats">
          <div className="stat-item">
            <span className="stat-number">6</span>
            <span className="stat-label">Active Experiments</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number">83K+</span>
            <span className="stat-label">Total Interactions</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number">∞</span>
            <span className="stat-label">Possibilities</span>
          </div>
        </div>

        {/* Experiments Grid */}
        <div className="experiments-showcase">
          {experiments.map((exp, index) => (
            <div
              key={exp.id}
              ref={setCardRef(index)}
              data-index={index}
              className={`experiment-card ${visibleCards.has(index) ? "visible" : ""} ${
                activeExperiment === index ? "expanded" : ""
              } ${hoveredCard === index ? "hovered" : ""}`}
              style={{
                "--exp-color": exp.color,
                "--tilt-x": `${tiltValues[index]?.x || 0}deg`,
                "--tilt-y": `${tiltValues[index]?.y || 0}deg`,
                transitionDelay: `${index * 100}ms`,
              } as React.CSSProperties}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => handleMouseLeave(index)}
              onClick={() => setActiveExperiment(activeExperiment === index ? null : index)}
            >
              <ParticleBurst active={celebrating === index} color={exp.color} />
              
              {/* Card Glow */}
              <div 
                className="card-glow"
                style={{
                  background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, ${exp.color}30 0%, transparent 50%)`,
                }}
              />

              <div className="card-inner" style={{ transform: `rotateX(var(--tilt-x)) rotateY(var(--tilt-y))` }}>
                {/* Status Badge */}
                <div 
                  className="status-badge" 
                  style={{ 
                    background: `${getStatusColor(exp.status)}20`,
                    color: getStatusColor(exp.status),
                    borderColor: `${getStatusColor(exp.status)}40`,
                  }}
                >
                  <span className="status-dot" style={{ background: getStatusColor(exp.status) }} />
                  {exp.status}
                </div>

                {/* Icon */}
                <div className="exp-icon" style={{ 
                  background: `linear-gradient(135deg, ${exp.color}20 0%, ${exp.color}40 100%)`,
                  boxShadow: `0 0 30px ${exp.color}30`,
                }}>
                  <span>{exp.icon}</span>
                </div>

                {/* Content */}
                <div className="exp-content">
                  <span className="exp-category">{exp.category}</span>
                  <h3 className="exp-title">{exp.title}</h3>
                  <p className="exp-description">{exp.description}</p>

                  {/* Expandable Content */}
                  <div className={`exp-details ${activeExperiment === index ? "expanded" : ""}`}>
                    <div className="concept-section">
                      <h4>The Concept 💭</h4>
                      <p>{exp.concept}</p>
                    </div>

                    <div className="tech-stack">
                      {exp.tech.map((tech, i) => (
                        <span 
                          key={tech} 
                          className="tech-tag"
                          style={{ 
                            animationDelay: `${i * 50}ms`,
                            borderColor: `${exp.color}40`,
                            color: exp.color,
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="interaction-count">
                      <span className="count-icon">👆</span>
                      <span className="count-value">{exp.interactions.toLocaleString()}</span>
                      <span className="count-label">interactions</span>
                    </div>
                  </div>
                </div>

                {/* Action */}
                <button className="exp-action">
                  <span>{activeExperiment === index ? "Collapse" : "Explore Experiment"}</span>
                  <svg className={activeExperiment === index ? "rotated" : ""} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Decorative Corners */}
              <div className="corner corner-tl" style={{ borderColor: exp.color }} />
              <div className="corner corner-br" style={{ borderColor: exp.color }} />
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="experiments-cta">
          <div className="cta-glow" />
          <div className="cta-content">
            <div className="cta-icon">🔮</div>
            <h3 className="cta-title">Your Idea Could Be Next</h3>
            <p className="cta-text">
              Got a wild concept that keeps you awake at night? 
              <span className="cta-highlight"> Let's build it together.</span> 
              The best experiments start with a simple "what if..."
            </p>
            <div className="cta-actions">
              <a href="Contact" className="cta-btn primary">
                <span>Start an Experiment</span>
                <div className="btn-ripple" />
              </a>
              <a href="Work" className="cta-btn secondary">
                See Production Work
              </a>
            </div>
          </div>

          {/* Playful Dialog */}
          <div className="play-dialog">
            <span className="play-emoji">🎮</span>
            <p>"The best way to predict the future is to play with it in the present."</p>
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
    --bg-color: #0f0f23;
    --bg-gradient-start: #0f0f23;
    --bg-gradient-mid: #1a1a3e;
    --bg-gradient-end: #16213e;
    --card-bg: rgba(255, 255, 255, 0.03);
    --card-bg-hover: rgba(255, 255, 255, 0.06);
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
    --shadow-color: rgba(0, 0, 0, 0.5);
    --grid-line: rgba(255, 255, 255, 0.02);
    --mesh-1: rgba(255, 107, 157, 0.15);
    --mesh-2: rgba(78, 205, 196, 0.1);
    --mesh-3: rgba(248, 181, 0, 0.08);
    --orbit-ring: rgba(255, 255, 255, 0.1);
    --dialog-bg: rgba(255, 255, 255, 0.05);
    --dialog-border: rgba(255, 255, 255, 0.1);
    --stats-bg: rgba(255, 255, 255, 0.03);
    --stats-border: rgba(255, 255, 255, 0.08);
    --stats-divider: rgba(255, 255, 255, 0.1);
    --tech-bg: rgba(0, 0, 0, 0.3);
    --count-bg: rgba(0, 0, 0, 0.2);
    --cta-bg: rgba(255, 255, 255, 0.02);
    --cta-border: rgba(255, 255, 255, 0.08);
    --btn-secondary-border: rgba(255, 255, 255, 0.2);
    --btn-secondary-hover-bg: rgba(145, 127, 179, 0.1);
    --corner-decoration: rgba(255, 255, 255, 0.5);
    --sparkle-color: white;
    --emoji-opacity: 0.3;
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
    --accent-pink: #E85D75;
    --accent-teal: #7C3AED;
    --accent-gold: #D4A574;
    --accent-purple: #9B6EF3;
    --accent-coral: #E85D75;
    --shadow-color: rgba(47, 44, 79, 0.08);
    --grid-line: rgba(155, 110, 243, 0.06);
    --mesh-1: rgba(232, 93, 117, 0.08);
    --mesh-2: rgba(155, 110, 243, 0.06);
    --mesh-3: rgba(212, 165, 116, 0.05);
    --orbit-ring: rgba(155, 110, 243, 0.15);
    --dialog-bg: #FFFFFF;
    --dialog-border: rgba(155, 110, 243, 0.2);
    --stats-bg: rgba(155, 110, 243, 0.05);
    --stats-border: rgba(155, 110, 243, 0.15);
    --stats-divider: rgba(155, 110, 243, 0.15);
    --tech-bg: rgba(155, 110, 243, 0.08);
    --count-bg: rgba(155, 110, 243, 0.08);
    --cta-bg: rgba(155, 110, 243, 0.03);
    --cta-border: rgba(155, 110, 243, 0.15);
    --btn-secondary-border: rgba(155, 110, 243, 0.3);
    --btn-secondary-hover-bg: rgba(155, 110, 243, 0.08);
    --corner-decoration: rgba(155, 110, 243, 0.4);
    --sparkle-color: rgba(155, 110, 243, 0.6);
    --emoji-opacity: 0.2;
  }

  /* Typography Enhancements - ADD THIS */
  .experiments-title {
    font-size: clamp(2.5rem, 8vw, 5rem);
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.02em;
    margin: 0 0 1.5rem 0;
    font-family: 'Space Grotesk', sans-serif;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
  }

  [data-theme="light"] .experiments-title {
    background: linear-gradient(135deg, #2F2C4F 0%, #9B6EF3 100%);
    -webkit-background-clip: text;
    // -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  [data-theme="light"] .title-glitch {
    // color: #2F2C4F;
    color: #F8B500;
  }

  [data-theme="light"] .title-highlight {
    background: linear-gradient(90deg, #9B6EF3, #E85D75, #D4A574, #7C3AED);
    background-size: 300% 300%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradientShift 5s ease infinite;
  }

  [data-theme="light"] .title-lab {
    color: #9B6EF3;
  }
  /* END ADD BLOCK */

        // .experiments-section {
        //   width: 100%;
        //   min-height: 100vh;
        //   background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #16213e 100%);
        //   padding: 5rem 1.5rem;
        //   position: relative;
        //   overflow: hidden;
        //   box-sizing: border-box;
        // }

        .experiments-section {
          width: 100%;
          min-height: 100vh;
          background: linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-mid) 50%, var(--bg-gradient-end) 100%);
          padding: 5rem 1.5rem;
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
          transition: background 0.5s ease;
        }

        /* Background */
        .experiments-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        // .gradient-mesh {
        //   position: absolute;
        //   inset: 0;
        //   background: 
        //     radial-gradient(ellipse at 20% 80%, rgba(255, 107, 157, 0.15) 0%, transparent 50%),
        //     radial-gradient(ellipse at 80% 20%, rgba(78, 205, 196, 0.1) 0%, transparent 50%),
        //     radial-gradient(ellipse at 50% 50%, rgba(248, 181, 0, 0.08) 0%, transparent 50%);
        //   filter: blur(60px);
        //   animation: meshMove 15s ease-in-out infinite;
        // }

        .gradient-mesh {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse at 20% 80%, var(--mesh-1) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, var(--mesh-2) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, var(--mesh-3) 0%, transparent 50%);
          filter: blur(60px);
          animation: meshMove 15s ease-in-out infinite;
        }
        
        [data-theme="light"] .gradient-mesh {
          opacity: 0.8;
        }

        @keyframes meshMove {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(5deg); }
          66% { transform: translate(-20px, 20px) rotate(-5deg); }
        }

        .morphing-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.5;
          animation: blobMorph 20s ease-in-out infinite;
        }

        @keyframes blobMorph {
          0%, 100% { 
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
            transform: translate(0, 0) scale(1);
          }
          25% { 
            border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
            transform: translate(50px, -50px) scale(1.1);
          }
          50% { 
            border-radius: 50% 60% 30% 60% / 30% 40% 70% 60%;
            transform: translate(-30px, 30px) scale(0.9);
          }
          75% { 
            border-radius: 60% 40% 60% 30% / 70% 30% 50% 60%;
            transform: translate(20px, 20px) scale(1.05);
          }
        }

        /* Emoji Field */
        .emoji-field {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        // .floating-emoji {
        //   position: absolute;
        //   font-size: 1.5rem;
        //   opacity: 0.3;
        //   animation: emojiFloat 20s ease-in-out infinite;
        //   filter: blur(1px);
        // }

        .floating-emoji {
          position: absolute;
          font-size: 1.5rem;
          opacity: var(--emoji-opacity);
          animation: emojiFloat 20s ease-in-out infinite;
          filter: blur(1px);
        }

        @keyframes emojiFloat {
          0%, 100% { 
            transform: translateY(100vh) rotate(0deg) scale(0.5);
            opacity: 0;
          }
          10% { opacity: 0.3; }
          90% { opacity: 0.3; }
          100% { 
            transform: translateY(-100vh) rotate(720deg) scale(1.5);
            opacity: 0;
          }
        }

        /* Grid */
        // .experiments-grid {
        //   position: absolute;
        //   inset: 0;
        //   background-image: 
        //     linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        //     linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
        //   background-size: 40px 40px;
        //   pointer-events: none;
        // }


        .experiments-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(var(--grid-line) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        /* Container */
        .experiments-container {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        /* Header */
        .experiments-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .header-orbit {
          position: relative;
          width: 120px;
          height: 120px;
          margin: 0 auto 2rem;
        }

        .orbit-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 3rem;
          z-index: 10;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.2); }
        }

        // .orbit-ring {
        //   position: absolute;
        //   border: 2px solid rgba(255, 255, 255, 0.1);
        //   border-radius: 50%;
        //   top: 50%;
        //   left: 50%;
        //   transform: translate(-50%, -50%);
        // }

        // .ring-1 {
        //   width: 100%;
        //   height: 100%;
        //   animation: orbit 10s linear infinite;
        //   border-top-color: #FF6B9D;
        // }

        // .ring-2 {
        //   width: 75%;
        //   height: 75%;
        //   animation: orbit 15s linear infinite reverse;
        //   border-right-color: #4ECDC4;
        // }

        // .ring-3 {
        //   width: 50%;
        //   height: 50%;
        //   animation: orbit 8s linear infinite;
        //   border-bottom-color: #F8B500;
        // }

        .orbit-ring {
          position: absolute;
          border: 2px solid var(--orbit-ring);
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        
        .ring-1 {
          width: 100%;
          height: 100%;
          animation: orbit 10s linear infinite;
          border-top-color: var(--accent-pink);
        }
        
        .ring-2 {
          width: 75%;
          height: 75%;
          animation: orbit 15s linear infinite reverse;
          border-right-color: var(--accent-teal);
        }
        
        .ring-3 {
          width: 50%;
          height: 50%;
          animation: orbit 8s linear infinite;
          border-bottom-color: var(--accent-gold);
        }

        @keyframes orbit {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        .experiments-title {
          font-size: clamp(2.5rem, 8vw, 5rem);
          font-weight: 800;
          line-height: 1;
          margin: 0 0 1.5rem 0;
          font-family: 'Space Grotesk', sans-serif;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.5rem;
        }

        // .title-glitch {
        //   position: relative;
        //   color: #FBEAEB;
        //   animation: glitch 3s infinite;
        // }

        .title-glitch {
          position: relative;
          color: var(--text-primary);
          animation: glitch 3s infinite;
        }
        [data-theme="light"] .title-glitch {
          // color: #2F2C4F;
          color: #F8B500;
        }

        @keyframes glitch {
          0%, 90%, 100% { transform: translate(0); }
          92% { transform: translate(-2px, 2px); }
          94% { transform: translate(2px, -2px); }
          96% { transform: translate(-2px, -2px); }
          98% { transform: translate(2px, 2px); }
        }

        // .title-highlight {
        //   background: linear-gradient(90deg, #FF6B9D, #4ECDC4, #F8B500, #917FB3);
        //   background-size: 300% 300%;
        //   -webkit-background-clip: text;
        //   -webkit-text-fill-color: transparent;
        //   background-clip: text;
        //   animation: gradientShift 5s ease infinite;
        // }

        .title-highlight {
          background: linear-gradient(90deg, var(--accent-pink), var(--accent-teal), var(--accent-gold), var(--accent-purple));
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientShift 5s ease infinite;
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        // .title-lab {
        //   color: #917FB3;
        //   position: relative;
        // }

        .title-lab {
          color: var(--accent-purple);
          position: relative;
        }

        .title-lab::after {
          content: "🧪";
          position: absolute;
          top: -10px;
          right: -30px;
          font-size: 1.5rem;
          animation: wiggle 2s ease-in-out infinite;
        }

        @keyframes wiggle {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(10deg); }
        }

        // .experiments-subtitle {
        //   font-size: clamp(1.125rem, 2.5vw, 1.5rem);
        //   color: rgba(251, 234, 235, 0.7);
        //   max-width: 600px;
        //   margin: 0 auto 2.5rem;
        //   line-height: 1.7;
        // }

        .experiments-subtitle {
          font-size: clamp(1.125rem, 2.5vw, 1.5rem);
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto 2.5rem;
          line-height: 1.7;
        }

        // .text-pop {
        //   color: #F8B500;
        //   font-weight: 600;
        //   position: relative;
        //   display: inline-block;
        // }

        // .text-pop::after {
        //   content: "";
        //   position: absolute;
        //   bottom: -2px;
        //   left: 0;
        //   width: 100%;
        //   height: 2px;
        //   background: #F8B500;
        //   transform: scaleX(0);
        //   transition: transform 0.3s ease;
        // }

        .text-pop {
          color: var(--accent-gold);
          font-weight: 600;
          position: relative;
          display: inline-block;
        }
        
        .text-pop::after {
          content: "";
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 2px;
          background: var(--accent-gold);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }
        
        [data-theme="light"] .text-pop {
          color: #D4A574;
        }
        
        [data-theme="light"] .text-pop::after {
          background: #D4A574;
        }

        .experiments-header:hover .text-pop::after {
          transform: scaleX(1);
        }

        /* Dialog */
        // .curiosity-dialog {
        //   display: inline-flex;
        //   align-items: center;
        //   gap: 1rem;
        //   background: rgba(255, 255, 255, 0.05);
        //   border: 1px solid rgba(255, 255, 255, 0.1);
        //   border-radius: 20px;
        //   padding: 1.25rem 1.5rem;
        //   backdrop-filter: blur(10px);
        //   max-width: 700px;
        //   animation: dialogFloat 4s ease-in-out infinite;
        // }

        .curiosity-dialog {
          display: inline-flex;
          align-items: center;
          gap: 1rem;
          background: var(--dialog-bg);
          border: 1px solid var(--dialog-border);
          border-radius: 20px;
          padding: 1.25rem 1.5rem;
          backdrop-filter: blur(10px);
          max-width: 700px;
          animation: dialogFloat 4s ease-in-out infinite;
          box-shadow: 0 4px 20px var(--shadow-color);
          transition: all 0.3s ease;
        }
        
        [data-theme="light"] .curiosity-dialog {
          box-shadow: 0 8px 30px rgba(155, 110, 243, 0.12);
        }

        @keyframes dialogFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
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
        //   flex-shrink: 0;
        //   animation: think 3s ease-in-out infinite;
        // }

        .dialog-avatar {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-coral) 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          flex-shrink: 0;
          animation: think 3s ease-in-out infinite;
        }
        
        [data-theme="light"] .dialog-avatar {
          background: linear-gradient(135deg, #D4A574 0%, #E85D75 100%);
          box-shadow: 0 4px 15px rgba(212, 165, 116, 0.3);
        }

        @keyframes think {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.1) rotate(-10deg); }
          75% { transform: scale(1.1) rotate(10deg); }
        }

        .dialog-bubble {
          text-align: left;
        }

        // .dialog-bubble p {
        //   margin: 0 0 0.5rem 0;
        //   color: rgba(251, 234, 235, 0.9);
        //   font-size: 1rem;
        //   line-height: 1.6;
        //   font-style: italic;
        // }

        .dialog-bubble p {
          margin: 0 0 0.5rem 0;
          color: var(--text-primary);
          font-size: 1rem;
          line-height: 1.6;
          font-style: italic;
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
          50% { opacity: 1; transform: scale(1.3); }
        }

        /* Stats */
        // .experiments-stats {
        //   display: flex;
        //   justify-content: center;
        //   align-items: center;
        //   gap: 2rem;
        //   margin-bottom: 4rem;
        //   padding: 1.5rem;
        //   background: rgba(255, 255, 255, 0.03);
        //   border: 1px solid rgba(255, 255, 255, 0.08);
        //   border-radius: 16px;
        //   backdrop-filter: blur(10px);
        // }

        .experiments-stats {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 2rem;
          margin-bottom: 4rem;
          padding: 1.5rem;
          background: var(--stats-bg);
          border: 1px solid var(--stats-border);
          border-radius: 16px;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        
        [data-theme="light"] .experiments-stats {
          box-shadow: 0 8px 32px rgba(155, 110, 243, 0.08);
        }

        .stat-item {
          text-align: center;
        }

        // .stat-number {
        //   display: block;
        //   font-family: 'Space Grotesk', sans-serif;
        //   font-size: 2.5rem;
        //   font-weight: 800;
        //   background: linear-gradient(135deg, #FBEAEB 0%, #917FB3 100%);
        //   -webkit-background-clip: text;
        //   -webkit-text-fill-color: transparent;
        //   background-clip: text;
        // }

        .stat-number {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 2.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent-purple) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        [data-theme="light"] .stat-number {
          background: linear-gradient(135deg, #2F2C4F 0%, #9B6EF3 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        // .stat-label {
        //   font-size: 0.875rem;
        //   color: rgba(251, 234, 235, 0.6);
        //   text-transform: uppercase;
        //   letter-spacing: 0.05em;
        // }

        .stat-label {
          font-size: 0.875rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .stat-divider {
          width: 1px;
          height: 40px;
          background: var(--stats-divider);
        }

        // .stat-divider {
        //   width: 1px;
        //   height: 40px;
        //   background: rgba(255, 255, 255, 0.1);
        // }

        /* Showcase Grid */
        .experiments-showcase {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin-bottom: 5rem;
        }

        /* Experiment Cards */
        .experiment-card {
          position: relative;
          opacity: 0;
          transform: translateY(40px) rotateX(10deg);
          transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: pointer;
          perspective: 1000px;
        }

        .experiment-card.visible {
          opacity: 1;
          transform: translateY(0) rotateX(0);
        }

        .experiment-card.hovered {
          z-index: 10;
        }

        .particle-burst {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 0;
          height: 0;
          z-index: 100;
          pointer-events: none;
        }

        .burst-dot {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          margin: -4px;
          animation: burstOut 1s ease-out forwards;
        }

        @keyframes burstOut {
          0% {
            transform: rotate(var(--rotation, 0deg)) translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: rotate(var(--rotation, 0deg)) translateY(80px) scale(0);
            opacity: 0;
          }
        }

        .card-glow {
          position: absolute;
          inset: -2px;
          border-radius: 24px;
          opacity: 0;
          transition: opacity 0.3s ease;
          filter: blur(20px);
          pointer-events: none;
        }

        .experiment-card.hovered .card-glow {
          opacity: 1;
        }

        // .card-inner {
        //   position: relative;
        //   background: rgba(255, 255, 255, 0.03);
        //   border: 1px solid rgba(255, 255, 255, 0.08);
        //   border-radius: 20px;
        //   padding: 1.75rem;
        //   backdrop-filter: blur(20px);
        //   transition: all 0.3s ease;
        //   transform-style: preserve-3d;
        // }

        // .experiment-card.hovered .card-inner {
        //   background: rgba(255, 255, 255, 0.06);
        //   border-color: rgba(255, 255, 255, 0.15);
        //   box-shadow: 0 25px 50px -20px rgba(0, 0, 0, 0.5);
        // }

        .card-inner {
          position: relative;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 20px;
          padding: 1.75rem;
          backdrop-filter: blur(20px);
          transition: all 0.3s ease;
          transform-style: preserve-3d;
        }
        
        .experiment-card.hovered .card-inner {
          background: var(--card-bg-hover);
          border-color: var(--card-border-hover);
          box-shadow: 0 25px 50px -20px var(--shadow-color);
          transform: translateY(-4px);
        }
        
        [data-theme="light"] .card-inner {
          box-shadow: 0 4px 20px var(--shadow-color);
        }
        
        [data-theme="light"] .experiment-card.hovered .card-inner {
          box-shadow: 0 30px 60px -15px rgba(155, 110, 243, 0.15);
          border-color: #9B6EF3;
        }

        .status-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.375rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border: 1px solid;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          animation: statusPulse 2s ease-in-out infinite;
        }

        @keyframes statusPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .exp-icon {
          width: 70px;
          height: 70px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
          transition: all 0.3s ease;
        }

        .exp-icon span {
          font-size: 2rem;
          transition: transform 0.3s ease;
        }

        .experiment-card.hovered .exp-icon {
          transform: scale(1.1) rotate(5deg);
        }

        .experiment-card.hovered .exp-icon span {
          transform: scale(1.2);
        }

        .exp-content {
          margin-bottom: 1.25rem;
        }

        .exp-category {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--exp-color);
          margin-bottom: 0.5rem;
        }

        // .exp-title {
        //   font-size: 1.375rem;
        //   font-weight: 700;
        //   color: #FBEAEB;
        //   margin: 0 0 0.75rem 0;
        //   line-height: 1.3;
        //   transition: color 0.3s ease;
        // }

        .exp-title {
          font-size: 1.375rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 0.75rem 0;
          line-height: 1.3;
          transition: color 0.3s ease;
          letter-spacing: -0.01em;
        }
        
        [data-theme="light"] .exp-title {
          background: linear-gradient(135deg, #2F2C4F 0%, #4A4466 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .experiment-card.hovered .exp-title {
          color: var(--exp-color);
        }

        // .exp-description {
        //   font-size: 1rem;
        //   line-height: 1.6;
        //   color: rgba(251, 234, 235, 0.7);
        //   margin: 0;
        // }

        .exp-description {
          font-size: 1rem;
          line-height: 1.6;
          color: var(--text-secondary);
          margin: 0;
        }

        /* Expandable Details */
        .exp-details {
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .exp-details.expanded {
          max-height: 500px;
          opacity: 1;
          margin-top: 1.5rem;
        }

        .concept-section {
          margin-bottom: 1.25rem;
        }

        .concept-section h4 {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--exp-color);
          margin: 0 0 0.5rem 0;
        }

        // .concept-section p {
        //   font-size: 0.9375rem;
        //   line-height: 1.7;
        //   color: rgba(251, 234, 235, 0.8);
        //   margin: 0;
        // }

        .concept-section p {
          font-size: 0.9375rem;
          line-height: 1.7;
          color: var(--text-secondary);
          margin: 0;
        }

        .tech-stack {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
        }

        // .tech-tag {
        //   padding: 0.375rem 0.875rem;
        //   background: rgba(0, 0, 0, 0.3);
        //   border: 1px solid;
        //   border-radius: 9999px;
        //   font-size: 0.8125rem;
        //   font-weight: 500;
        //   opacity: 0;
        //   transform: scale(0.8);
        //   animation: tagPop 0.4s ease forwards;
        // }

        .tech-tag {
          padding: 0.375rem 0.875rem;
          background: var(--tech-bg);
          border: 1px solid;
          border-radius: 9999px;
          font-size: 0.8125rem;
          font-weight: 500;
          opacity: 0;
          transform: scale(0.8);
          animation: tagPop 0.4s ease forwards;
        }
        
        [data-theme="light"] .tech-tag {
          background: rgba(155, 110, 243, 0.08);
          border-color: rgba(155, 110, 243, 0.2);
          font-weight: 600;
        }

        @keyframes tagPop {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        // .interaction-count {
        //   display: flex;
        //   align-items: center;
        //   gap: 0.5rem;
        //   padding: 0.75rem;
        //   background: rgba(0, 0, 0, 0.2);
        //   border-radius: 12px;
        // }

        .interaction-count {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: var(--count-bg);
          border-radius: 12px;
          border: 1px solid var(--card-border);
        }

        .count-icon {
          font-size: 1.25rem;
        }

        // .count-value {
        //   font-family: 'Space Grotesk', sans-serif;
        //   font-size: 1.25rem;
        //   font-weight: 700;
        //   color: #FBEAEB;
        // }

        // .count-label {
        //   font-size: 0.875rem;
        //   color: rgba(251, 234, 235, 0.6);
        // }

        .count-value {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        
        [data-theme="light"] .count-value {
          color: #2F2C4F;
        }
        
        .count-label {
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        /* Action Button */
        // .exp-action {
        //   display: inline-flex;
        //   align-items: center;
        //   gap: 0.5rem;
        //   padding: 0.875rem 1.5rem;
        //   background: linear-gradient(135deg, var(--exp-color) 0%, transparent 100%);
        //   background-size: 200% 100%;
        //   background-position: 100% 0;
        //   border: 1px solid var(--exp-color);
        //   border-radius: 12px;
        //   color: #FBEAEB;
        //   font-size: 0.9375rem;
        //   font-weight: 600;
        //   cursor: pointer;
        //   transition: all 0.3s ease;
        //   width: 100%;
        //   justify-content: center;
        // }

        .exp-action {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          background: linear-gradient(135deg, var(--exp-color) 0%, transparent 100%);
          background-size: 200% 100%;
          background-position: 100% 0;
          border: 1px solid var(--exp-color);
          border-radius: 12px;
          color: var(--text-primary);
          font-size: 0.9375rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          justify-content: center;
        }
        
        [data-theme="light"] .exp-action {
          color: #2F2C4F;
          font-weight: 700;
        }

        .exp-action:hover {
          background-position: 0 0;
          transform: translateY(-2px);
          box-shadow: 0 10px 30px -10px var(--exp-color);
        }

        .exp-action svg {
          width: 18px;
          height: 18px;
          transition: transform 0.3s ease;
        }

        .exp-action svg.rotated {
          transform: rotate(180deg);
        }

        /* Decorative Corners */
        // .corner {
        //   position: absolute;
        //   width: 30px;
        //   height: 30px;
        //   border: 2px solid;
        //   opacity: 0;
        //   transition: all 0.3s ease;
        // }

        .corner {
          position: absolute;
          width: 30px;
          height: 30px;
          border: 2px solid var(--corner-decoration);
          opacity: 0;
          transition: all 0.3s ease;
        }

        .corner-tl {
          top: 15px;
          left: 15px;
          border-right: none;
          border-bottom: none;
          border-radius: 12px 0 0 0;
        }

        .corner-br {
          bottom: 15px;
          right: 15px;
          border-left: none;
          border-top: none;
          border-radius: 0 0 12px 0;
        }

        .experiment-card.hovered .corner {
          opacity: 0.5;
          width: 50px;
          height: 50px;
        }

        /* CTA Section */
        // .experiments-cta {
        //   position: relative;
        //   text-align: center;
        //   padding: 4rem 2rem;
        //   background: rgba(255, 255, 255, 0.02);
        //   border: 1px solid rgba(255, 255, 255, 0.08);
        //   border-radius: 24px;
        //   overflow: hidden;
        // }

        .experiments-cta {
          position: relative;
          text-align: center;
          padding: 4rem 2rem;
          background: var(--cta-bg);
          border: 1px solid var(--cta-border);
          border-radius: 24px;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        [data-theme="light"] .experiments-cta {
          box-shadow: 0 8px 32px rgba(155, 110, 243, 0.08);
        }

        // .cta-glow {
        //   position: absolute;
        //   top: 50%;
        //   left: 50%;
        //   transform: translate(-50%, -50%);
        //   width: 600px;
        //   height: 600px;
        //   background: radial-gradient(circle, rgba(145, 127, 179, 0.2) 0%, transparent 70%);
        //   animation: ctaGlow 10s ease-in-out infinite;
        // }

        .cta-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(155, 110, 243, 0.15) 0%, transparent 70%);
          animation: ctaGlow 10s ease-in-out infinite;
        }
        
        [data-theme="light"] .cta-glow {
          background: radial-gradient(circle, rgba(155, 110, 243, 0.1) 0%, transparent 70%);
          opacity: 0.8;
        }

        @keyframes ctaGlow {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
        }

        .cta-content {
          position: relative;
          z-index: 1;
        }

        .cta-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          animation: crystalSpin 8s linear infinite;
          filter: drop-shadow(0 0 30px rgba(145, 127, 179, 0.5));
        }

        @keyframes crystalSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        // .cta-title {
        //   font-size: clamp(1.75rem, 4vw, 2.5rem);
        //   font-weight: 800;
        //   color: #FBEAEB;
        //   margin: 0 0 1rem 0;
        // }

        .cta-title {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 1rem 0;
          letter-spacing: -0.02em;
        }
        
        [data-theme="light"] .cta-title {
          background: linear-gradient(135deg, #2F2C4F 0%, #9B6EF3 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        // .cta-text {
        //   font-size: 1.125rem;
        //   color: rgba(251, 234, 235, 0.75);
        //   max-width: 600px;
        //   margin: 0 auto 2rem;
        //   line-height: 1.8;
        // }

        .cta-text {
          font-size: 1.125rem;
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto 2rem;
          line-height: 1.8;
        }

        // .cta-highlight {
        //   color: #F8B500;
        //   font-weight: 600;
        //   position: relative;
        // }

        // .cta-highlight::after {
        //   content: "";
        //   position: absolute;
        //   bottom: -2px;
        //   left: 0;
        //   width: 100%;
        //   height: 2px;
        //   background: #F8B500;
        //   animation: underlinePulse 2s ease-in-out infinite;
        // }

        .cta-highlight {
          color: var(--accent-gold);
          font-weight: 600;
          position: relative;
        }
        
        .cta-highlight::after {
          content: "";
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 2px;
          background: var(--accent-gold);
          animation: underlinePulse 2s ease-in-out infinite;
        }
        
        [data-theme="light"] .cta-highlight {
          color: #D4A574;
        }
        
        [data-theme="light"] .cta-highlight::after {
          background: #D4A574;
        }

        @keyframes underlinePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .cta-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
        }

        .cta-btn {
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

        // .cta-btn.primary {
        //   background: linear-gradient(135deg, #FF6B9D 0%, #917FB3 50%, #4ECDC4 100%);
        //   background-size: 200% 200%;
        //   color: white;
        //   animation: gradientMove 5s ease infinite;
        //   box-shadow: 0 10px 40px -10px rgba(255, 107, 157, 0.5);
        // }

        .cta-btn.primary {
          background: linear-gradient(135deg, var(--accent-pink) 0%, var(--accent-purple) 50%, var(--accent-teal) 100%);
          background-size: 200% 200%;
          color: white;
          animation: gradientMove 5s ease infinite;
          box-shadow: 0 10px 40px -10px rgba(255, 107, 157, 0.5);
        }
        
        [data-theme="light"] .cta-btn.primary {
          background: linear-gradient(135deg, #E85D75 0%, #9B6EF3 50%, #7C3AED 100%);
          box-shadow: 0 10px 40px -10px rgba(155, 110, 243, 0.4);
        }
        
        [data-theme="light"] .cta-btn.primary:hover {
          box-shadow: 0 20px 60px -10px rgba(155, 110, 243, 0.5);
        }

        @keyframes gradientMove {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .cta-btn.primary:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 20px 60px -10px rgba(255, 107, 157, 0.6);
        }

        .btn-ripple {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(255,255,255,0.3) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .cta-btn.primary:hover .btn-ripple {
          opacity: 1;
        }

        // .cta-btn.secondary {
        //   background: transparent;
        //   color: rgba(251, 234, 235, 0.8);
        //   border: 2px solid rgba(255, 255, 255, 0.2);
        // }

        // .cta-btn.secondary:hover {
        //   border-color: #917FB3;
        //   color: #917FB3;
        //   background: rgba(145, 127, 179, 0.1);
        // }

        .cta-btn.secondary {
          background: transparent;
          color: var(--text-secondary);
          border: 2px solid var(--btn-secondary-border);
        }
        
        .cta-btn.secondary:hover {
          border-color: var(--accent-purple);
          color: var(--accent-purple);
          background: var(--btn-secondary-hover-bg);
        }

        /* Play Dialog */
        // .play-dialog {
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
        //   animation: playSlide 1s ease-out;
        //   max-width: 280px;
        // }

        .play-dialog {
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
          animation: playSlide 1s ease-out;
          max-width: 280px;
          box-shadow: 0 4px 20px var(--shadow-color);
        }

        @keyframes playSlide {
          from {
            opacity: 0;
            transform: translateX(50px) rotate(10deg);
          }
          to {
            opacity: 1;
            transform: translateX(0) rotate(0deg);
          }
        }

        .play-emoji {
          font-size: 1.5rem;
          animation: gameBounce 1s ease-in-out infinite;
        }

        @keyframes gameBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        // .play-dialog p {
        //   margin: 0;
        //   font-size: 0.8125rem;
        //   color: rgba(251, 234, 235, 0.8);
        //   font-style: italic;
        //   line-height: 1.5;
        //   text-align: left;
        // }

        .play-dialog p {
          margin: 0;
          font-size: 0.8125rem;
          color: var(--text-secondary);
          font-style: italic;
          line-height: 1.5;
          text-align: left;
        }

        /* Responsive */
        @media (min-width: 768px) {
          .experiments-section {
            padding: 6rem 3rem;
          }

          .experiments-showcase {
            grid-template-columns: repeat(2, 1fr);
          }

          .cta-actions {
            flex-direction: row;
            justify-content: center;
          }

          .experiments-stats {
            gap: 4rem;
          }
        }

        @media (min-width: 1024px) {
          .experiments-showcase {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 640px) {
          .experiments-showcase {
            grid-template-columns: 1fr;
          }

          .experiments-stats {
            flex-direction: column;
            gap: 1.5rem;
          }

          .stat-divider {
            width: 60px;
            height: 1px;
          }

          .play-dialog {
            position: relative;
            bottom: auto;
            right: auto;
            margin-top: 2rem;
            max-width: 100%;
          }
        }


        /* Light Mode Premium Enhancements */
  [data-theme="light"] .experiments-section {
    background-attachment: fixed;
  }

  [data-theme="light"] .experiments-container {
    max-width: 1100px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  [data-theme="light"] .experiments-header {
    margin-bottom: 6rem;
  }

  [data-theme="light"] .morphing-blob {
    opacity: 0.3;
  }

  [data-theme="light"] .status-badge {
    background: rgba(155, 110, 243, 0.08);
    border-color: rgba(155, 110, 243, 0.2);
  }

  [data-theme="light"] .exp-icon {
    box-shadow: 0 4px 15px rgba(155, 110, 243, 0.15);
  }

  [data-theme="light"] .experiments-showcase {
    gap: 2.5rem;
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
  @media (max-width: 640px) {
    [data-theme="light"] .experiments-section {
      padding: 4rem 1rem;
    }

    [data-theme="light"] .card-inner {
      padding: 1.5rem;
    }

    [data-theme="light"] .experiments-stats {
      flex-direction: column;
      gap: 1.5rem;
    }
  }

  @media (min-width: 768px) {
    [data-theme="light"] .experiments-section {
      padding: 6rem 3rem;
    }
  }
`}</style>
    </section>
  );
};

export default Experiments;