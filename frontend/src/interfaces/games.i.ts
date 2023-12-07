import { z } from "zod";
import { teacherZod } from "./teacher.i";
import zodObjectId from "./common/objectId.ci";
import { activityZod } from "./activity.i";

export const gameZod = z.object({
  id: zodObjectId.optional(),
  title: z.string(),
  description: z.string().min(1).max(255).default(''),
  createdBy: zodObjectId.or(teacherZod),
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
  type: z.enum(["wordfind", "quiz", "map"]),
  activity: z.array(activityZod),
  size: z
    .object({
      width: z.number().positive(),
      height: z.number().positive(),
    })
    .optional(),
  time: z.number().positive().optional(),
  status: z.enum(["active", "inactive", "banned"]),
});

export type IGame = z.infer<typeof gameZod>;
export type IActivityAr = Pick<IGame, "activity">;
