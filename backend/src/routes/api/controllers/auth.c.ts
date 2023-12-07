import { Response, Request } from 'express';
import UserModel from '@schemas/users.s';
import TeacherModel from '@schemas/teachers.s';
import StudentModel from '@schemas/students.s';
import Encrypt from '@libs/encyrpt';
import jwt from '@libs/jwt';

export const Login = async (req: Request, res: Response) => {
  if (!req.body.login) {
    res.status(400).send({
      msg: 'Missing login data',
      err: {
        where: 'body.login',
        code: 400,
      },
    });
    return;
  }

  const { username, password } = req.body.login;
  if (!username || !password) {
    res.status(400).send({
      msg: 'Missing username or password',
      err: {
        where: 'body.login',
        code: 400,
      },
    });
    return;
  }

  const user = await UserModel.findOne({
    $or: [{ 'login.username': username }, { 'login.email': username }],
  });
  if (!user) {
    res.status(400).send({
      msg: 'User not found',
      err: {
        where: 'body.login',
        code: 400,
      },
    });

    return;
  }

  if (!(await Encrypt.compare(password, user.login.password))) {
    res.status(400).send({
      msg: 'Incorrect password',
      err: {
        where: 'body.login.password',
        code: 400,
      },
    });
    return;
  }

  const token = jwt.sign({ id: user._id });
  const isTeacher = user.role === 'teacher';
  const data = await (!isTeacher
    ? StudentModel.findOne({ user: user._id.toString() })
    : TeacherModel.findOne({ user: user._id.toString() }));
  res.status(200).send({
    msg: 'Logged in',
    token,
    user: user.toClient(),
    data: data?.toClient(),
  });

  return;
};

export const Auth = async (req: Request, res: Response) => {
  if (!req.auth) {
    res.status(401).send({
      msg: 'Unauthorized',
      err: {
        where: 'headers.authorization',
        code: 401,
      },
    });

    return;
  }
  const isTeacher = req.auth.user.role === 'teacher';
  const data = await (!isTeacher
    ? StudentModel.findOne({ user: req.auth.user.id })
    : TeacherModel.findOne({ user: req.auth.user.id }));
  res.status(200).send({
    msg: 'Authorized',
    token: req.auth.token,
    user: req.auth.user,
    data: data?.toClient(),
  });

  return;
};
