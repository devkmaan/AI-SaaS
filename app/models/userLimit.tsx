// user model data
import mongoose from 'mongoose';
interface IUser extends mongoose.Document {
  userId: string;
  numtrials: number;
}
const userSchema = new mongoose.Schema<IUser>({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  numtrials: {
    type: Number,
    default:0
  },
},
  { timestamps: true }
);
export const userLimit = mongoose.models['userlimits'] || mongoose.model<IUser>('userlimits', userSchema);
// export const : mongoose.Model<IUser> = mongoose.models["userlimits"]? mongoose.model("userlimits"): mongoose.model("userlimits", userSchema);