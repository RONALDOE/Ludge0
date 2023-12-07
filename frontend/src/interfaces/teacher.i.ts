import { z } from "zod";

import userId from "./common/user.ci";
import zodObjectId from "./common/objectId.ci";

export const teacherZod = z.object({
  id: zodObjectId.optional(),
  name: z.string().min(3).max(25),
  lastname: z.string().min(3).max(25),
  birthday: z.union([z.number(), z.string(), z.date()]).pipe(z.coerce.date()),
  user: userId,
  createdAt: z
    .union([z.number(), z.string(), z.date()])
    .pipe(z.coerce.date())
    .default(() => new Date()),
  updatedAt: z
    .union([z.number(), z.string(), z.date()])
    .pipe(z.coerce.date())
    .default(() => new Date())
    .optional(),
});

export type ITeacher = z.infer<typeof teacherZod>;
