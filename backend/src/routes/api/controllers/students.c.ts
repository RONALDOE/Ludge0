import BaseController from './base.c';
import { IStudent, StudentDocument, studentZod } from '@interfaces/student.i';
import StudentModel from '@schemas/students.s';

const Verify = (data: unknown) => studentZod.safeParseAsync(data);

class StudentController extends BaseController<StudentDocument, IStudent> {
  constructor() {
    super(StudentModel, Verify);
  }
}

export default StudentController;
