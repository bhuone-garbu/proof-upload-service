import { Router } from 'express';
import generatePUTSignedUrl from '../controllers/s3';
import uploadToSalesforce from '../controllers/lambda';

const router = Router();

router.route('/signedurls').post(generatePUTSignedUrl);
router.route('/upload').post(uploadToSalesforce);

export default router;
