const accountSid = 'AC3154aa7fd55099896ac13172cf1d2b09';
const authToken = 'e88dd88688bb0c6f3420f9b24fe128c8';
const client = require('twilio')(accountSid, authToken);
    const sendSms = (message, to) => client.messages
    .create({
        body: message,
        from: '+442033228505',
        to: to
    })
    .then(message => console.log(message));
module.exports = {
    sendSms
}