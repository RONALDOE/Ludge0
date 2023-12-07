import { z } from "zod";
import zodObjectId from "./common/objectId.ci";

export const UserZod = z.object({
  id: zodObjectId.optional(),
  login: z.object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters long")
      .max(25, "Username must be at most 25 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    provider: z.enum(["local", "google"]),
  }),
  status: z.enum(["active", "inactive", "banned"]).default("active"),
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
  role: z.enum(["teacher", "student"]),
});

export type IUser = z.infer<typeof UserZod>;
