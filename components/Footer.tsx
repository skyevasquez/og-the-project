import React from 'react';
import { NAV_ITEMS } from '../constants';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-og-dark text-white pt-20 pb-10 border-t-8 border-og-orange">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-og-blue rounded-full flex items-center justify-center text-white font-display font-bold text-xl border-2 border-og-orange">
                OG
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold leading-none tracking-tighter text-white text-2xl">
                  THE PROJECT
                </span>
                <span className="text-[10px] font-bold tracking-[0.2em] text-og-green uppercase">
                  Ocala.Gainesville
                </span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Your weekly cheat sheet for everything happening in Ocala and Gainesville. Local news, lifestyle, and culture delivered with a fresh perspective.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-lg uppercase mb-6 text-og-orange">Sections</h4>
            <ul className="space-y-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <Link
                    to={`/category/${item.value.toLowerCase()}`}
                    className="text-gray-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-wider"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-bold text-lg uppercase mb-6 text-og-orange">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-wider">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/advertise" className="text-gray-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-wider">
                  Advertise
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-wider">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-wider">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-1">
            <h4 className="font-display font-bold text-lg uppercase mb-6 text-og-orange">Stay in the Loop</h4>
            <p className="text-gray-400 text-sm mb-4">Join our mailing list to get the latest news and updates.</p>
            <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                className="bg-gray-800 border border-gray-700 text-white px-4 py-3 focus:outline-none focus:border-og-blue text-sm"
              />
              <button className="bg-white text-og-dark font-display font-bold uppercase py-3 hover:bg-og-orange hover:text-white transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Social Media Icons - Centered */}
        <div className="flex justify-center items-center gap-3 py-8 border-t border-gray-800">
          <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-og-orange transition-colors cursor-pointer group">
            <Facebook className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          </a>
          <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-black transition-colors cursor-pointer group">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current text-gray-400 group-hover:text-white transition-colors">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-og-green transition-colors cursor-pointer group">
            <Instagram className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          </a>
          <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer group">
            <Youtube className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          </a>
          <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-black transition-colors cursor-pointer group">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current text-gray-400 group-hover:text-white transition-colors">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
            </svg>
          </a>
          <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#FF6719] transition-colors cursor-pointer group">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current text-gray-400 group-hover:text-white transition-colors">
              <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
            </svg>
          </a>
          <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#0085ff] transition-colors cursor-pointer group">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current text-gray-400 group-hover:text-white transition-colors">
              <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.685-6.262 7.823-8.316 1.137 2.054 2.809 13.506 7.823 8.316 4.557-5.073 1.083-6.498-2.83-7.078-.139-.016-.277-.034-.415-.056.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z" />
            </svg>
          </a>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            © 2025 The OG Project. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs font-serif italic">
            "If it matters this week, it's in The OG Project."
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
