import Middleware from '@utils/middleware';
import MatchController from './controllers/match.c';
import { Router } from 'express';

const router = Router();
const controller = new MatchController();
router.use(Middleware.PrivateRoute);
router.get('/', controller.GetAll);
router.get('/:id', controller.GetOne);
router.put('/', controller.Update);
router.delete('/:id', controller.Delete);
router.post('/', controller.Create);

export default router;
