import BaseController from './base.c';
import { IUser, UserDocument, UserZod } from '@interfaces/user.i';
import UserModel from '@schemas/users.s';

const Verify = (data: unknown) => UserZod.safeParseAsync(data);

class UserController extends BaseController<UserDocument, IUser> {
  constructor() {
    super(UserModel, Verify);
    super.GetAll = this.GetAll.bind(this);
  }
}

// export const CreateMany = async (data: IUser[]) => {
//   const result = await UserModel.insertMany(data);
//   return result;
// };

export default UserController;
