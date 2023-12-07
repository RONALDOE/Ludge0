import { IStudent, StudentDocument } from '@interfaces/student.i';
import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema<StudentDocument>({
  name: {
    type: String,
    required: true,
  },
  lastname: { type: String, required: true },
  birthday: { type: Date, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
    unique: true,
  },
  enrollment: {
    type: String,
    required: true,
    minlength: 9,
    unique: true,
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
  classroom: {
    name: {
      type: String,
    },
    number: {
      type: Number,
    },
  },
});
studentSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.createdAt = new Date();
  }
  this.updatedAt = new Date();
  next();
});
studentSchema.methods.toClient = function (): IStudent {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  return obj as IStudent;
};

const StudentModel = mongoose.model<StudentDocument>('Students', studentSchema);
export default StudentModel;
