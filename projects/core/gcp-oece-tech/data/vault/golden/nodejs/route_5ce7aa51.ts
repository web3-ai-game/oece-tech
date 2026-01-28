import { NextRequest, NextResponse } from 'next/server';
import { stripeClient } from '@/lib/stripe';
import { dbHelpers } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, userId, description } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get or create Stripe customer
    const user = await dbHelpers.getDocument('users', userId) as {
      id: string;
      email?: string;
      stripeCustomerId?: string;
      balance?: number;
    } | null;
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    let customerId = user.stripeCustomerId;
    
    if (!customerId) {
      const customer = await stripeClient.createCustomer(
        user.email || '',
        { userId }
      );
      customerId = customer.id;
      
      // Save Stripe customer ID to user
      await dbHelpers.updateDocument('users', userId, {
        stripeCustomerId: customerId,
      });
    }

    // Create payment intent
    const paymentIntent = await stripeClient.createPaymentIntent(
      amount,
      'usd',
      {
        userId,
        description: description || 'Credits purchase',
      }
    );

    // Save payment record
    await dbHelpers.addDocument('payments', {
      userId,
      amount,
      currency: 'usd',
      status: 'pending',
      type: 'credit_purchase',
      stripePaymentIntentId: paymentIntent.id,
      description: description || 'Credits purchase',
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
