import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY && process.env.NODE_ENV === 'production') {
  console.warn('Missing STRIPE_SECRET_KEY - Stripe features will be disabled');
}

export const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2025-09-30.clover',
  typescript: true,
}) : null;

export const stripeClient = {
  // Create a payment intent
  async createPaymentIntent(amount: number, currency: string = 'usd', metadata?: Record<string, string>) {
    if (!stripe) throw new Error('Stripe is not configured');
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return paymentIntent;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  },

  // Create a checkout session
  async createCheckoutSession(
    lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
    successUrl: string,
    cancelUrl: string,
    metadata?: Record<string, string>
  ) {
    if (!stripe) throw new Error('Stripe is not configured');
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata,
      });

      return session;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  },

  // Create a subscription
  async createSubscription(customerId: string, priceId: string) {
    if (!stripe) throw new Error('Stripe is not configured');
    try {
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      return subscription;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  },

  // Create a customer
  async createCustomer(email: string, metadata?: Record<string, string>) {
    if (!stripe) throw new Error('Stripe is not configured');
    try {
      const customer = await stripe.customers.create({
        email,
        metadata,
      });

      return customer;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  // Get customer by email
  async getCustomerByEmail(email: string) {
    if (!stripe) throw new Error('Stripe is not configured');
    try {
      const customers = await stripe.customers.list({
        email,
        limit: 1,
      });

      return customers.data[0] || null;
    } catch (error) {
      console.error('Error getting customer:', error);
      throw error;
    }
  },

  // Cancel subscription
  async cancelSubscription(subscriptionId: string) {
    if (!stripe) throw new Error('Stripe is not configured');
    try {
      const subscription = await stripe.subscriptions.cancel(subscriptionId);
      return subscription;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  },

  // Verify webhook signature
  verifyWebhookSignature(payload: string | Buffer, signature: string, secret: string) {
    if (!stripe) throw new Error('Stripe is not configured');
    try {
      return stripe.webhooks.constructEvent(payload, signature, secret);
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      throw error;
    }
  },
};

// Pricing configuration
export const PRICING = {
  credits: [
    {
      id: 'credits_10',
      name: 'Starter Pack',
      credits: 10,
      price: 5,
      currency: 'USD',
    },
    {
      id: 'credits_50',
      name: 'Popular Pack',
      credits: 50,
      price: 20,
      currency: 'USD',
      popular: true,
    },
    {
      id: 'credits_100',
      name: 'Pro Pack',
      credits: 100,
      price: 35,
      currency: 'USD',
    },
  ],
  subscriptions: [
    {
      id: 'monthly_basic',
      name: 'Basic Monthly',
      price: 9.99,
      currency: 'USD',
      interval: 'month' as const,
      features: [
        '100 images per month',
        '10 videos per month',
        '50,000 words per month',
        'Email support',
      ],
    },
    {
      id: 'monthly_pro',
      name: 'Pro Monthly',
      price: 29.99,
      currency: 'USD',
      interval: 'month' as const,
      popular: true,
      features: [
        'Unlimited images',
        '50 videos per month',
        'Unlimited content writing',
        'Priority support',
        'API access',
      ],
    },
  ],
};
