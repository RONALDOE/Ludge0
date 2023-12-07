import mongoose from 'mongoose';
import { z } from 'zod';

const zodObjectId = z.string().refine((value) => mongoose.Types.ObjectId.isValid(value), {
  message: 'Invalid ObjectId',
});

export default zodObjectId;
