import { NextRequest, NextResponse } from "next/server";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "inr",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (err) {
    console.error("Payment intent creation failed:", err);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}