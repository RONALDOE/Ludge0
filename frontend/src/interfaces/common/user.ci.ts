import { UserZod } from '@interfaces/user.i';
import zodObjectId from './objectId.ci';

const userId = zodObjectId.or(UserZod);

export default userId;
