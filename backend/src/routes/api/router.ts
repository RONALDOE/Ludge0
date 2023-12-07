import { Router } from 'express';
import auth from './auth.api';
import student from './students.api';
import teacher from './teachers.api';
import user from './users.api';
import game from './games.api';
import match from './matches.api';
import Middleware from '@utils/middleware';

const router = Router();
router.use(Middleware.VerifyToken);
router.get('/', (_req, res) => {
  res.send('Hello World! from api router');
});

router.use('/auth', auth);
router.use('/users', user);
router.use('/students', student);
router.use('/teachers', teacher);
router.use(Middleware.PrivateRoute);
router.use('/games', game);
router.use('/matches', match);

export default router;
