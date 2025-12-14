import mongoose, { Schema, Document } from 'mongoose';

export interface ILeaderboard extends Document {
  user: mongoose.Types.ObjectId;
  totalPoints: number;
  learningProgress: number; // 0-100
  engagementScore: number; // 0-100
  performanceScore: number; // 0-100
  contributions: number;
  activitiesCompleted: number;
  rank?: number;
  createdAt: Date;
  updatedAt: Date;
}

const LeaderboardSchema = new Schema<ILeaderboard>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    totalPoints: {
      type: Number,
      default: 0,
      min: 0,
    },
    learningProgress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    engagementScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    performanceScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    contributions: {
      type: Number,
      default: 0,
      min: 0,
    },
    activitiesCompleted: {
      type: Number,
      default: 0,
      min: 0,
    },
    rank: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

LeaderboardSchema.index({ totalPoints: -1 });
LeaderboardSchema.index({ rank: 1 });

export const Leaderboard = mongoose.model<ILeaderboard>('Leaderboard', LeaderboardSchema);

