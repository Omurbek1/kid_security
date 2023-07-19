import React from 'react';
import {
  Animated,
  Text,
  TouchableOpacity,
  BackHandler,
  StyleSheet,
  View,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  TextInput,
  PixelRatio,
  Platform,
  StatusBar,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { controlActionCreators } from '../reducers/controlRedux';
import { popupActionCreators } from '../reducers/popupRedux';
import NavigationService from '../navigation/NavigationService';
import { CustomProgressBar } from '../Utils';
import { waitForConnection } from '../Helper';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { connectActionSheet } from '@expo/react-native-action-sheet';
import { L } from '../lang/Lang';
import { HeaderBackButton } from 'react-navigation';
import { getHeader } from '../shared/getHeader';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { AppColorScheme } from '../shared/colorScheme';
import KsAlign from '../components/atom/KsAlign';
import KsButton from '../components/atom/KsButton';
import * as Metrica from '../analytics/Analytics';
import UserPrefs from '../UserPrefs';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import AlertPane from '../components/AlertPane';
import * as Location from 'expo-location';
import { RestAPIService } from '../RestApi';
import { store } from '../Store';

const imageSourceStub = require('../img/ic_stub_photo.png');
const ios = 'ios' === Platform.OS;

@connectActionSheet
class ObjectNamePage extends React.Component {
  static _onBackPress = null;

  static navigationOptions = () => {
    return {
      ...getHeader({ title: L('name_and_photo'), noGradient: true }),
      headerLeft: <HeaderBackButton tintColor="white" onPress={() => _onBackPress()} />,
      headerTransparent: true,
      headerStyle: { borderBottomWidth: 0 },
    };
  };
  constructor(props) {
    super(props);
    this.shakeAnimation = new Animated.Value(0);

    this.state = {
      isProgress: false,
      progressTitle: null,
      newObjectName: null,
      newObjectGender: null,
      imageSource: imageSourceStub,
      loadingIndicatorSource: imageSourceStub,
      imageChanged: false,
      requireName: false,
      showAlert: false,
    };
  }

  openProgressbar = (title) => {
    this.setState({ isProgress: true, progressTitle: title });
  };

  hideProgressbar = () => {
    this.setState({ isProgress: false });
  };

  componentWillUnmount = () => {
    deactivateKeepAwake();
    this.backHandler.remove();
  };

  componentDidMount = () => {
    const { objects, navigation, clearLinkedOid } = this.props;
    const { all } = UserPrefs;

    this.zoom = all.zoom;
    this.region = all.mapRegion;

    console.log(objects);

    let activeObject = {
      name: '',
      props: {
        gender: '',
      },
    };

    _onBackPress = this.onBackPress.bind(this);

    const oid = navigation.getParam('oid');
    const obj = objects[oid + ''];
    activeObject = obj ? obj : activeObject;
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    /*const requireInput = navigation.getParam('requireInput');
    if (requireInput) {
      navigation.setParams({ left: null });
    }*/
    setTimeout(() => {
      activateKeepAwake();
    }, 0);

    this.setState({
      newObjectName: activeObject.name,
      newObjectGender: activeObject.props.gender,
      imageSource: activeObject.photoUrl ? { uri: activeObject.photoUrl } : null,
      firstChildConnected: UserPrefs.all.firstChildConnected,
    });

    const backTo = navigation.getParam('backTo');
    const forceReplace = navigation.getParam('forceReplace');
    const disableBackButton = navigation.getParam('disableBackButton');
    console.log('===== inited object name page: ', forceReplace, backTo, disableBackButton);

    clearLinkedOid();
  };

  onBackPress() {
    this.onCancel();
  }

  handleBackPress = () => {
    this.onCancel();
    return true;
  };

  gotoPlacesSetup() {
    NavigationService.navigate('Places');
  }

  showPhotoSource() {
    if (!this.state.firstChildConnected) {
      Metrica.event('funnel_pick_child_photo_source', { mode: 'initial' });
    }

    const options = [L('gallery'), L('camera'), L('cancel')];
    const cancelButtonIndex = options.length - 1;
    const title = L('kid_photo_uploading');

    this.props.showActionSheetWithOptions(
      {
        title,
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        if (buttonIndex == cancelButtonIndex) {
          if (!this.state.firstChildConnected) {
            Metrica.event('funnel_pick_child_photo_source', { mode: 'cancelled' });
          }
          return;
        }
        let result = null;
        if (0 === buttonIndex) {
          // gallery
          if (!this.state.firstChildConnected) {
            Metrica.event('funnel_pick_child_photo_source', { mode: 'gallery' });
          }
          const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
          if (!this.state.firstChildConnected) {
            Metrica.event('funnel_pick_child_photo_source', { mode: 'gallery', permission: status === 'granted' });
          }
          if (status !== 'granted') {
            return;
          }
          result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [300, 300],
          });

          if (!this.state.firstChildConnected) {
            Metrica.event('funnel_pick_child_photo_source', { mode: 'gallery', cancelled: true });
          }
        } else {
          // camera
          if (!this.state.firstChildConnected) {
            Metrica.event('funnel_pick_child_photo_source', { mode: 'camera' });
          }
          const { status } = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
          if (!this.state.firstChildConnected) {
            Metrica.event('funnel_pick_child_photo_source', { mode: 'camera', permission: status === 'granted' });
          }
          if (status !== 'granted') {
            return;
          }
          result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [300, 300],
          });

          if (!this.state.firstChildConnected) {
            Metrica.event('funnel_pick_child_photo_source', { mode: 'camera', cancelled: result.cancelled });
          }
        }

        if (result.cancelled) {
          return;
        }

        const resizeResult = await ImageManipulator.manipulateAsync(
          result.uri,
          [
            {
              resize: {
                width: 300,
                height: 300,
              },
            },
          ],
          { format: 'jpeg', compress: 0.8 }
        );

        // console.log(resizeResult);
        if (resizeResult && resizeResult.uri) {
          this.setState({ imageChanged: true, imageSource: { uri: resizeResult.uri } });
        }
      }
    );
  }

  async savePhoto(oid) {
    const { imageSource } = this.state;
    const uri = imageSource.uri;

    return RestAPIService.uploadChildPhoto(oid, uri);
  };

  checkInput() {
    const { navigation } = this.props;
    const { newObjectName } = this.state;

    const requireInput = navigation.getParam('requireInput');

    if (requireInput) {
      let requireName = '' === newObjectName;
      this.setState({ requireName });
      if (requireName) {
        return false;
      }
      return true;
    }

    return true;
  }

  onCancel() {
    const { navigation } = this.props;
    if (!this.checkInput()) {
      return;
    }

    const disableBackButton = navigation.getParam('disableBackButton');
    if (disableBackButton) {
      return;
    }

    const forceReplace = navigation.getParam('forceReplace');
    const backTo = navigation.getParam('backTo');
    if (backTo) {
      if (forceReplace) {
        NavigationService.forceReplace(backTo);
      } else {
        NavigationService.navigate(backTo);
      }
    } else {
      NavigationService.back();
    }
  }

  async onFinish() {
    const {
      objects,
      navigation,
      changeObjectCard,
      places,
      showAlert,
      setConfigureChildPaneVisible,
      placesLoaded,
    } = this.props;
    const { newObjectName, newObjectGender, imageChanged } = this.state;

    const oid = navigation.getParam('oid');
    const object = objects[oid + ''];
    console.log('oid', !object);
    const displayConfigureChildPane = navigation.getParam('displayConfigureChildPane');

    if (!object) {
      this.setState({ showAlert: true });
    } else {
      const validInput = this.checkInput();
      if (!this.state.firstChildConnected) {
        Metrica.event('funnel_set_child_name', { validInput });
      }
      if (!validInput) {
        this.startShake();
        return;
      }

      let hasPlaces = false;
      for (let i in places) {
        hasPlaces = true;
        break;
      }
      const offerPlacesSetup = !hasPlaces;

      const oid = navigation.getParam('oid');
      const card = {
        name: newObjectName,
        gender: newObjectGender,
      };
      this.openProgressbar(L('saving_settings'));
      const hideProgressbar = this.hideProgressbar;

      if (imageChanged) {
        try {
          await this.savePhoto(oid);
        } catch (e) {
          hideProgressbar();
          console.warn('Error while uploading an image', e);
          setTimeout(() => {
            showAlert(true, L('error'), L('failed_to_save_settings', [-1]));
          }, 300);
          return;
        }
      }

      RestAPIService.changeObjectCard(oid, newObjectName)
        .then(() => {
          this.getUpdatedChildData();
          hideProgressbar();
          const forceReplace = navigation.getParam('forceReplace');
          const backTo = navigation.getParam('backTo');
          console.log(' =================== ', forceReplace, backTo);
          if (backTo) {
            if (forceReplace) {
              NavigationService.forceReplace(backTo);
            } else {
              NavigationService.navigate(backTo);
            };
          } else {
            NavigationService.back();
          };

          const offerHomePlaceSetup = navigation.getParam('offerHomePlaceSetup');
          const placesCount = Object.keys(places).length;

          if (offerPlacesSetup && offerHomePlaceSetup) {
            offerHomePlaceSetup();
          }

          if (!UserPrefs.all.addHomePlaceShown && placesLoaded && 0 === placesCount) {
            this.requestCurrentLocation();
          } else {
            displayConfigureChildPane && setConfigureChildPaneVisible(true);
          };
        })
        .catch(() => {
          hideProgressbar();
          setTimeout(() => {
            showAlert(true, L('error'), L('failed_to_save_settings'));
          }, 300);
        });
    };
  };

  getUpdatedChildData = () => {
    const { getObjectMap } = this.props;

    RestAPIService.getObjectMap()
      .then(data => {
        const objects = {};
        data.objects.map((obj) => {
          objects[obj.oid + ''] = obj;
        });

        getObjectMap(objects, store.dispatch);
      })
      .catch(err => console.log('Error getting object on map', err));
  };

  startShake = () => {
    Animated.sequence([
      Animated.timing(this.shakeAnimation, { toValue: 20, duration: 100, useNativeDriver: true }),
      Animated.timing(this.shakeAnimation, { toValue: -20, duration: 100, useNativeDriver: true }),
      Animated.timing(this.shakeAnimation, { toValue: 20, duration: 100, useNativeDriver: true }),
      Animated.timing(this.shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  showBackButton() {
    const { navigation } = this.props;

    const requireInput = navigation.getParam('requireInput');
    return !requireInput;
  }

  setGender(gender) {
    this.setState({ newObjectGender: gender });
  }

  async requestCurrentLocation() {
    const displayConfigureChildPane = this.props.navigation.getParam('displayConfigureChildPane');

    if (UserPrefs.all.addHomePlaceShown) {
      return;
    };

    const { setConfigureChildPaneVisible } = this.props;
    const { status: existingStatus } = await Permissions.getAsync(Permissions.LOCATION);
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.LOCATION);
      finalStatus = status;
    };

    const locationPermGranted = finalStatus === 'granted';
    Metrica.event('funnel_location_permission', { granted: locationPermGranted, status: finalStatus });

    if (locationPermGranted) {
      const enabled = await Location.hasServicesEnabledAsync();

      if (enabled) {
        Location.installWebGeolocationPolyfill();
        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (position && position.coords) {
              try {
                Metrica.event('funnel_goto_add_home_place');
                this.gotoAddHomePlace(position.coords.latitude, position.coords.longitude);
              } catch (e) { };
            };
          },
          (error) => console.warn(error.message),
          { enableHighAccuracy: true, maximumAge: 60000, timeout: 20000 }
        );
      };
    } else {
      displayConfigureChildPane && setConfigureChildPaneVisible(true);
    };
  };

  async gotoAddHomePlace(lat, lon) {
    if (!UserPrefs.all.addHomePlaceShown) {
      await UserPrefs.setAddHomePlaceShown(true);
      NavigationService.navigate('AddHomePlace', { lat, lon, region: this.region, zoom: this.zoom });
    };
  };

  render() {
    const { objects, navigation } = this.props;
    const { newObjectName, newObjectGender } = this.state;

    let activeObject = {
      voltage: 0,
      name: '',
    };

    const oid = navigation.getParam('oid');
    const obj = objects[oid + ''];
    activeObject = obj ? obj : activeObject;
    const genderBoy = 'female' !== newObjectGender;
    //console.log('genderBoy=' + genderBoy + ', gender: ' + newObjectGender);
    const plusButtonWidth = wp('30%');
    const plusButtonHeight = wp('30%');
    const inputWidth = wp('60%');
    const hasImage = this.state.imageSource;
    const ios = 'ios' === Platform.OS;

    return (
      <KeyboardAvoidingView behavior={ios ? 'padding' : null} style={{ flex: 1 }}>
        <ScrollView>
          <View contentContainerStyle={[styles.container]} style={{ backgroundColor: 'white' }}>
            <StatusBar backgroundColor="transparent" barStyle="light-content" translucent={true} />
            <KsAlign elementsGap={20} alignItems="center" style={{ paddingTop: 120, paddingBottom: 20, width: '100%' }}>
              <Animated.View style={{ transform: [{ translateX: this.shakeAnimation }] }}>
                <TouchableOpacity onPress={this.showPhotoSource.bind(this)}>
                  <View
                    style={{
                      width: plusButtonWidth,
                      height: plusButtonHeight,
                      backgroundColor: AppColorScheme.accent,
                      borderRadius: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: 3,
                    }}>
                    {hasImage ? (
                      <Image
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: 17,
                        }}
                        loadingIndicatorSource={this.state.loadingIndicatorSource}
                        source={this.state.imageSource ? this.state.imageSource : imageSourceStub}></Image>
                    ) : (
                      <Icon name="plus-circle" type="material-community" color="white" size={36}></Icon>
                    )}
                  </View>
                </TouchableOpacity>
              </Animated.View>
              <Text style={{ fontSize: 18, color: '#000' }}>{L('upload_kid_photo')}</Text>
            </KsAlign>
          </View>
          <View style={{ backgroundColor: 'white', alignItems: 'center', marginTop: 5, padding: 10 }}>
            <View
              style={{
                alignItems: 'center',
              }}>
              <KsAlign
                axis="horizontal"
                elementsGap={10}
                style={{ alignItems: 'center', width: inputWidth, position: 'relative' }}>
                <View style={{ position: 'absolute', left: -30 }}>
                  <Icon name="account-circle" type="material-community"></Icon>
                </View>
                <Text style={[{ padding: 5, color: '#000' }, this.state.requireName ? styles.red_text : {}]}>
                  {L('input_kid_name')}
                </Text>
              </KsAlign>
            </View>
            <TextInput
              hint={L('hint_kid_name')}
              keyboardType="default"
              value={newObjectName}
              placeholder={L('hint_kid_name')}
              iconColor="grey"
              palceholderTextColor="rgba(0,0,0,0.5)"
              selectionColor="blue"
              textColor="black"
              onChangeText={(text) => {
                this.setState({ newObjectName: text });
              }}
              style={[
                {
                  marginVertical: 10,
                  borderBottomColor: AppColorScheme.passiveAccent,
                  borderBottomWidth: 1,
                  padding: 5,
                  width: inputWidth,
                  color: 'black',
                  fontSize: 14 / PixelRatio.getFontScale(),
                },
                this.state.requireName ? styles.red_text : {},
              ]}></TextInput>
          </View>
          <View style={{ paddingBottom: 30 }}>
            <View style={{ alignItems: 'center' }}>
              <Image
                source={require('../img/ic_child_object_name.png')}
                style={{ height: 200, resizeMode: 'contain' }}></Image>
            </View>
            <KsAlign elementsGap={10}>
              <View style={{ paddingHorizontal: 20 }}>
                <KsButton onPress={this.onFinish.bind(this)} title={L('done')} style={{ padding: 20 }}></KsButton>
              </View>
              {this.showBackButton() ? (
                <View style={{ paddingHorizontal: 20 }}>
                  <KsButton
                    outlined
                    title={L('move_backward')}
                    onPress={() => NavigationService.back()}
                    style={{ padding: 20, backgroundColor: 'transparent' }}></KsButton>
                </View>
              ) : null}
            </KsAlign>
          </View>
        </ScrollView>
        <CustomProgressBar visible={this.state.isProgress} title={this.state.progressTitle} />
        <AlertPane
          visible={this.state.showAlert}
          titleText={L('add_photo_name')}
          actionButtonText={L('add')}
          onPressAction={() => {
            this.setState({ showAlert: false });
            NavigationService.forceReplace('Main', {});
            NavigationService.navigate('AddPhone', {});
          }}
        />
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = (state) => {
  const { objects, places, placesLoaded } = state.controlReducer;
  const { authorized } = state.authReducer;

  return {
    objects,
    places,
    authorized,
    placesLoaded,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeObjectCard: bindActionCreators(controlActionCreators.changeObjectCard, dispatch),
    clearLinkedOid: bindActionCreators(controlActionCreators.clearLinkedOid, dispatch),
    showAlert: bindActionCreators(popupActionCreators.showAlert, dispatch),
    setConfigureChildPaneVisible: bindActionCreators(controlActionCreators.setConfigureChildPaneVisible, dispatch),
    getObjectMap: bindActionCreators(controlActionCreators.getObjectMap, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ObjectNamePage);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'column',
  },
  text: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 20,
  },
  bigText: {
    paddingTop: 0,
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: 10,
  },
  kid_name: {
    marginTop: 5,
    marginBottom: 5,
    borderColor: 'black',
  },
  finish: {
    marginTop: 30,
    backgroundColor: '#FF666F',
    borderRadius: 6,
  },
  gender_picker: {
    flex: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    alignContent: 'center',
    marginTop: 20,
  },
  gender_cell: {
    flex: 0,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    alignContent: 'center',
    flexDirection: 'column',
  },
  gender_img: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  gender_check: {},
  photo_picker: {
    flex: 0,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  photo_circle: {
    borderRadius: 100,
    borderWidth: 3,
    marginTop: 10,
    borderColor: 'white',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0,
  },
  auth_input: {
    marginTop: 10,
    borderRadius: 20,
    width: 250,
    borderColor: '#d8d8d8',
    backgroundColor: '#d8d8d8',
  },
  save_button: {
    padding: 0,
    margin: 0,
    width: 220,
    height: 50,
    borderRadius: 20,
    marginTop: 10,
  },
  back_button: {
    padding: 0,
    margin: 0,
    width: 220,
    height: 50,
    borderRadius: 20,
    marginTop: 10,
  },
  red_text: {
    color: 'red',
  },
  red_input: {
    borderWidth: 1,
    borderColor: 'red',
  },
  small_text: {
    marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
  },
  backbutton: {
    color: '#fff',
  },
});
