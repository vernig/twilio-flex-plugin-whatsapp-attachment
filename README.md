# Flex plugin and Serverless for WhatsApp attachment 

This repo contains a Flex plugin and the Twilio serverless function needed to receive WhatsApp attachments in Flex. 

# Set-up 

## Pre-requisites

* Follow [this blogpost](https://www.twilio.com/blog/whatsapp-and-flex-in-minutes) to add WhatsApp to your Flex istance 
* Install the [Flex plugin for Twilio CLI](https://www.twilio.com/docs/flex/developer/plugins/cli/install)

## Provision Serverless

* `cd` into `serverless` folder
* Copy `env.template` into a new `.env` file 
* In the `.env` file fill in Twilio Account SID and Auth Token 
* Install dependencies 
```shell
npm install
```
* Provision your Flex istance using 
```shell
node provision.js
```

## Flex plugin 

* `cd` into `plugin-whatsapp-attachment`
* Install dependencies
```shell
npm install
```
* Run locally 
```shell 
twilio flex:plugins:start
```
* Deploy 
 ```shell 
twilio flex:plugins:deploy
```