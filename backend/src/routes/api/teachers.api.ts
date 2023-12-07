import { Router } from 'express';
import TeachersController from './controllers/teachers.c';
import Middleware from '@utils/middleware';

const router = Router();
const controller = new TeachersController();

router.post('/', controller.Create);
router.use(Middleware.PrivateRoute);
router.get('/', controller.GetAll);
router.get('/:id', controller.GetOne);
router.put('/', controller.Update);
router.delete('/:id', controller.Delete);

export default router;
