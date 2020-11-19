# Flex plugin and Serverless for WhatsApp attachment 

![image](https://user-images.githubusercontent.com/54728384/99153991-4049c300-26a4-11eb-858a-4cb32a898152.png)

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
* At the end of the script execution, follow the instructions provided by the script to modify the WhatsApp sender webhook

## Flex plugin 

* `cd` into `plugin-whatsapp-attachment`
* Install dependencies
```shell
npm install
```
* Copy `.env.template` into `.env.` and fill in the value for: 
  * `REACT_APP_MAPBOX_GL_ACCESS_TOKEN`: this the token for MapBox. You can get a free one at https://www.mapbox.com/
* Run locally 
```shell 
twilio flex:plugins:start
```
* Deploy 
 ```shell 
twilio flex:plugins:deploy
```
