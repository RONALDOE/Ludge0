import Middleware from '@utils/middleware';
import GameController from './controllers/games.c';
import { Router } from 'express';

const router = Router();
const controller = new GameController();

router.use(Middleware.PrivateRoute);
router.get('/', controller.GetAll);
router.get('/:id', controller.GetOne);
router.put('/', controller.Update);
router.delete('/:id', controller.Delete);
router.post('/', controller.Create);

export default router;
