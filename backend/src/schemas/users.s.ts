import mongoose from 'mongoose';
import { IUser, UserDocument } from '@interfaces/user.i';
import Encrypt from '@libs/encyrpt';

const userSchema = new mongoose.Schema<UserDocument>({
  login: {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      required: true,
      enum: ['local', 'google'],
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
    inmutable: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'inactive', 'banned'],
  },
  role: {
    type: String,
    required: true,
    enum: ['teacher', 'student'],
  },
});

userSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.createdAt = new Date();
    this.login.password = await Encrypt.hash(this.login.password);
  }
  this.updatedAt = new Date();
  next();
});

userSchema.methods.toClient = function (): IUser {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  delete obj.login.password;
  return obj as IUser;
};

const UserModel = mongoose.model<UserDocument>('Users', userSchema);
export default UserModel;
