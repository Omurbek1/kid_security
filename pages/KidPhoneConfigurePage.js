import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View, Image, SafeAreaView, Linking } from 'react-native';
import WebView from 'react-native-webview';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Icon } from 'react-native-elements';
import remoteConfig from '@react-native-firebase/remote-config';

import { controlActionCreators } from '../reducers/controlRedux';
import NavigationService from '../navigation/NavigationService';
import { L } from '../lang/Lang';
import * as Utils from '../Utils';
import UserPrefs from '../UserPrefs';
import { getYoutubeVideoLink } from '../res/raw/youtubeVideoLinks';
import Const from '../Const';

class KidPhoneConfigurePage extends React.Component {
  static navigationOptions = () => {
    return {
      header: null,
    };
  };
  state = {
    isProgress: false,
    link: '',
  };

  componentDidMount() {
    this.initLink();
  }

  openInstructions = async () => {
    const instructionsUrl = L('instructions_url');
    Linking.openURL(instructionsUrl);
  };

  initLink = async () => {
    const { navigation, objects } = this.props;
    const oid = navigation.getParam('oid');
    const obj = objects[oid + ''];
    const { states } = obj;

    const lang = await UserPrefs.getLanguage();
    const link = await getYoutubeVideoLink(lang, states.deviceModel, states.osVersion);
    //const link = await getYoutubeVideoLink(lang, 'samsung', '8.0.0');
    this.setState({ link });
  };

  contactViaChat = async () => {
    const supportChatUrl = remoteConfig().getValue('support_chat_url').asString();
    const url = supportChatUrl + encodeURIComponent(L('instruction_doesnt_fit'));
    Linking.openURL(url);
  };

  understoodButton = async () => {
    const { navigation, objects, setConfigurePageNotShown } = this.props;
    const oid = navigation.getParam('oid');
    const obj = objects[oid + ''];
    const alerts = Utils.getConfigurationAlets(obj);
    setConfigurePageNotShown(false);
    alerts.hasAlert ? NavigationService.navigate('KidPhoneProblems', { oid: oid }) : NavigationService.back();
  };

  render() {
    const { navigation, objects } = this.props;
    const { link } = this.state;
    const oid = navigation.getParam('oid');
    const obj = objects[oid + ''];
    const alerts = Utils.getConfigurationAlets(obj);

    //const langIgnore = ['ro','hy','nl','pt'];
    //const ignoreLang = !!langIgnore.find(item=>item===UserPrefs.all.language);

    return (
      //return !ignoreLang&&(
      <SafeAreaView style={styles.container}>
        <View style={styles.issues}>
          <Icon style={styles.no_issues_icon} type="evilicon" name="exclamation" color="red" size={90} />
          <Text style={styles.big_alert_text}>{L('kid_phone_is_not_configured')}</Text>

          <View style={{ borderColor: '#000', borderBottomWidth: 1 }} />
          <View style={styles.problems}>
            <Text style={styles.medium_text}>{L('configure_kid_app_by_instruction')}</Text>
            <View style={styles.videoBlock}>
              {link ? (
                <WebView
                  javaScriptEnabled
                  domStorageEnabled
                  allowsFullscreenVideo
                  startInLoadingState
                  source={{ uri: 'https://www.youtube.com/embed/' + link }}
                />
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    this.openInstructions();
                  }}>
                  <Image
                    resizeMode="contain"
                    style={{ width: '100%', height: '100%' }}
                    source={require('../img/ic_youtube_video.png')}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        <TouchableOpacity color="white" style={[styles.button]} onPress={() => this.understoodButton()}>
          <View style={styles.button_inner}>
            <Text style={styles.button_text}>{L('i_configured')}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ backgroundColor: 'white', marginVertical: 10 }}
          onPress={() => this.contactViaChat()}>
          <Text style={styles.support_text}>{L('instruction_doesnt_fit')}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  const { objects } = state.controlReducer;

  return {
    objects,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getObjectEvents: bindActionCreators(controlActionCreators.getObjectEvents, dispatch),
    setObjectEventList: bindActionCreators(controlActionCreators.setObjectEventList, dispatch),
    clearObjectEventList: bindActionCreators(controlActionCreators.clearObjectEventList, dispatch),
    setConfigurePageNotShown: bindActionCreators(controlActionCreators.setConfigurePageNotShown, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(KidPhoneConfigurePage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'flex-start',
    flexDirection: 'column',
    backgroundColor: 'white',
    paddingTop: 20,
  },
  issues: {
    flex: 1,
    justifyContent: 'flex-start',
    width: '100%',
    alignContent: 'flex-start',
    flexDirection: 'column',
  },
  button: {
    marginVertical: 5,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 230,
    height: 45,
    backgroundColor: 'red',
    borderRadius: 23,
  },
  button_text: {
    color: '#fff',
    paddingRight: 10,
  },
  support_text: {
    color: '#000',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  button_inner: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
  },
  big_alert: {
    width: 90,
    height: 90,
  },
  big_alert_text: {
    padding: 10,
    textAlign: 'center',
    color: 'red',
    fontWeight: 'bold',
    fontSize: 26,
  },
  medium_text: {
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold',
    fontSize: 20,
  },
  big_green_text: {
    padding: 10,
    textAlign: 'center',
    color: 'green',
    fontWeight: 'bold',
    fontSize: 28,
  },
  hint: {
    textAlign: 'center',
    padding: 5,
  },
  problems: {
    backgroundColor: 'white',
    flex: 1,
    alignSelf: 'center',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    width: '80%',
    padding: 10,
  },
  videoBlock: {
    marginVertical: 20,
    width: '100%',
    // height: 200,
    aspectRatio: 4 / 3,
    backgroundColor: '#000',
  },
});
