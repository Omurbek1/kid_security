import React from 'react';
import {
  FlatList,
  Dimensions,
  Alert,
  Platform,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { controlActionCreators } from '../reducers/controlRedux';
import * as Utils from '../Utils';
import ChatBubbleTextTheir from '../components/ChatBubbleTextTheir';
import ChatBubbleTextMy from '../components/ChatBubbleTextMy';
import { Icon } from 'react-native-elements';
import { L } from '../lang/Lang';
import MyActivityIndicator from '../components/MyActivityIndicator';

class SupportAgentChatPage extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('username'),
    };
  };

  state = {
    isProgress: true,
    message: '',
    locked: false,
    photoUrl: null,
    message: '',
    height: 40,
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

  componentDidMount() {
    const { getDialogMessages, setSupportChat, navigation, objects } = this.props;
    const skytag = navigation.getParam('skytag');
    getDialogMessages(skytag, 100, -1, 'backward', (pr, packet) => {
      this.setState({ isProgress: false });
      const { data } = packet;
      if (0 === data.result) {
        setSupportChat(data.list);
      }
    });
  }

  scrollToEnd() {
    this.chatList.scrollToIndex({
      animated: true,
      index: 0,
    });
  }

  sendTextMessage() {
    const { sendMessageToUser, appendSupportChat, navigation } = this.props;
    const { message } = this.state;

    const skytag = navigation.getParam('skytag');

    if (message.length < 1) {
      return;
    }

    this.setState({ locked: true });
    const input = this.textInput;
    const _this = this;
    const _scrollToEnd = this.scrollToEnd.bind(this);
    sendMessageToUser(skytag, message, function(pr, packet) {
      _this.setState({ locked: false });
      const { data } = packet;
      if (0 === data.result) {
        _this.setState({ message: '' });
        appendSupportChat([
          {
            id: data.messageId,
            ts: new Date().getTime(),
            text: message,
            state: 0,
            myOwn: true,
          },
        ]);
        setTimeout(_scrollToEnd, 0);
      } else {
        Alert.alert(L('error'), L('failed_to_send_message', [data.error]), [{ text: 'OK', style: 'cancel' }], {
          cancellable: true,
        });
      }
    });
  }

  renderItem(item, photoUrl) {
    const data = item.item;
    if (!data.text) {
      //return null;
    }
    const ts = Utils.makeElapsedDate(new Date(data.ts * 1000));
    return !data.myOwn ? (
      <ChatBubbleTextTheir text={data.text} ts={ts} imageSource={photoUrl} />
    ) : (
      <ChatBubbleTextMy text={data.text} ts={ts} />
    );
  }

  updateSize = (height) => {
    this.setState({
      height,
    });
  };

  render() {
    const { authorized, supportChat, navigation } = this.props;
    const { isProgress, locked, photoUrl } = this.state;

    return (
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={'ios' === Platform.OS ? 0 : 80}
        style={{ flex: 1 }}>
        <View style={styles.container}>
          {isProgress ? (
            <View style={styles.progress_outer}>
              <MyActivityIndicator size="large" />
            </View>
          ) : (
            <View style={styles.chat_outer}>
              <FlatList
                ref={(element) => {
                  this.chatList = element;
                }}
                style={styles.list}
                inverted
                data={supportChat}
                keyExtractor={(item, index) => item.id + ''}
                renderItem={(item) => this.renderItem(item, photoUrl)}
              />
            </View>
          )}
          <View style={styles.input_outer}>
            <TextInput
              value={this.state.message}
              style={styles.input_field}
              placeholder={L('hint_write_something')}
              underlineColorAndroid="transparent"
              editable={!locked}
              onChangeText={this.onChangeMessage.bind(this)}
              multiline
              onContentSizeChange={(e) => this.updateSize(e.nativeEvent.contentSize.height)}
            />
            <TouchableOpacity style={styles.send_button} disabled={locked} onPress={this.sendTextMessage.bind(this)}>
              <Icon iconStyle={styles.devicechat} name="md-send" type="ionicon" color="#FF666F" size={28} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = (state) => {
  const { objects, supportChat } = state.controlReducer;

  return {
    objects,
    supportChat,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    sendMessageToUser: bindActionCreators(controlActionCreators.sendMessageToUser, dispatch),
    getDialogMessages: bindActionCreators(controlActionCreators.getDialogMessages, dispatch),
    setDialogMessageReaded: bindActionCreators(controlActionCreators.setDialogMessageReaded, dispatch),
    setSupportChat: bindActionCreators(controlActionCreators.setSupportChat, dispatch),
    appendSupportChat: bindActionCreators(controlActionCreators.appendSupportChat, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SupportAgentChatPage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  input_field: {
    flexGrow: 1,
    paddingRight: 10,
    paddingLeft: 10,
    maxWidth: Dimensions.get('window').width - 45,
  },
  send_button: {
    margin: 10,
  },
  progress: {},
  listContainer: {
    width: '100%',
  },
  itemContainer: {},
});
