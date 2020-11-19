import React from 'react';
import mapboxgl from 'mapbox-gl';
import MapMarker from './CenteredMapMarker';
import './Map.css';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_GL_ACCESS_TOKEN

export default class Map extends React.Component {
  componentDidMount() {
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.props.lat, this.props.lng],
      zoom: this.props.zoom,
      interactive: false,
    });
  }

  render() {
    return (
      <div
        className="mapContainerContainer"
        style={{ width: this.props.mapWidth, height: this.props.mapHeight }}
      >
        <MapMarker
          mapContainerWidth={this.props.mapWidth}
          mapContainerHeight={this.props.mapHeight}
        />
        <div ref={(el) => (this.mapContainer = el)} className="mapContainer" />
      </div>
    );
  }
}
