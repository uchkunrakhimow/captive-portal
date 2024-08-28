import { Router } from 'express';
import { pathFile } from '../utils/fileUpload';
import { fileUpload, ipList } from '../controllers/adminController';

const router: Router = Router();

router.get('/ip-list', ipList);
router.post('/fileUpload', pathFile.single('file'), fileUpload);

export default router;
