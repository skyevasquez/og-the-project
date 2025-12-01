// Beehiiv Newsletter Subscription API Handler
// This is a serverless function that will be deployed to handle newsletter signups

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email } = req.body;

    // Validate email
    if (!email || !email.includes('@')) {
        return res.status(400).json({ message: 'Valid email is required' });
    }

    try {
        // Beehiiv API endpoint
        const BEEHIIV_API_URL = 'https://api.beehiiv.com/v2/publications/{PUBLICATION_ID}/subscriptions';
        const BEEHIIV_API_KEY = process.env.BEEHIIV_API_KEY;

        if (!BEEHIIV_API_KEY) {
            console.error('BEEHIIV_API_KEY is not configured');
            return res.status(500).json({ message: 'Server configuration error' });
        }

        // Make request to Beehiiv API
        const response = await fetch(BEEHIIV_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${BEEHIIV_API_KEY}`,
            },
            body: JSON.stringify({
                email: email,
                reactivate_existing: false,
                send_welcome_email: true,
                utm_source: 'website',
                utm_medium: 'signup_form',
            }),
        });

        const data = await response.json();

        if (response.ok) {
            return res.status(200).json({
                message: 'Successfully subscribed!',
                data: data
            });
        } else {
            // Handle Beehiiv API errors
            console.error('Beehiiv API Error:', data);
            return res.status(response.status).json({
                message: data.message || 'Failed to subscribe. Please try again.'
            });
        }
    } catch (error) {
        console.error('Subscription error:', error);
        return res.status(500).json({
            message: 'An error occurred. Please try again later.'
        });
    }
}
