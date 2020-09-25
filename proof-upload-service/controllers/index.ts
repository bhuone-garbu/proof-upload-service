import { Router } from 'express';
import { createPresignForPUT } from './presigns';

const router = Router();

router.route('/presigns/:loanAppId')
  .post(createPresignForPUT);

export default router;
