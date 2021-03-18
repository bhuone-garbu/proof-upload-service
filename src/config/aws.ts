const s3BucketRegion = process.env.S3_BUCKET_REGION;
const s3BucketName = process.env.S3_BUCKET_NAME;

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const lambdaFuncName = process.env.LAMBDA_UPLOAD_FUNC_NAME;
const lambdaRegion = process.env.LAMBDA_REGION;

export {
  s3BucketRegion,
  s3BucketName,
  accessKeyId,
  secretAccessKey,
  lambdaFuncName,
  lambdaRegion,
};
