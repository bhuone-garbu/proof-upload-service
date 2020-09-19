const fetch = require('node-fetch');
const fs = require('fs');

// Building request body based on the documentation from SF here:
// https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_sobject_insert_update_blob.htm
// Insert 'ContentVersion' to be precious
const salesforceInstance = 'https://oodle--uat.my.salesforce.com';
const url = `${salesforceInstance}/services/data/v43.0/sobjects/ContentVersion`
const testImagePath = '/Users/bhuwan.garbuja/Downloads/Oodle App.mp4';
const boundaryString = new Date().getTime();

const accessToken = '';

function serialize(obj) {
  const paramValueList = Object.keys(obj).map((key) => `${key}=${encodeURIComponent(obj[key])}`);
	return paramValueList.join('&');
}

function getSFToken() {
  const sfOauthEndpoint = 'https://test.salesforce.com/services/oauth2/token';
  fetch(sfOauthEndpoint, {
    method: 'POST',
    body: serialize({
      client_id: '',
      client_secret: '',
      username: '',
      password: '',
      grant_type: 'password',
    }),
    headers: {
      'Content-Type': 'x-www-form-urlencoded'
    }
  });
}

const obj = {
  lol: 123,
  'Sf-67': 'hfhf '
}
console.log('test: ', serialize(obj));

fs.readFile(testImagePath, (error, fileBinary) => {

  if (error) {
    console.error('Failed to load the file: ', error);
    return;
  }

  // TODO: write functions and abstract the logic once things are working
  let data = `--${boundaryString}\r\n`;
  const destinationFileName = 'Oodle App.mp4';
  data += `Content-Disposition: form-data; name="${destinationFileName}";\r\n`;
  data += 'Content-Type: application/json\r\n\r\n';

  data += `${JSON.stringify({ 'PathOnClient': destinationFileName })}\r\n\r\n`;
  data += `--${boundaryString}\r\n`;

  data += `Content-Disposition: form-data; name="VersionData"; filename="${destinationFileName}";\r\n`;
  data += 'Content-Type: video/mp4\r\n\r\n';

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
    .then(res => console.log(res))
    .catch(error => console.error(error));
})

