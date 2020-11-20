const TwilioWebhookDispatch = require('twilio-webhook-dispatch');

exports.handler = function (context, event, callback) {
  console.log(event);
  if (event.Latitude) {
    event.MediaUrl0 = `geo:${event.Latitude},${event.Longitude}`;
  }
  TwilioWebhookDispatch(
    context,
    event,
    `https://webhooks.twilio.com/v1/Accounts/${context.ACCOUNT_SID}/Proxy/${process.env.PROXY_SERVICE_SID}/Webhooks/Message`
  )
    .then(() => callback(null, ''))
    .catch((err) => calbback(500, err));
};
