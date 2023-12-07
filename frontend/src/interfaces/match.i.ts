import { z } from 'zod';
import { gameZod } from './games.i';
import zodObjectId from './common/objectId.ci';
import { studentZod } from './student.i';
import { teacherZod } from './teacher.i';

export const matchZod = z.object({
  id: zodObjectId.optional(),
  participant: zodObjectId.or(studentZod).or(teacherZod),
  game: zodObjectId.or(gameZod),
  status: z.enum(['pending', 'in-progress', 'finished', 'error']),
  score: z.number().int().positive().optional(),
  time: z
    .object({
      initial: z
        .union([z.number().int().positive(), z.string()])
        .pipe(z.coerce.date()),
      end: z
        .union([z.number().int().positive(), z.string()])
        .pipe(z.coerce.date())
        .optional(),
    })
    .optional(),
  answers: z.array(
    z.object({
      id: zodObjectId,
      answer: z.string().min(1).max(255).default(''),
      note: z.string().min(1).max(255).optional(),
    })
  ),
  createdAt: z
    .union([z.number(), z.string(), z.date()])
    .pipe(z.coerce.date())
    .default(() => new Date())
    .optional(),
  updatedAt: z
    .union([z.number(), z.string(), z.date()])
    .pipe(z.coerce.date())
    .default(() => new Date())
    .optional(),
});

export type IMatch = z.infer<typeof matchZod>;
