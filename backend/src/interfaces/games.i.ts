import { z } from 'zod';
import { teacherZod } from './teacher.i';
import Mongoose, { Document } from 'mongoose';
import TeacherModel from '@schemas/teachers.s';
import zodObjectId from './common/objectId.ci';
import numberZod from './common/number.ci';

export const gameZod = z.object({
  id: zodObjectId.optional(),
  title: z.string(),
  description: z.string().max(255).default('').optional(),
  createdBy: zodObjectId
    .refine(
      async (value) => {
        const teacher = await TeacherModel.findById(value);
        if (!teacher) {
          return false;
        }
        return true;
      },
      {
        message: 'Teacher not found',
      }
    )
    .or(
      teacherZod.transform(async (value, ctx) => {
        const result = await teacherZod.safeParseAsync(value);
        if (!result.success) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Teacher not valid',
            path: [],
          });
          return null;
        }
        const teacher = new TeacherModel(result.data);
        await teacher.save();
        return teacher.toClient();
      })
    ),
  createdAt: z
    .union([z.number(), z.string(), z.date()])
    .pipe(z.coerce.date())
    .default(() => new Date()),
  updatedAt: z
    .union([z.number(), z.string(), z.date()])
    .pipe(z.coerce.date())
    .default(() => new Date())
    .optional(),
  type: z.enum(['wordfind', 'quiz', 'map']),
  activity: z.array(
    z.object({
      id: zodObjectId.default(() => new Mongoose.Types.ObjectId().toString()),
      question: z.string().min(1).max(255).default(''),
      answer: z.string().min(1).max(255).default(''),
      value: numberZod.default(1),
    })
  ),
  time: numberZod.optional(),
  status: z.enum(['active', 'inactive', 'banned']),
  size: z
    .object({
      width: numberZod,
      height: numberZod,
    })
    .optional(),
});

export type IGame = z.infer<typeof gameZod>;
export type GameDocument = Omit<IGame, 'id' | 'activity.id'> &
  Document & {
    toClient: () => IGame;
  };
