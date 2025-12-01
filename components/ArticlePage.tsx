import React, { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ARTICLES } from '../constants';
import { ArrowLeft, Share2, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const ArticlePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const currentArticle = useMemo(() =>
        id ? ARTICLES.find(a => a.id === id) : null,
        [id]
    );

    if (!currentArticle) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-og-cream">
                <h1 className="font-display text-4xl font-bold text-og-dark mb-4">Article Not Found</h1>
                <Link to="/" className="text-og-blue font-bold hover:underline uppercase">Back to Home</Link>
            </div>
        );
    }

    return (
        <motion.article
            className="bg-white min-h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Article Header */}
            <div className="bg-og-dark text-white pt-12 pb-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-og-blue rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>

                <div className="container mx-auto px-4 relative z-10 max-w-4xl">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors text-sm font-bold uppercase tracking-wider"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>

                    <div className="flex items-center gap-4 mb-6">
                        <span className="bg-og-orange text-white text-xs font-bold px-3 py-1 uppercase tracking-wider">{currentArticle.category}</span>
                        <span className="flex items-center gap-1 text-gray-400 text-xs font-bold uppercase">
                            <Calendar className="w-3 h-3" /> {currentArticle.date}
                        </span>
                    </div>

                    <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-8">
                        {currentArticle.title}
                    </h1>

                    <div className="flex items-center justify-between border-t border-gray-700 pt-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
                            <div>
                                <p className="font-bold text-sm uppercase">By {currentArticle.author}</p>
                                <p className="text-xs text-gray-400">The OG Project Contributor</p>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 text-gray-400 hover:text-og-orange transition-colors">
                            <Share2 className="w-5 h-5" /> <span className="hidden sm:inline text-xs font-bold uppercase">Share</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Article Content */}
            <div className="container mx-auto px-4 max-w-3xl -mt-16 relative z-20 pb-20">
                {currentArticle.image && (
                    <div className="mb-12 shadow-2xl border-4 border-white">
                        <img src={currentArticle.image} alt={currentArticle.title} className="w-full h-auto" />
                    </div>
                )}

                <div className="font-serif text-lg leading-loose text-gray-800 space-y-6">
                    <p className="font-bold text-xl md:text-2xl text-og-blue leading-relaxed">
                        {currentArticle.excerpt}
                    </p>
                    <div className="w-20 h-1 bg-og-orange my-8"></div>
                    {currentArticle.content.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </div>

                {/* Tags / CTA */}
                <div className="mt-16 p-8 bg-og-cream border border-gray-200 rounded-lg text-center">
                    <h3 className="font-display text-2xl font-bold mb-4 uppercase">Liked this story?</h3>
                    <p className="font-serif text-gray-600 mb-6">Subscribe to The OG Project to get stories like this delivered to your inbox every week.</p>
                    <button className="bg-og-dark text-white font-display font-bold px-8 py-3 uppercase hover:bg-og-orange transition-colors">
                        Get the Newsletter
                    </button>
                </div>
            </div>
        </motion.article>
    );
};

export default ArticlePage;
