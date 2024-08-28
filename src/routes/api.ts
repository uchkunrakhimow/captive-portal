import { Router } from 'express';
import { getExample } from '../controllers/apiController';

const router: Router = Router();
router.get('/', getExample);

export default router;
