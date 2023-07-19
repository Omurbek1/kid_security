import React, { PureComponent } from 'react';
import MapView from 'react-native-maps';
import lodash from 'lodash';
import PropTypes from 'prop-types';

export default class MapMarker extends PureComponent {
  state = {
    tracksViewChanges: true,
  };
  marker = null;
  timer = null;

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!lodash.isEqual(this.props, nextProps)) {
      this.setState(() => ({
        tracksViewChanges: true,
      }));
    }
  }
  componentDidUpdate() {
    if (this.state.tracksViewChanges) {
      this.setState(() => ({
        tracksViewChanges: false,
      }));
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  componentDidMount() {
    if (this.props.showCallout && this.marker) {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        if (this.marker && this.marker.showCallout) {
          this.marker.showCallout();
        }
      }, 200);
    }
  }

  render() {
    return (
      <MapView.Marker
        ref={(ref) => (this.marker = ref)}
        tracksViewChanges={this.state.tracksViewChanges}
        {...this.props}>
        {this.props.children}
      </MapView.Marker>
    );
  }
}

MapMarker.defaultProps = {
  children: null,
};

MapMarker.propTypes = {
  children: PropTypes.any,
};
