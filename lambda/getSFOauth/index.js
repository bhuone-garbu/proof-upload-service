const fetch = require('node-fetch');

let salesforceToken;
let expiryDate;

const SF_OAUTH_ENDPOINT = 'https://test.salesforce.com/services/oauth2/token';

const serialize = obj => {
  const paramValueList = Object.keys(obj).map((key) => `${key}=${encodeURIComponent(obj[key])}`);
  return paramValueList.join('&');
}

const getSFOauth = async () => {

  // TODO: double check if this is okay
  if (salesforceToken && new Date() < expiryDate) {
    return Promise.resolve(salesforceToken);
  }

  const oauthBody = {
    client_id: process.env.SF_CLIENT_ID,
    client_secret: process.env.SF_CLIENT_SECRET,
    grant_type: 'password',
    password: process.env.SF_PASSWORD,
    username: process.env.SF_USERNAME,
  };

  fetch(SF_OAUTH_ENDPOINT, {
    method: 'POST',
    body: serialize(oauthBody),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
    .then(res => res.json())
    .then(result => {
      // eslint-disable-next-line camelcase
      const { access_token, issued_at, instance_url } = result;

      // eslint-disable-next-line camelcase
      salesforceToken = access_token;
      const issuedDate = new Date(issued_at);
      expiryDate = issuedDate.setHours(issuedDate.getHours + 2);

      return { accessToken: access_token, instanceUrl: instance_url };
    });
}

exports.getSFOauth = getSFOauth;
