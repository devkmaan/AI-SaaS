import Stripe from "stripe"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { userSub } from "@/app/models/userSubscription"
import { connectDB } from "@/lib/connDB";

async function connectWithDB(){
  await connectDB();
}
connectWithDB();


export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("Stripe-Signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session

  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    )

    if (!session?.metadata?.userId) {
      return new NextResponse("User id is required", { status: 400 });
    }

    const newUser = new userSub({
      userId: session?.metadata?.userId,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      stripePriceId: subscription.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
    });
    console.log(newUser);
    const createduser = await newUser.save();

  }

  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    )

    const nayaUser = await userSub.findOne({ stripeSubscriptionId: subscription.id });
    nayaUser!.stripePriceId = subscription.items.data[0].price.id,
    nayaUser!.stripeCurrentPeriodEnd = new Date(subscription.current_period_end * 1000),
    console.log(nayaUser);
    const createduser = await nayaUser!.save();
  }

  return new NextResponse(null, { status: 200 })
};