import Logger from '../../libs/logger';
import { auth } from './costumes';

declare global {
  // eslint-disable-next-line no-unused-vars
  namespace Express {
    export interface Request {
      logger: Logger;
      auth: auth;
    }
  }
}
