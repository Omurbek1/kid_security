import React from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { controlActionCreators } from '../reducers/controlRedux';
import VoiceMessagePlayer from './VoiceMessagePlayer';
import { AppColorScheme } from '../shared/colorScheme 2';

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

const styles = StyleSheet.create({
  bubbleOuter: {
    flex: 1,
    flexGrow: 1,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  circlePhoto: {
    borderRadius: 100,
    backgroundColor: '#999',
    borderColor: 'white',
    borderWidth: 2,
    marginRight: 10,
    overflow: 'hidden',
  },
  bubbleWithTs: {
    flexDirection: 'row',
    alignItems: 'flex-end',

    borderRadius: 25,
    borderBottomLeftRadius: 0,
    backgroundColor: '#fff',
    padding: 10,
    borderWidth: 1,
    borderColor: AppColorScheme.passiveAccent,
  },
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    borderRadius: 6,
    backgroundColor: '#fff',
    padding: 5,
  },
  ts: {
    fontSize: 11,
    opacity: 0.5,
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

class UnconnectedChatBubbleVoiceTheir extends React.Component {
  render() {
    const props = { ...defaultProps, ...this.props };
    const image = props.localImage
      ? props.localImage
      : props.imageSource
      ? { uri: props.imageSource }
      : props.loadingIndicatorSource;
    const { objectId, mailId, duration, ts, text, onPlaying } = props;

    return (
      <View style={styles.bubbleOuter}>
        {props.withPhoto ? (
          <View style={styles.circlePhoto}>
            <Image
              style={{
                width: 40,
                height: 40,
              }}
              loadingIndicatorSource={props.loadingIndicatorSource}
              resizeMode="cover"
              source={image}></Image>
          </View>
        ) : null}
        <View style={styles.bubbleWithTs}>
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

const ChatBubbleVoiceTheir = connect(mapStateToProps, mapDispatchToProps)(UnconnectedChatBubbleVoiceTheir);
export default ChatBubbleVoiceTheir;
