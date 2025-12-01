import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ARTICLES } from '../constants';
import ArticleCard from './ArticleCard';
import { motion } from 'framer-motion';

const CategoryPage: React.FC = () => {
    const { category } = useParams<{ category: string }>();

    const categoryArticles = useMemo(() =>
        category
            ? ARTICLES.filter(a => a.category.toLowerCase() === category.toLowerCase())
            : [],
        [category]
    );

    // Helper to format category title nicely
    const displayCategory = category ? category.charAt(0).toUpperCase() + category.slice(1) : '';

    return (
        <motion.div
            className="container mx-auto px-4 py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
        >
            <div className="mb-12 text-center">
                <span className="text-og-orange font-bold uppercase tracking-widest text-sm mb-2 block">Browsing Category</span>
                <h1 className="font-display text-6xl font-bold text-og-dark uppercase">{displayCategory}</h1>
            </div>

            {categoryArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categoryArticles.map(article => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white border-2 border-gray-100">
                    <p className="font-serif text-xl text-gray-500">No stories found in this section yet. Check back next week!</p>
                    <Link to="/" className="mt-6 inline-block text-og-blue font-bold hover:underline uppercase">Back Home</Link>
                </div>
            )}
        </motion.div>
    );
};

export default CategoryPage;
