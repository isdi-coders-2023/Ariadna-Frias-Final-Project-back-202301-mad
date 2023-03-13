import { Schema, model } from 'mongoose';
import { Festival } from '../entities/festival';

const festivalSchema = new Schema<Festival>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    required: true,
  },
  musicType: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  dates: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

festivalSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject._id;
  },
});

export const FestivalModel = model('Festival', festivalSchema, 'festivals');
