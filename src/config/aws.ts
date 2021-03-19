const s3BucketRegion = process.env.S3_BUCKET_REGION as string;
const s3BucketName = process.env.S3_BUCKET_NAME as string;

const accessKeyId = process.env.AWS_ACCESS_KEY_ID as string;
const secretAccessKey = process.env.AWS_SECRET_KEY as string;

const lambdaFuncName = process.env.LAMBDA_UPLOAD_FUNC_NAME as string;
const lambdaRegion = process.env.LAMBDA_REGION as string;

export {
  s3BucketRegion,
  s3BucketName,
  accessKeyId,
  secretAccessKey,
  lambdaFuncName,
  lambdaRegion,
};
