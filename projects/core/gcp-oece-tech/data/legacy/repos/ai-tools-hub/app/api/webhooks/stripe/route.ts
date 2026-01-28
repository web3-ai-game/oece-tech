import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripeClient } from '@/lib/stripe';
import { dbHelpers } from '@/lib/firebase';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe signature' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripeClient.verifyWebhookSignature(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const { userId } = paymentIntent.metadata;
        
        if (!userId) {
          throw new Error('User ID not found in payment intent metadata');
        }

        // Update payment status
        const payments = await dbHelpers.queryDocuments('payments', [
          // @ts-expect-error - where is imported from firebase
          where('stripePaymentIntentId', '==', paymentIntent.id),
        ]);

        if (payments.length > 0) {
          const payment = payments[0];
          await dbHelpers.updateDocument('payments', payment.id, {
            status: 'completed',
          });

          // Add credits to user balance
          const creditsToAdd = paymentIntent.amount / 100; // Convert from cents
          const user = await dbHelpers.getDocument('users', userId) as {
            id: string;
            balance?: number;
          } | null;
          
          if (user) {
            await dbHelpers.updateDocument('users', userId, {
              balance: (user.balance || 0) + creditsToAdd,
            });
          }
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Update payment status
        const payments = await dbHelpers.queryDocuments('payments', [
          // @ts-expect-error - where is imported from firebase
          where('stripePaymentIntentId', '==', paymentIntent.id),
        ]);

        if (payments.length > 0) {
          const payment = payments[0];
          await dbHelpers.updateDocument('payments', payment.id, {
            status: 'failed',
          });
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        // Find user by Stripe customer ID
        const users = await dbHelpers.queryDocuments('users', [
          // @ts-expect-error - where is imported from firebase
          where('stripeCustomerId', '==', customerId),
        ]);

        if (users.length > 0) {
          const user = users[0];
          const currentPeriodEnd = (subscription as { current_period_end?: number }).current_period_end;
          await dbHelpers.updateDocument('users', user.id, {
            subscriptionStatus: subscription.status,
            subscriptionId: subscription.id,
            subscriptionEndDate: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : null,
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        // Find user by Stripe customer ID
        const users = await dbHelpers.queryDocuments('users', [
          // @ts-expect-error - where is imported from firebase
          where('stripeCustomerId', '==', customerId),
        ]);

        if (users.length > 0) {
          const user = users[0];
          await dbHelpers.updateDocument('users', user.id, {
            subscriptionStatus: 'cancelled',
            subscriptionId: null,
            subscriptionEndDate: null,
          });
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
