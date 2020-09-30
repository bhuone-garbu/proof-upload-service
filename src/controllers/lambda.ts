import { Lambda } from 'aws-sdk';
import { Request, Response } from 'express';
import { accessKeyId, secretAccessKey, lambdaRegion } from '../config/aws';

if (!accessKeyId || !secretAccessKey || !lambdaRegion) {
  throw new Error('AWS credentials and bucket environment variables not set properly');
}

type LIRequest = Lambda.InvocationRequest;

interface LIResponse {
  statusCode: number;
  body: {
    [any: string]: unknown
  };
}

interface LambdaPayload {
  bucketKeyName: string
}

const credentials = {
  accessKeyId,
  secretAccessKey,
};

const awsLambda = new Lambda({ credentials, region: lambdaRegion });

const invokeLambda = (functionName: string, payload: LambdaPayload): Promise<LIResponse> => {
  const params: LIRequest = {
    FunctionName: functionName,
    Payload: JSON.stringify(payload),
  };

  return new Promise((resolve, reject) => {
    awsLambda.invoke(params, (error, data) => {
      if (error) reject(error);
      else resolve(JSON.parse(data.Payload as string));
    });
  });
};

const uploadToSalesforce = (req: Request, res: Response): void => {
  invokeLambda('uploadToSF', req.body)
    .then(result => res.status(result.statusCode).json(result.body))
    .catch(error => res.status(500).json(error));
};

export default uploadToSalesforce;
