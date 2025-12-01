
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import CategoryPage from './components/CategoryPage';
import ArticlePage from './components/ArticlePage';
import PageLayout from './components/PageLayout';
import { AnimatePresence } from 'framer-motion';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/article/:id" element={<ArticlePage />} />

        {/* Static Pages */}
        <Route path="/about" element={
          <PageLayout
            title="Our Story"
            subtitle="If it matters this week in Ocala or Gainesville, it's in The OG Project."
          >
            <p><strong>The OG Project (Ocala.Gainesville Project)</strong> is your new free email newsletter, sent 1-2 times per week to start. Our focus is simple: Lifestyle, local news, hot topics, events, and culture in the Ocala and Gainesville metro areas.</p>

            <h3 className="text-2xl font-display font-bold mt-8 mb-4">Our Core Promise</h3>
            <p>"If it matters this week in Ocala or Gainesville, it's in The OG Project."</p>
            <p>Think of us as:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>A local news digest</li>
              <li>A curated guide of things to do</li>
              <li>A list of people and businesses to know</li>
              <li>A weekly "vibe check" on what the community is talking about</li>
            </ul>

            <h3 className="text-2xl font-display font-bold mt-8 mb-4">Who is this for?</h3>
            <p>Whether you are a <strong>young professional or student</strong> at UF looking for nightlife and food events, a <strong>family in Ocala</strong> looking for weekend plans, or a <strong>local business owner</strong> wanting to keep a pulse on the community, The OG Project is designed for you.</p>

            <h3 className="text-2xl font-display font-bold mt-8 mb-4">Our Vibe</h3>
            <p>We are conversational, local, and a bit witty, but always respectful. We cover serious news with neutrality and lifestyle events with the excitement of a plugged-in friend.</p>
          </PageLayout>
        } />

        <Route path="/advertise" element={
          <PageLayout
            title="Advertise with Us"
            subtitle="Connect with the most engaged audience in Central Florida."
          >
            <p>The OG Project offers unique opportunities for local businesses to reach an engaged audience of professionals, students, and families in the Ocala and Gainesville areas.</p>

            <h3 className="text-2xl font-display font-bold mt-8 mb-4">Partnership Opportunities</h3>
            <ul className="list-disc pl-6 space-y-4">
              <li>
                <strong>Sponsored Slots:</strong> Feature your business in our weekly newsletter with a dedicated block.
              </li>
              <li>
                <strong>"Presented By" Banners:</strong> High-visibility branding at the top of our newsletter and website.
              </li>
              <li>
                <strong>Featured Event Listings:</strong> Get your event in front of thousands of locals planning their weekend.
              </li>
              <li>
                <strong>Business Spotlight:</strong> A deep dive into your story, appearing in both our newsletter and website.
              </li>
            </ul>

            <p className="mt-8">We are currently accepting founding partners for our Q1 2026 launch. Lock in early rates and grow with us.</p>
            <div className="mt-8 p-6 bg-og-light border-l-4 border-og-orange">
              <p className="font-bold">Contact our sales team today at ads@ogtheproject.com</p>
            </div>
          </PageLayout>
        } />

        <Route path="/privacy" element={
          <PageLayout title="Privacy Policy">
            <p>Last Updated: October 2025</p>
            <p>At The OG Project, we respect your privacy. This Privacy Policy explains how we collect, use, and protect your information when you visit our website or subscribe to our newsletter.</p>

            <h3 className="text-xl font-bold mt-6 mb-2">1. Information We Collect</h3>
            <p>We collect information you provide directly to us, such as your email address when you subscribe to our newsletter. We may also collect anonymous usage data to help us improve our content.</p>

            <h3 className="text-xl font-bold mt-6 mb-2">2. How We Use Your Information</h3>
            <p>We use your email address to send you our weekly newsletters and occasional updates about The OG Project. We do not sell your personal data to third parties.</p>

            <h3 className="text-xl font-bold mt-6 mb-2">3. Cookies</h3>
            <p>We use cookies to understand how you use our site and to improve your experience. You can disable cookies in your browser settings at any time.</p>

            <h3 className="text-xl font-bold mt-6 mb-2">4. Contact Us</h3>
            <p>If you have any questions about this policy, please contact us at privacy@ogtheproject.com.</p>
          </PageLayout>
        } />

        <Route path="/contact" element={
          <PageLayout
            title="Contact Us"
            subtitle="We want to hear from you."
          >
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-display font-bold mb-4 text-og-blue">Get in Touch</h3>
                <p className="mb-6">Have a tip? Want to nominate a local hero? Or just want to say hi? We read every email.</p>

                <div className="space-y-4">
                  <div>
                    <span className="block font-bold text-sm uppercase tracking-wider text-gray-500">General Inquiries</span>
                    <a href="mailto:hello@ogtheproject.com" className="text-xl font-bold hover:text-og-orange">hello@ogtheproject.com</a>
                  </div>
                  <div>
                    <span className="block font-bold text-sm uppercase tracking-wider text-gray-500">Advertising</span>
                    <a href="mailto:ads@ogtheproject.com" className="text-xl font-bold hover:text-og-orange">ads@ogtheproject.com</a>
                  </div>
                  <div>
                    <span className="block font-bold text-sm uppercase tracking-wider text-gray-500">Events Team</span>
                    <a href="mailto:events@ogtheproject.com" className="text-xl font-bold hover:text-og-orange">events@ogtheproject.com</a>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 border-2 border-gray-200 shadow-lg">
                <h3 className="text-xl font-bold mb-4 uppercase">Send us a message</h3>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
                    <input type="text" className="w-full bg-gray-50 border border-gray-300 p-3 focus:outline-none focus:border-og-blue" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                    <input type="email" className="w-full bg-gray-50 border border-gray-300 p-3 focus:outline-none focus:border-og-blue" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Message</label>
                    <textarea rows={4} className="w-full bg-gray-50 border border-gray-300 p-3 focus:outline-none focus:border-og-blue"></textarea>
                  </div>
                  <button className="w-full bg-og-dark text-white font-bold uppercase py-3 hover:bg-og-orange transition-colors">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </PageLayout>
        } />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-og-cream">
        <Header />
        <main className="flex-grow">
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
