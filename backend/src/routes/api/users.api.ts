import { Router } from 'express';
import UserController from './controllers/users.c';
import Middleware from '@utils/middleware';

const router = Router();
const controller = new UserController();

router.post('/', controller.Create);
router.use(Middleware.PrivateRoute);
router.get('/', controller.GetAll);
router.get('/:id', controller.GetOne);
router.delete('/:id', controller.Delete);
router.put('/', controller.Update);

export default router;
