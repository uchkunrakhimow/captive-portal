import { Router } from 'express';
import { login, otp } from '../controllers/authController';

const router: Router = Router();

router.post('/login', login);
router.post('/otp', otp);

export default router;
