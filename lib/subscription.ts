import { userSub } from "@/app/models/userSubscription";
import { connectDB } from "@/lib/connDB";
import { auth } from "@clerk/nextjs";

async function connectWithDB(){
  await connectDB();
}
connectWithDB();

const DAY_IN_MS = 86_400_000

export const checkSubscription = async()=>{
  const { userId } = auth();

  if(!userId){
    return false;
  }

  const userSubscription = await userSub.findOne({ userId });

  if(!userSubscription){
    return false;
  }
  const isValid = userSubscription.stripePriceId && userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS>Date.now();

  return !!isValid;

}