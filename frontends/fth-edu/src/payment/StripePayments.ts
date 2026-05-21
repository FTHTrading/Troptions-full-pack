/**
 * TROPTIONS Payment System
 * Integrates Stripe for fiat on/off ramps
 * Connects to existing Stripe account
 */

import axios from 'axios';

// Stripe Configuration
const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY || 'pk_live_...';
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_live_...';
const STRIPE_API_URL = 'https://api.stripe.com/v1';

// Product Configuration
const PRODUCTS = {
  TROPTIONS_BASIC: {
    id: 'prod_troptions_basic',
    name: 'TROPTIONS Basic Access',
    description: 'Access to basic courses and wallet features',
    price: 9.99,
    interval: 'month',
    features: ['3 Basic Courses', 'Wallet Access', 'Community Support'],
  },
  TROPTIONS_PRO: {
    id: 'prod_troptions_pro',
    name: 'TROPTIONS Pro',
    description: 'Full access to all courses, AMM, and advanced features',
    price: 29.99,
    interval: 'month',
    features: ['All Courses', 'AMM Access', 'Priority Support', 'NFT Certificates', '$PICK Rewards'],
  },
  TROPTIONS_ENTERPRISE: {
    id: 'prod_troptions_enterprise',
    name: 'TROPTIONS Enterprise',
    description: 'White-label solution for businesses',
    price: 299.99,
    interval: 'month',
    features: ['Custom Branding', 'API Access', 'Dedicated Support', 'Analytics Dashboard'],
  },
  WC2026_SPONSOR_LOCAL: {
    id: 'prod_wc26_local',
    name: 'WC2026 Local Vendor',
    description: 'Local sponsorship for World Cup 2026 Atlanta',
    price: 500.00,
    interval: 'one_time',
    features: ['Logo on local screens', 'Social media mention', '500 $PICK tokens'],
  },
  WC2026_SPONSOR_REGIONAL: {
    id: 'prod_wc26_regional',
    name: 'WC2026 Regional Partner',
    description: 'Regional partnership for World Cup 2026',
    price: 2500.00,
    interval: 'one_time',
    features: ['Logo on all Atlanta screens', 'NFT collectible bundle', '2,500 $PICK tokens', 'VIP hospitality'],
  },
  WC2026_SPONSOR_GLOBAL: {
    id: 'prod_wc26_global',
    name: 'WC2026 Global Sponsor',
    description: 'Global sponsorship for World Cup 2026',
    price: 10000.00,
    interval: 'one_time',
    features: ['Logo on all WC26 screens', 'Custom NFT collection', '10,000 $PICK tokens', 'Private suite', 'Player meet'],
  },
};

interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
}

interface Subscription {
  id: string;
  status: string;
  current_period_end: number;
  items: any[];
}

export class StripePayments {
  private apiKey: string;
  private headers: Record<string, string>;

  constructor(secretKey?: string) {
    this.apiKey = secretKey || STRIPE_SECRET_KEY;
    this.headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    };
  }

  // Create a payment intent for one-time purchases
  async createPaymentIntent(
    amount: number,
    currency: string = 'usd',
    metadata?: Record<string, string>
  ): Promise<PaymentIntent> {
    try {
      const response = await axios.post(
        `${STRIPE_API_URL}/payment_intents`,
        new URLSearchParams({
          amount: (amount * 100).toString(), // Convert to cents
          currency,
          'automatic_payment_methods[enabled]': 'true',
          ...(metadata && Object.entries(metadata).reduce((acc, [key, value]) => {
            acc[`metadata[${key}]`] = value;
            return acc;
          }, {} as Record<string, string>)),
        }),
        { headers: this.headers }
      );

      return response.data;
    } catch (error) {
      console.error('Payment intent error:', error);
      throw error;
    }
  }

  // Create a subscription
  async createSubscription(
    customerId: string,
    priceId: string,
    metadata?: Record<string, string>
  ): Promise<Subscription> {
    try {
      const response = await axios.post(
        `${STRIPE_API_URL}/subscriptions`,
        new URLSearchParams({
          customer: customerId,
          'items[0][price]': priceId,
          ...(metadata && Object.entries(metadata).reduce((acc, [key, value]) => {
            acc[`metadata[${key}]`] = value;
            return acc;
          }, {} as Record<string, string>)),
        }),
        { headers: this.headers }
      );

      return response.data;
    } catch (error) {
      console.error('Subscription error:', error);
      throw error;
    }
  }

  // Create a customer
  async createCustomer(
    email: string,
    name?: string,
    metadata?: Record<string, string>
  ): Promise<any> {
    try {
      const params = new URLSearchParams({
        email,
        ...(name && { name }),
        ...(metadata && Object.entries(metadata).reduce((acc, [key, value]) => {
          acc[`metadata[${key}]`] = value;
          return acc;
        }, {} as Record<string, string>)),
      });

      const response = await axios.post(
        `${STRIPE_API_URL}/customers`,
        params,
        { headers: this.headers }
      );

      return response.data;
    } catch (error) {
      console.error('Customer creation error:', error);
      throw error;
    }
  }

  // Get products
  getProducts() {
    return PRODUCTS;
  }

  // Create checkout session
  async createCheckoutSession(
    priceId: string,
    customerEmail: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<any> {
    try {
      const response = await axios.post(
        `${STRIPE_API_URL}/checkout/sessions`,
        new URLSearchParams({
          'line_items[0][price]': priceId,
          'line_items[0][quantity]': '1',
          mode: 'payment',
          success_url: successUrl,
          cancel_url: cancelUrl,
          customer_email: customerEmail,
        }),
        { headers: this.headers }
      );

      return response.data;
    } catch (error) {
      console.error('Checkout session error:', error);
      throw error;
    }
  }

  // Webhook handler for payment events
  async handleWebhook(event: any): Promise<void> {
    const { type, data } = event;

    switch (type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSuccess(data.object);
        break;
      case 'invoice.payment_succeeded':
        await this.handleSubscriptionPayment(data.object);
        break;
      case 'customer.subscription.created':
        await this.handleSubscriptionCreated(data.object);
        break;
      default:
        console.log(`Unhandled webhook event: ${type}`);
    }
  }

  private async handlePaymentSuccess(paymentIntent: any): Promise<void> {
    console.log('Payment succeeded:', paymentIntent.id);
    
    // Award $PICK tokens based on payment amount
    const amount = paymentIntent.amount / 100; // Convert from cents
    const pickTokens = Math.floor(amount * 10); // 10 $PICK per $1
    
    // Log for now - in production, mint tokens
    console.log(`Awarding ${pickTokens} $PICK tokens to customer ${paymentIntent.customer}`);
    
    // Send confirmation
    // await sendPaymentConfirmation(paymentIntent.receipt_email, amount, pickTokens);
  }

  private async handleSubscriptionPayment(invoice: any): Promise<void> {
    console.log('Subscription payment:', invoice.id);
    
    // Award monthly $PICK tokens
    const amount = invoice.amount_paid / 100;
    const pickTokens = Math.floor(amount * 15); // 15 $PICK per $1 for subscriptions
    
    console.log(`Awarding ${pickTokens} $PICK tokens for subscription payment`);
  }

  private async handleSubscriptionCreated(subscription: any): Promise<void> {
    console.log('Subscription created:', subscription.id);
    
    // Activate premium features
    // await activatePremiumFeatures(subscription.customer);
  }

  // Get revenue metrics
  async getRevenueMetrics(startDate: Date, endDate: Date): Promise<any> {
    try {
      // In production, query Stripe for actual metrics
      return {
        totalRevenue: 0,
        subscriptionRevenue: 0,
        oneTimeRevenue: 0,
        activeSubscriptions: 0,
        churnRate: 0,
      };
    } catch (error) {
      console.error('Revenue metrics error:', error);
      throw error;
    }
  }
}

// Export singleton
export const stripePayments = new StripePayments();
export { PRODUCTS };