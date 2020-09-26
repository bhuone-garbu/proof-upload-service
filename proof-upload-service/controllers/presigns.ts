import AWS from 'aws-sdk';
import { Request, Response } from 'express';
import {
  accessKeyId, secretAccessKey, bucketName, bucketRegion,
} from '../config/aws';

if (!accessKeyId || !secretAccessKey || !bucketName) {
  throw new Error('environment variables not set properly');
}

console.log('throw');

const credentials = {
  accessKeyId,
  secretAccessKey,
};

AWS.config.update({ credentials, region: bucketRegion });
const s3 = new AWS.S3();

const createPresignForPUT = (req: Request, res: Response) => {
  const { loanAppId } = req.params;
  const presignedUrl = s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: `staging/${loanAppId}/test.jpg`,
    Expires: 180,
  });
  res.send({ presignedUrl });
};

export {
  createPresignForPUT,
};
