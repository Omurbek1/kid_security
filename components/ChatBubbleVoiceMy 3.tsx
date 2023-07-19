import React from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';
import { connect } from 'react-redux';
import VoiceMessagePlayer from './VoiceMessagePlayer';
import KsAlign from './atom/KsAlign/index';
import { size } from 'lodash';

const imageSourceStub = require('../img/ic_stub_photo.png');
const checkDelivered = require('../img/ic_check_small.png');
const checkReaded = require('../img/ic_check_small_on.png');

const defaultProps = {
  text: '<no text>',
  ts: 'ts',
  imageSource: require('../img/ic_stub_photo.png'),
  loadingIndicatorSource: imageSourceStub,
  localImage: null,
  duration: 0,
  mailId: 0,
  objectId: 0,
  delivered: false,
  readed: false,
};

const styles = StyleSheet.create({
  bubbleOuter: {
    flex: 1,
    flexGrow: 1,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  circlePhoto: {
    borderRadius: 100,
    backgroundColor: '#999',
    borderColor: 'white',
    borderWidth: 2,
    marginRight: 10,
    marginBottom: 10,
    overflow: 'hidden',
  },
  bubbleWithTs: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 25,
    justifyContent: 'flex-end',
    borderBottomRightRadius: 0,
    backgroundColor: '#EDF1FA',
    padding: 10,
  },
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    borderRadius: 6,
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
  state: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  check: {
    width: 20,
    height: 20,
  },
});

class UnconnectedChatBubbleVoiceMy extends React.Component {
  render() {
    const props = { ...defaultProps, ...this.props };
    const { objectId, mailId, duration, ts, text, delivered, readed, onPlaying } = props;

    let checkmark = null;
    if (delivered && !readed) {
      checkmark = checkDelivered;
    }
    if (readed) {
      checkmark = checkReaded;
    }

    return (
      <View style={styles.bubbleOuter}>
        <View style={styles.bubbleWithTs}>
          <View style={[styles.bubble]}>
            <VoiceMessagePlayer
              onPlaying={onPlaying}
              objectId={objectId}
              mailId={mailId}
              duration={duration}
              ts={ts}
              text={text}
            />
          </View>
          <KsAlign axis="horizontal" elementsGap={5} style={{ alignItems: 'flex-end' }}>
            <Image style={styles.check} source={checkmark} />
            <Text style={styles.ts}>{props.ts}</Text>
          </KsAlign>
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
  return {};
};

const ChatBubbleVoiceMy = connect(mapStateToProps, mapDispatchToProps)(UnconnectedChatBubbleVoiceMy);
export default ChatBubbleVoiceMy;
