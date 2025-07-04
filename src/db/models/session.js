import { Schema, model, Types } from 'mongoose';
import { handleSaveError, setUpdateSettings } from './hooks.js';

const sessionSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    accessTokenValidUntil: {
      type: Date,
      required: true,
    },
    refreshTokenValidUntil: {
      type: Date,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

sessionSchema.post('save', handleSaveError);
sessionSchema.pre('findOneAndUpdate', setUpdateSettings);
sessionSchema.post('findOneAndUpdate', handleSaveError);

export const Session = model('Session', sessionSchema);
