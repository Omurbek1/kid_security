import React from 'react';
import MapView from 'react-native-maps';
import MapMarker from '../components/MapMarker';
import {
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  View,
  ScrollView,
  BackHandler,
  StatusBar,
  KeyboardAvoidingView,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MapZoomPanel from '../components/MapZoomPanel';
import { controlActionCreators } from '../reducers/controlRedux';
import { CustomProgressBar, getZoomFromRegion, getRegionForZoom, maxZoomForLayer, getCoordInfo } from '../Utils';
import Const from '../Const';
import { L } from '../lang/Lang';
import UserPrefs from '../UserPrefs';
import { Platform, PixelRatio } from 'react-native';
import NeedPremiumPane from '../components/NeedPremiumPane';
import NavigationService from '../navigation/NavigationService';
import MapChildMarker from '../components/molecules/MapChildMarker';
import { MapColorScheme, AppColorScheme } from '../shared/colorScheme';
import NoPlacesView from '../components/molecules/NoPlacesView';
import { RoundedPane } from '../components/atom/RoundedPane';
import KsButton from '../components/atom/KsButton';
import GeoZoneRadius from '../components/molecules/GeoZoneRadius';
import KsAlign from '../components/atom/KsAlign';
import { getHeader } from '../shared/getHeader';
import { popupActionCreators } from '../reducers/popupRedux';
import { PremiumModal, PurchaseStateModals } from '../components';

const RADIUS_LIST = [100, 125, 150, 175, 200, 225, 250, 375, 500, 750, 1000];
const RADIUS_INDEX = 1;

const watchOnline = require('../img/ic_marker_substrate.png');
const ios = 'ios' === Platform.OS;

class PlacesPage extends React.Component {
  static navigationOptions = () => {
    return {
      ...getHeader({ title: L('specify_place') }),
    };
  };

  state = {
    isProgress: false,
    progressTitle: null,
    mode: 'list',
    radius: RADIUS_LIST[RADIUS_INDEX],
    radiusIndex: RADIUS_INDEX,
    placeNewName: '',
    needPremiumVisible: false,
    attention: false,
    country: '',
  };

  timeout = null;

  openProgressbar = (title) => {
    this.setState({ isProgress: true, progressTitle: title });
  };

  hideProgressbar = () => {
    this.setState({ isProgress: false });
  };

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    this.pickMapLayer(UserPrefs.all.mapLayer);
    const { navigation } = this.props;
    const instaAdd = navigation.getParam('instaAdd');
    if (instaAdd) {
      this.onPlaceAdd();
    }

    const country = UserPrefs.all.userLocationCountry;
    if (country) this.setState({ country });
    StatusBar.setBarStyle('light-content');
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton.bind(this));
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
    } else {
      this.region = getRegionForZoom(this.region.latitude, this.region.longitude, this.zoom);
    }

    this.setState({ region: this.region });
  }

  onRegionChange(region) {
    this.region = region;
    const oldZoom = this.zoom;
    this.zoom = getZoomFromRegion(region);
    //UserPrefs.setMapRegionAndZoom(this.region, this.zoom);
    if ('edit' === this.state.mode) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.setState({ region: this.region });
      }, 10);
    }
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

  needPremiumDialog() {
    this.setState({ needPremiumVisible: true });
  }

  onPlaceAdd() {
    const { premium, premiumValid, places } = this.props;
    const { limits } = premium;

    let placeCount = 0;
    for (let i in places) {
      placeCount++;
    }

    if (!premiumValid && placeCount >= limits.maxPlaces) {
      this.needPremiumDialog('Places');
      return;
    }

    const place = {
      center: {
        lat: this.region.latitude,
        lon: this.region.longitude,
      },
      radius: RADIUS_LIST[RADIUS_INDEX],
    };
    this.setState({ mode: 'edit', place: place, radius: place.radius, radiusIndex: RADIUS_INDEX, placeNewName: '' });
  }

  onPlaceEdit(place) {
    let radius = place.radius;
    let index = 0;
    for (let i in RADIUS_LIST) {
      const check = RADIUS_LIST[i];
      if (radius > check) {
        continue;
      }
      radius = check;
      index = i;
      break;
    }

    this.fitToRadius(place.center.lat, place.center.lon, place.radius);
    this.setState({ mode: 'edit', place: place, radius: radius, radiusIndex: index, placeNewName: place.name });
  }

  onPerformDelete(id) {
    const { deleteGeozone, getGeozoneList, showAlert } = this.props;
    this.openProgressbar(L('deleting_place'));
    deleteGeozone(id, (pr, packet) => {
      const { data } = packet;
      if (0 === data.result) {
        showAlert(false, '', '')
        getGeozoneList(() => {
          this.hideProgressbar();
        });
        return;
      }
      this.hideProgressbar();
      showAlert(true, L('error'), L('failed_to_delete_place', [data.error]));
    });
  }

  onPlaceDelete(place) {
    const { showAlert } = this.props;

    showAlert(
      true,
      L('deleting'),
      L('place_delete_confirmation', [place.name]),
      false,
      '',
      L('delete'),
      [() => this.onPerformDelete(place.id)],
    );
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

    this.map.animateToRegion(region, 500);
  }

  incrementRadius() {
    let { radiusIndex } = this.state;
    if (radiusIndex < RADIUS_LIST.length - 1) {
      radiusIndex++;
      this.fitToRadius(this.region.latitude, this.region.longitude, RADIUS_LIST[radiusIndex]);
      this.setState({
        radiusIndex,
        radius: RADIUS_LIST[radiusIndex],
      });
    }
  }

  decrementRadius() {
    let { radiusIndex } = this.state;
    if (radiusIndex > 0) {
      radiusIndex--;
      this.fitToRadius(this.region.latitude, this.region.longitude, RADIUS_LIST[radiusIndex]);
      this.setState({
        radiusIndex,
        radius: RADIUS_LIST[radiusIndex],
      });
    }
  }

  onCancelEdit() {
    this.setState({ mode: 'list' });
  }

  onGeozoneSaveCallback(pr, packet) {
    const { getGeozoneList, showAlert } = this.props;
    const { data } = packet;
    if (0 === data.result) {
      getGeozoneList(() => {
        this.hideProgressbar();
        this.setState({ mode: 'list' });
      });
      return;
    }
    this.hideProgressbar();
    showAlert(true, L('error'), L('failed_to_save_place', [data.error]));
  }

  onSavePlace() {
    const { place, placeNewName, radius } = this.state;
    const { editCircleGeozone, createCircleGeozone } = this.props;
    const placeProps = {
      affectAllUserObjects: '1',
      enableEnterAlert: '1',
      enableLeaveAlert: '1',
    };

    const storedName = placeNewName.trim();
    if (storedName.length < 1) {
      return this.setState({ attention: true });
    } else {
      this.setState({ attention: false });
    }

    this.openProgressbar(L('saving'));
    if (place.id) {
      editCircleGeozone(
        place.id,
        storedName,
        this.region.latitude,
        this.region.longitude,
        radius,
        placeProps,
        this.onGeozoneSaveCallback.bind(this)
      );
    } else {
      createCircleGeozone(
        storedName,
        this.region.latitude,
        this.region.longitude,
        radius,
        placeProps,
        this.onGeozoneSaveCallback.bind(this)
      );
    }
  }

  handleBackButton() {
    const pageName = NavigationService.currentPageName();
    if ('Places' === pageName) {
      if (this.state.needPremiumVisible) {
        this.setState({ needPremiumVisible: false });
      } else {
        NavigationService.back();
      };
      return true;
    };

    return false;
  };

  onShowHidePremiumModal = () => {
    const {
      iapItemsError,
      isPremiumModalVisible,
      showPremiumModal,
      showAlert,
    } = this.props;
    const { country } = this.state;

    if (iapItemsError && country !== 'Russia') {
      showAlert(true, L('error'), L('not_data'), true, L('if_try_write_us'));
    } else {
      showPremiumModal(!isPremiumModalVisible);
    };
  };

  onShowSuccessfulSubscriptionModal = () => {
    const { showSuccessfulSubscriptionModal } = this.props;

    showSuccessfulSubscriptionModal(true);
  };

  render() {
    const { places, mapLayer, objects, coordMode, premium, premiumValid, isPremiumModalVisible } = this.props;
    const { mode, region, radius, placeNewName } = this.state;
    let placeCount = 0;
    for (let i in places) {
      placeCount++;
    }
    const noPlaces = placeCount < 1;
    const radiusLabel =
      radius < 1000 ? radius + ' ' + L('meter_short') : (radius / 1000.0).toFixed(2) + ' ' + L('km_short');

    return (
      <KeyboardAvoidingView style={styles.root} behavior={ios ? 'padding' : null}>
        <View style={styles.container}>
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

              {Object.values(places).map((place) => {
                return (
                  <MapView.Circle
                    key={place.id}
                    center={{ latitude: place.center.lat, longitude: place.center.lon }}
                    radius={place.radius}
                    strokeWidth={1}
                    strokeColor={MapColorScheme.stroke}
                    fillColor={MapColorScheme.circle}
                  />
                );
              })}
              {Object.values(places).map((place) => {
                return (
                  <MapMarker
                    key={'place_name' + place.id}
                    coordinate={{ latitude: place.center.lat, longitude: place.center.lon }}
                    anchor={{ x: 0.5, y: 0.5 }}>
                    <Text
                      style={{
                        paddingLeft: 5,
                        paddingRight: 5,
                        color: 'white',
                        borderRadius: 6,
                        backgroundColor: '#FF666F',
                      }}>
                      {place.name}
                    </Text>
                  </MapMarker>
                );
              })}

              {'edit' === mode ? (
                <MapView.Circle
                  center={{ latitude: region.latitude, longitude: region.longitude }}
                  radius={radius}
                  strokeWidth={1}
                  strokeColor={MapColorScheme.editStroke}
                  fillColor={MapColorScheme.editStroke}
                />
              ) : null}

              {Object.values(objects).map((marker) => {
                //console.log('render: ' + marker.oid);
                const coordInfo = getCoordInfo(coordMode, marker, {}, {});
                const markerKey = marker.oid;
                const title = marker.name;
                return (
                  <MapMarker
                    centerOffset={{ x: 0, y: -67.7 / 2 }}
                    anchor={{ x: 0.5, y: 1.0 }}
                    style={styles.marker}
                    key={markerKey}
                    coordinate={{ latitude: coordInfo.lat, longitude: coordInfo.lon }}
                    title={title}>
                    <MapChildMarker childData={marker}></MapChildMarker>
                  </MapMarker>
                  
                );
              })}
            </MapView>
          </View>

          <MapZoomPanel
            marginBottom={200}
            onMapLayer={this.pickMapLayer.bind(this)}
            onZoomIn={() => {
              this.mapZoomIn();
            }}
            onZoomOut={() => {
              this.mapZoomOut();
            }}
          />
          <RoundedPane style={styles.bottomBar}>
            {'list' === mode ? (
              <View style={styles.listPlacesMode}>
                {noPlaces && <NoPlacesView />}
                {noPlaces ? null : (
                  <ScrollView style={{ maxHeight: 130, paddingTop: 10 }} contentContainerStyle={styles.scroll}>
                    {Object.values(places).map((place, index) => {
                      return (
                        <TouchableOpacity
                          key={place.id}
                          style={{ alignItems: 'center', width: '100%', flex: 1, marginVertical: 5 }}
                          onLongPress={() => {
                            if (!premiumValid && index > 0) {
                              return this.needPremiumDialog('Places');
                            }
                            this.onPlaceEdit(place);
                          }}
                          onPress={() => {
                            this.fitToRadius(place.center.lat, place.center.lon, place.radius);
                          }}>
                          <View
                            key={place.id}
                            style={[
                              {
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: '70%',
                                borderBottomColor: AppColorScheme.passive,
                                borderBottomWidth: 1,
                              },
                              !premiumValid && index > 0 ? styles.disabledPlace : {},
                            ]}>
                            <Text>{place.name}</Text>

                            <Icon
                              name="close"
                              type="material-community"
                              size={24}
                              onPress={() => {
                                if (!premiumValid && index > 0) {
                                  return this.needPremiumDialog('Places');
                                }
                                this.onPlaceDelete(place);
                              }}
                            />
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                )}
                {
                  <KsButton
                    onPress={this.onPlaceAdd.bind(this)}
                    title={L('add_place')}
                    style={styles.addPlaceButton}
                    titleStyle={{ fontSize: 16 }}
                    icon={{
                      name: 'plus',
                      type: 'material-community',
                      size: 24,
                      color: 'white',
                    }}></KsButton>
                }
              </View>
            ) : (
              <View style={styles.placeEditMode}>
                <GeoZoneRadius
                  value={this.state.radius}
                  onValueChange={(value) => {
                    this.setState({
                      radius: value,
                    });
                    this.fitToRadius(this.region.latitude, this.region.longitude, value);
                  }}
                  style={{ width: '70%' }}></GeoZoneRadius>
                <View
                  style={{
                    width: '100%',
                    borderBottomColor: AppColorScheme.passiveAccent,
                    borderBottomWidth: 1,
                    alignItems: 'center',
                    marginTop: 10,
                  }}>
                  <KsAlign
                    axis="horizontal"
                    elementsGap={10}
                    style={{ alignItems: 'center', width: '60%', position: 'relative' }}>
                    <View style={{ position: 'absolute', left: -40 }}>
                      <Icon name="bookmark-outline" type="material-community"></Icon>
                    </View>
                    <Text style={{ padding: 5 }}>{L('geo_zone_name')}</Text>
                  </KsAlign>
                </View>
                <TextInput
                  style={[styles.nameInput, this.state.attention ? styles.attention : {}]}
                  placeholderTextColor={this.state.attention ? '#FFA5A5' : 'lightgray'}
                  placeholder={L(this.state.attention ? 'specify_place_name' : 'place_name')}
                  value={placeNewName}
                  onChangeText={(text) => {
                    this.setState({ placeNewName: text });
                  }}
                />

                <KsAlign axis="horizontal" elementsGap={10} style={styles.editButtons}>
                  <KsButton onPress={this.onCancelEdit.bind(this)} style={styles.button} title={L('cancel')} outlined />
                  <KsButton onPress={this.onSavePlace.bind(this)} style={styles.button} title={L('done')} />
                </KsAlign>
              </View>
            )}
          </RoundedPane>

          <CustomProgressBar visible={this.state.isProgress} title={this.state.progressTitle} />
          <NeedPremiumPane
            visible={this.state.needPremiumVisible}
            onPressSubscribe={() => this.setState({ needPremiumVisible: false })}
            onPressCancel={() => this.setState({ needPremiumVisible: false })}
            showHidePremiumModal={this.onShowHidePremiumModal} />
        </View>
        {isPremiumModalVisible &&
          <PremiumModal
            isVisible={isPremiumModalVisible}
            onHide={this.onShowHidePremiumModal}
            onGoToPaymentMethod={productId =>
              NavigationService.navigate('PayWithBankCard', { productId, backTo: 'Places' })}
            onPayWithIFree={(productId, kind) =>
              NavigationService.navigate('PaymentMethod',
                {
                  productId,
                  kind,
                  backTo: 'Places',
                  onHide: () => this.onShowHidePremiumModal,
                  isSubscription: true,
                })}
            onSuccess={this.onShowSuccessfulSubscriptionModal} />}
        <PurchaseStateModals />
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = (state) => {
  const { premium } = state.authReducer;
  const {
    places,
    premiumValid,
    mapLayer,
    objects,
    coordMode,
    iapItemsError,
  } = state.controlReducer;
  const { isPremiumModalVisible } = state.popupReducer;

  return {
    places,
    premium,
    premiumValid,
    mapLayer,
    objects,
    coordMode,
    iapItemsError,
    isPremiumModalVisible,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGeozoneList: bindActionCreators(controlActionCreators.getGeozoneList, dispatch),
    createCircleGeozone: bindActionCreators(controlActionCreators.createCircleGeozone, dispatch),
    editCircleGeozone: bindActionCreators(controlActionCreators.editCircleGeozone, dispatch),
    deleteGeozone: bindActionCreators(controlActionCreators.deleteGeozone, dispatch),
    setMapLayer: bindActionCreators(controlActionCreators.setMapLayer, dispatch),
    showSuccessfulSubscriptionModal: bindActionCreators(popupActionCreators.showSuccessfulSubscriptionModal, dispatch),
    showPremiumModal: bindActionCreators(popupActionCreators.showPremiumModal, dispatch),
    showAlert: bindActionCreators(popupActionCreators.showAlert, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PlacesPage);

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
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
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    minHeight: 200,
    //paddingBottom: 20,
  },
  listPlacesMode: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    alignContent: 'stretch',
  },
  placeEditMode: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'stretch',
    paddingVertical: 20,
  },
  addPlaceButton: {
    backgroundColor: AppColorScheme.accent,
    paddingVertical: 15,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  addPlaceHint: {
    padding: 10,
    margin: 10,
    marginBottom: 0,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#FF666F',
    textAlign: 'center',
  },
  scroll: {
    width: '100%',
    alignItems: 'center',
    padding: 5,
    marginBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 40,
  },
  placeRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
    width: '70%',
    position: 'relative',
    padding: 5,
    margin: 5,
    borderBottomColor: '#bbb',
    borderBottomWidth: 1,
  },
  radiusPicker: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    alignContent: 'center',
    borderColor: '#FF666F',
    borderWidth: 1,
    borderRadius: 6,
  },
  editPlaceView: {
    paddingLeft: 50,
    paddingRight: 50,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    alignContent: 'stretch',
  },
  v_line: {
    backgroundColor: '#FF666F',
    width: 1,
    height: '100%',
  },
  radiusText: {
    flex: 1,
    fontSize: 24,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  nameInput: {
    marginVertical: 10,
    borderBottomColor: AppColorScheme.passiveAccent,
    borderBottomWidth: 1,
    padding: 5,
    width: '60%',
    fontSize: 14 / PixelRatio.getFontScale(),
  },
  editButtons: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'stretch',
    alignContent: 'stretch',
  },

  disabledPlace: {
    opacity: 0.15,
  },
  radius_button: {
    padding: 0,
    margin: 0,
    maxHeight: 48,
  },
  attention: {
    borderWidth: 1,
    borderColor: 'red',
    borderBottomColor: 'red',
    borderRadius: 6,
  },
});
