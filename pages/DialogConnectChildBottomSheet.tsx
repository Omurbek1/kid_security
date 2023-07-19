import React, { Component } from 'react';
import { Text, StyleSheet, View, ScrollView, Linking, Share, TouchableOpacity, Image, Dimensions } from 'react-native';
import Dialog from 'react-native-popup-dialog';

import Modal from 'react-native-modal';
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
import { APIService } from 'Api';
import Rest from 'Rest';
import { RestAPIService } from '../RestApi';
import Close from '../img/icons/close.svg';
import PopupImage from '../img/add_phone_page_popup.svg';
import { L } from '@lang';
import GooglePlay from '../img/playmarket.svg';
import AppStore from '../img/app_store.svg';
import Phone from '../img/bottonsheet2.svg';
import Tigrow from '../img/Tigrowsmall.svg';
import { firebaseAnalitycsLogEvent } from 'analytics/firebase/firebase';
interface ComponentProps {
  toggleModal: () => void;
  isModalVisible: boolean;
}
interface State {
  code: number;
  timer: number;
  codeStatus: string;
  onCodeTapAction: string;
  copiVisible: boolean;
  visible: boolean;
}
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

class DialogConnectChildBottomSheet extends Component<ComponentProps, State> {
  private timerID: number | undefined | string;
  private reqChildCode: number | undefined;

  onChatWithTechSupport = async () => {
    const params = {
      modal_name: 'SendLinkToTigrow',
      screen_name: 'mapScreenDemo',
      object: 'Support',
    };
    firebaseAnalitycsLogEvent('tap', params, true);

    const { objects, userId } = this.props as never;
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

  componentWillUnmount = () => {
    const { addPhoneCode, stopAddPhoneTracker, clearAddPhoneCode } = this.props as any;
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

  componentDidUpdate() {
    Clipboard;
    if (APIService.baseHeader.Username && this.reqChildCode && !this.state.code) {
      clearInterval(this.reqChildCode);
    }
  }

  componentDidMount = () => {
    //INTERVAL TO KEEP TRACK OF CHILDCODE STATUS
    this.timerID = setInterval(() => this.codeCheckTick(), 1000) as unknown as number;

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

  onArrowClick = () => {
    Metrica.event(EXPERIMENT.screenAddPhoneArrowDownPress);
    this.experimentShare();
  };

  onCodeClick = () => {
    Clipboard.setString(L('please_install_app_to_kid_phone', [Utils.getKidAppUrl(), this.state.code]));
    Metrica.event(EXPERIMENT.screenAddPhoneCodePress);
    // this.experimentShare();
    this.setState({ copiVisible: true });
  };

  onPopupCloseClick = () => {
    this.setState({ visible: false });
    this.setState({ copiVisible: false });
  };

  render() {
    const { isModalVisible, toggleModal } = this.props;
    const { phoneLinked } = this.props as any;
    return (
      <>
        <View>
          <Modal
            onBackdropPress={() => isModalVisible}
            onBackButtonPress={() => isModalVisible}
            isVisible={isModalVisible}
            swipeDirection="down"
            onSwipeComplete={toggleModal}
            animationIn="bounceInUp"
            animationOut="bounceOutDown"
            animationInTiming={500}
            animationOutTiming={500}
            backdropTransitionInTiming={100}
            backdropTransitionOutTiming={500}
            style={styles.modal}>
            <View style={{ flex: 1 }}>
              <ScrollView>
                <View style={styles.modalContent}>
                  <View style={styles.center}>
                    <View style={styles.barIcon} />
                    <Text style={styles.text}>{L('install_tigrow_instructions')}</Text>
                  </View>

                  <View>
                    <View style={styles.firstContainer}>
                      <Text style={{ fontSize: 14, marginLeft: 15, marginTop: 15, color: '#303030' }}>
                        {L('step_one_tigrow')}
                      </Text>
                      <View style={styles.firstContainerImage}>
                        <Image style={styles.girl} source={require('../img/girl.png')} />
                        <Phone style={styles.phone} />
                      </View>
                    </View>
                  </View>
                  <View>
                    <View style={styles.firstContainer}>
                      <Text style={{ fontSize: 14, marginLeft: 15, marginTop: 15, color: '#303030' }}>
                        {L('step_two_tigrow')}
                      </Text>
                      <View style={styles.firstContainerImageSecond}>
                        <AppStore style={{ marginTop: 20, marginLeft: 90 }} />
                        <GooglePlay style={{ marginTop: 18, marginRight: 90 }} />
                      </View>
                    </View>
                  </View>
                  <View>
                    <View style={styles.firstContainer}>
                      <Text style={{ fontSize: 14, marginLeft: 15, marginTop: 15, marginBottom: 8, color: '#303030' }}>
                        {L('step_three_tigrow')}
                      </Text>
                      <View style={styles.firstContainerImageThirtd}>
                        <Image style={styles.iosTigrow} source={require('../img/iosTigrow.png')} />
                        <Tigrow style={styles.androidTigrow} />
                      </View>
                      <View style={styles.firstContainerImageThirtdText}>
                        <Text style={{ fontSize: 9, marginTop: -12, marginLeft: 40, marginBottom: 0 }}>
                          {' '}
                          <Text>iOS:</Text>
                          <Text style={{ fontWeight: 'bold', color: '#303030' }}>{L('ios_tigrow_name')}</Text>
                        </Text>
                        <Text style={{ fontSize: 9, marginTop: -12, marginLeft: 50, marginBottom: 0 }}>
                          <Text>Android:</Text>
                          <Text style={{ fontWeight: 'bold', color: '#303030' }}> {L('android_tigrow_name')}</Text>
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View>
                    <View style={styles.firstContainer}>
                      <Text style={{ fontSize: 14, marginLeft: 15, marginTop: 15, color: '#303030' }}>
                        {L('step_four_tigrow')}
                      </Text>
                      <TouchableOpacity onPress={this.onCodeClick}>
                        <Text style={styles.childcode}>
                          {this.state.code && this.state.codeStatus !== 'REDEEMED' && !phoneLinked ? (
                            <Text>{this.state.code}</Text>
                          ) : (
                            <MyActivityIndicator size="large" />
                          )}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <TouchableOpacity onPress={this.onChatWithTechSupport}>
                    <Text style={styles.contactsupport}> {L('contact_support_via_chat')}</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </Modal>
        </View>
        <Dialog isVisible={this.state.copiVisible} onTouchOutside={() => isModalVisible} style={styles.popup}>
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
        </Dialog>
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
  flexView: {
    flex: 1,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#fff',
    paddingTop: 12,
    paddingHorizontal: 12,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    minHeight: 800,
    marginTop: 0,
    paddingBottom: 20,
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  barIcon: {
    width: 60,
    height: 5,
    backgroundColor: '#bbb',
    borderRadius: 3,
  },
  girl: {
    marginTop: 0,
    marginLeft: 40,
    width: 180,
    height: 110,
  },
  phone: {
    marginTop: -35,
    marginRight: 10,
  },
  text: {
    color: '#303030',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  btnContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 500,
  },
  firstContainer: {
    margin: 0,
    width: '99%',
    marginLeft: 0,
    height: 143,
    borderRadius: 16,
    backgroundColor: 'rgba(254, 224, 213, 0.35)',
    marginTop: 20,
  },
  firstContainerImage: {
    display: 'flex',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  iosTigrow: {
    marginTop: 0,
    width: 51,
    height: 51,
    marginLeft: -10,
  },
  androidTigrow: {
    marginTop: 0,
    marginLeft: -30,
  },
  firstContainerImageSecond: {
    display: 'flex',
    justifyContent: 'space-around',
    flexDirection: 'row',
    paddingBottom: 20,
    width: '99%',
    marginLeft: 1,
    height: 150,
  },
  childcode: {
    fontSize: 41,
    color: '#FF4D77',
    fontWeight: '400',
    textAlign: 'center',
    padding: 20,
  },
  firstContainerImageThirtd: {
    display: 'flex',
    justifyContent: 'space-around',
    flexDirection: 'row',
    paddingBottom: 20,
    width: '100%',
    marginLeft: 0,
    height: 150,
  },
  firstContainerImageThirtdText: {
    display: 'flex',
    justifyContent: 'space-around',
    flexDirection: 'row',
    width: '88%',
    marginLeft: 0,
    marginTop: -76,
  },
  contactsupport: {
    fontSize: 14,
    color: '#606060',
    fontWeight: '400',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginBottom: 20,
    marginTop: 20,
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
});
export default connect(mapStateToProps, mapDispatchToProps)(DialogConnectChildBottomSheet);
