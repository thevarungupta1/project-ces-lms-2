import mongoose, { Schema, Document } from 'mongoose';

export interface IIssuedCertificate extends Document {
  certificateNumber: string;
  course: mongoose.Types.ObjectId;
  learner: mongoose.Types.ObjectId;
  template: mongoose.Types.ObjectId;
  issuedAt: Date;
  completionDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const IssuedCertificateSchema = new Schema<IIssuedCertificate>(
  {
    certificateNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    learner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    template: {
      type: Schema.Types.ObjectId,
      ref: 'CertificateTemplate',
      required: true,
    },
    issuedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    completionDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

IssuedCertificateSchema.index({ course: 1, learner: 1 });
IssuedCertificateSchema.index({ learner: 1 });

export const IssuedCertificate = mongoose.model<IIssuedCertificate>('IssuedCertificate', IssuedCertificateSchema);

