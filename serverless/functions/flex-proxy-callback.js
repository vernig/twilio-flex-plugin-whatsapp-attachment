async function getAttributes(client, chatService, chatChannel, messageSid) {
  let message = await client.chat
    .services(chatService)
    .channels(chatChannel)
    .messages(messageSid)
    .fetch();
  return JSON.parse(message.attributes);
}

async function fetchMediaType(client, url) {
  let parsedUrl = /Messages\/(.*)\/Media\/(.*)/.exec(url);
  let mesageSid = parsedUrl[1];
  let mediaSid = parsedUrl[2];
  let media = await client.messages(mesageSid).media(mediaSid).fetch();
  return media.contentType;
}

exports.handler = async function (context, event, callback) {
  let response;
  let interactionMediaUrl = event.interactionMediaUrl0;

  if (interactionMediaUrl) {
    let interactionService = event.interactionServiceSid;
    let interactionSession = event.interactionSessionSid;
    let messageSid = event.outboundResourceSid;

    const client = context.getTwilioClient();

    let chatService = (await client.proxy.services(interactionService).fetch())
      .chatInstanceSid;

    let proxySession = await client.proxy
      .services(interactionService)
      .sessions(interactionSession)
      .fetch();
    let chatChannel = proxySession.uniqueName.slice(0, 34);

    let messageAttributes = await getAttributes(
      client,
      chatService,
      chatChannel,
      messageSid
    );
    messageAttributes.mediaUrl = interactionMediaUrl;
    messageAttributes.mediaType = await fetchMediaType(
      client,
      interactionMediaUrl
    );
    await client.chat
      .services(chatService)
      .channels(chatChannel)
      .messages(messageSid)
      .update({ attributes: JSON.stringify(messageAttributes) });
    callback(null, '');
  } else {
    response = '';
    callback(null, '');
  }
};
