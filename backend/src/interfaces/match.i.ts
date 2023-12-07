import { z } from 'zod';
import { gameZod } from './games.i';
import { Document } from 'mongoose';
import GamesModel from '@schemas/games.s';
import zodObjectId from './common/objectId.ci';
import UserModel from '@schemas/users.s';
import { UserZod } from './user.i';

export const matchZod = z
  .object({
    id: zodObjectId.optional(),
    participant: zodObjectId
      .refine(
        async (val: string) => {
          const result = await UserModel.findById(val);
          if (!result) return false;
          return true;
        },
        {
          message: 'User not found',
          path: ['participant'],
        }
      )
      .or(
        UserZod.refine(
          (val) => {
            const result = UserModel.findById(val.id);
            if (!result) return false;
            return true;
          },
          {
            message: 'User obj not found',
            path: ['participant'],
          }
        )
      ),
    game: zodObjectId.or(
      gameZod.refine(
        (val) => {
          const result = GamesModel.findById(val.id);
          if (!result) return false;
          return true;
        },
        {
          message: 'Game not found',
          path: ['game'],
        }
      )
    ),
    status: z.enum(['pending', 'in-progress', 'finished']),
    score: z.number().int().or(z.string().pipe(z.coerce.number())).optional(),
    time: z
      .object({
        initial: z.union([z.number().int().positive(), z.string(), z.date()]).pipe(z.coerce.date()),
        end: z.union([z.number().int().positive(), z.string(), z.date()]).pipe(z.coerce.date()).optional(),
      })
      .default({
        initial: new Date(),
      }),
    answers: z.array(
      z.object({
        id: zodObjectId,
        answer: z.string(),
        note: z.string().optional(),
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
  })
  .transform(async (data, ctx) => {
    const game = typeof data.game === 'string' ? (await GamesModel.findById(data.game))?.toClient() : data.game;
    if (!game) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Game not found',
        path: ['game'],
      });
      return data;
    }
    data.answers.forEach((answer, i) => {
      const question = game.activity.find((q) => q.id === answer.id);
      if (!question) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Question not found',
          path: ['answers', i],
        });
      }
      data.score = (data.score ?? 0) + (question?.value ?? 0);
    });
    if (data.time.initial) {
      if (data.time.initial > new Date()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Initial time is in the future',
          path: ['time', 'initial'],
        });
      }
    }
    if (data.time.end) {
      if (data.time.end < data.time.initial) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'End time is before initial time',
          path: ['time', 'end'],
        });
      }
    } else if (data.status === 'finished') {
      data.time.end = new Date();
      if (game.type === 'quiz') return data;
      //check the time difference between initial and end in seconds
      const diff = (data.time.end.getTime() - data.time.initial.getTime()) / 1000;
      if (diff < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'End time is before initial time',
          path: ['time', 'end'],
        });
      }
      const maxTimePoints = 300;
      if (!game.time) data.score = data.score ?? 0;
      else {
        let percentage = (diff / game.time) * 100;
        if (percentage > 100) percentage = 100;
        if (percentage < 0) percentage = 0;
        percentage = (100 - percentage) / 100;
        const timePoints = Math.round(maxTimePoints * percentage);
        data.score = (data.score ?? 0) + timePoints;
      }
    }
    return data;
  });

export type IMatch = z.infer<typeof matchZod>;
export type MatchDocument = Omit<IMatch, 'id' | 'answers.id'> &
  Document & {
    toClient: () => IMatch;
  };
