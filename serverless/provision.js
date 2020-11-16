require('dotenv').config();
const twilioClient = require('twilio')(
  process.env.ACCOUNT_SID,
  process.env.AUTH_TOKEN
);

const ora = require('ora');
var deploySpinner;
var twilioServerlessDomain;

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

deployServerless()
  .then((domain) => {
    console.log(`Serverless deployed to ${domain}`);
    twilioServerlessDomain = domain;
    return twilioClient.proxy.services.list({
      friendlyName: 'Flex Proxy Service',
    });
  })
  .then((proxyService) => {
    if (proxyService) {
      let flexProxyServiceSid = proxyService[0].sid;
      return twilioClient.proxy
        .services(flexProxyServiceSid)
        .update({ callbackUrl: `https://${twilioServerlessDomain}/flex-proxy-callback` });
    } else {
      return Promise.reject(
        'No Flex Proxy service detected. Are you sure this is a Flex project?'
      );
    }
  })
  .then((flexProxyService) => {
    console.log('Flex provisioned succesfully');
  })
  .catch((err) => console.log(err));
