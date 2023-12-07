import { ITeacher, TeacherDocument } from '@interfaces/teacher.i';
import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema<TeacherDocument>({
  name: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
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
  birthday: {
    type: Date,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
});
teacherSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.createdAt = new Date();
  }
  this.updatedAt = new Date();
  next();
});

teacherSchema.methods.toClient = function (): ITeacher {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
};

const TeacherModel = mongoose.model<TeacherDocument>('Teachers', teacherSchema);
export default TeacherModel;
