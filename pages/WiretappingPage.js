import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StatusBar,
  BackHandler,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as FileSystem from 'expo-file-system';
import { connectActionSheet } from '@expo/react-native-action-sheet';
import { Audio } from 'expo-av';
import { Icon } from 'react-native-elements';
import * as Permissions from 'expo-permissions';
import * as Sharing from 'expo-sharing';

import { controlActionCreators } from '../reducers/controlRedux';
import ChatBubbleVoiceTheirWire from '../components/ChatBubbleVoiceTheirWire';
import AnimatedButton from '../components/AnimatedButton';
import NavigationService from '../navigation/NavigationService';
import * as Utils from '../Utils';
import { L } from '@lang';

import Const from '../Const';
import MyActivityIndicator from '../components/MyActivityIndicator';
import NeedPremiumPane from '../components/NeedPremiumPane';
import AlertPane from '../components/AlertPane';
import { ColorScheme } from '../shared/colorScheme';
import { getHeader } from '../shared/getHeader';
import UserPrefs, { isPinCodeHintShown } from '../UserPrefs';
import { popupActionCreators, popupSelectors } from '../reducers/popupRedux';
import { PremiumModal } from '../components';
import { firebaseAnalitycsForOpenModal } from '../analytics/firebase/firebase';

@connectActionSheet
class WiretappingPage extends React.Component {
  static navigationOptions = () => {
    return {
      ...getHeader({ title: L('menu_wiretapping'), noGradient: true }),
    };
  };

  mounted = true;

  state = {
    isProgress: false,
    progressTitle: null,
    loading: true,
    wiretapTimer: 0,
    cancelled: false,
    result: null,
    player: null,
    needPremiumVisible: false,
    alertText: '',
    showAlert: false,
    newMessage: false,
  };

  MAX_TIMER = Const.WIRETAPPING_DURATION + 5;
  timer = null;

  UNSAFE_componentWillMount = () => {
    const { navigation } = this.props;
    this.setState({ oid: navigation.getParam('oid') });
  };

  openProgressbar = (title) => {
    this.setState({ isProgress: true, progressTitle: title });
  };

  hideProgressbar = () => {
    this.setState({ isProgress: false });
  };

  async componentDidMount() {
    const { getHiddenObjectVoiceMails, setWiretappedRecordsForObject, navigation, objects } = this.props;

    const oid = navigation.getParam('oid');

    const country = UserPrefs.all.userLocationCountry;
    if (country) this.setState({ country });

    getHiddenObjectVoiceMails({ oid, limit: 30 }, (pr, packet) => {
      const { data } = packet;
      if (data.result === 0) {
        setWiretappedRecordsForObject(oid, data.list);
        this.setState({ messages: data.list, loadMessage: false });
      }
      this.setState({ loading: false });
    });

    const object = objects[oid + ''];
    if (object && object.photoUrl) {
      this.setState({ photoUrl: object.photoUrl });
    }
    let wiretapTs = null;
    if (object && object.states) {
      const wiretapRecordingTs = object.states.wiretapRecordingTs;

      if (wiretapRecordingTs && wiretapRecordingTs.length > 0) {
        wiretapTs = parseInt(wiretapRecordingTs) * 1000;
      }
    }
    this.setState({ wiretapTs });
    const _this = this;
    
    this.timer = setInterval(function () {
      if (_this.state.wiretapTs) {
        const diff = (new Date().getTime() - _this.state.wiretapTs) / 1000;
        if (diff > _this.MAX_TIMER) {
          _this.setState({ wiretapTimer: 0, wiretapTs: null });
        } else {
          _this.setState({ wiretapTimer: Math.round(_this.MAX_TIMER - diff) });
        }
      }
    }, 1000);

    await Audio.setAudioModeAsync({
      staysActiveInBackground: false,
      playsInSilentModeIOS: true,
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: true,
    });
    StatusBar.setBarStyle('light-content');
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPress);
  }

  componentWillUnmount() {
    this.mounted = false;

    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPress);
  }

  onBackButtonPress = () => {
    NavigationService.back();
    return true;
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!nextProps.objects || !this.props.objects || !this.state.oid) {
      return null;
    }
    const { oid } = this.state;
    const nextObj = nextProps.objects[oid + ''];
    const prevObj = this.props.objects[oid + ''];

    if (!nextObj || !prevObj) {
      return null;
    }

    if (!nextObj.states || !prevObj.states) {
      return null;
    }

    if (nextObj.states.wiretapRecordingTs !== prevObj.states.wiretapRecordingTs) {
      let wiretapTs = null;
      if (nextObj.states.wiretapRecordingTs != '') {
        console.log(' == wiretapping STARTED');
        const wiretapTs = parseInt(nextObj.states.wiretapRecordingTs) * 1000;
        this.setState({ wiretapTs, isProgress: false });
      } else {
        console.log(' == wiretapping stopped');
        this.setState({ wiretapTs: null, wiretapTimer: 0 });
      }
    }

    if (nextObj.states.wiretapState && nextObj.states.wiretapState !== prevObj.states.wiretapState) {
      try {
        let ws = JSON.parse(nextObj.states.wiretapState);
        console.log(' == wiretapping new State: ', ws);
        if (ws.kind >= Const.WIRE_ERROR_RECORDER && ws.kind <= Const.WIRE_ERROR_NO_PERMISSION) {
          console.log(' == wiretapping stopped due to ERROR: ' + ws.kind + ', reason: ' + ws.reason);
          this.setState({ wiretapTs: null, wiretapTimer: 0, cancelled: true, result: ws });
        }
      } catch (e) {
        console.warn('wrong wiretapState', nextObj.states.wiretapState);
      }
    }
    return null;
  }

  async waitForWiretappingStarted() {
    this.setState({ cancelled: false, result: null });
    const _this = this;
    let counter = 40;
    const promise = new Promise(function (resolve, reject) {
      const timer = setInterval(() => {
        counter -= 1;
        if (counter < 1 || _this.state.cancelled) {
          clearInterval(timer);
          return resolve(false);
        }
        if (_this.state.wiretapTs) {
          return resolve(true);
        }
      }, 1000);
    });
    return promise;
  }

  needPremiumDialog() {
    firebaseAnalitycsForOpenModal('premiumNeededForFunction', false, {
      function: 'loudSignal',
    });
    this.setState({ needPremiumVisible: true });
  }

  async onDoWiretapping() {
    const { navigation, requestObjectMonitorCallback, premium, premiumReallyPaid, objects, showAlert } = this.props;
    const oid = navigation.getParam('oid');
    const object = objects[oid + ''];
    console.log('oid', !object);

    // check premium
    const locked = !premiumReallyPaid && !premium.overriden;
    if (locked) {
      return this.needPremiumDialog();
    }
    if (!object) {
      this.setState({ alertText: L('add_wiretapping'), showAlert: true });
    } else {
      const alerts = Utils.getConfigurationAlets(object);
      const { micPermissionAlert } = alerts;

      if (micPermissionAlert) {
        showAlert(true, L('error'), L('failed_to_do_wiretapping') + ' (' + L('no_mic_permission') + ')');
        return;
      }

      const duration = Const.WIRETAPPING_DURATION; // seconds
      this.openProgressbar(L('wiretapping'));
      requestObjectMonitorCallback(oid, '', 0, duration, async (pr, packet) => {
        if (!this.mounted) {
          return;
        }

        const { data } = packet;
        if (data.result === 0) {
          const started = await this.waitForWiretappingStarted();
          if (started || !this.mounted) {
            return;
          } else {
            this.setState({ isProgress: false });
          }
        }

        this.hideProgressbar();
        let message = L('failed_to_do_wiretapping');
        let result = this.state.result;
        if (result) {
          if (result.kind === Const.WIRE_ERROR_NO_PERMISSION) {
            message += ' (' + L('no_mic_permission') + ')';
          } else {
            message += ' (' + L('code') + ': ' + result.kind + ')';
          }
          showAlert(true, L('error'), message);
        }
      });
    }
  }

  async onPlaying(newPlayer) {
    const { player } = this.state;
    if (player === newPlayer) {
      return;
    }

    if (player) {
      await player.stop();
    }
    this.setState({ player: newPlayer });
  }

  async onStop() { }

  onShowAudioActions = (oid, mailId) => {
    const actionOnButtonIndex = async (index) => {
      console.log('index', index);
      switch (index) {
        case 0:
          console.log('data:', oid, mailId);
          const res = this.props.deleteObjectMail({ oid, mailId }, () => { }).then((data) => console.log('res:', data));
          this.props.getHiddenObjectVoiceMails({ oid, limit: 30 }, (pr, packet) => {
            this.setState({ loading: false });
            const { data } = packet;
            if (data.result === 0) {
              this.props.setWiretappedRecordsForObject(oid, data.list);
            }
          });
          console.log(res);
          break;
        case 1:
          const granted = await Permissions.askAsync(Permissions.CAMERA_ROLL);
          const isAvailable = await Sharing.isAvailableAsync();
          console.log(isAvailable);
          if (granted && isAvailable) {
            const format = Const.getPlayFormat();
            const filename = FileSystem.documentDirectory + 'voice_' + mailId + '.' + format;
            const url = 'voicemail/' + oid + '/' + mailId + '.' + format;
            console.log(' === AUDIO: download from ' + Utils.getAudioUrl() + url);
            let downloaded = await FileSystem.downloadAsync(Utils.getAudioUrl() + url, filename);
            let uri = downloaded ? downloaded.uri : 'lol';
            let data = await FileSystem.getInfoAsync(uri);

            Sharing.shareAsync(data.uri, { dialogTitle: 'test' });
          }

          break;
        default:
          break;
      }
    };

    const options = [L('delete'), L('share'), L('cancel')];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 2;

    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (buttonIndex) => {
        actionOnButtonIndex(buttonIndex);
        // Do something here depending on the button index selected
      }
    );
  };

  renderItem(item, photoUrl, oid) {
    const data = item.item;
    const ts = Utils.makeElapsedDate(new Date(data.ts));
    return (
      <View style={styles.bubbleOuter}>
        <ChatBubbleVoiceTheirWire
          onPlaying={this.onPlaying.bind(this)}
          onStop={this.onStop.bind(this)}
          withPhoto={false}
          text={data.text}
          ts={ts}
          imageSource={photoUrl}
          duration={data.duration}
          mailId={data.mailId}
          objectId={oid}
        />
        <TouchableOpacity
          onPress={() => {
            this.onShowAudioActions(oid, data.mailId);
          }}>
          {this.state.shareLoading ? (
            <ActivityIndicator animating={this.state.shareLoading} />
          ) : (
            <Icon name="dots-horizontal" type="material-community" color="black" size={24} />
          )}
        </TouchableOpacity>
      </View>
    );
  }

  onShowHidePremiumModal = () => {
    const { iapItemsError, isPremiumModalVisible, showPremiumModal, showAlert } = this.props;
    const { country } = this.state;

    if (iapItemsError && country !== 'Russia') {
      showAlert(true, L('error'), L('not_data'), true, L('if_try_write_us'));
    } else {
      showPremiumModal(!isPremiumModalVisible);
    }
  };

  onShowSuccessfulSubscriptionModal = () => {
    const { showSuccessfulSubscriptionModal } = this.props;

    showSuccessfulSubscriptionModal(true);
  };

  render() {
    const { navigation, wiretappedRecords, wiretappedNewRecords, objects, isPremiumModalVisible } = this.props;
    let { dialogPinCodeHint, togglePinCodeHintDialog } = this.props;

    const oid = navigation.getParam('oid');
    let objectRecords = wiretappedRecords[oid + ''];
    if (!objectRecords) {
      objectRecords = { messages: [] };
    }

    const object = objects[oid + ''];
    const iosChatObject = Utils.isIosChatObject(object);

    //setPinCodeHintShown(false).then();
    if (objectRecords) {
      if (!iosChatObject) {
        if (wiretappedNewRecords) {
          isPinCodeHintShown().then((res) => {
            if (!res) {
              if (!dialogPinCodeHint) {
                togglePinCodeHintDialog();
              }
            }
          });
        }
      }
    }

    return (
      <View style={styles.container}>
        <View style={styles.page_container}>
          <View style={styles.info_tip}>
            <Image style={styles.info_tip_icon} source={require('../img/ic_circle_alert_32.png')} />
            <Text style={styles.hint}>{L('specify_phone_number_for_callback')}</Text>
          </View>
          <View style={styles.button_pane}>
            <AnimatedButton
              isProgress={this.state.isProgress || this.state.wiretapTimer > 0}
              onPress={this.onDoWiretapping.bind(this)}
              image={require('../img/ic_wire_recording.png')}
              backgroundColor={ColorScheme.blue}
              animate={this.state.isProgress || this.state.wiretapTimer > 0}
              titleStyle={this.state.wiretapTimer > 0 ? styles.timer : {}}
              title={
                this.state.wiretapTimer > 0
                  ? L('wiretapping_in_progress') + ' ' + this.state.wiretapTimer
                  : this.state.isProgress
                    ? L('wiretapping')
                    : L('record_sound_around_child')
              }
            />
            <View style={styles.v_line} />

            <AnimatedButton
              isProgress={this.state.isProgress || this.state.wiretapTimer > 0}
              onPress={() => {
                !object
                  ? this.setState({ showAlert: true, alertText: L('add_wiretapping') })
                  : NavigationService.navigate('OnlineSoundInitial', { oid });
              }}
              image={require('../img/ic_wire_mic.png')}
              backgroundColor="#FF666F"
              animate={false}
              title={L('start_online_wiretapping')}
            />
          </View>

          {/*<Text style={styles.availability}>{L('recording_are_available_for_one_month')}</Text>*/}
          <LinearGradient
            style={styles.gradient_line}
            colors={['#eee', '#fff']}
            start={[0, 0]}
            end={[0, 1]}
            locations={[0, 1.0]}
          />

          <View style={styles.chat_outer}>
            <FlatList
              ref={(element) => {
                this.list = element;
              }}
              style={styles.list}
              data={objectRecords.messages}
              extraData={wiretappedRecords}
              keyExtractor={(item, index) => item.mailId + ''}
              renderItem={(item) => this.renderItem(item, this.state.photoUrl, oid)}
            />
            {this.state.loading ? (
              <View style={styles.progress_outer}>
                <MyActivityIndicator size="large" />
              </View>
            ) : null}
          </View>
        </View>

        <NeedPremiumPane
          marginTop={100}
          visible={this.state.needPremiumVisible}
          onPressSubscribe={() => this.setState({ needPremiumVisible: false })}
          onPressCancel={() => this.setState({ needPremiumVisible: false })}
          showHidePremiumModal={this.onShowHidePremiumModal}
        />
        <AlertPane
          visible={this.state.showAlert}
          titleText={this.state.alertText}
          actionButtonText={L('add')}
          onPressAction={() => {
            this.setState({ showAlert: false });
            NavigationService.forceReplace('Main', {});
            NavigationService.navigate('AddPhone', {});
          }}
        // cancelButtonText={L('cancel')}
        // onPressCancel={() => this.setState({ needPremiumVisible: false })}
        />
        {isPremiumModalVisible && (
          <PremiumModal
            isVisible={isPremiumModalVisible}
            onHide={this.onShowHidePremiumModal}
            onGoToPaymentMethod={(productId) =>
              NavigationService.navigate('PayWithBankCard', { productId, backTo: 'Wiretapping' })
            }
            onPayWithIFree={(productId, kind) =>
              NavigationService.navigate('PaymentMethod', {
                productId,
                kind,
                backTo: 'Wiretapping',
                onHide: () => this.onShowHidePremiumModal,
                isSubscription: true,
              })
            }
            onSuccess={this.onShowSuccessfulSubscriptionModal}
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { objects, wiretappedRecords, wiretappedNewRecords, iapItemsError, premiumReallyPaid } = state.controlReducer;
  const { premium } = state.authReducer;
  const { isPremiumModalVisible } = state.popupReducer;

  return {
    dialogPinCodeHint: popupSelectors.getDialogPinCodeHint(state),
    objects,
    wiretappedRecords,
    wiretappedNewRecords,
    premium,
    iapItemsError,
    isPremiumModalVisible,
    premiumReallyPaid,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    togglePinCodeHintDialog: bindActionCreators(popupActionCreators.togglePinCodeHintDialog, dispatch),
    requestObjectMonitorCallback: bindActionCreators(controlActionCreators.requestObjectMonitorCallback, dispatch),
    getHiddenObjectVoiceMails: bindActionCreators(controlActionCreators.getHiddenObjectVoiceMails, dispatch),
    setWiretappedRecordsForObject: bindActionCreators(controlActionCreators.setWiretappedRecordsForObject, dispatch),
    deleteObjectMail: bindActionCreators(controlActionCreators.deleteObjectMail, dispatch),
    appendVoiceMessageToObjectWiretappedRecords: bindActionCreators(
      controlActionCreators.appendVoiceMessageToObjectWiretappedRecords,
      dispatch
    ),
    showSuccessfulSubscriptionModal: bindActionCreators(popupActionCreators.showSuccessfulSubscriptionModal, dispatch),
    showPremiumModal: bindActionCreators(popupActionCreators.showPremiumModal, dispatch),
    showAlert: bindActionCreators(popupActionCreators.showAlert, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WiretappingPage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    alignContent: 'stretch',
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  page_header: {
    width: '100%',
    height: Const.HEADER_HEIGHT,
    overflow: 'hidden',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'column',
    alignItems: 'center',
    alignContent: 'center',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  gradient_line: {
    width: '100%',
    height: 10,
  },
  page_container: {
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    alignContent: 'stretch',
    flexDirection: 'column',
    flex: 1,
    flexGrow: 1,
    paddingTop: 10,
  },
  buttonDelete: {
    marginTop: 50,
    backgroundColor: 'white',
    borderColor: 'gray',
  },
  auth_input: {
    backgroundColor: '#d8d8d8',
  },
  request_button: {
    padding: 0,
    margin: 0,
    borderRadius: 20,
    width: 220,
    height: 50,
  },
  info_tip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 50,
    paddingRight: 50,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  info_tip_icon: {
    width: 20,
    height: 20,
    marginRight: 20,
  },
  hint: {
    textAlign: 'left',
    fontSize: 13,
    color: '#000',
  },
  hint_small: {
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 12,
    color: 'grey',
  },
  registerText: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 20,
    color: 'white',
  },
  chat_outer: {
    flex: 1,
  },
  list: {
    flex: 1,
    flexGrow: 1,
    marginRight: 15,
  },
  progress_outer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  timer: {
    marginTop: 5,
    fontSize: 12,
    color: '#FF666F',
  },
  availability: {
    width: '100%',
    color: 'grey',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 12,
  },
  bottom_line: {
    width: '100%',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  v_line: {
    borderLeftColor: '#eee',
    borderLeftWidth: 1,
    height: 75,
    marginTop: 10,
  },
  button_pane: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 10,
    width: '100%',
  },
  bubbleOuter: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
});
