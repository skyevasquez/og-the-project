import React from 'react';
import { Article } from '../types';
import { Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, featured = false }) => {
  return (
    <Link
      to={`/article/${article.id}`}
      className={`group cursor-pointer block h-full ${featured ? 'flex flex-col md:flex-row gap-8 items-center' : 'flex flex-col'}`}
    >
      <div className={`overflow-hidden relative ${featured ? 'w-full md:w-2/3 h-64 md:h-96' : 'w-full h-64'}`}>
        <div className="absolute inset-0 bg-og-blue opacity-0 group-hover:opacity-20 transition-opacity z-10"></div>
        <img
          src={article.image || "/images/placeholder.png"}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 z-20">
          <span className="bg-og-orange text-white text-xs font-bold px-3 py-1 uppercase tracking-wider shadow-md">
            {article.category}
          </span>
        </div>
      </div>

      <div className={`flex flex-col ${featured ? 'w-full md:w-1/3 py-6' : 'py-6 flex-grow'}`}>
        <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase mb-3">
          <Calendar className="w-3 h-3" />
          <span>{article.date}</span>
        </div>

        <h3 className={`font-display font-bold leading-tight text-og-dark group-hover:text-og-blue transition-colors mb-4 ${featured ? 'text-3xl md:text-4xl' : 'text-2xl'}`}>
          {article.title}
        </h3>

        <p className="font-serif text-gray-600 mb-6 line-clamp-3 text-sm leading-relaxed flex-grow">
          {article.excerpt}
        </p>

        <div className="mt-auto flex items-center gap-2 text-og-orange font-bold uppercase text-sm tracking-wider group-hover:gap-3 transition-all">
          Read Story <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;