// authorization.js
const {authenticate} = require('@google-cloud/local-auth');
const { OAuth2Client } = require('google-auth-library');
const {google} = require('googleapis');
const { isTokenExpiringSoon } = require('./tokenTimestampExpiriy')
const { loadSavedCredentialsIfExist, saveCredentials } = require('./credentials');
const path = require('path');

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const CREDENTIALS_PATH = path.join(process.cwd(), './src/credentials.json');
// const { CREDENTIALS_PATH } = require('./credentials');

async function authorize() {
  let credentials = await loadSavedCredentialsIfExist();
  if (credentials) {
    const client = new google.auth.OAuth2();
    client.setCredentials(credentials);
    if (!client.isTokenExpiringSoon()){
      return client 
    };
  }
  const client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

module.exports = authorize;