// import React, { useState, useEffect, useCallback } from "react";
// import { NavLink, useLocation } from "react-router-dom";

// interface NavItem {
//   label: string;
//   path: string;
//   icon: string;
//   color: string;
//   description: string;
// }

// const navItems: NavItem[] = [
//   { 
//     label: "Home", 
//     path: "/", 
//     icon: "🏠", 
//     color: "#FBEAEB",
//     description: "Start here"
//   },
//   { 
//     label: "Work", 
//     path: "/work", 
//     icon: "💼", 
//     color: "#FF6B9D",
//     description: "Case studies"
//   },
//   { 
//     label: "Thinking", 
//     path: "/thinking", 
//     icon: "💭", 
//     color: "#4ECDC4",
//     description: "Philosophy"
//   },
//   { 
//     label: "Growth", 
//     path: "/growth", 
//     icon: "🌱", 
//     color: "#F8B500",
//     description: "My journey"
//   },
//   { 
//     label: "Experiments", 
//     path: "/experiments", 
//     icon: "🧪", 
//     color: "#917FB3",
//     description: "Playground"
//   },
//   { 
//     label: "Contact", 
//     path: "/contact", 
//     icon: "💌", 
//     color: "#FF6B6B",
//     description: "Let's talk"
//   },
// ];

// const Navbar: React.FC = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [activeHover, setActiveHover] = useState<string | null>(null);
//   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
//   const [showHint, setShowHint] = useState(true);
//   const location = useLocation();

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 50);
//     };

//     window.addEventListener("scroll", handleScroll, { passive: true });
    
//     // Hide hint after 5 seconds
//     const hintTimer = setTimeout(() => setShowHint(false), 5000);
    
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//       clearTimeout(hintTimer);
//     };
//   }, []);

//   useEffect(() => {
//     // Close mobile menu on route change
//     setIsMenuOpen(false);
//   }, [location.pathname]);

//   const handleMouseMove = useCallback((e: React.MouseEvent) => {
//     setMousePos({ x: e.clientX, y: e.clientY });
//   }, []);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const currentPage = navItems.find(item => item.path === location.pathname);

//   return (
//     <nav 
//       className={`navbar ${isScrolled ? "scrolled" : ""} ${isMenuOpen ? "menu-open" : ""}`}
//       onMouseMove={handleMouseMove}
//     >
//       {/* Ambient Glow */}
//       <div 
//         className="nav-glow"
//         style={{
//           background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(145, 127, 179, 0.15), transparent 40%)`,
//         }}
//       />

//       {/* Floating Particles */}
//       <div className="nav-particles">
//         {[...Array(6)].map((_, i) => (
//           <span 
//             key={i} 
//             className="nav-particle"
//             style={{ 
//               animationDelay: `${i * 0.5}s`,
//               left: `${15 + i * 15}%`,
//             }}
//           />
//         ))}
//       </div>

//       <div className="navbar-container">
//         {/* Logo */}
//         <NavLink to="/" className="navbar-brand">
//           <div className="brand-orbit">
//             <span className="brand-core">A</span>
//             <div className="orbit-ring" />
//             <div className="orbit-ring" />
//           </div>
//           <div className="brand-text">
//             <span className="brand-name">Atharva</span>
//             <span className="brand-tagline">Creative Engineer</span>
//           </div>
//           {showHint && !isScrolled && (
//             <div className="brand-hint">
//               <span>👋 Welcome!</span>
//             </div>
//           )}
//         </NavLink>

//         {/* Desktop Navigation */}
//         <div className="desktop-nav">
//           <ul className="nav-links">
//             {navItems.map((item) => (
//               <li 
//                 key={item.label} 
//                 className="nav-item"
//                 onMouseEnter={() => setActiveHover(item.label)}
//                 onMouseLeave={() => setActiveHover(null)}
//               >
//                 <NavLink
//                   to={item.path}
//                   className={({ isActive }) =>
//                     `nav-link ${isActive ? "active" : ""}`
//                   }
//                   style={{
//                     "--link-color": item.color,
//                   } as React.CSSProperties}
//                 >
//                   <span className="link-icon">{item.icon}</span>
//                   <span className="link-text">{item.label}</span>
//                   <span className="link-glow" />
                  
//                   {/* Tooltip */}
//                   <div className={`link-tooltip ${activeHover === item.label ? "visible" : ""}`}>
//                     <span className="tooltip-icon">{item.icon}</span>
//                     <div className="tooltip-content">
//                       <span className="tooltip-label">{item.label}</span>
//                       <span className="tooltip-desc">{item.description}</span>
//                     </div>
//                   </div>
//                 </NavLink>
                
//                 {/* Active Indicator */}
//                 <div className={`active-indicator ${location.pathname === item.path ? "visible" : ""}`} 
//                   style={{ background: item.color }}
//                 />
//               </li>
//             ))}
//           </ul>

//           {/* Current Page Badge */}
//           <div className="current-page-badge" style={{ 
//             "--badge-color": currentPage?.color || "#917FB3" 
//           } as React.CSSProperties}>
//             <span>{currentPage?.icon}</span>
//             <span>{currentPage?.label}</span>
//           </div>
//         </div>

//         {/* Mobile Toggle */}
//         <button
//           className="mobile-toggle"
//           onClick={toggleMenu}
//           aria-expanded={isMenuOpen}
//           aria-label="Toggle navigation menu"
//         >
//           <div className={`toggle-icon ${isMenuOpen ? "open" : ""}`}>
//             <span />
//             <span />
//             <span />
//           </div>
//           <div className="toggle-glow" />
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
//         <div className="mobile-menu-bg">
//           <div className="menu-orb orb-1" />
//           <div className="menu-orb orb-2" />
//         </div>
        
//         <div className="mobile-menu-content">
//           <div className="menu-header">
//             <span className="menu-emoji">🧭</span>
//             <span>Where to?</span>
//           </div>

//           <ul className="mobile-links">
//             {navItems.map((item, index) => (
//               <li 
//                 key={item.label} 
//                 className="mobile-item"
//                 style={{ animationDelay: `${index * 50}ms` }}
//               >
//                 <NavLink
//                   to={item.path}
//                   className={({ isActive }) =>
//                     `mobile-link ${isActive ? "active" : ""}`
//                   }
//                   style={{ "--link-color": item.color } as React.CSSProperties}
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   <span className="mobile-link-icon">{item.icon}</span>
//                   <div className="mobile-link-content">
//                     <span className="mobile-link-label">{item.label}</span>
//                     <span className="mobile-link-desc">{item.description}</span>
//                   </div>
//                   <div className="mobile-link-arrow">→</div>
//                   <div className="mobile-link-glow" />
//                 </NavLink>
//               </li>
//             ))}
//           </ul>

//           {/* Mobile Footer */}
//           <div className="mobile-footer">
//             <p className="footer-quote">"The best journeys start with a single click"</p>
//             <div className="social-hint">
//               <span>💬</span>
//               <span>Let's build something together</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Progress Bar */}
//       <div className="scroll-progress" style={{ 
//         transform: `scaleX(${isScrolled ? 1 : 0})`,
//         opacity: isScrolled ? 1 : 0 
//       }}>
//         <div className="progress-glow" />
//       </div>

//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap');

//         * {
//           margin: 0;
//           padding: 0;
//           box-sizing: border-box;
//         }

//         .navbar {
//           position: fixed;
//           top: 0;
//           left: 0;
//           right: 0;
//           z-index: 1000;
//           background: rgba(15, 15, 35, 0.8);
//           backdrop-filter: blur(20px);
//           -webkit-backdrop-filter: blur(20px);
//           border-bottom: 1px solid rgba(255, 255, 255, 0.05);
//           transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
//           padding: 1rem 2rem;
//         }

//         .navbar.scrolled {
//           padding: 0.75rem 2rem;
//           background: rgba(10, 10, 26, 0.95);
//           box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.5);
//         }

//         .navbar.menu-open {
//           background: rgba(10, 10, 26, 0.98);
//         }

//         /* Ambient Glow */
//         .nav-glow {
//           position: absolute;
//           inset: 0;
//           pointer-events: none;
//           opacity: 0;
//           transition: opacity 0.3s ease;
//         }

//         .navbar:hover .nav-glow {
//           opacity: 1;
//         }

//         /* Particles */
//         .nav-particles {
//           position: absolute;
//           inset: 0;
//           overflow: hidden;
//           pointer-events: none;
//         }

//         .nav-particle {
//           position: absolute;
//           width: 4px;
//           height: 4px;
//           background: rgba(255, 255, 255, 0.3);
//           border-radius: 50%;
//           top: 50%;
//           animation: floatParticle 8s ease-in-out infinite;
//         }

//         @keyframes floatParticle {
//           0%, 100% { 
//             transform: translateY(-50%) translateX(0) scale(0);
//             opacity: 0;
//           }
//           10% {
//             opacity: 1;
//             transform: translateY(-50%) translateX(20px) scale(1);
//           }
//           90% {
//             opacity: 1;
//           }
//           100% {
//             transform: translateY(-50%) translateX(100px) scale(0);
//             opacity: 0;
//           }
//         }

//         /* Container */
//         .navbar-container {
//           max-width: 1200px;
//           margin: 0 auto;
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           position: relative;
//           z-index: 10;
//         }

//         /* Brand */
//         .navbar-brand {
//           display: flex;
//           align-items: center;
//           gap: 0.875rem;
//           text-decoration: none;
//           position: relative;
//         }

//         .brand-orbit {
//           position: relative;
//           width: 45px;
//           height: 45px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .brand-core {
//           width: 35px;
//           height: 35px;
//           background: linear-gradient(135deg, #917FB3 0%, #4ECDC4 100%);
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-family: 'Space Grotesk', sans-serif;
//           font-size: 1.125rem;
//           font-weight: 700;
//           color: white;
//           position: relative;
//           z-index: 2;
//           transition: transform 0.3s ease;
//         }

//         .navbar-brand:hover .brand-core {
//           transform: scale(1.1);
//         }

//         .orbit-ring {
//           position: absolute;
//           border: 1px solid rgba(145, 127, 179, 0.3);
//           border-radius: 50%;
//           animation: orbit 4s linear infinite;
//         }

//         .orbit-ring:nth-child(2) {
//           width: 100%;
//           height: 100%;
//         }

//         .orbit-ring:nth-child(3) {
//           width: 130%;
//           height: 130%;
//           animation-direction: reverse;
//           animation-duration: 6s;
//           border-color: rgba(78, 205, 196, 0.2);
//         }

//         @keyframes orbit {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }

//         .brand-text {
//           display: flex;
//           flex-direction: column;
//         }

//         .brand-name {
//           font-family: 'Space Grotesk', sans-serif;
//           font-size: 1.25rem;
//           font-weight: 700;
//           color: #FBEAEB;
//           letter-spacing: -0.02em;
//           transition: color 0.3s ease;
//         }

//         .navbar-brand:hover .brand-name {
//           color: #917FB3;
//         }

//         .brand-tagline {
//           font-size: 0.75rem;
//           color: rgba(251, 234, 235, 0.5);
//           font-weight: 500;
//           letter-spacing: 0.05em;
//         }

//         .brand-hint {
//           position: absolute;
//           top: calc(100% + 10px);
//           left: 0;
//           padding: 0.5rem 0.875rem;
//           background: rgba(145, 127, 179, 0.2);
//           border: 1px solid rgba(145, 127, 179, 0.3);
//           border-radius: 8px;
//           font-size: 0.8125rem;
//           color: #FBEAEB;
//           white-space: nowrap;
//           animation: hintPulse 2s ease-in-out infinite;
//           opacity: 1;
//           transition: opacity 0.3s ease;
//         }

//         @keyframes hintPulse {
//           0%, 100% { transform: translateY(0); }
//           50% { transform: translateY(-3px); }
//         }

//         .navbar.scrolled .brand-hint {
//           opacity: 0;
//           pointer-events: none;
//         }

//         /* Desktop Nav */
//         .desktop-nav {
//           display: flex;
//           align-items: center;
//           gap: 2rem;
//         }

//         .nav-links {
//           display: flex;
//           list-style: none;
//           gap: 0.5rem;
//         }

//         .nav-item {
//           position: relative;
//         }

//         .nav-link {
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//           padding: 0.625rem 1rem;
//           color: rgba(251, 234, 235, 0.7);
//           text-decoration: none;
//           font-size: 0.9375rem;
//           font-weight: 500;
//           border-radius: 12px;
//           transition: all 0.3s ease;
//           position: relative;
//           overflow: visible;
//         }

//         .nav-link:hover,
//         .nav-link.active {
//           color: var(--link-color);
//           background: rgba(255, 255, 255, 0.05);
//         }

//         .link-icon {
//           font-size: 1.125rem;
//           transition: transform 0.3s ease;
//         }

//         .nav-link:hover .link-icon {
//           transform: scale(1.2) rotate(5deg);
//         }

//         .link-text {
//           position: relative;
//         }

//         .link-glow {
//           position: absolute;
//           inset: 0;
//           background: radial-gradient(circle at center, var(--link-color) 0%, transparent 70%);
//           opacity: 0;
//           filter: blur(20px);
//           transition: opacity 0.3s ease;
//           pointer-events: none;
//         }

//         .nav-link:hover .link-glow {
//           opacity: 0.3;
//         }

//         /* Tooltip */
//         .link-tooltip {
//           position: absolute;
//           top: calc(100% + 15px);
//           left: 50%;
//           transform: translateX(-50%) translateY(-10px);
//           padding: 0.75rem 1rem;
//           background: rgba(20, 20, 40, 0.95);
//           border: 1px solid rgba(255, 255, 255, 0.1);
//           border-radius: 12px;
//           display: flex;
//           align-items: center;
//           gap: 0.75rem;
//           opacity: 0;
//           visibility: hidden;
//           transition: all 0.3s ease;
//           pointer-events: none;
//           white-space: nowrap;
//           z-index: 100;
//         }

//         .link-tooltip.visible {
//           opacity: 1;
//           visibility: visible;
//           transform: translateX(-50%) translateY(0);
//         }

//         .tooltip-icon {
//           font-size: 1.25rem;
//         }

//         .tooltip-content {
//           display: flex;
//           flex-direction: column;
//         }

//         .tooltip-label {
//           font-size: 0.875rem;
//           font-weight: 600;
//           color: #FBEAEB;
//         }

//         .tooltip-desc {
//           font-size: 0.75rem;
//           color: rgba(251, 234, 235, 0.6);
//         }

//         /* Active Indicator */
//         .active-indicator {
//           position: absolute;
//           bottom: -2px;
//           left: 50%;
//           transform: translateX(-50%) scaleX(0);
//           width: 20px;
//           height: 3px;
//           border-radius: 2px;
//           transition: transform 0.3s ease;
//         }

//         .active-indicator.visible {
//           transform: translateX(-50%) scaleX(1);
//         }

//         /* Current Page Badge */
//         .current-page-badge {
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//           padding: 0.5rem 1rem;
//           background: rgba(255, 255, 255, 0.05);
//           border: 1px solid rgba(255, 255, 255, 0.1);
//           border-radius: 9999px;
//           font-size: 0.875rem;
//           color: var(--badge-color);
//           font-weight: 600;
//           transition: all 0.3s ease;
//         }

//         .current-page-badge:hover {
//           background: rgba(255, 255, 255, 0.1);
//           transform: scale(1.05);
//         }

//         /* Mobile Toggle */
//         .mobile-toggle {
//           display: none;
//           position: relative;
//           width: 48px;
//           height: 48px;
//           background: rgba(255, 255, 255, 0.05);
//           border: 1px solid rgba(255, 255, 255, 0.1);
//           border-radius: 12px;
//           cursor: pointer;
//           align-items: center;
//           justify-content: center;
//           transition: all 0.3s ease;
//         }

//         .mobile-toggle:hover {
//           background: rgba(255, 255, 255, 0.1);
//         }

//         .toggle-icon {
//           position: relative;
//           width: 24px;
//           height: 18px;
//           display: flex;
//           flex-direction: column;
//           justify-content: space-between;
//         }

//         .toggle-icon span {
//           display: block;
//           width: 100%;
//           height: 2px;
//           background: #FBEAEB;
//           border-radius: 2px;
//           transition: all 0.3s ease;
//           transform-origin: center;
//         }

//         .toggle-icon.open span:nth-child(1) {
//           transform: translateY(8px) rotate(45deg);
//         }

//         .toggle-icon.open span:nth-child(2) {
//           opacity: 0;
//           transform: scaleX(0);
//         }

//         .toggle-icon.open span:nth-child(3) {
//           transform: translateY(-8px) rotate(-45deg);
//         }

//         .toggle-glow {
//           position: absolute;
//           inset: -2px;
//           border-radius: 14px;
//           background: linear-gradient(135deg, #917FB3, #4ECDC4);
//           opacity: 0;
//           z-index: -1;
//           filter: blur(8px);
//           transition: opacity 0.3s ease;
//         }

//         .mobile-toggle:hover .toggle-glow {
//           opacity: 0.5;
//         }

//         /* Mobile Menu */
//         .mobile-menu {
//           position: fixed;
//           inset: 0;
//           top: 70px;
//           background: rgba(10, 10, 26, 0.98);
//           backdrop-filter: blur(20px);
//           opacity: 0;
//           visibility: hidden;
//           transition: all 0.4s ease;
//           overflow-y: auto;
//           z-index: 999;
//         }

//         .mobile-menu.open {
//           opacity: 1;
//           visibility: visible;
//         }

//         .mobile-menu-bg {
//           position: absolute;
//           inset: 0;
//           overflow: hidden;
//           pointer-events: none;
//         }

//         .menu-orb {
//           position: absolute;
//           border-radius: 50%;
//           filter: blur(60px);
//           opacity: 0.3;
//         }

//         .menu-orb.orb-1 {
//           width: 300px;
//           height: 300px;
//           background: #917FB3;
//           top: -100px;
//           right: -100px;
//         }

//         .menu-orb.orb-2 {
//           width: 250px;
//           height: 250px;
//           background: #4ECDC4;
//           bottom: 20%;
//           left: -100px;
//         }

//         .mobile-menu-content {
//           position: relative;
//           z-index: 10;
//           padding: 2rem;
//           max-width: 500px;
//           margin: 0 auto;
//         }

//         .menu-header {
//           text-align: center;
//           margin-bottom: 2rem;
//           font-size: 1.125rem;
//           color: rgba(251, 234, 235, 0.8);
//         }

//         .menu-emoji {
//           display: block;
//           font-size: 3rem;
//           margin-bottom: 0.5rem;
//           animation: bounce 2s ease-in-out infinite;
//         }

//         @keyframes bounce {
//           0%, 100% { transform: translateY(0); }
//           50% { transform: translateY(-10px); }
//         }

//         .mobile-links {
//           list-style: none;
//           display: flex;
//           flex-direction: column;
//           gap: 0.75rem;
//         }

//         .mobile-item {
//           opacity: 0;
//           transform: translateX(-20px);
//           animation: slideIn 0.4s ease forwards;
//         }

//         .mobile-menu.open .mobile-item {
//           animation: slideIn 0.4s ease forwards;
//         }

//         @keyframes slideIn {
//           to {
//             opacity: 1;
//             transform: translateX(0);
//           }
//         }

//         .mobile-link {
//           display: flex;
//           align-items: center;
//           gap: 1rem;
//           padding: 1.25rem;
//           background: rgba(255, 255, 255, 0.03);
//           border: 1px solid rgba(255, 255, 255, 0.08);
//           border-radius: 16px;
//           color: rgba(251, 234, 235, 0.8);
//           text-decoration: none;
//           transition: all 0.3s ease;
//           position: relative;
//           overflow: hidden;
//         }

//         .mobile-link:hover,
//         .mobile-link.active {
//           background: rgba(255, 255, 255, 0.08);
//           border-color: var(--link-color);
//           color: var(--link-color);
//           transform: translateX(10px);
//         }

//         .mobile-link-icon {
//           font-size: 1.75rem;
//           transition: transform 0.3s ease;
//         }

//         .mobile-link:hover .mobile-link-icon {
//           transform: scale(1.2) rotate(10deg);
//         }

//         .mobile-link-content {
//           flex: 1;
//           display: flex;
//           flex-direction: column;
//         }

//         .mobile-link-label {
//           font-size: 1.125rem;
//           font-weight: 600;
//           color: #FBEAEB;
//           transition: color 0.3s ease;
//         }

//         .mobile-link:hover .mobile-link-label {
//           color: var(--link-color);
//         }

//         .mobile-link-desc {
//           font-size: 0.875rem;
//           color: rgba(251, 234, 235, 0.5);
//         }

//         .mobile-link-arrow {
//           font-size: 1.25rem;
//           opacity: 0;
//           transform: translateX(-10px);
//           transition: all 0.3s ease;
//         }

//         .mobile-link:hover .mobile-link-arrow {
//           opacity: 1;
//           transform: translateX(0);
//         }

//         .mobile-link-glow {
//           position: absolute;
//           inset: 0;
//           background: radial-gradient(circle at right center, var(--link-color) 0%, transparent 70%);
//           opacity: 0;
//           transition: opacity 0.3s ease;
//           pointer-events: none;
//         }

//         .mobile-link:hover .mobile-link-glow {
//           opacity: 0.1;
//         }

//         /* Mobile Footer */
//         .mobile-footer {
//           margin-top: 3rem;
//           text-align: center;
//           padding-top: 2rem;
//           border-top: 1px solid rgba(255, 255, 255, 0.08);
//         }

//         .footer-quote {
//           font-size: 0.9375rem;
//           color: rgba(251, 234, 235, 0.6);
//           font-style: italic;
//           margin-bottom: 1.5rem;
//         }

//         .social-hint {
//           display: inline-flex;
//           align-items: center;
//           gap: 0.5rem;
//           padding: 0.75rem 1.25rem;
//           background: rgba(145, 127, 179, 0.1);
//           border: 1px solid rgba(145, 127, 179, 0.2);
//           border-radius: 9999px;
//           font-size: 0.875rem;
//           color: #917FB3;
//           animation: pulse 2s ease-in-out infinite;
//         }

//         @keyframes pulse {
//           0%, 100% { box-shadow: 0 0 0 0 rgba(145, 127, 179, 0.4); }
//           50% { box-shadow: 0 0 0 10px rgba(145, 127, 179, 0); }
//         }

//         /* Scroll Progress */
//         .scroll-progress {
//           position: absolute;
//           bottom: 0;
//           left: 0;
//           right: 0;
//           height: 2px;
//           background: linear-gradient(90deg, #917FB3, #4ECDC4, #FF6B9D);
//           transform-origin: left;
//           transition: transform 0.1s ease, opacity 0.3s ease;
//         }

//         .progress-glow {
//           position: absolute;
//           inset: 0;
//           background: inherit;
//           filter: blur(4px);
//           opacity: 0.5;
//         }

//         /* Responsive */
//         @media (max-width: 1024px) {
//           .desktop-nav {
//             display: none;
//           }

//           .mobile-toggle {
//             display: flex;
//           }

//           .navbar {
//             padding: 0.875rem 1.5rem;
//           }
//         }

//         @media (min-width: 1025px) {
//           .mobile-menu {
//             display: none !important;
//           }
//         }

//         @media (max-width: 480px) {
//           .brand-text {
//             display: none;
//           }

//           .brand-orbit {
//             width: 40px;
//             height: 40px;
//           }

//           .brand-core {
//             width: 32px;
//             height: 32px;
//             font-size: 1rem;
//           }
//         }
//       `}</style>
//     </nav>
//   );
// };

// export default Navbar;






import React, { useState, useEffect, useCallback } from "react";
import { NavLink, useLocation } from "react-router-dom";

interface NavLinkItem {
  label: string;
  path: string;
  icon: string;
  color: string;
}

const navLinks: NavLinkItem[] = [
  { label: "Home", path: "/", icon: "🏠", color: "#FF6B9D" },
  { label: "Work", path: "/work", icon: "💼", color: "#4ECDC4" },
  { label: "Thinking", path: "/thinking", icon: "💭", color: "#F8B500" },
  { label: "Growth", path: "/growth", icon: "🌱", color: "#917FB3" },
  { label: "Experiments", path: "/experiments", icon: "🧪", color: "#FF6B6B" },
  { label: "Contact", path: "/contact", icon: "💌", color: "#C44569" },
];

// Theme types
type Theme = "light" | "dark";

// Custom hook for theme management
const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first, then system preference
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme") as Theme;
      if (saved) return saved;
    //   return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    // }
    // return "light";
    return "dark";}
    return "dark";
  });

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  return { theme, toggleTheme };
};

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isThemeSwitching, setIsThemeSwitching] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Handle scroll with throttling for performance
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleThemeToggle = () => {
    setIsThemeSwitching(true);
    toggleTheme();
    setTimeout(() => setIsThemeSwitching(false), 500);
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <nav 
        className={`navbar ${isScrolled ? "scrolled" : ""} ${theme} ${isMenuOpen ? "menu-open" : ""}`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Progress Bar */}
        <div className="scroll-progress" />

        {/* Ambient Glow */}
        <div className="navbar-glow" />

        <div className="navbar-container">
          {/* Logo */}
          <NavLink to="/" className="navbar-logo" aria-label="Home">
            <span className="logo-icon">✦</span>
            <span className="logo-text">TOMESH</span>
            <span className="logo-dot" style={{ background: navLinks.find(l => isActive(l.path))?.color || "#917FB3" }} />
          </NavLink>

          {/* Desktop Navigation */}
          <ul className="navbar-links" role="menubar">
            {navLinks.map((link, index) => (
              <li 
                key={link.label} 
                className="navbar-item"
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <NavLink
                  to={link.path}
                  className={`navbar-link ${isActive(link.path) ? "active" : ""}`}
                  role="menuitem"
                  style={{
                    "--link-color": link.color,
                  } as React.CSSProperties}
                >
                  <span className="link-icon">{link.icon}</span>
                  <span className="link-text">{link.label}</span>
                  {isActive(link.path) && <span className="active-indicator" />}
                </NavLink>
                
                {/* Hover tooltip */}
                <div className={`link-tooltip ${activeIndex === index ? "visible" : ""}`} style={{ background: link.color }}>
                  {link.label}
                </div>
              </li>
            ))}
          </ul>

          {/* Right Section: Theme Toggle + Mobile Menu */}
          <div className="navbar-actions">
            {/* Theme Toggle */}
            <button
              className={`theme-toggle ${isThemeSwitching ? "switching" : ""}`}
              onClick={handleThemeToggle}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              <span className="toggle-track">
                <span className="toggle-thumb">
                  <span className="toggle-icon">{theme === "light" ? "☀️" : "🌙"}</span>
                </span>
              </span>
              <span className="toggle-glow" />
            </button>

            {/* Mobile Hamburger */}
            <button
              className={`hamburger ${isMenuOpen ? "open" : ""}`}
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-controls="mobile-menu"
            >
              <span className="hamburger-line" />
              <span className="hamburger-line" />
              <span className="hamburger-line" />
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div 
          className={`mobile-overlay ${isMenuOpen ? "visible" : ""}`}
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Mobile Menu */}
        <div 
          id="mobile-menu"
          className={`mobile-menu ${isMenuOpen ? "open" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div className="mobile-menu-header">
            <span className="mobile-greeting">👋 Where to?</span>
            <button 
              className="mobile-close"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          <nav className="mobile-nav">
            {navLinks.map((link, index) => (
              <NavLink
                key={link.label}
                to={link.path}
                className={`mobile-link ${isActive(link.path) ? "active" : ""}`}
                style={{ 
                  "--link-color": link.color,
                  animationDelay: `${index * 50}ms`,
                } as React.CSSProperties}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mobile-link-icon" style={{ background: `${link.color}20` }}>
                  {link.icon}
                </span>
                <div className="mobile-link-content">
                  <span className="mobile-link-label">{link.label}</span>
                  <span className="mobile-link-hint">
                    {link.label === "Home" && "Start here"}
                    {link.label === "Work" && "See my projects"}
                    {link.label === "Thinking" && "Read my thoughts"}
                    {link.label === "Growth" && "My journey"}
                    {link.label === "Experiments" && "Playful prototypes"}
                    {link.label === "Contact" && "Let's talk"}
                  </span>
                </div>
                <span className="mobile-link-arrow">→</span>
              </NavLink>
            ))}
          </nav>

          {/* Mobile Theme Toggle */}
          <div className="mobile-theme-section">
            <span>Appearance</span>
            <button
              className={`mobile-theme-toggle ${theme}`}
              onClick={handleThemeToggle}
            >
              <span>{theme === "light" ? "☀️ Light" : "🌙 Dark"}</span>
              <div className="mobile-toggle-switch" />
            </button>
          </div>

          {/* Mobile Footer */}
          <div className="mobile-footer">
            <p>✨ Crafted with curiosity</p>
            <div className="mobile-socials">
              <a href="#github" aria-label="GitHub">⚡</a>
              <a href="#linkedin" aria-label="LinkedIn">💼</a>
              <a href="#twitter" aria-label="Twitter">🐦</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content jump */}
      <div className="navbar-spacer" />

      <style>{`
  /* CSS Variables for theming */
  :root {
    --nav-bg: rgba(251, 234, 235, 0.85);
    --nav-bg-scrolled: rgba(251, 234, 235, 0.95);
    --nav-text: #2F3C7E;
    --nav-text-hover: #917FB3;
    --nav-border: rgba(47, 60, 126, 0.1);
    --nav-shadow: rgba(47, 60, 126, 0.15);
    --menu-bg: rgba(251, 234, 235, 0.98);
    --toggle-bg: rgba(47, 60, 126, 0.1);
    --toggle-thumb: #FBEAEB;
  }

  [data-theme="dark"] {
    --nav-bg: rgba(15, 15, 35, 0.85);
    --nav-bg-scrolled: rgba(15, 15, 35, 0.95);
    --nav-text: #FBEAEB;
    --nav-text-hover: #917FB3;
    --nav-border: rgba(145, 127, 179, 0.2);
    --nav-shadow: rgba(0, 0, 0, 0.3);
    --menu-bg: rgba(15, 15, 35, 0.98);
    --toggle-bg: rgba(145, 127, 179, 0.2);
    --toggle-thumb: #1a1a3e;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* NAVBAR - HIGHEST PRIORITY */
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2147483647 !important; /* Maximum z-index */
    background-color: var(--nav-bg);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--nav-border);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    padding: 1rem 1.5rem;
    isolation: isolate; /* Create new stacking context */
  }

  .navbar.scrolled {
    padding: 0.75rem 1.5rem;
    background-color: var(--nav-bg-scrolled);
    box-shadow: 0 4px 30px -10px var(--nav-shadow);
  }

  .navbar.menu-open {
    background-color: var(--nav-bg-scrolled);
  }

  /* Scroll Progress Bar */
  .scroll-progress {
    position: absolute;
    top: 0;
    left: 0;
    height: 2px;
    background: linear-gradient(90deg, #FF6B9D, #4ECDC4, #F8B500, #917FB3);
    width: 0%;
    transition: width 0.1s;
    animation: progressGrow linear;
    animation-timeline: scroll();
    z-index: 2147483647;
  }

  @keyframes progressGrow {
    from { width: 0%; }
    to { width: 100%; }
  }

  /* Ambient Glow */
  .navbar-glow {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 50% 0%, rgba(145, 127, 179, 0.1) 0%, transparent 70%);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s;
    z-index: -1;
  }

  .navbar.scrolled .navbar-glow {
    opacity: 1;
  }

  /* Container */
  .navbar-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 2147483647;
  }

  /* Logo */
  .navbar-logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--nav-text);
    transition: all 0.3s ease;
    position: relative;
    z-index: 2147483647;
  }

  .logo-icon {
    font-size: 1.25rem;
    animation: iconPulse 3s ease-in-out infinite;
  }

  @keyframes iconPulse {
    0%, 100% { transform: scale(1) rotate(0deg); }
    50% { transform: scale(1.1) rotate(5deg); }
  }

  .logo-text {
    letter-spacing: -0.02em;
  }

  .logo-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    transition: all 0.3s ease;
    animation: dotPulse 2s ease-in-out infinite;
  }

  @keyframes dotPulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.3); opacity: 0.7; }
  }

  .navbar-logo:hover {
    transform: scale(1.02);
  }

  /* Desktop Navigation */
  .navbar-links {
    display: flex;
    list-style: none;
    gap: 0.5rem;
    align-items: center;
    z-index: 2147483647;
  }

  .navbar-item {
    position: relative;
    z-index: 2147483647;
  }

  .navbar-link {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.5rem 1rem;
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--nav-text);
    text-decoration: none;
    border-radius: 12px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    z-index: 2147483647;
  }

  .navbar-link::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, var(--link-color) 0%, transparent 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
    border-radius: 12px;
  }

  .navbar-link:hover::before,
  .navbar-link.active::before {
    opacity: 0.1;
  }

  .navbar-link:hover,
  .navbar-link.active {
    color: var(--link-color);
  }

  .link-icon {
    font-size: 1rem;
    transition: transform 0.3s ease;
  }

  .navbar-link:hover .link-icon {
    transform: scale(1.2) rotate(-5deg);
  }

  .link-text {
    position: relative;
    z-index: 1;
  }

  .active-indicator {
    position: absolute;
    bottom: 4px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 4px;
    background: var(--link-color);
    border-radius: 50%;
    box-shadow: 0 0 10px var(--link-color);
  }

  /* Link Tooltip */
  .link-tooltip {
    position: absolute;
    top: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%) translateY(-10px);
    padding: 0.375rem 0.75rem;
    border-radius: 8px;
    font-size: 0.75rem;
    font-weight: 600;
    color: white;
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s ease;
    white-space: nowrap;
    z-index: 2147483647;
  }

  .link-tooltip.visible {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  .link-tooltip::before {
    content: '';
    position: absolute;
    top: -4px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 4px solid inherit;
  }

  /* Actions */
  .navbar-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
    z-index: 2147483647;
  }

  /* Theme Toggle */
  .theme-toggle {
    position: relative;
    width: 52px;
    height: 28px;
    background: var(--toggle-bg);
    border: none;
    border-radius: 9999px;
    cursor: pointer;
    padding: 0;
    transition: all 0.3s ease;
    overflow: visible;
    z-index: 2147483647;
  }

  .theme-toggle:hover {
    transform: scale(1.05);
  }

  .theme-toggle.switching {
    pointer-events: none;
  }

  .toggle-track {
    position: absolute;
    inset: 0;
    border-radius: 9999px;
    overflow: hidden;
  }

  .toggle-thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 24px;
    height: 24px;
    background: var(--toggle-thumb);
    border-radius: 50%;
    transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  [data-theme="dark"] .toggle-thumb {
    transform: translateX(24px);
  }

  .toggle-icon {
    font-size: 14px;
    transition: all 0.3s ease;
    animation: iconSpin 0.5s ease;
  }

  @keyframes iconSpin {
    from { transform: rotate(-180deg) scale(0); }
    to { transform: rotate(0) scale(1); }
  }

  .toggle-glow {
    position: absolute;
    inset: -4px;
    border-radius: 9999px;
    background: linear-gradient(135deg, #FF6B9D, #4ECDC4, #F8B500, #917FB3);
    opacity: 0;
    transition: opacity 0.3s;
    z-index: -1;
    filter: blur(8px);
  }

  .theme-toggle:hover .toggle-glow {
    opacity: 0.5;
  }

  /* HAMBURGER - ALWAYS ON TOP */
  /* HAMBURGER - ALWAYS VISIBLE */
.hamburger {
  display: none;
  width: 44px; /* Slightly larger for better touch */
  height: 44px; /* Square button */
  background: var(--toggle-bg); /* Use toggle background for visibility */
  border: 1px solid var(--nav-border); /* Add border for definition */
  border-radius: 12px; /* Rounded corners */
  cursor: pointer;
  padding: 0;
  position: relative;
  z-index: 2147483647 !important;
  align-items: center;
  justify-content: center; /* Center the lines */
  transition: all 0.3s ease;
}

.hamburger:hover {
  background: rgba(145, 127, 179, 0.2); /* Subtle hover effect */
  transform: scale(1.05);
}

.hamburger-line {
  position: absolute;
  left: 50%; /* Center horizontally */
  transform: translateX(-50%); /* Center fix */
  width: 20px; /* Slightly shorter lines */
  height: 2.5px;
  background: var(--nav-text); /* This will be dark in light theme, light in dark theme */
  border-radius: 2px;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Position lines with centering */
.hamburger-line:nth-child(1) { top: 14px; }
.hamburger-line:nth-child(2) { top: 50%; transform: translate(-50%, -50%); }
.hamburger-line:nth-child(3) { bottom: 14px; }

/* Open state animations */
.hamburger.open .hamburger-line:nth-child(1) {
  top: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
}

.hamburger.open .hamburger-line:nth-child(2) {
  opacity: 0;
  transform: translateX(-20px);
}

.hamburger.open .hamburger-line:nth-child(3) {
  bottom: 50%;
  transform: translate(-50%, 50%) rotate(-45deg);
}

  /* MOBILE OVERLAY - FULL SCREEN */
  .mobile-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(8px);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 2147483646 !important; /* Just below navbar */
  }

  .mobile-overlay.visible {
    opacity: 1;
    visibility: visible;
  }

  /* MOBILE MENU - FULL SCREEN OVERLAY */
  .mobile-menu {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    height: 100dvh; /* Dynamic viewport height for mobile */
    background: var(--menu-bg);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    transform: translateX(100%);
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 2147483647 !important; /* SAME AS NAVBAR */
    display: flex;
    flex-direction: column;
    padding: 5rem 1.5rem 1.5rem; /* Top padding for navbar */
    overflow-y: auto;
    box-sizing: border-box;
  }

  .mobile-menu.open {
    transform: translateX(0);
  }

  .mobile-menu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--nav-border);
    flex-shrink: 0;
  }

  .mobile-greeting {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--nav-text);
  }

  .mobile-close {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    border: none;
    background: var(--toggle-bg);
    color: var(--nav-text);
    font-size: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2147483647;
  }

  .mobile-close:hover {
    background: rgba(255, 107, 157, 0.2);
    transform: rotate(90deg);
  }

  .mobile-nav {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    overflow-y: auto;
  }

  .mobile-link {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    text-decoration: none;
    color: var(--nav-text);
    transition: all 0.3s ease;
    opacity: 0;
    transform: translateX(30px);
    flex-shrink: 0;
  }

  .mobile-menu.open .mobile-link {
    animation: slideIn 0.4s ease forwards;
  }

  @keyframes slideIn {
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .mobile-link:hover,
  .mobile-link.active {
    background: rgba(255, 255, 255, 0.08);
    border-color: var(--link-color);
    transform: translateX(10px);
  }

  .mobile-link-icon {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.75rem;
    transition: transform 0.3s ease;
    flex-shrink: 0;
  }

  .mobile-link:hover .mobile-link-icon {
    transform: scale(1.1) rotate(-5deg);
  }

  .mobile-link-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .mobile-link-label {
    font-size: 1.125rem;
    font-weight: 700;
    color: #FBEAEB;
  }
  [data-theme="light"] .mobile-link-label {
    color: var(--nav-text);
  }

  .mobile-link-hint {
    font-size: 0.875rem;
    color: rgba(251, 234, 235, 0.6);
  }
  [data-theme="light"] .mobile-link-hint {
    color: var(--nav-text);
  }

  .mobile-link-arrow {
    font-size: 1.5rem;
    opacity: 0;
    transform: translateX(-10px);
    transition: all 0.3s ease;
    color: var(--link-color);
  }

  .mobile-link:hover .mobile-link-arrow {
    opacity: 1;
    transform: translateX(0);
  }

  /* Mobile Theme Section */
  .mobile-theme-section {
    margin: 1.5rem 0;
    padding: 1.25rem;
    background: var(--toggle-bg);
    border-radius: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
  }

  .mobile-theme-section span {
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--nav-text);
  }

  .mobile-theme-toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 9999px;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--nav-text);
    transition: all 0.3s ease;
  }

  .mobile-theme-toggle.light {
    background: rgba(255, 214, 165, 0.3);
  }

  .mobile-theme-toggle.dark {
    background: rgba(145, 127, 179, 0.3);
  }

  .mobile-toggle-switch {
    width: 36px;
    height: 20px;
    background: var(--nav-text);
    border-radius: 9999px;
    position: relative;
    transition: background 0.3s;
  }

  .mobile-toggle-switch::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    background: white;
    border-radius: 50%;
    transition: transform 0.3s;
  }

  .mobile-theme-toggle.dark .mobile-toggle-switch::after {
    transform: translateX(16px);
  }

  /* Mobile Footer */
  .mobile-footer {
    padding-top: 1.5rem;
    border-top: 1px solid var(--nav-border);
    text-align: center;
    flex-shrink: 0;
  }

  .mobile-footer p {
    font-size: 0.875rem;
    color: rgba(251, 234, 235, 0.6);
    margin-bottom: 1rem;
  }
  [data-theme="light"] .mobile-footer p {
    color: var(--nav-text);
  }

  .mobile-socials {
    display: flex;
    justify-content: center;
    gap: 1rem;
  }

  .mobile-socials a {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: var(--toggle-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    text-decoration: none;
    transition: all 0.3s ease;
    color: var(--nav-text);
  }

  .mobile-socials a:hover {
    transform: translateY(-3px);
    background: rgba(145, 127, 179, 0.2);
  }

  /* Spacer */
  .navbar-spacer {
    height: 40px;
  }

  /* RESPONSIVE */
  @media (max-width: 900px) {
    .navbar-links {
      display: none;
    }

    .hamburger {
      display: flex !important; /* FORCE SHOW */
    }

    .navbar {
      padding: 0.875rem 1.25rem;
    }
  }

  @media (min-width: 901px) {
    .mobile-menu,
    .mobile-overlay {
      display: none !important;
    }
  }

  @media (max-width: 480px) {
    .logo-text {
      display: none;
    }

    .navbar-logo {
      font-size: 1.25rem;
    }

    .theme-toggle {
      width: 44px;
      height: 24px;
    }

    .toggle-thumb {
      width: 20px;
      height: 20px;
    }

    [data-theme="dark"] .toggle-thumb {
      transform: translateX(20px);
    }

    .navbar-spacer {
      height: 34px;
    }

    .mobile-menu {
      padding-top: 4.5rem;
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
`}</style>
    </>
  );
};

export default Navbar;