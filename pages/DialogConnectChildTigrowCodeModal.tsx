import { L } from '@lang';
import React from 'react';
import { Modal, Text, StyleSheet, View, TouchableOpacity, Linking, Share, Dimensions } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Const from '../Const';
import * as Utils from '../Utils';
import MyActivityIndicator from '../components/MyActivityIndicator';
import * as Metrica from '../analytics/Analytics';
import { controlActionCreators } from 'reducers/controlRedux';
import * as RemoteConfig from '../analytics/RemoteConfig';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';

import Clipboard from '@react-native-clipboard/clipboard';
import Close from '../img/icons/close.svg';
import PopupImage from '../img/add_phone_page_popup.svg';
import { APIService } from 'Api';
import CloseBack from '../img/close.svg';

import Rest from 'Rest';
import { RestAPIService } from '../RestApi';
import { firebaseAnalitycsLogEvent } from 'analytics/firebase/firebase';

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

type Props = {
  visible: boolean;
  onClose: () => void;
  onHide: () => void;
  objects: {};
  userId: number;
};
interface State {
  code: number;
  timer: number;
  codeStatus: string;
  onCodeTapAction: string;
  visible: boolean;
  copiVisible: boolean;
}

class DialogConnectChildTigrowCodeModal extends React.Component<Props, State> {
  private timerID: number | undefined | string;
  private reqChildCode: number | undefined;

  onChatWithTechSupport = async () => {
    const params = {
      modal_name: 'SendLinkToTigrow',
      screen_name: 'mapScreenDemo',
      object: 'Support',
    };
    firebaseAnalitycsLogEvent('tap', params, true);

    const { objects, userId } = this.props;

    const url = Const.compileSupportUrl(userId, objects);
    console.log(url);
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          const instructionsUrl = L('instructions_url');
          Linking.openURL(instructionsUrl);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.warn('Error opening chat with tech support', err));
  };

  constructor(props) {
    super(props);
    this.state = {
      code: null,
      timer: 0,
      codeStatus: null,
      onCodeTapAction: null,
      visible: false,
      copiVisible: false,
    };
  }

  componentWillUnmount = async () => {
    const { addPhoneCode, stopAddPhoneTracker, clearAddPhoneCode } = this.props as any;
    await clearInterval(this.timerID);
    await clearInterval(this.reqChildCode);
    await deactivateKeepAwake();
    if (addPhoneCode) {
      await setTimeout(() => {
        clearAddPhoneCode();
        stopAddPhoneTracker();
      }, 0);
    }
  };

  componentDidUpdate() {
    if (APIService.baseHeader.Username && this.reqChildCode && !this.state.code) {
      clearInterval(this.reqChildCode);
    }
  }

  componentDidMount = () => {
    // const params = {
    //   modal_name: 'connectChildCode',
    //   screen_name: 'mapScreenDemo',
    // };
    // firebaseAnalitycsLogEvent('modal_open', params as never, true);

    //INTERVAL TO KEEP TRACK OF CHILDCODE STATUS
    this.timerID = setInterval(() => this.codeCheckTick(), 1000) as any;

    //INTERVAL TO REQUEST CHILD CODE IF API ISN't INITIALIZED
    //AS SOON AS API RE-INITIALIZED KILLING THIS INTERVAL
    //IF API INITIALIZED JUST REQUESTING CHILD CODE
    this.getChildCode();

    setTimeout(() => {
      // addPhoneTracker();
      activateKeepAwake();
    }, 0);

    RemoteConfig.logExperimentStarted(EXPERIMENT.experiment_id, EXPERIMENT.onCodeTapAction).then((onCodeTapAction) => {
      console.log(' == EXP: onCodeTapAction=' + onCodeTapAction);
      Rest.get().debug({ EXP: 'onCodeTapAction', onCodeTapAction });
      this.setState({ onCodeTapAction });
    });

    RemoteConfig.logExperimentStarted(EXPERIMENT.experiment_id, EXPERIMENT.onCodeTapAction).then((onCodeTapAction) => {
      console.log(' == EXP: onCodeTapAction=' + onCodeTapAction);
      Rest.get().debug({ EXP: 'onCodeTapAction', onCodeTapAction });
      this.setState({ onCodeTapAction });
    });
  };

  //REQUEST CHILD CODE
  async getChildCode() {
    if (!this.state.code || !this.state.codeStatus) {
      await RestAPIService.getChildCode()
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

  onArrowClick = () => {
    Metrica.event(EXPERIMENT.screenAddPhoneArrowDownPress);
    this.experimentShare();
  };

  onCodeClick = () => {
    Clipboard.setString(L('please_install_app_to_kid_phone', [Utils.getKidAppUrl(), this.state.code]));
    Metrica.event(EXPERIMENT.screenAddPhoneCodePress);
    // this.experimentShare();
    this.setState({ copiVisible: true });
    this.setState({ visible: false });
  };

  onPopupCloseClick = () => {
    this.setState({ copiVisible: false });
  };

  render() {
    const { phoneLinked } = this.props as any;
    return (
      <>
        <Modal animationType="slide" transparent={true} visible={this.props.visible}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity onPress={this.props.onClose}>
                <CloseBack style={styles.backicon} />
                {/* <Image source={require('../img/arrow_page_left.png')} style={styles.backicon} /> */}
              </TouchableOpacity>
              <Text style={styles.headertext}>{L('on_kid_phone')}</Text>
              <View style={styles.appicontext}>
                <Text>
                  <Text style={{ marginLeft: 40 }}>{'\u2022'} </Text>{' '}
                  <Text style={styles.followLink}>{L('follow_link_to_install_tigrow')}</Text>
                </Text>
                <Text>
                  <Text>{'\u2022'} </Text> <Text style={styles.followLink}> {L('enter_code')} </Text>
                </Text>
              </View>
              <View style={styles.kidscode}>
                <TouchableOpacity onPress={this.onCodeClick}>
                  <Text style={styles.kidscodetext}>
                    {this.state.code && this.state.codeStatus !== 'REDEEMED' && !phoneLinked ? (
                      <Text>{this.state.code}</Text>
                    ) : (
                      <MyActivityIndicator size="large" />
                    )}
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.desc}>{L('link_code_description')}</Text>

              <TouchableOpacity onPress={this.onChatWithTechSupport}>
                <Text style={styles.contact_support}> {L('contact_support_via_chat')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal visible={this.state.copiVisible} animationType="slide" transparent={true} style={styles.popup}>
          <View style={styles.centeredViewPop}>
            <View style={styles.popupConteiner}>
              <TouchableOpacity style={styles.popupCloseBtn} onPress={this.onPopupCloseClick}>
                <Close />
              </TouchableOpacity>
              <PopupImage style={styles.image} />
              <Text style={styles.popupTextFirst}>{L('code_link_copied_1')}</Text>
              <Text style={styles.popupTextSecond}>{L('send_link_to_child_1')}</Text>
            </View>
          </View>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  const { addPhoneCode, phoneLinked, linkedOid, objects } = state.controlReducer;
  const { userProps, userId } = state.authReducer;

  return {
    objects,
    addPhoneCode,
    phoneLinked,
    linkedOid,
    userProps,
    userId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addPhoneTracker: bindActionCreators(controlActionCreators.addPhoneTracker, dispatch),
    setConfigureChildPaneVisible: bindActionCreators(controlActionCreators.setConfigureChildPaneVisible, dispatch),
    stopAddPhoneTracker: bindActionCreators(controlActionCreators.stopAddPhoneTracker, dispatch),
    clearAddPhoneCode: bindActionCreators(controlActionCreators.clearAddPhoneCode, dispatch),
  };
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    top: -20,

    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  centeredViewPop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
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
    marginTop: -100,
    marginLeft: 0,
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
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 40,
    padding: 35,
    width: 340,
    height: Dimensions.get('window').width - 550,
    // height: 550,
    alignItems: 'center',
    // shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  appicon: {
    width: 285,
    padding: 20,
    height: 91,
    marginTop: 50,
  },
  appicontext: {
    width: '100%',
    alignContent: 'center',
    fontSize: 14,
    marginTop: 10,
    marginLeft: 50,
  },
  textList: {
    marginLeft: 40,
  },
  followLink: {
    marginLeft: 95,
    color: '#303030',
  },
  backicon: {
    marginRight: 270,
    marginTop: -5,
  },
  headertext: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 30,
    color: '#303030',
  },
  kidscode: {
    width: 188,
    height: 54,
    borderWidth: 1,
    borderColor: '#FF4D77',
    textAlign: 'center',
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 20,
  },
  kidscodetext: {
    fontSize: 30,
    color: '#FF4D77',
    marginTop: 5,
    fontWeight: 'bold',
  },
  desc: {
    width: 320,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '400',
    lineHeight: 17,
    marginBottom: 60,
    color: '#606060',
  },
  contact_support: {
    marginTop: 70,
    textDecorationLine: 'underline',
    color: '#606060',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DialogConnectChildTigrowCodeModal);
