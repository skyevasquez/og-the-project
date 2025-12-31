
import React from 'react';
import { motion } from 'framer-motion';

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ title, subtitle, children }) => {
  return (
    <motion.div 
      className="container mx-auto px-4 py-16 md:py-24 max-w-4xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-center mb-16">
        <h1 className="font-display text-5xl md:text-7xl font-bold uppercase text-og-dark mb-6 leading-none">{title}</h1>
        {subtitle && (
          <p className="font-serif text-xl md:text-2xl text-gray-500 italic max-w-2xl mx-auto">{subtitle}</p>
        )}
        <div className="w-24 h-2 bg-og-orange mx-auto mt-8"></div>
      </div>
      
      <div className="prose prose-lg prose-headings:font-display prose-headings:uppercase prose-a:text-og-blue hover:prose-a:text-og-orange max-w-none font-serif text-gray-800 leading-loose">
        {children}
      </div>
    </motion.div>
  );
};

export default PageLayout;
