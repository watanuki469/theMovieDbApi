import mongoose, { Document, Schema } from 'mongoose';

export interface UserDocument extends Document {
  email: string;
  password: string;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export default mongoose.model<UserDocument>('user', UserSchema);
