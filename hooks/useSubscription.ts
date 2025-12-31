import { useState, useEffect } from 'react';

interface UseSubscriptionReturn {
  isSubscribed: boolean | null;
  subscriberEmail: string | null;
  isLoading: boolean;
  verifyEmail: (email: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

export function useSubscription(): UseSubscriptionReturn {
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null);
  const [subscriberEmail, setSubscriberEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check subscription status on mount
  useEffect(() => {
    const checkSubscription = async () => {
      // Check localStorage for stored email
      const storedEmail = localStorage.getItem('og_subscriber_email');
      if (storedEmail) {
        setSubscriberEmail(storedEmail);
      }

      // Check cookie via API
      try {
        const response = await fetch('/api/check-subscription', {
          credentials: 'include',
        });
        const data = await response.json();
        setIsSubscribed(data.isSubscribed);
      } catch (error) {
        console.error('Subscription check error:', error);
        setIsSubscribed(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSubscription();
  }, []);

  // Verify email and unlock content
  const verifyEmail = async (email: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/verify-subscriber', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok && data.isSubscribed) {
        setIsSubscribed(true);
        setSubscriberEmail(data.email || email);
        localStorage.setItem('og_subscriber_email', data.email || email);
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Verification error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout (clear local state)
  const logout = () => {
    localStorage.removeItem('og_subscriber_email');
    setIsSubscribed(false);
    setSubscriberEmail(null);
  };

  return {
    isSubscribed,
    subscriberEmail,
    isLoading,
    verifyEmail,
    logout,
  };
}
