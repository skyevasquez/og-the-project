
import React from 'react';
import { ASSETS } from '../constants';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section className="relative w-full h-[60vh] md:h-[70vh] bg-gray-900 overflow-hidden border-b-4 border-og-orange">
      <div className="absolute inset-0">
        <img
          src={ASSETS.banner}
          alt="Ocala and Gainesville Landscape"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-og-dark via-transparent to-transparent opacity-90"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-12 md:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <span className="inline-block bg-og-green text-white text-sm font-bold px-3 py-1 mb-4 uppercase tracking-widest">
            Weekly Cheat Sheet
          </span>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white font-bold leading-[0.9] uppercase mb-6 drop-shadow-lg">
            If it matters <span className="text-transparent bg-clip-text bg-gradient-to-r from-og-orange to-white">this week</span>,<br />
            it's in The OG Project.
          </h1>
          <p className="text-gray-300 font-serif text-lg md:text-xl max-w-2xl mb-8 leading-relaxed">
            Your new guide to Ocala & Gainesville. Lifestyle, local news, hot topics, events, and culture.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => {
                const element = document.getElementById('latest-stories');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white text-og-dark font-display font-bold text-lg px-8 py-3 uppercase tracking-wider hover:bg-gray-200 transition-colors shadow-[4px_4px_0px_0px_rgba(250,70,22,1)]"
            >
              Read Latest Issue
            </button>
            <Link
              to="/about"
              className="inline-block text-center bg-transparent border-2 border-white text-white font-display font-bold text-lg px-8 py-3 uppercase tracking-wider hover:bg-white hover:text-og-dark transition-colors"
            >
              About Us
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
