import React, { useState, useEffect } from 'react';
import Hero from './Hero';
import ArticleCard from './ArticleCard';
import Newsletter from './Newsletter';
import { motion } from 'framer-motion';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  author: string;
  date: string;
  image?: string;
  isFeatured?: boolean;
}

const HomePage: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch('/api/articles');
                if (response.ok) {
                    const data = await response.json();
                    setArticles(data);
                }
            } catch (error) {
                console.error('Failed to fetch articles:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    const featuredArticle = articles.find(a => a.isFeatured) || articles[0];
    const remainingArticles = articles.filter(a => a.id !== featuredArticle?.id);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse font-display text-2xl font-bold text-og-dark">Loading...</div>
            </div>
        );
    }

    if (articles.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <Hero />
                <section className="container mx-auto px-4 py-16 text-center">
                    <h2 className="font-display text-4xl font-bold text-og-dark uppercase mb-4">No stories yet</h2>
                    <p className="font-serif text-gray-600">Check back soon for new stories from The OG Project.</p>
                </section>
                <Newsletter />
            </motion.div>
        );
    }

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
                    {featuredArticle && (
                        <div className="lg:col-span-3">
                            <ArticleCard
                                article={featuredArticle}
                                featured={true}
                            />
                        </div>
                    )}

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
