require('dotenv').config();

// Assuming tokenJSON is the JSON object containing the token data
const tokenJSON = {
    "type": process.env.TYPE,
    "client_id": process.env.CLIENT_ID,
    "client_secret": process.env.CLIENT_SECRET,
    "refresh_token": process.env.REFRESH_TOKEN
};
  
function isTokenExpiringSoon(tokenJSON) {
    const expiresIn = tokenJSON.expires_in;
    const expirationThreshold = 3600; // 60 minutes

    if (expiresIn < (expirationThreshold/2)) {
        // If the time until expiration is less than half of the expiration threshold,
        // it is considered expiring soon
        console.log("Access token is expiring soon. Reauthorization is required.");
    } else {
        console.log("Access token is still valid");
    }
} 
  
module.exports = isTokenExpiringSoon