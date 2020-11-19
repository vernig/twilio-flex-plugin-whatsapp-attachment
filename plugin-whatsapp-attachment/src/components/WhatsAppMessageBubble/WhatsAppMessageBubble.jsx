import React from 'react';
import Map from '../Map/Map';

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
    } else if (mediaUrl && mediaUrl.startsWith('geo:')) {
      let locationParsed = mediaUrl.slice(4).split(',');
      return (
        <Map
          lat={locationParsed[1]}
          lng={locationParsed[0]}
          zoom={10}
          mapWidth={'200px'}
          mapHeight={'200px'}
        />
      );
    }

    return <></>;
  }
}
