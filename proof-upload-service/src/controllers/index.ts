import { Router } from 'express';
import generatePUTSignedUrl from './s3';
import uploadToSalesforce from './lambda';

const router = Router();

router.route('/signedurls')
  .post(generatePUTSignedUrl);

router.route('/upload')
  .post(uploadToSalesforce);

export default router;
