import { model, Schema } from 'mongoose';

import { emailRegex } from '../../constants/user.js';
import { handleSaveError, setUpdateSettings } from './hooks.js';
import bcrypt from 'bcrypt';

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

// Hash password before saving (for create and save)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

// Hash password before findOneAndUpdate (for updateOne, findOneAndUpdate, etc.)
userSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();
  if (update && update.password) {
    try {
      update.password = await bcrypt.hash(update.password, 10);
      this.setUpdate(update);
    } catch (err) {
      return next(err);
    }
  }
  next();
});

export const UsersCollection = model('User', userSchema);
