import React from 'react';

export default class WhatsAppMessageBubble extends React.Component {
  render() {
    console.log(this.props.message);
    let mediaUrl = this.props.message.source.state.attributes.mediaUrl;
    let mediaType = this.props.message.source.state.attributes.mediaType;
    if (mediaUrl && mediaType) {
      if (mediaType.startsWith('image')) {
        return (
          <>
            <img src={mediaUrl} width="250px" />
          </>
        );
      } else if (mediaType.startsWith('audio')) {
        return (
          <>
            <audio controls src={mediaUrl}></audio>
          </>
        );
      } else if (mediaType.startsWith('video')) {
        return (
          <video controls width="250px">
            <source src={mediaUrl} type={mediaType} />
          </video>
        );
      }
    }

    return <></>;
  }
}
