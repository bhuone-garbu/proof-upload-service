require('dotenv').config();
const fetch = require('node-fetch');
// const fs = require('fs');
const AWS = require('aws-sdk');

const getSFOauth = require('./getSFOauth');

const uploadToSF = async (fileBinary, contentType, fileName) => {

  const oauthResponse = await getSFOauth();
  const { accessToken, instanceUrl } = oauthResponse;

  // for documentation: https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_sobject_insert_update_blob.htm
  const url = `${instanceUrl}/services/data/v43.0/sobjects/ContentVersion`;
  const boundaryString = `b0undry${new Date().getTime()}`;

  let data = `--${boundaryString}\r\n`;
  data += `Content-Disposition: form-data; name="${fileName}";\r\n`;
  data += 'Content-Type: application/json\r\n\r\n';

  data += `${JSON.stringify({ PathOnClient: fileName })}\r\n\r\n`;
  data += `--${boundaryString}\r\n`;

  data += `Content-Disposition: form-data; name="VersionData"; filename="${fileName}";\r\n`;
  data += `Content-Type: ${contentType}\r\n\r\n`;

  const payload = Buffer.concat([
    Buffer.from(data, 'utf-8'),
    Buffer.from(fileBinary, 'binary'),
    Buffer.from(`\r\n\r\n--${boundaryString}--\r\n`, 'utf-8')
  ]);

  fetch(url, {
    method: 'POST',
    body: payload,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': `multipart/form-data; boundary="${boundaryString}"`
    }
  })
    .then(res => res.json())
    .then(res => console.log(res));
}

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

exports.handler = async (event) => {

  const bucketName = 'sf-payout-proof';
  const { bucketKeyName } = event;

  if (!bucketKeyName) return {
    statusCode: 400,
    body: JSON.stringify({
      message: 'bucketKeyName was not provided'
    }),
  };
  
  const fileName = bucketKeyName.substring(bucketKeyName.lastIndexOf('/') + 1);

  try{
    const s3Object = await getS3Object(bucketName, bucketKeyName);
    await uploadToSF(s3Object.Body, s3Object.contentType, fileName);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Upload to SF successfull' }),
    }
  } catch (error) {
    return {
      statusCode: error.statusCode,
      body: JSON.stringify({
        message: `Failed to read S3 object ${error}`
      }),
    };
  }
};
