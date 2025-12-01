import React from 'react';
import { ARTICLES } from '../constants';
import Hero from './Hero';
import ArticleCard from './ArticleCard';
import Newsletter from './Newsletter';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
    const featuredArticle = ARTICLES.find(a => a.isFeatured) || ARTICLES[0];
    const remainingArticles = ARTICLES.filter(a => a.id !== featuredArticle.id);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <Hero />

            <section className="container mx-auto px-4 py-16" id="latest-stories">
                <div className="flex items-center justify-between mb-8 border-b-2 border-gray-200 pb-4">
                    <h2 className="font-display text-4xl font-bold text-og-dark uppercase">Latest Stories</h2>
                    <div className="hidden md:flex gap-2">
                        <span className="w-3 h-3 bg-og-orange rounded-full"></span>
                        <span className="w-3 h-3 bg-og-blue rounded-full"></span>
                        <span className="w-3 h-3 bg-og-green rounded-full"></span>
                    </div>
                </div>

                {/* Grid Layout mimicking The Gist */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Featured Article (Left/Top) */}
                    <div className="lg:col-span-3">
                        <ArticleCard
                            article={featuredArticle}
                            featured={true}
                        />
                    </div>

                    {/* Sub Articles */}
                    {remainingArticles.map((article) => (
                        <ArticleCard
                            key={article.id}
                            article={article}
                        />
                    ))}
                </div>
            </section>

            <Newsletter />
        </motion.div>
    );
};

export default HomePage;
