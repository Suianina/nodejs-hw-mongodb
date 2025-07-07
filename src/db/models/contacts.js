import { Schema, model } from 'mongoose';
import { typeList } from '../../constants/contacts.js';

import { handleSaveError, setUpdateSettings } from './hooks.js';

const contactsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: typeList,
      required: true,
      default: 'personal',
    },
    userId: {
      type: Schema.Types.ObjectId,
      req: 'user',
      required: true,
    },
    photo: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

contactsSchema.post('save', handleSaveError);
contactsSchema.pre('findOneAndUpdate', setUpdateSettings);
contactsSchema.post('findOneAndUpdate', handleSaveError);

export const ContactsCollection = model('contacts', contactsSchema);
