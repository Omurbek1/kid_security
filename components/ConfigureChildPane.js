import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, Image, Linking } from 'react-native';
import { StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { L } from '@lang';

import { Icon } from 'react-native-elements';
import Const from '../Const';
import { CustomProgressBar } from '../Utils';
import { bindActionCreators } from 'redux';
import { controlActionCreators } from '../reducers/controlRedux';
import WebView from 'react-native-webview';
import { getYoutubeVideoLink } from '../res/raw/youtubeVideoLinks';
import UserPrefs from "../UserPrefs";

const defaultProps = {
  visible: false,
  onHide: null,
};

class _ConfigureChildPane extends Component {
  state = {
    isProgress: false,
    link: '',
  };

  componentDidMount() {
    const props = { ...defaultProps, ...this.props };

    if (props.visible) {
      this.initLink();
    }
  }

  openInstructions = async () => {
    const instructionsUrl = L('instructions_url');
    Linking.openURL(instructionsUrl);
  };

  initLink = async () => {
    const { activeChild } = this.props;
    const { states } = activeChild;
    const lang = await UserPrefs.getLanguage();

    const link = await getYoutubeVideoLink(lang, states.deviceModel, states.osVersion);
    // const link = await getYoutubeVideoLink(lang, 'Samsung', '10.11.1');
    this.setState({ link });
  };

  openProgressbar = (title) => {
    this.setState({ isProgress: true, progressTitle: title });
  };

  hideProgressbar = () => {
    this.setState({ isProgress: false });
  };

  render() {
    const props = { ...defaultProps, ...this.props };
    const { link } = this.state;

    //const langIgnore = ['ro','hy','nl','pt'];
    //const ignoreLang = !!langIgnore.find(item=>item===UserPrefs.all.language);

    return props.visible ? (
      //return props.visible ? !ignoreLang&& (
      <Modal visible={props.visible} transparent={true}>
        <View pointerEvents="auto" style={styles.addPhonePane}>
          <View style={styles.addPhonePaneContent}>
            <TouchableOpacity style={styles.closeButton} onPress={props.onHide}>
              <Icon iconColor="black" name="close" type="material" size={20} />
            </TouchableOpacity>

            <Image source={require('../img/ic_warning.png')} style={styles.image} />
            <Text style={styles.text_big}>{L('configure_kid_app_properly_for_pane')}</Text>
            <View style={styles.videoBlock}>
              {link ? (
                <WebView
                  javaScriptEnabled
                  allowsFullscreenVideo
                  domStorageEnabled
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
                    source={require('../img/ic_youtube_video.png')}></Image>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <CustomProgressBar visible={this.state.isProgress} title={this.state.progressTitle} />
        </View>
      </Modal>
    ) : null;
  }
}

const mapStateToProps = (state) => {
  const { iapReady, yearlyPrice } = state.controlReducer;

  return {
    iapReady,
    yearlyPrice,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setPremiumValid: bindActionCreators(controlActionCreators.setPremiumValid, dispatch),
    setPrices: bindActionCreators(controlActionCreators.setPrices, dispatch),
  };
};

const ConfigureChildPane = connect(mapStateToProps, mapDispatchToProps)(_ConfigureChildPane);
export default ConfigureChildPane;

const styles = StyleSheet.create({
  addPhonePane: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    padding: '5%',
    paddingTop: 20 + Const.HEADER_HEIGHT,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  addPhonePaneContent: {
    flexDirection: 'column',
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderColor: '#FF666F',
    borderWidth: 0,
    borderRadius: 20,
    paddingHorizontal: 40,
    paddingVertical: 20,
    marginBottom: 5,
  },
  image: {
    width: 100,
    height: 100,
  },

  button: {
    marginTop: 15,
    marginBottom: 15,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 45,
    backgroundColor: '#FF666F',
    borderRadius: 6,
  },
  button_text: {
    color: 'white',
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    borderWidth: 1,
    borderRadius: 20,
  },
  text_big: {
    fontSize: 15,
    fontWeight: 'bold',
    paddingTop: 20,
    color: '#000',
    paddingBottom: 10,
    textAlign: 'center',
  },
  videoBlock: {
    marginTop: 20,
    marginBottom: 50,
    width: '100%',
    // height: 200,
    aspectRatio: 4 / 3,
    backgroundColor: '#000',
  },
});
