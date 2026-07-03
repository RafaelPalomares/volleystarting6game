import { NextResponse } from 'next/server';

/**
 * Stripe Checkout API Route
 * 
 * To activate:
 * 1. Create a Stripe account at stripe.com
 * 2. Get your secret key from dashboard.stripe.com/apikeys
 * 3. Add STRIPE_SECRET_KEY to your .env.local
 * 4. Create a product + price in Stripe Dashboard
 * 5. Add the price ID below
 * 
 * Install: npm install stripe
 */

export async function POST() {
  // TODO: Uncomment when Stripe is configured
  /*
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: 'price_XXXXXXXX', // Your Stripe Price ID
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_URL}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/premium`,
  });

  return NextResponse.json({ url: session.url });
  */

  // Placeholder response until Stripe is configured
  return NextResponse.json({ 
    message: 'Stripe not configured yet. Set STRIPE_SECRET_KEY in .env.local',
    url: '/premium' 
  });
}
