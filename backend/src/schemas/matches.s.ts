import Mongoose from 'mongoose';
import { MatchDocument } from '@interfaces/match.i';

const matchSchema = new Mongoose.Schema<MatchDocument>({
  participant: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  game: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'finished'],
    default: 'in-progress',
    required: true,
  },
  score: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    inmutable: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  time: {
    initial: {
      type: Date,
      default: Date.now,
    },
    final: { type: Date },
  },
  answers: [
    {
      answer: {
        type: String,
        required: true,
      },
      note: {
        type: String,
      },
    },
  ],
});
matchSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.createdAt = new Date();
  }
  this.updatedAt = new Date();
  next();
});
matchSchema.methods.toClient = function () {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
};

const MatchModel = Mongoose.model<MatchDocument>('Match', matchSchema);
export default MatchModel;
