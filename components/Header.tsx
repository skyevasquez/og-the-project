import React, { useState, useEffect } from 'react';
import { Menu, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_ITEMS } from '../constants';
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const scrollToNewsletter = () => {
    // Close mobile menu if open
    setIsMobileMenuOpen(false);
    
    // If not on home page, navigate there first
    if (window.location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const newsletterSection = document.getElementById('newsletter-signup');
        if (newsletterSection) {
          newsletterSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    } else {
      // Already on home page, just scroll
      const newsletterSection = document.getElementById('newsletter-signup');
      if (newsletterSection) {
        newsletterSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <>
      {/* Top Ticker */}
      <div className="bg-og-dark text-white text-xs font-bold py-2 overflow-hidden whitespace-nowrap border-b border-gray-800">
        <motion.div
          className="inline-block"
          animate={{ x: "-100%" }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        >
          <span className="mx-4">OG THE PROJECT: LAUNCHING Q1 2026</span> •
          <span className="mx-4 text-og-orange">OCALA & GAINESVILLE'S WEEKLY CHEAT SHEET</span> •
          <span className="mx-4">LIFESTYLE • NEWS • EVENTS • CULTURE</span> •
          <span className="mx-4 text-og-green">SUBSCRIBE TODAY FOR FREE</span> •
          <span className="mx-4">OG THE PROJECT: LAUNCHING Q1 2026</span> •
          <span className="mx-4 text-og-orange">OCALA & GAINESVILLE'S WEEKLY CHEAT SHEET</span> •
          <span className="mx-4">LIFESTYLE • NEWS • EVENTS • CULTURE</span> •
          <span className="mx-4 text-og-green">SUBSCRIBE TODAY FOR FREE</span> •
        </motion.div>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 border-b-4 border-og-blue ${isScrolled ? 'bg-white shadow-lg py-2' : 'bg-og-cream py-4'
          }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-og-dark"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-og-blue rounded-full flex items-center justify-center text-white font-display font-bold text-xl border-2 border-og-orange group-hover:bg-og-orange group-hover:border-og-blue transition-colors">
              OG
            </div>
            <div className="flex flex-col">
              <span className={`font-display font-bold leading-none tracking-tighter text-og-dark ${isScrolled ? 'text-2xl' : 'text-3xl'}`}>
                THE PROJECT
              </span>
              <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-og-green uppercase">
                Ocala.Gainesville
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                to={`/category/${item.value.toLowerCase()}`}
                className="text-sm font-bold uppercase tracking-widest hover:text-og-orange transition-colors relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-1 bg-og-orange transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="hidden md:block p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Search className="w-5 h-5 text-gray-600" />
            </button>
            <button 
              onClick={scrollToNewsletter}
              className="bg-og-orange hover:bg-orange-600 text-white text-xs md:text-sm font-bold px-4 py-2 uppercase tracking-wider transition-transform hover:-translate-y-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              Subscribe
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[60] bg-og-dark"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-800">
              <span className="font-display text-2xl font-bold text-white">MENU</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-white">
                <X className="w-8 h-8" />
              </button>
            </div>
            <nav className="flex flex-col p-8 gap-6">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(`/category/${item.value.toLowerCase()}`)}
                  className="text-3xl font-display font-bold text-white uppercase text-left hover:text-og-orange transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <hr className="border-gray-800 my-4" />
              <button onClick={() => handleNavClick('/about')} className="text-xl font-serif text-gray-400 text-left">About Us</button>
              <button onClick={() => handleNavClick('/contact')} className="text-xl font-serif text-gray-400 text-left">Contact</button>
            </nav>
            <div className="absolute bottom-0 w-full p-8 bg-gray-900">
              <button 
                onClick={scrollToNewsletter}
                className="w-full bg-og-orange text-white font-display font-bold text-xl py-4 uppercase"
              >
                Subscribe Free
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;