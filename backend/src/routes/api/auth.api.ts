import { Router } from 'express';
import { Login, Auth } from './controllers/auth.c';

const router = Router();

router.post('/login', Login);
//router.post('/signup', Signup);
router.get('/', Auth);

export default router;
