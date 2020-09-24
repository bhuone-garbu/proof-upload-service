require('dotenv').config();
import express from 'express';
import AWS from 'aws-sdk';

const app = express();
const PORT = process.env.PORT || 8000;

const bucketRegion = 'eu-west-2';
const bucketName = 'sf-payout-proof';

const credentials = {
  accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
  secretAccessKey : process.env.S3_SECRET_KEY || ''
};

AWS.config.update({ credentials, region: bucketRegion });
const s3 = new AWS.S3();
const awsLambda = new AWS.Lambda();

app.get('/', (_, res) => res.send('Hello word from Express'));

// make a request to get a presigned url for PUT
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
    FunctionName: 'test',
    Payload: 'token'
  });
});

app.listen(PORT, () => console.log(`⚡️Server is running at port: ${PORT}`));
