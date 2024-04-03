// user model data
import mongoose from 'mongoose';
interface IUserS extends mongoose.Document {
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  stripeCurrentPeriodEnd: Date;
}
const userSubscriptionSchema = new mongoose.Schema<IUserS>({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  stripeCustomerId: {
    type: String,
    unique:true,
  },
  stripeSubscriptionId: {
    type: String,
    unique:true,
  },
  stripePriceId: {
    type: String,
  },
  stripeCurrentPeriodEnd: {
    type: Date,
  },
},
  { timestamps: true }
);
export const userSub = mongoose.models['userSubscription'] || mongoose.model<IUserS>('userSubscription', userSubscriptionSchema);
// export const : mongoose.Model<IUserS> = mongoose.models["userSubscription"]? mongoose.model("userSubscription"): mongoose.model("userSubscription", userSubscriptionSchema);