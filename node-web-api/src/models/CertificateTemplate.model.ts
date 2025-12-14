import mongoose, { Schema, Document } from 'mongoose';

export interface ICertificateTemplate extends Document {
  name: string;
  description?: string;
  isDefault: boolean;
  isActive: boolean;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  accentColor: string;
  logoUrl?: string;
  signatureName: string;
  signatureTitle: string;
  footerText?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CertificateTemplateSchema = new Schema<ICertificateTemplate>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    backgroundColor: {
      type: String,
      required: true,
      default: '#ffffff',
    },
    textColor: {
      type: String,
      required: true,
      default: '#1e293b',
    },
    borderColor: {
      type: String,
      required: true,
      default: '#3b82f6',
    },
    accentColor: {
      type: String,
      required: true,
      default: '#3b82f6',
    },
    logoUrl: {
      type: String,
    },
    signatureName: {
      type: String,
      required: true,
    },
    signatureTitle: {
      type: String,
      required: true,
    },
    footerText: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

CertificateTemplateSchema.index({ isDefault: 1 });
CertificateTemplateSchema.index({ isActive: 1 });

export const CertificateTemplate = mongoose.model<ICertificateTemplate>('CertificateTemplate', CertificateTemplateSchema);

