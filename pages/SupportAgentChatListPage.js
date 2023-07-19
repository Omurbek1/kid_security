import React from 'react';
import { FlatList, Platform, StyleSheet, View, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { controlActionCreators } from '../reducers/controlRedux';
import NavigationService from '../navigation/NavigationService';
import * as Utils from '../Utils';
import DialogTextBubble from '../components/DialogTextBubble';
import { L } from '../lang/Lang';
import MyActivityIndicator from '../components/MyActivityIndicator';

class SupportAgentChatListPage extends React.Component {
  static navigationOptions = () => {
    return {
      title: L('support_requests'),
    };
  };

  state = {
    isProgress: true,
    message: '',
    locked: false,
    photoUrl: null,
    message: '',
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
    const { getDialogsToMe, setSupportDialogs, navigation } = this.props;
    const oid = navigation.getParam('oid');
    getDialogsToMe((pr, packet) => {
      this.setState({ isProgress: false });
      const { data } = packet;
      console.log(data);
      if (0 === data.result) {
        setSupportDialogs(data.list);
      }
    });
  }

  scrollToEnd() {
    this.chatList.scrollToIndex({
      animated: true,
      index: 0,
    });
  }

  gotoChat(skytag, username) {
    const { setChatWith } = this.props;
    NavigationService.navigate('SupportAgentChat', { skytag, username });
    setChatWith(skytag);
  }

  renderItem(item) {
    const data = item.item;
    const ts = Utils.makeElapsedDate(new Date(data.message.ts * 1000));
    if (data.message.text) {
      return (
        <DialogTextBubble
          text={data.message.text}
          sender={data.senderName}
          ts={ts}
          onPress={() => this.gotoChat(data.senderSkytag, data.senderName)}
        />
      );
    }
    return null;
  }

  render() {
    const { supportDialogs } = this.props;
    const { isProgress } = this.state;

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
                data={supportDialogs}
                keyExtractor={(item, index) => item.message.id + ''}
                renderItem={(item) => this.renderItem(item)}
              />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = (state) => {
  const { objects, supportDialogs } = state.controlReducer;

  return {
    objects,
    supportDialogs,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getDialogsToMe: bindActionCreators(controlActionCreators.getDialogsToMe, dispatch),
    getMyDialogs: bindActionCreators(controlActionCreators.getMyDialogs, dispatch),
    setSupportDialogs: bindActionCreators(controlActionCreators.setSupportDialogs, dispatch),
    appendSupportDialogs: bindActionCreators(controlActionCreators.appendSupportDialogs, dispatch),
    setChatWith: bindActionCreators(controlActionCreators.setChatWith, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SupportAgentChatListPage);

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
