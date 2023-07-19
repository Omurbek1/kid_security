import React from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { controlActionCreators } from '../reducers/controlRedux';
import { authActionCreators } from '../reducers/authRedux';
import { ActionCreators as WsActionCreators } from '../wire/WsMiddleware';
import NavigationService from '../navigation/NavigationService';
import { Share } from 'react-native';
import * as Utils from '../Utils';
import { LinearGradient } from 'expo-linear-gradient';
import { L } from '../lang/Lang';
import MyActivityIndicator from '../components/MyActivityIndicator';
import { Ionicons } from '@expo/vector-icons';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import { APIService } from '../Api';
import { getHeader } from '../shared/getHeader';
import * as RemoteConfig from '../analytics/RemoteConfig';
import * as Metrica from '../analytics/Analytics';
import Clipboard from '@react-native-clipboard/clipboard';
import Rest from '../Rest';
import Dialog from 'react-native-popup-dialog';
import Close from '../img/icons/close.svg';
import PopupImage from '../img/add_phone_page_popup.svg';
import { RestAPIService } from '../RestApi';

const EXPERIMENT = {
  experiment_id: 'ChildConnect001',
  onCodeTapAction: 'onCodeTapAction',
  noAction: 'noAction',
  codeCopiedToClipboardMessage: 'codeCopiedToClipboardMessage',
  systemDialog: 'systemDialog',
  screenAddPhoneArrowDownPress: 'screenAddPhoneArrowDownPress',
  screenAddPhoneCodePress: 'screenAddPhoneCodePress',
  screenAddPhoneConnectChildBtnPress: 'screenAddPhoneConnectChildBtnPress',
};

class AddPhonePage extends React.Component {
  static navigationOptions = () => {
    return {
      ...getHeader({ title: L('connect_child'), noBackground: true }),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      code: null,
      timer: 0,
      codeStatus: null,
      onCodeTapAction: null,
      visible: false,
    };
  }

  componentWillUnmount = () => {
    const { addPhoneCode, stopAddPhoneTracker, clearAddPhoneCode } = this.props;
    clearInterval(this.timerID);
    clearInterval(this.reqChildCode);
    deactivateKeepAwake();
    if (addPhoneCode) {
      setTimeout(() => {
        clearAddPhoneCode();
        stopAddPhoneTracker();
      }, 0);
    }
  };

  componentDidUpdate(nextProps) {
    if (APIService.baseHeader.Username && this.reqChildCode && !this.state.code) {
      clearInterval(this.reqChildCode);
    }

    //CHILD CODE ACTIONS
    const { phoneLinked, linkedOid, navigation, setConfigureChildPaneVisible } = this.props;

    if ((this.state.codeStatus === 'REDEEMED' && nextProps.linkedOid) || (nextProps.linkedOid && linkedOid)) {
      const setActiveOidAndCenter = navigation.getParam('setActiveOidAndCenter');
      const backTo = navigation.getParam('backTo');
      const forceReplace = navigation.getParam('forceReplace');
      const disableBackButton = navigation.getParam('disableBackButton');
      console.log('===== inited rcv props: ', forceReplace, backTo);
      setTimeout(async () => {
        console.log(' add phone page > object name page');
        NavigationService.forceReplace('ObjectName', {
          requireInput: true,
          backTo: backTo ? backTo : 'Main',
          forceReplace,
          disableBackButton,
          oid: nextProps.linkedOid,
          offerPlacesSetup: true,
          displayConfigureChildPane: true,
        });
        if (setActiveOidAndCenter) {
          setActiveOidAndCenter(nextProps.linkedOid);
        }
      }, 0);
      // this.bringToAddChildPage(setActiveOidAndCenter, disableBackButton, forceReplace, nextProps, backTo);
    } else if (this.state.codeStatus === 'REDEEMED' && !linkedOid) {
      setTimeout(async () => {
        NavigationService.forceReplace('Main');
      }, 0);
    }
  }

  componentDidMount = () => {
    const { addPhoneTracker, navigation, linkedOid } = this.props;

    //INTERVAL TO KEEP TRACK OF CHILDCODE STATUS
    this.timerID = setInterval(() => this.codeCheckTick(), 1000);

    //INTERVAL TO REQUEST CHILD CODE IF API ISN't INITIALIZED
    //AS SOON AS API RE-INITIALIZED KILLING THIS INTERVAL
    //IF API INITIALIZED JUST REQUESTING CHILD CODE
    this.getChildCode();

    setTimeout(() => {
      // addPhoneTracker();
      activateKeepAwake();
    }, 0);

    const backTo = navigation.getParam('backTo');
    const forceReplace = navigation.getParam('forceReplace');
    const disableBackButton = navigation.getParam('disableBackButton');
    console.log('===== inited add phone page: ', forceReplace, backTo, disableBackButton);
    StatusBar.setBarStyle('light-content');

    RemoteConfig.logExperimentStarted(EXPERIMENT.experiment_id, EXPERIMENT.onCodeTapAction).then((onCodeTapAction) => {
      console.log(' == EXP: onCodeTapAction=' + onCodeTapAction);
      Rest.get().debug({ EXP: 'onCodeTapAction', onCodeTapAction });
      this.setState({ onCodeTapAction });
    });
  };

  //REQUEST CHILD CODE
  getChildCode() {
    if (!this.state.code || !this.state.codeStatus) {
      RestAPIService.getChildCode()
        .then((res) => this.setState({ code: res.code }))
        .catch((err) => console.log('Error getting child code', err));
    }
  }

  //CHECKING CHILD CODE STATUS
  codeCheckTick() {
    if (this.state.code) {
      RestAPIService.checkChildCode(this.state.code)
        .then((res) => this.setState({ codeStatus: res.status }))
        .catch((err) => console.log('Error checking child code', err));
    }
  }

  experimentShare = () => {
    switch (this.state.onCodeTapAction) {
      case EXPERIMENT.codeCopiedToClipboardMessage:
        Clipboard.setString(L('please_install_app_to_kid_phone', [Utils.getKidAppUrl(), this.state.code]));
        this.setState({ visible: true });
        break;
      case EXPERIMENT.systemDialog:
        this.shareLinkViaSystemDialog();
        break;
    }
  };

  shareLinkViaSystemDialog = () => {
    Share.share(
      {
        message: L('please_install_app_to_kid_phone', [Utils.getKidAppUrl(), this.state.code]),
      },
      {}
    );
  };

  onShareLink = () => {
    Metrica.event(EXPERIMENT.screenAddPhoneConnectChildBtnPress);
    this.shareLinkViaSystemDialog();
  };

  onDemoPress = () => {
    const { setDemo, connect, disconnect } = this.props;

    disconnect(false);
    setTimeout(() => {
      connect(Utils.getServerUrl());
    }, 500);
    setDemo(true);
    NavigationService.forceReplace('Main');
  };

  onArrowClick = () => {
    Metrica.event(EXPERIMENT.screenAddPhoneArrowDownPress);
    this.experimentShare();
  };

  onCodeClick = () => {
    Metrica.event(EXPERIMENT.screenAddPhoneCodePress);
    this.experimentShare();
    Clipboard.setString(L('please_install_app_to_kid_phone', [Utils.getKidAppUrl(), this.state.code]));
  };

  onPopupCloseClick = () => {
    this.setState({ visible: false });
  };

  render() {
    const { linkedOid, addPhoneCode, phoneLinked } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.page_header}>
          <LinearGradient
            style={styles.gradient}
            colors={['#ef4c77', '#fe6f5f', '#ff8048']}
            start={[0, 1]}
            end={[1, 0]}
            locations={[0, 0.5, 1.0]}
          />
          <View style={styles.image_outer}>
            <Image source={require('../img/ic_kids.png')} style={styles.hdr_image} />
          </View>
          <Text style={styles.hdr_big}>{L('add_child_1')}</Text>
          <Text style={styles.hdr_small}>{L('add_child_2')}</Text>
        </View>

        <View style={styles.code_outer}>
          <TouchableOpacity style={styles.code_arrow} onPress={this.onArrowClick}>
            <Ionicons name="arrow-down" color="black" size={28} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.code_content} onPress={this.onCodeClick}>
            <Text style={styles.add_text}>{L('and_type_code')}</Text>
            {this.state.code && this.state.codeStatus !== 'REDEEMED' && !phoneLinked ? (
              <Text style={[styles.bigText]}>{this.state.code}</Text>
            ) : (
              <MyActivityIndicator size="large" />
            )}
            {/* {this.state.code ? null : <MyActivityIndicator size="large" />}
            {this.state.codeStatus === 'REDEEMED' ? <MyActivityIndicator size="large" /> : null} */}
          </TouchableOpacity>
        </View>

        <View style={styles.button_outer}>
          <TouchableOpacity color="white" style={styles.button} onPress={this.onShareLink.bind(this)}>
            <View style={styles.button_inner}>
              <Text style={styles.button_text}>{L('menu_add_child')}</Text>
              <Ionicons name="share-social" color="white" size={22} />
            </View>
          </TouchableOpacity>
        </View>
        <Dialog visible={this.state.visible} style={styles.popup} onTouchOutside={this.onPopupCloseClick}>
          <View style={styles.popupConteiner}>
            <TouchableOpacity style={styles.popupCloseBtn} onPress={this.onPopupCloseClick}>
              <Close />
            </TouchableOpacity>
            <PopupImage style={styles.image} />
            <Text style={styles.popupTextFirst}>{L('code_link_copied_1')}</Text>
            <Text style={styles.popupTextSecond}>{L('send_link_to_child_1')}</Text>
          </View>
        </Dialog>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { addPhoneCode, phoneLinked, linkedOid, objects, childAddCode } = state.controlReducer;

  return {
    objects,
    addPhoneCode,
    phoneLinked,
    linkedOid,
    //childAddCode,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addPhoneTracker: bindActionCreators(controlActionCreators.addPhoneTracker, dispatch),
    //addPhoneTracker2: bindActionCreators(controlActionCreators.addPhoneTracker2, dispatch),
    setConfigureChildPaneVisible: bindActionCreators(controlActionCreators.setConfigureChildPaneVisible, dispatch),
    stopAddPhoneTracker: bindActionCreators(controlActionCreators.stopAddPhoneTracker, dispatch),
    clearAddPhoneCode: bindActionCreators(controlActionCreators.clearAddPhoneCode, dispatch),
    setDemo: bindActionCreators(authActionCreators.setDemo, dispatch),
    connect: bindActionCreators(WsActionCreators.connect, dispatch),
    disconnect: bindActionCreators(WsActionCreators.disconnect, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddPhonePage);

const styles = StyleSheet.create({
  popupCloseBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  popup: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupConteiner: {
    alignItems: 'center',
    width: Dimensions.get('window').width - 64,
    padding: 24,
    paddingTop: 40,
    backgroundColor: '#FFFFFF',
  },
  image: {
    width: 68,
    height: 68,
    marginBottom: 24,
  },
  popupTextFirst: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    maxWidth: 264,
    marginBottom: 12,
    color: '#303030',
  },
  popupTextSecond: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'normal',
    maxWidth: 264,
    color: '#303030',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  demo_container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'column',
  },
  text: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 5,
    textAlign: 'center',
    fontSize: 20,
  },
  share_hint: {
    padding: 20,
    paddingTop: 30,
    paddingBottom: 5,
    textAlign: 'center',
  },
  bigText: {
    paddingTop: 0,
    fontSize: 32,
    fontFamily: 'Helvetica-Black',
    letterSpacing: 4,
    backgroundColor: 'white',
    color: '#ff4663',
    width: '100%',
  },
  logo: {
    marginTop: 20,
    maxWidth: 120,
    maxHeight: 120,
  },
  share_button: {
    marginTop: 5,
    backgroundColor: '#FF666F',
    borderRadius: 6,
  },
  try_button: {
    marginBottom: 0,
    backgroundColor: '#eb6f6f',
    borderRadius: 6,
  },

  whatsappLogo: {
    width: 50,
    height: 50,
    marginLeft: 250,
    marginTop: -42,
  },

  whatsAppTouch: {
    width: 320,
    height: 60,
    backgroundColor: '#FF666F',
    borderRadius: 6,
    alignItems: 'center',
  },
  textButton: {
    color: 'white',
    fontSize: 15,
  },
  textDiv: {
    width: 200,
    marginLeft: -60,
    marginTop: 10,
    textAlign: 'center',
  },
  page_header: {
    width: '100%',
    overflow: 'hidden',
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 20,
    flexDirection: 'column',
    alignItems: 'center',
    alignContent: 'center',
    paddingTop: 70,
    paddingBottom: 15,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  hdr_big: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  hdr_small: {
    marginTop: 10,
    fontSize: 13,
    color: 'white',
    opacity: 0.8,
  },
  hdr_image: {
    maxWidth: 200,
    resizeMode: 'contain',
    marginLeft: -25,
  },
  image_outer: {
    margin: 20,
    borderRadius: 75,
    width: 150,
    height: 150,
    backgroundColor: '#ffffff2f',
  },
  button: {
    marginTop: 0,
    marginBottom: 15,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 230,
    height: 45,
    backgroundColor: '#e04881',
    borderRadius: 23,
  },
  button_text: {
    color: 'white',
    paddingRight: 10,
  },
  button_outer: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: '100%',
    backgroundColor: '#f9f6f6',
  },
  code_outer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    alignContent: 'center',
  },
  button_inner: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
  },
  code_arrow: {
    paddingRight: 20,
  },
  code_content: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderLeftWidth: 1,
    borderLeftColor: '#e6e6e6',
    paddingLeft: 20,
  },
  add_text: {
    fontSize: 15,
    color: '#000',
    fontWeight: 'bold',
  },
});
