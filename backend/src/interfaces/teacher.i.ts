import { z } from 'zod';
import { Document } from 'mongoose';
import userId from './common/user.ci';
import zodObjectId from './common/objectId.ci';

export const teacherZod = z.object({
  id: zodObjectId.optional(),
  name: z.string().min(3).max(25),
  lastname: z.string().min(3).max(25),
  createdAt: z
    .union([z.number(), z.string(), z.date()])
    .pipe(z.coerce.date())
    .default(() => new Date()),
  updatedAt: z
    .union([z.number(), z.string(), z.date()])
    .pipe(z.coerce.date())
    .default(() => new Date())
    .optional(),
  birthday: z.union([z.number(), z.string(), z.date()]).pipe(z.coerce.date()),
  user: userId,
});

export type ITeacher = z.infer<typeof teacherZod>;
export type TeacherDocument = Omit<ITeacher, 'id'> &
  Document & {
    toClient: () => ITeacher;
  };
