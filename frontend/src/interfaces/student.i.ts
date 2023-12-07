import { z } from "zod";
import userId from "./common/user.ci";
import zodObjectId from "./common/objectId.ci";

export const studentZod = z.object({
  id: zodObjectId.optional(),
  name: z.string().min(3).max(25),
  lastname: z.string().min(3).max(25),
  birthday: z.union([z.number(), z.string(), z.date()]).pipe(z.coerce.date()),
  user: userId,
  enrollment: z
    .string()
    .regex(
      /^[0-9]{4}-[0-9]{4}$/,
      "enrollment must be in the format (4 digits - 4 digits) ex: 2020-2021"
    ),
  classroom: z
    .object({
      name: z
        .string()
        .min(2, "Classrom must be 2 letters")
        .max(2, "Classroom name must be at most 2 characters long"),
      number: z
        .number()
        .int("Classroom number must be an integer")
        .positive("Classroom number must be positive"),
    })
    .optional(),
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

export type IStudent = z.infer<typeof studentZod>;
