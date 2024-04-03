import { userSub } from "@/app/models/userSubscription";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connDB";
import { isDynamicServerError } from "next/dist/client/components/hooks-server-context";


async function connectWithDB(){
  await connectDB();
}
connectWithDB();


const settingsUrl = absoluteUrl("/settings");

export async function GET(){
  try {
    const { userId } = auth();
    const user = await currentUser();
    if(!userId || !user){
      return new NextResponse("Unauthorised",{ status:401 });
    }

    const userSubscription = await userSub.findOne({ userId });

    if(userSubscription && userSubscription.stripeCustomerId){

      // if user already exists then direct him to a billing portal to unable him to cancel subscription if he wants
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: userSubscription.stripeCustomerId,
        return_url: settingsUrl,
      });

      return new NextResponse(JSON.stringify({ url: stripeSession.url }));
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: settingsUrl,
      cancel_url: settingsUrl,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: user.emailAddresses[0].emailAddress,
      line_items: [
        {
          price_data: {
            currency: "USD",
            product_data: {
              name: "SynthAi Pro",
              description: "Unlimited AI Generations"
            },
            unit_amount: 300,
            recurring: {
              interval: "month"
            }
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
      },
    });

    return new NextResponse(JSON.stringify({ url: stripeSession.url }));
  } catch (error) {
    if (isDynamicServerError(error)) {
      throw error;
    }
    console.log("[STRIPE_ERROR]",error);
    return new NextResponse("Internal Error",{ status:500 });
  }
}