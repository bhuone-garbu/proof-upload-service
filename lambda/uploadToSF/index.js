const fetch = require('node-fetch');
const getSFOAuth = require('../getSFOAuth');

const uploadToSF = async (fileBinary, contentType, fileName, parentId = '') => {
  const oauthResponse = await getSFOAuth();
  const { accessToken, instanceUrl } = oauthResponse;

  // for docs: https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_sobject_insert_update_blob.htm
  const contentVersionUrl = `${instanceUrl}/services/data/v43.0/sobjects/ContentVersion`;
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

  // multi-part upload
  const { id: versionId } = await fetch(contentVersionUrl, {
    method: 'POST',
    body: payload,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': `multipart/form-data; boundary="${boundaryString}"`
    }
  })
    .then(res => res.json());

  // retrieve the document id from the uploaded content version
  const { ContentDocumentId } = await fetch(`${contentVersionUrl}/${versionId}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    }
  })
    .then(res => res.json());
  
  
  // create ContentDocumentLink to link the above file with an object to share
  await fetch(`${instanceUrl}/services/data/v43.0/sobjects/ContentDocumentLink`, {
    method: 'POST',
    body: JSON.stringify({
      ContentDocumentId,
      LinkedEntityId: parentId, // this is the object where the document will shared
      Visibility: 'InternalUsers', // access can be either InternalUsers, AllUsers or SharedUsers according to docs
    }),
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });


  return { documentId: ContentDocumentId, linkedWith: parentId };
}

module.exports = uploadToSF;
