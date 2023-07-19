import React from 'react';
import MyActivityIndicator from './MyActivityIndicator';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { controlActionCreators } from '../reducers/controlRedux';
import { popupActionCreators } from '../reducers/popupRedux';
import * as Utils from '../Utils';
import Const from '../Const';
import ProgressBar from './ProgressBar';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';
import UserPrefs from '../UserPrefs';
import { L } from '../lang/Lang';
import { AppColorScheme } from '../shared/colorScheme';

const ios = 'ios' === Platform.OS;

const defaultProps = {
  text: '<no text>',
  ts: 'ts',
  duration: 0,
  mailId: 0,
  objectId: 0,
};

class VoiceMessagePlayer extends React.Component {
  state = {
    isPlaying: false,
    isLoading: false,
    max: 1,
    position: 0,
    curTs: '0:00',
    filename: '',
  };

  UNSAFE_componentWillMount() {
    const { duration } = this.props;

    this.setState({
      curTs: Utils.makeDurationLabel(duration),
    });
  }

  async tryToPlay() {
    const { mailId, duration, onPlaying } = this.props;

    if (this.soundObject) {
      return;
    }

    const format = Const.getPlayFormat();
    const filename = FileSystem.documentDirectory + 'voice_' + mailId + '.' + format;
    console.log('filename:', filename);
    await Audio.setAudioModeAsync({
      staysActiveInBackground: false,
      playsInSilentModeIOS: true,
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    this.soundObject = new Audio.Sound();
    this.soundObject.setOnPlaybackStatusUpdate(async (status) => {
      const maxDur = status.playableDurationMillis ? status.playableDurationMillis : status.durationMillis;
      if (!status.isPlaying && status.positionMillis >= maxDur) {
        console.log('unloading');
        try {
          await this.soundObject.unloadAsync();
        } catch (e) { }
        this.soundObject = null;
        this.setState({
          isPlaying: false,
          curTs: Utils.makeDurationLabel(duration),
        });
      } else {
        this.setState({
          max: maxDur ? maxDur : 1,
          position: status.positionMillis ? status.positionMillis : 0,
          curTs: Utils.makeDurationLabel(status.positionMillis),
        });
      }
    });
    try {
      await this.soundObject.loadAsync({ uri: filename });
      await this.soundObject.playAsync();
      this.setState({ isPlaying: true, filename: filename });
      if (onPlaying) {
        onPlaying(this);
      }
    } catch (error) {
      console.log(error);
      // An error occurred!
    }
  }

  async stop() {
    const { duration, onStop } = this.props;

    if (this.state.isPlaying) {
      try {
        await this.soundObject.unloadAsync();
        this.soundObject = null;
      } catch (e) {
        console.log(e);
      }
      this.setState({
        isPlaying: false,
        curTs: Utils.makeDurationLabel(duration),
      });
      if (onStop) {
        await onStop();
      }
    }
  }

  async onPlayClick() {
    const { mailId, objectId, showAlert } = this.props;

    if (this.state.isLoading) {
      return;
    }

    if (this.state.isPlaying) {
      return await this.stop();
    }

    const format = Const.getPlayFormat();
    const filename = FileSystem.documentDirectory + 'voice_' + mailId + '.' + format;
    const file = await FileSystem.getInfoAsync(filename);
    if (!file.exists || 0 === file.size) {
      this.setState({ isLoading: true });
      const url = 'voicemail/' + objectId + '/' + mailId + '.' + format;
      console.log(' === AUDIO: download from ' + Utils.getAudioUrl() + url);
      let downloaded = await FileSystem.downloadAsync(Utils.getAudioUrl() + url, filename);
      if (200 != downloaded.status) {
        await UserPrefs.switchUsingAltBackend();
        console.log(' === AUDIO: second download from ' + Utils.getAudioUrl() + url);
        downloaded = await FileSystem.downloadAsync(Utils.getAudioUrl() + url, filename);
        if (200 != downloaded.status) {
          this.setState({ isLoading: false });
          // console.log(downloaded);
          showAlert(true, L('error'), L('unable_to_load_audio_file'));
          await FileSystem.deleteAsync(filename);
          return;
        }
      }
      this.setState({ isLoading: false });
      this.tryToPlay();
      return;
    }

    this.tryToPlay();
  }

  render() {
    const props = { ...defaultProps, ...this.props };

    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.onPlayClick.bind(this)}
          style={[styles.btnPlay, { borderColor: this.state.isPlaying ? AppColorScheme.accent : 'black' }]}>
          <View style={styles.btnIconOuter}>
            {this.state.isLoading ? (
              <MyActivityIndicator />
            ) : (
              <Icon
                style={styles.btnIcon}
                type="material-community"
                name={this.state.isPlaying ? 'stop' : 'play'}
                color={this.state.isPlaying ? AppColorScheme.accent : 'black'}
                size={25}
              />
            )}
          </View>
        </TouchableOpacity>
        <ProgressBar
          style={styles.progress}
          width={100}
          height={1}
          max={this.state.max}
          position={this.state.position}
        />
        <Text style={styles.playLabel}>{this.state.curTs}</Text>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  /*const {
    } = state.controlReducer;*/

  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    getObjectVoiceMail: bindActionCreators(controlActionCreators.getObjectVoiceMail, dispatch),
    showAlert: bindActionCreators(popupActionCreators.showAlert, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(VoiceMessagePlayer);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btnPlay: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    overflow: 'hidden',
    borderRadius: 100,
    borderWidth: 1,
    width: 35,
    height: 35,
    marginRight: 10,
  },
  progress: {},
  playLabel: {
    marginLeft: 10,
    minWidth: 35,
  },
  btnIcon: {},
  btnIconOuter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: ios ? 2 : 0,
  },
});
