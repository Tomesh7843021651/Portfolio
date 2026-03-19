import React, { useEffect, useRef, useState, useCallback } from "react";
import Footer from "../components/layout/Footer";

interface Insight {
  id: number;
  category: string;
  title: string;
  insight: string;
  philosophy: string;
  quote: string;
  color: string;
  icon: string;
  readTime: string;
}

const insights: Insight[] = [
  {
    id: 1,
    category: "System Architecture",
    title: "The Art of Invisible Complexity",
    insight: "The most elegant systems are those that feel effortless to users while orchestrating intricate dances beneath the surface.",
    philosophy: "I believe great architecture is like a masterful symphony—every component plays its part so seamlessly that the complexity becomes invisible. When users interact with a system I've built, they shouldn't feel the weight of microservices, database optimizations, or caching strategies. They should simply experience magic.",
    quote: "Simplicity is the ultimate sophistication, but it requires mastering complexity first.",
    color: "#FF6B9D",
    icon: "🧩",
    readTime: "4 min read",
  },
  {
    id: 2,
    category: "Design Philosophy",
    title: "Empathy-Driven Development",
    insight: "Code is merely a medium; the true craft lies in understanding the human on the other side of the screen and fun.",
    philosophy: "Before writing a single line of code, I immerse myself in the user's world. What frustrates them? What delights them? What keeps them awake at night? This empathetic foundation transforms functional software into beloved products. Every animation timing, every color choice, every interaction pattern becomes a conversation with the user.",
    quote: "Design is not just what it looks like. Design is how it works, how it feels, how it understands you.",
    color: "#C44569",
    icon: "💝",
    readTime: "5 min read",
  },
  {
    id: 3,
    category: "Problem Solving",
    title: "The Beauty of Constraint",
    insight: "Limitations aren't obstacles—they're the creative catalysts that birth innovation.",
    philosophy: "When faced with impossible deadlines, limited budgets, or technical constraints, I don't see walls. I see guardrails that guide creativity. Some of my most elegant solutions emerged from the tightest constraints. The blank canvas is paralyzing; the constrained problem is liberating. This is where resourcefulness meets invention.",
    quote: "Creativity thrives in constraints. Freedom without boundaries is just chaos wearing a fancy mask.",
    color: "#F8B500",
    icon: "⚡",
    readTime: "6 min read",
  },
  {
    id: 4,
    category: "Growth Mindset",
    title: "Perpetual Beginner's Eyes",
    insight: "Expertise is not a destination but a commitment to remaining curious in the face of certainty.",
    philosophy: "After years in this field, I've learned that knowing what I don't know is more valuable than what I do. I approach each project with beginner's eyes—questioning assumptions, exploring unfamiliar territories, staying humble before the vastness of what there is to learn. This intellectual humility is my secret weapon against stagnation.",
    quote: "The moment you think you've mastered something is the moment you stop growing.",
    color: "#4ECDC4",
    icon: "🌱",
    readTime: "4 min read",
  },
];

const FloatingOrb: React.FC<{ color: string; delay: number; size: number }> = ({ color, delay, size }) => (
  <div
    className="floating-orb"
    style={{
      background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
      animationDelay: `${delay}s`,
      width: size,
      height: size,
    }}
  />
);

// const TypewriterText: React.FC<{ text: string; delay?: number }> = ({ text, delay = 0 }) => {
//   const [displayText, setDisplayText] = useState("");
//   const [started, setStarted] = useState(false);

//   useEffect(() => {
//     const timeout = setTimeout(() => setStarted(true), delay);
//     return () => clearTimeout(timeout);
//   }, [delay]);

//   useEffect(() => {
//     if (!started) return;
//     let index = 0;
//     const interval = setInterval(() => {
//       if (index <= text.length) {
//         setDisplayText(text.slice(0, index));
//         index++;
//       } else {
//         clearInterval(interval);
//       }
//     }, 50);
//     return () => clearInterval(interval);
//   }, [started, text]);

//   return <span>{displayText}<span className="cursor">|</span></span>;
// };

interface CyclingTypewriterProps {
  texts: string[];
  typingSpeed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
  startDelay?: number;
}

const CyclingTypewriter: React.FC<CyclingTypewriterProps> = ({
  texts,
  typingSpeed = 50,
  deleteSpeed = 30,
  pauseDuration = 2000,
  startDelay = 500,
}) => {
  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [started, setStarted] = useState(false);

  // Start after initial delay
  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(timeout);
  }, [startDelay]);

  // Main typing/deleting logic
  useEffect(() => {
    if (!started) return;

    const currentText = texts[textIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (isPaused) {
      // Pause before deleting
      timeout = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseDuration);
    } else if (isDeleting) {
      // Deleting text
      if (displayText === "") {
        // Move to next text
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % texts.length);
      } else {
        // Continue deleting
        timeout = setTimeout(() => {
          setDisplayText(currentText.slice(0, displayText.length - 1));
        }, deleteSpeed);
      }
    } else {
      // Typing text
      if (displayText === currentText) {
        // Finished typing, start pause
        setIsPaused(true);
      } else {
        // Continue typing
        timeout = setTimeout(() => {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        }, typingSpeed);
      }
    }

    return () => clearTimeout(timeout);
  }, [started, displayText, isDeleting, isPaused, textIndex, texts, typingSpeed, deleteSpeed, pauseDuration]);

  return (
    <span className="cycling-typewriter">
      {displayText}
      <span className={`cursor ${isPaused ? "blink" : ""}`}>|</span>
    </span>
  );
};

const Thinking: React.FC = () => {
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const [activeInsight, setActiveInsight] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setVisibleCards((prev) => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -50px 0px" }
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
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  const setCardRef = (index: number) => (el: HTMLDivElement | null) => {
    cardRefs.current[index] = el;
  };

  return (
    <section className="thinking-section" id="thinking" ref={sectionRef}>
      {/* Ambient Background */}
      <div className="ambient-mesh" />
      <div className="noise-overlay" />
      
      {/* Floating Orbs */}
      <div className="orbs-container">
        <FloatingOrb color="#FF6B9D" delay={0} size={400} />
        <FloatingOrb color="#4ECDC4" delay={2} size={300} />
        <FloatingOrb color="#F8B500" delay={4} size={350} />
        <FloatingOrb color="#C44569" delay={1} size={250} />
      </div>

      <div className="thinking-container">
        {/* Header */}
        <header className="thinking-header">
          <div className="header-badge">
            <span className="badge-icon">💭</span>
            <span>Engineering Philosophy & Design Thinking</span>
          </div>
          
          <h1 className="thinking-title">
            <span className="title-word">Where</span>
            <span className="title-word highlight">Code</span>
            <span className="title-word">Meets</span>
            <span className="title-word highlight-alt">Contemplation</span>
          </h1>
          
          {/* <p className="thinking-subtitle">
            <TypewriterText 
              text="Exploring the intersection of technical mastery and human-centered wisdom." 
              delay={500}
            />
          </p> */}

<p className="thinking-subtitle">
  <CyclingTypewriter
    texts={[
      "Exploring the intersection of technical mastery and human-centered wisdom.",
      "Where code becomes poetry and logic meets empathy.",
      "Building digital experiences that feel like magic.",
      "Turning complex problems into elegant solutions.",
      "Crafting software with soul and purpose."
    ]}
    typingSpeed={40}
    deleteSpeed={25}
    pauseDuration={2500}
    startDelay={500}
  />
</p>

          {/* Philosophical Dialog */}
          <div className="philosophy-dialog">
            <div className="dialog-avatar">🧠</div>
            <div className="dialog-bubble">
              <p>"Here's how I think when the problem isn't obvious—when the solution hides in the spaces between requirements, in the unspoken needs of users, in the elegant balance of constraints."</p>
              <div className="dialog-decoration" />
            </div>
          </div>
        </header>

        {/* Insights Grid */}
        <div className="insights-grid">
          {insights.map((insight, index) => (
            <article
              key={insight.id}
              ref={setCardRef(index)}
              data-index={index}
              className={`insight-card ${visibleCards.has(index) ? "visible" : ""} ${
                activeInsight === index ? "expanded" : ""
              } ${hoveredCard === index ? "hovered" : ""}`}
              style={{ 
                "--insight-color": insight.color,
                transitionDelay: `${index * 200}ms`,
              } as React.CSSProperties}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => setActiveInsight(activeInsight === index ? null : index)}
            >
              {/* Glow Effect */}
              <div 
                className="card-glow" 
                style={{
                  background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, ${insight.color}30 0%, transparent 50%)`,
                }}
              />
              
              {/* Card Content */}
              <div className="card-inner">
                <div className="card-shine" />
                
                {/* Header */}
                <div className="insight-header">
                  <span className="insight-icon">{insight.icon}</span>
                  <div className="insight-meta">
                    <span className="insight-category">{insight.category}</span>
                    <span className="read-time">{insight.readTime}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="insight-title">{insight.title}</h3>
                
                {/* Core Insight */}
                <p className="insight-lead">{insight.insight}</p>

                {/* Expandable Philosophy */}
                <div className="philosophy-content">
                  <div className="philosophy-divider" />
                  <p className="philosophy-text">{insight.philosophy}</p>
                  
                  {/* Quote Block */}
                  <blockquote className="insight-quote">
                    <span className="quote-mark">"</span>
                    {insight.quote}
                    <span className="quote-mark">"</span>
                  </blockquote>
                </div>

                {/* Interactive Footer */}
                <div className="card-footer">
                  <button className="read-more-btn">
                    <span>{activeInsight === index ? "Show Less" : "Dive Deeper"}</span>
                    <svg 
                      className={activeInsight === index ? "rotated" : ""} 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="corner-accent top-left" />
              <div className="corner-accent bottom-right" />
            </article>
          ))}
        </div>

        {/* Engagement Section */}
        <div className="thinking-cta">
          <div className="cta-content">
            <div className="cta-icon">🎯</div>
            <h3 className="cta-title">Let's Think Together</h3>
            <p className="cta-text">
              Great products are born from great conversations. 
              <span className="text-glow"> Bring me your challenges</span>, your wild ideas, 
              your seemingly impossible dreams. I'll bring the architecture, the empathy, 
              and the relentless pursuit of excellence.
            </p>
            <div className="cta-actions">
              <a href="Contact" className="cta-button primary">
                <span>Start a Conversation</span>
                <div className="button-ripple" />
              </a>
              <a href="Work" className="cta-button secondary">
                See the Results
              </a>
            </div>
          </div>

          {/* Wisdom Dialog */}
          <div className="wisdom-toast">
            <span className="toast-icon">✨</span>
            <p>"The best solutions emerge when we listen more than we speak."</p>
          </div>
        </div>

        {/* .Footer section */}
        <br />
        <br />

      </div>
        <Footer/>

      {/* <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300 ;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap'); */}


        <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');

  /* ============================================
     THEME VARIABLES - ADD THIS ENTIRE BLOCK
     ============================================ */
  
  /* DARK MODE (Default) - Your existing colors */
  :root, [data-theme="dark"] {
    /* Backgrounds */
    --thinking-bg: linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    --thinking-bg-solid: #1a1a2e;
    --card-bg: rgba(255, 255, 255, 0.03);
    --card-bg-hover: rgba(255, 255, 255, 0.06);
    
    /* Text colors */
    --text-primary: #FBEAEB;
    --text-secondary: rgba(251, 234, 235, 0.85);
    --text-muted: rgba(251, 234, 235, 0.7);
    --text-subtle: rgba(251, 234, 235, 0.5);
    --text-faint: rgba(251, 234, 235, 0.4);
    
    /* Borders */
    --border-light: rgba(255, 255, 255, 0.1);
    --border-medium: rgba(255, 255, 255, 0.08);
    --border-heavy: rgba(255, 255, 255, 0.15);
    
    /* Accents (keep your existing card colors) */
    --accent-glow: rgba(145, 127, 179, 0.4);
    --shine-effect: rgba(255, 255, 255, 0.1);
    
    /* Shadows */
    --card-shadow: none;
    --hover-shadow: 0 20px 40px -20px rgba(0, 0, 0, 0.5);
    
    /* Special elements */
    --quote-bg: rgba(var(--insight-color), 0.05);
    --dialog-bg: rgba(255, 255, 255, 0.05);
    --cta-bg: rgba(255, 255, 255, 0.02);
  }

  /* LIGHT MODE - "Country Garden" palette */
  [data-theme="light"] {
    /* Backgrounds */
    --thinking-bg: #FBF4F6;
    --thinking-bg-solid: #FBF4F6;
    --card-bg: #FFFFFF;
    --card-bg-hover: #FFFFFF;
    
    /* Text colors */
    --text-primary: #2F2C4F;
    --text-secondary: #4A4668;
    --text-muted: #6B5E7A;
    --text-subtle: #9B8AA8;
    --text-faint: #B8A9C4;
    
    /* Borders */
    --border-light: rgba(155, 110, 243, 0.15);
    --border-medium: rgba(155, 110, 243, 0.1);
    --border-heavy: rgba(155, 110, 243, 0.25);
    
    /* Accents */
    --accent-glow: rgba(155, 110, 243, 0.3);
    --shine-effect: rgba(155, 110, 243, 0.08);
    
    /* Shadows */
    --card-shadow: 0 4px 20px -5px rgba(47, 44, 79, 0.1);
    --hover-shadow: 0 20px 40px -10px rgba(47, 44, 79, 0.15);
    
    /* Special elements */
    --quote-bg: rgba(155, 110, 243, 0.08);
    --dialog-bg: rgba(255, 255, 255, 0.8);
    --cta-bg: rgba(155, 110, 243, 0.05);
  }



        // .thinking-section {
        //   width: 100%;
        //   min-height: 100vh;
        //   background: linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
        //   padding: 5rem 1.5rem;
        //   position: relative;
        //   overflow: hidden;
        //   box-sizing: border-box;
        // }

        .thinking-section {
          width: 100%;
          min-height: 100vh;
          background: var(--thinking-bg);
          padding: 6rem 1.5rem; /* Increased padding */
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
          transition: background 0.5s ease;
        }
        
        /* Light mode solid background fallback */
        [data-theme="light"] .thinking-section {
          background: var(--thinking-bg-solid);
        }

        /* Ambient Background */
        .ambient-mesh {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse at 20% 30%, rgba(255, 107, 157, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(78, 205, 196, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(248, 181, 0, 0.05) 0%, transparent 70%);
          filter: blur(60px);
          animation: meshMove 20s ease-in-out infinite;
        }

        @keyframes meshMove {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        .noise-overlay {
          position: absolute;
          inset: 0;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg '%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          pointer-events: none;
        }

        /* Floating Orbs */
        .orbs-container {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .floating-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(40px);
          animation: orbFloat 15s ease-in-out infinite;
          opacity: 0.6;
        }

        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(50px, -30px) scale(1.1); }
          50% { transform: translate(-30px, 50px) scale(0.9); }
          75% { transform: translate(20px, 20px) scale(1.05); }
        }

        /* Container */
        // .thinking-container {
        //   max-width: 1000px;
        //   margin: 0 auto;
        //   position: relative;
        //   z-index: 1;
        // }

        .thinking-container {
          max-width: 1100px; /* Changed from 1000px */
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        /* Header */
        .thinking-header {
          text-align: center;
          margin-bottom: 5rem;
          position: relative;
        }

        // .header-badge {
        //   display: inline-flex;
        //   align-items: center;
        //   gap: 0.5rem;
        //   padding: 0.625rem 1.25rem;
        //   background: rgba(255, 255, 255, 0.05);
        //   border: 1px solid rgba(255, 255, 255, 0.1);
        //   border-radius: 9999px;
        //   margin-bottom: 2rem;
        //   backdrop-filter: blur(10px);
        //   animation: badgeFloat 3s ease-in-out infinite;
        // }

        .header-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1.25rem;
          background: var(--dialog-bg);
          border: 1px solid var(--border-light);
          border-radius: 9999px;
          margin-bottom: 2rem;
          backdrop-filter: blur(10px);
          animation: badgeFloat 3s ease-in-out infinite;
          transition: all 0.3s ease;
        }
        
        [data-theme="light"] .header-badge {
          box-shadow: 0 2px 10px -3px rgba(155, 110, 243, 0.15);
        }

        @keyframes badgeFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        .badge-icon {
          font-size: 1.25rem;
        }

        // .header-badge span:last-child {
        //   color: rgba(251, 234, 235, 0.9);
        //   font-size: 0.875rem;
        //   font-weight: 500;
        //   letter-spacing: 0.02em;
        // }

        .header-badge span:last-child {
          color: var(--text-secondary);
          font-size: 0.875rem;
          font-weight: 600; /* Changed from 500 */
          letter-spacing: 0.05em; /* Changed from 0.02em */
          text-transform: uppercase; /* Added */
          transition: color 0.3s ease;
        }

        // .thinking-title {
        //   font-size: clamp(2.5rem, 6vw, 4rem);
        //   font-weight: 800;
        //   line-height: 1.1;
        //   margin: 0 0 1.5rem 0;
        //   color: #FBEAEB;
        //   display: flex;
        //   flex-wrap: wrap;
        //   justify-content: center;
        //   gap: 0.5rem;
        // }

        .thinking-title {
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 800;
          letter-spacing: -0.02em; /* Added */
          line-height: 1.15; /* Changed from 1.1 */
          margin: 0 0 1.5rem 0;
          color: var(--text-primary);
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.5rem;
          transition: color 0.3s ease;
        }

        .title-word {
          display: inline-block;
          opacity: 0;
          transform: translateY(20px);
          animation: wordReveal 0.6s ease forwards;
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
          background: linear-gradient(135deg, #FF6B9D 0%, #C44569 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .highlight-alt {
          background: linear-gradient(135deg, #4ECDC4 0%, #F8B500 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        // .thinking-subtitle {
        //   font-size: clamp(1.125rem, 2.5vw, 1.5rem);
        //   color: rgba(251, 234, 235, 0.7);
        //   max-width: 600px;
        //   margin: 0 auto 3rem;
        //   line-height: 1.6;
        //   font-weight: 300;
        // }

        .thinking-subtitle {
          font-size: clamp(1.125rem, 2.5vw, 1.5rem);
          color: var(--text-muted);
          max-width: 600px;
          margin: 0 auto 3rem;
          line-height: 1.7; /* Changed from 1.6 */
          font-weight: 400; /* Changed from 300 */
          transition: color 0.3s ease;
        }

        .cursor {
          display: inline-block;
          color: #4ECDC4;
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .cursor {
          display: inline-block;
          color: #4ECDC4;
          font-weight: 300;
          margin-left: 2px;
        }
        
        .cursor.blink {
          animation: blink 1s infinite;
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        .cycling-typewriter {
          display: inline;
        }

        /* Philosophy Dialog */
        .philosophy-dialog {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          max-width: 700px;
          margin: 0 auto;
          text-align: left;
        }

        // .dialog-avatar {
        //   width: 60px;
        //   height: 60px;
        //   background: linear-gradient(135deg, #917FB3 0%, #4ECDC4 100%);
        //   border-radius: 50%;
        //   display: flex;
        //   align-items: center;
        //   justify-content: center;
        //   font-size: 1.75rem;
        //   flex-shrink: 0;
        //   animation: avatarPulse 2s ease-in-out infinite;
        //   box-shadow: 0 0 30px rgba(145, 127, 179, 0.4);
        // }

        .dialog-avatar {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #9B6EF3 0%, #C8A8F0 100%); /* Updated to lavender */
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.75rem;
          flex-shrink: 0;
          animation: avatarPulse 2s ease-in-out infinite;
          box-shadow: 0 0 30px var(--accent-glow);
          transition: box-shadow 0.3s ease;
        }

        @keyframes avatarPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 30px rgba(145, 127, 179, 0.4); }
          50% { transform: scale(1.05); box-shadow: 0 0 50px rgba(145, 127, 179, 0.6); }
        }

        // .dialog-bubble {
        //   flex: 1;
        //   background: rgba(255, 255, 255, 0.05);
        //   border: 1px solid rgba(255, 255, 255, 0.1);
        //   border-radius: 20px;
        //   padding: 1.5rem;
        //   position: relative;
        //   backdrop-filter: blur(20px);
        // }

        .dialog-bubble {
          flex: 1;
          background: var(--dialog-bg);
          border: 1px solid var(--border-light);
          border-radius: 20px;
          padding: 1.5rem;
          position: relative;
          backdrop-filter: blur(20px);
          transition: all 0.3s ease;
        }
        
        [data-theme="light"] .dialog-bubble {
          box-shadow: 0 4px 20px -5px rgba(47, 44, 79, 0.08);
        }

        // .dialog-bubble p {
        //   margin: 0;
        //   color: rgba(251, 234, 235, 0.9);
        //   font-size: 1rem;
        //   line-height: 1.7;
        //   font-style: italic;
        // }

        .dialog-bubble p {
          margin: 0;
          color: var(--text-secondary);
          font-size: 1rem;
          line-height: 1.7;
          font-style: italic;
          transition: color 0.3s ease;
        }

        .dialog-decoration {
          position: absolute;
          bottom: -10px;
          left: 30px;
          width: 20px;
          height: 20px;
          background: rgba(255, 255, 255, 0.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          transform: rotate(45deg);
        }

        /* Insights Grid */
        .insights-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          margin-bottom: 5rem;
        }

        /* Insight Cards */
        .insight-card {
          position: relative;
          opacity: 0;
          transform: translateY(40px) rotateX(5deg);
          transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: pointer;
          perspective: 1000px;
        }

        .insight-card.visible {
          opacity: 1;
          transform: translateY(0) rotateX(0);
        }

        .insight-card.hovered {
          transform: translateY(-8px) scale(1.02);
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

        .insight-card.hovered .card-glow {
          opacity: 1;
        }

        // .card-inner {
        //   position: relative;
        //   background: rgba(255, 255, 255, 0.03);
        //   border: 1px solid rgba(255, 255, 255, 0.08);
        //   border-radius: 20px;
        //   padding: 2rem;
        //   overflow: hidden;
        //   backdrop-filter: blur(20px);
        //   transition: all 0.3s ease;
        // }

        .card-inner {
          position: relative;
          background: var(--card-bg);
          border: 1px solid var(--border-medium);
          border-radius: 16px; /* Changed from 20px */
          padding: 2rem;
          overflow: hidden;
          backdrop-filter: blur(20px);
          transition: all 0.3s ease;
          box-shadow: var(--card-shadow);
        }

        // .insight-card.hovered .card-inner {
        //   background: rgba(255, 255, 255, 0.06);
        //   border-color: rgba(255, 255, 255, 0.15);
        // }

        .insight-card.hovered .card-inner {
          background: var(--card-bg-hover);
          border-color: var(--border-heavy);
          box-shadow: var(--hover-shadow);
          transform: translateY(-5px); /* Added lift effect */
        }

        .card-shine {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            105deg,
            transparent 40%,
            rgba(255, 255, 255, 0.05) 45%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0.05) 55%,
            transparent 60%
          );
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }

        .insight-card.hovered .card-shine {
          transform: translateX(100%);
        }

        /* Card Header */
        .insight-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.25rem;
        }

        .insight-icon {
          font-size: 2.5rem;
          filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.2));
          animation: iconFloat 4s ease-in-out infinite;
        }

        @keyframes iconFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(5deg); }
        }

        .insight-meta {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .insight-category {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--insight-color);
        }

        .read-time {
          font-size: 0.8125rem;
          color: rgba(251, 234, 235, 0.5);
        }

        /* Card Content */
        // .insight-title {
        //   font-size: 1.5rem;
        //   font-weight: 700;
        //   color: #FBEAEB;
        //   margin: 0 0 1rem 0;
        //   line-height: 1.3;
        //   transition: color 0.3s ease;
        // }

        .insight-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 1rem 0;
          line-height: 1.3;
          transition: color 0.3s ease;
        }

        .insight-card.hovered .insight-title {
          color: var(--insight-color);
        }

        // .insight-lead {
        //   font-size: 1.0625rem;
        //   line-height: 1.7;
        //   color: rgba(251, 234, 235, 0.85);
        //   margin: 0;
        //   font-weight: 500;
        // }

        .insight-lead {
          font-size: 1.0625rem;
          line-height: 1.7;
          color: var(--text-secondary);
          margin: 0;
          font-weight: 400; /* Changed from 500 */
          transition: color 0.3s ease;
        }

        /* Expandable Content */
        .philosophy-content {
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .insight-card.expanded .philosophy-content {
          max-height: 600px;
          opacity: 1;
          margin-top: 1.5rem;
        }

        .philosophy-divider {
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--insight-color), transparent);
          margin-bottom: 1.5rem;
          opacity: 0.5;
        }

        // .philosophy-text {
        //   font-size: 0.9375rem;
        //   line-height: 1.8;
        //   color: rgba(251, 234, 235, 0.75);
        //   margin: 0 0 1.5rem 0;
        // }

        .philosophy-text {
          font-size: 0.9375rem;
          line-height: 1.8;
          color: var(--text-muted);
          margin: 0 0 1.5rem 0;
          transition: color 0.3s ease;
        }

        /* Quote Block */
        // .insight-quote {
        //   position: relative;
        //   margin: 0;
        //   padding: 1.5rem;
        //   background: rgba(var(--insight-color), 0.05);
        //   border-left: 3px solid var(--insight-color);
        //   border-radius: 0 12px 12px 0;
        //   font-family: 'Playfair Display', serif;
        //   font-size: 1.125rem;
        //   font-style: italic;
        //   color: rgba(251, 234, 235, 0.9);
        //   line-height: 1.6;
        // }

        .insight-quote {
          position: relative;
          margin: 0;
          padding: 1.5rem;
          background: var(--quote-bg);
          border-left: 3px solid var(--insight-color);
          border-radius: 0 12px 12px 0;
          font-family: 'Playfair Display', serif;
          font-size: 1.125rem;
          font-style: italic;
          color: var(--text-secondary);
          line-height: 1.6;
          transition: all 0.3s ease;
        }

        .quote-mark {
          color: var(--insight-color);
          font-size: 1.5rem;
          line-height: 0;
          vertical-align: middle;
        }

        /* Card Footer */
        .card-footer {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        // .read-more-btn {
        //   display: inline-flex;
        //   align-items: center;
        //   gap: 0.5rem;
        //   padding: 0.75rem 1.5rem;
        //   background: transparent;
        //   border: 1px solid rgba(255, 255, 255, 0.2);
        //   border-radius: 12px;
        //   color: rgba(251, 234, 235, 0.8);
        //   font-size: 0.9375rem;
        //   font-weight: 600;
        //   cursor: pointer;
        //   transition: all 0.3s ease;
        // }

        .read-more-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: transparent;
          border: 1px solid var(--border-light);
          border-radius: 12px;
          color: var(--text-muted);
          font-size: 0.9375rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .read-more-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--insight-color);
          color: var(--insight-color);
        }

        .read-more-btn svg {
          transition: transform 0.3s ease;
        }

        .read-more-btn svg.rotated {
          transform: rotate(180deg);
        }

        /* Corner Accents */
        .corner-accent {
          position: absolute;
          width: 40px;
          height: 40px;
          border: 2px solid var(--insight-color);
          opacity: 0;
          transition: all 0.3s ease;
        }

        .corner-accent.top-left {
          top: 10px;
          left: 10px;
          border-right: none;
          border-bottom: none;
          border-radius: 12px 0 0 0;
        }

        .corner-accent.bottom-right {
          bottom: 10px;
          right: 10px;
          border-left: none;
          border-top: none;
          border-radius: 0 0 12px 0;
        }

        .insight-card.hovered .corner-accent {
          opacity: 0.5;
          width: 60px;
          height: 60px;
        }

        /* CTA Section */
        // .thinking-cta {
        //   position: relative;
        //   text-align: center;
        //   padding: 4rem 2rem;
        //   background: rgba(255, 255, 255, 0.02);
        //   border: 1px solid rgba(255, 255, 255, 0.08);
        //   border-radius: 24px;
        //   overflow: hidden;
        // }

        .thinking-cta {
          position: relative;
          text-align: center;
          padding: 4rem 2rem;
          background: var(--cta-bg);
          border: 1px solid var(--border-light);
          border-radius: 24px;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        [data-theme="light"] .thinking-cta {
          box-shadow: 0 4px 30px -10px rgba(47, 44, 79, 0.1);
        }

        .cta-content {
          position: relative;
          z-index: 1;
        }

        .cta-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          animation: ctaIconFloat 3s ease-in-out infinite;
        }

        @keyframes ctaIconFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.1); }
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
          letter-spacing: -0.02em;
          color: var(--text-primary);
          margin: 0 0 1rem 0;
          transition: color 0.3s ease;
        }

        // .cta-text {
        //   font-size: 1.125rem;
        //   color: rgba(251, 234, 235, 0.75);
        //   max-width: 600px;
        //   margin: 0 auto 2rem;
        //   line-height: 1.7;
        // }

        .cta-text {
          font-size: 1.125rem;
          color: var(--text-muted);
          max-width: 600px;
          margin: 0 auto 2rem;
          line-height: 1.7;
          transition: color 0.3s ease;
        }

        .text-glow {
          color: #FFEAA7;
          text-shadow: 0 0 20px rgba(255, 234, 167, 0.3);
        }
        [data-theme="light"] .text-glow {
          color: #F8B500;
        }

        .cta-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
        }

        .cta-button {
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

        .cta-button.primary {
          background: linear-gradient(135deg, #917FB3 0%, #4ECDC4 100%);
          color: white;
          box-shadow: 0 10px 40px -10px rgba(145, 127, 179, 0.5);
        }

        .cta-button.primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 60px -10px rgba(145, 127, 179, 0.6);
        }

        .button-ripple {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(255,255,255,0.3) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .cta-button.primary:hover .button-ripple {
          opacity: 1;
        }

        .cta-button.secondary {
          background: transparent;
          border-color: #917FB3;
          color: #917FB3;
          // color: rgba(251, 234, 235, 0.8);
          border: 2px solid rgba(255, 255, 255, 0.2);
        }

        .cta-button.secondary:hover {
          border-color: #917FB3;
          color: #917FB3;
          background: rgba(145, 127, 179, 0.1);
        }

        /* Wisdom Toast */
        // .wisdom-toast {
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
        //   animation: toastSlide 1s ease-out;
        //   max-width: 280px;
        // }

        .wisdom-toast {
          position: absolute;
          bottom: 20px;
          right: 20px;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          background: var(--card-bg);
          border: 1px solid var(--border-light);
          border-radius: 16px;
          backdrop-filter: blur(10px);
          animation: toastSlide 1s ease-out;
          max-width: 280px;
          transition: all 0.3s ease;
        }
        
        [data-theme="light"] .wisdom-toast {
          box-shadow: 0 4px 20px -5px rgba(47, 44, 79, 0.1);
        }

        @keyframes toastSlide {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .toast-icon {
          font-size: 1.5rem;
          animation: sparkle 2s ease-in-out infinite;
        }

        @keyframes sparkle {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.2) rotate(10deg); }
        }

        // .wisdom-toast p {
        //   margin: 0;
        //   font-size: 0.8125rem;
        //   color: rgba(251, 234, 235, 0.8);
        //   font-style: italic;
        //   line-height: 1.5;
        //   text-align: left;
        // }

        .wisdom-toast p {
          margin: 0;
          font-size: 0.8125rem;
          color: var(--text-muted);
          font-style: italic;
          line-height: 1.5;
          text-align: left;
          transition: color 0.3s ease;
        }

        /* Responsive */
        @media (min-width: 768px) {
          .thinking-section {
            padding: 6rem 3rem;
          }

          .insights-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 2.5rem;
          }

          .cta-actions {
            flex-direction: row;
            justify-content: center;
          }

          .philosophy-dialog {
            gap: 1.5rem;
          }

          .dialog-avatar {
            width: 70px;
            height: 70px;
            font-size: 2rem;
          }
        }

        @media (min-width: 1024px) {
          .insights-grid {
            gap: 3rem;
          }

          .card-inner {
            padding: 2.5rem;
          }
        }

        @media (max-width: 640px) {
          .philosophy-dialog {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .dialog-bubble {
            text-align: center;
          }

          .dialog-decoration {
            left: 50%;
            transform: translateX(-50%) rotate(45deg);
          }

          .wisdom-toast {
            position: relative;
            bottom: auto;
            right: auto;
            margin-top: 2rem;
            max-width: 100%;
          }
          
        }

        /* Light mode specific adjustments */
[data-theme="light"] .ambient-mesh {
  background: 
    radial-gradient(ellipse at 20% 30%, rgba(155, 110, 243, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 70%, rgba(200, 168, 240, 0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(251, 244, 246, 0.5) 0%, transparent 70%);
  opacity: 0.6;
}

[data-theme="light"] .noise-overlay {
  opacity: 0.02;
}

[data-theme="light"] .floating-orb {
  opacity: 0.4;
}

/* Smooth transitions for all theme changes */
[data-theme="light"] *,
[data-theme="dark"] * {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}
      `}</style>
    </section>
  );
};

export default Thinking;