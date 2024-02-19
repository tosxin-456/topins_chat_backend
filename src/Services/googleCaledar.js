const { google } = require('googleapis'); 
const { oAuth2 } = google.auth
const clientId = '45952624705-d73mek5uq7chrv9v4grg1ucmfu9635rc.apps.googleusercontent.com'
const clientSecret = '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'
const oAuth2ClientId = new oAuth2(clientId,clientSecret)

oAuth2ClientId.setCredentials({
  refreshToken:'1//04r_Fnue0jbBnCgYIARAAGAQSNwF-L9IrOmvi2pJpf5VAvzyeso5AUw-QMgvxcJPFjldq6Pk4pVe7Az8ONBZeQ429gO0Ik8GYJf0 '
})


const calendar = google.calendar({version:'v3', auth:oAuth2ClientId})