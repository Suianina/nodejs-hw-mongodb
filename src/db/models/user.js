import { model, Schema } from 'mongoose';

import { emailRegex } from '../../constants/user.js';
import { handleSaveError, setUpdateSettings } from './hooks.js';

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: emailRegex,
    },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

userSchema.post('save', handleSaveError);
userSchema.pre('findOneAndUpdate', setUpdateSettings);
userSchema.post('findOneAndUpdate', handleSaveError);

export const UsersCollection = model('User', userSchema);
