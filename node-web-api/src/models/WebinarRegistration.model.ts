import mongoose, { Schema, Document } from 'mongoose';

export interface IWebinarRegistration extends Document {
  webinar: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  registeredAt: Date;
  attended: boolean;
  attendedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const WebinarRegistrationSchema = new Schema<IWebinarRegistration>(
  {
    webinar: {
      type: Schema.Types.ObjectId,
      ref: 'Webinar',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    registeredAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    attended: {
      type: Boolean,
      default: false,
    },
    attendedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

WebinarRegistrationSchema.index({ webinar: 1, user: 1 }, { unique: true });
WebinarRegistrationSchema.index({ user: 1 });

export const WebinarRegistration = mongoose.model<IWebinarRegistration>('WebinarRegistration', WebinarRegistrationSchema);

