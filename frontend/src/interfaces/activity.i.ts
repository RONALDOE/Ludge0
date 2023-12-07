import { z } from 'zod';
import zodObjectId from './common/objectId.ci';

export const activityZod = z.object({
  id: zodObjectId.optional(),
  question: z.string().min(1).max(255).default(''),
  answer: z.string().min(1).max(255).default(''),
  value: z
    .string()
    .min(1)
    .pipe(z.coerce.number().positive())
    .or(z.number().positive()),
});

export type IActivity = z.infer<typeof activityZod>;
export type WorlistWords = IActivity & {
  isGuessed: boolean;
};
