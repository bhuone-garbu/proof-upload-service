const AWS = require('aws-sdk');
const uploadToSF = require('./uploadToSF');

const getS3Object = (bucketName, bucketKeyName) => {
  const s3 = new AWS.S3();

  const params = {
    Bucket: bucketName,
    Key: bucketKeyName,
  };

  return new Promise((resolve, reject) => {
    s3.getObject(params, (error, data) => {
      if (error) reject(error);
      else resolve(data);
    })
  })
}

exports.handler = async(event) => {
  const bucketName = process.env.BUCKET_NAME;
  const { bucketKeyName } = event;

  if (!bucketKeyName) return {
    statusCode: 400,
    body: {
      message: '\'bucketKeyName\' was not provided'
    }
  };

  const fileName = bucketKeyName.substring(bucketKeyName.lastIndexOf('/') + 1);

  const s3Object = await getS3Object(bucketName, bucketKeyName);
  const uploadResult = await uploadToSF(s3Object.Body, s3Object.contentType, fileName);
  return {
    statusCode: 200,
    body: { 
      message: 'Successfully uploaded to SF',
      salesforceResult: uploadResult
    }
  }
};
