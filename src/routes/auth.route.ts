import { Router } from 'express';
import { login, otp } from '../controllers/auth.controller';

const router: Router = Router();

router.post('/login', login);
router.post('/otp', otp);

export default router;
