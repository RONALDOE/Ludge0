import { IUser } from '../../interfaces/user.i';

export type auth =
  | {
      token: string;
      user: IUser;
    }
  | null
  | undefined;
