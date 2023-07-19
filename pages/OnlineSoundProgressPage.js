import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { controlActionCreators } from '../reducers/controlRedux';
import { popupActionCreators } from '../reducers/popupRedux';
import ChatBubbleVoiceTheir from '../components/ChatBubbleVoiceTheir';
import { L } from '../lang/Lang';
import NavigationService from '../navigation/NavigationService';
import { Audio } from 'expo-av';
import { authActionCreators } from '../reducers/authRedux';
import * as Utils from '../Utils';
import AnimatedButton from '../components/AnimatedButton';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import { getHeader } from '../shared/getHeader';
import { AppColorScheme } from '../shared/colorScheme';
import KsButton from '../components/atom/KsButton';
import UserPrefs from '../UserPrefs';
import Const from '../Const';

class OnlineSoundProgressPage extends React.Component {
  static navigationOptions = () => {
    return {
      ...getHeader({ title: L('menu_wiretapping') }),
    };
  };

  heartbeat = null;
  onlineTs = 0;
  curTs = 0;

  state = {
    connecting: false,
    listening: false,
    error: false,
    isLoud: true,
    uri: null,
    meanSoundBalance: 0,
    startMeanSoundBalance: 0,
  };

  UNSAFE_componentWillMount = () => {
    this._mounted = true;
  };

  componentDidMount() {
    const { navigation } = this.props;
    const oid = navigation.getParam('oid');
    this.setState({ oid });
    setTimeout(() => this.initiateOnlineSound(), 0);
  }

  initiateOnlineSound() {
    //keeps display from going to sleep mode
    activateKeepAwake();

    const {
      requestOnlineSound,
      onlineSoundBalance,
      wireValid,
      setOnlineListeningStatus,
      showAlert,
    } = this.props;
    const { oid } = this.state;

    if (onlineSoundBalance < 1 && !wireValid) {
      this.setState({ meanSoundBalance: onlineSoundBalance, startMeanSoundBalance: onlineSoundBalance });
      showAlert(true, L('error'), L('please_top_up_sound_balance'));
      return;
    }

    Utils.getAndClearAppStopTs();
    this.setState({
      oid,
      connecting: true,
      listening: false,
      error: false,
      uri: null,
      meanSoundBalance: onlineSoundBalance,
      startMeanSoundBalance: onlineSoundBalance,
    });
    let _this = this;
    setOnlineListeningStatus(true);
    const region = UserPrefs.all.userLocationCountry;
    requestOnlineSound({ oid, protocol: 'rtsp', region }, async function (pr, packet) {
      const data = packet && packet.data ? packet.data : null;
      if (!data || 0 !== data.result) {
        console.log(data);
        return _this.setState({ connecting: false, error: true });
      }

      const { uuid, uri } = data;

      // TODO: debug, remove in production
      //uri = 'http://192.168.13.37/live/stream.m3u8';
      //uri = 'http://streaming.gps-watch.kz/file/123/stream.m3u8';
      //uri = 'https://up.imgupio.com/demo/birds.m3u8';

      console.log(' == LIVE: uuid: ' + uuid + ', uri: ' + uri);
      await _this.playAudioStream({ uuid, uri });
    });
  }

  async playAudioStream({ uuid, uri }) {
    this.soundObject = new Audio.Sound();
    this.soundObject.setOnPlaybackStatusUpdate(async (status) => {
      /*if (status) {
        console.log(status.positionMillis + ' / ' + status.playableDurationMillis);
      }*/

      if (status.isPlaying === undefined) {
        return;
      }

      if (status.isPlaying !== this.state.listening) {
        if (true === status.didJustFinish) {
          this.setState({ listening: false, connecting: false, uri: null });
          console.log(' == LIVE: STOP playing');
          console.log(status);
          this.stopHeartbeat();
          try {
            this.props.cancelOnlineSound({ oid: this.state.oid });
            await this.soundObject.unloadAsync();
          } catch (e) { }
          this.soundObject = null;
        } else if (true === status.isPlaying) {
          console.log(' == LIVE: start playing: ' + status.isPlaying);
          this.applyLoudSpeaker();
          this.startHeartbeat();
          this.setState({ listening: true, connecting: false, uri });
        }
      } else if (true === status.isPlaying) {
        const elapsed = new Date().getTime() - this.onlineTs;
        const newMean = this.state.startMeanSoundBalance - elapsed;
        //console.log(' -----------: ' + newMean + ' newMean');
        //console.log(' -----------: ' + this.props.onlineSoundBalance);
        this.setState({ meanSoundBalance: newMean });
      }
      //console.log(status);
    });
    try {
      console.log(' == LIVE: loading... ' + uri);
      //const uri = 'http://192.168.13.37:8080/livestreaming-web/file/' + uuid + '/stream.m3u8';
      this.setState({ uri });
      await fetch(uri, { headers: { 'Cache-Control': 'no-store' } });
      const status = await this.soundObject.loadAsync({ uri });
      console.log(' == LIVE: loaded: ' + status.isLoaded);
      if (status.isLoaded) {
        this.soundObject.setProgressUpdateIntervalAsync(1000);
        await this.soundObject.playAsync();
      } else {
        this.setState({ error: true, connecting: false });
      }
    } catch (error) {
      //console.log(error);
      console.log(' == LIVE: loaded2: false');
      if (this._mounted) {
        this.setState({ error: true, connecting: false });
      }
    }
  }

  async componentWillUnmount() {
    await this.onStopClick();

    if (null != this.soundObject) {
      this.soundObject.setOnPlaybackStatusUpdate(function () { });
      try {
        await this.soundObject.unloadAsync();
      } catch (e) { }
      this.soundObject = null;
    }
    this._mounted = false;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    return null;
  }

  renderItem(item, photoUrl, oid) {
    const data = item.item;
    const ts = Utils.makeElapsedDate(new Date(data.ts));
    return (
      <ChatBubbleVoiceTheir
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
    );
  }

  async onStopClick() {
    const { cancelOnlineSound, setOnlineListeningStatus } = this.props;
    setOnlineListeningStatus(false);
    deactivateKeepAwake();

    this.stopHeartbeat();
    if (this._mounted) {
      let listening = this.state.listening;
      this.setState({ connecting: false, listening: false, error: false, uri: null });
      if (null != this.soundObject) {
        cancelOnlineSound({ oid: this.state.oid });
        if (listening) {
          this.consumeSecondsInternalFinalize((balance) => {
            if (this._mounted) {
              this.setState({ meanSoundBalance: balance, startMeanSoundBalance: balance });
              console.log(balance);
            }
            return false;
          });
        }
      }
    }
    if (null != this.soundObject) {
      this.soundObject.setOnPlaybackStatusUpdate(function () { });
      try {
        let promise = this.soundObject.stopAsync();
        this.soundObject = null;
        await promise;
      } catch (e) { }
    }
  }

  async startPingRemoteEndpoint() {
    const { listening, uri, oid } = this.state;

    //console.log(' --- tick');
    if (listening && uri) {
      const response = await fetch(uri, { headers: { 'Cache-Control': 'no-store' } });
      if (!response.ok) {
        console.log(' == LIVE: lost remote endpoint, stopping...');
        if (this._mounted) {
          this.setState({ listening: false, connecting: false, uri: null });
        }
        console.log(' == LIVE: STOP playing');
        this.stopHeartbeat();
        try {
          this.props.cancelOnlineSound({ oid: oid });
          await this.soundObject.unloadAsync();
        } catch (e) { }
        this.soundObject = null;
      } else {
        setTimeout(() => this.startPingRemoteEndpoint(), 1000);
      }
    }
  }

  consumeSecondsInternal() {
    const { oid, listening } = this.state;
    const { wireValid, setOnlineSoundBalance, onlineSoundHeartbeat } = this.props;

    const stopTs = Utils.getAndClearAppStopTs();
    let msec = wireValid
      ? 0
      : (stopTs ? stopTs : new Date().getTime()) - (this.curTs ? this.curTs : new Date().getTime());
    if (msec < 0) {
      msec = 0;
    }
    //console.log(' ==== intern: ' + msec + ' onlineTs=', this.onlineTs + ' curTs=' + this.curTs + ' now=' + new Date().getTime() + ' stopTs=' + stopTs);
    this.curTs = new Date().getTime();
    onlineSoundHeartbeat({ oid, startTs: this.onlineTs, curTs: this.curTs, msec }, (pr, packet) => {
      const data = packet && packet.data ? packet.data : null;
      if (data && 0 === data.result) {
        setOnlineSoundBalance(data.balance);
      }
      //console.log(' ================= ', listening, stopTs);
      if (listening && !stopTs) {
        this.consumeSeconds();
      }
    });
  }

  consumeSecondsInternalFinalize(callback) {
    const { oid } = this.state;
    const { setOnlineSoundBalance, onlineSoundHeartbeat, wireValid } = this.props;

    const stopTs = Utils.getAndClearAppStopTs();
    let msec = wireValid
      ? 0
      : (stopTs ? stopTs : new Date().getTime()) - (this.curTs ? this.curTs : new Date().getTime());
    if (msec < 0) {
      msec = 0;
    }
    console.log(
      ' ==== finalize: ' + msec + ' onlineTs=',
      this.onlineTs + ' curTs=' + this.curTs + ' now=' + new Date().getTime() + ' stopTs=' + stopTs
    );
    this.curTs = new Date().getTime();
    onlineSoundHeartbeat({ oid, startTs: this.onlineTs, curTs: this.curTs, msec }, (pr, packet) => {
      const data = packet && packet.data ? packet.data : null;
      if (data && 0 === data.result) {
        setOnlineSoundBalance(data.balance);
        if (callback) {
          if (!callback(data.balance)) {
            return;
          }
        }
      }
    });
  }

  consumeSeconds() {
    this.heartbeat = setTimeout(() => {
      this.consumeSecondsInternal();
    }, 3000);
  }

  startHeartbeat() {
    if (this.heartbeat) {
      return;
    }

    this.stopTs = null;
    this.onlineTs = new Date().getTime();
    this.curTs = this.onlineTs;

    setTimeout(() => this.startPingRemoteEndpoint(), 0);
    this.consumeSeconds();
  }

  stopHeartbeat() {
    if (this.heartbeat) {
      clearTimeout(this.heartbeat);
      this.heartbeat = null;
    }
  }

  applyLoudSpeaker() {
    const isLoud = this.state.isLoud;
    if (isLoud) {
      Audio.setAudioModeAsync({
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        allowsRecordingIOS: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } else {
      Audio.setAudioModeAsync({
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        allowsRecordingIOS: true,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: true,
      });
    }
  }

  switchLoudSpeaker() {
    const isLoud = !this.state.isLoud;
    this.setState({ isLoud });
    setTimeout(() => {
      this.applyLoudSpeaker();
    }, 0);
  }

  render() {
    const { navigation, wireValid } = this.props;
    const { connecting, listening } = this.state;
    const oid = navigation.getParam('oid');

    let message = L('listening_stopped');
    if (connecting) {
      message = L('connecting_to_child_phone');
    }
    if (this.state.error) {
      message = L('connecting_to_child_phone_failed');
    } else if (listening) {
      message = L('listening_in_progress');
    }

    const soundBalance = wireValid ? '∞' : Utils.soundBalanceToStr(this.state.meanSoundBalance);
    return (
      <SafeAreaView style={styles.mainContainer}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            borderBottomColor: AppColorScheme.passiveAccent,
            borderBottomWidth: 1,
          }}>
          <AnimatedButton
            isProgress={connecting || listening}
            onPress={this.initiateOnlineSound.bind(this)}
            image={require('../img/ic_wire_mic.png')}
            backgroundColor="#FF666F"
            animate={connecting || listening}
            title={null}
          />
          <View style={{ marginTop: 10, alignItems: 'center', width: '90%' }}>
            <Text style={styles.progress_text}>{message}</Text>
            <Text style={styles.balance}>{L('minutes_balance_short', [soundBalance])}</Text>
          </View>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
            onPress={this.switchLoudSpeaker.bind(this)}>
            <Icon name={this.state.isLoud ? 'volume-low' : 'volume-high'} type="material-community"></Icon>
            <View style={{ width: 20 }}></View>
            <Text style={styles.speaker_control}>{L(this.state.isLoud ? 'turn_off_speaker' : 'turn_on_speaker')}</Text>
          </TouchableOpacity>
        </View>
        <View style={{ padding: 20, paddingVertical: 30, backgroundColor: '#fff' }}>
          <KsButton
            disabled={!(connecting || listening)}
            style={{ paddingVertical: 20, paddingHorizontal: 30 }}
            titleStyle={{ textAlign: 'center', fontSize: 16 }}
            title={L('stop')}
            onPress={this.onStopClick.bind(this)}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  const { objects, wiretappedRecords, wireValid } = state.controlReducer;
  const { onlineSoundBalance } = state.authReducer;

  return {
    objects,
    wiretappedRecords,
    onlineSoundBalance,
    wireValid,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    requestOnlineSound: bindActionCreators(controlActionCreators.requestOnlineSound, dispatch),
    cancelOnlineSound: bindActionCreators(controlActionCreators.cancelOnlineSound, dispatch),
    onlineSoundHeartbeat: bindActionCreators(controlActionCreators.onlineSoundHeartbeat, dispatch),
    setOnlineSoundBalance: bindActionCreators(authActionCreators.setOnlineSoundBalance, dispatch),
    setOnlineListeningStatus: bindActionCreators(controlActionCreators.setOnlineListeningStatus, dispatch),
    showAlert: bindActionCreators(popupActionCreators.showAlert, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OnlineSoundProgressPage);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    alignContent: 'center',
    flex: 1,
    flexGrow: 1,
    flexDirection: 'column',
    padding: 10,
    paddingTop: 75,
  },
  mainContainer: {
    justifyContent: 'center',
    alignItems: 'stretch',
    alignContent: 'center',
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  request_button: {
    marginTop: 0,
    borderRadius: 20,
    width: 220,
    height: 50,
  },
  whiteBox: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: 'white',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    alignContent: 'stretch',
    overflow: 'hidden',
  },
  online_button: {
    marginBottom: 5,
    borderRadius: 15,
    width: 80,
    height: 80,
    backgroundColor: '#FF666F',
    alignContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  button_image: {
    resizeMode: 'contain',
    flex: 1,
  },
  speaker_control: {
    textDecorationLine: 'underline',
    color: '#000',
  },
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balance: {
    opacity: 0.5,
    color: '#000',
  },
  progress_text: {
    textAlign: 'center',
    color: '#000',
  },
});
