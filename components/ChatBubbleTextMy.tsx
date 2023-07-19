import React from 'react';
import { Text, StyleSheet, View, Image, ImageSourcePropType } from 'react-native';
import KsAlign from './atom/KsAlign/index';
import { AppColorScheme } from '../shared/colorScheme 2';

const defaultProps = {
  text: '<no text>',
  ts: 'ts',
  delivered: false,
  readed: false,
};

interface ChatBubbleTextMyProps {
  text?: string;
  ts: string;
  imageSource: Image;
  loadingIndicatorSource?: Image;
  localImage?: null;
  sticker?: ImageSourcePropType;
}

const styles = StyleSheet.create({
  bubbleOuter: {
    flex: 1,
    flexGrow: 1,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  bubbleWithTs: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  bubble: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 25,
    borderBottomRightRadius: 0,
    backgroundColor: '#EDF1FA',
    padding: 10,
  },
  ts: {
    fontSize: 11,
    opacity: 0.5,
  },
  state: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  check: {
    width: 20,
    height: 20,
  },
});

const checkDelivered = require('../img/ic_check_small.png');
const checkReaded = require('../img/ic_check_small_on.png');

class ChatBubbleTextMy extends React.Component<ChatBubbleTextMyProps> {
  render() {
    const props = { ...defaultProps, ...this.props };
    const { delivered, readed } = props;
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
          {props.text && !props.sticker ? (
            <KsAlign axis="horizontal" style={styles.bubble}>
              <Text style={{ paddingHorizontal: 5, maxWidth: '60%', color: '#000' }}>{props.text}</Text>
              <KsAlign axis="horizontal" elementsGap={5} style={{ alignItems: 'flex-end' }}>
                <Image style={styles.check} source={checkmark} />
                <Text style={styles.ts}>{props.ts}</Text>
              </KsAlign>
            </KsAlign>
          ) : (
            <KsAlign axis="vertical" elementsGap={10} style={{ alignItems: 'flex-end' }}>
              <View
                style={{
                  width: 150,
                  height: 150,
                  position: 'relative',
                  overflow: 'hidden',
                  alignItems: 'center',
                }}>
                <Image
                  resizeMode="cover"
                  source={props.sticker}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    width: '90%',
                    height: '90%',
                  }}
                />
              </View>
              <KsAlign axis="horizontal" elementsGap={5} style={{ alignItems: 'flex-end' }}>
                <Image style={styles.check} source={checkmark} />
                <Text style={styles.ts}>{props.ts}</Text>
              </KsAlign>
            </KsAlign>
          )}
        </View>
      </View>
    );
  }
}

export default ChatBubbleTextMy;
