require('dotenv').config();
const fs = require('fs');
const twilioClient = require('twilio')(
  process.env.ACCOUNT_SID,
  process.env.AUTH_TOKEN
);

const ora = require('ora');
var deploySpinner;
var flexProxyServiceSid;
var serverlessDomain;

function deployServerless() {
  return new Promise((resolve, reject) => {
    deploySpinner = ora('Deploying Serverless').start();
    const { exec } = require('child_process');
    const twilioRun = exec('npm run deploy', (error, stdout, stderr) => {
      deploySpinner.stop();
      if (error) {
        console.error(error);
        reject(error);
      }

      let domain = /domain\s*(\S*)/.exec(stdout);
      if (domain) {
        resolve(domain[1]);
      } else {
        reject(new Error('Serverless Domain not found'));
      }
    });
  });
}

new Promise((resolve, reject) => {
  if (process.env.PROXY_SERVICE_SID) {
    flexProxyServiceSid = process.env.PROXY_SERVICE_SID;
    resolve(flexProxyServiceSid);
  } else {
    twilioClient.proxy.services
      .list({
        friendlyName: 'Flex Proxy Service',
      })
      .then((proxyService) => {
        if (!proxyService) {
          reject(
            'No Flex Proxy service detected. Are you sure this is a Flex project?'
          );
        }
        flexProxyServiceSid = proxyService[0].sid;
        fs.appendFileSync('.env', `\nPROXY_SERVICE_SID=${flexProxyServiceSid}`);
        resolve();
      });
  }
})
  .then(() => deployServerless())
  .then((domain) => {
    console.log(`Serverless deployed to ${domain}`);
    serverlessDomain = domain;
    return twilioClient.proxy.services(flexProxyServiceSid).update({
      callbackUrl: `https://${domain}/flex-proxy-callback`,
    });
  })
  .then(() => {
    console.log('Flex provisioned succesfully');
    console.log(
      `\n ** IMPORTANT **\nGo to https://www.twilio.com/console/sms/whatsapp/senders and change\nthe whatsapp sender "Webhook URL for incoming messages"\nto https://${serverlessDomain}/webhook-proxy\n`
    );
  })
  .catch((err) => console.log(err));
