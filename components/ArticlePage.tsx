import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Calendar, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSubscription } from '../hooks/useSubscription';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  author: string;
  date: string;
  image?: string;
  slugUrl?: string;
}

const ArticlePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const { isSubscribed, subscriberEmail, isLoading: subLoading, verifyEmail } = useSubscription();

    // Fetch article from API
    useEffect(() => {
        const fetchArticle = async () => {
            if (!id) return;

            setLoading(true);
            try {
                const response = await fetch(`/api/articles?id=${encodeURIComponent(id)}`);
                if (!response.ok) {
                    setArticle(null);
                    return;
                }
                const data = await response.json();
                setArticle(data);
            } catch (error) {
                console.error('Failed to fetch article:', error);
                setArticle(null);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [id]);

    const handleVerifyEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setVerifying(true);
        setMessage(null);

        const result = await verifyEmail(email);

        if (result.success) {
            setMessage({ type: 'success', text: result.message || 'Subscription verified!' });
        } else {
            setMessage({ type: 'error', text: result.message || 'Verification failed.' });
        }

        setVerifying(false);
    };

    const scrollToNewsletter = () => {
        const element = document.getElementById('newsletter-signup');
        element?.scrollIntoView({ behavior: 'smooth' });
    };

    if (loading || subLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-og-cream">
                <div className="animate-pulse font-display text-2xl font-bold text-og-dark">Loading...</div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-og-cream">
                <h1 className="font-display text-4xl font-bold text-og-dark mb-4">Article Not Found</h1>
                <Link to="/" className="text-og-blue font-bold hover:underline uppercase">Back to Home</Link>
            </div>
        );
    }

    const showLockedContent = !isSubscribed;
    const firstParagraph = article.content[0] || article.excerpt;

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

                    <div className="flex items-center gap-4 mb-6 flex-wrap">
                        <span className="bg-og-orange text-white text-xs font-bold px-3 py-1 uppercase tracking-wider">
                            {article.category}
                        </span>
                        <span className="flex items-center gap-1 text-gray-400 text-xs font-bold uppercase">
                            <Calendar className="w-3 h-3" /> {article.date}
                        </span>
                        {isSubscribed && (
                            <span className="bg-og-green text-white text-xs font-bold px-3 py-1 uppercase tracking-wider">
                                Subscriber
                            </span>
                        )}
                    </div>

                    <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-8">
                        {article.title}
                    </h1>

                    <div className="flex items-center justify-between border-t border-gray-700 pt-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
                            <div>
                                <p className="font-bold text-sm uppercase">By {article.author}</p>
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
                {article.image && (
                    <div className="mb-12 shadow-2xl border-4 border-white">
                        <img src={article.image} alt={article.title} className="w-full h-auto" />
                    </div>
                )}

                <div className="font-serif text-lg leading-loose text-gray-800 space-y-6">
                    {/* Excerpt - always visible */}
                    <p className="font-bold text-xl md:text-2xl text-og-blue leading-relaxed">
                        {article.excerpt}
                    </p>
                    <div className="w-20 h-1 bg-og-orange my-8"></div>

                    {/* First paragraph - always visible */}
                    <p>{firstParagraph}</p>

                    {/* Locked content gate or full content */}
                    {showLockedContent ? (
                        <div className="my-12 p-8 bg-gradient-to-br from-og-blue/5 to-og-orange/5 border-2 border-og-blue/20 rounded-xl text-center">
                            <div className="w-16 h-16 bg-og-blue rounded-full flex items-center justify-center mx-auto mb-6">
                                <Lock className="w-8 h-8 text-white" />
                            </div>

                            <h3 className="font-display text-2xl font-bold text-og-dark mb-3 uppercase">
                                This story is for subscribers
                            </h3>

                            <p className="font-serif text-gray-600 mb-6">
                                Full articles are available to our newsletter subscribers. Enter your email to unlock this story.
                            </p>

                            {/* Email verification form */}
                            <form onSubmit={handleVerifyEmail} className="max-w-md mx-auto space-y-3">
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        placeholder="Enter your subscriber email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={verifying}
                                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 focus:border-og-blue focus:outline-none rounded-lg disabled:opacity-50"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={verifying}
                                    className="w-full bg-og-dark text-white font-display font-bold uppercase py-4 hover:bg-og-orange transition-colors disabled:opacity-50 rounded-lg"
                                >
                                    {verifying ? 'Verifying...' : 'Unlock Full Story'}
                                </button>
                            </form>

                            {message && (
                                <p className={`mt-4 font-bold px-4 py-3 rounded-lg ${
                                    message.type === 'success'
                                        ? 'text-og-green bg-green-50'
                                        : 'text-red-600 bg-red-50'
                                }`}>
                                    {message.text}
                                </p>
                            )}

                            <p className="text-sm text-gray-500 mt-6">
                                Not subscribed yet?{' '}
                                <button
                                    onClick={scrollToNewsletter}
                                    className="text-og-blue font-bold hover:underline"
                                >
                                    Subscribe for free
                                </button>
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Full content for subscribers */}
                            {article.content.slice(1).map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}

                            {/* Subscriber CTA */}
                            <div className="mt-16 p-8 bg-og-cream border border-gray-200 rounded-lg text-center">
                                <h3 className="font-display text-2xl font-bold mb-4 uppercase">
                                    Enjoyed this story?
                                </h3>
                                <p className="font-serif text-gray-600 mb-6">
                                    You're a subscriber! Check your inbox for more stories like this every week.
                                </p>
                                {subscriberEmail && (
                                    <p className="text-sm text-gray-500">
                                        Signed in as {subscriberEmail}
                                    </p>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Newsletter signup section */}
            <div id="newsletter-signup" className="bg-og-dark text-white py-20">
                <div className="container mx-auto px-4 max-w-2xl text-center">
                    <h3 className="font-display text-3xl font-bold mb-4 uppercase">
                        Get the Newsletter
                    </h3>
                    <p className="font-serif text-gray-300 mb-8">
                        Join thousands of locals who start their week with The OG Project. Free, straight to your inbox.
                    </p>
                    <Link
                        to="/"
                        className="inline-block bg-og-orange text-white font-display font-bold uppercase px-8 py-4 hover:bg-white hover:text-og-dark transition-colors"
                    >
                        Subscribe Now
                    </Link>
                </div>
            </div>
        </motion.article>
    );
};

export default ArticlePage;
