import mongoose, { Schema, Document } from 'mongoose';

export interface IProfile extends Document {
  userId?: mongoose.Types.ObjectId;
  templateType: string;
  fullName: string;
  dob?: string;
  age?: string;
  address?: string;
  bloodType?: string;
  medicalConditions?: string[];
  medications?: string[];
  allergies?: string[];
  emergencyContacts?: any[];
  notes?: string;
  customSections?: any[];
  isPinProtected: boolean;
  pin?: string;
}

const ProfileSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  templateType: { type: String, default: 'Medical' },
  fullName: { type: String, required: true },
  dob: { type: String },
  age: { type: String },
  address: { type: String },
  bloodType: { type: String },
  medicalConditions: [{ type: String }],
  medications: [{ type: String }],
  allergies: [{ type: String }],
  emergencyContacts: [{ type: Schema.Types.Mixed }],
  customSections: [{ type: Schema.Types.Mixed }],
  notes: { type: String },
  isPinProtected: { type: Boolean, default: false },
  pin: { type: String }
});

export default mongoose.models.Profile || mongoose.model<IProfile>('Profile', ProfileSchema);
