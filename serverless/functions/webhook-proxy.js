const crypto = require('crypto');
const fetch = require('node-fetch');

function createDigest(url, bodyData, authToken) {
  let data = url;
  data = Object.keys(bodyData)
    .sort()
    .reduce((acc, key) => acc + key + bodyData[key], data);

  return crypto
    .createHmac('sha1', authToken)
    .update(Buffer.from(data, 'utf-8'))
    .digest('base64');
}

function json2urlencoded(bodyData) {
  return Object.keys(bodyData)
    .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(bodyData[k]))
    .join('&');
}

function twilioWebhookDispatch(context, url, event) {
  const authorization = Buffer.from(
    `${context.ACCOUNT_SID}:${context.AUTH_TOKEN}`
  );
  options = {
    method: 'POST',
    body: json2urlencoded(event),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'x-twilio-signature': createDigest(url, event, context.AUTH_TOKEN),
      accept: '*/*',
      'user-agent': 'TwilioProxy/1.1',
    },
  };

  return fetch(url, options)
    .then((res) => {
      if (res.ok) {
        return Promise.resolve();
      } else {
        return Promise.reject(new Error('Webhook returned error'));
      }
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

exports.handler = function (context, event, callback) {
  console.log(event);
  if (event.Latitude) {
    event.MediaUrl0 = `geo:${event.Latitude},${event.Longitude}`;
  }
  twilioWebhookDispatch(
    context,
    `https://webhooks.twilio.com/v1/Accounts/${context.ACCOUNT_SID}/Proxy/${process.env.PROXY_SERVICE_SID}/Webhooks/Message`,
    event
  )
    .then(() => callback(null, ''))
    .catch((err) => calbback(500, err));
};
