import React from 'react';
import MapView from 'react-native-maps';
import {
  Text,
  StyleSheet,
  View,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MapZoomPanel from '../components/MapZoomPanel';
import { controlActionCreators } from '../reducers/controlRedux';
import { popupActionCreators } from '../reducers/popupRedux';
import { CustomProgressBar, getZoomFromRegion, getRegionForZoom, maxZoomForLayer } from '../Utils';
import Const from '../Const';
import { L } from '../lang/Lang';
import UserPrefs from '../UserPrefs';
import NavigationService from '../navigation/NavigationService';
import { waitForConnection } from '../Helper';
import { RoundedPane } from '../components/atom/RoundedPane';
import * as Metrica from '../analytics/Analytics';

const HOME_PIN_IMG = require('../img/ic_home_pin.png');
const HOME_RADIUS = 200;

class AddHomePlacePage extends React.Component {
  static navigationOptions = () => {
    return {
      header: null,
    };
  };

  state = {
    isProgress: false,
    progressTitle: null,
  };

  timeout = null;

  openProgressbar = (title) => {
    this.setState({ isProgress: true, progressTitle: title });
  };

  hideProgressbar = () => {
    this.setState({ isProgress: false });
  };

  async componentDidMount() {
    const { navigation } = this.props;

    this.pickMapLayer(UserPrefs.all.mapLayer);

    // center current user position
    const lat = navigation.getParam('lat');
    const lon = navigation.getParam('lon');
    if (lat && lon) {
      setTimeout(() => this.fitToRadius(lat, lon, 500), 0);
    }
  }

  UNSAFE_componentWillMount() {
    const { all } = UserPrefs;
    const { navigation, mapLayer } = this.props;

    this.region = navigation.getParam('region');
    this.zoom = navigation.getParam('zoom');
    if (!this.zoom) {
      this.zoom = all.zoom;
    }
    if (!this.zoom) {
      this.zoom = Const.DEFAULT_ZOOM;
    }
    const maxZoom = maxZoomForLayer(mapLayer);
    if (this.zoom > maxZoom) {
      this.zoom = maxZoom;
    }
    if (!this.region) {
      this.region = getRegionForZoom(Const.DEFAULT_LAT, Const.DEFAULT_LON, this.zoom);
    }
    this.setState({ region: this.region });
  }

  onRegionChange(region) {
    this.region = region;
    this.zoom = getZoomFromRegion(region);
    UserPrefs.setMapRegionAndZoom(this.region, this.zoom);
  }

  mapZoomIn() {
    const { mapLayer } = this.props;
    this.zoom++;
    const maxZoom = maxZoomForLayer(mapLayer);
    if (this.zoom > maxZoom) {
      this.zoom = maxZoom;
    }
    const region = getRegionForZoom(this.region.latitude, this.region.longitude, this.zoom);
    this.map.animateToRegion(region, 200);
  }

  mapZoomOut() {
    this.zoom--;
    if (this.zoom < 3) {
      this.zoom = 3;
    }
    const region = getRegionForZoom(this.region.latitude, this.region.longitude, this.zoom);
    this.map.animateToRegion(region, 200);
  }

  mapCenter(lat, lon) {
    const region = {
      latitude: lat,
      longitude: lon,
      latitudeDelta: this.region.latitudeDelta,
      longitudeDelta: this.region.longitudeDelta,
    };
    this.map.animateToRegion(region, 200);
  }

  pickMapLayer(index) {
    const { setMapLayer } = this.props;
    console.log(' pick map = ' + index);
    setMapLayer(index);

    const maxZoom = maxZoomForLayer(index);
    if (this.zoom > maxZoom) {
      this.zoom = maxZoom;
      const region = getRegionForZoom(this.region.latitude, this.region.longitude, this.zoom);
      this.map.animateToRegion(region, 0);
    }
  }

  fitToRadius(lat, lon, radius) {
    const oneDegreeOfLatitudeInMeters = 111.32 * 1000;
    const factor = 2.6;
    const latDelta = (radius * factor) / oneDegreeOfLatitudeInMeters;
    const lonDelta = (radius * factor) / (oneDegreeOfLatitudeInMeters * Math.cos(lat * (Math.PI / 180)));
    const region = {
      latitude: lat,
      longitude: lon,
      latitudeDelta: latDelta,
      longitudeDelta: lonDelta,
    };

    this.map.animateToRegion(region, HOME_RADIUS);
  }

  onGeozoneSaveCallback(pr, packet) {
    const { getGeozoneList, showAlert, setConfigureChildPaneVisible } = this.props;

    const { data } = packet;
    if (0 === data.result) {
      getGeozoneList(() => {
        this.hideProgressbar();
        NavigationService.back();
        setConfigureChildPaneVisible(true);
      });
      return;
    }
    this.hideProgressbar();
    setTimeout(() => {
      showAlert(true, L('error'), L('failed_to_save_place', [data.error]));
    }, 500);
  }

  async onSavePress() {
    Metrica.event('funnel_home_place_saved');

    const { createCircleGeozone, showAlert } = this.props;
    const placeProps = {
      affectAllUserObjects: '1',
      enableEnterAlert: '1',
      enableLeaveAlert: '1',
    };

    const storedName = L('home');
    this.openProgressbar(L('saving'));
    try {
      await waitForConnection();
      createCircleGeozone(
        storedName,
        
        this.region.latitude,
        this.region.longitude,
        HOME_RADIUS,
        placeProps,
        this.onGeozoneSaveCallback.bind(this)
      );
    } catch (e) {
      this.hideProgressbar();
      setTimeout(() => {
        showAlert(true, L('error'), L('failed_to_save_place'));
      }, 500);
    }
  }

  onCancelPress() {
    const { setConfigureChildPaneVisible } = this.props;
    Metrica.event('funnel_home_place_aborted');
    NavigationService.back();
    setConfigureChildPaneVisible(true);
  }

  render() {
    const { mapLayer } = this.props;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="white" barStyle="dark-content" />
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={40} style={{ flex: 1 }}>
          <View style={styles.top_pane}>
            <Text style={styles.bold_text}>{L('specify_child_home_on_the_map')}</Text>
            <Text style={styles.small_text}>{L('to_receive_notifications_about_movement')}</Text>
          </View>
          <View style={styles.mapcontainer}>
            <MapView
              ref={(ref) => (this.map = ref)}
              mapType={1 === mapLayer ? 'hybrid' : 'standard'}
              style={styles.map}
              onRegionChangeComplete={this.onRegionChange.bind(this)}
              initialRegion={this.region}>
              {2 === mapLayer || 3 === mapLayer ? (
                <MapView.UrlTile zIndex={Const.TILE_Z_INDEX} urlTemplate={Const.MAP_URL_TEMPLATES[mapLayer]} />
              ) : null}
            </MapView>
            <View style={styles.homepin_pane} pointerEvents="none">
              <Image source={HOME_PIN_IMG} style={styles.home_pin} />
            </View>
          </View>

          <MapZoomPanel
            onMapLayer={this.pickMapLayer.bind(this)}
            onZoomIn={() => {
              this.mapZoomIn();
            }}
            onZoomOut={() => {
              this.mapZoomOut();
            }}
          />

          <View style={styles.bottomBar}>
            <Button
              buttonStyle={styles.button_save}
              title={L('home_secified_correctly')}
              color="white"
              onPress={this.onSavePress.bind(this)}
            />
            <TouchableOpacity
              onPress={this.onCancelPress.bind(this)}
              style={{ padding: 10, bottom: 10 }}>
              <Text style={{ color: '#000' }}>{L('ill_set_it_later')}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
        <CustomProgressBar visible={this.state.isProgress} title={this.state.progressTitle} />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  const { premium } = state.authReducer;
  const { places, premiumValid, mapLayer, objects, coordMode } = state.controlReducer;
  return {
    places,
    premium,
    premiumValid,
    mapLayer,
    objects,
    coordMode,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    createCircleGeozone: bindActionCreators(controlActionCreators.createCircleGeozone, dispatch),
    setMapLayer: bindActionCreators(controlActionCreators.setMapLayer, dispatch),
    getGeozoneList: bindActionCreators(controlActionCreators.getGeozoneList, dispatch),
    showAlert: bindActionCreators(popupActionCreators.showAlert, dispatch),
    setConfigureChildPaneVisible: bindActionCreators(controlActionCreators.setConfigureChildPaneVisible, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddHomePlacePage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapcontainer: {
    flex: 1,
  },
  map: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  bottomBar: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
  },
  homepin_pane: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  home_pin: {
    width: 48,
    height: 48,
  },
  top_pane: {
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
    padding: 10,
    paddingTop: 30,
    backgroundColor: 'white',
  },
  bold_text: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  small_text: {
    fontSize: 12,
    color: '#000',
  },
  button_save: {
    marginTop: 15,
    marginBottom: 20,
    backgroundColor: '#FF666F',
    borderRadius: 6,
  },
});
