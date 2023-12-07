import { IGame, GameDocument } from '@interfaces/games.i';
import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema<GameDocument>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
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
  type: {
    type: String,
    enum: ['wordfind', 'quiz', 'map'],
    required: true,
  },
  activity: [
    {
      question: {
        type: String,
        required: true,
      },
      answer: {
        type: String,
        required: true,
      },
      value: {
        type: Number,
        required: true,
      },
    },
  ],
  time: {
    type: Number,
    min: 1,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'banned'],
    default: 'active',
    required: true,
  },
  size: {
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
  },
});
gameSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.createdAt = new Date();
  }
  this.updatedAt = new Date();
  next();
});
gameSchema.methods.toClient = function (): IGame {
  const obj = this.toObject();
  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;
  obj.activity = obj.activity.map((act: any) => {
    act.id = act._id.toString();
    delete act._id;
    return act;
  });
  delete obj.activity._id;
  return obj;
};

const GameModel = mongoose.model<GameDocument>('Games', gameSchema);
export default GameModel;
