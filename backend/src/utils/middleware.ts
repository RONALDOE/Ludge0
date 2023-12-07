import { Request, Response, NextFunction } from 'express';
import jwt from '@libs/jwt';
import Logger from '@libs/logger';
import UserModel from '@schemas/users.s';

export interface Err {
  status: number;
  msg: string;
  err?: any;
}

const Middleware = {
  NotFound: (req: Request, res: Response) => {
    req.logger = new Logger({
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      url: req.originalUrl,
    });
    const err: Err = { msg: `Not Found - ${req.originalUrl}`, status: 404 };
    req.logger.Warn(err.msg);
    res.status(404).send(err);
  },
  ErrorHandler: (
    err: Err,
    req: Request,
    res: Response<Err>
    // next: NextFunction
  ) => {
    req.logger.Log(err);
    req.logger.Error(err.msg);
    res.status(err.status || 500).send(err);
  },
  VerifyToken: async (req: Request, _: Response, next: NextFunction) => {
    req.logger = new Logger({
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      url: req.originalUrl,
    });

    const bearer = req.headers.authorization;
    if (!bearer) {
      req.logger.Warn('no bearer provided on middle');
      req.auth = null;
      next();
      return;
    }
    const token = bearer.split(' ')[1];

    if (!token) {
      req.logger.Warn('no token provided on middle');
      req.auth = null;
      next();
      return;
    }
    const decoded: any = jwt.verify(token);
    if (decoded.status.isExpired === true) {
      req.logger.Warn('token expired on middle');
      req.auth = null;
      next();
      return;
    }

    if (decoded.status.isValid !== true) {
      req.logger.Warn('token not valid on middle');
      req.auth = null;
      next();
      return;
    }

    const user = await UserModel.findById(decoded.data.id);
    if (!user) {
      //const err: Err = { msg: 'user not found', status: 401 };
      req.auth = null;
      next();
      return;
    }
    if (user.status !== 'active') {
      req.logger.Warn('user not active');
      //const err: Err = { msg: 'user not active', status: 401 };
      req.auth = null;
      next();
      return;
    }

    req.auth = {
      token,
      user: user.toClient(),
    };

    next();
    return;
  },

  PrivateRoute: (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth) {
      const err: Err = { msg: 'token not provided or invalid ', status: 401 };
      req.logger.Warn('no token provided');
      res.status(401).send(err);
      return;
    }
    next();
    return;
  },
};

export default Middleware;
