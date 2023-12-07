import { UserZod } from '@interfaces/user.i';
import UserModel from '@schemas/users.s';
import { z } from 'zod';
import zodObjectId from './objectId.ci';

const userId = zodObjectId
  .refine(
    async (value) => {
      const user = await UserModel.findById(value);
      if (!user) {
        return false;
      }
      return true;
    },
    {
      message: 'User not found',
      path: [],
    }
  )
  .or(
    UserZod.transform(async (value, ctx) => {
      const result = await UserZod.safeParseAsync(value);
      if (!result.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'User not valid',
          path: [],
        });
        return value;
      }
      if (value.id) {
        const user = await UserModel.findById(value.id);
        if (!user) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'User not found',
            path: ['id'],
          });
          return value.id;
        }
        value.login.password = user.login.password;
        user.set(value);
        await user.save();
        return value.id;
      }

      const user = new UserModel(result.data);
      await user.save();
      return user.toClient().id;
    })
  );

export default userId;
