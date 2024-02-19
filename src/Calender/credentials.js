// credentials.js
const fs = require('fs').promises;
const path = require('path');
const process = require('process');

const TOKEN_PATH = "./src/token.json";
// const CREDENTIALS_PATH = path.join(process.cwd(), './src/credentials.json');
const CREDENTIALS_PATH = "./src/credentials.json";

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
    //return credentials;
  } catch (err) {
    return null;
  }
}


/**
 * Serializes credentials to a file compatible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;

    // Calculates the expiration timestamp based on current time and expires_in
    const currentTimestamp = Math.floor(Date.now() / 1000);         // Current time in seconds
    const expiresIn = client.credentials.expires_in || 3600;        // sets default to 3600
    const expiryTimestamp = currentTimestamp + expiresIn;           // Expiration timestamp

    const payload = JSON.stringify({
      type: 'authorized_user',
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
      expires_in: expiryTimestamp,
    });
    await fs.writeFile(TOKEN_PATH, payload);
}


module.exports = { loadSavedCredentialsIfExist, saveCredentials };