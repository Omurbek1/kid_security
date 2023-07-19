import React from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { controlActionCreators } from '../reducers/controlRedux';
import VoiceMessagePlayer from './VoiceMessagePlayer';

const imageSourceStub = require('../img/ic_stub_photo.png');

const defaultProps = {
  text: '<no text>',
  ts: 'ts',
  imageSource: require('../img/ic_stub_photo.png'),
  loadingIndicatorSource: imageSourceStub,
  localImage: null,
  duration: 0,
  mailId: 0,
  objectId: 0,
  withPhoto: true,
};

class _ChatBubbleVoiceTheirWire extends React.Component {
  render() {
    const props = { ...defaultProps, ...this.props };
    const image = props.localImage
      ? props.localImage
      : props.imageSource
      ? { uri: props.imageSource }
      : props.loadingIndicatorSource;
    const { objectId, mailId, duration, ts, text, onPlaying } = props;

    return (
      <View style={styles.bubble_outer}>
        {props.withPhoto ? (
          <View style={styles.circle_photo}>
            <Image
              style={{
                width: 64,
                height: 64,
              }}
              loadingIndicatorSource={props.loadingIndicatorSource}
              resizeMode="cover"
              source={image}></Image>
          </View>
        ) : null}
        <View style={styles.bubble_with_ts}>
          <View style={styles.bubble}>
            <VoiceMessagePlayer
              onPlaying={onPlaying}
              objectId={objectId}
              mailId={mailId}
              duration={duration}
              ts={ts}
              text={text}
            />
          </View>
          <Text style={styles.ts}>{props.ts}</Text>
        </View>
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
  };
};

const ChatBubbleVoiceTheirWire = connect(mapStateToProps, mapDispatchToProps)(_ChatBubbleVoiceTheirWire);
export default ChatBubbleVoiceTheirWire;

const styles = StyleSheet.create({
  bubble_outer: {
    flex: 1,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    maxWidth: 310,
  },
  circle_photo: {
    borderRadius: 100,
    backgroundColor: '#999',
    borderColor: 'white',
    borderWidth: 2,
    marginRight: 10,
    marginBottom: 10,
    overflow: 'hidden',
  },
  bubble_with_ts: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    borderRadius: 6,
    backgroundColor: '#fff',
    padding: 0,
  },
  ts: {
    fontSize: 11,
    opacity: 0.25,
  },
  btnPlay: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    overflow: 'hidden',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'black',
    width: 40,
    height: 40,
    marginRight: 10,
  },
  progress: {},
  playLabel: {
    marginLeft: 10,
  },
});
