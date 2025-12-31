
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const SubscribePopup: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Check if user has already seen/closed the popup
        const hasSeenPopup = localStorage.getItem('og_subscribe_popup_seen');

        if (!hasSeenPopup) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 3000); // Show after 3 seconds
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        // Don't show again for this session/user
        localStorage.setItem('og_subscribe_popup_seen', 'true');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                // Mark as seen essentially forever
                localStorage.setItem('og_subscribe_popup_seen', 'true');
                setTimeout(() => {
                    setIsVisible(false);
                }, 2000);
            } else {
                setStatus('error');
                setMessage(data.message || 'Something went wrong.');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Network error. Please try again.');
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="bg-og-cream border-4 border-og-blue relative max-w-lg w-full p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
                    >
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 text-og-dark hover:text-og-orange transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="text-center">
                            <h2 className="font-display text-3xl md:text-4xl font-bold text-og-blue uppercase mb-2">
                                Unlock The Project
                            </h2>
                            <p className="font-display text-xl md:text-2xl font-bold text-og-dark uppercase mb-6">
                                & Become an OG!
                            </p>

                            <p className="font-serif text-gray-700 mb-8">
                                Get the best of Gainesville & Ocala delivered to your inbox weekly. No spam, just vibes.
                            </p>

                            {status === 'success' ? (
                                <div className="bg-og-green/10 border-2 border-og-green p-4">
                                    <p className="text-og-green font-bold text-lg">You're in! Welcome to the fam.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                                    <input
                                        type="email"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full px-5 py-4 text-lg border-2 border-og-dark bg-white focus:outline-none focus:border-og-orange focus:shadow-[4px_4px_0px_0px_#FA4616] transition-all"
                                    />
                                    <button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        className="w-full bg-og-orange hover:bg-orange-600 text-white font-display font-bold text-lg px-8 py-4 uppercase tracking-wider transition-all disabled:opacity-50 border-2 border-og-dark shadow-[4px_4px_0px_0px_#000]"
                                    >
                                        {status === 'loading' ? 'Joining...' : 'Join the Club'}
                                    </button>

                                    {status === 'error' && (
                                        <p className="text-red-500 font-bold text-sm mt-2">{message}</p>
                                    )}
                                </form>
                            )}

                            <p className="text-gray-400 text-xs mt-6 uppercase tracking-widest cursor-pointer hover:text-og-dark transition-colors" onClick={handleClose}>
                                No thanks, I'll miss out
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SubscribePopup;
