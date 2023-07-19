import React, { FunctionComponent } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableHighlight,
  ViewStyle,
} from 'react-native';
import { NewColorScheme } from '../shared/colorScheme';

const { GREY_COLOR_1, GREY_COLOR_2, PINK_COLOR_2 } = NewColorScheme;

interface ChatItemProps {
  name: string;
  message: string;
  time: string;
  blurred: boolean;
  onChatPress: () => void;
  viewStyle?: ViewStyle;
};

const ChatItem: FunctionComponent<ChatItemProps> = props => {
  const { name, message, time, blurred, onChatPress, viewStyle = {} } = props;
  const {
    container,
    chatName,
    chatMessage,
    chatTime,
    image,
    messageWrapper,
    mainContainer,
    innerContainer,
    topWrapper,
    blurredImage,
  } = styles;

  return (
    <TouchableHighlight
      style={[container, viewStyle]}
      onPress={onChatPress}
      underlayColor={PINK_COLOR_2}
      disabled={blurred}>
      {blurred
        ? <Image source={require('../img/blurred_chat.png')} style={blurredImage} />
        : <View style={mainContainer}>
          <View style={innerContainer}>
            <Image source={require('../img/chat_photo_placeholder.png')} style={image} />
            <View style={messageWrapper}>
              <View style={topWrapper}>
                <Text style={chatName} numberOfLines={1}>{name}</Text>
                <Text style={chatTime}>{time}</Text>
              </View>
              <Text style={chatMessage} numberOfLines={1}>{message}</Text>
            </View>
          </View>
        </View>}
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 58,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginVertical: 10,
  },
  chatName: {
    fontSize: 14,
    fontWeight: '700',
    alignSelf: 'center',
    width: '60%',
  },
  chatMessage: {
    fontSize: 12,
    fontWeight: '400',
    color: GREY_COLOR_1,
    width: '80%',
  },
  chatTime: {
    fontSize: 12,
    fontWeight: '400',
    color: GREY_COLOR_2,
    flex: 2,
    textAlign: 'right',
  },
  image: {
    width: 30,
    height: 30,
  },
  messageWrapper: {
    flex: 1,
    marginLeft: 10,
  },
  mainContainer: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 13,
  },
  topWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  blurredImage: {
    width: '100%',
    height: 58,
  },
});

export default ChatItem;
