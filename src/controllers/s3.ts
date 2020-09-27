import { S3 } from 'aws-sdk';
import { Request, Response } from 'express';
import {
  accessKeyId, secretAccessKey, s3BucketName, s3BucketRegion,
} from '../config/aws';

if (!accessKeyId || !secretAccessKey || !s3BucketName || !s3BucketRegion) {
  throw new Error('AWS credentails and bucket environment variables not set properly');
}

interface S3PresignRequest {
  operation: 'putObject' | 'getObject';
  bucketKeyName: string;
  expiresIn: number;
}

interface RequestBody {
  loanAppId: string;
  fileName: string;
  verificationCheckId?: string;
}

const credentials = {
  accessKeyId,
  secretAccessKey,
};

const getSignedUrl = ({
  operation, bucketKeyName, expiresIn,
}: S3PresignRequest): Promise<string> => {
  const s3 = new S3({ credentials, region: s3BucketRegion });

  const params = {
    Bucket: s3BucketName,
    Key: bucketKeyName,
    Expires: expiresIn,
  };

  return new Promise((resolve, reject) => {
    s3.getSignedUrl(operation, params, (error, data) => {
      if (error) reject(error);
      else resolve(data);
    });
  });
};

const generatePUTSignedUrl = (req: Request, res: Response): void => {
  const {
    loanAppId, fileName, verificationCheckId,
  }: RequestBody = req.body;

  // TODO: look into the best way of handling errors
  if (!loanAppId) {
    res.status(400).send({ message: 'Invalid request body' });
    return;
  }

  const operation = 'putObject';

  let bucketKeyName = `staging/${loanAppId}`;
  if (verificationCheckId) {
    bucketKeyName += `/${verificationCheckId}`;
  }
  bucketKeyName += `/${fileName}`;

  getSignedUrl({ operation, bucketKeyName, expiresIn: 180 })
    .then(signedUrl => res.status(201).json({
      bucketKeyName, loanAppId, verificationCheckId, signedUrl, fileName,
    }))
    .catch(error => res.status(500).json(error));
};

export default generatePUTSignedUrl;