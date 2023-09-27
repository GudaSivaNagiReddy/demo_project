import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  user_id: number;
  user_name: string;
  back_accounts: string[];
  accounts: {
    bank: string;
    branch: string;
    address: string;
    city: string;
    district: string;
    state: string;
    bank_code: string;
    weather: {
      temp: number;
      humidity: number;
    };
  };
}

const userSchema: Schema = new Schema({
  user_id: { type: Number, required: true },
  user_name: { type: String, required: true },
  back_accounts: [String],
  accounts: {
    bank: String,
    branch: String,
    address: String,
    city: String,
    district: String,
    state: String,
    bank_code: String,
    weather: {
      temp: Number,
      humidity: Number,
    },
  },
});

export default mongoose.model<IUser>('User', userSchema);
