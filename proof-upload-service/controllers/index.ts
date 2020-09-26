import { Router } from 'express';
import { createPresignForPUT } from './presigns';

const router = Router();

router.route('/presigns/:loanAppId')
  .post(createPresignForPUT);

// router.route('/upload')

export default router;
