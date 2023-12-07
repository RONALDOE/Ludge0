import BaseController from './base.c';
import { ITeacher, TeacherDocument, teacherZod } from '@interfaces/teacher.i';
import TeacherModel from '@schemas/teachers.s';

const Verify = (data: unknown) => teacherZod.safeParseAsync(data);

class TeachersController extends BaseController<TeacherDocument, ITeacher> {
  constructor() {
    super(TeacherModel, Verify);
  }
}

export default TeachersController;
