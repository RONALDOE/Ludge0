import Middleware from '@utils/middleware';
import StudentController from './controllers/students.c';
import { Router } from 'express';

const router = Router();
const controller = new StudentController();

router.post('/', controller.Create);
router.use(Middleware.PrivateRoute);
router.get('/', controller.GetAll);
router.get('/:id', controller.GetOne);
router.put('/', controller.Update);
router.delete('/:id', controller.Delete);

export default router;
