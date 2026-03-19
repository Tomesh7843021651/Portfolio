import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";

// ============================================
// TYPES & INTERFACES
// ============================================
interface SocialLink {
  name: string;
  url: string;
  icon: string;
  color: string;
}

interface NavItem {
  label: string;
  path: string;
  icon: string;
  desc: string;
}

// ============================================
// SECURITY: URL VALIDATION
// ============================================
const isValidUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    // Only allow http, https, and mailto protocols
    return ['http:', 'https:', 'mailto:'].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
};

// ============================================
// SECURITY: INPUT SANITIZATION
// ============================================
const sanitizeText = (text: string): string => {
  return text
    .replace(/[<>\"\'&]/g, (char) => {
      const escapeMap: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;',
      };
      return escapeMap[char] || char;
    })
    .trim();
};

// ============================================
// DATA (Immutable & Validated)
// ============================================
const SOCIAL_LINKS: SocialLink[] = [
  {
    name: "GitHub",
    url: "https://github.com/Tomesh7843021651",
    icon: "⚡",
    color: "#6e5494",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/tomesh-dhongade-168524191/",
    icon: "💼",
    color: "#0077b5",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/tomeshdhongade143/",
    icon: "🐦",
    color: "#1da1f2",
  },
  {
    name: "Email",
    url: "mailto:tomeshdhongade@gmail.com",
    icon: "💌",
    color: "#FF6B6B",
  },
];

const NAV_ITEMS: NavItem[] = [
  { label: "Home", path: "/", icon: "🏠", desc: "Start here" },
  { label: "Work", path: "/work", icon: "💼", desc: "See projects" },
  { label: "Thinking", path: "/thinking", icon: "💭", desc: "Philosophy" },
  { label: "Growth", path: "/growth", icon: "🌱", desc: "My journey" },
  { label: "Experiments", path: "/experiments", icon: "🧪", desc: "Playground" },
  { label: "Contact", path: "/contact", icon: "✨", desc: "Let's talk" },
];

// ============================================
// CONSTANTS (Immutable)
// ============================================
const LINK_COLORS: Record<string, string> = {
  "🏠": "#FF6B9D",
  "💼": "#4ECDC4",
  "💭": "#F8B500",
  "🌱": "#917FB3",
  "🧪": "#FF6B6B",
  "✨": "#C44569",
};

// ============================================
// SECURITY: PATH VALIDATION
// ============================================
const isValidPath = (path: string): boolean => {
  // Only allow relative paths starting with /
  // Prevent javascript:, data:, etc.
  return /^\/[a-zA-Z0-9\-_]*$/.test(path);
};

// ============================================
// SECURITY: URL VALIDATION FOR LINKS
// ============================================
const getValidUrl = (url: string, fallback: string = "#"): string => {
  try {
    if (isValidUrl(url) || isValidPath(url)) {
      return url;
    }
    return fallback;
  } catch {
    return fallback;
  }
};

// ============================================
// SECURITY: EMAIL VALIDATION
// ============================================
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

// ============================================
// COMPONENTS
// ============================================

interface NavLinkItemProps {
  item: NavItem;
  index: number;
  isActive: boolean;
  hoveredNav: string | null;
  onMouseEnter: (label: string) => void;
  onMouseLeave: () => void;
}

const NavLinkItem: React.FC<NavLinkItemProps> = ({
  item,
  index,
  isActive,
  hoveredNav,
  onMouseEnter,
  onMouseLeave,
}) => {
  const linkColor = LINK_COLORS[item.icon] || "#C44569";

  return (
    <li
      className="nav-item"
      style={{ animationDelay: `${index * 100}ms` }}
      onMouseEnter={() => onMouseEnter(item.label)}
      onMouseLeave={onMouseLeave}
    >
      <NavLink
        to={getValidUrl(item.path) as string}
        className={`nav-link ${isActive ? "active" : ""}`}
        style={{ "--link-color": linkColor } as React.CSSProperties}
        aria-current={isActive ? "page" : undefined}
      >
        <span className="link-icon" aria-hidden="true">
          {item.icon}
        </span>
        <div className="link-content">
          <span className="link-label">{sanitizeText(item.label)}</span>
          <span
            className={`link-desc ${hoveredNav === item.label ? "visible" : ""}`}
            aria-hidden={hoveredNav !== item.label}
          >
            {sanitizeText(item.desc)}
          </span>
        </div>
        <span className="link-arrow" aria-hidden="true">
          →
        </span>
        <span className="link-glow" aria-hidden="true" />
      </NavLink>
    </li>
  );
};

interface SocialLinkItemProps {
  social: SocialLink;
  index: number;
  hoveredSocial: string | null;
  onMouseEnter: (name: string) => void;
  onMouseLeave: () => void;
}

const SocialLinkItem: React.FC<SocialLinkItemProps> = ({
  social,
  index,
  hoveredSocial,
  onMouseEnter,
  onMouseLeave,
}) => {
  const validUrl = getValidUrl(social.url);
  const isHovered = hoveredSocial === social.name;

  return (
    <a
      key={social.name}
      href={validUrl}
      target={validUrl.startsWith("mailto:") ? undefined : "_blank"}
      rel={validUrl.startsWith("mailto:") ? undefined : "noopener noreferrer"}
      className="social-link"
      style={{
        "--social-color": social.color,
        animationDelay: `${index * 75}ms`,
      } as React.CSSProperties}
      onMouseEnter={() => onMouseEnter(social.name)}
      onMouseLeave={onMouseLeave}
      aria-label={`Visit ${sanitizeText(social.name)}`}
    >
      <span
        className="social-icon"
        style={{
          background: isHovered ? `${social.color}30` : "rgba(255,255,255,0.05)",
          borderColor: isHovered ? social.color : "rgba(255,255,255,0.1)",
        }}
        aria-hidden="true"
      >
        {social.icon}
      </span>
      <span className="social-name">{sanitizeText(social.name)}</span>
      <span
        className="social-glow"
        style={{ background: social.color }}
        aria-hidden="true"
      />
    </a>
  );
};

// ============================================
// MAIN FOOTER COMPONENT
// ============================================
const Footer: React.FC = () => {
  // State Management
  const [isVisible, setIsVisible] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  // Refs
  const footerRef = useRef<HTMLElement>(null);
  const location = useLocation();

  // Memoized Values
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const memoizedNavItems = useMemo(() => NAV_ITEMS, []);
  const memoizedSocialLinks = useMemo(() => SOCIAL_LINKS, []);

  // SECURITY: Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // SECURITY: Passive scroll listener for performance
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // SECURITY: Mouse position tracking with bounds checking
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!footerRef.current) return;

    const rect = footerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

    setMousePos({ x, y });
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <footer
      ref={footerRef}
      className={`footer ${isVisible ? "visible" : ""}`}
      onMouseMove={handleMouseMove}
      role="contentinfo"
    >
      {/* Dynamic Background */}
      <div className="footer-bg" aria-hidden="true">
        <div
          className="gradient-orb orb-1"
          style={{
            transform: `translate(${Math.max(-10, Math.min(10, mousePos.x * 0.05))}px, ${Math.max(-10, Math.min(10, mousePos.y * 0.05))}px)`,
          }}
        />
        <div
          className="gradient-orb orb-2"
          style={{
            transform: `translate(${Math.max(-10, Math.min(10, -mousePos.x * 0.08))}px, ${Math.max(-10, Math.min(10, -mousePos.y * 0.08))}px)`,
          }}
        />
        <div className="gradient-mesh" />
      </div>

      {/* Grid Pattern */}
      <div className="footer-grid" aria-hidden="true" />

      {/* Top Wave Separator */}
      <div className="wave-separator" aria-hidden="true">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF6B9D" />
              <stop offset="50%" stopColor="#4ECDC4" />
              <stop offset="100%" stopColor="#917FB3" />
            </linearGradient>
          </defs>
          <path
            d="M0,50 C360,100 1080,0 1440,50 L1440,100 L0,100 Z"
            fill="url(#waveGradient)"
            opacity="0.1"
          />
        </svg>
      </div>

      <div className="footer-container">
        {/* Main Grid */}
        <div className="footer-main">
          {/* Brand Column */}
          <div className="footer-brand">
            <div className="brand-header">
              <div className="brand-orbit" aria-hidden="true">
                <span className="orbit-core">✦</span>
                <div className="orbit-ring" />
              </div>
              <div className="brand-text">
                <span className="brand-name">Tomesh</span>
                <span className="brand-tagline">Creative Engineer</span>
              </div>
            </div>

            <p className="brand-message">
              Designing and engineering meaningful digital experiences that
              <span className="message-highlight"> connect</span>,
              <span className="message-highlight"> inspire</span>, and
              <span className="message-highlight"> endure</span>.
            </p>

            {/* Dialog */}
            <div className="footer-dialog" aria-hidden="true">
              <span className="dialog-icon">🎯</span>
              <p>"Every ending is a new beginning. Let's write the next chapter together."</p>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="footer-nav">
            <h3 className="column-title">
              <span className="title-icon" aria-hidden="true">
                🧭
              </span>
              Explore
            </h3>
            <nav aria-label="Footer navigation">
              <ul className="nav-list">
                {memoizedNavItems.map((item, index) => (
                  <NavLinkItem
                    key={item.path}
                    item={item}
                    index={index}
                    isActive={location.pathname === item.path}
                    hoveredNav={hoveredNav}
                    onMouseEnter={setHoveredNav}
                    onMouseLeave={() => setHoveredNav(null)}
                  />
                ))}
              </ul>
            </nav>
          </div>

          {/* Connect Column */}
          <div className="footer-connect">
            <h3 className="column-title">
              <span className="title-icon" aria-hidden="true">
                🤝
              </span>
              Connect
            </h3>

            <div className="social-grid" role="list">
              {memoizedSocialLinks.map((social, index) => (
                <div key={social.name} role="listitem">
                  <SocialLinkItem
                    social={social}
                    index={index}
                    hoveredSocial={hoveredSocial}
                    onMouseEnter={setHoveredSocial}
                    onMouseLeave={() => setHoveredSocial(null)}
                  />
                </div>
              ))}
            </div>

            {/* Email CTA */}
            <a
              href={getValidUrl("mailto:tomeshdhongade@gmail.com")}
              className="email-cta"
              aria-label="Send email to Tomesh"
            >
              <div className="email-icon" aria-hidden="true">
                💬
              </div>
              <div className="email-content">
                <span className="email-label">Say hello</span>
                <span className="email-address">tomeshdhongade@gmail.com</span>
              </div>
              <span className="email-arrow" aria-hidden="true">
                →
              </span>
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="footer-divider" aria-hidden="true">
          <div className="divider-line" />
          <div className="divider-glow" />
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="copyright">
            <span className="copyright-icon" aria-hidden="true">
              ©
            </span>
            <span>{currentYear} Tomesh. Crafted with</span>
            <span className="heart-icon" aria-hidden="true">
              💜
            </span>
            <span>and curiosity.</span>
          </div>

          <div className="footer-meta">
            <span className="location" aria-hidden="true">
              📍 Based in the cloud
            </span>
            <span className="separator" aria-hidden="true">
              •
            </span>
            <span className="status">Always learning</span>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        className={`back-to-top ${showBackToTop ? "visible" : ""}`}
        onClick={scrollToTop}
        aria-label="Scroll to top of page"
      >
        <div className="top-glow" aria-hidden="true" />
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
    

      <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300 ;400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');

  /* CSS VARIABLES - ADD THIS ENTIRE BLOCK */
  :root {
    /* Dark Mode (Default) - Your existing colors mapped to variables */
    --footer-bg-start: #0a0a1a;
    --footer-bg-end: #050510;
    --footer-text-primary: #FBEAEB;
    --footer-text-secondary: rgba(251, 234, 235, 0.8);
    --footer-text-muted: rgba(251, 234, 235, 0.7);
    --footer-text-subtle: rgba(251, 234, 235, 0.6);
    --footer-text-faint: rgba(251, 234, 235, 0.5);
    --footer-text-ghost: rgba(251, 234, 235, 0.4);
    --footer-text-trace: rgba(251, 234, 235, 0.2);
    --footer-card-bg: rgba(255, 255, 255, 0.05);
    --footer-card-border: rgba(255, 255, 255, 0.1);
    --footer-card-border-hover: rgba(255, 255, 255, 0.08);
    --footer-accent-1: #917FB3;
    --footer-accent-2: #4ECDC4;
    --footer-highlight: #F8B500;
    --footer-heart: #FF6B9D;
    --footer-grid-line: rgba(255, 255, 255, 0.02);
    --footer-orb-1: #917FB3;
    --footer-orb-2: #4ECDC4;
    --footer-shadow: rgba(145, 127, 179, 0.3);
    --footer-orbit-ring: rgba(145, 127, 179, 0.3);
    --footer-divider-glow: rgba(145, 127, 179, 0.3);
    --footer-top-bg: rgba(145, 127, 179, 0.2);
    --footer-top-border: rgba(145, 127, 179, 0.3);
  }

  /* Light Mode - Country Garden Palette - ADD THIS ENTIRE BLOCK */
  [data-theme="light"] {
    --footer-bg-start: #FBF4F6;
    --footer-bg-end: #F5E8EC;
    --footer-text-primary: #2F2C4F;
    --footer-text-secondary: #6B5E7A;
    --footer-text-muted: #6B5E7A;
    --footer-text-subtle: #8B7D9A;
    --footer-text-faint: #A99DB5;
    --footer-text-ghost: #C4B8CF;
    --footer-text-trace: #E0D5E5;
    --footer-card-bg: #FFFFFF;
    --footer-card-border: rgba(155, 110, 243, 0.15);
    --footer-card-border-hover: rgba(155, 110, 243, 0.25);
    --footer-accent-1: #9B6EF3;
    --footer-accent-2: #B8A0E0;
    --footer-highlight: #9B6EF3;
    --footer-heart: #E91E63;
    --footer-grid-line: rgba(47, 44, 79, 0.04);
    --footer-orb-1: #E8D5F0;
    --footer-orb-2: #D5E8F0;
    --footer-shadow: rgba(155, 110, 243, 0.2);
    --footer-orbit-ring: rgba(155, 110, 243, 0.3);
    --footer-divider-glow: rgba(155, 110, 243, 0.4);
    --footer-top-bg: rgba(155, 110, 243, 0.1);
    --footer-top-border: rgba(155, 110, 243, 0.3);
  }
  /* END ADD BLOCK */

        // .footer {
        //   width: 100%;
        //   position: relative;
        //   background: linear-gradient(180deg, #0a0a1a 0%, #050510 100%);
        //   padding: 6rem 1.5rem 2rem;
        //   margin-top: 4rem;
        //   border-radius: 40px 40px 0 0;
        //   overflow: hidden;
        //   opacity: 0;
        //   transform: translateY(30px);
        //   transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        //   box-sizing: border-box;
        // }

        .footer {
          width: 100%;
          position: relative;
          background: linear-gradient(180deg, var(--footer-bg-start) 0%, var(--footer-bg-end) 100%);
          padding: 6rem 1.5rem 2rem;
          // margin-top: 4rem;
          border-radius: 40px 40px 0 0;
          overflow: hidden;
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-sizing: border-box;
        }
        
        [data-theme="light"] .footer {
          box-shadow: 0 -20px 60px rgba(155, 110, 243, 0.1);
        }

        .footer.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Background */
        .footer-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.3;
          transition: transform 0.3s ease-out;
        }

        // .orb-1 {
        //   width: 500px;
        //   height: 500px;
        //   background: radial-gradient(circle, #917FB3 0%, transparent 70%);
        //   top: -20%;
        //   left: -10%;
        //   animation: orbFloat 20s ease-in-out infinite;
        // }

        // .orb-2 {
        //   width: 400px;
        //   height: 400px;
        //   background: radial-gradient(circle, #4ECDC4 0%, transparent 70%);
        //   bottom: -10%;
        //   right: -5%;
        //   animation: orbFloat 25s ease-in-out infinite reverse;
        // }
        
        .orb-1 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, var(--footer-orb-1) 0%, transparent 70%);
          top: -20%;
          left: -10%;
          animation: orbFloat 20s ease-in-out infinite;
        }
        
        .orb-2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, var(--footer-orb-2) 0%, transparent 70%);
          bottom: -10%;
          right: -5%;
          animation: orbFloat 25s ease-in-out infinite reverse;
        }
        
        [data-theme="light"] .gradient-orb {
          opacity: 0.4;
          filter: blur(80px);
        }
        
        [data-theme="light"] .orb-1 {
          background: radial-gradient(circle, #E8D5F0 0%, transparent 70%);
        }
        
        [data-theme="light"] .orb-2 {
          background: radial-gradient(circle, #D5F0E8 0%, transparent 70%);
        }
    

        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(1.1); }
        }

        .gradient-mesh {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse at 30% 20%, rgba(145, 127, 179, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(78, 205, 196, 0.08) 0%, transparent 50%);
        }

        /* Grid */
        // .footer-grid {
        //   position: absolute;
        //   inset: 0;
        //   background-image: 
        //     linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        //     linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
        //   background-size: 50px 50px;
        //   pointer-events: none;
        // }

        /* Grid */
.footer-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(var(--footer-grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--footer-grid-line) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
}

        /* Wave Separator */
        .wave-separator {
          position: absolute;
          top: -50px;
          left: 0;
          right: 0;
          height: 100px;
          overflow: hidden;
        }

        .wave-separator svg {
          width: 100%;
          height: 100%;
          animation: waveShift 20s ease-in-out infinite;
        }

        @keyframes waveShift {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-5%); }
        }

        /* Container */
        .footer-container {
          max-width: 1100px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        /* Main Grid */
        .footer-main {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          margin-bottom: 3rem;
        }

        /* Brand Column */
        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .brand-header {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .brand-orbit {
          position: relative;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        // .orbit-core {
        //   width: 40px;
        //   height: 40px;
        //   background: linear-gradient(135deg, #917FB3 0%, #4ECDC4 100%);
        //   border-radius: 50%;
        //   display: flex;
        //   align-items: center;
        //   justify-content: center;
        //   font-size: 1.25rem;
        //   position: relative;
        //   z-index: 2;
        //   animation: corePulse 3s ease-in-out infinite;
        // }

        .orbit-core {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, var(--footer-accent-1) 0%, var(--footer-accent-2) 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          position: relative;
          z-index: 2;
          animation: corePulse 3s ease-in-out infinite;
        }
        
        [data-theme="light"] .orbit-core {
          background: linear-gradient(135deg, #9B6EF3 0%, #B8A0E0 100%);
          box-shadow: 0 4px 15px rgba(155, 110, 243, 0.3);
        }

        @keyframes corePulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(145, 127, 179, 0.4); }
          50% { transform: scale(1.05); box-shadow: 0 0 20px 10px rgba(145, 127, 179, 0); }
        }

        // .orbit-ring {
        //   position: absolute;
        //   inset: -5px;
        //   border: 1px solid rgba(145, 127, 179, 0.3);
        //   border-radius: 50%;
        //   animation: ringRotate 8s linear infinite;
        // }

        .orbit-ring {
          position: absolute;
          inset: -5px;
          border: 1px solid var(--footer-orbit-ring);
          border-radius: 50%;
          animation: ringRotate 8s linear infinite;
        }

        @keyframes ringRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .brand-text {
          display: flex;
          flex-direction: column;
        }

        // .brand-name {
        //   font-family: 'Space Grotesk', sans-serif;
        //   font-size: 1.5rem;
        //   font-weight: 700;
        //   color: #FBEAEB;
        //   letter-spacing: -0.02em;
        // }

        .brand-name {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--footer-text-primary);
          letter-spacing: -0.02em;
        }
        
        [data-theme="light"] .brand-name {
          background: linear-gradient(135deg, #2F2C4F 0%, #9B6EF3 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 800;
        }

        // .brand-tagline {
        //   font-size: 0.875rem;
        //   color: rgba(251, 234, 235, 0.6);
        //   font-weight: 500;
        // }

        .brand-tagline {
          font-size: 0.875rem;
          color: var(--footer-text-subtle);
          font-weight: 500;
        }

        // .brand-message {
        //   font-size: 1.125rem;
        //   line-height: 1.8;
        //   color: rgba(251, 234, 235, 0.8);
        //   max-width: 400px;
        // }

        .brand-message {
          font-size: 1.125rem;
          line-height: 1.8;
          color: var(--footer-text-secondary);
          max-width: 400px;
        }

        // .message-highlight {
        //   color: #F8B500;
        //   font-weight: 600;
        //   position: relative;
        // }

        // .message-highlight::after {
        //   content: '';
        //   position: absolute;
        //   bottom: -2px;
        //   left: 0;
        //   width: 100%;
        //   height: 2px;
        //   background: #F8B500;
        //   transform: scaleX(0);
        //   transition: transform 0.3s ease;
        // }

        .message-highlight {
          color: var(--footer-highlight);
          font-weight: 600;
          position: relative;
        }
        
        .message-highlight::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 2px;
          background: var(--footer-highlight);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .footer-brand:hover .message-highlight::after {
          transform: scaleX(1);
        }

        /* Dialog */
        // .footer-dialog {
        //   display: flex;
        //   align-items: flex-start;
        //   gap: 0.75rem;
        //   padding: 1rem 1.25rem;
        //   background: rgba(255, 255, 255, 0.05);
        //   border: 1px solid rgba(255, 255, 255, 0.1);
        //   border-radius: 16px;
        //   margin-top: 0.5rem;
        // }

        .footer-dialog {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          background: var(--footer-card-bg);
          border: 1px solid var(--footer-card-border);
          border-radius: 16px;
          margin-top: 0.5rem;
          transition: all 0.3s ease;
        }
        
        [data-theme="light"] .footer-dialog {
          box-shadow: 0 4px 20px rgba(155, 110, 243, 0.08);
        }

        .dialog-icon {
          font-size: 1.25rem;
          animation: targetPulse 2s ease-in-out infinite;
        }

        @keyframes targetPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        // .footer-dialog p {
        //   font-size: 0.9375rem;
        //   color: rgba(251, 234, 235, 0.7);
        //   font-style: italic;
        //   line-height: 1.6;
        //   margin: 0;
        // }

        .footer-dialog p {
          font-size: 0.9375rem;
          color: var(--footer-text-muted);
          font-style: italic;
          line-height: 1.6;
          margin: 0;
        }

        /* Navigation Column */
        .footer-nav {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        // .column-title {
        //   display: flex;
        //   align-items: center;
        //   gap: 0.5rem;
        //   font-size: 1.125rem;
        //   font-weight: 700;
        //   color: #FBEAEB;
        //   margin: 0;
        // }

        .column-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--footer-text-primary);
          margin: 0;
        }
        
        [data-theme="light"] .column-title {
          color: #2F2C4F;
          font-weight: 800;
        }

        .title-icon {
          font-size: 1.25rem;
        }

        .nav-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav-item {
          opacity: 0;
          transform: translateX(-20px);
          animation: slideIn 0.5s ease forwards;
        }

        @keyframes slideIn {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        // .nav-link {
        //   display: flex;
        //   align-items: center;
        //   gap: 0.75rem;
        //   padding: 0.875rem 1rem;
        //   color: rgba(251, 234, 235, 0.7);
        //   text-decoration: none;
        //   border-radius: 12px;
        //   transition: all 0.3s ease;
        //   position: relative;
        //   overflow: hidden;
        // }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          color: var(--footer-text-muted);
          text-decoration: none;
          border-radius: 12px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }


        .nav-link::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, var(--link-color) 0%, transparent 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        // .nav-link:hover,
        // .nav-link.active {
        //   color: var(--link-color);
        //   background: rgba(255, 255, 255, 0.05);
        // }

        .nav-link:hover,
.nav-link.active {
  color: var(--link-color);
  background: rgba(155, 110, 243, 0.05);
}

[data-theme="light"] .nav-link:hover,
[data-theme="light"] .nav-link.active {
  background: rgba(155, 110, 243, 0.08);
}

        .nav-link:hover::before,
        .nav-link.active::before {
          opacity: 0.1;
        }

        .link-icon {
          font-size: 1.25rem;
          transition: transform 0.3s ease;
        }

        .nav-link:hover .link-icon {
          transform: scale(1.2) rotate(-5deg);
        }

        .link-content {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .link-label {
          font-weight: 600;
          font-size: 1rem;
        }

        // .link-desc {
        //   font-size: 0.8125rem;
        //   color: rgba(251, 234, 235, 0.5);
        //   opacity: 0;
        //   transform: translateY(-5px);
        //   transition: all 0.3s ease;
        // }

        .link-desc {
          font-size: 0.8125rem;
          color: var(--footer-text-faint);
          opacity: 0;
          transform: translateY(-5px);
          transition: all 0.3s ease;
        }

        .link-desc.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .link-arrow {
          opacity: 0;
          transform: translateX(-10px);
          transition: all 0.3s ease;
          color: var(--link-color);
        }

        .nav-link:hover .link-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        .link-glow {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 0;
          height: 2px;
          background: var(--link-color);
          transition: width 0.3s ease;
          box-shadow: 0 0 10px var(--link-color);
        }

        .nav-link:hover .link-glow,
        .nav-link.active .link-glow {
          width: 100%;
        }

        /* Connect Column */
        .footer-connect {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .social-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }

        // .social-link {
        //   display: flex;
        //   align-items: center;
        //   gap: 0.75rem;
        //   padding: 0.875rem 1rem;
        //   background: rgba(255, 255, 255, 0.03);
        //   border: 1px solid rgba(255, 255, 255, 0.08);
        //   border-radius: 12px;
        //   text-decoration: none;
        //   color: rgba(251, 234, 235, 0.8);
        //   transition: all 0.3s ease;
        //   position: relative;
        //   overflow: hidden;
        //   opacity: 0;
        //   transform: translateY(20px);
        //   animation: popIn 0.5s ease forwards;
        // }

        .social-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          background: var(--footer-card-bg);
          border: 1px solid var(--footer-card-border-hover);
          border-radius: 12px;
          text-decoration: none;
          color: var(--footer-text-secondary);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          opacity: 0;
          transform: translateY(20px);
          animation: popIn 0.5s ease forwards;
        }
        
        [data-theme="light"] .social-link {
          box-shadow: 0 2px 10px rgba(155, 110, 243, 0.06);
        }
        
        [data-theme="light"] .social-link:hover {
          box-shadow: 0 8px 25px rgba(155, 110, 243, 0.12);
          transform: translateY(-3px);
        }

        @keyframes popIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .social-link:hover {
          transform: translateY(-3px);
          border-color: var(--social-color);
          color: var(--social-color);
        }

        .social-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          border: 1px solid;
          transition: all 0.3s ease;
        }

        .social-name {
          font-weight: 600;
          font-size: 0.9375rem;
        }

        .social-glow {
          position: absolute;
          inset: -2px;
          border-radius: 14px;
          opacity: 0;
          filter: blur(8px);
          transition: opacity 0.3s ease;
          z-index: -1;
        }

        .social-link:hover .social-glow {
          opacity: 0.5;
        }

        /* Email CTA */
        // .email-cta {
        //   display: flex;
        //   align-items: center;
        //   gap: 1rem;
        //   padding: 1.25rem;
        //   background: linear-gradient(135deg, rgba(145, 127, 179, 0.1) 0%, rgba(78, 205, 196, 0.1) 100%);
        //   border: 1px solid rgba(145, 127, 179, 0.2);
        //   border-radius: 16px;
        //   text-decoration: none;
        //   color: #FBEAEB;
        //   transition: all 0.3s ease;
        //   margin-top: 0.5rem;
        // }

        .email-cta {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem;
          background: linear-gradient(135deg, rgba(155, 110, 243, 0.08) 0%, rgba(184, 160, 224, 0.08) 100%);
          border: 1px solid rgba(155, 110, 243, 0.2);
          border-radius: 16px;
          text-decoration: none;
          color: var(--footer-text-primary);
          transition: all 0.3s ease;
          margin-top: 0.5rem;
        }
        
        [data-theme="light"] .email-cta {
          background: linear-gradient(135deg, rgba(155, 110, 243, 0.1) 0%, rgba(184, 160, 224, 0.1) 100%);
          border: 1px solid rgba(155, 110, 243, 0.25);
          box-shadow: 0 4px 20px rgba(155, 110, 243, 0.08);
        }
        
        [data-theme="light"] .email-cta:hover {
          box-shadow: 0 10px 30px -10px rgba(155, 110, 243, 0.2);
        }

        .email-cta:hover {
          transform: translateY(-3px);
          border-color: rgba(145, 127, 179, 0.4);
          box-shadow: 0 10px 30px -10px rgba(145, 127, 179, 0.3);
        }

        // .email-icon {
        //   width: 48px;
        //   height: 48px;
        //   background: linear-gradient(135deg, #917FB3 0%, #4ECDC4 100%);
        //   border-radius: 12px;
        //   display: flex;
        //   align-items: center;
        //   justify-content: center;
        //   font-size: 1.5rem;
        // }

        .email-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, var(--footer-accent-1) 0%, var(--footer-accent-2) 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }
        
        [data-theme="light"] .email-icon {
          background: linear-gradient(135deg, #9B6EF3 0%, #B8A0E0 100%);
          box-shadow: 0 4px 15px rgba(155, 110, 243, 0.25);
        }

        .email-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        // .email-label {
        //   font-size: 0.875rem;
        //   color: rgba(251, 234, 235, 0.6);
        // }

        .email-label {
          font-size: 0.875rem;
          color: var(--footer-text-subtle);
        }

        .email-address {
          font-weight: 600;
          font-size: 1rem;
        }

        .email-arrow {
          font-size: 1.25rem;
          opacity: 0;
          transform: translateX(-10px);
          transition: all 0.3s ease;
        }

        .email-cta:hover .email-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        /* Divider */
        .footer-divider {
          position: relative;
          margin: 3rem 0;
        }

        // .divider-line {
        //   height: 1px;
        //   background: linear-gradient(90deg, transparent, rgba(145, 127, 179, 0.3), transparent);
        // }

        .divider-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--footer-divider-glow), transparent);
        }

        // .divider-glow {
        //   position: absolute;
        //   top: 50%;
        //   left: 50%;
        //   transform: translate(-50%, -50%);
        //   width: 200px;
        //   height: 4px;
        //   background: radial-gradient(ellipse, rgba(145, 127, 179, 0.4) 0%, transparent 70%);
        //   filter: blur(4px);
        //   animation: glowPulse 3s ease-in-out infinite;
        // }

        .divider-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 200px;
          height: 4px;
          background: radial-gradient(ellipse, var(--footer-divider-glow) 0%, transparent 70%);
          filter: blur(4px);
          animation: glowPulse 3s ease-in-out infinite;
        }

        @keyframes glowPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        /* Bottom Bar */
        .footer-bottom {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          text-align: center;
          opacity: 0;
          animation: fadeIn 0.8s ease 0.5s forwards;
        }

        @keyframes fadeIn {
          to { opacity: 1; }
        }

        // .copyright {
        //   display: flex;
        //   align-items: center;
        //   gap: 0.5rem;
        //   font-size: 0.9375rem;
        //   color: rgba(251, 234, 235, 0.6);
        //   flex-wrap: wrap;
        //   justify-content: center;
        // }

        .copyright {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9375rem;
          color: var(--footer-text-subtle);
          flex-wrap: wrap;
          justify-content: center;
        }

        .copyright-icon {
          font-size: 1rem;
        }

        // .heart-icon {
        //   color: #FF6B9D;
        //   animation: heartbeat 1.5s ease-in-out infinite;
        // }

        .heart-icon {
          color: var(--footer-heart);
          animation: heartbeat 1.5s ease-in-out infinite;
        }

        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        // .footer-meta {
        //   display: flex;
        //   align-items: center;
        //   gap: 0.75rem;
        //   font-size: 0.875rem;
        //   color: rgba(251, 234, 235, 0.4);
        // }

        .footer-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.875rem;
          color: var(--footer-text-ghost);
        }

        // .separator {
        //   color: rgba(251, 234, 235, 0.2);
        // }

        .separator {
          color: var(--footer-text-trace);
        }

        /* Back to Top */
        // .back-to-top {
        //   position: fixed;
        //   bottom: 2rem;
        //   right: 2rem;
        //   width: 56px;
        //   height: 56px;
        //   background: rgba(145, 127, 179, 0.2);
        //   border: 1px solid rgba(145, 127, 179, 0.3);
        //   border-radius: 50%;
        //   display: flex;
        //   align-items: center;
        //   justify-content: center;
        //   color: #FBEAEB;
        //   cursor: pointer;
        //   opacity: 0;
        //   transform: translateY(20px) scale(0.8);
        //   transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        //   z-index: 100;
        //   backdrop-filter: blur(10px);
        // }

        .back-to-top {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 56px;
          height: 56px;
          background: var(--footer-top-bg);
          border: 1px solid var(--footer-top-border);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--footer-text-primary);
          cursor: pointer;
          opacity: 0;
          transform: translateY(20px) scale(0.8);
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 100;
          backdrop-filter: blur(10px);
        }
        
        [data-theme="light"] .back-to-top {
          box-shadow: 0 4px 20px rgba(155, 110, 243, 0.15);
        }
        
        [data-theme="light"] .back-to-top:hover {
          box-shadow: 0 10px 30px -10px rgba(155, 110, 243, 0.3);
        }

        .back-to-top.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .back-to-top:hover {
          transform: translateY(-5px) scale(1.1);
          background: rgba(145, 127, 179, 0.3);
          border-color: rgba(145, 127, 179, 0.5);
          box-shadow: 0 10px 30px -10px rgba(145, 127, 179, 0.5);
        }

        // .top-glow {
        //   position: absolute;
        //   inset: -4px;
        //   border-radius: 50%;
        //   background: linear-gradient(135deg, #917FB3, #4ECDC4);
        //   opacity: 0;
        //   filter: blur(8px);
        //   transition: opacity 0.3s;
        //   z-index: -1;
        // }

        .top-glow {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--footer-accent-1), var(--footer-accent-2));
          opacity: 0;
          filter: blur(8px);
          transition: opacity 0.3s;
          z-index: -1;
        }
        
        [data-theme="light"] .top-glow {
          background: linear-gradient(135deg, #9B6EF3, #B8A0E0);
        }

        .back-to-top:hover .top-glow {
          opacity: 0.6;
        }

        /* Desktop Layout */
        @media (min-width: 968px) {
          .footer {
            padding: 8rem 2rem 3rem;
            border-radius: 60px 60px 0 0;
          }

          .footer-main {
            grid-template-columns: 1.2fr 1fr 1fr;
            gap: 4rem;
          }

          .social-grid {
            grid-template-columns: 1fr;
          }

          .footer-bottom {
            flex-direction: row;
            justify-content: space-between;
          }

          .back-to-top {
            bottom: 3rem;
            right: 3rem;
          }
        }

        @media (max-width: 480px) {
          .footer {
            padding: 4rem 1.25rem 2rem;
            border-radius: 24px 24px 0 0;
          }

          .brand-message {
            font-size: 1rem;
          }

          .social-grid {
            grid-template-columns: 1fr;
          }

          .footer-dialog {
            flex-direction: column;
            text-align: center;
          }

          .back-to-top {
            width: 48px;
            height: 48px;
            bottom: 1.5rem;
            right: 1.5rem;
          }
        }

        /* Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }


        /* Light Mode Premium Enhancements */
  [data-theme="light"] .footer-container {
    max-width: 1100px;
    margin: 0 auto;
  }

  [data-theme="light"] .gradient-mesh {
    background: 
      radial-gradient(ellipse at 30% 20%, rgba(155, 110, 243, 0.08) 0%, transparent 50%),
      radial-gradient(ellipse at 70% 80%, rgba(184, 160, 224, 0.06) 0%, transparent 50%);
  }

  /* Enhanced card backgrounds in light mode */
  [data-theme="light"] .footer-dialog,
  [data-theme="light"] .social-link {
    background: #FFFFFF;
  }

  /* Smooth theme transition for all elements */
  .footer,
  .footer-dialog,
  .social-link,
  .email-cta,
  .nav-link,
  .brand-name,
  .brand-tagline,
  .brand-message,
  .column-title,
  .copyright,
  .footer-meta {
    transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
  }

  /* Respect reduced motion */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* Enhanced mobile experience for light mode */
  @media (max-width: 968px) {
    [data-theme="light"] .footer {
      padding: 4rem 1.5rem 2rem;
      border-radius: 30px 30px 0 0;
    }
  }

  @media (max-width: 480px) {
    [data-theme="light"] .footer {
      padding: 3rem 1.25rem 2rem;
      border-radius: 24px 24px 0 0;
    }

    [data-theme="light"] .brand-name {
      font-size: 1.25rem;
    }

    [data-theme="light"] .social-grid {
      grid-template-columns: 1fr;
    }
  }
`}</style>
    </footer>
  );
};

export default Footer;