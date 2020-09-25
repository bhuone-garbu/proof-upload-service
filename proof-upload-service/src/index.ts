require('dotenv').config();
import express from 'express';
import AWS from 'aws-sdk';

const app = express();
const PORT = process.env.PORT || 8000;

const bucketRegion = process.env.BUCKET_REGION;
const bucketName = process.env.BUCKET_NAME;

const accessKeyId = process.env.S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.S3_SECRET_KEY;
const lambdaFuncName = process.env.LAMBA_FUNC_NAME;

if (!accessKeyId || !secretAccessKey || !lambdaFuncName) {
  throw new Error('environment variables not set properly');
}

const credentials = {
  accessKeyId,
  secretAccessKey
};

AWS.config.update({ credentials, region: bucketRegion });
const s3 = new AWS.S3();
const awsLambda = new AWS.Lambda();

app.get('/', (_, res) => res.send('Hello word from Express'));

// make a request to get a presigned url for one PUT object key
app.post('/presigns/:loanAppId', (req, res) => {
  const { loanAppId } = req.params;
  const presignedUrl = s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: `staging/${loanAppId}/test.jpg`,
    Expires: 180,
  })
  res.send({ presignedUrl });
});

app.post('/upload-presign', (req, res) => {
  awsLambda.invoke({
    FunctionName: lambdaFuncName,
    Payload: req.body,
  });
});

app.listen(PORT, () => console.log(`⚡️Server is running at port: ${PORT}`));
