import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ITile extends Document {
  x: number;
  y: number;
  ownerId: Types.ObjectId | null;
  ownerName: string | null;
  ownerColor: string | null;
  claimedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const TileSchema = new Schema<ITile>(
  {
    x: { type: Number, required: true, min: 0, max: 49 },
    y: { type: Number, required: true, min: 0, max: 49 },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    ownerName: { type: String, default: null },
    ownerColor: { type: String, default: null },
    claimedAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false },
);

// Unique constraint prevents duplicate tiles; ownerId index speeds up user-tile queries
TileSchema.index({ x: 1, y: 1 }, { unique: true });
TileSchema.index({ ownerId: 1 });

export const Tile = mongoose.model<ITile>('Tile', TileSchema);
