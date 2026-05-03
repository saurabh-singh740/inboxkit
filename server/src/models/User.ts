import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  color: string;
  totalClaims: number;
  socketId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 2,
      maxlength: 20,
    },
    color: {
      type: String,
      required: true,
    },
    totalClaims: {
      type: Number,
      default: 0,
      min: 0,
    },
    socketId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true, versionKey: false },
);

// username already indexed via unique:true above — only add leaderboard index
UserSchema.index({ totalClaims: -1 });

export const User = mongoose.model<IUser>('User', UserSchema);
