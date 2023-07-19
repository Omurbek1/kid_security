import React from 'react';
import { Text, StyleSheet, View, Image, ImageSourcePropType } from 'react-native';
import { stickers } from '../shared/stickersAssetScheme';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { AppColorScheme } from '../shared/colorScheme 2';
import KsAlign from './atom/KsAlign/index';
const imageSourceStub = require('../img/ic_stub_photo2.png');

const defaultProps = {
  text: '<no text>',
  ts: 'ts',
  imageSource: require('../img/ic_stub_photo2.png'),
  loadingIndicatorSource: imageSourceStub,
  localImage: null,
};

interface ChatBubbleTextTheirProps {
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
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  circlePhoto: {
    borderRadius: 100,
    // backgroundColor: '#999',
    borderColor: 'white',
    borderWidth: 2,
    marginRight: 10,
    overflow: 'hidden',
  },
  bubbleWithTs: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  bubble: {
    flexDirection: 'row',
    alignItems: 'flex-end',

    borderRadius: 25,
    borderBottomLeftRadius: 0,
    backgroundColor: '#fff',
    padding: 10,
    borderWidth: 1,
    borderColor: AppColorScheme.passiveAccent,
  },
  ts: {
    fontSize: 11,
    opacity: 0.5,
  },
});

class ChatBubbleTextTheir extends React.Component<ChatBubbleTextTheirProps> {
  render() {
    const props = { ...defaultProps, ...this.props };
    const image = props.localImage
      ? props.localImage
      : props.imageSource
      ? { uri: props.imageSource }
      : props.loadingIndicatorSource;
    return (
      <View style={[styles.bubbleOuter]}>
        <View style={[styles.circlePhoto]}>
          <Image
            style={{
              width: 40,
              height: 40,
            }}
            loadingIndicatorSource={props.loadingIndicatorSource}
            resizeMode="cover"
            source={image}></Image>
        </View>
        <View style={styles.bubbleWithTs}>
          {props.text && !props.sticker ? (
            <KsAlign axis="horizontal" style={styles.bubble}>
              <Text style={{ paddingHorizontal: 5, maxWidth: '60%', color: '#000' }}>{props.text}</Text>
              <KsAlign axis="horizontal" elementsGap={5} style={{ alignItems: 'flex-end' }}>
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
              <Text style={styles.ts}>{props.ts}</Text>
            </KsAlign>
          )}
        </View>
      </View>
    );
  }
}

export default ChatBubbleTextTheir;
