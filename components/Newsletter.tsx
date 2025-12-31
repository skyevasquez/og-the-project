import React, { useState } from 'react';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Thanks for subscribing! Check your email to confirm.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please check your connection and try again.');
    }
  };

  return (
    <section id="newsletter-signup" className="bg-og-blue py-16 border-y-4 border-og-orange">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white uppercase mb-4">
            Get The Weekly Cheat Sheet
          </h2>
          <p className="text-white/90 font-serif text-lg mb-8">
            Join thousands of locals who start their week with The OG Project. Free, straight to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={status === 'loading'}
              className="flex-1 px-6 py-4 text-lg border-2 border-white/20 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:border-og-orange disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-og-orange hover:bg-orange-600 text-white font-display font-bold text-lg px-8 py-4 uppercase tracking-wider transition-all disabled:opacity-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe Free'}
            </button>
          </form>

          {status === 'success' && (
            <p className="mt-4 text-og-green font-bold bg-white/10 px-4 py-3 rounded">{message}</p>
          )}
          {status === 'error' && (
            <p className="mt-4 text-red-300 font-bold bg-white/10 px-4 py-3 rounded">{message}</p>
          )}

          <p className="text-white/70 text-sm mt-6">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;