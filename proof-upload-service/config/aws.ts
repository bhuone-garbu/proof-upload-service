const bucketRegion = process.env.BUCKET_REGION;
const bucketName = process.env.BUCKET;

const accessKeyId = process.env.S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.S3_SECRET_KEY;

const lambdaFuncName = process.env.LAMBA_FUNC_NAME;

export {
  bucketRegion,
  bucketName,
  accessKeyId,
  secretAccessKey,
  lambdaFuncName,
};
