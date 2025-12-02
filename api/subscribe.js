// Beehiiv Newsletter Subscription API Handler
// This is a serverless function that will be deployed to handle newsletter signups

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email } = req.body;

    // 1. Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        console.warn(`Invalid email attempt: ${email}`);
        return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    try {
        // 2. Load Configuration
        const BEEHIIV_PUBLICATION_ID = process.env.BEEHIIV_PUBLICATION_ID;
        const BEEHIIV_API_KEY = process.env.BEEHIIV_API_KEY;

        if (!BEEHIIV_PUBLICATION_ID || !BEEHIIV_API_KEY) {
            console.error('Beehiiv credentials missing in environment variables.');
            return res.status(500).json({ message: 'Server configuration error' });
        }

        let publicationId = BEEHIIV_PUBLICATION_ID;
        if (!publicationId.startsWith('pub_')) {
            publicationId = `pub_${publicationId}`;
        }

        const BEEHIIV_API_URL = `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`;

        // 3. Make request to Beehiiv API
        console.log(`Attempting to subscribe: ${email}`);
        
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
                // 4. Explicit opt-in documentation (implied by submission, but good to track)
                tier: 'free' 
            }),
        });

        let data = {};
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
             data = await response.json();
        } else {
             const text = await response.text();
             console.log('Non-JSON response:', text);
             try {
                data = JSON.parse(text);
             } catch (e) {
                data = { message: text || 'No response body' };
             }
        }

        if (response.ok) {
            // 5. Log success
            console.log(`Successfully subscribed: ${email}`);
            return res.status(200).json({
                message: 'Successfully subscribed!',
                data: data
            });
        } else {
            // 6. Handle Beehiiv API errors
            console.error('Beehiiv API Error:', JSON.stringify(data));
            console.error('Status:', response.status);
            
            // Handle specific error cases if needed
            const errorMessage = data.errors?.[0]?.message || data.message || 'Failed to subscribe.';
            
            return res.status(response.status).json({
                message: errorMessage
            });
        }
    } catch (error) {
        // 7. Log unexpected failures
        console.error('Subscription unexpected error:', error);
        return res.status(500).json({
            message: 'An internal error occurred. Please try again later.'
        });
    }
}
