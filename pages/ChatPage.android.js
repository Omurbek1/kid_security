import React from 'react';
import {
  Text,
  Animated,
  PanResponder,
  FlatList,
  Dimensions,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Easing,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Linking,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { controlActionCreators } from '../reducers/controlRedux';
import { popupActionCreators } from '../reducers/popupRedux';
import { ActionCreators as controlMiddlewareActionCreators } from '../wire/ControlMiddleware';
import * as Utils from '../Utils';
import Const from '../Const';
import ChatBubbleTextTheir from '../components/ChatBubbleTextTheir';
import ChatBubbleTextMy from '../components/ChatBubbleTextMy';
import ChatBubbleVoiceTheir from '../components/ChatBubbleVoiceTheir';
import ChatBubbleVoiceMy from '../components/ChatBubbleVoiceMy';
import { Icon } from 'react-native-elements';
import { L } from '../lang/Lang';
import * as RecorderCtl from '../RecorderCtl';
import MyActivityIndicator from '../components/MyActivityIndicator';
import { stickers } from '../shared/stickersAssetScheme';
import { getHeader } from '../shared/getHeader';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { ColorScheme, AppColorScheme } from '../shared/colorScheme';
import he from '../lang/he';
import StickerGrid from '../components/organisms/StickersGrid';
import AlertPane from '../components/AlertPane';
import NavigationService from '../navigation/NavigationService';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
import ShareAboutBlock from '../components/molecules/ShareAboutBlock';

const MAX_SLIDE_X = -140;
const { height } = Dimensions.get('window');

class ChatPage extends React.Component {
  static navigationOptions = () => {
    return {
      title: L('menu_chat_with_kid'),
      ...getHeader({ title: L('menu_chat_with_kid') }),
    };
  };

  state = {
    isProgress: true,
    message: '',
    locked: false,
    photoUrl: null,
    message: '',
    height: 40,
    inputHeight: 330,
    showSticker: false,
    showKeyboard: false,
    stickersHeight: new Animated.Value(0),
    slider: new Animated.ValueXY(),
    redDot: new Animated.Value(1.0),
    opacity: new Animated.Value(1.0),
    isRecording: false,
    recordingLabel: '0:00',
    player: null,
    alertText: '',
    showAlert: false,
  };

  openProgressbar = () => {
    this.setState({ isProgress: true });
  };

  hideProgressbar = () => {
    this.setState({ isProgress: false });
  };

  onChangeMessage(message) {
    this.setState({ message });
  }

  showStickers(height) {
    Keyboard.dismiss();
    this.setState({ showSticker: true, showKeyboard: false });
    Animated.timing(this.state.stickersHeight, {
      toValue: this.state.inputHeight,
      duration: 0,
      delay: 250,
    }).start();
    console.log('show Sticker!');
  }

  hideStickers(height) {
    this.setState({ showSticker: false });

    Animated.timing(this.state.stickersHeight, {
      toValue: 0,
      duration: 0,
    }).start();
  }

  keyboardShowHandler(e) {
    console.log('event show:', e);
    const height = e.endCoordinates.height;
    this.setState({ inputHeight: height, showKeyboard: true });
  }

  keyboardHideHandler(e) {
    console.log('event hide:', e);
    this.setState({ showKeyboard: false });
  }
  UNSAFE_componentWillMount() {
    this.state.slider.setValue({ x: 0, y: 0 });

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      onPanResponderGrant: (e, gestureState) => {
        this.recordAudio();
      },

      onPanResponderMove: (e, gestureState) => {
        if (gestureState.dx < MAX_SLIDE_X) {
          // cancel recording
          RecorderCtl.abortRecording();
        } else {
          this.state.slider.x.setValue(gestureState.dx / 10);
          const opacity = 1.0 - (0.8 / MAX_SLIDE_X) * gestureState.dx + 0.2;
          this.state.opacity.setValue(opacity);
        }
      },

      onPanResponderRelease: (e, { vx, vy }) => {
        RecorderCtl.finishRecording();
        this.state.slider.setValue({ x: 0, y: 0 });
        this.state.opacity.setValue(1.0);
      },
    });
  }

  componentWillUnmount() {
    const { setCurrentChatOid } = this.props;
    setCurrentChatOid(null);
  }

  componentDidMount() {
    const keyboardEventTypeShow = 'keyboardDidShow';
    const keyboardEventTypeHide = 'keyboardDidHide';
    Keyboard.addListener(keyboardEventTypeShow, this.keyboardShowHandler.bind(this));
    Keyboard.addListener(keyboardEventTypeHide, this.keyboardHideHandler.bind(this));
    const {
      getObjectVoiceMails,
      setChatForObject,
      navigation,
      objects,
      clearMessageBadgeCounter,
      resetMessageBadge,
      markObjectMessagesReaded,
      setCurrentChatOid,
      activeOid,
    } = this.props;
    setCurrentChatOid(activeOid);
    getObjectVoiceMails(
      { oid: activeOid, withText: true, withHidden: false, limit: Const.CHAT_PRELOAD_LIMIT },
      (pr, packet) => {
        this.setState({ isProgress: false });
        const { data } = packet;
        if (0 === data.result) {
          setChatForObject(activeOid, data.list);
          clearMessageBadgeCounter();
          resetMessageBadge();
          markObjectMessagesReaded(activeOid);
        }
      }
    );
  }

  scrollToEnd() {
    this.chatList.scrollToIndex({
      animated: true,
      index: 0,
    });
  }

  async uploadVoiceAsync(uri, apiUrl) {
    let uriParts = uri.split('.');
    let fileType = uriParts[uriParts.length - 1];

    let formData = new FormData();
    formData.append('audio', {
      uri,
      name: `audio.${fileType}`,
      type: `audio/${fileType}`,
    });

    let options = {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        'Cache-Control': 'no-store',
      },
    };

    //console.log(options);

    return fetch(apiUrl, options);
  }

  async recordAudio() {
    RecorderCtl.recordAudio({
      limitMilis: Const.MAX_AUDIO_MESSAGE_LEN,
      onStart: () => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(this.state.redDot, {
              toValue: 0.3,
              duration: 500,
            }),
            Animated.timing(this.state.redDot, {
              toValue: 1.0,
              duration: 500,
            }),
          ]),
          {
            iterations: -1,
          }
        ).start();
        this.setState({ isRecording: true, recordingLabel: '0:00' });
      },
      onStop: () => {
        this.setState({ isRecording: false, recordingLabel: '0:00' });
      },
      onUpdate: (status) => {
        this.setState({ recordingLabel: Utils.makeDurationLabel(status.durationMillis) });
      },
      onSuccess: (filename, durationMillis) => {
        this.setState({ isRecording: false, locked: true, recordingLabel: '0:00' });
        this.uploadFile(filename, durationMillis);
      },
    });
  }

  async uploadFile(filename, durationMillis) {
    const {
      activeOid,
      makeObjectVoiceMailToken,
      appendVoiceMessageToObjectChat,
      objects,
      showAlert,
    } = this.props;
    const _scrollToEnd = this.scrollToEnd.bind(this);
    var obj = objects[activeOid + ''];

    if (!obj) {
      this.setState({ alertText: L('add_child_message'), showAlert: true });
      return;
    }

    const arr = filename.split('.');
    const format = arr[arr.length - 1];
    makeObjectVoiceMailToken(activeOid, async (pr, packet) => {
      const { data } = packet;
      //console.log(data);
      if (0 === data.result) {
        const uploadUrl = data.voiceMailUploadUrl + '/' + format;
        //console.log(uploadUrl);
        try {
          let uploadResponse, uploadResult;
          uploadResponse = await this.uploadVoiceAsync(filename, uploadUrl);
          //console.log(await uploadResponse.text());
          uploadResult = await uploadResponse.json();
          //console.log(uploadResult);
          appendVoiceMessageToObjectChat(activeOid, false, uploadResult.mailId, durationMillis);
        } catch (e) {
          console.log(e);
        }
        setTimeout(_scrollToEnd, 0);
      } else if (activeOid === 1) {
        this.setState({ alertText: L('add_child_message'), showAlert: true });
      } else {
        showAlert(true, L('error'), L('failed_to_send_message', [data.error]));
      }
      this.setState({ locked: false });
    });
  }

  sendSticker(stickerId) {
    const {
      sendTextMessageToObject,
      appendTextMessageToObjectChat,
      activeOid,
      objects,
      showAlert,
    } = this.props;
    const message = `{{${stickerId}}}`;
    var obj = objects[activeOid + ''];

    if (!obj) {
      this.setState({ alertText: L('add_child_message'), showAlert: true });
      return;
    }

    if (message.length < 1) {
      return;
    }

    console.log('send message to oid=' + activeOid + ': [' + message + ']');
    this.setState({ locked: true });
    const input = this.textInput;
    const _this = this;
    const _scrollToEnd = this.scrollToEnd.bind(this);
    sendTextMessageToObject(activeOid, message, function (pr, packet) {
      _this.setState({ locked: false });
      const { data } = packet;
      if (0 === data.result) {
        _this.setState({ message: '' });
        appendTextMessageToObjectChat(activeOid, false, data.mailId, message);
        setTimeout(_scrollToEnd, 0);
      } else if (activeOid === 1) {
        _this.setState({ alertText: L('add_child_message'), showAlert: true });
      } else {
        showAlert(true, L('error'), L('failed_to_send_message', [data.error]));
      }
    });
  }

  sendTextMessage() {
    const {
      sendTextMessageToObject,
      appendTextMessageToObjectChat,
      activeOid,
      objects,
      showAlert,
    } = this.props;
    const { message } = this.state;
    var obj = objects[activeOid + ''];

    if (!obj) {
      this.setState({ alertText: L('add_child_message'), showAlert: true });
      return;
    }

    if (message.length < 1) {
      return;
    }

    console.log('send message to oid=' + activeOid + ': [' + message + ']');
    this.setState({ locked: true });
    const input = this.textInput;
    const _this = this;
    const _scrollToEnd = this.scrollToEnd.bind(this);
    sendTextMessageToObject(activeOid, message, function (pr, packet) {
      _this.setState({ locked: false });
      const { data } = packet;
      if (0 === data.result) {
        _this.setState({ message: '', showKeyboard: true });
        appendTextMessageToObjectChat(activeOid, false, data.mailId, message);
        setTimeout(_scrollToEnd, 0);
      } else if (activeOid === 1) {
        _this.setState({ alertText: L('add_child_message'), showAlert: true });
      } else {
        showAlert(true, L('error'), L('failed_to_send_message', [data.error]));
      }
    });
  }

  renderItem(item, photoUrl, oid) {
    const retrieveSticker = (text) => {
      const regex = /\{\{(\d*)\}\}/gm;
      const str = text;
      let m;

      while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }

        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
          console.log(`Found match, group ${groupIndex}: ${match}`);
        });
        return m && m[1];
      }
    };
    const data = item.item;
    console.log(data);
    const ts = Utils.makeElapsedDate(new Date(data.ts));
    if (data.text) {
      const sticker = retrieveSticker(data.text);
      console.log('sticker:', sticker, typeof sticker);

      if (parseInt(sticker) >= 0) {
        const stickerObject = stickers.find((value) => value.id === sticker);
        let stickerImage;
        if (stickerObject) {
          stickerImage = stickerObject?.sticker;
          return data.inbound ? (
            <ChatBubbleTextTheir sticker={stickerImage} ts={ts} imageSource={photoUrl} />
          ) : (
            <ChatBubbleTextMy sticker={stickerImage} ts={ts} delivered={data.delivered} readed={data.readed} />
          );
        }
      }
      return data.inbound ? (
        <ChatBubbleTextTheir text={data.text} ts={ts} imageSource={photoUrl} />
      ) : (
        <ChatBubbleTextMy text={data.text} ts={ts} delivered={data.delivered} readed={data.readed} />
      );
    }

    return data.inbound ? (
      <ChatBubbleVoiceTheir
        onPlaying={this.onPlaying.bind(this)}
        onStop={this.onStop.bind(this)}
        text={data.text}
        ts={ts}
        imageSource={photoUrl}
        duration={data.duration}
        mailId={data.mailId}
        objectId={oid}
      />
    ) : (
      <ChatBubbleVoiceMy
        onPlaying={this.onPlaying.bind(this)}
        onStop={this.onStop.bind(this)}
        text={data.text}
        ts={ts}
        duration={data.duration}
        mailId={data.mailId}
        objectId={oid}
        delivered={data.delivered}
        readed={data.readed}
      />
    );
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

  updateSize = (height) => {
    this.setState({
      height,
    });
  };

  onSupportPress = () => {
    const { objects, userId } = this.props;
    const url = Const.compileSupportUrl(userId, objects);

    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          const instructionsUrl = L('instructions_url');
          Linking.openURL(instructionsUrl);
        } else {
          return Linking.openURL(url);
        };
      })
      .catch((err) => console.warn('An error occurred', err));
  };

  render() {
    const { authorized, chat, activeOid, navigation, objects } = this.props;
    const { isProgress, locked, slider, opacity, redDot } = this.state;

    let objectChat = chat[activeOid + ''];
    if (!objectChat) {
      objectChat = {
        messages: [],
      };
    }

    const object = objects[activeOid + ''];
    let photoUrl = null;

    if (object && object.photoUrl) {
      photoUrl = object.photoUrl;
    }

    const transform = { transform: slider.getTranslateTransform() };
    const isFromScreen = navigation.getParam !== undefined ? navigation.getParam('isFromScreen') : false;

    return (
      <View style={{
        height: '100%',
        backgroundColor: 'white',
      }}>
        {/* {!isFromScreen &&
          <LinearGradient
            style={styles.header}
            colors={['#ef4c77', '#fe6f5f', '#ff8048']}
            start={[0, 0]}
            end={[1, 0]}
            locations={[0, 0.5, 1.0]}>
            <View style={{ flex: 1 }} />
            <View style={styles.headerMiddle}>
              <Text style={styles.headerTitle}>{L('menu_chat_with_kid')}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <ShareAboutBlock
                style={{ marginRight: 10 }}
                size={32}
                color="#FFFFFF"
                onAboutPress={this.onSupportPress}
                isHeader={true} />
            </View>
          </LinearGradient>} */}
        {
          //to emit event keyboard will show we created dummy input with auto focus. As soon as it focuses on it keyboard will dismiss
          //UPDATE: this input caused keyboard on android to open and close ones, when entering chat
        }
        {/* <TextInput
          style={{ height: 0, width: 0, display: 'none' }}
          autoFocus={true}
          onFocus={() => {
            Keyboard.dismiss();
          }}></TextInput> */}
        <View style={styles.container}>
          {isProgress ? (
            <View style={styles.progress_outer}>
              <MyActivityIndicator size="large" />
            </View>
          ) : (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.chat_outer}>
                {object && (
                  <FlatList
                    ref={(element) => {
                      this.chatList = element;
                    }}
                    style={styles.list}
                    inverted
                    data={objectChat.messages}
                    extraData={chat}
                    keyExtractor={(item, index) => item.mailId + ''}
                    renderItem={(item) => (
                      <TouchableHighlight
                        underlayColor="transparent"
                        onPress={() => {
                          Keyboard.dismiss();
                          this.hideStickers();
                          this.setState({ showKeyboard: false, showSticker: false });
                        }}
                        style={{ width: '100%' }}>
                        {this.renderItem(item, photoUrl, activeOid)}
                      </TouchableHighlight>
                    )}
                  />
                )}
              </View>
            </TouchableWithoutFeedback>
          )}
          <View
            style={{
              backgroundColor: 'white',
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              paddingBottom: !isFromScreen ? height / 10 : 0,
            }}>
            <View style={{ marginVertical: 10, flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }}>
              <TouchableOpacity
                style={[{ flex: 1, alignItems: 'center' }]}
                onPress={() => {
                  const stickerShowed = this.state.showSticker;
                  if (stickerShowed) {
                    this.hideStickers();
                  } else {
                    this.showStickers();
                  }
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 40,
                    width: 40,
                    alignContent: 'center',
                  }}>
                  <Icon
                    name="emoticon-happy-outline"
                    type="material-community"
                    color={this.state.showSticker ? AppColorScheme.active : AppColorScheme.accent}
                    size={26}></Icon>
                </View>
              </TouchableOpacity>
              <TextInput
                blurOnSubmit={false}
                keyboardEventTypeShow
                value={this.state.message}
                style={{
                  flex: 10,
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  backgroundColor: '#F3F6F7',
                  borderRadius: 20,
                  marginLeft: 10,
                  opacity: this.state.isRecording ? 0 : 1,
                  height: this.state.isRecording ? 0 : 50,
                  position: this.state.isRecording ? 'absolute' : 'relative',
                  top: 0,
                  left: this.state.isRecording ? -500 : 0,
                }}
                onBlur={() => {
                  if (!this.state.showSticker) {
                    this.setState({ showKeyboard: true });
                    Animated.timing(this.state.stickersHeight, {
                      toValue: 0,
                      duration: 250,
                      easing: Easing.linear,
                    }).start();
                  }
                }}
                onFocus={() => {
                  this.setState({ showKeyboard: true }, () => {
                    this.setState({ showSticker: false });
                    Animated.timing(this.state.stickersHeight, {
                      toValue: 0,
                      duration: 0,
                    }).start();
                  });
                }}
                placeholder={L('hint_write_something')}
                underlineColorAndroid="transparent"
                editable={!locked}
                onChangeText={this.onChangeMessage.bind(this)}
                keyboardType="default"
                multiline
                onContentSizeChange={(e) => this.updateSize(e.nativeEvent.contentSize.height)}
              />
              {this.state.isRecording && (
                <Animated.View style={[styles.input_field, styles.slide_to_cancel, { opacity: opacity }]}>
                  <View style={styles.recording_timer}>
                    <Animated.View style={[styles.red_dot, { opacity: redDot }]} />
                    <Text>{this.state.recordingLabel}</Text>
                  </View>
                  <Animated.View style={transform}>
                    <Text style={styles.slide_to_cancel_text}>{L('hint_slide_to_cancel')}</Text>
                  </Animated.View>
                </Animated.View>
              )}
              {'' !== this.state.message ? (
                <TouchableOpacity
                  style={[styles.send_button, { flex: 1, alignItems: 'center', paddingHorizontal: 20 }]}
                  disabled={locked}
                  onPress={this.sendTextMessage.bind(this)}>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 100,
                      height: 40,
                      width: 40,
                      alignContent: 'center',
                      backgroundColor: AppColorScheme.accent,
                    }}>
                    <Icon style={{ textAlign: 'center' }} name="md-send" type="ionicon" color="white" size={24} />
                  </View>
                </TouchableOpacity>
              ) : (
                <View
                  style={[styles.send_button, { flex: 1, alignItems: 'center', paddingHorizontal: 20 }]}
                  disabled={locked}
                  {...this._panResponder.panHandlers}>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 100,
                      height: 40,
                      width: 40,
                      alignContent: 'center',
                      backgroundColor: AppColorScheme.accent,
                    }}>
                    <Icon iconStyle={styles.devicechat} name="ios-mic" type="ionicon" color="white" size={24} />
                  </View>
                </View>
              )}
              {this.state.locked ? (
                <MyActivityIndicator style={{ flex: 1, alignItems: 'center', paddingHorizontal: 20 }} />
              ) : null}
            </View>
            <Animated.View
              style={[
                {
                  height: this.state.stickersHeight,
                  backgroundColor: 'white',
                },
              ]}>
              {this.state.showSticker ? (
                <StickerGrid
                  onStickerPress={(id) => {
                    this.sendSticker(id);
                  }}
                  style={{ flex: 1 }}></StickerGrid>
              ) : null}
            </Animated.View>
          </View>
        </View>
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
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { controlReducer, authReducer } = state;
  const { objects, chat, activeOid } = controlReducer;
  const { userId } = authReducer;

  return {
    objects,
    chat,
    activeOid,
    userId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    sendTextMessageToObject: bindActionCreators(controlActionCreators.sendTextMessageToObject, dispatch),
    getObjectVoiceMails: bindActionCreators(controlActionCreators.getObjectVoiceMails, dispatch),
    setChatForObject: bindActionCreators(controlActionCreators.setChatForObject, dispatch),
    appendTextMessageToObjectChat: bindActionCreators(controlActionCreators.appendTextMessageToObjectChat, dispatch),
    appendVoiceMessageToObjectChat: bindActionCreators(controlActionCreators.appendVoiceMessageToObjectChat, dispatch),
    sendVoiceMailToObject: bindActionCreators(controlActionCreators.sendVoiceMailToObject, dispatch),
    makeObjectVoiceMailToken: bindActionCreators(controlActionCreators.makeObjectVoiceMailToken, dispatch),
    resetMessageBadge: bindActionCreators(controlActionCreators.resetMessageBadge, dispatch),
    clearMessageBadgeCounter: bindActionCreators(controlMiddlewareActionCreators.clearMessageBadgeCounter, dispatch),
    markObjectMessagesReaded: bindActionCreators(controlActionCreators.markObjectMessagesReaded, dispatch),
    setCurrentChatOid: bindActionCreators(controlActionCreators.setCurrentChatOid, dispatch),
    showAlert: bindActionCreators(popupActionCreators.showAlert, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatPage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  chat_outer: {
    flexGrow: 1,
    flex: 1,
  },
  list: {
    flexGrow: 1,
    flex: 1,
  },
  progress_outer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input_outer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  input_field: {
    flexGrow: 1,
    paddingRight: 10,
    paddingLeft: 10,
    maxWidth: Dimensions.get('window').width - 45,
  },
  slide_to_cancel: {
    alignItems: 'center',
  },
  slide_to_cancel_text: {
    marginLeft: 70,
  },
  send_button: {},
  progress: {},
  listContainer: {
    width: '100%',
  },
  itemContainer: {},
  recording_timer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: 10,
    top: 0,
  },
  red_dot: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: 'red',
    overflow: 'hidden',
    marginRight: 5,
  },
  locked: {
    position: 'absolute',
    right: 50,
  },
  header: {
    height: Constants.statusBarHeight + 56,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingTop: Constants.statusBarHeight,
    flexDirection: 'row',
  },
  headerMiddle: {
    flex: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontWeight: '600',
    fontSize: 16,
    color: '#FFFFFF',
  },
});
