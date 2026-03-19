import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Footer from "../components/layout/Footer";

// ============================================
// SECURITY: Input sanitization utility
// ============================================
const sanitizeInput = (input: string): string => {
  // Remove dangerous characters and limit length
  return input
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
    .trim()
    .slice(0, 1000); // Max 1000 chars per field
};

// ============================================
// SECURITY: Email validation
// ============================================
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254; // RFC 5321
};

// ============================================
// SECURITY: Rate limiting with localStorage
// ============================================
class RateLimiter {
  private static readonly ATTEMPTS_KEY = 'contact_form_attempts';
  private static readonly COOLDOWN_MS = 5000; // 5 seconds between attempts
  private static readonly MAX_ATTEMPTS = 5; // Max 5 attempts
  private static readonly WINDOW_MS = 3600000; // 1 hour window

  static canSubmit(): { allowed: boolean; message?: string } {
    try {
      const stored = localStorage.getItem(this.ATTEMPTS_KEY);
      const now = Date.now();
      
      let attempts = stored ? JSON.parse(stored) : [];
      
      // Filter out attempts outside the window
      attempts = attempts.filter((time: number) => now - time < this.WINDOW_MS);

      if (attempts.length >= this.MAX_ATTEMPTS) {
        const oldestAttempt = Math.min(...attempts);
        const retryAfter = Math.ceil((this.WINDOW_MS - (now - oldestAttempt)) / 1000);
        return {
          allowed: false,
          message: `Too many attempts. Please try again in ${retryAfter} seconds.`,
        };
      }

      // Check cooldown between attempts
      if (attempts.length > 0) {
        const lastAttempt = Math.max(...attempts);
        if (now - lastAttempt < this.COOLDOWN_MS) {
          const waitTime = Math.ceil((this.COOLDOWN_MS - (now - lastAttempt)) / 1000);
          return {
            allowed: false,
            message: `Please wait ${waitTime} seconds before trying again.`,
          };
        }
      }

      return { allowed: true };
    } catch {
      // If localStorage fails, allow submission (don't break UX)
      return { allowed: true };
    }
  }

  static recordAttempt(): void {
    try {
      const stored = localStorage.getItem(this.ATTEMPTS_KEY);
      const attempts = stored ? JSON.parse(stored) : [];
      attempts.push(Date.now());
      localStorage.setItem(this.ATTEMPTS_KEY, JSON.stringify(attempts));
    } catch {
      // Silently fail if localStorage is unavailable
    }
  }
}

// ============================================
// TYPES
// ============================================
interface ConnectionMethod {
  id: number;
  title: string;
  description: string;
  icon: string;
  action: string;
  link: string;
  color: string;
  availability: string;
}

interface FormData {
  name: string;
  email: string;
  message: string;
}

// ============================================
// DATA (Immutable)
// ============================================
const CONNECTION_METHODS: ConnectionMethod[] = [
  {
    id: 1,
    title: "Project Inquiry",
    description: "Have a vision that needs bringing to life? Let's architect something extraordinary together.",
    icon: "🚀",
    action: "Start a Project",
    link: "mailto:tomeshdhongade@gmail.com?subject=Project%20Inquiry",
    color: "#FF6B9D",
    availability: "Typically responds in 2-4 hours",
  },
  {
    id: 2,
    title: "Coffee Chat",
    description: "No agenda, just curiosity. Let's talk tech, design, or your favorite indie game.",
    icon: "☕",
    action: "Grab Virtual Coffee",
    link: "mailto:tomeshdhongade@gmail.com?subject=Coffee%20Chat",
    color: "#F8B500",
    availability: "Available Tue-Thu afternoons",
  },
  {
    id: 3,
    title: "Career Opportunity",
    description: "Looking for someone who codes with both logic and soul? Let's explore the fit.",
    icon: "💼",
    action: "Discuss Opportunities",
    link: "mailto:tomeshdhongade@gmail.com?subject=Career%20Opportunity",
    color: "#4ECDC4",
    availability: "Open to exciting roles",
  },
  {
    id: 4,
    title: "Mentorship",
    description: "Stuck on a bug? Navigating your dev journey? I've been there—let's figure it out.",
    icon: "🌱",
    action: "Ask for Guidance",
    link: "mailto:tomeshdhongade@gmail.com?subject=Mentorship",
    color: "#917FB3",
    availability: "1-2 sessions per month",
  },
];

const SOCIAL_LINKS = [
  { name: "GitHub", icon: "⚡", url: "https://github.com/Tomesh7843021651", color: "#6e5494" },
  { name: "LinkedIn", icon: "💼", url: "https://www.linkedin.com/in/tomesh-dhongade-168524191/", color: "#0077b5" },
  { name: "Instagram", icon: "🐦", url: "https://www.instagram.com/tomeshdhongade143/", color: "#1da1f2" },
];

// ============================================
// COMPONENTS
// ============================================

const FloatingHeart: React.FC<{ delay: number; x: number }> = ({ delay, x }) => (
  <div
    className="floating-heart"
    style={{
      left: `${x}%`,
      animationDelay: `${delay}s`,
    }}
    aria-hidden="true"
  >
    💌
  </div>
);

const SparkleField: React.FC = () => (
  <div className="sparkle-field" aria-hidden="true">
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className="sparkle"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${2 + Math.random() * 2}s`,
        }}
      />
    ))}
  </div>
);

// ============================================
// MAIN CONTACT COMPONENT
// ============================================
const Contact: React.FC = () => {
  // State management
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [formData, setFormData] = useState<FormData>({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [rateLimitError, setRateLimitError] = useState("");
  
  // Refs
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  // SECURITY: Intersection Observer for animation (same as original)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-animate");
            if (id) {
              setVisibleElements((prev) => new Set([...prev, id]));
            }
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -50px 0px" }
    );

    const elements = sectionRef.current?.querySelectorAll("[data-animate]");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // SECURITY: Mouse position tracking with bounds checking
  const handleMouseMove = useCallback((e: React.MouseEvent, index: number) => {
    const card = cardRefs.current[index];
    if (!card) return;
    
    const rect = card.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    
    setMousePos({ x, y });
  }, []);

  // SECURITY: Form validation and sanitization
  const validateForm = (data: FormData): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!data.name.trim()) {
      errors.push("Name is required");
    } else if (data.name.trim().length < 2) {
      errors.push("Name must be at least 2 characters");
    } else if (data.name.trim().length > 100) {
      errors.push("Name must be less than 100 characters");
    }

    if (!data.email.trim()) {
      errors.push("Email is required");
    } else if (!isValidEmail(data.email.trim())) {
      errors.push("Please enter a valid email address");
    }

    if (!data.message.trim()) {
      errors.push("Message is required");
    } else if (data.message.trim().length < 10) {
      errors.push("Message must be at least 10 characters");
    } else if (data.message.trim().length > 5000) {
      errors.push("Message must be less than 5000 characters");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  };

  // SECURITY: Form submission with sanitization and rate limiting
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setRateLimitError("");

    // SECURITY: Rate limiting check
    const rateLimitCheck = RateLimiter.canSubmit();
    if (!rateLimitCheck.allowed) {
      setRateLimitError(rateLimitCheck.message || "Please wait before trying again");
      return;
    }

    // SECURITY: Form validation
    const validation = validateForm(formData);
    if (!validation.valid) {
      setErrorMessage(validation.errors[0]);
      return;
    }

    // SECURITY: Sanitize all inputs
    const sanitizedData = {
      name: sanitizeInput(formData.name),
      email: sanitizeInput(formData.email),
      message: sanitizeInput(formData.message),
    };

    setIsSubmitting(true);

    // SECURITY: Send to backend (not directly exposed)
    // This should be replaced with a secure API endpoint
    submitFormToBackend(sanitizedData)
      .then(() => {
        RateLimiter.recordAttempt();
        setIsSubmitting(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        setFormData({ name: "", email: "", message: "" });
        formRef.current?.reset();
      })
      .catch((error) => {
        setIsSubmitting(false);
        setErrorMessage(error.message || "Failed to send message. Please try again.");
      });
  };

  // SECURITY: Backend submission handler
  const submitFormToBackend = async (data: FormData): Promise<void> => {
    // IMPORTANT: Implement a secure backend endpoint
    // This endpoint should:
    // 1. Validate CSRF tokens
    // 2. Re-validate all inputs server-side
    // 3. Use HTTPS only
    // 4. Have proper rate limiting
    // 5. Never expose email or other sensitive data
    // 6. Log failed attempts for security monitoring

    const response = await fetch("/api/contact/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // SECURITY: Add CSRF token from meta tag
        "X-CSRF-Token": getCsrfToken(),
      },
      body: JSON.stringify(data),
      credentials: "same-origin", // SECURITY: Only send credentials for same-origin requests
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("Too many requests. Please try again later.");
      }
      throw new Error("Failed to send message");
    }

    return response.json();
  };

  // SECURITY: CSRF token retrieval
  const getCsrfToken = (): string => {
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");
    return token || "";
  };

  const setCardRef = (index: number) => (el: HTMLDivElement | null) => {
    cardRefs.current[index] = el;
  };

  // Memoize connection methods to prevent unnecessary re-renders
  const memoizedMethods = useMemo(() => CONNECTION_METHODS, []);
  const memoizedSocialLinks = useMemo(() => SOCIAL_LINKS, []);

  return (
    <section className="contact-section" id="contact" ref={sectionRef} role="region" aria-label="Contact section">
      {/* Ambient Background */}
      <div className="contact-bg" aria-hidden="true">
        <div className="gradient-orb orb-1" />
        <div className="gradient-orb orb-2" />
        <div className="gradient-orb orb-3" />
      </div>
      <SparkleField />

      {/* Floating Hearts */}
      <div className="hearts-container" aria-hidden="true">
        {[...Array(8)].map((_, i) => (
          <FloatingHeart key={i} delay={i * 0.5} x={10 + i * 10} />
        ))}
      </div>

      {/* Grid Pattern */}
      <div className="contact-grid" aria-hidden="true" />

      <div className="contact-container">
        {/* Header */}
        <header
          className={`contact-header ${visibleElements.has("header") ? "visible" : ""}`}
          data-animate="header"
        >
          <div className="header-icon" aria-hidden="true">
            <span className="wave-emoji">👋</span>
            <div className="wave-ring" />
            <div className="wave-ring" />
            <div className="wave-ring" />
          </div>

          <h1 className="contact-title">
            <span className="title-line">Let's Build</span>
            <span className="title-line highlight">Something</span>
            <span className="title-line gradient">Beautiful</span>
            <span className="title-line">Together</span>
          </h1>

          <p className="contact-subtitle">
            Every great collaboration starts with a simple conversation. Whether you have a{" "}
            <span className="text-glow">wild idea</span>, a <span className="text-glow">complex problem</span>, or
            just want to <span className="text-glow">connect</span>—I'm here for it.
          </p>

          {/* Dialog */}
          <div className="contact-dialog" aria-hidden="true">
            <div className="dialog-avatar">💡</div>
            <div className="dialog-content">
              <p>"Got an idea? Let's talk. The best projects often start with 'what if...' and a cup of coffee."</p>
              <div className="dialog-hearts">
                <span>❤️</span>
                <span>☕</span>
                <span>✨</span>
              </div>
            </div>
          </div>
        </header>

        {/* Connection Methods */}
        <div className="connection-methods">
          {memoizedMethods.map((method, index) => (
            <div
              key={method.id}
              ref={setCardRef(index)}
              className={`method-card ${visibleElements.has(`card-${index}`) ? "visible" : ""} ${
                hoveredCard === index ? "hovered" : ""
              }`}
              data-animate={`card-${index}`}
              style={{
                "--method-color": method.color,
                transitionDelay: `${index * 100}ms`,
              } as React.CSSProperties}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div
                className="card-glow"
                style={{
                  background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, ${method.color}40 0%, transparent 50%)`,
                }}
              />

              <div className="card-inner">
                <div
                  className="method-icon"
                  style={{
                    background: `linear-gradient(135deg, ${method.color}20 0%, ${method.color}40 100%)`,
                    boxShadow: `0 0 30px ${method.color}30`,
                  }}
                  aria-hidden="true"
                >
                  <span>{method.icon}</span>
                </div>

                <div className="method-content">
                  <h3 className="method-title">{method.title}</h3>
                  <p className="method-description">{method.description}</p>
                  <span className="method-availability">{method.availability}</span>
                </div>

                <a
                  href={method.link}
                  className="method-action"
                  style={{
                    background: `linear-gradient(135deg, ${method.color} 0%, ${method.color}dd 100%)`,
                  }}
                  rel="noopener noreferrer"
                >
                  <span>{method.action}</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>

              {/* Decorative Elements */}
              <div className="corner-decoration tl" style={{ borderColor: method.color }} aria-hidden="true" />
              <div className="corner-decoration br" style={{ borderColor: method.color }} aria-hidden="true" />
            </div>
          ))}
        </div>

        {/* Quick Form */}
        <div className={`quick-form ${visibleElements.has("form") ? "visible" : ""}`} data-animate="form">
          <div className="form-header">
            <span className="form-icon" aria-hidden="true">
              ✍️
            </span>
            <h3>Or send a message right here</h3>
            <p>No forms to download, no bots to fight—just human to human.</p>
          </div>

          {/* SECURITY: Display error messages */}
          {errorMessage && (
            <div className="error-message" role="alert">
              <span aria-hidden="true">⚠️</span> {errorMessage}
            </div>
          )}

          {rateLimitError && (
            <div className="error-message rate-limit" role="alert">
              <span aria-hidden="true">⏱️</span> {rateLimitError}
            </div>
          )}

          <form onSubmit={handleSubmit} ref={formRef} noValidate>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your Name"
                  required
                  maxLength={100}
                  autoComplete="name"
                  aria-required="true"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@example.com"
                  required
                  maxLength={254}
                  autoComplete="email"
                  aria-required="true"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">What's on your mind?</label>
              <textarea
                id="message"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell me about your project, your challenges, or just say hi..."
                required
                maxLength={5000}
                aria-required="true"
              />
            </div>

            <button
              type="submit"
              className={`submit-btn ${isSubmitting ? "submitting" : ""} ${showSuccess ? "success" : ""}`}
              disabled={isSubmitting || !!rateLimitError}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? (
                <span className="btn-content">
                  <span className="spinner" aria-hidden="true" />
                  Sending...
                </span>
              ) : showSuccess ? (
                <span className="btn-content">
                  <span className="checkmark" aria-hidden="true">
                    ✓
                  </span>
                  Message Sent!
                </span>
              ) : (
                <span className="btn-content">
                  Send Message
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                </span>
              )}
            </button>
          </form>

          {showSuccess && (
            <div className="success-message" role="status">
              <span className="success-emoji" aria-hidden="true">
                🎉
              </span>
              <p>Your message is on its way! I'll get back to you within 24 hours.</p>
            </div>
          )}
        </div>

        {/* Social Links */}
        <div className={`social-section ${visibleElements.has("social") ? "visible" : ""}`} data-animate="social">
          <p className="social-prompt">Prefer to stalk first? I get it.</p>
          <div className="social-links">
            {memoizedSocialLinks.map((social, index) => (
              <a
                key={social.name}
                href={social.url}
                className="social-link"
                style={{
                  "--social-color": social.color,
                  animationDelay: `${index * 100}ms`,
                } as React.CSSProperties}
                rel="noopener noreferrer"
                target="_blank"
                aria-label={`Visit my ${social.name} profile`}
              >
                <span className="social-icon" aria-hidden="true">
                  {social.icon}
                </span>
                <span className="social-name">{social.name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Footer Quote */}
        <div className="contact-footer">
          <div className="footer-quote">
            <span className="quote-mark" aria-hidden="true">
              "
            </span>
            <p>The best time to start was yesterday. The second best time is right now.</p>
            <span className="quote-mark" aria-hidden="true">
              "
            </span>
          </div>
          <p className="footer-location">
            <span aria-hidden="true">📍</span> Currently based in the intersection of Code & Creativity
          </p>
        </div>

        <br />
        <br />
      </div>
      <Footer />
   

      <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;600;700&display=swap');

  /* CSS VARIABLES - ADD THIS ENTIRE BLOCK */
  :root {
    /* Dark Mode (Default) */
    --bg-color: #0a0a1a;
    --bg-gradient-start: #0a0a1a;
    --bg-gradient-mid: #1a1a3e;
    --bg-gradient-end: #0f0f23;
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
    --accent-purple: #917FB3;
    --accent-gold: #F8B500;
    --accent-cream: #FFEAA7;
    --shadow-color: rgba(0, 0, 0, 0.5);
    --grid-line: rgba(255, 255, 255, 0.015);
    --orb-1: #FF6B9D;
    --orb-2: #4ECDC4;
    --orb-3: #917FB3;
    --dialog-bg: rgba(255, 255, 255, 0.05);
    --dialog-border: rgba(255, 255, 255, 0.1);
    --input-bg: rgba(0, 0, 0, 0.2);
    --input-bg-focus: rgba(0, 0, 0, 0.3);
    --input-border: rgba(255, 255, 255, 0.1);
    --success-bg: rgba(78, 205, 196, 0.1);
    --success-border: rgba(78, 205, 196, 0.3);
    --wave-ring: rgba(255, 255, 255, 0.1);
    --corner-decoration: rgba(255, 255, 255, 0.5);
    --quote-mark: rgba(145, 127, 179, 0.3);
    --footer-border: rgba(255, 255, 255, 0.08);
    --method-action-shadow: rgba(0, 0, 0, 0.3);
    --sparkle-color: white;
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
    --input-bg: rgba(155, 110, 243, 0.05);
    --input-bg-focus: rgba(155, 110, 243, 0.08);
    --input-border: rgba(155, 110, 243, 0.2);
    --success-bg: rgba(155, 110, 243, 0.08);
    --success-border: rgba(155, 110, 243, 0.3);
    --wave-ring: rgba(155, 110, 243, 0.15);
    --corner-decoration: rgba(155, 110, 243, 0.4);
    --quote-mark: rgba(155, 110, 243, 0.2);
    --footer-border: rgba(155, 110, 243, 0.1);
    --method-action-shadow: rgba(155, 110, 243, 0.15);
    --sparkle-color: rgba(155, 110, 243, 0.6);
  }

  /* Typography Enhancements - ADD THIS */
  .contact-title {
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.02em;
    margin: 0 0 1.5rem 0;
    color: var(--text-primary);
    font-family: 'Space Grotesk', sans-serif;
  }

  [data-theme="light"] .contact-title {
    background: linear-gradient(135deg, #2F2C4F 0%, #9B6EF3 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  [data-theme="light"] .highlight {
    background: linear-gradient(90deg, #9B6EF3, #E85D75);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  [data-theme="light"] .gradient {
    background: linear-gradient(90deg, #9B6EF3, #7C3AED, #E85D75);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradientMove 3s ease infinite;
  }
  /* END ADD BLOCK */

        // .contact-section {
        //   width: 100%;
        //   min-height: 100vh;
        //   background: linear-gradient(180deg, #0a0a1a 0%, #1a1a3e 50%, #0f0f23 100%);
        //   padding: 5rem 1.5rem;
        //   position: relative;
        //   overflow: hidden;
        //   box-sizing: border-box;
        // }

        .contact-section {
          width: 100%;
          min-height: 100vh;
          background: linear-gradient(180deg, var(--bg-gradient-start) 0%, var(--bg-gradient-mid) 50%, var(--bg-gradient-end) 100%);
          padding: 5rem 1.5rem;
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
          transition: background 0.5s ease;
        }

        /* Background */
        .contact-bg {
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
        //   background: radial-gradient(circle, #FF6B9D 0%, transparent 70%);
        //   top: -10%;
        //   left: -10%;
        //   animation-delay: 0s;
        // }

        // .orb-2 {
        //   width: 400px;
        //   height: 400px;
        //   background: radial-gradient(circle, #4ECDC4 0%, transparent 70%);
        //   bottom: 20%;
        //   right: -10%;
        //   animation-delay: -7s;
        // }

        // .orb-3 {
        //   width: 350px;
        //   height: 350px;
        //   background: radial-gradient(circle, #917FB3 0%, transparent 70%);
        //   bottom: -10%;
        //   left: 30%;
        //   animation-delay: -14s;
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
          bottom: 20%;
          right: -10%;
          animation-delay: -7s;
          opacity: 0.4;
        }
        
        .orb-3 {
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, var(--orb-3) 0%, transparent 70%);
          bottom: -10%;
          left: 30%;
          animation-delay: -14s;
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

        /* Sparkle Field */
        .sparkle-field {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        // .sparkle {
        //   position: absolute;
        //   width: 4px;
        //   height: 4px;
        //   background: white;
        //   border-radius: 50%;
        //   animation: sparkleTwinkle 3s ease-in-out infinite;
        //   opacity: 0;
        // }

        .sparkle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: var(--sparkle-color);
          border-radius: 50%;
          animation: sparkleTwinkle 3s ease-in-out infinite;
          opacity: 0;
        }

        @keyframes sparkleTwinkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }

        /* Floating Hearts */
        .hearts-container {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .floating-heart {
          position: absolute;
          font-size: 1.5rem;
          opacity: 0.2;
          animation: heartFloat 15s ease-in-out infinite;
          bottom: -50px;
        }

        @keyframes heartFloat {
          0% {
            transform: translateY(0) rotate(0deg) scale(0.5);
            opacity: 0;
          }
          10% { opacity: 0.2; }
          90% { opacity: 0.2; }
          100% {
            transform: translateY(-100vh) rotate(360deg) scale(1.2);
            opacity: 0;
          }
        }

        /* Grid */
        // .contact-grid {
        //   position: absolute;
        //   inset: 0;
        //   background-image: 
        //     linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
        //     linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px);
        //   background-size: 50px 50px;
        //   pointer-events: none;
        // }

        .contact-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(var(--grid-line) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
          background-size: 50px 50px;
          pointer-events: none;
        }

        /* Container */
        .contact-container {
          max-width: 1000px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        /* Header */
        .contact-header {
          text-align: center;
          margin-bottom: 4rem;
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease;
        }

        .contact-header.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .header-icon {
          position: relative;
          width: 100px;
          height: 100px;
          margin: 0 auto 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .wave-emoji {
          font-size: 3rem;
          z-index: 10;
          animation: wave 2s ease-in-out infinite;
          display: block;
        }

        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg); }
          75% { transform: rotate(-10deg); }
        }

        // .wave-ring {
        //   position: absolute;
        //   border: 2px solid rgba(255, 255, 255, 0.1);
        //   border-radius: 50%;
        //   animation: waveRing 3s ease-out infinite;
        // }

        .wave-ring {
          position: absolute;
          border: 2px solid var(--wave-ring);
          border-radius: 50%;
          animation: waveRing 3s ease-out infinite;
        }

        .wave-ring:nth-child(2) {
          width: 100%;
          height: 100%;
          animation-delay: 0s;
        }

        .wave-ring:nth-child(3) {
          width: 140%;
          height: 140%;
          animation-delay: 0.5s;
        }

        .wave-ring:nth-child(4) {
          width: 180%;
          height: 180%;
          animation-delay: 1s;
        }

        @keyframes waveRing {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        .contact-title {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 800;
          line-height: 1.1;
          margin: 0 0 1.5rem 0;
          color: #FBEAEB;
          font-family: 'Space Grotesk', sans-serif;
        }

        .title-line {
          display: block;
        }

        // .highlight {
        //   background: linear-gradient(90deg, #FF6B9D, #F8B500);
        //   -webkit-background-clip: text;
        //   -webkit-text-fill-color: transparent;
        //   background-clip: text;
        // }

        // .gradient {
        //   background: linear-gradient(90deg, #4ECDC4, #917FB3, #FF6B9D);
        //   background-size: 200% auto;
        //   -webkit-background-clip: text;
        //   -webkit-text-fill-color: transparent;
        //   background-clip: text;
        //   animation: gradientMove 3s ease infinite;
        // }

        .highlight {
          background: linear-gradient(90deg, var(--accent-pink), var(--accent-gold));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .gradient {
          background: linear-gradient(90deg, var(--accent-teal), var(--accent-purple), var(--accent-pink));
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientMove 3s ease infinite;
        }

        @keyframes gradientMove {
          0%, 100% { background-position: 0% center; }
          50% { background-position: 100% center; }
        }

        // .contact-subtitle {
        //   font-size: clamp(1.125rem, 2.5vw, 1.375rem);
        //   color: rgba(251, 234, 235, 0.7);
        //   max-width: 600px;
        //   margin: 0 auto 2.5rem;
        //   line-height: 1.8;
        // }

        .contact-subtitle {
          font-size: clamp(1.125rem, 2.5vw, 1.375rem);
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto 2.5rem;
          line-height: 1.8;
        }

        // .text-glow {
        //   color: #FFEAA7;
        //   font-weight: 600;
        //   position: relative;
        //   display: inline-block;
        // }

        // .text-glow::after {
        //   content: "";
        //   position: absolute;
        //   bottom: -2px;
        //   left: 0;
        //   width: 100%;
        //   height: 2px;
        //   background: #FFEAA7;
        //   transform: scaleX(0);
        //   transition: transform 0.3s ease;
        // }

        .text-glow {
          color: var(--accent-cream);
          font-weight: 600;
          position: relative;
          display: inline-block;
        }
        
        .text-glow::after {
          content: "";
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 2px;
          background: var(--accent-cream);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }
        
        [data-theme="light"] .text-glow {
          color: #D4A574;
        }
        
        [data-theme="light"] .text-glow::after {
          background: #D4A574;
        }

        .contact-header:hover .text-glow::after {
          transform: scaleX(1);
        }

        /* Dialog */
        // .contact-dialog {
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

        .contact-dialog {
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
        
        [data-theme="light"] .contact-dialog {
          box-shadow: 0 8px 30px rgba(155, 110, 243, 0.12);
        }

        @keyframes dialogFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        // .dialog-avatar {
        //   width: 50px;
        //   height: 50px;
        //   background: linear-gradient(135deg, #FFEAA7 0%, #F8B500 100%);
        //   border-radius: 50%;
        //   display: flex;
        //   align-items: center;
        //   justify-content: center;
        //   font-size: 1.5rem;
        //   flex-shrink: 0;
        //   animation: bulbPulse 2s ease-in-out infinite;
        // }

        .dialog-avatar {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, var(--accent-cream) 0%, var(--accent-gold) 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          flex-shrink: 0;
          animation: bulbPulse 2s ease-in-out infinite;
        }
        
        [data-theme="light"] .dialog-avatar {
          background: linear-gradient(135deg, #F4E7C5 0%, #D4A574 100%);
          box-shadow: 0 4px 15px rgba(212, 165, 116, 0.3);
        }

        @keyframes bulbPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 234, 167, 0.4); }
          50% { transform: scale(1.1); box-shadow: 0 0 20px 10px rgba(255, 234, 167, 0); }
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

        .dialog-hearts {
          display: flex;
          gap: 0.5rem;
        }

        .dialog-hearts span {
          animation: heartBeat 1.5s ease-in-out infinite;
        }

        .dialog-hearts span:nth-child(2) { animation-delay: 0.2s; }
        .dialog-hearts span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes heartBeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        /* Connection Methods */
        .connection-methods {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 4rem;
        }

        .method-card {
          position: relative;
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .method-card.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .method-card.hovered {
          z-index: 10;
        }

        .card-glow {
          position: absolute;
          inset: -2px;
          border-radius: 20px;
          opacity: 0;
          transition: opacity 0.3s ease;
          filter: blur(20px);
          pointer-events: none;
        }

        .method-card.hovered .card-glow {
          opacity: 1;
        }

        // .card-inner {
        //   position: relative;
        //   background: rgba(255, 255, 255, 0.03);
        //   border: 1px solid rgba(255, 255, 255, 0.08);
        //   border-radius: 18px;
        //   padding: 1.75rem;
        //   backdrop-filter: blur(10px);
        //   transition: all 0.3s ease;
        //   height: 100%;
        //   display: flex;
        //   flex-direction: column;
        // }

        // .method-card.hovered .card-inner {
        //   background: rgba(255, 255, 255, 0.06);
        //   border-color: rgba(255, 255, 255, 0.15);
        //   transform: translateY(-5px);
        //   box-shadow: 0 20px 40px -20px rgba(0, 0, 0, 0.5);
        // }

        .card-inner {
          position: relative;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 18px;
          padding: 1.75rem;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .method-card.hovered .card-inner {
          background: var(--card-bg-hover);
          border-color: var(--card-border-hover);
          transform: translateY(-5px);
          box-shadow: 0 20px 40px -20px var(--shadow-color);
        }
        
        [data-theme="light"] .card-inner {
          box-shadow: 0 4px 20px var(--shadow-color);
        }
        
        [data-theme="light"] .method-card.hovered .card-inner {
          box-shadow: 0 25px 50px -12px rgba(155, 110, 243, 0.15);
          border-color: #9B6EF3;
        }

        .method-icon {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
          transition: all 0.3s ease;
        }

        .method-icon span {
          font-size: 1.75rem;
          transition: transform 0.3s ease;
        }

        .method-card.hovered .method-icon {
          transform: scale(1.1) rotate(5deg);
        }

        .method-card.hovered .method-icon span {
          transform: scale(1.2);
        }

        .method-content {
          flex: 1;
          margin-bottom: 1.25rem;
        }

        // .method-title {
        //   font-size: 1.25rem;
        //   font-weight: 700;
        //   color: #FBEAEB;
        //   margin: 0 0 0.75rem 0;
        //   transition: color 0.3s ease;
        // }

        .method-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 0.75rem 0;
          transition: color 0.3s ease;
          letter-spacing: -0.01em;
        }
        
        [data-theme="light"] .method-title {
          background: linear-gradient(135deg, #2F2C4F 0%, #4A4466 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .method-card.hovered .method-title {
          color: var(--method-color);
        }

        // .method-description {
        //   font-size: 0.9375rem;
        //   line-height: 1.7;
        //   color: rgba(251, 234, 235, 0.7);
        //   margin: 0 0 0.75rem 0;
        // }

        // .method-availability {
        //   display: inline-block;
        //   font-size: 0.8125rem;
        //   color: rgba(251, 234, 235, 0.5);
        //   font-style: italic;
        // }

        .method-description {
          font-size: 0.9375rem;
          line-height: 1.7;
          color: var(--text-secondary);
          margin: 0 0 0.75rem 0;
        }
        
        .method-availability {
          display: inline-block;
          font-size: 0.8125rem;
          color: var(--text-dark);
          font-style: italic;
        }

        // .method-action {
        //   display: inline-flex;
        //   align-items: center;
        //   justify-content: center;
        //   gap: 0.5rem;
        //   padding: 0.875rem 1.5rem;
        //   border-radius: 12px;
        //   color: white;
        //   font-size: 0.9375rem;
        //   font-weight: 600;
        //   text-decoration: none;
        //   transition: all 0.3s ease;
        //   box-shadow: 0 4px 15px -5px rgba(0, 0, 0, 0.3);
        // }

        // .method-action:hover {
        //   transform: translateY(-2px);
        //   box-shadow: 0 10px 30px -10px var(--method-color);
        // }

        .method-action {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          border-radius: 12px;
          color: white;
          font-size: 0.9375rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px -5px var(--method-action-shadow);
        }
        
        .method-action:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px -10px var(--method-color);
        }
        
        [data-theme="light"] .method-action {
          box-shadow: 0 4px 15px -5px rgba(155, 110, 243, 0.2);
        }

        .method-action svg {
          transition: transform 0.3s ease;
        }

        .method-action:hover svg {
          transform: translateX(3px);
        }

        /* Corner Decorations */
        // .corner-decoration {
        //   position: absolute;
        //   width: 20px;
        //   height: 20px;
        //   border: 2px solid;
        //   opacity: 0;
        //   transition: all 0.3s ease;
        // }

        .corner-decoration {
          position: absolute;
          width: 20px;
          height: 20px;
          border: 2px solid var(--corner-decoration);
          opacity: 0;
          transition: all 0.3s ease;
        }

        .corner-decoration.tl {
          top: 15px;
          left: 15px;
          border-right: none;
          border-bottom: none;
          border-radius: 8px 0 0 0;
        }

        .corner-decoration.br {
          bottom: 15px;
          right: 15px;
          border-left: none;
          border-top: none;
          border-radius: 0 0 8px 0;
        }

        .method-card.hovered .corner-decoration {
          opacity: 0.5;
          width: 40px;
          height: 40px;
        }

        /* Quick Form */
        // .quick-form {
        //   background: rgba(255, 255, 255, 0.03);
        //   border: 1px solid rgba(255, 255, 255, 0.08);
        //   border-radius: 24px;
        //   padding: 2.5rem;
        //   margin-bottom: 3rem;
        //   opacity: 0;
        //   transform: translateY(30px);
        //   transition: all 0.8s ease;
        //   backdrop-filter: blur(10px);
        // }

        .quick-form {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 24px;
          padding: 2.5rem;
          margin-bottom: 3rem;
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease;
          backdrop-filter: blur(10px);
        }
        
        [data-theme="light"] .quick-form {
          box-shadow: 0 8px 32px rgba(155, 110, 243, 0.08);
        }

        .quick-form.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .form-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .form-icon {
          font-size: 2.5rem;
          margin-bottom: 0.75rem;
          display: inline-block;
          animation: write 2s ease-in-out infinite;
        }

        @keyframes write {
          0%, 100% { transform: rotate(0deg) translateY(0); }
          50% { transform: rotate(-10deg) translateY(-5px); }
        }

        // .form-header h3 {
        //   font-size: 1.5rem;
        //   font-weight: 700;
        //   color: #FBEAEB;
        //   margin: 0 0 0.5rem 0;
        // }

        // .form-header p {
        //   color: rgba(251, 234, 235, 0.6);
        //   margin: 0;
        //   font-size: 0.9375rem;
        // }

        .form-header h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 0.5rem 0;
          letter-spacing: -0.01em;
        }
        
        [data-theme="light"] .form-header h3 {
          background: linear-gradient(135deg, #2F2C4F 0%, #9B6EF3 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .form-header p {
          color: var(--text-muted);
          margin: 0;
          font-size: 0.9375rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        // .form-group label {
        //   display: block;
        //   font-size: 0.875rem;
        //   font-weight: 600;
        //   color: rgba(251, 234, 235, 0.8);
        //   margin-bottom: 0.5rem;
        // }

        // .form-group input,
        // .form-group textarea {
        //   width: 100%;
        //   padding: 0.875rem 1rem;
        //   background: rgba(0, 0, 0, 0.2);
        //   border: 1px solid rgba(255, 255, 255, 0.1);
        //   border-radius: 12px;
        //   color: #FBEAEB;
        //   font-size: 1rem;
        //   transition: all 0.3s ease;
        //   box-sizing: border-box;
        //   font-family: inherit;
        // }

        // .form-group input:focus,
        // .form-group textarea:focus {
        //   outline: none;
        //   border-color: #917FB3;
        //   background: rgba(0, 0, 0, 0.3);
        //   box-shadow: 0 0 0 3px rgba(145, 127, 179, 0.1);
        // }

        // .form-group input::placeholder,
        // .form-group textarea::placeholder {
        //   color: rgba(251, 234, 235, 0.4);
        // }

        .form-group label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
        }
        
        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 0.875rem 1rem;
          background: var(--input-bg);
          border: 1px solid var(--input-border);
          border-radius: 12px;
          color: var(--text-primary);
          font-size: 1rem;
          transition: all 0.3s ease;
          box-sizing: border-box;
          font-family: inherit;
        }
        
        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--accent-purple);
          background: var(--input-bg-focus);
          box-shadow: 0 0 0 3px rgba(155, 110, 243, 0.1);
        }
        
        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: var(--text-dark);
        }
        
        [data-theme="light"] .form-group input,
        [data-theme="light"] .form-group textarea {
          font-weight: 500;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 120px;
        }

        // .submit-btn {
        //   width: 100%;
        //   padding: 1rem 2rem;
        //   background: linear-gradient(135deg, #917FB3 0%, #4ECDC4 100%);
        //   border: none;
        //   border-radius: 12px;
        //   color: white;
        //   font-size: 1rem;
        //   font-weight: 700;
        //   cursor: pointer;
        //   transition: all 0.3s ease;
        //   position: relative;
        //   overflow: hidden;
        // }

        // .submit-btn:hover:not(:disabled) {
        //   transform: translateY(-2px);
        //   box-shadow: 0 10px 30px -10px rgba(145, 127, 179, 0.5);
        // }

        .submit-btn {
          width: 100%;
          padding: 1rem 2rem;
          background: linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-teal) 100%);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px -10px rgba(155, 110, 243, 0.5);
        }
        
        [data-theme="light"] .submit-btn {
          background: linear-gradient(135deg, #9B6EF3 0%, #E85D75 100%);
          box-shadow: 0 4px 15px rgba(155, 110, 243, 0.3);
        }
        
        [data-theme="light"] .submit-btn:hover:not(:disabled) {
          box-shadow: 0 10px 30px -10px rgba(155, 110, 243, 0.4);
        }

        .submit-btn.submitting {
          background: linear-gradient(135deg, #666 0%, #888 100%);
          cursor: not-allowed;
        }

        .submit-btn.success {
          background: linear-gradient(135deg, #4ECDC4 0%, #44a08d 100%);
        }

        .btn-content {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .checkmark {
          font-size: 1.25rem;
          animation: checkPop 0.5s ease;
        }

        @keyframes checkPop {
          0% { transform: scale(0); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }

        // .success-message {
        //   margin-top: 1.5rem;
        //   padding: 1.25rem;
        //   background: rgba(78, 205, 196, 0.1);
        //   border: 1px solid rgba(78, 205, 196, 0.3);
        //   border-radius: 12px;
        //   text-align: center;
        //   animation: successSlide 0.5s ease;
        // }

        .success-message {
          margin-top: 1.5rem;
          padding: 1.25rem;
          background: var(--success-bg);
          border: 1px solid var(--success-border);
          border-radius: 12px;
          text-align: center;
          animation: successSlide 0.5s ease;
        }
        
        [data-theme="light"] .success-message {
          background: rgba(155, 110, 243, 0.08);
          border-color: rgba(155, 110, 243, 0.3);
        }

        @keyframes successSlide {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .success-emoji {
          font-size: 2rem;
          display: block;
          margin-bottom: 0.5rem;
          animation: celebrate 1s ease infinite;
        }

        @keyframes celebrate {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.2) rotate(-10deg); }
          75% { transform: scale(1.2) rotate(10deg); }
        }

        // .success-message p {
        //   margin: 0;
        //   color: rgba(251, 234, 235, 0.9);
        //   font-size: 0.9375rem;
        // }

        .success-message p {
          margin: 0;
          color: var(--text-primary);
          font-size: 0.9375rem;
        }

        /* Social Section */
        .social-section {
          text-align: center;
          margin-bottom: 4rem;
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease;
        }

        .social-section.visible {
          opacity: 1;
          transform: translateY(0);
        }

        // .social-prompt {
        //   font-size: 1rem;
        //   color: rgba(251, 234, 235, 0.6);
        //   margin-bottom: 1.5rem;
        //   font-style: italic;
        // }

        .social-prompt {
          font-size: 1rem;
          color: var(--text-muted);
          margin-bottom: 1.5rem;
          font-style: italic;
        }

        .social-links {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        // .social-link {
        //   display: inline-flex;
        //   align-items: center;
        //   gap: 0.5rem;
        //   padding: 0.75rem 1.25rem;
        //   background: rgba(255, 255, 255, 0.05);
        //   border: 1px solid rgba(255, 255, 255, 0.1);
        //   border-radius: 12px;
        //   color: rgba(251, 234, 235, 0.8);
        //   text-decoration: none;
        //   font-size: 0.9375rem;
        //   font-weight: 500;
        //   transition: all 0.3s ease;
        //   opacity: 0;
        //   transform: translateY(20px);
        //   animation: socialPop 0.5s ease forwards;
        // }

        @keyframes socialPop {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        // .social-link:hover {
        //   background: rgba(255, 255, 255, 0.1);
        //   border-color: var(--social-color);
        //   color: var(--social-color);
        //   transform: translateY(-3px);
        // }

        .social-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 12px;
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.9375rem;
          font-weight: 500;
          transition: all 0.3s ease;
          opacity: 0;
          transform: translateY(20px);
          animation: socialPop 0.5s ease forwards;
        }
        
        .social-link:hover {
          background: var(--card-bg-hover);
          border-color: var(--social-color);
          color: var(--social-color);
          transform: translateY(-3px);
          box-shadow: 0 10px 20px -10px var(--shadow-color);
        }
        
        [data-theme="light"] .social-link {
          box-shadow: 0 4px 15px var(--shadow-color);
        }
        
        [data-theme="light"] .social-link:hover {
          box-shadow: 0 15px 30px -10px rgba(155, 110, 243, 0.15);
        }

        .social-icon {
          font-size: 1.25rem;
        }

        /* Footer */
        // .contact-footer {
        //   text-align: center;
        //   padding-top: 3rem;
        //   border-top: 1px solid rgba(255, 255, 255, 0.08);
        // }

        .contact-footer {
          text-align: center;
          padding-top: 3rem;
          border-top: 1px solid var(--footer-border);
        }

        .footer-quote {
          position: relative;
          display: inline-block;
          margin-bottom: 1.5rem;
        }

        // .footer-quote p {
        //   font-size: 1.25rem;
        //   font-style: italic;
        //   color: rgba(251, 234, 235, 0.9);
        //   margin: 0;
        //   padding: 0 2rem;
        //   font-family: 'Space Grotesk', sans-serif;
        // }

        // .quote-mark {
        //   position: absolute;
        //   font-size: 3rem;
        //   color: rgba(145, 127, 179, 0.3);
        //   line-height: 1;
        // }

        .footer-quote p {
          font-size: 1.25rem;
          font-style: italic;
          color: var(--text-primary);
          margin: 0;
          padding: 0 2rem;
          font-family: 'Space Grotesk', sans-serif;
        }
        
        .quote-mark {
          position: absolute;
          font-size: 3rem;
          color: var(--quote-mark);
          line-height: 1;
        }

        .quote-mark:first-child {
          top: -10px;
          left: 0;
        }

        .quote-mark:last-child {
          bottom: -20px;
          right: 0;
        }

        // .footer-location {
        //   font-size: 0.9375rem;
        //   color: rgba(251, 234, 235, 0.6);
        //   margin: 0;
        // }

        .footer-location {
          font-size: 0.9375rem;
          color: var(--text-muted);
          margin: 0;
        }

        .footer-location span {
          margin-right: 0.5rem;
        }

        /* Responsive */
        @media (min-width: 768px) {
          .contact-section {
            padding: 6rem 3rem;
          }

          .connection-methods {
            grid-template-columns: repeat(2, 1fr);
          }

          .quick-form {
            padding: 3rem;
          }
        }

        @media (max-width: 640px) {
          .form-row {
            grid-template-columns: 1fr;
          }

          .connection-methods {
            grid-template-columns: 1fr;
          }

          .social-links {
            flex-direction: column;
            align-items: center;
          }

          .social-link {
            width: 100%;
            max-width: 200px;
            justify-content: center;
          }
        }
        /* Light Mode Premium Enhancements */
  [data-theme="light"] .contact-section {
    background-attachment: fixed;
  }

  [data-theme="light"] .contact-container {
    max-width: 1100px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  [data-theme="light"] .contact-header {
    margin-bottom: 6rem;
  }

  [data-theme="light"] .floating-heart {
    opacity: 0.15;
  }

  [data-theme="light"] .method-icon {
    box-shadow: 0 4px 15px rgba(155, 110, 243, 0.15);
  }

  [data-theme="light"] .connection-methods {
    gap: 2rem;
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
    [data-theme="light"] .contact-section {
      padding: 4rem 1rem;
    }

    [data-theme="light"] .quick-form {
      padding: 1.5rem;
    }

    [data-theme="light"] .card-inner {
      padding: 1.5rem;
    }
  }
`}</style>
    </section>
  );
};

export default Contact;