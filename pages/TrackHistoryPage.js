import React from 'react';
import MapView from 'react-native-maps';
import MapMarker from '../components/MapMarker';
import {
  Text,
  PanResponder,
  Animated,
  StyleSheet,
  View,
  StatusBar,
  BackHandler,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MapZoomPanel from '../components/MapZoomPanel';
import { controlActionCreators } from '../reducers/controlRedux';
import NavigationService from '../navigation/NavigationService';
import { CustomProgressBar, getZoomFromRegion, getRegionForZoom, getDate, maxZoomForLayer } from '../Utils';
import * as Utils from '../Utils';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Const from '../Const';
import { L } from '../lang/Lang';
import UserPrefs from '../UserPrefs';
import MapChildMarker from '../components/molecules/MapChildMarker';
import { getHeader } from '../shared/getHeader';
import KsButtonHighlight from '../components/atom/KsButtonHighlight';
import { AppColorScheme } from '../shared/colorScheme';
import AlertPane from '../components/AlertPane';


const watchOnline = require('../img/ic_marker_substrate.png');

class TrackHistoryPage extends React.Component {
  static navigationOptions = () => {
    return {
      ...getHeader({ title: L('menu_movement_history'), noBorderRadius: true }),
    };
  };

  state = {
    isProgress: false,
    progressTitle: null,
    slider: new Animated.ValueXY(),
    timeLabel: '00:00',
    hours: 0,
    minutes: 0,
    allMinutes: 0,
    points: [],
    pointMinutes: {},
    curPoint: null,
    datePickerVisible: false,
    curDate: new Date(),
    showAlert: false,
  };

  showDateTimePicker = () => this.setState({ datePickerVisible: true });

  hideDateTimePicker = () => this.setState({ datePickerVisible: false });

  openProgressbar = (title) => {
    this.setState({ isProgress: true, progressTitle: title });
  };

  hideProgressbar = () => {
    this.setState({ isProgress: false });
  };

  componentDidMount() {
    const { navigation, objects } = this.props;
    this.photoUrl = navigation.getParam('photoUrl');

    this.pickMapLayer(UserPrefs.all.mapLayer);
    this.loadTodayTrack();

    const oid = navigation.getParam('oid');
    const object = objects[oid + ''];

    if (!object) {
      this.setState({ showAlert: true });
    }
    StatusBar.setBarStyle('light-content');
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPress);
  };

  onBackButtonPress = () => {
    NavigationService.back();
    return true;
  };

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

    this.region = getRegionForZoom(this.region.latitude, this.region.longitude, this.zoom);

    this.maxY = 0;
    this.panY = 0;
    this.state.slider.setValue({ x: 0, y: 0 });

    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      onPanResponderGrant: (e, gestureState) => {
        this.panY = this.state.slider.y._value;
      },

      onPanResponderMove: (e, gestureState) => {
        const maxY = this.maxY - this.knobHeight + 2;
        let newY = this.panY + gestureState.dy;
        if (newY < -1) {
          newY = -1;
        } else if (newY >= maxY) {
          newY = maxY;
        }

        const curPointIndex = Math.floor(((this.state.pointMinutes.length - 1) / maxY) * newY);
        this.state.slider.y.setValue(newY);
        const curPoint = this.gotoPoint(curPointIndex);
        if (!curPoint) {
          return 0;
        }
        this.setState({
          curPointIndex: curPointIndex,
          curPoint: curPoint,
          timeLabel: curPoint.tsLabel,
        });
      },

      onPanResponderRelease: (e, { vx, vy }) => {
        this.state.slider.flattenOffset();
      },
    });
  }

  gotoPoint(index) {
    let p = this.state.pointMinutes[index];
    if (!p) {
      return null;
    }
    this.mapCenter(p.lat, p.lon);
    return p;
  }

  onRegionChange(region) {
    this.region = { ...region };
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
    this.map.animateToRegion(region, 100);
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

  loadTrack(fromDate, toDate) {
    const { navigation, getObjectTrackStepPoints, mapLayer } = this.props;
    const oid = navigation.getParam('oid');

    getObjectTrackStepPoints(oid, fromDate, toDate, (pr, packet) => {
      const { data } = packet;
      if (0 === data.result) {
        const coords = [];
        const pointMinutes = [];
        let lastMinute = null;
        for (let i in data.points) {
          const p = data.points[i];
          console.log(p);
          const ts = new Date(p.ts);
          coords.push({
            latitude: p.lat,
            longitude: p.lon,
          });

          const curMinute = ts.getHours() * 60 + ts.getMinutes();
          if (null === lastMinute || lastMinute !== curMinute) {
            lastMinute = curMinute;

            p.tsLabel = Utils.makeTimeLabel(ts);
            if (p.endIdleTs) {
              const till = Utils.makeTimeLabel(new Date(p.endIdleTs));
              // ensure unique labels (not 16:10 - 16:10, for example)
              if (till != p.tsLabel) {
                p.popupTsLabel = p.tsLabel + ' - ' + till;
                p.tsLabel = p.tsLabel + '\n' + till;
              } else {
                p.popupTsLabel = p.tsLabel;
              }
            } else {
              p.popupTsLabel = p.tsLabel;
            }

            p.dateLabel = getDate(ts);

            pointMinutes.push(p);
          }
        }
        const firstTs = pointMinutes.length > 0 ? pointMinutes[0].tsLabel : '00:00';
        this.setState({ points: coords, pointMinutes: pointMinutes, timeLabel: firstTs, curPoint: null });
        if (coords.length > 0) {
          /*this.map.fitToCoordinates(coords, {
            edgePadding: Const.DEFAULT_PADDING,
            animated: false,
          });*/
          setTimeout(() => {
            this.pickMapLayer(mapLayer);
            const curPoint = this.gotoPoint(0);
            this.setState({ curPoint });
          }, 200);
          return;
        }
      } else {
        this.setState({ points: [], pointMinutes: [], curPoint: null });
      }
      // TODO: show 'NO DATA' dialog
    });

    this.state.slider.y.setValue(0);
  }

  handleDatePicked = (date) => {
    this.hideDateTimePicker();
    let start = new Date(date);
    start.setHours(0, 0, 0, 0);
    let end = new Date(date);
    end.setHours(23, 59, 59, 999);
    this.loadTrack(start, end);
    this.setState({ curDate: date });
  };

  loadTodayTrack() {
    let start = new Date();
    start.setHours(0, 0, 0, 0);
    let end = new Date();
    end.setHours(23, 59, 59, 999);
    this.loadTrack(start, end);
  }

  render() {
    const { slider, curPoint, pointMinutes } = this.state;
    const { mapLayer } = this.props;
    const transform = { transform: slider.getTranslateTransform() };

    return (
      <View style={styles.mapcontainer}>
        <MapView
          ref={(ref) => (this.map = ref)}
          mapType={1 === mapLayer ? 'hybrid' : 'standard'}
          style={{ flex: 1 }}
          onRegionChangeComplete={this.onRegionChange.bind(this)}
          initialRegion={this.region}>
          {2 === mapLayer || 3 === mapLayer ? (
            <MapView.UrlTile zIndex={Const.TILE_Z_INDEX} urlTemplate={Const.MAP_URL_TEMPLATES[mapLayer]} />
          ) : null}

          <MapView.Polyline coordinates={this.state.points} strokeColor={AppColorScheme.active} strokeWidth={4} />
          {curPoint ? (
            <MapMarker
              showCallout={true}
              key={curPoint.ts}
              coordinate={{ latitude: curPoint.lat, longitude: curPoint.lon }}
              title={curPoint.popupTsLabel}
              description={curPoint.dateLabel}
              anchor={{ x: 0.5, y: 1.0 }}
              centerOffset={{ x: 0, y: -67.7 / 2 }}>
              <MapChildMarker photoUrl={this.photoUrl}></MapChildMarker>
            </MapMarker>
          ) : null}
        </MapView>

        <MapZoomPanel
          onMapLayer={this.pickMapLayer.bind(this)}
          onZoomIn={() => {
            this.mapZoomIn();
          }}
          onZoomOut={() => {
            this.mapZoomOut();
          }}
        />

        {pointMinutes.length > 0 ? (
          <View
            onLayout={(event) => {
              this.maxY = event.nativeEvent.layout.height;
            }}
            style={styles.timePickerContainer}>
            <Animated.View
              onLayout={(event) => {
                this.knobHeight = event.nativeEvent.layout.height + 3;
              }}
              {...this._panResponder.panHandlers}
              style={[styles.knob, transform]}
              icon="gesture-double-tap"
              type="material-community"
              iconColor="white">
              <Text style={styles.knobText}>{this.state.timeLabel}</Text>
            </Animated.View>
          </View>
        ) : (
          <View style={styles.noTrackData}>
            <Text style={styles.noTrackLabel}>{L('no_movement_data')}</Text>
          </View>
        )}

        <View style={styles.bottomBar}>
          <KsButtonHighlight
            color="white"
            underlayTitleColor="white"
            titleStyle={{ color: 'black' }}
            title={L('today')}
            style={{ paddingVertical: 10, borderRadius: 10 }}
            onPress={this.loadTodayTrack.bind(this)}
          />

          <KsButtonHighlight
            color="white"
            underlayTitleColor="white"
            titleStyle={{ color: 'black' }}
            title={L('yesterday')}
            onPress={() => {
              let start = new Date();
              start.setHours(0, 0, 0, 0);
              let end = new Date();
              end.setHours(23, 59, 59, 999);

              start.setDate(start.getDate() - 1);
              end.setDate(end.getDate() - 1);

              this.loadTrack(start, end);
            }}
            style={{ paddingVertical: 10, borderRadius: 10 }}
          />

          <KsButtonHighlight
            color="white"
            title={L('specify_date')}
            onPress={() => {
              this.showDateTimePicker();
            }}
            underlayTitleColor="white"
            titleStyle={{ color: 'black' }}
            style={{ paddingVertical: 10, borderRadius: 10 }}
          />
        </View>
        <DateTimePicker
          cancelTextIOS={L('cancel')}
          confirmTextIOS={L('confirm')}
          titleIOS={L('specify_date')}
          date={this.state.curDate}
          isVisible={this.state.datePickerVisible}
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDateTimePicker}
        />
        <CustomProgressBar visible={this.state.isProgress} title={this.state.progressTitle} />
        <AlertPane
          visible={this.state.showAlert}
          titleText={L('add_child_history')}
          actionButtonText={L('add')}
          onPressAction={() => {
            this.setState({ showAlert: false });
            NavigationService.forceReplace('Main', {});
            NavigationService.navigate('AddPhone', {});
          }}
          // cancelButtonText={L('cancel')}
          // onPressCancel={() => this.setState({ needPremiumVisible: false })}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { mapLayer, objects } = state.controlReducer;

  return {
    mapLayer,
    objects,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getObjectTrackStepPoints: bindActionCreators(controlActionCreators.getObjectTrackStepPoints, dispatch),
    setMapLayer: bindActionCreators(controlActionCreators.setMapLayer, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TrackHistoryPage);

const styles = StyleSheet.create({
  mapcontainer: {
    flex: 1,
  },
  bottomBar: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    alignContent: 'center',

    position: 'absolute',
    left: 0,
    bottom: 20,
    right: 0,
    height: 50,
    maxHeight: 50,
  },
  dayButton: {
    backgroundColor: '#6F93DF',
    borderRadius: 20,
  },
  timePickerContainer: {
    position: 'absolute',
    left: 40,
    top: 40,
    bottom: 100,
    width: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#FF666F',
    borderRadius: 20,
  },
  knob: {
    position: 'absolute',
    top: 0,
    right: -11,
    width: 40,
    height: 40,
    borderRadius: 19,
    backgroundColor: '#FF666F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  knobText: {
    fontSize: 11,
    color: 'white',
    textAlign: 'center',
  },
  noTrackData: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noTrackLabel: {
    borderRadius: 6,
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: '#FF666F',
    padding: 20,
    textAlign: 'center',
    color: '#000',
  },
});
