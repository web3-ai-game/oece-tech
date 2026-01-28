export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  type: 'credit_purchase' | 'subscription' | 'usage';
  stripePaymentIntentId?: string;
  stripeSessionId?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  currency: string;
  popular?: boolean;
  description?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: string[];
  limits: {
    imagesPerMonth?: number;
    videosPerMonth?: number;
    wordsPerMonth?: number;
  };
  stripePriceId?: string;
}

export interface UsageRecord {
  id: string;
  userId: string;
  type: 'image' | 'video' | 'content';
  cost: number;
  credits: number;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface Billing {
  balance: number;
  totalSpent: number;
  subscription?: {
    planId: string;
    status: string;
    currentPeriodEnd: Date;
  };
  usage: {
    current: number;
    limit?: number;
    resetDate: Date;
  };
}
